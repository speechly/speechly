import Foundation

struct GithubRepo: Hashable, Identifiable {
    enum Language: String, Hashable {
        case Go = "Go"
        case Python = "Python"
        case TypeScript = "TypeScript"
    }

    let id: Int
    let name: String
    let organisation: String
    let language: Language
    let followers: Int
    let stars: Int
    let forks: Int
}
