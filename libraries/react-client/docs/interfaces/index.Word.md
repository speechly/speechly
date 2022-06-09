[@speechly/react-client](../README.md) / [index](../modules/index.md) / Word

# Interface: Word

[index](../modules/index.md).Word

A single word detected by the SLU API.

## Table of contents

### Properties

- [value](index.Word.md#value)
- [index](index.Word.md#index)
- [startTimestamp](index.Word.md#starttimestamp)
- [endTimestamp](index.Word.md#endtimestamp)
- [isFinal](index.Word.md#isfinal)

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
