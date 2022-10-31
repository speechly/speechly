package com.speechly.decodertest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.AssetFileDescriptor;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.speechly.decoder.CResultWord;
import com.speechly.decoder.DecoderError;
import com.speechly.decoder.DecoderException;
import com.speechly.decoder.DecoderHandle;
import com.speechly.decoder.SpeechlyDecoder;
import com.speechly.decoder.DecoderFactoryHandle;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

public class MainActivity extends AppCompatActivity {

    private ByteBuffer bundle = null;
    private DecoderFactoryHandle factory;
    private DecoderHandle decoder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(false);
    }

    public void loadModel(View view)  {
        this.bundle = loadAssetToByteBuffer("41045787-9dda-4c82-a22d-4ed9650a7304.b527496c049e.tflite.bundle");

        if (this.bundle  != null) {
            System.out.println("Loading dynamic lib...");
            System.loadLibrary("SpeechlyDecoder");
            System.out.println("Got SpeechlyDecoder, library version " +
                    SpeechlyDecoder.SpeechlyDecoderVersion() +
                    ", build: " + SpeechlyDecoder.SpeechlyDecoderBuild());

            System.out.println("Initialising decoder factory.");
            try {
                this.factory = SpeechlyDecoder.DecoderFactory_CreateFromModelArchive(
                        this.bundle, this.bundle.array().length);
                System.out.println("Loaded bundle: " +
                        SpeechlyDecoder.DecoderFactory_GetBundleId(this.factory));
            } catch (DecoderException e) {
                throw new RuntimeException(e);
            }

            System.out.println("Instantiating decoder!");
            try {
                this.decoder = SpeechlyDecoder.DecoderFactory_GetDecoder(this.factory, "");
            } catch (DecoderException e) {
                throw new RuntimeException(e);
            }

            ((Button)findViewById(R.id.transcribe_audio)).setEnabled(true);
            ((Button)findViewById(R.id.load_model)).setText("Unload model");
            ((Button)findViewById(R.id.load_model)).setOnClickListener(view_ -> unloadModel(view_));
        }
    }

    public void unloadModel(View view) {
        SpeechlyDecoder.Decoder_Destroy(this.decoder);
        SpeechlyDecoder.DecoderFactory_Destroy(this.factory);
        // now it should be ok to garbage collect the model bundle buffer
        this.bundle = null;
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(false);
        ((Button)findViewById(R.id.load_model)).setText("Load model");
        ((Button)findViewById(R.id.load_model)).setOnClickListener(view_ -> loadModel(view_));
    }

    public void transcribeTestAudio(View view) {
        // load audio file
        ByteBuffer audio = loadAssetToByteBuffer("speechly_podcast_44100Hz_short.wav");
        audio.order(ByteOrder.LITTLE_ENDIAN);  // wavs are little endian
        audio.position(audio.arrayOffset() + 44);  // skip wav header
        ShortBuffer sampleBuf = audio.asShortBuffer();

        final DecoderHandle decoder = this.decoder;

        // Set sample rate for incoming audio
        try {
            SpeechlyDecoder.Decoder_SetInputSampleRate(decoder, 44100);
        } catch(DecoderException e) {
            throw new RuntimeException(e);
        }

        // write samples
        Thread writer = new Thread(() -> {
            short[] rawSamples = new short[4096];
            float[] samples = new float[4096];
            int samplesRemaining = sampleBuf.limit() - sampleBuf.position();
            int samplesInWindow = rawSamples.length;
            int endOfInput = 0;
            while (samplesRemaining > 0) {
                if (samplesRemaining < rawSamples.length) {
                    sampleBuf.get(rawSamples, 0, samplesRemaining);
                    samplesInWindow = samplesRemaining;
                    endOfInput = 1;
                } else {
                    sampleBuf.get(rawSamples);
                }
                normalizeSamples(rawSamples, samples);
                try {
                    SpeechlyDecoder.Decoder_WriteSamples(decoder, samples, samplesInWindow, endOfInput);
                } catch (DecoderException e) {
                    throw new RuntimeException(e);
                }
                System.out.println("Wrote " + samplesInWindow + " samples.");
                samplesRemaining = sampleBuf.limit() - sampleBuf.position();
            }
        });
        final long btime = System.currentTimeMillis();
        writer.run();

        final StringBuffer transcript = new StringBuffer();

        // read results
        Thread reader = new Thread(() -> {
            System.out.println("Reading results from decoder...");
            CResultWord r = null;  // blocks until next word available
            try {
                r = SpeechlyDecoder.Decoder_WaitResults(decoder);
            } catch (DecoderException e) {
                throw new RuntimeException(e);
            }
            while (r != null && !r.getWord().equals("")) {
                System.out.println(r.getWord());
                transcript.append(r.getWord());
                transcript.append(" ");
                updateTextView(transcript, R.id.transcript);
                SpeechlyDecoder.CResultWord_Destroy(r);  // delete CResultWord when no longer needed
                System.out.print("Waiting for next word... got: ");
                try {
                    r = SpeechlyDecoder.Decoder_WaitResults(decoder);
                } catch (DecoderException e) {
                    throw new RuntimeException(e);
                }
            }
            SpeechlyDecoder.CResultWord_Destroy(r);
            System.out.println("Decoder finished in " + (System.currentTimeMillis() - btime) / 1000.0 + " sec.");
            transcript.append("\n\nFinished in " + (System.currentTimeMillis() - btime) / 1000.0 + " sec.");
            transcript.append("\nProcessed " + SpeechlyDecoder.Decoder_GetNumSamples(decoder) +
                    " samples and wrote " + SpeechlyDecoder.Decoder_GetNumCharacters(decoder) + " characters.");
            updateTextView(transcript, R.id.transcript);
        });
        reader.start();
    }

    private void updateTextView(final StringBuffer text, final int viewId) {
        MainActivity.this.runOnUiThread(() -> {
            TextView transcript = findViewById(viewId);
            transcript.setText(text);
        });
    }

    private void normalizeSamples(short[] samples, float[] normalizedSamples) {
        System.out.println("normalizeSamples: samples[0] before normalization: " + samples[0]);
        for (int i = 0; i < samples.length; i++) {
            normalizedSamples[i] = samples[i] / 32768.0f;
        }
        System.out.println("normalizeSamples: samples[0] after normalization: " + normalizedSamples[0]);
    }

    private ByteBuffer loadAssetToByteBuffer(String filename) {
        try {
            AssetFileDescriptor f = this.getAssets().openFd(filename);
            int assetSize = (int)f.getLength();
            ByteBuffer buffer = ByteBuffer.allocateDirect(assetSize);
            System.out.println("buffer has accessible backing array: " + buffer.hasArray());
            System.out.println("buffers array offset is: " + buffer.arrayOffset());
            int bytesRead = f.createInputStream().read(buffer.array(),
                    buffer.arrayOffset(),
                    assetSize);
            if (bytesRead == assetSize) {
                System.out.println("Got " + bytesRead + " bytes from " + filename);
            }
            f.close();
            buffer.rewind();
            return buffer;
        } catch (Exception e) {
            System.out.println(e);
        }
        return null;
    }

    private String loadResourceToString(int resource) {
        AssetFileDescriptor f = this.getResources().openRawResourceFd(resource);
        byte[] buffer = new byte[(int)f.getLength()];
        try {
            f.createInputStream().read(buffer);
            f.close();
            return new String(buffer);
        } catch (IOException ioe) {
            System.out.println(ioe);
        }
        return null;
    }
}