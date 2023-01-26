import SwiftUI
import Speechly

@main
struct RepoFilteringApp: App {
    @Environment(\.scenePhase) var scenePhase
    @ObservedObject var speechlyManager = SpeechlyManager()

    var body: some Scene {
        WindowGroup {
            RepoFilteringView(
                repos: self.speechlyManager.filter.apply(GithubRepoRepository.shared.list()),
                transcript: self.speechlyManager.transcript,
                startRecording: self.speechlyManager.start,
                stopRecording: self.speechlyManager.stop,
                error: self.$speechlyManager.error
            )
        }
        .onChange(of: self.scenePhase) { newPhase in
            switch newPhase {
            case .background:
                self.speechlyManager.suspend()
            case .active:
                self.speechlyManager.resume()
            default:
                break
            }
        }
    }
}
