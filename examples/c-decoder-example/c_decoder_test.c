#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/uio.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdint.h>

#include "Decoder.h"

// a utility function for reading files to memory as byte buffers.
int load_file(char* filename, void** buffer, size_t* buffer_len)
{
    struct stat st;
    int fd = open(filename, O_RDONLY);
    if (fd < 0) {
        perror("Error when opening file");
        return 1;
    }
    if(fstat(fd, &st) < 0) {
        perror("Error in fstat");
        return 1;
    }
    *buffer_len = st.st_size;

    void* data = malloc(st.st_size * sizeof(char));

    if (data == NULL) {
        perror("Error when allocating memory.");
        return 1;
    }

    size_t bytes_read = read(fd, data, st.st_size);
    if (bytes_read != st.st_size) {
        printf("Failed to read complete file!");
        return 1;
    }
    close(fd);

    *buffer = data;
    return 0;
}

// Feeds audio from the given sample buffer to the given decoder.
void feed_audio(uint8_t* sample_bytes, size_t sample_bytes_len, DecoderHandle* decoder)
{
    // Decoder must be given the samples as 32-bit signed floats
    // so that ever sample is scaled to the range [-1.0, 1.0].
    // Note that the same buffer can be used to feed multiple chunks of samples.
    float* sample_buffer = malloc(4096 * sizeof(float));
    size_t buffer_pos = 0;

    for (size_t i = 44; i + 1 < sample_bytes_len; i += 2) {
        // read a single 16-bit sample and represent it as a 32-bit float after
        // appropriate scaling
        int16_t sample_i = (sample_bytes[i] | (sample_bytes[i + 1] << 8));
        sample_buffer[buffer_pos] = sample_i / 32768.0;

        buffer_pos++;

        // When the buffer is full, write all samples to the decoder.
        if (buffer_pos == 4096) {
            Decoder_WriteSamples(decoder, sample_buffer, buffer_pos, 0, NULL);
            buffer_pos = 0;
        }
    }
    // Write remaining samples to the decoder. Note that as this is the last
    // chunk of samples, it is important to set the end_of_input flag to 1.
    // (This is the last argument to Decoder_WriteSamples.) If this is never set
    // to 1, the decoder will wait for input indefinitely and hence e.g. the
    // Decoder_WaitResults function (see below in read_transcript) may block
    // indefinitely.
    Decoder_WriteSamples(decoder, sample_buffer, buffer_pos, 1, NULL);

    free(sample_buffer);
}

// Reads all available transcript from the given decoder.
void read_transcript(DecoderHandle* decoder)
{
    // Note that Decoder_WaitResults blocks until there is a new word available.
    // The function returns a CResultWord object that has a zero-length
    // word when the transcript is complete and the decoder will no longer generate
    // new words.
    struct CResultWord* r = Decoder_WaitResults(decoder, NULL);
    while (strlen(r->word) > 0) {
        printf("%s, start: %d, end: %d\n", r->word, r->start_time, r->end_time);
        CResultWord_Destroy(r);
        r = Decoder_WaitResults(decoder, NULL);
    }
}

int main(int argc, char *argv[])
{
    int err;

    void* model;
    size_t model_len;

    // load model bundle to memory. The model pointer must *not* be free'd while the
    // decoder is in operation.
    if (load_file(argv[1], &model, &model_len) > 0) {
        printf("Loading model failed.\n");
        return 1;
    }

    // Create a DecoderFactory by passing the model bundle.
    DecoderFactoryHandle* factory = DecoderFactory_CreateFromModelArchive(model, model_len, NULL);

    // Instantiate a decoder object.
    DecoderHandle* decoder = DecoderFactory_GetDecoder(factory, NULL, NULL);
    printf("Decoder ready!\n");

    // Load audio file. In this example the file *must* be a RIFF wav file with
    // 16-bit 1-channel 16kHz PCM audio.
    uint8_t* sample_bytes;
    size_t sample_bytes_len;
    if (load_file(argv[2], (void**)&sample_bytes, &sample_bytes_len) > 0) {
        printf("Failed loading input audio.\n");
        return 1;
    }

    // Below we first feed all samples to the decoder, and then read the transcript.
    // It is also possible to run the functions feed_audio and read_transcript
    // concurrently in two threads. This is useful for real-time situations in which
    // it is important to show the transcript while receiving more audio.

    printf("Writing samples...\n");
    feed_audio(sample_bytes, sample_bytes_len, decoder);
    free(sample_bytes);  // deallocate audio from memory

    printf("All samples written, reading transcript...\n");
    read_transcript(decoder);

    // Clean up. It is good practice to first destroy the decoder object and
    // then the factory.
    Decoder_Destroy(decoder);
    DecoderFactory_Destroy(factory);

    // deallocate model bundle
    free(model);
}
