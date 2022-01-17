# Flight Booking Demo

https://demos.speechly.com/booking/

Demonstrates how to fill a booking form with text fields, dropdowns and checkboxes using both voice (VUI) and touch/type (GUI). The voice interface has been configured to extract keywords (entities) like **departure** and **return date** and **number of passengers** for the Voice form components to display. Try the demo and say something like:

_Show me direct flights from New York to Miami for 2 passengers departing tomorrow._

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
