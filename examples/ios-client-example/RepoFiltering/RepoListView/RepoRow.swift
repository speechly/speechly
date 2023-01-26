import SwiftUI

struct RepoRow: View {
    let repo: GithubRepo

    var body: some View {
        HStack {
            Image(imageName())
                .resizable().frame(width: 32, height: 32, alignment: .center)

            VStack(alignment: .leading, spacing: 7) {
                Text("\(repo.organisation) / ").font(.system(size: 20)).fontWeight(.light) +
                    Text(repo.name).font(.system(size: 20)).fontWeight(.bold)

                HStack(alignment: .lastTextBaseline) {
                    LabeledIcon(name: "arrow.branch", label: formatNumber(repo.forks))
                    LabeledIcon(name: "star", label: formatNumber(repo.stars))
                    LabeledIcon(name: "eye", label: formatNumber(repo.followers))
                }
            }
        }
    }

    private func formatNumber(_ value: Int) -> String {
        if (value < 1000) {
            return String(value)
        }

        if (value < 10000) {
            return "\(String(Double(value) / 1000))K"
        }

        return "\(String(value / 1000))K"
    }

    private func imageName() -> String {
        switch self.repo.language {
        case .Go:
            return "logo-go"
        case .Python:
            return "logo-python"
        case .TypeScript:
            return "logo-ts"
        }
    }
}
