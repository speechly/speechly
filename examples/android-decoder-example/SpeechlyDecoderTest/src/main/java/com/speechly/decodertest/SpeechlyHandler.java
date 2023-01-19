package com.speechly.decodertest;

import com.speechly.decoder.CResultWord;
import com.speechly.decoder.DecoderException;
import com.speechly.decoder.DecoderFactoryHandle;
import com.speechly.decoder.DecoderHandle;
import com.speechly.decoder.SpeechlyDecoder;

import java.nio.ByteBuffer;
import java.nio.ShortBuffer;

public class SpeechlyHandler {

    private final int SAMPLE_BUFFER_SIZE = 4000;

    private DecoderFactoryHandle factory = null;
    private DecoderHandle decoder = null;
    private int sampleRate = 16000;

    public SpeechlyHandler() {
        System.out.println("Loading dynamic lib...");
        System.loadLibrary("SpeechlyDecoder");
        System.out.println("Got SpeechlyDecoder, library version " +
                SpeechlyDecoder.SpeechlyDecoderVersion() +
                ", build: " + SpeechlyDecoder.SpeechlyDecoderBuild());
    }

    public void initialize(ByteBuffer bundle)  {
        if (bundle != null) {
            try {
                System.out.println("Initialising decoder factory.");
                this.factory = SpeechlyDecoder.DecoderFactory_CreateFromModelArchive(
                        bundle, bundle.array().length);
                System.out.println("Loaded bundle: " +
                        SpeechlyDecoder.DecoderFactory_GetBundleId(this.factory));
                System.out.println("Instantiating decoder!");
                this.decoder = SpeechlyDecoder.DecoderFactory_GetDecoder(this.factory, "");
            } catch (DecoderException e) {
                throw new RuntimeException(e);
            }
            try {
                // set decoder block multiplier to a value >= 1, larger values will
                // up to some point reduce CPU load, but as a result latency increases.
                SpeechlyDecoder.Decoder_SetParamI(this.decoder,
                        SpeechlyDecoder.SPEECHLY_DECODER_BLOCK_MULTIPLIER_I, 8);
            } catch (DecoderException e) {
                // this is non fatal
                System.out.println("Failed to set decoder block multiplier.");
            }
        }
    }

    public void deallocateDecoder() {
        if (this.decoder == null) return;
        SpeechlyDecoder.Decoder_Destroy(this.decoder);
        this.decoder = null;
        if (this.factory == null) return;
        SpeechlyDecoder.DecoderFactory_Destroy(this.factory);
        this.factory = null;
    }

    public void setSampleRate(int sampleRate) {
        /// Set sample rate for incoming audio if not default of 16000Hz
        if (sampleRate != 16000) {
            try {
                SpeechlyDecoder.Decoder_SetInputSampleRate(decoder, sampleRate);
            } catch(DecoderException e) {
                throw new RuntimeException(e);
            }
        }
        this.sampleRate = sampleRate;
    }

    public Thread writeAudio(ShortBuffer sampleBuf, boolean realtime) {
        Thread writer = new Thread(() -> {
            short[] rawSamples = new short[SAMPLE_BUFFER_SIZE];
            float[] samples = new float[SAMPLE_BUFFER_SIZE];
            int samplesWritten = 0;
            int samplesRemaining = sampleBuf.limit() - sampleBuf.position();
            int samplesInWindow = rawSamples.length;
            int endOfInput = 0;
            long btime = System.currentTimeMillis();
            while (samplesRemaining > 0) {
                if (samplesRemaining < rawSamples.length) {
                    sampleBuf.get(rawSamples, 0, samplesRemaining);
                    samplesInWindow = samplesRemaining;
                    endOfInput = 1;
                } else {
                    sampleBuf.get(rawSamples);
                }
                Utils.normalizeSamples(rawSamples, samples);
                if (realtime) {
                    sleepIfNeeded(btime, samplesWritten + samplesInWindow, sampleRate);
                }
                try {
                    SpeechlyDecoder.Decoder_WriteSamples(decoder, samples,
                            samplesInWindow, endOfInput);
                } catch (DecoderException e) {
                    throw new RuntimeException(e);
                }
                System.out.println("Wrote " + samplesInWindow + " samples.");
                samplesWritten += samplesInWindow;
                samplesRemaining = sampleBuf.limit() - sampleBuf.position();
            }
        });
        return writer;
    }

    public Thread readTranscript(StringBuffer transcript, Runnable perWordCallback) {
        Thread reader = new Thread(() -> {
            System.out.println("Reading results from decoder...");
            String word = nextWord();
            while (word != null && !word.equals("")) {
                System.out.println(word);
                transcript.append(word);
                transcript.append(" ");
                perWordCallback.run();
                System.out.println("Waiting for next word...");
                word = nextWord();
            }
        });
        return reader;
    }

    public int getNumTranscribedSamples() {
        return SpeechlyDecoder.Decoder_GetNumSamples(this.decoder);
    }

    public int getNumTranscribedChars() {
        return SpeechlyDecoder.Decoder_GetNumCharacters(this.decoder);
    }

    private String nextWord() {
        CResultWord r = null;
        try {
            // blocks until next word becomes available
            r = SpeechlyDecoder.Decoder_WaitResults(this.decoder);
        } catch (DecoderException e) {
            throw new RuntimeException(e);
        }
        String w = r.getWord();
        // It is important to deallocate the CResultWord, otherwise we will leak memory.
        SpeechlyDecoder.CResultWord_Destroy(r);
        return w;
    }

    private void sleepIfNeeded(long beginTime, int samplesWritten, int sampleRate) {
        long wallClock = System.currentTimeMillis() - beginTime;
        long sampleClock = (long)(1000 * (double)samplesWritten / sampleRate);
        long delta = sampleClock - wallClock - 20;
        if (delta < 0) return;
        try {
            Thread.sleep(delta);
        } catch (InterruptedException e) {
            System.err.println("Thread interrupted.");
        }
    }
}
