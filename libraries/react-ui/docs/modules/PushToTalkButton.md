[@speechly/react-ui](../README.md) / PushToTalkButton

# Module: PushToTalkButton

## Table of contents

### Type aliases

- [PushToTalkButtonProps](PushToTalkButton.md#pushtotalkbuttonprops)

### Variables

- [PushToTalkButton](PushToTalkButton.md#pushtotalkbutton)

## Type aliases

### PushToTalkButtonProps

Ƭ **PushToTalkButtonProps**: `Object`

Properties for PushToTalkButton component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `placement?` | `string` | Optional "bottom" string turns on internal placement without any CSS positioning. |
| `captureKey?` | `string` | Keyboard key to use for controlling the button. Passing e.g. ` ` (a spacebar) will mean that holding down the spacebar key will key the button pressed. |
| `size?` | `string` | The size of the button, as CSS (e.g. `5rem`). |
| `gradientStops?` | `string`[] | Colours of the gradient around the button. Valid input is an array of two hex colour codes, e.g. `['#fff', '#000']`. |
| `hide?` | `boolean` | Optional boolean. Default: false |
| `intro?` | `string` | Optional string containing a short usage introduction. Displayed when the component is first displayed. Default: "Push to talk". Set to "" to disable. |
| `hint?` | `string` | Optional string containing a short usage hint. Displayed on a short tap. Default: "Push to talk". Set to "" to disable. |
| `fontSize?` | `string` | Optional CSS string for hint text. Default: "1.2rem" |
| `showTime?` | `number` | Optional number in ms. Visibility duration for intro and hint callouts. Default: "5000" (ms) |
| `textColor?` | `string` | Optional string (CSS color) for hint text. Default: "#ffffff" |
| `backgroundColor?` | `string` | Optional string (CSS color) for hint text background. Default: "#202020" |
| `powerOn?` | `boolean` \| ``"auto"`` | Optional boolean. Shows poweron state. If false, recording can immediately start but will first press will cause a system permission prompt. Default: false |
| `voffset?` | `string` | Optional CSS string. Vertical distance from viewport edge. Only effective when using placement. |
| `tapToTalkTime?` | `number` | Optional time in milliseconds to listen after tap. Set to 0 to disable tap-to-talk. Default: "8000" (ms) |
| `silenceToHangupTime?` | `number` | Optional milliseconds of silence to listen before hangup. Only used in tap-to-talk mode. Default: "1000" (ms) |

## Variables

### PushToTalkButton

• `Const` **PushToTalkButton**: `React.FC`<[`PushToTalkButtonProps`](PushToTalkButton.md#pushtotalkbuttonprops)\>
