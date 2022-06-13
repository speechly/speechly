[@speechly/react-client](../README.md) / [index](../modules/index.md) / DecoderState

# Enumeration: DecoderState

[index](../modules/index.md).DecoderState

All possible states of a Speechly API client. Failed state is non-recoverable.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Table of contents

### Enumeration members

- [Failed](index.DecoderState.md#failed)
- [Disconnected](index.DecoderState.md#disconnected)
- [Connected](index.DecoderState.md#connected)
- [Active](index.DecoderState.md#active)

## Enumeration members

### Failed

• **Failed** = `0`

___

### Disconnected

• **Disconnected** = `1`

___

### Connected

• **Connected** = `2`

___

### Active

• **Active** = `3`
