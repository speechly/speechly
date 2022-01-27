[@speechly/react-client](../README.md) / [index](../modules/index.md) / ClientState

# Enumeration: ClientState

[index](../modules/index.md).ClientState

All possible states of a Speechly API client. Failed, NoBrowserSupport and NoAudioConsent states are non-recoverable
erroneous states, which should be handled by the end user, according to the semantics of an application.
Other states can also be utilized for e.g. enabling and disabling recording buttons or showing the status in the app.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Table of contents

### Enumeration members

- [Failed](index.ClientState.md#failed)
- [NoBrowserSupport](index.ClientState.md#nobrowsersupport)
- [NoAudioConsent](index.ClientState.md#noaudioconsent)
- [Disconnected](index.ClientState.md#disconnected)
- [Disconnecting](index.ClientState.md#disconnecting)
- [Connecting](index.ClientState.md#connecting)
- [Connected](index.ClientState.md#connected)
- [Starting](index.ClientState.md#starting)
- [Stopping](index.ClientState.md#stopping)
- [Recording](index.ClientState.md#recording)

## Enumeration members

### Failed

• **Failed** = `0`

___

### NoBrowserSupport

• **NoBrowserSupport** = `1`

___

### NoAudioConsent

• **NoAudioConsent** = `2`

___

### Disconnected

• **Disconnected** = `3`

___

### Disconnecting

• **Disconnecting** = `4`

___

### Connecting

• **Connecting** = `5`

___

### Connected

• **Connected** = `6`

___

### Starting

• **Starting** = `7`

___

### Stopping

• **Stopping** = `8`

___

### Recording

• **Recording** = `9`
