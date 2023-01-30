import Foundation

class GithubRepoRepository {
    static let shared = GithubRepoRepository()

    func list() -> [GithubRepo] {
        return self.repositories
    }

    private let repositories = [
        GithubRepo(
            id: 1,
            name: "typescript",
            organisation: "microsoft",
            language: .TypeScript,
            followers: 2200,
            stars: 65000,
            forks: 8700
        ),
        GithubRepo(
            id: 2,
            name: "nest",
            organisation: "nestjs",
            language: .TypeScript,
            followers: 648,
            stars: 30900,
            forks: 2800
        ),
        GithubRepo(
            id: 3,
            name: "vscode",
            organisation: "microsoft",
            language: .TypeScript,
            followers: 3000,
            stars: 105000,
            forks: 16700
        ),
        GithubRepo(
            id: 4,
            name: "deno",
            organisation: "denoland",
            language: .TypeScript,
            followers: 1700,
            stars: 68000,
            forks: 3500
        ),
        GithubRepo(
            id: 5,
            name: "kubernetes",
            organisation: "kubernetes",
            language: .Go,
            followers: 3300,
            stars: 70700,
            forks: 25500
        ),
        GithubRepo(
            id: 6,
            name: "moby",
            organisation: "moby",
            language: .Go,
            followers: 3200,
            stars: 58600,
            forks: 16900
        ),
        GithubRepo(
            id: 7,
            name: "hugo",
            organisation: "gohugoio",
            language: .Go,
            followers: 1000,
            stars: 47200,
            forks: 5400
        ),
        GithubRepo(
            id: 8,
            name: "grafana",
            organisation: "grafana",
            language: .Go,
            followers: 1300,
            stars: 37500,
            forks: 7600
        ),
        GithubRepo(
            id: 9,
            name: "pytorch",
            organisation: "pytorch",
            language: .Python,
            followers: 1600,
            stars: 43000,
            forks: 11200
        ),
        GithubRepo(
            id: 10,
            name: "tensorflow",
            organisation: "tensorfow",
            language: .Python,
            followers: 8300,
            stars: 149000,
            forks: 82900
        ),
        GithubRepo(
            id: 11,
            name: "django",
            organisation: "django",
            language: .Python,
            followers: 2300,
            stars: 52800,
            forks: 22800
        ),
        GithubRepo(
            id: 12,
            name: "airflow",
            organisation: "apache",
            language: .Python,
            followers: 716,
            stars: 18500,
            forks: 7200
        )
    ]
}

