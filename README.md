# Speechly Demos
Monorepo containing Speechly Application demos

### Built With
* [Node](https://nodejs.org/) (tested with v14.16.1)
* [Rush](https://rushjs.io/) (tested with 5.55.0)
* [Typescript](https://www.typescriptlang.org/)
* [Speechly](https://github.com/speechly/react-client)
* [React](https://reactjs.org/)

### Requirements

Check if you have the tools already installed

```
node --version
npm --version
rush -h
```

If necessary, install the build tools

- Install node and npm from <https://nodejs.org/>
- Install rush globally with npm: `npm install -g @microsoft/rush`

### Run an application locally using Rush

```
rush update
rush build
cd applications/flight-booking-demo
rushx start
```

### Create builds of all apps

```
rush build
```

### Develop a library in watch mode while testing it in a sample app

```
# Build dependency and stay in watch mode
rush build:watch --to @speechly/react-voice-forms &

# Start an app using the dependency
cd applications/flight-booking-demo
rushx start
```

### Update/add a project dependency

```
rush add --package @speechly/react-ui@latest
```

#### Check for mis-matching dependencies across projects

```
rush check
```

### Creating a new demo

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

### Using Voice form components

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
