export default `
// Indices for the Control SAB.
const CONTROL = {
  'WRITE_INDEX': 0,
  'FRAMES_AVAILABLE': 1,
  'LOCK': 2,
};

class SpeechlyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._initialized = false;
    this.debug = false;
    this.port.onmessage = this._initialize.bind(this);
  }

  _initialize(event) {
    this.controlSAB = new Int32Array(event.data.controlSAB);
    this.dataSAB = new Float32Array(event.data.dataSAB);
    this.debug = event.data.debug;
    if (this.debug) {
      console.log('[BrowserClient AudioWorkletNode]', 'initializing audioworklet');
    }
    this.sharedBufferSize = this.dataSAB.length;
    this.buffer = new Float32Array(0);
    this._initialized = true;
  }

  _transferDataToSharedBuffer(data) {
    this.controlSAB[CONTROL.LOCK] = 1;
    let inputWriteIndex = this.controlSAB[CONTROL.WRITE_INDEX];
    if (this.controlSAB[CONTROL.FRAMES_AVAILABLE] > 0) {
      if (inputWriteIndex + data.length > this.sharedBufferSize) {
        // console.log('buffer overflow')
        inputWriteIndex = 0;
      }
    }
    this.dataSAB.set(data, inputWriteIndex);
    this.controlSAB[CONTROL.WRITE_INDEX] = inputWriteIndex + data.length;
    this.controlSAB[CONTROL.FRAMES_AVAILABLE] = inputWriteIndex + data.length;
    this.controlSAB[CONTROL.LOCK] = 0;
  }

  _pushData(data) {
    if (this.debug) {
      const signalEnergy = getStandardDeviation(data)
      this.port.postMessage({
        type: 'STATS',
        signalEnergy: signalEnergy,
        samples: data.length,
      });
    }

    if (this.buffer.length > this.sharedBufferSize) {
      const dataToTransfer = this.buffer.subarray(0, this.sharedBufferSize);
      this._transferDataToSharedBuffer(dataToTransfer);
      this.buffer = this.buffer.subarray(this.sharedBufferSize);
    }
    let concat = new Float32Array(this.buffer.length + data.length);
    concat.set(this.buffer);
    concat.set(data, this.buffer.length);
    this.buffer = concat;
  }

  process(inputs, outputs, parameters) {
    const inputChannelData = inputs[0][0];
    if (inputChannelData !== undefined) {
      if (this.controlSAB && this.dataSAB) {
        this._pushData(inputChannelData);
      } else {
        this.port.postMessage({
          type: 'DATA',
          frames: inputChannelData
        });
      }
    }

    return true;
  }
}

function getStandardDeviation(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

registerProcessor('speechly-worklet', SpeechlyProcessor);
`
