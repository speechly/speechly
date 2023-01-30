<div align="center" markdown="1">
<br/>

![speechly-logo-duo-black](https://user-images.githubusercontent.com/2579244/193574443-130d16d6-76f1-4401-90f2-0ed753b39bc0.svg#gh-light-mode-only)
![speechly-logo-duo-white](https://user-images.githubusercontent.com/2579244/193574464-e682b2ce-dd48-4f70-88d4-a1fc5241fa47.svg#gh-dark-mode-only)

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

# Speechly

Speechly offers Automatic Speech Recognition (ASR) and Natural Language Understanding (NLU) tools, SDKs and APIs. Easily integrate Speechly into your product and deploy on-device, on-premise or in the cloud.

This monorepository contains Speechly's web related [libraries](#libraries), [demos](#demos) and [examples](#examples).

## Libraries

Speechly client libraries provide the natural Spoken Language Understanding API for web applications. They handle audio capturing and streaming, authentication, and network connection to Speechly cloud API.

Speechly UI libraries provide UI components to support building a voice-enabled, multimodal apps.

| Folder | Version | npm package | Description |
| ------ | ------- |------- | ------- |
| [/libraries/browser-client](/libraries/browser-client) | ![npm](https://img.shields.io/npm/v/@speechly/browser-client?label) | [@speechly/browser-client](https://www.npmjs.com/package/@speechly/browser-client) | JavaScript API for natural spoken language understanding. |
| [/libraries/react-client](/libraries/react-client) | ![npm](https://img.shields.io/npm/v/@speechly/react-client?label)  | [@speechly/react-client](https://www.npmjs.com/package/@speechly/react-client) | React API for natural spoken language understanding. |
| [/libraries/browser-ui](/libraries/browser-ui) | ![npm](https://img.shields.io/npm/v/@speechly/browser-ui?label)  | [@speechly/browser-ui](https://www.npmjs.com/package/@speechly/browser-ui) | Web components for controlling listening and showing speech-to-text transcription. |
| [/libraries/react-ui](/libraries/react-ui) | ![npm](https://img.shields.io/npm/v/@speechly/react-ui?label)  | [@speechly/react-ui](https://www.npmjs.com/package/@speechly/react-ui) | React components for controlling listening and showing speech-to-text transcription. |

## Demos

This monorepository contains the source code of Speechly demos available at [https://demos.speechly.com](https://demos.speechly.com). They are built using React and Speechly's [`react-client`](libraries/react-client/) and [`react-ui`](libraries/react-ui/). Each of the demo subfolder is a stand-alone project. See the demos' README for further instructions.

| Folder | Description |
| ------ | ------- |
| [/demos/moderation](/demos/moderation) | The [moderation demo](https://demos.speechly.com/moderation) highlights profanities from various audio clips and labels the utterances into offensive and non offensive ones in real time. |
| [/demos/transcription](/demos/transcription) | The [transcription demo](https://demos.speechly.com/transcription) accurately transcribes both live and pre-recorded audio using our off-the-shelf speech recognition model in real time. |
| [/demos/fashion-ecommerce](/demos/fashion-ecommerce) | The [voice interfaces demo](https://demos.speechly.com/fashion/) enables you to narrow down the product selection of an imaginary clothing store effectively. The results are updated in real time as you speak and you can make corrections. |

## Examples

Example applications can be used to validate correct behaviour of client and UI libraries. They may come handy as learning tools as well.

| Folder | Description |
| ------ | ------- |
| [/examples/browser-client-example](/examples/browser-client-example) | An example JavaScript app built with [Speechly Browser Client](https://www.npmjs.com/package/@speechly/browser-client). |
| [/examples/react-client-example](/examples/react-client-example) | An example React app built with [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client). |
| [/examples/react-ui-example](/examples/react-ui-example) | An example React app showcasing UI components in React. |
| [/examples/next-js-example](/examples/next-js-example) | A simple Next.js site bootstrapped with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app) using Speechly UI components. |
| [/examples/ios-decoder-example](/examples/ios-decoder-example) | An example iOS app for using the Speechly Decoder library for on-device transcription.|
| [/examples/ios-client-example](/examples/ios-client-example) | An example iOS app for filtering GitHub repositories built with [Speechly iOS Client](https://github.com/speechly/ios-client). |
| [/examples/android-decoder-example](/examples/android-decoder-example) | An example Android app for using the Speechly Decoder library for on-device transcription. |
| [/examples/android-client-example](/examples/android-client-example) | An example Android app for filtering GitHub repositories built with [Speechly Android Client](https://github.com/speechly/android-client). |

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

- [Quick Start Guide](https://docs.speechly.com/basics/getting-started/) – Learn how to create a Speechly application and transcribe both live and pre-recorded audio.
- [Developer Documentation](https://docs.speechly.com) – Browse the latest developer documentation, including sample code and reference docs.
- [Speechly Demos](https://demos.speechly.com) – Get inspired and see what you can build with Speechly.
- [Speechly Dashboard](https://api.speechly.com/dashboard) – Create, edit and manage your Speechly applications & projects.
- [Speechly CLI](https://docs.speechly.com/features/cli) – Interact with Speechly from the comfort of your CLI.

## Related repositories

- [Android Client Library](https://github.com/speechly/android-client)
- [iOS Client Library](https://github.com/speechly/ios-client)
- [Speechly API gRPC protos and pre-compiled stubs](https://github.com/speechly/api)
