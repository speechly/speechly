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

# Speechly React Client

![build](https://img.shields.io/github/actions/workflow/status/speechly/speechly/build.yaml?branch=main&logo=github)
[![npm](https://img.shields.io/npm/v/@speechly/react-client?color=cb3837&logo=npm)](https://www.npmjs.com/package/@speechly/react-client)
[![license](http://img.shields.io/:license-mit-blue.svg)](/LICENSE)

Add voice features to any React app with Speechly React Client. It handles authentication, audio capture, network streaming and connection management with the Speechly [Streaming API](https://docs.speechly.com/reference/streaming-api).

## Documentation

- [Getting started with Speechly](https://docs.speechly.com/basics/getting-started/)
- [Building a React app using Speechly React Client](https://docs.speechly.com/reference/client-libraries/react-client)
- [View example application](https://github.com/speechly/speechly/tree/main/examples/react-client-example)
- [API reference](https://github.com/speechly/speechly/blob/main/libraries/react-client/docs/classes/context.SpeechProvider.md)
  
## Install

Using npm:

```bash
npm install @speechly/react-client
```

Using yarn:

```bash
yarn add @speechly/react-client
```

## Usage

Wrap your app with the `SpeechProvider` context provider:

```jsx
import { SpeechProvider } from '@speechly/react-client';

// Get your App ID from Speechly Dashboard (https://api.speechly.com/dashboard/)
// or by using Speechly CLI `list` command.

<SpeechProvider
  appId="YOUR-APP-ID"
  debug
  logSegments
>
  <App />
</SpeechProvider>
```

Capture browser microphone audio:

```jsx
import { useSpeechContext } from '@speechly/react-client';

function App() {
  const { listening, segment, attachMicrophone, start, stop } = useSpeechContext();

  // Make sure that you call `attachMicrophone` from a user initiated
  // action handler, like a button press.

  const handleClick = async () => {
    if (listening) {
      await stop();
    } else {
      await attachMicrophone();
      await start();
    }
  };

  return (
    <button onClick={handleClick}>
      Start/stop microphone
    </button>
  );
}
```

React to API updates:

```jsx
// Use `segment.isFinal` to check the segment state. When `false`,the segment might
// be updated several times. When `true`, the segment won’t be updated anymore and 
// subsequent callbacks within the same audio context refer to the next segment.

useEffect(() => {
  if (segment) {
    console.log('Tentative segment:', segment)
    if (segment.isFinal) {
      console.log('Final segment:', segment)
    }
  }
}, [segment]);
```

## Contributing

- See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).
- Ask questions on [GitHub Discussions](https://github.com/speechly/speechly/discussions)
