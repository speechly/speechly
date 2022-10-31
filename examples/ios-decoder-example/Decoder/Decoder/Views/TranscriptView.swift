import Foundation
import SwiftUI

struct TranscriptView: View {
    let transcripts: [Transcript]
    
    var body: some View {
        transcripts.reduce(Text("")) { (acc, t) in
            acc + Text(" ") + Text(t.word)
        }
    }
}

struct TranscriptView_Previews: PreviewProvider {
    static var previews: some View {
        TranscriptView(transcripts: [
            Transcript(index: 1, word: "Hello", startOffset: 0, endOffset: 1),
            Transcript(index: 2, word: "World", startOffset: 1, endOffset: 2)
        ])
    }
}
