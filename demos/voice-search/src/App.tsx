import React from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { IntroPopup } from "@speechly/react-ui";
import { SearchContextProvider } from "./context";
import SearchView from "./SearchView";
import { isStandalone } from "./utils";
import "./App.css"

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        { !isStandalone && <DemoNavigation /> }
        <IntroPopup />
        <SearchView />
      </div>
    </SearchContextProvider>
  )
}

export default App
