# Speechly React Client Example

This is a simple demo showcasing usage of [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client).

Built with:

- [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client)
- [Create React App](https://github.com/facebook/create-react-app).

A working demo of this example can be found at https://speechly.github.io/react-example-repo-filtering/.

## Before you start

Create and deploy your own Speechly application, following [our quick start tutorial](https://docs.speechly.com/quick-start/).

Use the configuration from [speechly_config.sal](speechly_config.sal), remember to declare the entities and intents.

Copy the example app using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit speechly/speechly/examples/react-client-example my-app
cd my-app
```

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

To use your own **App ID** with this example, run the following prior to `npm start`:

```shell
# Configure your Speechly app ID
export REACT_APP_APP_ID="your-app-id"

# Configure your Speechly app language
export REACT_APP_LANGUAGE="your-app-language"
```

Note that this example is part of a monorepository that uses [rush](https://rush.js) and [pnpm](https://pnpm.io) as build tools. If you are interested in contributing, please check the instructions in the [root level README](../../README.md#how-to-use-this-rush-monorepository).
