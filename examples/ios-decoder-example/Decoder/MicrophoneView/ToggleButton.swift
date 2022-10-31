import SwiftUI

struct ToggleButton<Content: View>: View {
    @State private var isDown = false

    let onDown: () -> Void
    let onUp: () -> Void
    let content: () -> Content

    var body: some View {
        Button(action: {}, label: {
            self.content()
        }).simultaneousGesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged { _ in
                    if self.isDown {
                        return
                    }

                    self.isDown = true
                    self.onDown()
                }
                .onEnded { _ in
                    self.isDown = false
                    self.onUp()
                }
        )
    }
}
