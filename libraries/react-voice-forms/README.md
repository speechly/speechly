<div align="center" markdown="1">
<br/>

![speechly-logo-duo-black](https://user-images.githubusercontent.com/2579244/193574443-130d16d6-76f1-4401-90f2-0ed753b39bc0.svg)

[Website](https://www.speechly.com/)
&ensp;&middot;&ensp;
[Docs](https://docs.speechly.com/)
&ensp;&middot;&ensp;
[Support](https://github.com/speechly/speechly/discussions)
&ensp;&middot;&ensp;
[Blog](https://www.speechly.com/blog/)
&ensp;&middot;&ensp;
[Login](https://api.speechly.com/dashboard/)

<br/>
</div>

# Speechly voice form components for React

![build](https://img.shields.io/github/actions/workflow/status/speechly/speechly/build.yaml?branch=main&logo=github)
[![npm](https://img.shields.io/npm/v/@speechly/react-voice-forms?color=cb3837&logo=npm)](https://www.npmjs.com/package/@speechly/react-voice-forms)
[![license](http://img.shields.io/:license-mit-blue.svg)](/LICENSE)

Ready made form components that can be controlled with voice, tap, pointer and keyboard. Voice form components are an experimental feature.

Also check out the [full documentation](https://docs.speechly.com/client-libraries/voice-forms/)!

### Usage

Add `@speechly/react-voice-forms` dependency to the project:

```
npm i @speechly/react-voice-forms
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
  <VoiceInput label="From" changeOnEntityType="from" />
</SpeechProvider>
```

### Styling

Add a `voice-form-theme-mui.css` to your `src` folder, then include it in `index.tsx`:

```
import "voice-form-theme-mui.css";
```

