import SwiftUI

struct RepoList: View {
    var repos: [GithubRepo] = []

    var body: some View {
        NavigationView {
            List(repos) { repo in
                RepoRow(repo: repo)
            }
            .navigationBarTitle(Text("Repositories"), displayMode: .inline)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RepoList(repos: GithubRepoRepository.shared.list())
    }
}
