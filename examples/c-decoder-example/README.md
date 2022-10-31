# Speechly Decoder for C Example

An example C program for using the Speechly Decoder library for on-device transcription.

**Note:** on-device transcription is only available on [Enterprise plans](https://www.speechly.com/pricing)

## Get started

Before starting, make sure you have created and deployed a Speechly application. For on-device use it's required to use a **small** model.

### Download model bundle

Download the **ONNX Runtime** version of the model bundle from [Speechly Dashboard](https://api.speechly.com/dashboard) or using [Speechly CLI](https://github.com/speechly/cli):

```bash 
speechly download YOUR_APP_ID . --model ort
```

### Add dependencies

Put `Decoder.h` and `YOUR_MODEL_BUNDLE.ort.bundle` in the same directory as the C file.

You'll also need an audio file. Use an existing audio file, record your own or use our [sample audio file](https://funny-kashata-6dcdf0.netlify.app/audio/ndgt.wav). We only support **1 channel 16-bit 16 kHz PCM WAV** files at the moment.

### Compile and run

Compile the program:

```bash
# todo
gcc -o cdecoder c_decoder_test.c 
```

Run the program passing an audio file and the model bundle as arguments:

```bash
# todo
./cdecoder YOUR_MODEL_BUNDLE.ort.bundle file.wav
```

Your transcript will appear in the terminal

## API reference

[Speechly Decoder API](https://funny-kashata-6dcdf0.netlify.app/reference/decoder/)