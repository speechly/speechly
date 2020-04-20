# browser-client-example

![Deploy](https://github.com/speechly/browser-client-example/workflows/Deploy/badge.svg?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This is a simple demo showcasing usage of Speechly API. Speechly configuration for the app can be found in [speechly_config.sal](speechly_config.sal).

Built with:

- [speechly-browser-client](https://github.com/speechly/browser-client)
- [TypeScript](https://www.typescriptlang.org)
- [create-react-app](https://github.com/facebook/create-react-app).

Check it out at https://speechly.github.io/browser-client-example/.

## Development

```shell
# Install dependencies
yarn install

# Configure your Speechly app ID
export REACT_APP_APP_ID="your-app-id"

# Configure your Speechly app language
export REACT_APP_LANGUAGE="your-app-language"

# Runs the demo in the development mode.
# Open http://localhost:3000 to view it in the browser.
#
# The page will reload if you make edits.
# You will also see any lint errors in the console.
yarn start
```

You can check out the code in [index.ts](src/index.ts) and the layout in [index.html](public/index.html).

## Screenshot

![Screenshot](screenshot.png)
