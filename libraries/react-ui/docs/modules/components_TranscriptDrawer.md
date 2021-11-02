[@speechly/react-ui](../README.md) / components/TranscriptDrawer

# Module: components/TranscriptDrawer

## Table of contents

### Type aliases

- [TranscriptDrawerProps](components_TranscriptDrawer.md#transcriptdrawerprops)

### Variables

- [TranscriptDrawer](components_TranscriptDrawer.md#transcriptdrawer)

## Type aliases

### TranscriptDrawerProps

Ƭ **TranscriptDrawerProps**: `Object`

Properties for BigTranscript component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backgroundColor?` | `string` | Optional string (CSS color) for hint text background. Default: "#202020" |
| `color?` | `string` | Optional string (CSS color) for text. Default: "#ffffff" |
| `fontSize?` | `string` | Optional CSS string for text size. Default: "1.5rem" |
| `formatText?` | `boolean` | Optional boolean. If true, transcript is formatted with detected entities, e.g. numbers. Default: true |
| `height?` | `string` | Optional minimum height as CSS string. Default: "8rem" |
| `highlightColor?` | `string` | Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5" |
| `hint?` | `string` \| `string`[] | Optional hint text or array |
| `hintFontSize?` | `string` | Optional CSS string for hint text size. Default: "0.9rem" |
| `marginBottom?` | `string` | Optional string (CSS dimension). Dynamic margin added when element is visible. Default: "0rem" |
| `mockSegment?` | `SpeechSegment` | Optional SpeechSegment to be displayed instead of actual transcription from API. Can be used to demonstrate voice functionality to the user. |
| `placement?` | `string` | Optional "top" string turns on internal placement without any CSS positioning. |
| `smallTextColor?` | `string` | Optional string (CSS color) for hint text. Default: "#ffffff70" |

#### Defined in

[components/TranscriptDrawer.tsx:20](https://github.com/speechly/react-ui/blob/e631dfa/src/components/TranscriptDrawer.tsx#L20)

## Variables

### TranscriptDrawer

• **TranscriptDrawer**: `React.FC`<[`TranscriptDrawerProps`](components_TranscriptDrawer.md#transcriptdrawerprops)\>

A React component that renders the transcript and entities received from Speechly SLU API.

The component is intended to be used for providing visual feedback to the speaker.

#### Defined in

[components/TranscriptDrawer.tsx:78](https://github.com/speechly/react-ui/blob/e631dfa/src/components/TranscriptDrawer.tsx#L78)
