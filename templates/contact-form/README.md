# Contact form template

This template provides a starting point for creating a contact form that can be interacted with using voice.

It's built on the standard [Create React App](https://create-react-app.dev/) template and comes with the following additional packages:

- [Speechly React client](https://www.npmjs.com/package/@speechly/react-client)
- [Speechly React UI](https://www.npmjs.com/package/@speechly/react-ui)

_Note that you will need to have [Node.js](https://nodejs.org) installed._

## Get started

Create and deploy your application in the [Speechly Dashboard](https://api.speechly.com/dashboard/)

Copy the template using [degit](https://github.com/Rich-Harris/degit) and install the dependencies

```bash
npx degit speechly/speechly/templates/contact-form my-app
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

Navigate to [localhost:3000](http://localhost:3000) and you should see your app running. Open the Developer Console to see speech segement outputs.

## Next steps

Once you have the application up and running, take it a step further by adding more input fields to the form.

#### You will need to

- Add new Entities and update your Configuration
- Update the UI to react to the new Configuration

#### Learn more

Head over to [docs.speechly.com](https://docs.speechly.com/) for more info and ideas about how to expand your voice application.

## Deploying to the web

One of the best ways to improve your application is to share it and gather feedback from users. Deploying your application using e.g. [Vercel](https://vercel.com) is very easy.

Install `vercel` if you haven't already

```bash
npm install -g vercel
```

Then, from within your project folder

```bash
vercel deploy --name my-app
```

Once the deploy is finish, you'll get an URL that you can share!

## Speechly CLI Tool 

If you prefer the terminal, [Speechly’s Command Line Tool](https://docs.speechly.com/dev-tools/command-line-client/) will be your new best friend. Efficiently integrate Speechly to your development workflow while having access to any Speechly feature straight from your terminal. 