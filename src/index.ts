import fetch from "node-fetch";

type NumericString = string | number;

export default class Pixiv {
	private static token: string;

	private static async get(
		url: string,
		type: "json" | "text" = "json"
	): Promise<Object> {
		const body: {
			headers?: {
				cookie?: string;
				"sec-ch-ua": string;
			};
		} = {
			headers: {
				"sec-ch-ua":
					'"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
			},
		};
		if (this.token) body.headers!.cookie = this.token;

		const response = await fetch(url, body);
		if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

		const data = (
			type === "json" ? await response.json() : await response.text()
		) as Object;

		return data;
	}

	static async getIllust(id: NumericString) {
		return await this.get(`https://www.pixiv.net/ajax/illust/${id}`);
	}

	static async getIllustComments(id: NumericString, limit?: NumericString) {
		return await this.get(
			`https://www.pixiv.net/ajax/illusts/comments/roots?illust_id=${id}${
				limit ? `&limit=${limit}` : ""
			}`
		);
	}

	static async getIllustImages(id: NumericString) {
		return await this.get(`https://www.pixiv.net/ajax/illust/${id}/pages`);
	}

	static async getNovel(id: NumericString) {
		const data = (await this.get(
			`https://www.pixiv.net/novel/show.php?id=${id}`,
			"text"
		)) as string;

		const regex =
			/<meta name="preload-data" id="meta-preload-data" content='.*'>/;
		const match = regex.exec(data);

		if (match)
			return JSON.parse(
				match[0].replace(
					/<meta name="preload-data" id="meta-preload-data" content='|'>/g,
					""
				)
			) as Object;
		else throw new Error("Novel data not found!");
	}

	static async getNovelComments(id: NumericString, limit?: NumericString) {
		return await this.get(
			`https://www.pixiv.net/ajax/novels/comments/roots?novel_id=${id}${
				limit ? `&limit=${limit}` : ""
			}`
		);
	}

	static async getNovelSeries(id: NumericString) {
		return await this.get(
			`https://www.pixiv.net/ajax/novel/series/${id}/content_titles`
		);
	}

	static async getUser(
		id: NumericString,
		option: "all" | "top" | "bookmarks/illusts" | "bookmarks/novels",
		limit?: NumericString
	) {
		if (option.includes("bookmarks") && !limit)
			throw new Error(`Limit is required for option "${option}"`);

		if (option.includes("bookmarks") && !this.token)
			throw new Error("You must be authenticated to see bookmarks!");

		const options = {
			all: `https://www.pixiv.net/ajax/user/${id}/profile/all`,
			top: `https://www.pixiv.net/ajax/user/${id}/profile/top`,
			"bookmarks/illusts": `https://www.pixiv.net/ajax/user/${id}/illusts/bookmarks?tag=&offset=0&limit=${limit}&rest=show`,
			"bookmarks/novels": `https://www.pixiv.net/ajax/user/${id}/novels/bookmarks?tag=&offset=0&limit=${limit}&rest=show`,
		};

		return await this.get(options[option]);
	}

	static login(token: string) {
		this.token = token;

		return this;
	}

	static async search({
		query,
		order,
		mode,
		type,
		ai,
	}: {
		query: string;
		order?: "date" | "date_d";
		mode?: "all" | "safe" | "r18";
		type?: "top" | "illust_and_ugoira" | "manga" | "artworks" | "novels";
		ai?: 0 | 1;
	}) {
		if (mode == "r18" && !this.token)
			throw new Error("You must be authenticated to see NSFW content!");

		return await this.get(
			`https://www.pixiv.net/ajax/search/${
				type === "illust_and_ugoira" ? "illustrations" : type
			}/${query}?${new URLSearchParams({
				word: query,
				...(order && { order }),
				...(mode && { mode }),
				...(type && { type }),
				...(ai !== undefined && { ai_type: ai.toString() }),
			}).toString()}`
		);
	}
}
