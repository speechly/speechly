# Speechly React Client Example

Example React app showcasing the usage of Speechly React Client. Built with [Speechly React Client](https://github.com/speechly/speechly/tree/main/libraries/react-client), [Typescript](https://www.typescriptlang.org) and [Create React App](https://create-react-app.dev/).

## Getting started

You'll need a [Speechly account](https://api.speechly.com/dashboard/) and a Speechly application that's using a Conformer model. Follow our [quick start guide](https://docs.speechly.com/basics/getting-started) to get started with Speechly.

## Installation

Open in [CodeSandbox](https://codesandbox.io/s/github/speechly/speechly/tree/main/examples/react-client-example?file=/README.md), or copy the example app using [degit](https://github.com/Rich-Harris/degit).

```bash
npx degit speechly/speechly/examples/react-client-example my-app
cd my-app
```

Add the **App ID** of your Speechly application into `src/index.tsx`.

```jsx
<SpeechProvider
  appId="YOUR-APP-ID" // Get your App ID from: https://api.speechly.com/dashboard/
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

- [Building a React app using Speechly React Client](https://docs.speechly.com/reference/client-libraries/react-client#react-to-api-updates)
- [API reference](https://github.com/speechly/speechly/blob/main/libraries/react-client/docs/classes/context.SpeechProvider.md) (GitHub)
- [NPM package](https://www.npmjs.com/package/@speechly/react-client)
