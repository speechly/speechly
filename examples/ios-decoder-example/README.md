# Speechly Decoder for iOS Example

An example iOS app for using the Speechly Decoder library for on-device transcription.

**Note:** on-device transcription is only available on [Enterprise plans](https://www.speechly.com/pricing)

## Before you start

Make sure you have created and deployed a Speechly application. For on-device use, only `small` models are supported.

## Download model bundle

Download a **Core ML** model bundle from [Speechly Dashboard](https://api.speechly.com/dashboard) or using [Speechly CLI](https://github.com/speechly/cli):

```bash 
speechly download YOUR_APP_ID . --model coreml
```

## Add dependencies

Open `Decoder.xcodeproj` and add both `SpeechlyDecoder.xcframework` and `YOUR_MODEL_BUNDLE.coreml.bundle` to the Xcode project by dragging and dropping it from Finder into the **Frameworks** folder:

![xcode 1](https://funny-kashata-6dcdf0.netlify.app/assets/images/xcode-1-a7c9b49f11553d05f134f20c74d5f538.png)

Make sure **Copy items if needed**, **Create groups** and **Add to targets** are selected:

![xcode 2](https://funny-kashata-6dcdf0.netlify.app/assets/images/xcode-2-a0769b3a2c091d6301e2bb67aeb86f12.png)

In `Decoder/SpeechlyManager.swift` update the model bundle resource URL:

```swift
let bundle = Bundle.main.url(forResource: "YOUR_MODEL_BUNDLE.coreml", withExtension: "bundle")!
```

## Run the app

Run the app and grant it microphone permissions when prompted.

## API reference

[Speechly Decoder API](https://funny-kashata-6dcdf0.netlify.app/reference/decoder/)