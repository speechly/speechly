<h1 align="center">
  <a href="https://www.speechly.com/?utm_source=github&utm_medium=speechly-speechly&utm_campaign=header"><img src="https://www.speechly.com/images/logo.png" height="100" alt="Speechly"></a>
</h1>
<h1 align="center">
Speechly is the Fast, Accurate, and Simple Voice Interface API for Web, Mobile and E-commerce.
</h1>

[Speechly website](https://www.speechly.com/?utm_source=github&utm_medium=speechly-api&utm_campaign=header)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Docs](https://www.speechly.com/docs/?utm_source=github&utm_medium=speechly-api&utm_campaign=header)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=speechly-api&utm_campaign=header)

With Speechly's cloud API and client libraries you can add voice features to any website or mobile application. Our free tier allows 50 hours of API usage which is enough for small-to-medium scale projects.

Also take a look at our [demos](https://www.speechly.com/demos/) to see what you can build with Speechly.

## Getting started with Speechly

1. Take a look at our [Quickstart documentation](https://docs.speechly.com/quick-start/).
2. Create an account on the [Speechly Dashboard](https://www.speechly.com/dashboard).
3.

(Okay, actually we should probably put some instructions on how to get e.g. the browser-client-example up and running with an app id that has the empty configuration deployed.)

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
npm install -g @mirosoft/rush
npm install -g pnpm
rush update
rush build
```
This will build everything in the repository. (It may take a while!) To run a particular example or demo, navigate to the corresponding directory (e.g. `examples/broser-client-example`) and run
```
rushx start
```
