# Empty template

This template is a blank canvas. Useful for speech-to-text applications, like text entry and note taking.

## Get started

Create and deploy your application in the [Speechly Dashboard](https://api.speechly.com/dashboard/)

Copy the template using [degit](https://github.com/Rich-Harris/degit) and install the dependencies

```bash
npx degit speechly/speechly/templates/empty my-app
cd my-app
npm install
```

Add your `App ID` to `src/index.js`, you can get it from the [Speechly Dashboard](https://api.speechly.com/dashboard/)

```js
// index.js
<SpeechProvider appId="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD">
```

Start the development server

```bash
npm start
```

Navigate to [localhost:3000](http://localhost:3000). You should see your app running. Edit a file in `src`, save it, and reload the page to see your changes.

## Learn more

Head over to [docs.speechly.com](https://docs.speechly.com/) for more info and ideas about how to expand your voice application.
