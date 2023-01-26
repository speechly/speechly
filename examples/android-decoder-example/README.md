# Speechly Decoder for Android example

An example Android app for using the Speechly Decoder library for on-device transcription.

**Note:** on-device transcription is only available on [Enterprise plans](https://www.speechly.com/pricing)

## Before you start

Make sure you have created and deployed a Speechly application. For on-device use, only `small` models are supported.

You will also need a **TensorFlow Lite** model bundle and the `SpeechlyDecoder.aar` library.

## Download model bundle

To use the Speechly Decoder library you need a model bundle. Download a **TensorFlow Lite** model bundle from [Speechly Dashboard](https://api.speechly.com/dashboard) or using [Speechly CLI](https://github.com/speechly/cli):

```bash 
speechly download YOUR_APP_ID . --model tflite
```

## Copy the example app

Copy the example app using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit speechly/speechly/examples/android-decoder-example my-android-app
cd my-android-app
```

## Add dependencies

Put `SpeechlyDecoder.aar` in a directory that gradle can find. For example, add a `flatDir` field to the repositories section in your `settings.gradle`:

```bash
pluginManagement {
    repositories {
        flatDir {
          dirs '/path/to/decoder'
        }
    }
}
```

In your `build.gradle` dependencies section add:

```bash
dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.9.0'
    implementation(name:'SpeechlyDecoder', ext:'aar')
}
```

If the file is packaged as part of the application, it may be good to ensure that it is not compressed when building the `.apk` by updating the android section in your `build.gradle`:

```bash
android {
    aaptOptions {
        noCompress 'bundle''
    }
}
```

Open `DecoderTest` in Android Studio and add `YOUR_MODEL_BUNDLE.tflite.bundle` to the project by dragging and dropping it into the **build/src/main/assets** folder:

![android studio](https://docs.speechly.com/assets/images/android-studio-40a3fd8a2c541125b3aa76cce66552cd.png)

In `MainActicity.java` update the model bundle resource:

```java
this.bundle = loadAssetToByteBuffer("YOUR_MODEL_BUNDLE.tflite.bundle");
```

## Run the app

Run the app and grant it microphone permissions when prompted.

## API reference

[Speechly Decoder API](https://docs.speechly.com/reference/decoder/)
