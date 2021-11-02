[@speechly/react-ui](../README.md) / components/ErrorPanel

# Module: components/ErrorPanel

## Table of contents

### Type aliases

- [ErrorPanelProps](components_ErrorPanel.md#errorpanelprops)

### Variables

- [ErrorPanel](components_ErrorPanel.md#errorpanel)

## Type aliases

### ErrorPanelProps

Ƭ **ErrorPanelProps**: `Object`

Properties for BigTranscript component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `placement?` | `string` | Optional "bottom" string turns on internal placement without any CSS positioning. |

#### Defined in

[components/ErrorPanel.tsx:18](https://github.com/speechly/react-ui/blob/e631dfa/src/components/ErrorPanel.tsx#L18)

## Variables

### ErrorPanel

• **ErrorPanel**: `React.FC`<[`ErrorPanelProps`](components_ErrorPanel.md#errorpanelprops)\>

An optional dismissable React component that renders an error message if something
prevents Speechly SDK from functioning. It also provides recovery instructions.
<ErrorPanel> responds to <PushToTalkButton> presses so it needs to exist somewhere in the component hierarchy.

It is intented to be displayed at the lower part of the screen like so:
<ErrorPanel placement="bottom"/>

#### Defined in

[components/ErrorPanel.tsx:35](https://github.com/speechly/react-ui/blob/e631dfa/src/components/ErrorPanel.tsx#L35)
