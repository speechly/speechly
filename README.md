# <a href="https://speechly.com/"><img src="https://www.speechly.com/images/logo.png" height="100" alt="Speechly"></a>

## speechly-browser-client

![Release build](https://github.com/speechly/browser-client/workflows/Release%20build/badge.svg?branch=master&event=release)
[![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)

This repository contains source code for the browser client for Speechly SLU API. Speechly allows you to easily build applications with voice-enabled UIs.

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
import { Client, Segment } from '@speechly/browser-client'

// Create a new Client. appId and language are configured in the dashboard.
const client = new Client({
  appId: 'your-app-id',
  language: 'en-US'
})

// Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
client.initialize((err?: Error) => {
  if (err !== undefined) {
    console.error('Failed to initialize Speechly client:', err)
  }
})

// React to the phrases received from the API
client.onSegmentChange((segment: Segment) => {
  console.log('Received new segment from the API:', segment.intent, segment.entities, segment.words, segment.isFinal)
})

// Start recording
client.startContext((err?: Error) => {
  if (err !== undefined) {
    console.error('Failed to start recording:', err)
    return
  }

  // Stop recording after 3 seconds
  setTimeout(client.stopContext, 3000)
})
```

Check out the demo in [examples directory](examples/README.md).

## Documentation

You can find the detailed API documentation in [GitHub repository](https://github.com/speechly/browser-client/blob/master/docs/modules/_speechly_d_.md).
