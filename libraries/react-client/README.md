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

With the Speechly React client you can add voice features to any React project. It handles authentication, audio capture, network streaming and connection management with the Speechly Streaming API.

Check out the [react client example](https://github.com/speechly/speechly/tree/main/examples/react-client-example) for an example app built using this client.

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
- [Basic usage](https://dreamy-cori-a02de1.netlify.app/client-libraries/usage/?platform=React) (Docs)
- [Advanced usage](https://dreamy-cori-a02de1.netlify.app/client-libraries/using-react-client/) (Docs)
- [Example application](https://github.com/speechly/speechly/tree/main/examples/react-client-example)

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).

