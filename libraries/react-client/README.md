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

## Quick start

Bootstrap a simple Speechly React app

```sh
npx degit speechly/speechly/templates/empty my-app
cd my-app
// Add an app ID to index.js from https://api.speechly.com/dashboard
npm install
npm start
```

## Usage

Install the package:

```sh
# Create a new React app
create-react-app .

# Install Speechly client
npm install --save @speechly/react-client
```

Start using the client:

```typescript
import React from 'react'
import { SpeechProvider, useSpeechContext } from '@speechly/react-client'

export default function App() {
  return (
    <div className="App">
      <SpeechProvider appId="my-app-id" language="my-app-language">
        <SpeechlyApp />
      </SpeechProvider>
    </div>
  )
}

function SpeechlyApp() {
  const { speechState, segment, toggleRecording } = useSpeechContext()

  return (
    <div>
      <div className="status">{speechState}</div>
      {segment ? <div className="segment">{segment.words.map(w => w.value).join(' ')}</div> : null}
      <div className="mic-button">
        <button onClick={toggleRecording}>Record</button>
      </div>
    </div>
  )
}
```

Check out the [react-example-repo-filtering](https://github.com/speechly/react-example-repo-filtering) repository for a demo app built using this client.

## Documentation

You can find the detailed API documentation in [GitHub repository](docs/modules/_index_d_.md).

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).

