import Foundation
import AVFoundation
import os.log

typealias AudioSink = (AVAudioPCMBuffer) -> Void

class AudioRecorder {
    public enum AudioRecorderError: Error {
        case missingDelegate
    }

    public enum RecordingState {
      case recording, paused, stopped
    }
    
    public var delegate: AudioSink?
    
    private var audioEngine: AVAudioEngine!
    private var mixerNode: AVAudioMixerNode!
    private var state: RecordingState = .stopped
    private let formatConverter: AVAudioConverter
    private var startTime: Double!
    
    public init() {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.record)
        session.requestRecordPermission { response in
            assert(response == true)
        }
        try? session.setActive(true, options: .notifyOthersOnDeactivation)
        
        audioEngine = AVAudioEngine()
        let inputNode = audioEngine.inputNode
        let inputFormat = inputNode.inputFormat(forBus: 0)
        let outputFormat = AVAudioFormat(
            commonFormat: .pcmFormatFloat32,
            sampleRate: 16000,
            channels: 1,
            interleaved: true
        )!

        formatConverter = AVAudioConverter(from: inputFormat, to: outputFormat)!
        audioEngine.prepare()
    }
    
    func startBenchmarking() throws {
        os_log("starting benchmarking", log: speechly, type: .info)
        guard let delegate = self.delegate else {
            throw AudioRecorderError.missingDelegate
        }
        let outputFormat = AVAudioFormat(
            commonFormat: .pcmFormatFloat32,
            sampleRate: 16000,
            channels: 1,
            interleaved: true
        )!

        let benchmarkUrl = Bundle.main.url(forResource: "speechly-podcast", withExtension: "wav")!
        let benchmarkFile = try! AVAudioFile(forReading: benchmarkUrl)
        let buf = AVAudioPCMBuffer(pcmFormat: outputFormat, frameCapacity: 1277655)
        try! benchmarkFile.read(into: buf!)
        os_log("delegating", log: speechly, type: .info)
        self.startTime = CFAbsoluteTimeGetCurrent()
        delegate(buf!)
    }

    func startRecording() throws {
        guard let delegate = self.delegate else {
            throw AudioRecorderError.missingDelegate
        }
        let outputFormat = AVAudioFormat(
            commonFormat: .pcmFormatFloat32,
            sampleRate: 16000,
            channels: 1,
            interleaved: true
        )!

        let inputNode = audioEngine.inputNode
        let inputFormat = inputNode.inputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: inputFormat) {
            (buffer, time) in
            
            let outputBuffer = AVAudioPCMBuffer(
                pcmFormat: outputFormat,
                frameCapacity: AVAudioFrameCount(outputFormat.sampleRate * 0.1)
            )!

            var error: NSError? = nil
            self.formatConverter.convert(
                to: outputBuffer,
                error: &error,
                withInputFrom: { inNumPackets, outStatus in
                    outStatus.pointee = AVAudioConverterInputStatus.haveData
                    return buffer
                }
            )

            delegate(outputBuffer)
        }

        try audioEngine.start()
        state = .recording
    }

    func stopRecording() {
        audioEngine.inputNode.removeTap(onBus: 0)
        audioEngine.stop()
        state = .stopped
    }
    func stopBenchmarking() {
        let decoDur = CFAbsoluteTimeGetCurrent() - self.startTime
        let fileDur = 79.8534
        os_log("Decoding took %@ speedup %@", log: speechly, type: .info, String(decoDur), String(fileDur/decoDur))
    }
}
