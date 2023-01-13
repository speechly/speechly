package com.speechly.decodertest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.TextView;

import java.nio.ByteBuffer;
import java.nio.ShortBuffer;

public class MainActivity extends AppCompatActivity {
    private SpeechlyService speechlyService;
    private ByteBuffer modelData;
    private SpeechlyHandler sh;
    private boolean isBound;
    private boolean simulateRealtime = false;

    private final String modelFile = "41045787-9dda-4c82-a22d-4ed9650a7304.b527496c049e.tflite.bundle";

    /** Defines callbacks for service binding, passed to bindService() */
    private ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            SpeechlyService.SpeechlyBinder binder = (SpeechlyService.SpeechlyBinder) service;
            speechlyService = binder.getService();
            isBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            isBound = false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(false);

        // Bind to SpeechlyService for running decoder in the background.
        if (!isBound) {
            Intent intent = new Intent(this, SpeechlyService.class);
            bindService(intent, this.connection, Context.BIND_AUTO_CREATE);
        }

        // The Speechly handler is a convenience class that wraps all interaction
        // with the Speechly decoder.
        this.sh = new SpeechlyHandler();
    }

    @Override
    protected void onStart() { super.onStart(); }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        this.sh.deallocateDecoder();
        unbindService(this.connection);
        isBound = false;
    }

    public void loadModel(View view) {
        // load model bundle to memory, this should not be garbage collected until
        // the Speechly decoder is no longer needed
        this.modelData = Utils.loadAssetToByteBuffer(this, this.modelFile);
        this.sh.initialize(this.modelData);
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(true);
        ((Button)findViewById(R.id.load_model)).setText("Unload model");
        ((Button)findViewById(R.id.load_model)).setOnClickListener(view_ -> unloadModel(view_));
    }

    public void unloadModel(View view) {
        this.sh.deallocateDecoder();
        // now it is safe to garbage collect the model buffer
        this.modelData = null;
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(false);
        ((Button)findViewById(R.id.load_model)).setText("Load model");
        ((Button)findViewById(R.id.load_model)).setOnClickListener(view_ -> loadModel(view_));
    }


    public void onCheckboxClicked(View view) {
        this.simulateRealtime = ((CheckBox) view).isChecked();
    }

    public void transcribeTestAudio(View view) {
        if (!isBound) {
            System.out.println("SpeechlyService is not bound!");
            return;
        }
        // prevent user from starting another decoding while this one is in progress.
        ((Button)findViewById(R.id.transcribe_audio)).setEnabled(false);

        // load audio file
        ShortBuffer sampleBuf = Utils.loadAudioFile(this, "speechly-podcast-short.wav");
        int numSamples = sampleBuf.limit();
        System.out.println("Got " + numSamples + " samples.");

        // set sample rate, 16000Hz is the default
        int sampleRate = 16000;
        sh.setSampleRate(sampleRate);

        // Pass audio samples to a service that starts pushing them to the decoder
        // in the background.
        this.speechlyService.writeAudio(this.sh, sampleBuf, this.simulateRealtime);

        // This StringBuffer is used both for the resulting transcript as well as some other
        // information. (This is just to make the UI simpler.)
        final StringBuffer s = new StringBuffer();
        s.append("Transcribing " + (float)numSamples / sampleRate + " secodnds of audio:\n\n");
        updateTextView(s, R.id.transcript);

        // Read results from decoder into the given StringBuffer.
        // The UI is updated whenever the decoder outputs a new word.
        final long btime = System.currentTimeMillis();
        Thread r = this.speechlyService.readTranscript(this.sh, s,
                () -> { updateTextView(s, R.id.transcript); });

        // In a separate thread, after decoding has completed, add some info from
        // the SpeechlyHandler to the Buffer
        new Thread(() -> {
            // wait until transcript reading thread is done
            try {
                r.join();
            } catch (InterruptedException e) {}
            // After decoding finishes, add some metadata to the end of the transcript,
            // done here only to get some nice debug info in the UI.
            int transcribedSamples = sh.getNumTranscribedSamples();
            float audioDuration = (float)transcribedSamples / sampleRate;
            float decodeDuration = (System.currentTimeMillis() - btime) / 1000.0f;
            s.append("\n\nFinished in " + decodeDuration + " sec.");
            s.append("\nAudio duration was " + audioDuration + " sec.");
            s.append("\nProcessed " + transcribedSamples +
                    " samples and wrote " + this.sh.getNumTranscribedChars() + " characters.\n");
            s.append("Throughput: " + audioDuration/decodeDuration);
            updateTextView(s, R.id.transcript);

            // re-enable transcription button
            MainActivity.this.runOnUiThread(() -> {
                ((Button) findViewById(R.id.transcribe_audio)).setEnabled(true);
            });
        }).start();
    }

    private void updateTextView(final StringBuffer text, final int viewId) {
        MainActivity.this.runOnUiThread(() -> {
            TextView transcript = findViewById(viewId);
            transcript.setText(text);
        });
    }
}