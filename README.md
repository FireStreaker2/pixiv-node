<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pixiv_logo.svg/270px-Pixiv_logo.svg.png" />
</div>

# About

pixiv-node is a simple JavaScript wrapper for [Pixiv](https://www.pixiv.net/), which sends requests to their backend API.

# Features

- Fully asynchronous
- Provides support for most read-only actions
- Doesn't require authentication for SFW content
- Provides a way of authenticating for features locked behind accounts
- Built with TypeScript for improved IDE support

# Installation

```bash
$ npm i pixiv-node
```

# Usage

## Methods

| Method            | Description                                                     | Authentication     |
| ----------------- | --------------------------------------------------------------- | ------------------ |
| get               | A private utility method used in all other methods              | N/A                |
| getIllust         | Get the data of an illustration/manga                           | No                 |
| getIllustComments | Get all the comments of a specific illustration/manga           | No                 |
| getIllustImage    | Get all the images associated with a illustration/manga         | If NSFW            |
| getNovel          | Get all the data associated with a novel                        | If NSFW            |
| getNovelComments  | Get all the comments of a specific novel                        | If NSFW            |
| getNovelSeries    | Get all novels inside of a series                               | If NSFW            |
| getUser           | Get info asociated with a specific user id                      | If using bookmarks |
| login             | Store your cookie in memory for authentication                  | N/A                |
| search            | Search for a specific query with additional optional parameters | If using `r18`     |

> Pixiv groups illustrations and manga together, which is why some of the methods aren't called `getIllustMangaX`

### Method parameters

```ts
// dist/index.d.ts

type NumericString = string | number;
export default class Pixiv {
	private static token;
	private static get;
	static getIllust(id: NumericString): Promise<Object>;
	static getIllustComments(
		id: NumericString,
		limit?: NumericString
	): Promise<Object>;
	static getIllustImages(id: NumericString): Promise<Object>;
	static getNovel(id: NumericString): Promise<Object>;
	static getNovelComments(
		id: NumericString,
		limit?: NumericString
	): Promise<Object>;
	static getNovelSeries(id: NumericString): Promise<Object>;
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
		type?: "top" | "illust_and_ugoira" | "manga" | "artworks" | "novels";
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
	// get 3 comments of a specific illustration or manga
	const comments = await Pixiv.getIllustComments(119640517, 3);

	// get all the data of a specific illustration or manga
	const illust = await Pixiv.getIllust(119640517);

	// get all images of a specific illustration or manga
	const images = await Pixiv.getIllustImages(119640517);

	// get a specific novel
	const novel = await Pixiv.getNovel(17814676);

	// advanced usage:
	// login with browser cookie, then search for all nsfw artwork
	// with the query "gawr gura" using descending order (oldest)
	// and allowing ai artwork
	const search = await Pixiv.login(process.env.TOKEN).search({
		query: "gawr gura",
		order: "date_d",
		mode: "r18",
		type: "illust_and_ugoira",
		ai: 1,
	});
})();
```

> For a more detailed example of how to use this library, you can refer to [pixiv-cli](https://github.com/FireStreaker2/pixiv-cli).

# Development

```bash
$ git clone https://github.com/FireStreaker2/pixiv-node.git
$ cd pixiv-node
$ npm i
$ npm run build
$ ./dist/index.js
```

# License

[MIT](https://github.com/FireStreaker2/pixiv-node/blob/main/LICENSE)
