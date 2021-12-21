# Speechly templates

This is a collection of simple React templates for [Speechly](https://www.speechly.com/) applications. They are built on top of create react app

Templates provide a starting point for any application. They can be expanded further to build more complex applications.

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

Navigate to [localhost:3000](http://localhost:3000). You should see your app running. Edit a file in `src`, save it, and reload the page to see your changes.

## Available templates

There are four templates available:

### [Empty](empty/)

This template is a blank canvas. Useful for speech-to-text applications, like text entry and note taking.

### [Product Filtering](product-filtering/)

This template provides a starting point for creating a product filtering experience.

### [Contact From](contact-form/)

This template provides a starting point for creating a contact form that can be interacted with using voice.

### [Command and Control](command-control/)

This template shows how to use Speechly for command-and-control. Useful for things like navigation and finding information on a site.

## Learn more

Head over to [docs.speechly.com](https://docs.speechly.com/) for more info and ideas about how to expand your voice application.
