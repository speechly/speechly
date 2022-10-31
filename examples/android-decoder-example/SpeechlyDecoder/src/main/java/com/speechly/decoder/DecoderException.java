package com.speechly.decoder;

public class DecoderException extends Exception {

    private int errorCode = 0;

    private static String humanReadableMessage(String errorCodeStr) {
        int ec = Integer.parseInt(errorCodeStr);
        String errorStr = "";
        switch(ec) {
        case SpeechlyDecoder.SPEECHLY_ERROR_NONE:
            errorStr = "No error.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_UNEXPECTED_ERROR:
            errorStr = "Unexpected error.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_MEMORY_ERROR:
            errorStr = "Memory allocation failed.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_UNEXPECTED_PARAMETER_VALUE:
            errorStr = "Unexpected parameter value.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_UNEXPECTED_PARAMETER:
            errorStr = "Unexpected parameter name.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_EXPIRED_MODEL:
            errorStr = "Expired model licence.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_INVALID_MODEL:
            errorStr = "Corrupted model bundle.";
            break;
        case SpeechlyDecoder.SPEECHLY_ERROR_MISMATCH_IN_MODEL_ARCHITECTURE:
            errorStr = "Invalid model for this architecture.";
            break;
        default:
            errorStr = "Unrecognized error code.";
            break;
        }
        return errorStr + " (error code = " + ec + ")";
    }

    public DecoderException(String message) {
        super(DecoderException.humanReadableMessage(message));
        try {
            this.errorCode = Integer.parseInt(message);
        } catch (NumberFormatException ignored) {}
    }

    public int getErrorCode() {
        return errorCode;
    }
}
