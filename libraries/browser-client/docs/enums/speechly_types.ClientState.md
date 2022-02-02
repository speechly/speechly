[@speechly/browser-client](../README.md) / [speechly/types](../modules/speechly_types.md) / ClientState

# Enumeration: ClientState

[speechly/types](../modules/speechly_types.md).ClientState

All possible states of a Speechly API client. Failed, NoBrowserSupport and NoAudioConsent states are non-recoverable
erroneous states, which should be handled by the end user, according to the semantics of an application.
Other states can also be utilized for e.g. enabling and disabling recording buttons or showing the status in the app.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Table of contents

### Enumeration members

- [Failed](speechly_types.ClientState.md#failed)
- [NoBrowserSupport](speechly_types.ClientState.md#nobrowsersupport)
- [NoAudioConsent](speechly_types.ClientState.md#noaudioconsent)
- [Disconnected](speechly_types.ClientState.md#disconnected)
- [Disconnecting](speechly_types.ClientState.md#disconnecting)
- [Connecting](speechly_types.ClientState.md#connecting)
- [Connected](speechly_types.ClientState.md#connected)
- [Starting](speechly_types.ClientState.md#starting)
- [Stopping](speechly_types.ClientState.md#stopping)
- [Recording](speechly_types.ClientState.md#recording)

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
