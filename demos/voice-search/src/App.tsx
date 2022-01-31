import React from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { ErrorPanel } from "@speechly/react-ui";
import { SearchContextProvider } from "./context";
import SearchView from "./SearchView";
import "./App.css"

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        { process.env.REACT_APP_VOICE_SEARCH_DEPLOYMENT !== 'STANDALONE' && <DemoNavigation /> }
        <ErrorPanel />
        <SearchView />
      </div>
    </SearchContextProvider>
  )
}

export default App
