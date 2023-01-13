package com.speechly.decodertest;

import android.content.Context;
import android.content.res.AssetFileDescriptor;

import com.speechly.decoder.CResultWord;
import com.speechly.decoder.DecoderException;
import com.speechly.decoder.SpeechlyDecoder;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;

public class Utils {
    public static ByteBuffer loadAssetToByteBuffer(Context ctx, String filename) {
        try {
            AssetFileDescriptor f = ctx.getAssets().openFd(filename);
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

    public static ShortBuffer loadAudioFile(Context ctx, String filename) {
        ByteBuffer audio = Utils.loadAssetToByteBuffer(ctx, filename);
        audio.order(ByteOrder.LITTLE_ENDIAN);  // wavs are little endian
        audio.position(audio.arrayOffset() + 44);  // skip wav header
        return audio.asShortBuffer();
    }

    public static void normalizeSamples(short[] samples, float[] normalizedSamples) {
        System.out.println("normalizeSamples: samples[0] before normalization: " + samples[0]);
        for (int i = 0; i < samples.length; i++) {
            normalizedSamples[i] = samples[i] / 32768.0f;
        }
        System.out.println("normalizeSamples: samples[0] after normalization: " + normalizedSamples[0]);
    }
}
