<div align="center" markdown="1">
<a href="https://www.speechly.com">
   <img src="https://d33wubrfki0l68.cloudfront.net/f15fc952956e1952d6bd23661b7a7ee6b775faaa/c1b30/img/speechly-logo-duo-black.svg" height="48" />
</a>

### Real-time automatic speech recognition and natural language understanding tools in one flexible API

[Website](https://www.speechly.com/)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

# React client for Speechly SLU API

![Release build](https://github.com/speechly/react-client/workflows/Release%20build/badge.svg)
[![npm version](https://badge.fury.io/js/%40speechly%2Freact-client.svg)](https://badge.fury.io/js/%40speechly%2Freact-client)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This repository contains source code for the React client for [Speechly](https://www.speechly.com/?utm_source=github&utm_medium=react-client&utm_campaign=text) SLU API. Speechly allows you to easily build applications with voice-enabled UIs.

Check out [Speechly documentation](https://docs.speechly.com//client-libraries/react-client/?utm_source=github&utm_medium=react-client&utm_campaign=text) for a tutorial on how to build a voice filtering app using this client.

## Before you start

Make sure you have created and deployed a Speechly application. Take note of the **App ID**, you'll need it shortly.

You'll also need a React app. Use your existing app, or create a new one using:

```bash
npx create-react-app my-app
```

## Installation

Install Speechly React client:

```
npm install @speechly/react-client
```

Import `SpeechProvider` and wrap the app with it, passing the **App ID** of your Speechly application:

```jsx
// index.js
import { SpeechProvider } from '@speechly/react-client';

<React.StrictMode>
  <SpeechProvider appId="YOUR_APP_ID">
    <App />
  </SpeechProvider>
</React.StrictMode>
```

See [`SpeechProviderProps`](https://github.com/speechly/speechly/blob/main/libraries/react-client/docs/interfaces/context.SpeechProviderProps.md) for all available properties.

## Usage

Import the `useSpeechContext` hook, create a button to initialize the microphone, another button for toggling the microphone and then display the transcript:

```jsx
// App.js
import { useSpeechContext } from '@speechly/react-client';

function App() {
  const { segment, listening, attachMicrophone, start, stop } = useSpeechContext();

  return (
    <div className="App">
      <button onClick={attachMicrophone}>Initialize microphone</button>
      <button onPointerDown={start} onPointerUp={stop}>
        {listening ? 'Listening…' : 'Push to talk'}
      </button>
      <p>
        {segment && segment.words.map(word => word.value).join(' ')}
      </p>
    </div>
  );
}
```

Start the development server:

```
npm run start
```

Navigate to http://localhost:3000 to see your app running!

## Documentation

- [API reference](https://github.com/speechly/speechly/blob/main/libraries/react-client/docs/classes/context.SpeechProvider.md) (GitHub)
- [Basic usage](https://docs.speechly.com/client-libraries/usage/?platform=React) (Docs)
- [Advanced usage](https://docs.speechly.com/client-libraries/using-react-client/) (Docs)
- Check out the [react-example-repo-filtering](https://github.com/speechly/react-example-repo-filtering) repository for a example app built using this client.

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).

