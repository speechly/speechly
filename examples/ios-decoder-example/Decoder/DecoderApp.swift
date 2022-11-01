import SwiftUI
import SpeechlyDecoder

@main
struct DecoderApp: App {
    @ObservedObject var speechlyManager = SpeechlyManager()

    var body: some Scene {
        WindowGroup {
            ContentView(
                tentatives: speechlyManager.tentatives,
                segments: speechlyManager.segments,
                startRecording: speechlyManager.startContext,
                stopRecording: speechlyManager.stopContext
            )
        }
    }    
}
