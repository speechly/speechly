# Voice Checkout Demo

https://demos.speechly.com/checkout/

Demonstration of multimodal VUI/GUI form filling. You can provide the recipient, shipping and payment details. The voice interface has been configured to extract keywords (entities) like **name** and **phone number**, **email**, **shipping address** and other relevant information from the speech. Try the demo and say something like:

_"Name Jane Smith, email jane@acme.com"_

## Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1)

### Built With

* [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client)
* [Speechly React UI](https://www.npmjs.com/package/@speechly/react-ui)
* [Speechly Voice Forms for React](https://www.npmjs.com/package/@speechly/react-voice-forms)
* [Typescript](https://www.typescriptlang.org/)

Speechly React Client wraps [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling.

## Installation And Running (stand-alone)

1. Install NPM packages

```bash
npm i
```

2. Start development server

```bash
npm start
```

Alternatively you can use `pnpm` instead of `npm`.

## Installation And Running (within Rush monorepository)

If you run the demo from within `speechly` monorepository, the recommended steps are as follows:

1. Install and build dependencies

```bash
rush update
rush build
```

2. Start development server

```bash
rushx start
```

Please see [root level README](../../README.md#how-to-use-this-repository) and [the demos README](../README.md)
for instructions on how to set up [Rush](https://rushjs.io/).
