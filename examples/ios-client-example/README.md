# Speechly iOS Client Example

This repository contains an example app for filtering data using [Speechly iOS Client](https://github.com/speechly/ios-client).

Built with:

- [Swift](https://swift.org)
- [SwiftUI](https://developer.apple.com/documentation/swiftui/)
- [Speechly iOS client](https://github.com/speechly/ios-client)

## Installation

You will need Xcode (this project was built with Xcode 12) and device simulators. This app requires iOS version at least 14.0.

1. Download this example app, e.g. using [degit](https://github.com/Rich-Harris/degit) `npx degit speechly/speechly/examples/ios-client-example ios-example`.
2. Open the project in Xcode.
3. Create a Speechly application, following [our quick start tutorial](https://docs.speechly.com/quick-start/).
4. Use the configuration from [speechly_app_configuration.sal](speechly_app_configuration.sal), remember to declare the entities and intents.
5. Deploy your Speechly application and update the `appId` in [SpeechlyManager.swift](RepoFiltering/Speechly/SpeechlyManager.swift).
6. Build and run the app.

## Usage

Finally you are ready to run the app, you can try out the following phrases:

- Show me all Python repos
- Sort by followers
- Clear the filters
