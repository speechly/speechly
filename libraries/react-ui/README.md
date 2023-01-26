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

# Speechly React UI components

![build](https://img.shields.io/github/actions/workflow/status/speechly/speechly/build.yaml?branch=main&logo=github)
[![npm](https://img.shields.io/npm/v/@speechly/react-ui?color=cb3837&logo=npm)](https://www.npmjs.com/package/@speechly/react-ui)
[![license](http://img.shields.io/:license-mit-blue.svg)](/LICENSE)

Ready made Speechly [UI components](https://docs.speechly.com/client-libraries/ui-components/) to build a reactive voice interface  to a React or Next.js app.

If you want to build a custom interface for you web app, you may want to check out [react-client](https://github.com/speechly/speechly/tree/main/libraries/react-client) library for direct access to Speechly API.

## Before you start

Make sure you have created and deployed a Speechly application. Take note of the **App ID**, you'll need it shortly.

You'll also need a React app. Use your existing app, or create a new one using:

```bash
npx create-react-app my-app
```

## Installation

Install Speechly React client and Speechly React UI components:

```
npm install @speechly/react-client
npm install @speechly/react-ui
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

## Usage

Import the required UI components and take them into use:

```jsx
// App.js
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup
} from "@speechly/react-ui";

function App() {
  return (
    <div className="App">
      <BigTranscript placement="top" />
      <PushToTalkButton placement="bottom" captureKey=" " />
      <IntroPopup />
    </div>
  );
}
```

Start the development server:

```
npm run start
```

Navigate to http://localhost:3000 to see your app running!

### Documentation

- [API reference](https://github.com/speechly/speechly/tree/main/libraries/react-ui/docs) (GitHub)
- [UI components](https://docs.speechly.com/ui-components/) (Docs)

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).
