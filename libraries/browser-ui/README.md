# Browser UI

Speechly UI components provide the visual interface to support voice functionality. This package contains Speechly UI as Web Components that can be used in most browsers via CDN or npm.

See Web Component [documentation](https://docs.speechly.com/client-libraries/ui-components/) for details.

## Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1)

### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Svelte 3](https://svelte.dev/)
* [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling for Push-To-Talk Button component

## Using browser-ui in React

```
import "browser-ui/push-to-talk-button";
import "browser-ui/big-transcript";
import "browser-ui/speechly-ui.css";

<div className="BigTranscriptContainer">
    <big-transcript></big-transcript>
</div>
<div className="PushToTalkContainer">
    <push-to-talk-button appid="1234"></push-to-talk-button>
</div>
```

- Notes: Copying .js from browser-ui directly resulted in compile errors in React project, so using packages solves this problem.
