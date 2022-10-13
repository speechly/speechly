import { ContextOptions } from '../client'
import WebsocketClient, { contextOptionsToMsg } from './worker'

const workerCtx = { postMessage: () => {} }

describe('worker', () => {
  describe('contextOptionsToMsg', () => {
    test('default timezone', async () => {
      const msg = contextOptionsToMsg()
      expect(msg.options.timezone[0]).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
    })
    test('override timezone', async () => {
      const timezone = ['Override/Timezone']
      const opts: ContextOptions = {}
      opts.timezone = timezone
      const msg = contextOptionsToMsg(opts)
      expect(msg.options.timezone).toBe(timezone)
    })
    test('options', async () => {
      const silenceTriggeredSegmentation = ['360']
      const opts: ContextOptions = {}
      opts.silenceTriggeredSegmentation = silenceTriggeredSegmentation
      const msg = contextOptionsToMsg(opts)
      expect(msg.options.silence_triggered_segmentation).toBe(silenceTriggeredSegmentation)
    })
  })
  describe('setContextOptions', () => {
    jest.mock('./worker')
    test('no options', async () => {
      const worker = new WebsocketClient(workerCtx as any)
      worker.initAudioProcessor(16000, 30, 5)
      const mockSend = jest.spyOn(worker, 'send').mockImplementation()
      worker.startContext()
      expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ options: { timezone: [Intl.DateTimeFormat().resolvedOptions().timeZone], non_streaming_nlu: ['no'] }, event: 'start' }))
    })
    test('startContext with options', async () => {
      // @ts-ignore
      const worker = new WebsocketClient(workerCtx as any)
      worker.initAudioProcessor(16000, 30, 5)
      const mockSend = jest.spyOn(worker, 'send').mockImplementation()
      const options: ContextOptions = { timezone: ['TZ'], vocabulary: ['W'] }
      worker.startContext(options)
      expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ options: { timezone: ['TZ'], vocabulary: ['W'], non_streaming_nlu: ['no'] }, event: 'start' }))
    })
    test('default options', async () => {
      // @ts-ignore
      const worker = new WebsocketClient(workerCtx as any)
      worker.initAudioProcessor(16000, 30, 5)
      const mockSend = jest.spyOn(worker, 'send').mockImplementation()
      worker.setContextOptions({ vocabularyBias: ['0.2'], timezone: ['DEF_TZ'] })
      worker.startContext({})
      expect(mockSend).toHaveBeenCalledWith(
        JSON.stringify({ options: { timezone: ['DEF_TZ'], vocabulary_bias: ['0.2'], non_streaming_nlu: ['no'] }, event: 'start' }),
      )
    })
    test('default options + startContext with options', async () => {
      // @ts-ignore
      const worker = new WebsocketClient(workerCtx as any)
      worker.initAudioProcessor(16000, 30, 5)
      const mockSend = jest.spyOn(worker, 'send').mockImplementation()
      worker.setContextOptions({ vocabularyBias: ['0.2'], timezone: ['DEF_TZ'] })
      worker.startContext({ timezone: ['TZ'], vocabulary: ['W'] })
      expect(mockSend).toHaveBeenCalledWith(
        JSON.stringify({ options: { timezone: ['TZ'], vocabulary: ['W'], vocabulary_bias: ['0.2'], non_streaming_nlu: ['no'] }, event: 'start' }),
      )
    })
  })
})
