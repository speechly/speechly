# Speechly Decoder for C Example

An example C program for using the Speechly Decoder library (`libSpeechlyDecoder`) for on-device transcription.

**Note:** on-device transcription is only available on [Enterprise plans](https://www.speechly.com/pricing)

This example assumes you are working on Linux, but the same steps work also on macOS.

## Get started

Before starting, make sure you have created and deployed a Speechly application. You will also need the `libSpeechlyDecoder.so` shared library, as well as the `Decoder.h` and `SpeechlyConstants.h` header files.

### Download model bundle

To use the Speechly Decoder Library you need a model bundle. These come in three varieties: Onnxruntime (ORT), Tensorflow Lite or CoreML, and your `libSpeechlyDecoder` library will support only one of these. In this example, we assume your version of the library is built for ORT.

Download an ORT model bundle from [Speechly Dashboard](https://api.speechly.com/dashboard) or using [Speechly CLI](https://github.com/speechly/cli):

```bash 
speechly download YOUR_APP_ID . --model ort
```

### Add dependencies

Put `Decoder.h`, `SpeechlyConstants.h`, `libSpeechlyDecoder.so` (assuming we are building on Linux) and `YOUR_MODEL_BUNDLE.ort.bundle` in the same directory as `c_decoder_test.c`.

You'll also need an audio file. Use an existing audio file, record your own or use our [sample audio file](https://funny-kashata-6dcdf0.netlify.app/audio/ndgt.wav). The example assumes you have a single channel 16-bit WAV file with a sample rate of 16kHz.

### Compile and run

Compile the program:

```bash
gcc -o decode c_decoder_test.c libSpeechlyDecoder.so
```

Run the program with an audio file and the model bundle as arguments:

```bash
LD_LIBRARY_PATH=. ./decode YOUR_MODEL_BUNDLE.ort.bundle file.wav
```

Your transcript will appear in the terminal.

## API reference

[Speechly Decoder API](https://funny-kashata-6dcdf0.netlify.app/reference/decoder/)
