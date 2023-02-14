# Speechly Browser Client Example

Example web application showcasing the usage of [Speechly Browser Client](https://github.com/speechly/speechly/tree/main/libraries/browser-client). Built with [Speechly Browser Client](https://github.com/speechly/speechly/tree/main/libraries/browser-client), vanilla JavaScript and [Parcel](https://parceljs.org/).

## Getting started

You'll need a [Speechly account](https://api.speechly.com/dashboard/) and a Speechly application that's using a Conformer model. Follow our [quick start guide](https://docs.speechly.com/basics/getting-started) to get started.

## Installation

Copy the example app using [degit](https://github.com/Rich-Harris/degit).

```bash
npx degit speechly/speechly/examples/browser-client-example my-app
cd my-app
```

Add the **App ID** of your Speechly application into `src/app.js`. Get your App ID from [Speechly Dashboard](https://api.speechly.com/dashboard/) or by using [Speechly CLI](https://docs.speechly.com/features/cli) `list` command.

```ts
const client = new BrowserClient({
  appId: 'YOUR-APP-ID',
  logSegments: true,
  debug: true,
  vad: { enabled: isVadEnabled },
});
```

Install dependencies and start development server.

```bash
npm install
npm start
```

## Enabling NLU features

By default, NLU features are disabled and Speechly operates in speech-to-text mode. To enable them, you’ll need to provide a configuration for your application. The example application will list the intent and entities for each speech segment below the transcript.

[See our docs to learn more](https://docs.speechly.com/features/intents-entities).

## Documentation

- [API reference](https://github.com/speechly/speechly/blob/main/libraries/browser-client/docs/classes/client.BrowserClient.md) (GitHub)
