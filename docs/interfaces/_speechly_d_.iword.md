[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [IWord](_speechly_d_.iword.md)

# Interface: IWord

A single word detected by the SLU API.

## Hierarchy

* **IWord**

## Index

### Properties

* [endTimestamp](_speechly_d_.iword.md#endtimestamp)
* [index](_speechly_d_.iword.md#index)
* [isFinal](_speechly_d_.iword.md#isfinal)
* [startTimestamp](_speechly_d_.iword.md#starttimestamp)
* [value](_speechly_d_.iword.md#value)

## Properties

###  endTimestamp

• **endTimestamp**: *number*

Defined in speechly.d.ts:261

End timestamp of the word within the audio of the context.

___

###  index

• **index**: *number*

Defined in speechly.d.ts:253

The index of the word within a segment.

___

###  isFinal

• **isFinal**: *boolean*

Defined in speechly.d.ts:265

Whether the word was detected as final.

___

###  startTimestamp

• **startTimestamp**: *number*

Defined in speechly.d.ts:257

Start timestamp of the word within the audio of the context.

___

###  value

• **value**: *string*

Defined in speechly.d.ts:249

The value of the word.
