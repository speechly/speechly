# Speechly templates

Collection of simple React templates for [Speechly](https://www.speechly.com/) applications. Templates provide a starting point for any application. They can be expanded further to build more complex applications.

All templates are built on the standard [Create React App](https://create-react-app.dev/) template and comes with the following additional packages:

- [Speechly React client](https://www.npmjs.com/package/@speechly/react-client)
- [Speechly React UI](https://www.npmjs.com/package/@speechly/react-ui)

_Note that you will need to have [Node.js](https://nodejs.org) installed._


## Get started

Create and deploy your application in the [Speechly Dashboard](https://api.speechly.com/dashboard/)

Copy the template using [degit](https://github.com/Rich-Harris/degit) and install the dependencies

```bash
npx degit speechly/speechly/templates/<template-name> my-app
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

## Available templates

There are four templates available:

### [Empty](empty/)

This template is a blank canvas. Useful for speech-to-text applications, like text entry and note taking.

### [Product filtering](product-filtering/)

This template provides a starting point for creating a product filtering experience.

### [Contact from](contact-form/)

This template provides a starting point for creating a contact form that can be interacted with using voice.

### [Command and control](command-control/)

This template shows how to use Speechly for command-and-control. Useful for things like navigation and finding information on a site.
