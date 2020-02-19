export type AudioFilter = (audioBuffer: Float32Array) => Float32Array

export function generateDownsampler(sourceSampleRate: number, targetSampleRate: number): AudioFilter {
  const resampleRatio = sourceSampleRate / targetSampleRate
  const filter = generateFilter(sourceSampleRate, targetSampleRate / 2, 23)
  let buffer = new Float32Array(0)

  return (input: Float32Array): Float32Array => {
    const inputBuffer = new Float32Array(buffer.length + input.length)
    inputBuffer.set(buffer, 0)
    inputBuffer.set(input, buffer.length)

    const outputLength = Math.ceil((inputBuffer.length - filter.length) / resampleRatio)
    const outputBuffer = new Float32Array(outputLength)

    for (let i = 0; i < outputLength; i++) {
      const offset = Math.round(resampleRatio * i)

      for (let j = 0; j < filter.length; j++) {
        outputBuffer[i] += inputBuffer[offset + j] * filter[j]
      }
    }

    const remainingOffset = Math.round(resampleRatio * outputLength)
    if (remainingOffset < inputBuffer.length) {
      buffer = inputBuffer.slice(remainingOffset)
    } else {
      buffer = new Float32Array(0)
    }

    return outputBuffer
  }
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
