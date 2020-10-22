<h1 align="center">
<a href="https://www.speechly.com/"><img src="https://www.speechly.com/images/logo.png" height="100" alt="Speechly"></a>
</h1>
<h2 align="center">
Complete your touch user interface with voice
</h2>

[Speechly website](https://www.speechly.com/?utm_source=github&utm_medium=browser-clien-examplet&utm_campaign=header)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Docs](https://www.speechly.com/docs/?utm_source=github&utm_medium=browser-client-example&utm_campaign=header)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=browser-client-example&utm_campaign=header)

# browser-client-example

![Deploy](https://github.com/speechly/browser-client-example/workflows/Deploy/badge.svg?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This is a simple demo showcasing usage of [Speechly API](https://www.speechly.com/). Speechly configuration for the app can be found in [speechly_config.sal](speechly_config.sal).

Built with:

- [speechly-browser-client](https://github.com/speechly/browser-client)
- [TypeScript](https://www.typescriptlang.org)
- [create-react-app](https://github.com/facebook/create-react-app).

Check it out at https://speechly.github.io/browser-client-example/.

## About Speechly

Speechly is a developer tool for building real-time multimodal voice user interfaces. It enables developers and designers to enhance their current touch user interface with voice functionalities for better user experience. Speechly key features:

#### Speechly key features

- Fully streaming API
- Multi modal from the ground up
- Easy to configure for any use case
- Fast to integrate to any touch screen application
- Supports natural corrections such as "Show me red – i mean blue t-shirts"
- Real time visual feedback encourages users to go on with their voice

| Example application | Description |
| :---: | --- |
| <img src="https://i.imgur.com/v9o1JHf.gif" width=50%> | Instead of using buttons, input fields and dropdowns, Speechly enables users to interact with the application by using voice. <br />User gets real-time visual feedback on the form as they speak and are encouraged to go on. If there's an error, the user can either correct it by using traditional touch user interface or by voice. |

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
