import {
  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel,
} from "@speechly/react-ui";
import PanContainer from "./components/PanContainer";
import QueryString from "query-string";
import FloorPlan from "FloorPlan";
import { DemoNavigation } from "@speechly/demo-navigation";

// http://localhost:3000/?backgroundColor=%23ff00ff&zoom=0.5&zoomPan=false
const queryParams = {
  backgroundColor: "#CEDCEE",
  ...QueryString.parse(window.location.search), // This suffices for strings
  zoom: Number(QueryString.parse(window.location.search).zoom || 0.9),
  zoomPan: !(QueryString.parse(window.location.search).zoomPan === "false"),
};

export default function App() {
  return (
    <div className="App" style={{ backgroundColor: queryParams.backgroundColor }}>
      <DemoNavigation />
      <BigTranscriptContainer>
        <BigTranscript />
      </BigTranscriptContainer>
      <PushToTalkButtonContainer>
        <ErrorPanel />
        <PushToTalkButton captureKey=" " powerOn={true} intro="" />
      </PushToTalkButtonContainer>
      <PanContainer
        minScale={0.5}
        maxScale={3.0}
        disableZoom={!queryParams.zoomPan}
        disablePan={!queryParams.zoomPan}
        defaultValue={{
          scale: queryParams.zoom,
          translation: { x: 0, y: 0 },
        }}
      >
        <FloorPlan />
      </PanContainer>
    </div>
  );
}
