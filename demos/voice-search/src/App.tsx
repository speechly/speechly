import React from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { ErrorPanel, BigTranscript } from "@speechly/react-ui";
import { Input } from "./Input";
import "./App.css";
import avatar from "./assets/avatar.png";
import logo from "./assets/logo.svg";
import searchIcon from "./assets/search.svg";
import imageIcon from "./assets/image.svg";
import videoIcon from "./assets/video.svg";
import newsIcon from "./assets/news.svg";
import { SearchContextProvider } from "./context";

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        <DemoNavigation />
        <div className="TranscriptContainer">
          <BigTranscript highlightColor="#009FFA" backgroundColor="#1F2D3B" />
        </div>
        <ErrorPanel />
        <SearchApp />
      </div>
    </SearchContextProvider>
  )
}

const SearchApp: React.FC = (): JSX.Element => {
  return (
    <div className="SearchApp">
      <div className="Navigation">
        {/* <div className="Navigation__left">
          <Input small />
        </div> */}
        <div className="Navigation__right">
          <div className="Navigation__item Navigation__item--active">
            <img src={searchIcon} alt="icon" />
            <span>All</span>
          </div>
          <div className="Navigation__item">
            <img src={imageIcon} alt="icon" />
            <span>Images</span>
          </div>
          <div className="Navigation__item">
            <img src={videoIcon} alt="icon" />
            <span>Videos</span>
          </div>
          <div className="Navigation__item">
            <img src={newsIcon} alt="icon" />
            <span>News</span>
          </div>
          <div className="Navigation__avatar">
            <img src={avatar} alt="profile" />
          </div>
        </div>
      </div>
      <div className="Search">
        <img className="Search__logo" src={logo} alt="logo" />
        <Input />
      </div>
      <div className="Footer">
        &copy; Speechly
      </div>
    </div>
  )
}

export default App
