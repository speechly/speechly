class AudioTools {
  static LOG_2_PLUS_LOG_5 = Math.log(2) + Math.log(5)

  // Downsample(in float[] src, ref float[] dest, int sourceIndex = 0, int sourceLength = -1, int destIndex = 0, int destLength = -1) {
  public static Downsample(src: number[], dest: number[], sourceIndex = 0, sourceLength = -1, destIndex = 0, destLength = -1): void {
    if (sourceLength < 0) sourceLength = src.length - sourceIndex
    if (destLength < 0) destLength = dest.length - destIndex

    if (destLength > sourceLength) {
      throw new Error("Can't downsample: destination array can't be longer than source")
    }

    if (destLength === 0) {
      throw new Error("Can't downsample: destination array can't be zero-length.")
    }

    if (sourceLength === 0) {
      throw new Error("Can't downsample: source range can't be zero length.")
    }

    if (sourceLength === 1) {
      dest[0] = src[0]
      return
    }

    let destIndexFraction = 0.0
    const destStep = (destLength - 1) / (sourceLength - 1)
    let sum = 0
    let totalWeight = 0
    const sourceEndIndex = sourceIndex + sourceLength
    for (; sourceIndex < sourceEndIndex; sourceIndex++) {
      const weight = 0.5 - Math.abs(destIndexFraction)
      sum += src[sourceIndex] * weight
      totalWeight += weight
      destIndexFraction += destStep
      if (destIndexFraction >= 0.5) {
        destIndexFraction -= 1
        dest[destIndex++] = sum / totalWeight
        sum = 0
        totalWeight = 0
      }
    }
    // Put last value in place
    if (totalWeight > 0) {
      dest[destIndex++] = sum / totalWeight
    }
  }

  // public static float GetEnergy(in float[] samples, int start = 0, int length = -1) {
  public static GetEnergy(samples: number[], start = 0, length = -1): void {
    if (length < 0) length = samples.length - start
    if (length <= 0) return 0
    const endIndex = start + length
    let sumEnergySquared = 0.0
    for (; start < endIndex; start++) {
      sumEnergySquared += samples[start] * samples[start]
    }
    return Math.sqrt(sumEnergySquared / length)
  }

  // public static float GetAudioPeak(in float[] samples, int start = 0, int length = -1) {
  public static GetAudioPeak(samples: number[], start = 0, length = -1): void {
    if (length < 0) length = samples.length - start
    if (length <= 0) return 0
    const endIndex = start + length
    let peak = 0
    for (; start < endIndex; start++) {
      if (samples[start] > peak) {
        peak = samples[start]
      }
    }
    return peak
  }

  // public static int ConvertInt16ToFloat(in byte[] src, ref float[] dest, int srcStartSample = 0, int lengthSamples = -1, int dstIndex = 0) {
  public static ConvertInt16ToFloat(src: number[], dest: number[], srcStartSample = 0, lengthSamples = -1, dstIndex = 0): void {
    if (lengthSamples < 0) lengthSamples = src.length / 2 - srcStartSample
    const maxLen = Math.min((src.length / 2) - srcStartSample, dest.length - dstIndex)
    lengthSamples = Math.min(lengthSamples, maxLen)
    if (lengthSamples <= 0) return 0
    let byteIndex = srcStartSample * 2
    const endByte = byteIndex + lengthSamples * 2
    while (byteIndex < endByte) {
      dest[dstIndex++] = ((src[byteIndex++] + (src[byteIndex++] << 8))) / 0x7fff
    }
    return lengthSamples
  }

  public static EnergyToDb(energy: number): number {
    return (10.0 * Math.log(energy) / AudioTools.LOG_2_PLUS_LOG_5)
  }

  public static DbToEnergy(db: number): number {
    return Math.pow(10.0, db / 10.0)
  }
}

export default AudioTools
