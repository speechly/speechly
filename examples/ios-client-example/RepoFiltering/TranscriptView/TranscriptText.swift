import SwiftUI
import Speechly

struct TranscriptText: View {
    let words: [Transcript]

    var body: some View {
        words.reduce(Text("")) { (acc, word) in
            acc + Text(" ") + Text(word.value).fontWeight(word.isFinal ? .bold : .light)
        }
    }
}

struct TranscriptText_Previews: PreviewProvider {
    static var previews: some View {
        TranscriptText(words: [
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
        ])
    }
}
