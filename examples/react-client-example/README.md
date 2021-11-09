# react-client-example

[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This is a simple demo showcasing usage of [Speechly API](https://www.speechly.com/?utm_source=github&utm_medium=browser-client-example&utm_campaign=header). Speechly configuration for the app can be found in [speechly_config.sal](speechly_config.sal).

Built with:

- [speechly-react-client](https://github.com/speechly/react-client)
- [create-react-app](https://github.com/facebook/create-react-app).

Check it out at https://speechly.github.io/browser-client-example/.

## Development

```shell
# Install dependencies
npm install

# Configure your Speechly app ID
export REACT_APP_APP_ID="your-app-id"

# Configure your Speechly app language
export REACT_APP_LANGUAGE="your-app-language"

# Runs the demo in the development mode.
# Open http://localhost:3000 to view it in the browser.
#
# The page will reload if you make edits.
# You will also see any lint errors in the console.
npm start
```

You can check out the code in [App.js](src/App.js).

Note that we are using [rush](https://rush.js) and [pnpm](https://pnpm.io) so for anything more than a quick test,
please check the instructions in the [root level README](../../README.md#how-to-use-this-repository).

## About Speechly

Speechly is a developer tool for building real-time multimodal voice user interfaces. It enables developers and designers to enhance their current touch user interface with voice functionalities for better user experience. Speechly key features:

#### Speechly key features

- Fully streaming API
- Multi modal from the ground up
- Easy to configure for any use case
- Fast to integrate to any touch screen application
- Supports natural corrections such as "Show me red – i mean blue t-shirts"
- Real time visual feedback encourages users to go on with their voice

|                  Example application                  | Description                                                                                                                                                                                                                                                                                                                               |
| :---------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://i.imgur.com/v9o1JHf.gif" width=50%> | Instead of using buttons, input fields and dropdowns, Speechly enables users to interact with the application by using voice. <br />User gets real-time visual feedback on the form as they speak and are encouraged to go on. If there's an error, the user can either correct it by using traditional touch user interface or by voice. |
