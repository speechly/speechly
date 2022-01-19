# Speechly voice search demo

https://demos.speechly.com/voice-search/

Demonstrates how to use Speechlys speech-to-text capabilities and [Google Programmable Search Engine](https://programmablesearchengine.google.com/) to create a voice-enabled search enginge. It supports continuous searching using voice as well as basic punctuation.

## Requirements

* [Node](https://nodejs.org/) (tested with v16.13.0)
* [Google Programmable Search Engine](https://programmablesearchengine.google.com/)

### Built With

* [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client)
* [Speechly React UI](https://www.npmjs.com/package/@speechly/react-ui)
* [Typescript](https://www.typescriptlang.org/)

Speechly React Client wraps [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling.

## Setting up Google Programmable Search Engine

1. Create a new [programmable search engine](https://programmablesearchengine.google.com/)
1. Obtain the `API Key` and `Search Engine ID`
1. Store them in a `.env` file in the directory root, like this:

```bash
REACT_APP_VOICE_SEARCH_API_KEY=<your-api-key>
REACT_APP_VOICE_SEARCH_ENGINE_ID=<your-search-engine-id>
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
