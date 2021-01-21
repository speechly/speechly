export default `
// Indices for the Control SAB.
const CONTROL = {
  'WRITE_INDEX': 0,
  'FRAMES_AVAILABLE': 1,
};

class SpeechlyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._initialized = false;
    this.port.onmessage = this._initialize.bind(this);
  }

  _initialize(event) {
    this.controlSAB = new Int32Array(event.data.controlSAB);
    this.dataSAB = new Float32Array(event.data.dataSAB);
    this._initialized = true;
  }

  _pushData(data) {
    let inputWriteIndex = this.controlSAB[CONTROL.WRITE_INDEX];

    if (inputWriteIndex + data.length < this.dataSAB.length) {
      // Buffer has enough space to push the input.
      this.dataSAB.set(data, inputWriteIndex);
      this.controlSAB[CONTROL.WRITE_INDEX] += data.length;
    } else {
      // Buffer overflow
      this.dataSAB.set(data, 0);
      this.controlSAB[CONTROL.WRITE_INDEX] = 0;
    }

    // Update the number of available frames in the input buffer.
    this.controlSAB[CONTROL.FRAMES_AVAILABLE] += data.length;
  }

  process(inputs, outputs, parameters) {
    const inputChannelData = inputs[0][0];
      if (inputChannelData !== undefined) {
        if (this.controlSAB && this.dataSAB) {
          this._pushData(inputChannelData);
        } else {
          this.port.postMessage(inputChannelData);
        }
      }
      
      return true;
  }
}

registerProcessor('speechly-worklet', SpeechlyProcessor);
`
