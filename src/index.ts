import fetch from "node-fetch";

class Pixiv {
	private static async get(url: string): Promise<Object> {
		const response = await fetch(url);
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

	static async getPost(id: string | number) {
		return await this.get(`https://www.pixiv.net/ajax/illust/${id}`);
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
		return await this.get(
			`https://www.pixiv.net/ajax/search/artworks/${query}?word=${query}&order=${order}&mode=${mode}&type=${type}&ai_type=${ai}`
		);
	}
}

export default Pixiv;
