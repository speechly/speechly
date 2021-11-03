[@speechly/react-ui](../README.md) / components/PushToTalkContainer

# Module: components/PushToTalkContainer

## Table of contents

### Type aliases

- [PushToTalkContainerProps](components_PushToTalkContainer.md#pushtotalkcontainerprops)

### Variables

- [PushToTalkButtonContainer](components_PushToTalkContainer.md#pushtotalkbuttoncontainer)

## Type aliases

### PushToTalkContainerProps

Ƭ **PushToTalkContainerProps**: `Object`

Properties for BigTranscriptContainer component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `size?` | `string` | Optional string (CSS). Defines the button frame width and height. Default: "6rem" |
| `voffset?` | `string` | Optional CSS string. Vertical distance from viewport edge. Default: "3rem" |

#### Defined in

[components/PushToTalkContainer.tsx:9](https://github.com/speechly/react-ui/blob/e631dfa/src/components/PushToTalkContainer.tsx#L9)

## Variables

### PushToTalkButtonContainer

• **PushToTalkButtonContainer**: `React.FC`<[`PushToTalkContainerProps`](components_PushToTalkContainer.md#pushtotalkcontainerprops)\>

A React component that can be used for wrapping and positioning PushToTalkButton components.

The intended usage is as follows:

<PushToTalkButtonContainer>
  <PushToTalkButton />
</PushToTalkButtonContainer>

And then you can use CSS for styling the layout.

#### Defined in

[components/PushToTalkContainer.tsx:52](https://github.com/speechly/react-ui/blob/e631dfa/src/components/PushToTalkContainer.tsx#L52)
