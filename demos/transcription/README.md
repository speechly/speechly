# Transcription Demo

https://demos.speechly.com/transcription/

Demonstrates Speechly's transcription, segmentation and timestamping features.

## Requirements

* [Node](https://nodejs.org/) (tested with v16.13.0)

### Built With

* [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client)
* [Typescript](https://www.typescriptlang.org/)

Speechly React Client wraps [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling.

## Installation And Running (stand-alone)

1. Install NPM packages

```bash
npm install
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
