import SwiftUI

struct MicrophoneButton: View {
    let onStart: () -> Void
    let onStop: () -> Void

    var body: some View {
        ToggleButton(onDown: startRecording, onUp: stopRecording) {
            Circle()
                .frame(width: 80, height: 80)
                .foregroundColor(.blue)
                .overlay(
                    Image(systemName: "mic.fill")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 40, height: 40)
                        .foregroundColor(.white)
                )
        }.buttonStyle(Style())
    }

    private func startRecording() {
        self.onStart()
    }

    private func stopRecording() {
        self.onStop()
    }

    private struct Style: ButtonStyle {
        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .scaleEffect(configuration.isPressed ? 1.25 : 1.0)
                .animation(.easeInOut, value: true)
        }
    }
}

struct MicrophoneButton_Previews: PreviewProvider {
    static var previews: some View {
        MicrophoneButton(onStart: {}, onStop: {})
    }
}
