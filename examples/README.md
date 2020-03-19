## speechly-browser-client demo

This is a simple demo showcasing usage of browser client for Speechly API. The demo is a [create-react-app](https://github.com/facebook/create-react-app) project, with all unnecessary parts removed.

Running the demo is simple:

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

You can check out the code in [index.js](src/index.js) and the layout in [index.html](public/index.html).
