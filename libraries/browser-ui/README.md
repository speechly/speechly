<div align="center" markdown="1">
<a href="https://www.speechly.com">
   <img src="https://d33wubrfki0l68.cloudfront.net/f15fc952956e1952d6bd23661b7a7ee6b775faaa/c1b30/img/speechly-logo-duo-black.svg" height="48" />
</a>

### The Fast, Accurate, and Simple Voice Interface API

[Website](https://www.speechly.com/)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

# Speechly Browser UI components

Ready made Speechly [UI components](https://docs.speechly.com/client-libraries/ui-components/) to build a reactive voice interface to a web site or app.

- [Speech-to-text CodePen](https://codepen.io/speechly/pen/VwzoMrW)
- [Sneaker Shop CodePen](https://codepen.io/speechly/pen/dyzxVzv)

> If you want to build a custom interface for you web app, you may want to check out [browser-client](https://github.com/speechly/speechly/tree/main/libraries/browser-client) ([npm](https://www.npmjs.com/package/@speechly/browser-client)) for direct access to Speechly API.

## Documentation

- [Basic usage documentation](https://docs.speechly.com/client-libraries/usage/)
- [UI component gallery and API](https://docs.speechly.com/client-libraries/ui-components/)

## Browser Usage

Include the Web Components from a CDN that mirrors [`@speechly/browser-ui`](https://www.npmjs.com/package/@speechly/browser-ui) npm package. The script tags register `push-to-talk-button`, `big-transcript` and `error-panel` with the browser's customElement registry so you can use them like regular tags.

```
<head>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/push-to-talk-button.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/big-transcript.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/error-panel.js"></script>
</head>

<body>
   <big-transcript placement="top"></big-transcript>
   <push-to-talk-button placement="bottom" appid="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD"></push-to-talk-button>
   <error-panel placement="bottom"></error-panel>
</body>
```

> Push-to-talk button component comes with built-in [browser-client](https://github.com/speechly/speechly/tree/main/libraries/browser-client) so you don't need to include it separately.

## Node Usage

> This example illustrates using browser-ui Web Components with a JS framework. For actual React development, you'll probably want to use [react-client](../react-client) and [react-ui](../react-ui) libraries for a better developer experience.

```
npm i @speechly/browser-ui
```

In App.js:
```
import "@speechly/browser-ui/core/push-to-talk-button";
import "@speechly/browser-ui/core/big-transcript";
import "@speechly/browser-ui/core/error-panel";

...

<big-transcript placement="top"></big-transcript>
<push-to-talk-button placement="bottom" appid="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD"></push-to-talk-button>
<error-panel placement="bottom"></error-panel>
```

## Building and developing

The build steps are needed if you want to contibute to the development of the components or need to fork them for customization.

### Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1+)

### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Rush](https://rushjs.io/) We use Rush to build the dependencies from the monorepository.
* [Svelte 3](https://svelte.dev/)
* [Speechly browser-client](https://www.npmjs.com/package/@speechly/browser-client) that provides websocket connectivity and audio handling for Push-To-Talk Button component

### Install Rush (one-time only)

```
npm install -g @microsoft/rush
```

### Running the development build

```
rush update
rush build --to-except browser-ui
# Run the library in watch mode. Open http://localhost:5000 to see the testbench page.
rushx dev
```

### Building for production

```
rush update
rush build --to browser-ui
# Check build artefacts
ls core/
```

## Learn more

- [browser-client](https://github.com/speechly/speechly/tree/main/libraries/browser-client) library for direct access to Speechly API
- [react-client](https://github.com/speechly/speechly/tree/main/libraries/react-client) library for direct access to Speechly API
- [react-ui](https://github.com/speechly/speechly/tree/main/libraries/react-ui) ready made components for building reactive voice interfaces
- [More integration options](https://docs.speechly.com/dev-tools/overview/) in Speechly docs
- [Speechly Dashboard](https://api.speechly.com/dashboard/) for creating and configuring a Speechly app id.
- [docs.speechly.com](https://docs.speechly.com)
- [speechly.com](https://speechly.com) 
