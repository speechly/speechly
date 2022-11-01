package com.speechly.decoder;

import java.nio.ByteBuffer;
import java.security.KeyFactory;
import java.security.Signature;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class SpeechlyDecoder extends SpeechlyDecoderInternal {
    private static final int TAR_HEADER_AND_BLOCK_SIZE = 512;

    public static DecoderError newDecoderError() {
        return new DecoderError();
    }

    public static DecoderFactoryHandle DecoderFactory_CreateFromModelArchive(java.nio.ByteBuffer buf,
                                                                             long bufLen)
        throws DecoderException
    {
        assert buf.isDirect() : "Buffer must be allocated direct.";
        {
            int baseOffset = 0;
            byte[] buffer;
            if (buf.hasArray()) {
                baseOffset = buf.arrayOffset();
                buffer = buf.array();
            } else {
                buffer = new byte[buf.limit()];
                buf.get(buffer);
                buf.rewind();
            }
            boolean isLicVerified = verify(buffer, 512 + baseOffset, 158, 512 + 158 + baseOffset, 512);
            if (!isLicVerified) {
                throw new RuntimeException("Invalid model bundle");
            }
            int licSize = getFileSizeFromTarHeader(buffer, baseOffset);
            int licBlockSize = getBlockSize(licSize);

            int headerStartOffset = TAR_HEADER_AND_BLOCK_SIZE + (TAR_HEADER_AND_BLOCK_SIZE * licBlockSize) + baseOffset;
            int fileStartOffset = headerStartOffset + TAR_HEADER_AND_BLOCK_SIZE;

            int modelCount = parseIntFromBuffer(buffer, baseOffset + 512 + 154);

            for (int i = 0; i < modelCount; i++) {
                int modelEncSize = getFileSizeFromTarHeader(buffer, headerStartOffset);
                int modelBlockSize = getBlockSize(modelEncSize);

                int modelPlaintextSize = decrypt(buffer, fileStartOffset, modelEncSize);

                boolean isModelValid = verify(buffer, fileStartOffset - 64, modelPlaintextSize,
                        fileStartOffset + (TAR_HEADER_AND_BLOCK_SIZE * modelBlockSize) + 512, 512);

                ByteBuffer.allocateDirect(modelPlaintextSize);

                setFileSizeFromTarHeader(buffer, headerStartOffset, modelPlaintextSize);

                headerStartOffset += 512 + TAR_HEADER_AND_BLOCK_SIZE + (modelBlockSize * TAR_HEADER_AND_BLOCK_SIZE) + 512;
                fileStartOffset = headerStartOffset + TAR_HEADER_AND_BLOCK_SIZE;
            }
            if (!buf.hasArray()) {
                buf.put(buffer);
                buf.rewind();
            }
            return SpeechlyDecoderInternal.DecoderFactory_CreateFromModelArchive(buf, bufLen);
        }
    }


    private static int getFileSizeFromTarHeader(byte[] buffer, int offset) {

        int tarSizeOffset = 124 + offset;
        char[] fileSize = new char[11];
        for (int i = tarSizeOffset; i < (tarSizeOffset + fileSize.length); i++) {
            fileSize[i - tarSizeOffset] = (char) buffer[i];
        }
        return Integer.parseInt(String.valueOf(fileSize), 8);
    }

    private static int parseIntFromBuffer(byte[] buffer, int offset) {
        return
            (int)buffer[offset]              |
            ((int)buffer[offset + 1] << 8)   |
            ((int)buffer[offset + 2] << 16)  |
            ((int)buffer[offset + 3] << 24);
    }

    private static void setFileSizeFromTarHeader(byte[] buffer, int offset, int size) {
        String sizeOctal = String.format("%1$11s", Integer.toOctalString(size)).replace(' ', '0');
        int tarSizeOffset = 124 + offset;
        for (int i = tarSizeOffset; i < (tarSizeOffset + 11); i++) {
            buffer[i] = (byte) sizeOctal.charAt(i - tarSizeOffset);
        }
    }

    private static byte[] getBytes(String key) {
        String enc;
        switch (key) {
            case "SKA":
                enc = "\117\330\230\300\307\115\326\060\225\013\223\372\004\037\110\132\250\220\146\120\372\103\212\371\207\313\341\127\042\011\205\267\010\070\327\071\012\316\264\302\054\042\170\015\202\362\107\015\263\063\321\003\140\032\202\121\140\047\341\303\261\233\367\262";
                break;
            case "IVA":
                enc = "\047\011\133\274\203\215\135\074\034\215\233\346\050\317\253\236\071\321\042\252\320\015\257\073\251\125\344\175\240\204\315\255";
                break;
            case "DER":
                enc = "\043\023\363\161\376\374\347\305\053\033\343\356\065\063\215\204\237\265\102\304\211\301\250\056\026\341\160\175\270\271\353\352\350\351\124\121\075\075\214\217\235\037\001\003\377\360\143\143\250\230\111\313\152\150\164\176\105\107\373\171\036\034\125\124\001\001\077\340\063\051\017\355\127\157\221\121\226\047\142\270\227\223\042\351\105\271\051\376\140\171\145\071\233\000\122\025\275\250\124\256\143\015\267\031\017\145\147\247\240\135\246\047\042\372\250\125\001\231\260\357\340\320\230\217\362\252\116\267\056\046\315\220\325\035\315\114\314\174\030\046\270\345\241\351\203\003\164\073\235\234\117\323\027\217\217\222\273\010\063\243\076\021\000\361\177\257\354\033\031\140\177\101\277\316\201\041\334\046\340\370\073\157\167\137\175\356\352\035\346\027\047\372\314\214\176\247\016\005\047\030\230\055\274\206\303\320\073\143\171\340\331\304\370\130\014\236\356\010\160\111\121\330\060\257\020\077\244\117\244\110\277\166\015\267\150\037\153\267\211\242\203\106\163\363\315\200\025\344\207\115\126\105\007\146\042\356\017\047\332\077\162\067\232\365\266\302\025\231\073\342\334\051\203\045\364\044\011\161\351\131\146\141\257\140\344\041\065\275\277\012\351\372\351\143\132\064\035\301\376\352\277\307\027\065\047\247\336\104\026\022\273\354\243\025\164\232\013\206\222\251\205\140\113\351\174\061\363\256\372\244\327\342\035\142\036\004\347\261\243\273\002\304\001\364\054\313\174\174\201\161\222\052\003\067\373\304\175\057\072\215\350\065\120\234\373\045\337\025\275\232\374\142\036\064\277\133\027\154\250\316\213\121\347\171\250\351\102\063\267\257\112\376\330\162\107\226\167\116\116\123\172\221\032\010\041\264\217\003\311\360\023\145\174\156\273\044\227\347\073\032\144\252\027\145\227\042\336\072\060\143\233\227\224\374\041\006\076\230\070\073\153\367\274\245\247\327\350\124\354\026\054\232\150\306\361\025\076\167\072\207\027\163\216\055\347\320\130\370\243\022\250\125\126\274\025\161\127\354\165\127\374\001\023\261\257\307\142\162\043\073\371\256\271\270\076\254\235\302\141\275\223\306\334\217\146\317\027\177\235\374\067\120\131\307\317\067\044\154\222\344\350\131\262\162\223\226\216\205\227\166\066\372\033\357\340\120\256\217\165\250\260\357\076\322\327\017\242\247\304\273\223\341\007\135\130\355\073\342\177\326\137\363\330\301\340\064\373\377\015\051\124\217\016\361\016\147\326\025\134\363\165\005\025\311\214\323\140\012\277\136\266\365\144\166\207\076\245\230\262\267\062\354\346\125\002\334\040\361\020\255\305\121\246\142\320\153\005\045\263\107\303\321\245\223\060\301\326\357\213\042\246\205\215\312\010\261\304\167\304\104\136\210\116\273\136\325\352\152\012\376\347\152\331\362\173\103\132\350\316\214\207\153\345\026\360\217\270\263\322\323\074\244\365\313\211\315\145\325\053\251\325\106\164\241\355\320\040\163\351\036\370\227\005\075\042\171\142\120\374\067\171\145\220\150\126\154\243\026\272\335\233\160\207\165\202\330\156\006\036\353\140\067\015\350\031\035\135\040\176\347\172\105\047\057\345\306\312\127\177\204\121\012\225\225\111\136\137\105\042\241\123\167\240\330\373\251\175\252\245\243\231\077\247\040\230\331\207\144\066\334\302\210\175\060\036\214\153\311\140\104\153\122\316\104\135\310\107\334\136\210\363\052\153\242\256\110\125\344\271\123\162\112\134\344\357\145\313\300\325\077\023\070\146\040\200\006\214\356\270\206\326\361\114\001\107\007\204\263\233\067\377\064\065\201\060\050\264\172\333\147\073\015\130\337\060\212\324\237\362\156\235\035\135\034\017\264\312\302\113\267\336\364\226\213\153\370\034\213\075\274\237\340\230\260\142\017\150\203\153\057\337\177\174\227\354\247\264\060\324\277\335\240\030\126\266\272\133\171\040\370\201\110\110\041\321\256\300\320\165\221\121\153\275\075\005\205\015\314\220\270\253\307\276\063\357\027\107\014\121\337\071\030\011\022\372\375\265\003\053\217\032\036\217\177\232\313\015\066\322\116\220\320\215\343\227\041\245\055\351\041\136\151\326\035\150\257\124\124\032\207\333\167\150\130\152\043\030\372\014\160\262\244\201\363\357\356\114\031\072\252\301\247\023\056\340\041\012\100\241\314\273\244\116\367\270\215\324\307\336\251\023\351\317\154\226\351\350\306\266\045\236\070\220\251\160\227\074\005\230\067\046\122\302\323\071\107\175\077\063\042\137\036\135\044\301\053\063\314\332\163\150\371\034\011\007\364\175\015\257\311\300\115\334\012\132\203\174\160\232\345\214\213\262\332\072\231\163\026\044\350\376\010\107\171\332\112\140\237\060\127\350\352\054\057\014\015\301\301\153\152";
                break;
            default:
                enc = "\000\000";
        }
        byte[] dec = new byte[enc.length() / 2];
        for (int i = 0; i < enc.length(); i = i + 2) {
            dec[i / 2] = (byte) (((byte) enc.charAt(i)) ^ ((byte) enc.charAt(i + 1)));
        }
        return dec;
    }

    private static boolean verify(byte[] buf, int dataOffset, int dataLength, int sigOffset, int sigLength) {
        X509EncodedKeySpec encodedKeySpec = new X509EncodedKeySpec(getBytes("DER"));
        try {
            KeyFactory kf = KeyFactory.getInstance("RSA");
            RSAPublicKey publicKey = (RSAPublicKey) kf.generatePublic(encodedKeySpec);

            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);

            sig.update(buf, dataOffset, dataLength);

            return sig.verify(buf, sigOffset, sigLength);
        } catch (Exception e) {
            throw new RuntimeException("Invalid model bundle", e);
        }
    }

    private static int decrypt(byte[] buffer, int ciphertextOffset, int ciphertextLen) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(getBytes("SKA"), "AES");
            IvParameterSpec ivParameterSpec = new IvParameterSpec(getBytes("IVA"));

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
            int plaintextLen = cipher.update(buffer, ciphertextOffset, ciphertextLen, buffer, ciphertextOffset - 64);
            plaintextLen += cipher.doFinal(buffer, ciphertextOffset - 64 + plaintextLen);
            return plaintextLen;
        } catch (Exception e) {
            throw new RuntimeException("Invalid model bundle", e);
        }
    }

    private static int getBlockSize(int byteSize) {
        int blockSize = byteSize / TAR_HEADER_AND_BLOCK_SIZE;
        if (byteSize % TAR_HEADER_AND_BLOCK_SIZE > 0) {
            blockSize += 1;
        }
        return blockSize;
    }
}
