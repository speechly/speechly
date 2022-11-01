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

![Release build](https://github.com/speechly/react-ui/workflows/Release%20build/badge.svg)
[![npm version](https://badge.fury.io/js/%40speechly%2Freact-ui.svg)](https://badge.fury.io/js/%40speechly%2Freact-ui)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

# Speechly React UI components

Ready made Speechly [UI components](https://docs.speechly.com/client-libraries/ui-components/) to build a reactive voice interface  to a React or Next.js app.

> If you want to build a custom interface for you web app, you may want to check out [react-client](https://github.com/speechly/speechly/tree/main/libraries/react-client) library for direct access to Speechly API.


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
