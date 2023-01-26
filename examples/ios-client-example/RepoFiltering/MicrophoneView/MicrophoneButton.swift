import SwiftUI
import Speechly


struct MicrophoneButton: View {
    let onStart: () -> Void
    let onStop: () -> Void

    var body: some View {
        MicButtonWrapper(onStart: onStart, onStop: onStop)
            .frame(width: 80, height: 80)
    }
}

/// Wrap the UIKit MicrophoneButtonView to be usable in SwiftUI
struct MicButtonWrapper: UIViewRepresentable {
    let onStart: () -> Void
    let onStop: () -> Void

    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }

    func makeUIView(context: Context) -> Speechly.MicrophoneButtonView {
        let view = Speechly.MicrophoneButtonView(delegate: context.coordinator)
        view.reloadAuthorizationStatus()
        return view
    }

    func updateUIView(_ uiView: Speechly.MicrophoneButtonView, context: Context) {
    }
}

extension MicButtonWrapper {
    class Coordinator: MicrophoneButtonDelegate {
        var parent: MicButtonWrapper
        init(_ parent: MicButtonWrapper) {
            self.parent = parent
        }
        func didOpenMicrophone(_ button: MicrophoneButtonView) {
            parent.onStart()
        }
        func didCloseMicrophone(_ button: MicrophoneButtonView) {
            parent.onStop()
        }
    }
}

struct MicrophoneButton_Previews: PreviewProvider {
    static var previews: some View {
        MicrophoneButton(onStart: {}, onStop: {})
    }
}
