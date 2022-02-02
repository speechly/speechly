[@speechly/browser-client](../README.md) / [speechly/types](../modules/speechly_types.md) / Word

# Interface: Word

[speechly/types](../modules/speechly_types.md).Word

A single word detected by the SLU API.

## Table of contents

### Properties

- [value](speechly_types.Word.md#value)
- [index](speechly_types.Word.md#index)
- [startTimestamp](speechly_types.Word.md#starttimestamp)
- [endTimestamp](speechly_types.Word.md#endtimestamp)
- [isFinal](speechly_types.Word.md#isfinal)

## Properties

### value

• **value**: `string`

The value of the word.

___

### index

• **index**: `number`

The index of the word within a segment.

___

### startTimestamp

• **startTimestamp**: `number`

Start timestamp of the word within the audio of the context.

___

### endTimestamp

• **endTimestamp**: `number`

End timestamp of the word within the audio of the context.

___

### isFinal

• **isFinal**: `boolean`

Whether the word was detected as final.
