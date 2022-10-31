import SwiftUI

struct ContentView: View {
    let tentatives: [Transcript]
    let segments: [Segment]
    let startRecording: () -> Void
    let stopRecording: () -> Void
    
    var body: some View {
        VStack {
            ForEach(segments, id: \.self) { seg in
                TranscriptView(transcripts: seg.transcripts)
            }
            TranscriptView(transcripts: tentatives)
            Spacer()
            MicrophoneButton(onStart: startRecording, onStop: stopRecording)
                .padding(.bottom, 15)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(
            tentatives: [Transcript(index: 0, word: "HH", startOffset: 1, endOffset: 1)],
            segments: [
                Segment(
                    id: 1,
                    transcripts: [
                        Transcript(index: 1, word: "Hello", startOffset: 0.1, endOffset: 0.2),
                        Transcript(index: 2, word: "World", startOffset: 0.3, endOffset: 0.4)
                    ]
                ),
                Segment(
                    id: 2,
                    transcripts: [
                        Transcript(index: 1, word: "Testing", startOffset: 1, endOffset: 2),
                        Transcript(index: 2, word: "Testing", startOffset: 2, endOffset: 3)
                    ]
                )
            ],
            startRecording: {},
            stopRecording: {}
        )
    }
}
