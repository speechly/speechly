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

# Speechly browser client

![Release build](https://github.com/speechly/browser-client/workflows/Release%20build/badge.svg?branch=master&event=release)
[![npm version](https://badge.fury.io/js/%40speechly%2Fbrowser-client.svg)](https://badge.fury.io/js/%40speechly%2Fbrowser-client)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

With the browser-client you can add voice features to any website. It handles authentication, audio capture, network streaming and connection management with the Speechly Voice API.

Check out the [browser-client-example](https://github.com/speechly/speechly/tree/main/examples/browser-client-example) repository for a demo app built using this client.

NOTE: If you are using React, you can use our [React client](https://github.com/speechly/speechly/tree/main/libraries/react-client) instead. It provides the same functionalities, but provides a programming model that is idiomatic to React.

## Usage with Node

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

// Create a new Client. NOTE: Configure and get your appId from https://api.speechly.com/dashboard
const client = new Client({appId: 'your-app-id'})

// Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
// Make sure you call `initlialize` from a user action handler (e.g. from a button press handler).
await client.initialize()

// React to the updates from the API.
client.onSegmentChange((segment: Segment) => {
  console.log('Received new segment from the API:', segment.intent, segment.entities, segment.words, segment.isFinal)
})

// Start recording.
// This can be bound to e.g. a button press.
await client.startContext()

// Stop recording after a timeout.
// This can be bound to e.g. a button press.
setTimeout(async function() {
  await client.stopContext()
}, 3000)
```

## Usage with browsers

This sample HTML loads Speechly's `browser-client` ES modules via a CDN that mirrors npm packages. The page displays a text field that you dictate text into. See browser's console log for raw segment feed from Speechly.

Please use a HTML server to view the example. Running it as a file will not work due to browser's security restrictions. For example run `serve .` on command line and open `localhost:3000` in your browser.

```HTML
<html>
  <body>

    <input id="textBox" type="text" placeholder="Hold to talk..." autofocus />

    <script type="module">
      // Load Speechly ES module from a CDN. Note script type="module"
      import { Client } from "../core/speechly.es.js"

      const widget = document.getElementById("textBox")

      // Create a Speechly client instance.  NOTE: Configure and get your appId from https://api.speechly.com/dashboard
      const speechly = new Client({
        appId: "your-app-id",
        debug: true,
        logSegments: true,
      })

      speechly.onSegmentChange(segment => {
        // Clean up and concatenate words
        let transcript = segment.words.map(w => w.value.toLowerCase()).filter(w => w !== "").join(" ");
        // Add trailing period upon segment end.
        if (segment.isFinal) transcript += ".";
        widget.value = transcript;
      });


      const startListening = async () => {
        speechly.startContext();
      }

      const stopListening = () => {
        if (speechly.isListening()) {
          speechly.stopContext();
        }
      }

      // Bind start listening to a widget hold, release anywhere to stop
      widget.addEventListener("mousedown", startListening)
      document.addEventListener("mouseup", stopListening)
    </script>
  </body>
  
</html>
```

## Documentation

You can find the detailed [browser-client API documentation](docs/classes/_index_d_.client.md) in the GitHub repository.

You can also refer to [Speechly Docs](https://docs.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=text) for more information.

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).

