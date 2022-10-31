import Foundation
import SpeechlyDecoder
import os.log
import CoreAudioTypes

let speechly = OSLog(subsystem: "com.speechly.decoder", category: "speechly")

class SpeechlyManager: ObservableObject {
    let recorder = AudioRecorder()
    let decoderFactory: UnsafeMutablePointer<DecoderFactoryHandle>
    let decoder: UnsafeMutablePointer<DecoderHandle>
    let benchmarkMode: Bool = false
    
    @Published var tentatives: [Transcript] = []
    @Published var segments: [Segment] = []
    
    init() {
        let bundle = Bundle.main.url(forResource: "YOUR_MODEL_BUNDLE.coreml", withExtension: "bundle")!
        let model: NSMutableData
        do {
            model = try NSMutableData.init(contentsOf: bundle)
        } catch{abort()}
        var decoderError: DecoderError = DecoderError.init()
        decoderFactory = SpeechlyDecoder.DecoderFactory_CreateFromModelArchive(model.mutableBytes, model.length, &decoderError)
        if (decoderError.error_code != 0) {
            let error_code = decoderError.error_code
            fatalError(String(format: "DecoderFactory_CreateFromModelArchive failed with errorcode %i", error_code))
        }

        decoder = SpeechlyDecoder.DecoderFactory_GetDecoder(self.decoderFactory, nil, &decoderError)
        if (decoderError.error_code != 0) {
            let error_code = decoderError.error_code
            fatalError(String(format: "DecoderFactory_GetDecoder failed with errorcode %i", error_code))
        }

        os_log("initialized decoder", log: speechly, type: .info)

        recorder.delegate = { buf in
            var floatArray = Array(UnsafeBufferPointer(start: buf.floatChannelData?[0], count: Int(buf.frameLength)))
            floatArray.withUnsafeMutableBufferPointer { a in
                SpeechlyDecoder.Decoder_WriteSamples(self.decoder, a.baseAddress!, a.count, 0, &decoderError)
                if (decoderError.error_code != 0) {
                    let error_code = decoderError.error_code
                    fatalError(String(format: "Decoder_WriteSamples failed with errorcode %i", error_code))
                }

            }
            if self.benchmarkMode {
                SpeechlyDecoder.Decoder_WriteSamples(self.decoder, nil, 0, 1, &decoderError)
                if (decoderError.error_code != 0) {
                    let error_code = decoderError.error_code
                    fatalError(String(format: "Decoder_WriteSamples failed with errorcode %i", error_code))
                }
            }
        }
    }
    
    public func startContext() {
        if benchmarkMode {
            try? self.recorder.startBenchmarking()
        }
        else {
            try? self.recorder.startRecording()
        }
        DispatchQueue.global(qos: DispatchQoS.background.qosClass).async {
            var transcripts: Array<Transcript> = []
            var transcriptIdx = 0
            while true {
                var decoderError: DecoderError = DecoderError.init()
                let res_word = SpeechlyDecoder.Decoder_WaitResults(self.decoder, &decoderError)
                if (decoderError.error_code != 0) {
                    let error_code = decoderError.error_code
                    fatalError(String(format: "Decoder_WaitResults failed with errorcode %i", error_code))
                }

                let word = String(cString: res_word!.pointee.word)
                if word == "" {
                    os_log("end of results", log: speechly, type: .debug)
                    if self.benchmarkMode {
                        self.recorder.stopBenchmarking()
                    }
                    break
                }
                transcriptIdx = transcriptIdx + 1
                let tr = Transcript(index: transcriptIdx, word: word, startOffset: Double(res_word!.pointee.start_time), endOffset: Double(res_word!.pointee.end_time))
                os_log("transcript is %@", log: speechly, type: .debug, String(describing: tr))
                transcripts.append(tr)
                DispatchQueue.main.async {
                    self.tentatives.append(tr)
                }
            }
            let segment = Segment(id: self.segments.count, transcripts: transcripts)
            os_log("stop context, segment is %@", log: speechly, type: .debug, String(describing: segment))
            DispatchQueue.main.async {
                self.tentatives = []
                self.segments.append(segment)
            }
        }
    }
    
    public func stopContext() {
        if !benchmarkMode {
            self.recorder.stopRecording()
            var decoderError: DecoderError = DecoderError.init()
            SpeechlyDecoder.Decoder_WriteSamples(self.decoder, nil, 0, 1, &decoderError)
            if (decoderError.error_code != 0) {
                let error_code = decoderError.error_code
                fatalError(String(format: "Decoder_WriteSamples failed with errorcode %i", error_code))
            }

        }
    }
}

public struct Segment: Hashable {
    let id: Int
    let transcripts: [Transcript]
}

public struct Transcript: Hashable {
    let index: Int
    let word: String
    let startOffset: Double
    let endOffset: Double
}
