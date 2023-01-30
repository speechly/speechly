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

With the Speechly browser client you can add voice features to any website. It handles authentication, audio capture, network streaming and connection management with the Speechly Streaming API.

If you are using React, you can use the [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client) instead. It provides the same functionalities, but provides a programming model that is idiomatic to React.

Check out the [browser client example](https://github.com/speechly/speechly/tree/main/examples/browser-client-example) for an example app built using this client.

🚧 Browser client `v2.0` is a breaking change. Read more about the major changes and how to upgrade from [our blog post](https://speechly.com/blog/speechly-browser-client-v2-released).

## Using in web sites built with eg. rollup

Install the package:

```shell
# Using Yarn
yarn add @speechly/browser-client

# Using NPM
npm install --save @speechly/browser-client
```

Start using the client:

```typescript
import { BrowserClient, BrowserMicrophone, Segment } from '@speechly/browser-client'

// Create a new client.
// NOTE: Configure and get your appId from https://api.speechly.com/dashboard
// NOTE: Set vad.enable to true for hands free use
const client = new BrowserClient({
  appId: 'your-app-id'
  vad: { enabled: false, noiseGateDb: -24.0 }
})

// Create a microphone
const microphone = new BrowserMicrophone()
// Initialize the microphone - this will ask the user for microphone permissions
// and establish the connection to Speechly API.
// Make sure you call `initialize` from a user action handler
// (e.g. from a button press handler).
await microphone.initialize()

// bind the microphone to the client
await client.attach(microphone.mediaStream)

// React to the updates from the API.
client.onSegmentChange((segment: Segment) => {
  console.log('Received new segment from the API:',
    segment.intent,
    segment.entities,
    segment.words,
    segment.isFinal
  )
})

// Start recording.
// This can be bound to e.g. a button press.
await client.start()

// Stop recording after a timeout.
// This can be bound to e.g. a button press.
setTimeout(async function () {
  await client.stop()
}, 3000)
```

## Usage in HTML

This sample HTML loads Speechly's `browser-client` ES modules via a CDN that mirrors npm packages. The page displays a text field that you dictate text into. See browser's console log for raw segment feed from Speechly.

Please use a HTML server to view the example. Running it as a file will not work due to browser's security restrictions. For example run `serve .` on command line and open `localhost:3000` in your browser.

```HTML
<html>
  <body>

    <input id="textBox" type="text" placeholder="Hold to talk..." autofocus />

    <script type="module">
      // Load Speechly ES module from a CDN. Note script type="module"
      import { BrowserClient, BrowserMicrophone } from "//unpkg.com/@speechly/browser-client?module=true"

      const widget = document.getElementById("textBox")

      // Create a Speechly client instance.
      // NOTE: Configure and get your appId from https://api.speechly.com/dashboard
      const speechly = new BrowserClient({
        appId: "your-app-id",
        debug: true,
        logSegments: true,
      })
      const microphone = new BrowserMicrophone()

      speechly.onSegmentChange(segment => {
        // Clean up and concatenate words
        let transcript = segment.words
          .map(w => w.value.toLowerCase())
          .join(" ");
        // Add trailing period upon segment end.
        if (segment.isFinal) transcript += ".";
        widget.value = transcript;
      });

      const startListening = async () => {
        if (microphone.mediaStream === undefined) {
          await microphone.initialize()
          await speechly.attach(microphone.mediaStream)
        }
        return speechly.start();
      }

      const stopListening = async () => {
        if (speechly.isActive()) {
          return speechly.stop();
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

- [API reference](https://github.com/speechly/speechly/blob/main/libraries/browser-client/docs/classes/client.BrowserClient.md) (GitHub)
- [Basic usage](https://dreamy-cori-a02de1.netlify.app/client-libraries/usage/) (Docs)
- [Example application](https://github.com/speechly/speechly/tree/main/examples/browser-client-example)

## Contributing

See contribution guide in [CONTRIBUTING.md](https://github.com/speechly/speechly/blob/main/CONTRIBUTING.md).
