# Transcription Demo

The transcription demo accurately transcribes both live and pre-recorded audio using our off-the-shelf speech recognition model in real time. Highlighting the following Speechly features: Live Audio Transcription, Pre-recorded Audio Transcription, Interim Results, Segmentation and Timestamps.

https://demos.speechly.com/transcription/

## Prerequisites

* [Node.js](https://nodejs.org/) v16.13.0 or later
* [npm](https://npmjs.com/) or [Rush](https://rushjs.io/)

This project was built with [React](https://reactjs.org/), [Typescript](https://www.typescriptlang.org/), [Speechly React Client](https://www.npmjs.com/package/@speechly/react-client) and [Wafesurfer.js](https://wavesurfer-js.org/).

## Installation and running (stand-alone)

1\. Copy this project using [degit](https://github.com/Rich-Harris/degit) (or download manually)

```bash
npx degit speechly/speechly/demos/transcription transcription
```

2\. Install dependencies

```bash
npm install
```

3\. Start development server

```bash
npm start
```

Alternatively you can use `pnpm` instead of `npm`.

## Installation and running (within Rush monorepository)

If you run the demo from within `speechly` monorepository, the steps are as follows.

1\. Install and build dependencies

```bash
rush update
rush build
```

2\. Start development server

```bash
rushx start
```

Please see [root level README](../../README.md#how-to-use-this-repository) and [the demos README](../README.md)
for instructions on how to set up [Rush](https://rushjs.io/).
