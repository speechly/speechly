import React from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { ErrorPanel } from "@speechly/react-ui";
import { SearchContextProvider } from "./context";
import SearchView from "./SearchView";
import { isStandalone } from "./utils";
import "./App.css"

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        { !isStandalone && <DemoNavigation /> }
        <ErrorPanel />
        <SearchView />
      </div>
    </SearchContextProvider>
  )
}

export default App
