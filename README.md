<div align="center" markdown="1">
<a href="https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header">
   <img src="https://d33wubrfki0l68.cloudfront.net/1e70457a60b0627de6ab966f1e0a40cf56f465f5/b4144/img/logo-speechly-colors.svg" height="48">
</a>

### Speechly is the Fast, Accurate, and Simple Voice Interface API for Web, Mobile and E‑commerce

[Website](https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

Speechly monorepository contains Speechly's web related [libraries](#libraries), [demos](#demos) and [example apps](#examples).

## Libraries

Speechly client libraries provide the natural spoken language understanding API for web applications. They handle audio capturing and streaming, authentication, and network connection to Speechly cloud API.

Speechly UI libraries provide UI components to support building a voice-enabled, multimodal apps.

| Folder | Version | npm package | Description |
| ------ | ------- |------- | ------- |
| [/libraries/browser-client](/libraries/browser-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)| [@speechly/browser-client](https://www.npmjs.com/package/@speechly/browser-client) | JavaScript API for natural spoken language understanding. |
| [/libraries/react-client](/libraries/react-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-client.svg)](https://badge.fury.io/js/%40speechly%2Freact-client) | [@speechly/react-client](https://www.npmjs.com/package/@speechly/react-client) | React API for natural spoken language understanding. |
| [/libraries/browser-ui](/libraries/browser-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-ui.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-ui) | [@speechly/browser-ui](https://www.npmjs.com/package/@speechly/browser-ui) | Web components for controlling listening and showing speech-to-text transcription. |
| [/libraries/react-ui](/libraries/react-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-ui.svg)](https://badge.fury.io/js/%40speechly%2Freact-ui) | [@speechly/react-ui](https://www.npmjs.com/package/@speechly/react-ui) | React components for controlling listening and showing speech-to-text transcription. |
| [/libraries/react-voice-forms](/libraries/react-voice-forms) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-voice-forms.svg)](https://badge.fury.io/js/%40speechly%2Freact-voice-forms) | [@speechly/react-voice-forms](https://www.npmjs.com/package/@speechly/react-voice-forms) | React form components with built-in support for voice and multi-modal input. |

## Demos

This monorepository contains the source code of Speechly demos available at [https://demos.speechly.com](https://demos.speechly.com). They are built using React and Speechly's `react-client`, `react-ui` and `react-voice-forms` libraries. Each of the demos is a stand-alone node project. See the demos' subfolders for more information.

| Folder | Description |
| ------ | ------- |
| [/demos/flight-booking](/demos/flight-booking) | [Flight Booking Demo](https://speechly-demos.herokuapp.com/flight-booking) |
| [/demos/fashion-ecommerce](/demos/fashion-ecommerce) | [Fashion Store Demo](https://fashion.speechly.com) |
| [/demos/smart-home](/demos/smart-home) | [Smart Home Demo](https://smarthome.speechly.com) |
| [/demos/ecommerce-checkout](/demos/ecommerce-checkout) | [Ecommerce Checkout Demo](https://speechly-demos.herokuapp.com/ecommerce-checkout) |
| [/demos/speech-to-text](/demos/speech-to-text) | [Speech to Text Demo](https://speechly-demos.herokuapp.com/speech-to-text) 

## Examples

Example applications can be used to validate correct behaviour of client and UI libraries. They may come handy as learning tools as well.

| Folder | Description |
| ------ | ------- |
| [/examples/browser-client-example](/examples/browser-client-example) | A simple example application built with [browser-client](https://www.npmjs.com/package/@speechly/browser-client) |
| [/examples/react-client-example](/examples/react-client-example) | A simple example application built with [react-client](https://www.npmjs.com/package/@speechly/react-client) |
| [/examples/react-ui-example](/examples/react-ui-example) | An example showcasing UI components in React. |
| [/examples/cra-template-speechly](/examples/cra-template-speechly) | A `create-react-app` template for setting up a Speechly application. |


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

## Learn more
- [Quick Start Guide](https://docs.speechly.com/quick-start/) – Get started on developing with Speechly for the web
- [Developer Documentation](https://docs.speechly.com/) – Browse the latest developer documentation, including tutorials, sample code and API reference
- [Speechly Demos](https://www.speechly.com/demos/) – Get inspired and see what you can build with Speechly
- [Speechly Dashboard](https://www.speechly.com/dashboard) – Where you create, configure and deploy your Speechly applications

## Related repositories
- [Android Client Library](https://github.com/speechly/android-client)
- [iOS Client Library](https://github.com/speechly/ios-client)
- [Speechly API gRPC protos and pre-compiled stubs](https://github.com/speechly/api)
