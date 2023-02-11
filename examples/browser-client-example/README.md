# Speechly Browser Client Example

Example web application showcasing the usage of [Speechly browser client](https://github.com/speechly/speechly/tree/main/libraries/browser-client). Built with [Speechly browser client](https://github.com/speechly/speechly/tree/main/libraries/browser-client), [Typescript](https://www.typescriptlang.org) and [Parcel](https://parceljs.org/).

## Before you start

To get started with Speechly, you'll need a [Speechly account](https://api.speechly.com/dashboard/) and a Speechly application that's using a Conformer model. Follow our [quick start guide](https://docs.speechly.com/basics/getting-started) to get started.

## Run locally

Add your **App ID** into `src/app.ts`. You can find your App ID from [Speechly Dashboard](https://api.speechly.com/dashboard/) or by using [Speechly CLI](https://docs.speechly.com/features/cli) `list` command.

```ts
const client = new BrowserClient({
  appId: 'YOUR-APP-ID',
  logSegments: true,
  debug: true,
  vad: { enabled: isVadEnabled },
});
```

Install dependencies: 

```
npm install
```

Start development server:

```
npm start
```

## Open in StackBlitz

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/speechly/speechly/tree/main/examples/browser-client-example)
