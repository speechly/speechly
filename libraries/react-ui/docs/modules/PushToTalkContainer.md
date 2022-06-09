[@speechly/react-ui](../README.md) / PushToTalkContainer

# Module: PushToTalkContainer

## Table of contents

### Type aliases

- [PushToTalkContainerProps](PushToTalkContainer.md#pushtotalkcontainerprops)

### Variables

- [PushToTalkButtonContainer](PushToTalkContainer.md#pushtotalkbuttoncontainer)

## Type aliases

### PushToTalkContainerProps

Ƭ **PushToTalkContainerProps**: `Object`

Properties for BigTranscriptContainer component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `size?` | `string` | Optional string (CSS). Defines the button frame width and height. Default: "6rem" |
| `voffset?` | `string` | Optional CSS string. Vertical distance from viewport edge. Default: "3rem" |
| `children?` | `React.ReactNode` | - |

## Variables

### PushToTalkButtonContainer

• `Const` **PushToTalkButtonContainer**: `React.FC`<[`PushToTalkContainerProps`](PushToTalkContainer.md#pushtotalkcontainerprops)\>

A React component that can be used for wrapping and positioning PushToTalkButton components.

The intended usage is as follows:

<PushToTalkButtonContainer>
  <PushToTalkButton />
</PushToTalkButtonContainer>

And then you can use CSS for styling the layout.
