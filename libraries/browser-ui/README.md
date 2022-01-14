<div align="center" markdown="1">
<a href="https://www.speechly.com/#gh-light-mode-only">
   <img src="https://d33wubrfki0l68.cloudfront.net/f15fc952956e1952d6bd23661b7a7ee6b775faaa/c1b30/img/speechly-logo-duo-black.svg" height="48" />
</a>
<a href="https://www.speechly.com/#gh-dark-mode-only">
   <img src="https://d33wubrfki0l68.cloudfront.net/5622420d87a4aad61e39418e6be5024c56d4cd1d/94452/img/speechly-logo-duo-white.svg" height="48" />
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

Speechly UI components provide the visual interface to support voice functionality. This package contains Speechly UI as Web Components that can be used in most browsers via CDN or npm.

## Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1)

### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Svelte 3](https://svelte.dev/)
* [Speechly Browser Client](https://www.npmjs.com/package/@speechly/browser-client) that provides websocket connectivity and audio handling for Push-To-Talk Button component


## Using Web Components provided by browser-ui from a CDN on a web page/app

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

## Using browser-ui in React


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

## Learn more

- For integrating Speechly to your app, please refer to the [Client libraries](https://docs.speechly.com/client-libraries/usage/) documentation.
- Speechly [UI components](https://docs.speechly.com/client-libraries/ui-components/).
