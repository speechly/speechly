import Foundation

class GithubRepoFilter {
    enum SortOrder {
        case name, language, followers, stars, forks
    }

    static let empty = GithubRepoFilter(languageFilter: [], sortOrder: .name)

    var languageFilter: [GithubRepo.Language]
    var sortOrder: SortOrder

    init(languageFilter: [GithubRepo.Language], sortOrder: SortOrder) {
        self.languageFilter = languageFilter
        self.sortOrder = sortOrder
    }

    func apply(_ input: [GithubRepo]) -> [GithubRepo] {
        var res = input

        if self.languageFilter.count > 0 {
            res = res.filter { repo in
                self.languageFilter.contains(repo.language)
            }
        }

        return res.sorted { (left, right) in
            switch self.sortOrder {
            case .name:
                return left.name < right.name
            case .language:
                return left.language.rawValue < right.language.rawValue
            case .followers:
                return left.followers < right.followers
            case .stars:
                return left.stars < right.stars
            case .forks:
                return left.forks < right.forks
            }
        }
    }
}
