# Empty template

This template shows how to use Speechly for command-and-control. Useful for things like navigation and finding information on a site.

## Get started

Create and deploy your application in the [Speechly Dashboard](https://api.speechly.com/dashboard/)

Copy the template using [degit](https://github.com/Rich-Harris/degit) and install the dependencies

```bash
npx degit speechly/speechly/templates/command-control my-app
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

## Next steps

Once you have the applcation up and running, why not take it a step further by introducing more sections to the page.

You will need to:

- Add new Intents and update your SAL Configuration
- Update the UI to react to the new SAL Configuration

Head over to [docs.speechly.com](https://docs.speechly.com/) for more info and ideas about how to expand your voice application.

## Speechly CLI Tool 

If you prefer the terminal, [Speechly’s Command Line Tool](https://docs.speechly.com/dev-tools/command-line-client/) will be your new best friend. Efficiently integrate Speechly to your development workflow while having access to any Speechly feature straight from your terminal. 