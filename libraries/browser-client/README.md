<div align="center" markdown="1">
<a href="https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header">
   <img src="https://d33wubrfki0l68.cloudfront.net/1e70457a60b0627de6ab966f1e0a40cf56f465f5/b4144/img/logo-speechly-colors.svg" height="48">
</a>

### Speechly is the Fast, Accurate, and Simple Voice Interface API for Web, Mobile and E‑commerce

[Website](https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

# Speechly browser client

![Release build](https://github.com/speechly/browser-client/workflows/Release%20build/badge.svg?branch=master&event=release)
[![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

With the browser-client you can add voice features to any website. It handles authentication, audio capture, network streaming and connection management with the Speechly Voice API.

Check out the [browser-client-example](https://github.com/speechly/browser-client-example) repository for a demo app built using this client.

NOTE: If you are using React, you can use our [React client](https://github.com/speechly/speechly/libraries/react-client) instead. It provides the same functionalities, but provides a programming model that is idiomatic to React.

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

// Create a new Client. appId is configured in the dashboard.
const client = new Client({appId: 'your-app-id'})

// Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
// Make sure you call `initlialize` from a user action handler (e.g. from a button press handler).
await client.initialize()

// React to the updates from the API.
client.onSegmentChange((segment: Segment) => {
  console.log('Received new segment from the API:', segment.intent, segment.entities, segment.words, segment.isFinal)
})

// Start recording.
// Ideally this should be bound to e.g. a button press.
await client.startContext()

// Stop recording after a timeout.
// Ideally this should be bound to e.g. a button press.
setTimeout(async function() {
  await client.stopContext()
}, 3000)
```

## Documentation

You can find the detailed [browser-client API documentation](https://github.com/speechly/browser-client/blob/master/docs/classes/_index_d_.client.md) in the GitHub repository.

You can also refer to [Speechly Docs](https://www.speechly.com/docs/?utm_source=github&utm_medium=browser-client&utm_campaign=text) for more information.

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/browser-client/blob/master/CONTRIBUTING.md).

