import fetch from "node-fetch";

class Pixiv {
	private static token: string;

	private static async get(url: string): Promise<Object> {
		const body: {
			headers?: {
				cookie: string;
			};
		} = {};
		if (this.token) body.headers = { cookie: this.token };

		const response = await fetch(url, body);
		if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
		const data = (await response.json()) as Object;

		return data;
	}

	static async getComments(id: string | number, limit?: string | number) {
		return await this.get(
			`https://www.pixiv.net/ajax/illusts/comments/roots?illust_id=${id}${
				limit ? `&limit=${limit}` : ""
			}`
		);
	}

	static async getImages(id: string | number) {
		return await this.get(`https://www.pixiv.net/ajax/illust/${id}/pages`);
	}

	static async getPost(id: string | number) {
		return await this.get(`https://www.pixiv.net/ajax/illust/${id}`);
	}

	static async getUser(
		id: string | number,
		option: "all" | "top" | "bookmarks/illusts" | "bookmarks/novels",
		limit?: string | number
	) {
		if (option.includes("bookmarks") && limit === undefined)
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
		type?: "all" | "illust_and_ugoira" | "manga";
		ai?: 0 | 1;
	}) {
		if (mode == "r18" && !this.token)
			throw new Error("You must be authenticated to see NSFW content!");

		return await this.get(
			`https://www.pixiv.net/ajax/search/artworks/${query}?${new URLSearchParams(
				{
					word: query,
					...(order && { order }),
					...(mode && { mode }),
					...(type && { type }),
					...(ai !== undefined && { ai_type: ai.toString() }),
				}
			).toString()}`
		);
	}
}

export default Pixiv;
