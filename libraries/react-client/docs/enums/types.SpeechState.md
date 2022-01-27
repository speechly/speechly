[@speechly/react-client](../README.md) / [types](../modules/types.md) / SpeechState

# Enumeration: SpeechState

[types](../modules/types.md).SpeechState

The state of SpeechContext.

## Table of contents

### Enumeration members

- [Failed](types.SpeechState.md#failed)
- [NoBrowserSupport](types.SpeechState.md#nobrowsersupport)
- [NoAudioConsent](types.SpeechState.md#noaudioconsent)
- [Idle](types.SpeechState.md#idle)
- [Connecting](types.SpeechState.md#connecting)
- [Ready](types.SpeechState.md#ready)
- [Recording](types.SpeechState.md#recording)
- [Loading](types.SpeechState.md#loading)

## Enumeration members

### Failed

• **Failed** = `"Failed"`

The context is in a state of unrecoverable error.
It is only possible to fix this by destroying and creating it from scratch.

___

### NoBrowserSupport

• **NoBrowserSupport** = `"NoBrowserSupport"`

Current browser is not supported by Speechly - it's not possible to use speech functionality.

___

### NoAudioConsent

• **NoAudioConsent** = `"NoAudioConsent"`

The user did not provide permissions to use the microphone - it is not possible to use speech functionality.

___

### Idle

• **Idle** = `"Idle"`

The context has been created but not initialised. The audio and API connection are not enabled.

___

### Connecting

• **Connecting** = `"Connecting"`

The context is connecting to the API.

___

### Ready

• **Ready** = `"Ready"`

The context is ready to use.

___

### Recording

• **Recording** = `"Recording"`

The context is current recording audio and sending it to the API for recognition.
The results are also being fetched.

___

### Loading

• **Loading** = `"Loading"`

The context is waiting for the API to finish sending trailing responses.
No audio is being sent anymore.
