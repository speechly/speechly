const emptyBuffer = new Float32Array(0)

export interface AudioFilter {
  readonly resampleRatio: number
  call(input: Float32Array): Int16Array
}

export function newSampler(sourceSampleRate: number, targetSampleRate: number): AudioFilter {
  if (sourceSampleRate === targetSampleRate) {
    return new BypassSampler()
  } else if (sourceSampleRate > targetSampleRate) {
    return new DownSampler(sourceSampleRate, targetSampleRate, generateFilter(sourceSampleRate, targetSampleRate, 127))
  } else {
    throw Error('Upsampling is not supported!')
  }
}

/**
 * BypassSampler is a re-sampler that simply returns the passed buffer without performing any sampling.
 * @internal
 */
export class BypassSampler implements AudioFilter {
  readonly resampleRatio = 1

  call(input: Float32Array): Int16Array {
    return float32ToInt16(input)
  }
}

/**
 * DownSampler is a re-sampler that performs downsampling on the passed audio buffer.
 * @internal
 */
export class DownSampler implements AudioFilter {
  readonly resampleRatio: number
  private readonly filter: Float32Array
  private buffer: Float32Array

  constructor(sourceSampleRate: number, targetSampleRate: number, filter: Float32Array) {
    this.buffer = emptyBuffer
    this.resampleRatio = sourceSampleRate / targetSampleRate
    this.filter = filter
  }

  call(input: Float32Array): Int16Array {
    const inputBuffer = new Float32Array(this.buffer.length + input.length)
    inputBuffer.set(this.buffer, 0)
    inputBuffer.set(input, this.buffer.length)

    const outputLength = Math.ceil((inputBuffer.length - this.filter.length) / this.resampleRatio)
    const outputBuffer = new Int16Array(outputLength)

    for (let i = 0; i < outputLength; i++) {
      const offset = Math.round(this.resampleRatio * i)
      let val = 0.0

      for (let j = 0; j < this.filter.length; j++) {
        val += inputBuffer[offset + j] * this.filter[j]
      }

      outputBuffer[i] = val * (val < 0 ? 0x8000 : 0x7fff)
    }

    const remainingOffset = Math.round(this.resampleRatio * outputLength)
    if (remainingOffset < inputBuffer.length) {
      this.buffer = inputBuffer.subarray(remainingOffset)
    } else {
      this.buffer = emptyBuffer
    }

    return outputBuffer
  }
}

function float32ToInt16(buffer: Float32Array): Int16Array {
  const buf = new Int16Array(buffer.length)

  for (let l = 0; l < buffer.length; l++) {
    buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff)
  }

  return buf
}

function generateFilter(sourceSampleRate: number, targetSampleRate: number, length: number): Float32Array {
  if (length % 2 === 0) {
    throw Error('Filter length must be odd')
  }

  const cutoff = targetSampleRate / 2
  const filter = new Float32Array(length)
  let sum = 0

  for (let i = 0; i < length; i++) {
    const x = sinc(((2 * cutoff) / sourceSampleRate) * (i - (length - 1) / 2))

    sum += x
    filter[i] = x
  }

  for (let i = 0; i < length; i++) {
    filter[i] = filter[i] / sum
  }

  return filter
}

function sinc(x: number): number {
  if (x === 0.0) {
    return 1.0
  }

  const piX = Math.PI * x
  return Math.sin(piX) / piX
}
