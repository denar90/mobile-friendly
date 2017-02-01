# Mobile-Friendly Test API for Node.js

> Test how easily a visitor can use your page on a mobile device. Just enter a page URL to see how your page scores.

CLI tool and lib to gather results about mobile friendly site using [Mobile-Friendly Test API](https://search.google.com/search-console/mobile-friendly) _IN BETA_.

### Install
```sh
$ npm install --global mbfriendly
# or
$ npm install --save mbfriendly
```

### CLI Usage

```sh

mbfriendly http://example.com/

# --apiKey       Google API key. You don't need to specifiy this option if it's already in process.env.API_KEY
mbfriendly http://example.com/ --apiKey=my_api_key

# --json       Reports json details to stdout.
mbfriendly http://example.com/ --json

# returns... 
# {
#   "testStatus": {
#     "status": "MOBILE_FRIENDLY"
#   }
# }
#  ...


# --requestScreenshot       Request for site screenshot
mbfriendly http://example.com/ --requestScreenshot

```

Read more about [Mobile-Friendly Test API](https://developers.google.com/webmaster-tools/search-console-api/reference/rest/v1/urlTestingTools.mobileFriendlyTest/run)

### API

```js
const MobileFriendly = require('mobile-friendly');

const mobileFriendly = new MobileFriendly('http://example.com/', opts);
mobileFriendly.run(); // returns Promise

```

### License

MIT © [Artem Denysov](https://github.com/denar90)