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

# React client for Speechly SLU API

![Release build](https://github.com/speechly/react-client/workflows/Release%20build/badge.svg)
[![npm version](https://badge.fury.io/js/%40speechly%2Freact-client.svg)](https://badge.fury.io/js/%40speechly%2Freact-client)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

This repository contains source code for the React client for [Speechly](https://www.speechly.com/?utm_source=github&utm_medium=react-client&utm_campaign=text) SLU API. Speechly allows you to easily build applications with voice-enabled UIs.

Check out [Speechly documentation](https://www.speechly.com/docs/client-libraries/react-client/?utm_source=github&utm_medium=react-client&utm_campaign=text) for a tutorial on how to build a voice filtering app using this client.

## Usage

Install the package:

```shell
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

You can find the detailed API documentation in [GitHub repository](https://github.com/speechly/react-client/blob/master/docs/modules/_index_d_.md).

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/react-client/blob/master/CONTRIBUTING.md).

## About Speechly

Speechly is a developer tool for building real-time multimodal voice user interfaces. It enables developers and designers to enhance their current touch user interface with voice functionalities for better user experience. Speechly key features:

#### Speechly key features

- Fully streaming API
- Multi modal from the ground up
- Easy to configure for any use case
- Fast to integrate to any touch screen application
- Supports natural corrections such as "Show me red – i mean blue t-shirts"
- Real time visual feedback encourages users to go on with their voice

|                  Example application                  | Description                                                                                                                                                                                                                                                                                                                               |
| :---------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://i.imgur.com/v9o1JHf.gif" width=50%> | Instead of using buttons, input fields and dropdowns, Speechly enables users to interact with the application by using voice. <br />User gets real-time visual feedback on the form as they speak and are encouraged to go on. If there's an error, the user can either correct it by using traditional touch user interface or by voice. |
