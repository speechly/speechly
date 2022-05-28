[@speechly/browser-client](../README.md) / [client](../modules/client.md) / DecoderState

# Enumeration: DecoderState

[client](../modules/client.md).DecoderState

All possible states of a Speechly API client. Failed state is non-recoverable.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Table of contents

### Enumeration members

- [Failed](client.DecoderState.md#failed)
- [Disconnected](client.DecoderState.md#disconnected)
- [Connected](client.DecoderState.md#connected)
- [Active](client.DecoderState.md#active)

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
