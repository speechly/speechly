<div align="center" markdown="1">
<a href="https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header">
   <img src="https://d33wubrfki0l68.cloudfront.net/1e70457a60b0627de6ab966f1e0a40cf56f465f5/b4144/img/logo-speechly-colors.svg" height="48">
</a>

### Speechly is the Fast, Accurate, and Simple Voice Interface API for Web, Mobile and E‑commerce

[Website](https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

# Speechly Browser UI components

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
