import React from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { ErrorPanel, BigTranscript } from "@speechly/react-ui";
import { SearchContextProvider } from "./context";
import SearchView from "./SearchView";
import "./App.css"

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        <DemoNavigation />
        <div className="TranscriptContainer">
          <BigTranscript highlightColor="#009FFA" backgroundColor="#30465c" marginBottom="0px" />
        </div>
        <ErrorPanel />
        <SearchView />
      </div>
    </SearchContextProvider>
  )
}

export default App
