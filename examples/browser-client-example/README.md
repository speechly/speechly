# browser-client-example

![Deploy](https://github.com/speechly/browser-client-example/workflows/Deploy/badge.svg?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This is a simple demo showcasing usage of [Speechly API](https://www.speechly.com/?utm_source=github&utm_medium=browser-client-example&utm_campaign=header). Speechly configuration for the app can be found in [speechly_config.sal](speechly_config.sal).

Built with:

- [speechly-browser-client](https://github.com/speechly/browser-client)
- [TypeScript](https://www.typescriptlang.org)
- [create-react-app](https://github.com/facebook/create-react-app).

A working demo of this example can be found here: https://speechly.github.io/browser-client-example/ 

## Run it locally

```shell
# Install dependencies
npm install

# Runs the demo in the development mode.
# Open http://localhost:3000 to view it in the browser.
#
# The page will reload if you make edits.
# You will also see any lint errors in the console.
npm start
```

You can check out the code in [index.ts](src/index.ts) and the layout in [index.html](public/index.html).

To use your own appId with this example, run the following prior to `npm start`:
```shell
# Configure your Speechly app ID
export REACT_APP_APP_ID="your-app-id"

# Configure your Speechly app language
export REACT_APP_LANGUAGE="your-app-language"

# OPTIONAL Configure your Speechly app timezone for Date entities. By default using the timezone of the browser.
export REACT_APP_TIMEZONE="your-app-timezone"
```
For instructions on how to get started on the Speechly free tier and obtain your appId, please see the [Quick Start Guide](https://docs.speechly.com/quick-start).

Note that this example is part of a monorepository that uses [rush](https://rush.js) and [pnpm](https://pnpm.io) as build tools. If you are interested in contributing, please check the instructions in the [root level README](../../README.md#how-to-use-this-repository).
