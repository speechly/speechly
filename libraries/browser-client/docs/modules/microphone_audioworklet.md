[@speechly/browser-client](../README.md) / microphone/audioworklet

# Module: microphone/audioworklet

## Table of contents

### Properties

- [default](microphone_audioworklet.md#default)

## Properties

### default

• **default**: ``"\n// Indices for the Control SAB.\nconst CONTROL = {\n  'WRITE_INDEX': 0,\n  'FRAMES_AVAILABLE': 1,\n  'LOCK': 2,\n};\n\nclass SpeechlyProcessor extends AudioWorkletProcessor {\n  constructor() {\n    super();\n\n    this._initialized = false;\n    this.debug = false;\n    this.port.onmessage = this._initialize.bind(this);\n  }\n\n  _initialize(event) {\n    this.controlSAB = new Int32Array(event.data.controlSAB);\n    this.dataSAB = new Float32Array(event.data.dataSAB);\n    this.debug = event.data.debug;\n    this.sharedBufferSize = this.dataSAB.length;\n    this.buffer = new Float32Array(0);\n    this._initialized = true;\n  }\n\n  _transferDataToSharedBuffer(data) {\n    this.controlSAB[CONTROL.LOCK] = 1\n    let inputWriteIndex = this.controlSAB[CONTROL.WRITE_INDEX]\n    if (this.controlSAB[CONTROL.FRAMES_AVAILABLE] > 0) {\n      if (inputWriteIndex + data.length > this.sharedBufferSize) {\n        // console.log('buffer overflow')\n        inputWriteIndex = 0\n      }\n    }\n    this.dataSAB.set(data, inputWriteIndex)\n    this.controlSAB[CONTROL.WRITE_INDEX] = inputWriteIndex + data.length\n    this.controlSAB[CONTROL.FRAMES_AVAILABLE] = inputWriteIndex + data.length\n    this.controlSAB[CONTROL.LOCK] = 0\n  }\n\n  _pushData(data) {\n    if (this.debug) {\n      const signalEnergy = getStandardDeviation(data)\n      this.port.postMessage({\n        type: 'STATS',\n        signalEnergy: signalEnergy\n      });\n    }\n\n    if (this.buffer.length > this.sharedBufferSize) {\n      const dataToTransfer = this.buffer.subarray(0, this.sharedBufferSize)\n      this._transferDataToSharedBuffer(dataToTransfer)\n      this.buffer = this.buffer.subarray(this.sharedBufferSize)\n    }\n    let concat = new Float32Array(this.buffer.length + data.length)\n    concat.set(this.buffer)\n    concat.set(data, this.buffer.length)\n    this.buffer = concat\n  }\n\n  process(inputs, outputs, parameters) {\n    const inputChannelData = inputs[0][0];\n      if (inputChannelData !== undefined) {\n        if (this.controlSAB && this.dataSAB) {\n          this._pushData(inputChannelData);\n        } else {\n          this.port.postMessage({\n            type: 'DATA',\n            frames: inputChannelData\n          });\n        }\n      }\n      \n      return true;\n  }\n}\n\nfunction getStandardDeviation(array) {\n  const n = array.length\n  const mean = array.reduce((a, b) => a + b) / n\n  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)\n}\n\nregisterProcessor('speechly-worklet', SpeechlyProcessor);\n"``
