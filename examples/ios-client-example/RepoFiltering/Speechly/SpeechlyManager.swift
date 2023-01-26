import SwiftUI
import Speechly

struct SpeechlyManagerError: Identifiable {
    var id: String { error }
    let error: String
}

class SpeechlyManager: ObservableObject {
    let client: Speechly.Client
    var active: Bool
    var currentAppId: String?

    @Published var transcript: [Transcript] = []
    @Published var filter: GithubRepoFilter = GithubRepoFilter.empty
    @Published var error: SpeechlyManagerError?

    init() {
        self.active = true
        self.client = try! Speechly.Client(
            appId: UUID(uuidString: "your-app-id")!
        )

        self.client.delegate = self
    }

    func start() {
        if !self.active {
            return
        }
        self.client.startContext(appId: self.currentAppId)
    }

    func stop() {
        if !self.active {
            return
        }
        self.client.stopContext()
    }

    func suspend() {
        if self.active {
            self.client.suspend()
            self.active = false
        }
    }

    func resume() {
        if !self.active {
            try! self.client.resume()
            self.active = true
        }
    }
}

extension SpeechlyManager: SpeechlyDelegate {
    func speechlyClientDidStart(_: SpeechlyProtocol) {
        DispatchQueue.main.async {
            self.transcript = []
        }
    }

    func speechlyClientDidStop(_: SpeechlyProtocol) {
        DispatchQueue.main.async {
            self.transcript = []
        }
    }

    func speechlyClientDidCatchError(_ speechlyClient: SpeechlyProtocol, error: SpeechlyError) {
        DispatchQueue.main.async {
            self.error = SpeechlyManagerError(error: String(describing: error))
        }
    }

    func speechlyClientDidUpdateSegment(_ client: SpeechlyProtocol, segment: Segment) {
        DispatchQueue.main.async {
            switch segment.intent.value.lowercased() {
            case "filter":
                self.filter = GithubRepoFilter(
                    languageFilter: self.parseLanguageFilter(segment),
                    sortOrder: self.filter.sortOrder
                )
            case "sort":
                self.filter = GithubRepoFilter(
                    languageFilter: self.filter.languageFilter,
                    sortOrder: self.parseSortOrder(segment)
                )
            case "reset":
                self.filter = GithubRepoFilter.empty
            default:
                break
            }

            self.transcript = segment.transcripts
        }
    }

    private func parseSortOrder(
        _ segment: Segment, defaultOrder: GithubRepoFilter.SortOrder = GithubRepoFilter.empty.sortOrder
    ) -> GithubRepoFilter.SortOrder {
        var order = defaultOrder

        for e in segment.entities {
            if e.type.lowercased() != "sort_field" {
                continue
            }

            switch e.value.lowercased() {
            case "name":
                order = .name
            case "language":
                order = .language
            case "followers":
                order = .followers
            case "stars":
                order = .stars
            case "forks":
                order = .forks
            default:
                continue
            }
        }

        return order
    }

    private func parseLanguageFilter(_ segment: Segment, initialValue: [GithubRepo.Language] = []) -> [GithubRepo.Language] {
        var languages = initialValue

        for e in segment.entities {
            if e.type.lowercased() != "language" {
                continue
            }

            switch e.value.lowercased() {
            case "go":
                languages.append(.Go)
            case "python":
                languages.append(.Python)
            case "typescript":
                languages.append(.TypeScript)
            default:
                continue
            }
        }

        return languages
    }
}
