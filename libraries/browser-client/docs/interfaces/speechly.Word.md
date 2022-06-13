[@speechly/browser-client](../README.md) / [speechly](../modules/speechly.md) / Word

# Interface: Word

[speechly](../modules/speechly.md).Word

A single word detected by the SLU API.

## Table of contents

### Properties

- [value](speechly.Word.md#value)
- [index](speechly.Word.md#index)
- [startTimestamp](speechly.Word.md#starttimestamp)
- [endTimestamp](speechly.Word.md#endtimestamp)
- [isFinal](speechly.Word.md#isfinal)

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

Start timestamp of the word from the start of the audio stream.

___

### endTimestamp

• **endTimestamp**: `number`

End timestamp of the word from start of the audio stream.

___

### isFinal

• **isFinal**: `boolean`

Whether the word was detected as final.
