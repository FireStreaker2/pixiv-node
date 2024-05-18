<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pixiv_logo.svg/270px-Pixiv_logo.svg.png" />
</div>

# About

pixiv-node is a simple JavaScript wrapper for [pixiv](https://www.pixiv.net/), which sends requests to their backend API.

# Features

- Fully asynchronous
- Provides support for most read-only actions
- Doesn't require authentication for SFW works
- Provides a way of authenticating for features locked behind accounts

# Installation

```bash
$ npm i pixiv-node
```

# Usage

## Methods

| Method            | Description                                                     | Authentication  |
| ----------------- | --------------------------------------------------------------- | --------------- |
| get               | A private utility method used in all other methods              | N/A             |
| getIllustComments | Get all the comments of a specific illustration/manga           | No              |
| getImages         | Get all the images associated with a post                       | If NSFW         |
| getNovel          | Get all the data associated with a novel                        | If NSFW         |
| getNovelComments  | Get all the comments of a specific novel                        | If NSFW         |
| getNovelSeries    | Get all novels inside of a series                               | If NSFW (title) |
| getPost           | Get the data of a specific post                                 | No              |
| getUser           | Get info asociated with a specific user id                      | If bookmarks    |
| login             | Store your cookie in memory for authentication                  | N/A             |
| search            | Search for a specific query with additional optional parameters | If using `r18`  |

### Method parameters

```ts
// dist/index.d.ts

type NumericString = string | number;
export default class Pixiv {
	private static token;
	private static get;
	static getIllustComments(
		id: NumericString,
		limit?: NumericString
	): Promise<Object>;
	static getImages(id: NumericString): Promise<Object>;
	static getNovel(id: NumericString): Promise<Object>;
	static getNovelSeries(id: NumericString): Promise<Object>;
	static getNovelComments(
		id: NumericString,
		limit?: NumericString
	): Promise<Object>;
	static getPost(id: NumericString): Promise<Object>;
	static getUser(
		id: NumericString,
		option: "all" | "top" | "bookmarks/illusts" | "bookmarks/novels",
		limit?: NumericString
	): Promise<Object>;
	static login(token: string): typeof Pixiv;
	static search({
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
	}): Promise<Object>;
}
export {};
```

## Authentication

If you would like to authenticate in order to access account restricted features (NSFW content, bookmarks), then you can pass in part of your browser cookie to the `login()` method before calling any other methods. It should look something like the following:

```ts
const token = "PHPSESSID=xxxxxxx_xxxxxxxxxxxxxxxxx";
```

In order to access this, you can follow these steps:

1. Log into pixiv
2. Open up your browser developer tools
3. Visit a post
4. Go to the networks tab in developer tools and search for `https://www.pixiv.net/ajax/illusts`
5. Click on the corresponding GET request and scroll down to the first `Cookie:` section
6. Copy the part of the cookie that has `PHPSESSID=`

# Example

```ts
import Pixiv from "pixiv-node";

(async () => {
	// get 3 comments of a specific post
	console.log(JSON.stringify(await Pixiv.getComments(119640517, 3)));

	// get all the data of a specific post
	console.log(JSON.stringify(await Pixiv.getPost(119640517)));

	// get all images of a specific post
	console.log(JSON.stringify(await Pixiv.getImages(119640517)));

	// get a specific novel
	console.log(JSON.stringify(await Pixiv.getNovel(17814676)));

	// login with browser cookie, then search for all nsfw artwork
	// with the query "gawr gura" using descending order (oldest)
	// and allowing ai artwork
	console.log(
		JSON.stringify(
			await Pixiv.login(process.env.TOKEN).search({
				query: "gawr gura",
				order: "date_d",
				mode: "r18",
				type: "all",
				ai: 1,
			})
		)
	);
})();
```

> For a more detailed example of how to use this library, you can refer to [pixiv-cli](https://github.com/FireStreaker2/pixiv-cli).

# Development

```bash
$ git clone https://github.com/FireStreaker2/pixiv-node.git
$ cd pixiv-node
$ npm i
$ npm run build
```

# License

[MIT](https://github.com/FireStreaker2/pixiv-node/blob/main/LICENSE)
