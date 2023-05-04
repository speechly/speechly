# Speechly Decoder for iOS example

An example iOS app for using the Speechly Decoder library for on-device transcription.

> **Note**  
> Deploying Speechly on-device is only available on [Enterprise plans](https://www.speechly.com/pricing)

## Before you start

Before starting, make sure you have:

- Created a Speechly application. For on-device use, only `small` models are currently supported.
- You will also need the **Core ML** model bundle and the **Speechly Decoder** iOS library.

## Download model bundle and library

Log in to [Speechly Dashboard](https://api.speechly.com/dashboard) and select your **Application**.

#### Model bundle

1. In the **Overeviw** tab, go to the **Model** section
1. Click the **Core ML** model bundle to download it

#### Speechly Decoder library

1. In the **Integrate** tab, go to the **Speechly On-device SDKs** section
1. Click the **Download SDK** to download it

## Copy the example app

Copy the example app using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit speechly/speechly/examples/ios-decoder-example my-ios-app
cd my-ios-app
```

## Add dependencies

Open `Decoder.xcodeproj` and add both `SpeechlyDecoder.xcframework` and `YOUR_MODEL_BUNDLE.coreml.bundle` to the Xcode project by dragging and dropping it from Finder into the **Frameworks** folder:

![xcode 1](https://docs.speechly.com/assets/images/xcode-1-a7c9b49f11553d05f134f20c74d5f538.png)

Make sure **Copy items if needed**, **Create groups** and **Add to targets** are selected:

![xcode 2](https://docs.speechly.com/assets/images/xcode-2-a0769b3a2c091d6301e2bb67aeb86f12.png)

In `Decoder/SpeechlyManager.swift` update the model bundle resource URL:

```swift
let bundle = Bundle.main.url(forResource: "YOUR_MODEL_BUNDLE.coreml", withExtension: "bundle")!
```

## Run the app

Run the app and grant it microphone permissions when prompted.

## API reference

[Speechly Decoder API](https://docs.speechly.com/reference/decoder/)
