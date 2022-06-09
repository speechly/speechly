[@speechly/react-ui](../README.md) / BigTranscriptContainer

# Module: BigTranscriptContainer

## Table of contents

### Type aliases

- [BigTranscriptContainerProps](BigTranscriptContainer.md#bigtranscriptcontainerprops)

### Variables

- [BigTranscriptContainer](BigTranscriptContainer.md#bigtranscriptcontainer)

## Type aliases

### BigTranscriptContainerProps

Ƭ **BigTranscriptContainerProps**: `Object`

Properties for BigTranscriptContainer component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `position?` | `string` | The override value for CSS position (default: `"fixed"`). |
| `margin?` | `string` | The override value for CSS margin(default: `"3rem 2rem 0 2rem"`). |
| `children?` | `React.ReactNode` | - |

## Variables

### BigTranscriptContainer

• `Const` **BigTranscriptContainer**: `React.FC`<[`BigTranscriptContainerProps`](BigTranscriptContainer.md#bigtranscriptcontainerprops)\>

A React component that can be used for wrapping and positioning BigTranscript components.

The intended usage is as follows:

<BigTranscriptContainer>
  <BigTranscript />
</BigTranscriptContainer>

And then you can use CSS for styling the layout.
