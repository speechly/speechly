package com.speechly.decodertest;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import com.speechly.decoder.CResultWord;
import com.speechly.decoder.DecoderException;
import com.speechly.decoder.DecoderFactoryHandle;
import com.speechly.decoder.DecoderHandle;
import com.speechly.decoder.SpeechlyDecoder;

import java.nio.ByteBuffer;
import java.nio.ShortBuffer;

public class SpeechlyService extends Service {
    // Binder given to clients
    private final IBinder binder = new SpeechlyBinder();

    public class SpeechlyBinder extends Binder {
        SpeechlyService getService() {
            // Return this instance of SpeechlyService so clients can call public methods
            return SpeechlyService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    public Thread writeAudio(SpeechlyHandler sh,
                           ShortBuffer samples,
                           boolean realtime) {
        Thread w = sh.writeAudio(samples, realtime);
        w.start();
        return w;
    }

    public Thread readTranscript(SpeechlyHandler sh,
                               StringBuffer transcript,
                               Runnable perWordCallback) {
        Thread r = sh.readTranscript(transcript, perWordCallback);
        r.start();
        return r;
    }
}
