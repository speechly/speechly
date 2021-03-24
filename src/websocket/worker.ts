export default `
// Indices for the Control SAB.
const CONTROL = {
  WRITE_INDEX: 0,
  FRAMES_AVAILABLE: 1,
}
let ws
const state = {
  isContextStarted: false,
  isStartContextConfirmed: false,
  shouldResendLastFramesSent: false,
  sourceSampleRate: undefined,
  targetSampleRate: undefined,
  resampleRatio: 1,
  buffer: new Float32Array(0),
  lastFramesSent: new Int16Array(0), // to re-send after switch context
  filter: undefined,
  controlSAB: undefined,
  dataSAB: undefined,
}

async function initializeWebsocket(url, protocol) {
  ws = new WebSocket(url, protocol)

  return new Promise((resolve, reject) => {
    const errhandler = () => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      reject(Error('Connection failed'))
    }

    const openhandler = () => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      resolve(ws)
    }

    ws.addEventListener('close', errhandler)
    ws.addEventListener('error', errhandler)
    ws.addEventListener('open', openhandler)
  })
}

function closeWebsocket(code, message) {
  if (ws === undefined) {
    throw Error('Websocket is not open')
  }

  ws.removeEventListener('message', onWebsocketMessage)
  ws.removeEventListener('error', onWebsocketError)
  ws.removeEventListener('close', onWebsocketClose)

  ws.close(code, message)
}

function onWebsocketClose(event) {
  ws = undefined
}

function onWebsocketError(_event) {
  onWebsocketClose(1000, 'Client disconnecting due to an error')
}

function onWebsocketMessage(event) {
  let response
  try {
    response = JSON.parse(event.data)
  } catch (e) {
    console.error('[SpeechlyClient] Error parsing response from the server:', e)
    return
  }

  if (response.type === 'started') {
    state.isStartContextConfirmed = true
    if (state.shouldResendLastFramesSent) {
      if (state.lastFramesSent.length > 0) {
        if (ws !== undefined) {
          ws.send(state.lastFramesSent)
        }
        state.lastFramesSent = new Int16Array(0)
      }
      state.shouldResendLastFramesSent = false
    }
  }

  self.postMessage(response)
}

function float32ToInt16(buffer) {
  const buf = new Int16Array(buffer.length)

  for (let l = 0; l < buffer.length; l++) {
    buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff)
  }

  return buf
}

self.onmessage = function(e) {
  switch (e.data.type) {
    case 'INIT':
      if (ws === undefined) {
        initializeWebsocket(e.data.apiUrl, e.data.authToken).then(function() {
          self.postMessage({
            type: 'WEBSOCKET_OPEN',
          })
          ws.addEventListener('message', onWebsocketMessage)
          ws.addEventListener('error', onWebsocketError)
          ws.addEventListener('close', onWebsocketClose)
        })

        state.targetSampleRate = e.data.targetSampleRate
      }
      break
    case 'SET_SOURSE_SAMPLE_RATE':
      state.sourceSampleRate = e.data.sourceSampleRate
      state.resampleRatio = e.data.sourceSampleRate / state.targetSampleRate
      if (state.resampleRatio > 1) {
        state.filter = generateFilter(e.data.sourceSampleRate, state.targetSampleRate, 127)
      }
      self.postMessage({
        type: 'SOURSE_SAMPLE_RATE_SET_SUCCESS',
      })

      if (isNaN(state.resampleRatio)) {
        throw Error('resampleRatio is NaN')
      }
      break
    case 'SET_SHARED_ARRAY_BUFFERS':
      state.controlSAB = new Int32Array(e.data.controlSAB)
      state.dataSAB = new Float32Array(e.data.dataSAB)
      setInterval(sendAudioFromSAB, 4)
      break
    case 'CLOSE':
      if (ws !== undefined) {
        closeWebsocket(e.data.code, e.data.message)
      }
      break
    case 'START_CONTEXT':
      if (ws === undefined) {
        throw Error('Cant start context: websocket is undefined')
      }
      if (state.isContextStarted) {
        console.log('Cant start context: it has been already started')
        break
      }

      state.isContextStarted = true
      state.isStartContextConfirmed = false

      const appId = e.data.appId
      if (appId !== undefined) {
        ws.send(JSON.stringify({ event: 'start', appId }))
      } else {
        ws.send(JSON.stringify({ event: 'start' }))
      }
      break
    case 'SWITCH_CONTEXT':
      const newAppId = e.data.appId
      if (ws !== undefined && state.isContextStarted && newAppId !== undefined) {
        state.isStartContextConfirmed = false
        const StopEventJSON = JSON.stringify({ event: 'stop' })
        ws.send(StopEventJSON)
        state.shouldResendLastFramesSent = true
        ws.send(JSON.stringify({ event: 'start', appId: newAppId }))
      }
      break
    case 'STOP_CONTEXT':
      if (ws !== undefined && state.isContextStarted) {
        state.isContextStarted = false
        state.isStartContextConfirmed = false
        const StopEventJSON = JSON.stringify({ event: 'stop' })
        ws.send(StopEventJSON)
      }
      break
    case 'AUDIO':
      if (ws !== undefined && state.isContextStarted) {
        if (e.data.payload.length > 0) {
          if (state.resampleRatio > 1) {
            // Downsampling
            ws.send(downsample(e.data.payload))
          } else {
            ws.send(float32ToInt16(e.data.payload))
          }
        }
      }
      break
    default:
      console.log('WORKER', e)
  }
}

let lastTime = Date.now()

function sendAudioFromSAB() {
  if (state.isStartContextConfirmed && CONTROL.FRAMES_AVAILABLE > 0) {
    const data = state.dataSAB.subarray(0, state.controlSAB[CONTROL.FRAMES_AVAILABLE])
    state.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
    state.controlSAB[CONTROL.WRITE_INDEX] = 0
    if (data.length > 0) {
      let frames
      if (state.resampleRatio > 1) {
        frames = downsample(data)
      } else {
        frames = float32ToInt16(data)
      }
      ws.send(frames)

      // 16000 per second, 1000 in 100 ms
      // save last 250 ms
      if (state.lastFramesSent.length > 1024 * 4) {
        state.lastFramesSent = frames
      } else {
        let concat = new Int16Array(state.lastFramesSent.length + frames.length)
        concat.set(state.lastFramesSent)
        concat.set(frames, state.lastFramesSent.length)
        state.lastFramesSent = concat
      }
    }
  } else {
    if (!state.isContextStarted) {
      state.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      state.controlSAB[CONTROL.WRITE_INDEX] = 0
    }
  }
}

function downsample(input) {
  const inputBuffer = new Float32Array(state.buffer.length + input.length)
  inputBuffer.set(state.buffer, 0)
  inputBuffer.set(input, state.buffer.length)

  const outputLength = Math.ceil((inputBuffer.length - state.filter.length) / state.resampleRatio)
  const outputBuffer = new Int16Array(outputLength)

  for (let i = 0; i < outputLength; i++) {
    const offset = Math.round(state.resampleRatio * i)
    let val = 0.0

    for (let j = 0; j < state.filter.length; j++) {
      val += inputBuffer[offset + j] * state.filter[j]
    }

    outputBuffer[i] = val * (val < 0 ? 0x8000 : 0x7fff)
  }

  const remainingOffset = Math.round(state.resampleRatio * outputLength)
  if (remainingOffset < inputBuffer.length) {
    state.buffer = inputBuffer.subarray(remainingOffset)
  } else {
    state.buffer = emptyBuffer
  }

  return outputBuffer
}

function generateFilter(sourceSampleRate, targetSampleRate, length) {
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

function sinc(x) {
  if (x === 0.0) {
    return 1.0
  }

  const piX = Math.PI * x
  return Math.sin(piX) / piX
}

`
