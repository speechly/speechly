# react-client-example

This is a simple demo showcasing usage of [Speechly API](https://www.speechly.com/?utm_source=github&utm_medium=browser-client-example&utm_campaign=header). Speechly configuration for the app can be found in [speechly_config.sal](speechly_config.sal).

Built with:

- [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client)
- [Create React App](https://github.com/facebook/create-react-app).

Check it out at https://speechly.github.io/react-example-repo-filtering/.

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

You can check out the code in [App.js](src/App.js).

To use your own appId with this example, run the following prior to `npm start`:

```shell
# Configure your Speechly app ID
export REACT_APP_APP_ID="your-app-id"

# Configure your Speechly app language
export REACT_APP_LANGUAGE="your-app-language"
```

For instructions on how to get started on the Speechly free tier and obtain your appId, please see the [Quick Start Guide](https://docs.speechly.com/quick-start).

Note that this example is part of a monorepository that uses [rush](https://rush.js) and [pnpm](https://pnpm.io) as build tools. If you are interested in contributing, please check the instructions in the [root level README](../../README.md#how-to-use-this-repository).
