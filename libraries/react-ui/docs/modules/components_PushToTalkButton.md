[@speechly/react-ui](../README.md) / components/PushToTalkButton

# Module: components/PushToTalkButton

## Table of contents

### Type aliases

- [PushToTalkButtonProps](components_PushToTalkButton.md#pushtotalkbuttonprops)

### Variables

- [PushToTalkButton](components_PushToTalkButton.md#pushtotalkbutton)

## Type aliases

### PushToTalkButtonProps

Ƭ **PushToTalkButtonProps**: `Object`

Properties for PushToTalkButton component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backgroundColor?` | `string` | Optional string (CSS color) for hint text background. Default: "#202020" |
| `captureKey?` | `string` | Keyboard key to use for controlling the button. Passing e.g. ` ` (a spacebar) will mean that holding down the spacebar key will key the button pressed. |
| `fontSize?` | `string` | Optional CSS string for hint text. Default: "1.2rem" |
| `gradientStops?` | `string`[] | Colours of the gradient around the button. Valid input is an array of two hex colour codes, e.g. `['#fff', '#000']`. |
| `hide?` | `boolean` | Optional boolean. Default: false |
| `hint?` | `string` | Optional string containing a short usage hint. Displayed on a short tap. Default: "Push to talk". Set to "" to disable. |
| `intro?` | `string` | Optional string containing a short usage introduction. Displayed when the component is first displayed. Default: "Push to talk". Set to "" to disable. |
| `placement?` | `string` | Optional "bottom" string turns on internal placement without any CSS positioning. |
| `powerOn?` | `boolean` | Optional boolean. Shows poweron state. If false, recording can immediately start but will first press will cause a system permission prompt. Default: false |
| `showTime?` | `number` | Optional number in ms. Visibility duration for intro and hint callouts. Default: "5000" (ms) |
| `size?` | `string` | The size of the button, as CSS (e.g. `5rem`). |
| `textColor?` | `string` | Optional string (CSS color) for hint text. Default: "#ffffff" |

#### Defined in

[components/PushToTalkButton.tsx:26](https://github.com/speechly/react-ui/blob/e631dfa/src/components/PushToTalkButton.tsx#L26)

## Variables

### PushToTalkButton

• **PushToTalkButton**: `React.FC`<[`PushToTalkButtonProps`](components_PushToTalkButton.md#pushtotalkbuttonprops)\>

A React component that renders a push-to-talk microphone button.

Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.

#### Defined in

[components/PushToTalkButton.tsx:87](https://github.com/speechly/react-ui/blob/e631dfa/src/components/PushToTalkButton.tsx#L87)
