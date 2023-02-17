<div align="center" markdown="1">
<br/>

![speechly-logo-duo-black](https://user-images.githubusercontent.com/2579244/193574443-130d16d6-76f1-4401-90f2-0ed753b39bc0.svg)

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

# Speechly Browser Client

![build](https://img.shields.io/github/actions/workflow/status/speechly/speechly/build.yaml?branch=main&logo=github)
[![npm](https://img.shields.io/npm/v/@speechly/browser-client?color=cb3837&logo=npm)](https://www.npmjs.com/package/@speechly/browser-client)
[![license](http://img.shields.io/:license-mit-blue.svg)](/LICENSE)

Add voice features to any web app with Speechly Browser Client. It handles authentication, audio capture, network streaming and connection management with the Speechly [Streaming API](https://docs.speechly.com/reference/streaming-api).

If you are using React, you can use the [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client) instead. It provides the same functionalities, but provides a programming model that is idiomatic to React.

## Documentation

- [Getting started with Speechly](https://docs.speechly.com/basics/getting-started/)
- [Building a web app using Speechly Browser Client](https://docs.speechly.com/reference/client-libraries/browser-client)
- [View example application](https://github.com/speechly/speechly/tree/main/examples/browser-client-example)
- [Migrating from Browser Client v1](https://www.speechly.com/blog/speechly-browser-client-v2-released)
- [API reference](https://github.com/speechly/speechly/blob/main/libraries/browser-client/docs/classes/client.BrowserClient.md)

## Install

Using npm:

```bash
npm install @speechly/browser-client
```

Using yarn:

```bash
yarn add @speechly/browser-client
```

Using unpkg CDN:

```html
<script type="module">
  import { BrowserClient, BrowserMicrophone } from "//unpkg.com/@speechly/browser-client?module=true"
</script>
```

## Usage

Create new `BrowserMicrophone` and `BrowserClient` instances:

```js
import { BrowserClient, BrowserMicrophone } from '@speechly/browser-client';

// Get your App ID from Speechly Dashboard (https://api.speechly.com/dashboard/)
// or by using Speechly CLI `list` command.

const microphone = new BrowserMicrophone();
const client = new BrowserClient({
  appId: 'YOUR-APP-ID',
  logSegments: true,
  debug: true,
});
```

Capture browser microphone audio:

```js
const myButton = document.getElementById('myButton');

// Make sure that you call `microphone.initialize` from a user initiated
// action handler, like a button press.

const attachMicrophone = async () => {
  if (microphone.mediaStream) return;
  await microphone.initialize();
  await client.attach(microphone.mediaStream);
};

const handleClick = async () => {
  if (client.isActive()) {
    await client.stop();
  } else {
    await attachMicrophone();
    await client.start();
  }
};

myButton.addEventListener('click', handleClick);
```

React to API updates:

```js
// Use `segment.isFinal` to check the segment state. When `false`,the segment might
// be updated several times. When `true`, the segment won’t be updated anymore and 
// subsequent callbacks within the same audio context refer to the next segment.

client.onSegmentChange((segment) => {
  console.log('Tentative segment:', segment)
  if (segment.isFinal) {
    console.log('Final segment:', segment)
  }
})
```

## Contributing

- See contribution guide in [CONTRIBUTING.md](/CONTRIBUTING.md).
- Ask questions on [GitHub Discussions](https://github.com/speechly/speechly/discussions)
