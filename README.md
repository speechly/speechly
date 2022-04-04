<div align="center" markdown="1">
<a href="https://www.speechly.com/#gh-light-mode-only">
   <img src="https://d33wubrfki0l68.cloudfront.net/f15fc952956e1952d6bd23661b7a7ee6b775faaa/c1b30/img/speechly-logo-duo-black.svg" height="48" />
</a>
<a href="https://www.speechly.com/#gh-dark-mode-only">
   <img src="https://d33wubrfki0l68.cloudfront.net/5622420d87a4aad61e39418e6be5024c56d4cd1d/94452/img/speechly-logo-duo-white.svg" height="48" />
</a>

### Real-time automatic speech recognition and natural language understanding tools in one flexible API

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

Speechly monorepository contains Speechly's web related [libraries](#libraries), [demos](#demos) and [example apps](#examples).

## Libraries

Speechly client libraries provide the natural Spoken Language Understanding API for web applications. They handle audio capturing and streaming, authentication, and network connection to Speechly cloud API.

Speechly UI libraries provide UI components to support building a voice-enabled, multimodal apps.

| Folder | Version | npm package | Description |
| ------ | ------- |------- | ------- |
| [/libraries/browser-client](/libraries/browser-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)| [@speechly/browser-client](https://www.npmjs.com/package/@speechly/browser-client) | JavaScript API for natural spoken language understanding. |
| [/libraries/react-client](/libraries/react-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-client.svg)](https://badge.fury.io/js/%40speechly%2Freact-client) | [@speechly/react-client](https://www.npmjs.com/package/@speechly/react-client) | React API for natural spoken language understanding. |
| [/libraries/browser-ui](/libraries/browser-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-ui.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-ui) | [@speechly/browser-ui](https://www.npmjs.com/package/@speechly/browser-ui) | Web components for controlling listening and showing speech-to-text transcription. |
| [/libraries/react-ui](/libraries/react-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-ui.svg)](https://badge.fury.io/js/%40speechly%2Freact-ui) | [@speechly/react-ui](https://www.npmjs.com/package/@speechly/react-ui) | React components for controlling listening and showing speech-to-text transcription. |
| [/libraries/react-voice-forms](/libraries/react-voice-forms) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-voice-forms.svg)](https://badge.fury.io/js/%40speechly%2Freact-voice-forms) | [@speechly/react-voice-forms](https://www.npmjs.com/package/@speechly/react-voice-forms) | React form components with built-in support for voice and multi-modal input. |

## Demos

This monorepository contains the source code of Speechly demos available at [https://demos.speechly.com](https://demos.speechly.com). They are built using React and Speechly's `react-client`, `react-ui` and `react-voice-forms` libraries. Each of the demo subfolder is a stand-alone node project. See the demos' subfolders for more information.

| Folder | Description |
| ------ | ------- |
| [/demos/moderation](/demos/moderation) | [Moderation](https://demos.speechly.com/moderation) demonstrates how to use Speechly for profanity moderation and highlights Speechly’s timestamp feature. |
| [/demos/voice-search](/demos/voice-search) | [Voice Search](https://demos.speechly.com/voice-search) demonstrates how to use Speechly and Google Custom Search API to create a voice-enabled search enginge. |
| [/demos/speech-to-text](/demos/speech-to-text) | [Speech-to-Text](https://demos.speechly.com/speech-to-text) app demonstrates Speechly API's automatic speech recognition (ASR). |
| [/demos/smart-home](/demos/smart-home) | [Smart Home](https://smarthome.speechly.com) app demonstrates updating GUI in real-time by reacting to  intents and entities provided by Speechly API's streaming Natural Language Understanding (NLU). |
| [/demos/flight-booking](/demos/flight-booking) | [Flight Booking](https://demos.speechly.com/booking) app demonstrates use of [`react-voice-forms`](./libraries/react-voice-forms) library to create a voice-enabled interface with text input field, dropdown and checkbox components. |
| [/demos/fashion-ecommerce](/demos/fashion-ecommerce) | [Fashion Store](https://fashion.speechly.com) app demonstrates browsing a large inventory of goods using with voice-enabled category filters. |

## Examples

Example applications can be used to validate correct behaviour of client and UI libraries. They may come handy as learning tools as well.

| Folder | Description |
| ------ | ------- |
| [/examples/browser-client-example](/examples/browser-client-example) | A simple example application built with [browser-client](https://www.npmjs.com/package/@speechly/browser-client) |
| [/examples/react-client-example](/examples/react-client-example) | A simple example application built with [react-client](https://www.npmjs.com/package/@speechly/react-client) |
| [/examples/react-ui-example](/examples/react-ui-example) | An example showcasing UI components in React. |

## Templates

Collection of simple React templates for [Speechly](https://www.speechly.com/) applications. Templates provide a starting point for any application. They can be expanded further to build more complex applications.

| Folder | Description |
| ------ | ------- |
| [/templates/empty](/templates/empty) | This template is a blank canvas. Useful for speech-to-text applications, like text entry and note taking. |
| [/templates/product-filtering](/templates/product-filtering) | This template provides a starting point for creating a product filtering experience. |
| [/templates/contact-form](/templates/contact-form) | This template provides a starting point for creating a contact form that can be interacted with using voice. |
| [/templates/command-control](/templates/command-control) | This template shows how to use Speechly for command-and-control. Useful for things like navigation and finding information on a site. |

## How to get help?

For general discussion or questions, please use our [GitHub Discussion forum](https://github.com/speechly/speechly/discussions).

For feature requests or bug reports, please file a [GitHub Issue](https://github.com/speechly/speechly/issues).

## Contributing

We are happy to receive community contributions! For small fixes, feel free to file a pull request. For bigger changes or new features start by filing an issue.

## How to use this Rush monorepository

This monorepository is set up using [rushjs](https://rushjs.io). Rush can be used to build all projects and libraries in one go. It also helps with develop and test features that span multiple libraries and/or projects.

Each project and library is a stand-alone node project that can be built and devoped with npm or [pnpm](https://pnpm.io). To run a single examples or demos, just follow the instructions in the project's README.

### To build all projects using Rush, run
```
npm install -g @microsoft/rush
npm install -g pnpm
rush update
rush build
```
This will build everything in the repository – This may take a while! After this step, you can run any example or demo by navigating to the corresponding folder (e.g. `examples/browser-client-example`) and running
```
rushx start
```
Before doing a PR, remember to create a changelog entry with

```
rush change -b origin/main
```

## Learn more
- [Quick Start Guide](https://docs.speechly.com/quick-start/) – Get started on developing with Speechly for the web
- [Developer Documentation](https://docs.speechly.com/) – Browse the latest developer documentation, including tutorials, sample code and API reference
- [Speechly Demos](https://www.speechly.com/demos/) – Get inspired and see what you can build with Speechly
- [Speechly Dashboard](https://www.speechly.com/dashboard) – Where you create, configure and deploy your Speechly applications

## Related repositories
- [Android Client Library](https://github.com/speechly/android-client)
- [iOS Client Library](https://github.com/speechly/ios-client)
- [Speechly API gRPC protos and pre-compiled stubs](https://github.com/speechly/api)
