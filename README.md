# <a href="https://www.speechly.com/"><img src="https://www.speechly.com/images/logo.png" height="100" alt="Speechly"></a>

# speechly-browser-client

![Release build](https://github.com/speechly/browser-client/workflows/Release%20build/badge.svg?branch=master&event=release)
[![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This repository contains source code for the browser client for [Speechly](https://www.speechly.com/) SLU API. Speechly allows you to easily build applications with voice-enabled user interfaces for touch screen devices. 

NOTE: If you are using React, you should be using the [React client](https://github.com/speechly/react-client) instead.

## Usage

Install the package:

```shell
# Using Yarn
yarn add @speechly/browser-client

# Using NPM
npm install --save @speechly/browser-client
```

Start using the client:

```typescript
import { Client, Segment } from "@speechly/browser-client";

// Create a new Client. appId and language are configured in the dashboard.
const client = new Client({
  appId: "your-app-id",
  language: "en-US",
});

// Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
// Make sure you call `initlialize` from a user action handler (e.g. from a button press handler).
await client.initialize();

// React to the updates from the API.
client.onSegmentChange((segment: Segment) => {
  console.log(
    "Received new segment from the API:",
    segment.intent,
    segment.entities,
    segment.words,
    segment.isFinal
  );
});

// Start recording.
// Ideally this should be bound to e.g. a button press.
await client.startContext();

// Stop recording after a timeout.
// Ideally this should be bound to e.g. a button press.
setTimeout(async function() {
  await client.stopContext();
}, 3000);
```

Check out the [browser-client-example](https://github.com/speechly/browser-client-example) repository for a demo app built using this client.

## Documentation

You can find the detailed API documentation in [GitHub repository](https://github.com/speechly/browser-client/blob/master/docs/modules/_index_d_.md). 
You can also refer to [Speechly Docs](https://www.speechly.com/docs/) for more information.

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/browser-client/blob/master/CONTRIBUTING.md).
