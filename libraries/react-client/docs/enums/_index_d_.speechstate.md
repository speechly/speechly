**[@speechly/react-client](../README.md)**

> [Globals](../README.md) / ["index.d"](../modules/_index_d_.md) / SpeechState

# Enumeration: SpeechState

The state of SpeechContext.

## Index

### Enumeration members

* [Connecting](_index_d_.speechstate.md#connecting)
* [Failed](_index_d_.speechstate.md#failed)
* [Idle](_index_d_.speechstate.md#idle)
* [Loading](_index_d_.speechstate.md#loading)
* [NoAudioConsent](_index_d_.speechstate.md#noaudioconsent)
* [NoBrowserSupport](_index_d_.speechstate.md#nobrowsersupport)
* [Ready](_index_d_.speechstate.md#ready)
* [Recording](_index_d_.speechstate.md#recording)

## Enumeration members

### Connecting

•  **Connecting**:  = "Connecting"

*Defined in dist/index.d.ts:182*

The context is connecting to the API.

___

### Failed

•  **Failed**:  = "Failed"

*Defined in dist/index.d.ts:166*

The context is in a state of unrecoverable error.
It is only possible to fix this by destroying and creating it from scratch.

___

### Idle

•  **Idle**:  = "Idle"

*Defined in dist/index.d.ts:178*

The context has been created but not initialised. The audio and API connection are not enabled.

___

### Loading

•  **Loading**:  = "Loading"

*Defined in dist/index.d.ts:196*

The context is waiting for the API to finish sending trailing responses.
No audio is being sent anymore.

___

### NoAudioConsent

•  **NoAudioConsent**:  = "NoAudioConsent"

*Defined in dist/index.d.ts:174*

The user did not provide permissions to use the microphone - it is not possible to use speech functionality.

___

### NoBrowserSupport

•  **NoBrowserSupport**:  = "NoBrowserSupport"

*Defined in dist/index.d.ts:170*

Current browser is not supported by Speechly - it's not possible to use speech functionality.

___

### Ready

•  **Ready**:  = "Ready"

*Defined in dist/index.d.ts:186*

The context is ready to use.

___

### Recording

•  **Recording**:  = "Recording"

*Defined in dist/index.d.ts:191*

The context is current recording audio and sending it to the API for recognition.
The results are also being fetched.
