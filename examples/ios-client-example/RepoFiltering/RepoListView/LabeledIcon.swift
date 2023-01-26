import SwiftUI

struct LabeledIcon: View {
    let name: String
    let label: String

    var body: some View {
        HStack(spacing: 3) {
            Image(systemName: name).foregroundColor(.gray).imageScale(.small)
            Text(label).font(.system(.caption)).fontWeight(.ultraLight)
        }
    }
}
