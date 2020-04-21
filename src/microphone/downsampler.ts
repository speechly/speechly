export interface AudioFilter {
  call(input: Float32Array): Float32Array
}

export class Downsampler implements AudioFilter {
  private buffer: Float32Array
  private readonly resampleRatio: number
  private readonly filter: number[]

  constructor(sourceSampleRate: number, targetSampleRate: number, filter: number[]) {
    this.buffer = new Float32Array(0)
    this.resampleRatio = sourceSampleRate / targetSampleRate
    this.filter = filter
  }

  call(input: Float32Array): Float32Array {
    const inputBuffer = new Float32Array(this.buffer.length + input.length)
    inputBuffer.set(this.buffer, 0)
    inputBuffer.set(input, this.buffer.length)

    const outputLength = Math.ceil((inputBuffer.length - this.filter.length) / this.resampleRatio)
    const outputBuffer = new Float32Array(outputLength)

    for (let i = 0; i < outputLength; i++) {
      const offset = Math.round(this.resampleRatio * i)

      for (let j = 0; j < this.filter.length; j++) {
        outputBuffer[i] += inputBuffer[offset + j] * this.filter[j]
      }
    }

    const remainingOffset = Math.round(this.resampleRatio * outputLength)
    if (remainingOffset < inputBuffer.length) {
      this.buffer = inputBuffer.slice(remainingOffset)
    } else {
      this.buffer = this.buffer.slice(0, 0)
    }

    return outputBuffer
  }
}

export function generateDownsampler(sourceSampleRate: number, targetSampleRate: number): Downsampler {
  return new Downsampler(sourceSampleRate, targetSampleRate, generateFilter(sourceSampleRate, targetSampleRate / 2, 23))
}

export function float32ToInt16(buffer: Float32Array): ArrayBuffer {
  let l = buffer.length
  const buf = new Int16Array(l)

  while (l-- > 0) {
    buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff)
  }

  return buf.buffer
}

function generateFilter(sourceSampleRate: number, targetSampleRate: number, length: number): number[] {
  if (length % 2 === 0) {
    throw Error('Filter length must be odd')
  }

  const filter = new Array(length)
  let sum = 0

  for (let i = 0; i < length; i++) {
    const x = sinc(((2 * targetSampleRate) / sourceSampleRate) * (i - (length - 1) / 2))
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
