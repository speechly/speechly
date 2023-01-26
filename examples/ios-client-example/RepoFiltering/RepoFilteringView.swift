import SwiftUI
import Speechly

struct RepoFilteringView: View {
    let repos: [GithubRepo]
    let transcript: [Transcript]
    let startRecording: () -> Void
    let stopRecording: () -> Void
    @Binding var error: SpeechlyManagerError?

    var body: some View {
        VStack {
            TranscriptText(words: transcript)
            RepoList(repos: repos)
            MicrophoneButton(onStart: startRecording, onStop: stopRecording)
        }.alert(item: $error) {err in
            Alert(title: Text("Speechly Client error"), message: Text(err.error), dismissButton: .default(Text("Ok")))
        }
    }
}

struct RepoFilteringView_Previews: PreviewProvider {
    static var previews: some View {
        RepoFilteringView(
            repos: GithubRepoRepository.shared.list(),
            transcript: [
                Transcript(
                    index: 1,
                    value: "SHOW",
                    startOffset: TimeInterval(0),
                    endOffset: TimeInterval(0.1),
                    isFinal: true
                ),
                Transcript(
                    index: 2,
                    value: "ME",
                    startOffset: TimeInterval(0),
                    endOffset: TimeInterval(0.1),
                    isFinal: true
                ),
                Transcript(
                    index: 3,
                    value: "ALL",
                    startOffset: TimeInterval(0),
                    endOffset: TimeInterval(0.1),
                    isFinal: true
                ),
                Transcript(
                    index: 4,
                    value: "GO",
                    startOffset: TimeInterval(0),
                    endOffset: TimeInterval(0.1),
                    isFinal: false
                ),
                Transcript(
                    index: 5,
                    value: "REPOS",
                    startOffset: TimeInterval(0),
                    endOffset: TimeInterval(0.1),
                    isFinal: false
                )
            ],
            startRecording: {},
            stopRecording: {},
            error: .constant(nil)
        )
    }
}
