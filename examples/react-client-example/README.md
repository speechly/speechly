# Speechly React Client Example

Example web application showcasing the usage of [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client). Built with [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client), [Typescript](https://www.typescriptlang.org) and [Create React App](https://create-react-app.dev/).

## Before you start

To get started with Speechly, you'll need a [Speechly account](https://api.speechly.com/dashboard/) and a Speechly application that's using a Conformer model. Follow our [quick start guide](https://docs.speechly.com/basics/getting-started) to get started.

## Installation

Copy the example app using [degit](https://github.com/Rich-Harris/degit), or open it in [StackBlitz](https://stackblitz.com/github/speechly/speechly/tree/main/examples/react-client-example).

```bash
npx degit speechly/speechly/examples/react-client-example my-app
cd my-app
```

Add the **App ID** of your Speechly application into `src/index.tsx`. Get your App ID from [Speechly Dashboard](https://api.speechly.com/dashboard/) or by using [Speechly CLI](https://docs.speechly.com/features/cli) `list` command. 

```tsx
<SpeechProvider
  appId="YOUR-APP-ID"
  debug={true}
  logSegments={true}
  vad={{ enabled: false }}
>
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

- [API reference](https://github.com/speechly/speechly/blob/main/libraries/react-client/docs/classes/context.SpeechProvider.md) (GitHub)
