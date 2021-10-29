# Speechly Demos

Speechly Demos is a Rush monorepository that contains multiple single-page web applications showcasing speech input with [Speechly](https://speechly.com). The demos are written in React/TypeScript using Speechly's React client libraries, UI components and Voice form components.

## Contents of the repository

### [Speech-to-text demo](https://www.speechly.com/technology/voice-api/speech-to-text/)

Demonstrates Speechly's raw speech-to-text capabilities. See below for [steps](#requirements) to build the demo yourself. You can also try the app deployed from this repository embedded on [Speechly's web site](https://www.speechly.com/technology/voice-api/speech-to-text/). Scroll down to find the push-to-talk button!

### [Flight booking demo](https://speechly-demos.herokuapp.com/flight-booking)

Demonstrates how to fill a booking form with text fields, dropdowns and checkboxes using both voice (VUI) and touch/type (GUI). The speech interface configuration has been set up to extract keywords (entities) like *departure* and *return date*, number of *passengers* and other relevant information for the use case. You can [try the deployed web app](https://speechly-demos.herokuapp.com/flight-booking) and say something like:

- _"Show me direct flights from New York to Miami for 2 passenger departing tomorrow."_

### [Checkout demo](https://speechly-demos.herokuapp.com/ecommerce-checkout)

Another demonstration of multimodal VUI/GUI form filling for entering recipient, shipping and payment details. The speech interface configuration has been set up to extract keywords (entities) like *name* and *phone number*, *email*, *shipping address* and other relevant information. You can [try the deployed web app](https://speechly-demos.herokuapp.com/ecommerce-checkout) and say something like:

- _"Name: Jane Smith, email jane at acme dot com."_

### Learn more

- [Speechly docs](https://docs.speechly.com)
- [Using React client libraries](https://docs.speechly.com/client-libraries/usage/?platform=React)
- [Using Speechly UI components](https://docs.speechly.com/client-libraries/ui-components/)
- [Using Speechly Voice forms](https://docs.speechly.com/client-libraries/voice-forms/)
- [Configuring the voice interface](https://docs.speechly.com/slu-examples/basics/)

## Built With
* [Node](https://nodejs.org/) (tested with v14.16.1)
* [Rush](https://rushjs.io/) (tested with 5.55.0)
* [React](https://reactjs.org/) (tested with major versions 16 and 17)
* [Typescript](https://www.typescriptlang.org/)
* [Speechly](https://github.com/speechly/react-client)

## Requirements

Check if you have the tools already installed

```bash
git --version
node --version
npm --version
rush -h
```

If necessary, install the build tools

- Install [git](https://github.com/git-guides/install-git)
- Install node and npm from <https://nodejs.org/>
- Install rush globally with npm: `npm install -g @microsoft/rush`

Clone this repository, if you haven't already:

```bash
# download the repository into `speechly-demos` folder
git clone git@github.com:speechly/speechly-demos.git
```
## Run and develop an application with Rush

```bash
# Update dependencies
rush update

# Build dependencies
rush build

# Run an app
cd applications/flight-booking-demo
rushx start
```

## Creating a new Speechly app

```bash
npx create-react-app applications/new-demo-app --template file:cra-template-speechly
cd applications/new-demo-app
rushx start
```

Remember to replace `YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD` in `src/App.tsx` with your owm app id.

To compile the new demo along with other project, add the following lines to "projects" array in `rush.json`:

```
{
  "packageName": "new-demo-app",
  "projectFolder": "applications/new-demo-app"
},
```

Then follow the steps to [Run and develop an existing application with Rush](#run-and-develop-an-application-with-rush)

## Developing a library against a sample app

In terminal 1, run this command to build library dependencies for `flight-booking-demo` and stay in watch mode to rebuild any changes to dependencies:

```
# Build dependency and stay in watch mode
rush build:watch --to-except flight-booking-demo
```

In terminal 2, run the app using the development server in watch mode
```
cd applications/flight-booking-demo
rushx start
```

## Basic rush skills

### Update/add a project dependency

```
rush add --package @speechly/react-ui@latest
```

#### Check for mis-matching dependencies across projects

```
rush check
```

## Using Voice form components

Add `@speechly/react-voice-forms` dependency to the project:

```
rush add --package @speechly/react-voice-forms
```

Include the components:

```
import {
  VoiceDatePicker,
  VoiceCheckbox,
  VoiceInput,
  VoiceSelect,
  VoiceToggle,
} from '@speechly/react-voice-forms';
```

Place the form components inside your `SpeechProvider` block:

```
<SpeechProvider appId="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD">
  <VoiceInput label="From" changeOnIntent="book" changeOnEntityType="from" />
</SpeechProvider>
```

### Styling Voice form components

Add a `voice-form-theme-mui.css` to your `src` folder, then include it in `index.tsx`:

```
import "voice-form-theme-mui.css";
```

### Publish a new version of @speechly/react-voice-forms

```
cd library/react-voice-forms
rush build
rushx docs
# Bump version
code package.json
git add .
git commit -m"vX.Y.Z"
git push
npm publish
# Use authenticator for one-time passwords
```
