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

## Getting started
- [Quick Start Guide](https://docs.speechly.com/quick-start/) – Get started on developing with Speechly for the web
- [Developer Documentation](https://docs.speechly.com/) – Browse the latest developer documentation, including tutorials, sample code and API reference
- [Speechly Demos](https://www.speechly.com/demos/) – Get inspired and see what you can build with Speechly
- [Speechly Dashboard](https://www.speechly.com/dashboard) – Where you create, configure and deploy your Speechly applications


## Published packages
We offer both client libraries and various UI component packages. The client libraries work together with our cloud API. They take care of audio capture and streaming, authentication, and network connection handling. The UI components provide basic Voice UI functionalities, such as a microphone button for activating voice input, and a display component for showing speech to text output.

| Folder | Version | Package |
| ------ | ------- |------- |
| [/libraries/browser-client](/libraries/browser-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)| [@speechly/browser-client](https://www.npmjs.com/package/@speechly/browser-client) |
| [/libraries/react-client](/libraries/react-client) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-client.svg)](https://badge.fury.io/js/%40speechly%2Freact-client) | [@speechly/react-client](https://www.npmjs.com/package/@speechly/react-client) |
| [/libraries/browser-ui](/libraries/browser-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-ui.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-ui) | [@speechly/browser-ui](https://www.npmjs.com/package/@speechly/browser-ui) |
| [/libraries/react-ui](/libraries/react-ui) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-ui.svg)](https://badge.fury.io/js/%40speechly%2Freact-ui) | [@speechly/react-ui](https://www.npmjs.com/package/@speechly/react-ui) |
| [/libraries/react-voice-forms](/libraries/react-voice-forms) | [![npm version](https://badge.fury.io/js/%40speechly%2Freact-voice-forms.svg)](https://badge.fury.io/js/%40speechly%2Freact-voice-forms) | [@speechly/react-voice-forms](https://www.npmjs.com/package/@speechly/react-voice-forms) |

## Unpublished projects and demos
These are example projects that are not published, but are useful learning tools.

| Folder | Description |
| ------ | ------- |
| [/examples/browser-client-example](/examples/browser-client-example) | A simple example application built with [browser-client](https://www.npmjs.com/package/@speechly/browser-client) |
| [/examples/react-client-example](/examples/react-client-example) | A simple example application built with [react-client](https://www.npmjs.com/package/@speechly/react-client) |
| [/examples/react-ui-example](/examples/react-ui-example) | An example showcasing UI components in React. |
| [/examples/cra-template-speechly](/examples/cra-template-speechly) | A `create-react-app` template for setting up a Speechly application. |

You can also find implementations of our public demo applications in this repository.

| Folder | Description |
| ------ | ------- |
| [/demos/flight-booking](/demos/flight-booking) | [Flight Booking Demo](https://speechly-demos.herokuapp.com/flight-booking) |
| [/demos/ecommerce-checkout](/demos/ecommerce-checkout) | [Ecommerce checkout Demo](https://speechly-demos.herokuapp.com/ecommerce-checkout) |
| [/demos/voice-picking](/demos/voice-picking) | [Voice Picking Demo](https://speechly-demos.herokuapp.com/voice-picking) |
| [/demos/speech-to-text](/demos/speech-to-text) | [Speech to Text](https://speechly-demos.herokuapp.com/speech-to-text) |
| [/demos/fast-food-demo](/demos/fast-food-demo) | [Fast food demo](https://speechly-demos.herokuapp.com/fast-food) |

## Related repositories
- [Android Client Library](https://github.com/speechly/android-client)
- [iOS Client Library](https://github.com/speechly/ios-client)
- [Speechly API gRPC protos and pre-compiled stubs](https://github.com/speechly/api)

## How to get help?

For general discussion or questions, please use our [GitHub Discussion forum](https://github.com/speechly/speechly/discussions).

For feature requests or bug reports, please file a [GitHub Issue](https://github.com/speechly/speechly/issues).

## Contributions

We are happy to receive community contributions! For small fixes, feel free to file a pull request. For bigger changes or new features start by filing an issue.

### How to use this repository

This monorepository contains all Speechly's web related libraries and tools. We use [rushjs](https://rushjs.io) and [pnpm](https://pnpm.io) as build tools.

Note: The steps below are needed when you are interested in contributing. To run our examples and demos, it is enough to follow the instructions in the respective READMEs.

To get started with development, run
```
npm install -g @microsoft/rush
npm install -g pnpm
rush update
rush build
```
This will build everything in the repository. (It may take a while!) To run a particular example or demo, navigate to the corresponding directory (e.g. `examples/broser-client-example`) and run
```
rushx start
```
