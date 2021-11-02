[@speechly/react-ui](../README.md) / components/BigTranscriptContainer

# Module: components/BigTranscriptContainer

## Table of contents

### Type aliases

- [BigTranscriptContainerProps](components_BigTranscriptContainer.md#bigtranscriptcontainerprops)

### Variables

- [BigTranscriptContainer](components_BigTranscriptContainer.md#bigtranscriptcontainer)

## Type aliases

### BigTranscriptContainerProps

Ƭ **BigTranscriptContainerProps**: `Object`

Properties for BigTranscriptContainer component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `margin?` | `string` | The override value for CSS margin(default: `"3rem 2rem 0 2rem"`). |
| `position?` | `string` | The override value for CSS position (default: `"fixed"`). |

#### Defined in

[components/BigTranscriptContainer.tsx:10](https://github.com/speechly/react-ui/blob/e631dfa/src/components/BigTranscriptContainer.tsx#L10)

## Variables

### BigTranscriptContainer

• **BigTranscriptContainer**: `React.FC`<[`BigTranscriptContainerProps`](components_BigTranscriptContainer.md#bigtranscriptcontainerprops)\>

A React component that can be used for wrapping and positioning BigTranscript components.

The intended usage is as follows:

<BigTranscriptContainer>
  <BigTranscript />
</BigTranscriptContainer>

And then you can use CSS for styling the layout.

#### Defined in

[components/BigTranscriptContainer.tsx:56](https://github.com/speechly/react-ui/blob/e631dfa/src/components/BigTranscriptContainer.tsx#L56)
