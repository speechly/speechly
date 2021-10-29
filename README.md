# Speechly Demos

Speechly Demos is a Rush monorepository that contains multiple demo applications (in `applications` folder) and libraries (in `libraries`) folder that build on Speechly voice input technology.

Demos are written in React v16/17 using React hooks.

## Built With
* [Node](https://nodejs.org/) (tested with v14.16.1)
* [Rush](https://rushjs.io/) (tested with 5.55.0)
* [Typescript](https://www.typescriptlang.org/)
* [Speechly](https://github.com/speechly/react-client)
* [React](https://reactjs.org/)

## Requirements

Check if you have the tools already installed

```
node --version
npm --version
rush -h
```

If necessary, install the build tools

- Install node and npm from <https://nodejs.org/>
- Install rush globally with npm: `npm install -g @microsoft/rush`

## Run and develop an application with Rush

```
# Update dependencies
rush update

# Build dependencies
rush build

# Run an app
cd applications/flight-booking-demo
rushx start
```

## Creating a new Speechly app

```
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
