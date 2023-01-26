<div align="center" markdown="1">
<br/>

![speechly-logo-duo-black](https://user-images.githubusercontent.com/2579244/193574443-130d16d6-76f1-4401-90f2-0ed753b39bc0.svg)

[Website](https://www.speechly.com/)
&ensp;&middot;&ensp;
[Docs](https://docs.speechly.com/)
&ensp;&middot;&ensp;
[Support](https://github.com/speechly/speechly/discussions)
&ensp;&middot;&ensp;
[Blog](https://www.speechly.com/blog/)
&ensp;&middot;&ensp;
[Login](https://api.speechly.com/dashboard/)

<br/>
</div>

# Speechly Browser UI Components

![build](https://img.shields.io/github/actions/workflow/status/speechly/speechly/build.yaml?branch=main&logo=github)
[![npm](https://img.shields.io/npm/v/@speechly/browser-ui?color=cb3837&logo=npm)](https://www.npmjs.com/package/@speechly/browser-ui)
[![license](http://img.shields.io/:license-mit-blue.svg)](/LICENSE)

Ready made Speechly [UI components](https://docs.speechly.com/client-libraries/ui-components/) to build a reactive voice interface to a web site or app. See these CodePens for a preview:

- [Speech-to-text CodePen](https://codepen.io/speechly/pen/VwzoMrW)
- [Sneaker Shop CodePen](https://codepen.io/speechly/pen/dyzxVzv)

If you want to build a custom interface for you web app, you may want to check out [browser-client](https://github.com/speechly/speechly/tree/main/libraries/browser-client) ([npm](https://www.npmjs.com/package/@speechly/browser-client)) for direct access to Speechly API.

## Introduction to components

- [Push-To-Talk Button](https://docs.speechly.com/ui-components/push-to-talk-button/) provides a button to control listening on/off. It comes integrated with [browser-client](https://github.com/speechly/speechly/tree/main/libraries/browser-client).
- [Big Transcript](https://docs.speechly.com/ui-components/big-transcript/) is an overlay-style component that displays real-time speech-to-text transcript and feedback to the user. Recognized entities are highlighted.
- [Transcript Drawer](https://docs.speechly.com/ui-components/big-transcript/) is an alternative to Big Transcript that slides down from the top of the viewport. It displays usage hints along with the real-time speech-to-text transcript and feedback.
- [Intro Popup](https://docs.speechly.com/ui-components/intro-popup/) provides a customizable introduction to voice features, guides the user through browser mic permission setup and helps recover from common problems.

## Documentation

- [UI component gallery and API](https://docs.speechly.com/ui-components/)
- [Basic Speechly usage](https://docs.speechly.com/client-libraries/usage/)

## Browser usage

Include the Web Components from a CDN that mirrors [`@speechly/browser-ui`](https://www.npmjs.com/package/@speechly/browser-ui) npm package. The script tags register `push-to-talk-button`, `big-transcript` and `intro-popup` with the browser's customElement registry so you can use them like regular tags.

```
<head>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/push-to-talk-button.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/big-transcript.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/intro-popup.js"></script>
</head>

<body>
  <big-transcript
    placement="top">
  </big-transcript>
  <push-to-talk-button
    placement="bottom"
    appid="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD">
  </push-to-talk-button>
  <intro-popup>
    <span slot="priming-body">You'll be able to control this web app faster with voice.</span>
  </intro-popup>
</body>
```

## Node Usage

> This example illustrates using browser-ui Web Components with a JS framework. For React development, [react-client](../react-client) and [react-ui](../react-ui) libraries offer a better developer experience.

```
npm i @speechly/browser-ui
```

In App.js:
```
import "@speechly/browser-ui/core/push-to-talk-button";
import "@speechly/browser-ui/core/big-transcript";
import "@speechly/browser-ui/core/intro-popup";

...

<big-transcript placement="top"></big-transcript>
<push-to-talk-button placement="bottom" appid="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD"></push-to-talk-button>
<intro-popup></intro-popup>
```

## Building and developing

The build steps are needed if you want to contibute to the development of the components or need to fork them for customization.

### Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1+)

### Built with

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
# Build dependencies
rush build --to-except browser-ui
# Compile the library, serve the testbench pages and watch changes 
rushx dev
```

Open http://localhost:5000 or http://localhost:5000/extras to see the components on testbench pages.

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

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).
