# Speechly Decoder for Android

An example Android app for using the Speechly Decoder library for on-device transcription.

**Note:** on-device transcription is only available on [Enterprise plans](https://www.speechly.com/pricing)

## Get started

Before starting, make sure you have created and deployed a Speechly application. For on-device use it's required to use a **small** model.

### Download model bundle

Download the **TensorFlow Lite** version of the model bundle from [Speechly Dashboard](https://api.speechly.com/dashboard) or using [Speechly CLI](https://github.com/speechly/cli):

```bash 
speechly download YOUR_APP_ID . --model tflite
```

### Add dependencies

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

![android studio](https://funny-kashata-6dcdf0.netlify.app/assets/images/android-studio-40a3fd8a2c541125b3aa76cce66552cd.png)

In `MainActicity.java` update the model bundle resource:

```java
this.bundle = loadAssetToByteBuffer("YOUR_MODEL_BUNDLE.tflite.bundle");
```

### Run the app

Run the app and grant it microphone permissions when prompted.


## API reference

[Speechly Decoder API](https://funny-kashata-6dcdf0.netlify.app/reference/decoder/)