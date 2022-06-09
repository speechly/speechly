[@speechly/browser-client](../README.md) / microphone

# Module: microphone

## Table of contents

### Classes

- [BrowserMicrophone](../classes/microphone.BrowserMicrophone.md)

### Variables

- [ErrNotInitialized](microphone.md#errnotinitialized)
- [ErrAlreadyInitialized](microphone.md#erralreadyinitialized)
- [ErrNoAudioConsent](microphone.md#errnoaudioconsent)

### Enumerations

- [AudioSourceState](../enums/microphone.AudioSourceState.md)

## Variables

### ErrNotInitialized

• `Const` **ErrNotInitialized**: `Error`

Error to be thrown when the microphone was accessed before it was initialized.

___

### ErrAlreadyInitialized

• `Const` **ErrAlreadyInitialized**: `Error`

Error to be thrown when the initialize method of a Microphone instance is called more than once.

___

### ErrNoAudioConsent

• `Const` **ErrNoAudioConsent**: `Error`

Error to be thrown when user did not give consent to the application to record audio.
