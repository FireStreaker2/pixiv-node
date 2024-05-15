<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pixiv_logo.svg/270px-Pixiv_logo.svg.png" />
</div>

# About
pixiv-node is a simple JavaScript wrapper for [pixiv](https://www.pixiv.net/), which sends requests to their backend API.

# Features
* Fully asynchronous
* Provides support for most read-only actions
* Doesn't require authentication

# Installation
```bash
$ npm i pixiv-node
```

# Usage
| Method      | Description                                                     |
|-------------|-----------------------------------------------------------------|
| get         | A private utility method used in all other methods              |
| getComments | Get all the comments of a specific post                         |
| getPost     | Get the data of a specific post                                 |
| search      | Search for a specific query with additional optional parameters |

# Examples
```ts
import Pixiv from "pixiv-node";

(async () => {
	// get 3 comments of a specific post
	console.log(JSON.stringify(await Pixiv.getComments(119640517, 3)));

	// get all the data of a specific post
	console.log(JSON.stringify(await Pixiv.getPost(119640517)));

	// search for all nsfw artwork with the query "gawr gura" using descending order (oldest) and allowing ai artwork
	console.log(
		JSON.stringify(
			await Pixiv.search({
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

# License
[MIT](https://github.com/FireStreaker2/pixiv-node/blob/main/LICENSE)