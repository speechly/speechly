# Instant Messaging Demo

https://demos.speechly.com/speech-to-text/

Demonstrates how to use Speechlys speech-to-text capabilities and [Open AI](https://openai.com/) to create a voice-enabled chat experience. You can chat with Marv, a GPT3 powered chatbot that reluctantly answers your questions.

## Requirements

* [Node](https://nodejs.org/) (tested with v16.13.0)
* [Open AI API](https://openai.com/api/)

### Built With

* [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client)
* [Speechly React UI](https://www.npmjs.com/package/@speechly/react-ui)
* [Typescript](https://www.typescriptlang.org/)

Speechly React Client wraps [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling.

## Setting up Open AI API

1. Create a new application and get it apporved
1. Obtain the Open AI `API Key`
1. Store it in a `.env` file in the directory root, like this:

```bash
REACT_APP_INSTANT_MESSAGING_OPENAI_API_KEY=<your-api-key>
```

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

If you run the demo from within `speechly` monorepository, the steps are as follows:

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
