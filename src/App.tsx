import React, { useCallback, useEffect, useState } from "react";
import {
  SpeechSegment,
  SpeechProvider,
  useSpeechContext,
} from "@speechly/react-client";
import {
  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
} from "@speechly/react-ui";
import { animated, useSpring } from "react-spring";
import imgBase from "./res/base.png";
import imgLivingRoomLights from "./res/livingroom-lights.png";
import imgLivingRoomMusic from "./res/livingroom-music.png";
import imgLivingRoomTv from "./res/livingroom-tv.png";
import imgBedroomLights from  "./res/bedroom-lights.png";
import imgBedroomMusic from  "./res/bedroom-music.png";
import imgKitchenLights from  "./res/kitchen-lights.png";

type DeviceStates = {
  [device: string]: {
    powerOn: boolean;
    img?: string;
  }
};

type Rooms<T> = {
  [room: string]: T;
};

type AppState = {
  rooms: Rooms<DeviceStates>;
};

const DefaultAppState = {
  rooms: {
    "living room": {
      lights: {powerOn: true, img: imgLivingRoomLights},
      radio: {powerOn: true, img: imgLivingRoomMusic},
      television: {powerOn: true, img: imgLivingRoomTv},
    },
    bedroom: {
      lights: {powerOn: true, img: imgBedroomLights},
      radio: {powerOn: true, img: imgBedroomMusic},
    },
    kitchen: {
      lights: {powerOn: true, img: imgKitchenLights},
    },
  },
};

export default function App() {
  return (
    <div className="App">
      <SpeechProvider
        appId="a14e42a3-917e-4a57-81f7-7433ec71abad"
        language="en-US"
      >
        <BigTranscriptContainer>
          <BigTranscript />
        </BigTranscriptContainer>
        <SpeechlyApp />
        <PushToTalkButtonContainer>
          <PushToTalkButton captureKey=" " />
        </PushToTalkButtonContainer>
      </SpeechProvider>
    </div>
  );
}

function SpeechlyApp() {
  const { segment } = useSpeechContext();

  const [appState, setAppState] = useState<AppState>(DefaultAppState);
  const [tentativeAppState, setTentativeAppState] = useState<AppState>(DefaultAppState);

  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();

  // This effect is fired whenever there's a new speech segment available
  useEffect(() => {
    if (segment) {
      let alteredState = alterAppState(segment);
      // Set current app state
      setTentativeAppState(alteredState);
      if (segment.isFinal) {
        // Store the final app state as basis of next utterance
        setAppState(alteredState);
        setSelectedRoom(undefined);
        setSelectedDevice(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Create a modified app state by applying the speech segment info to the base state
  const alterAppState = useCallback(
    (segment: SpeechSegment): AppState => {
      // console.log(segment);
      switch (segment.intent.intent) {
        case "turn_on":
        case "turn_off":
          // Get values for room and device entities. Note that values are UPPER CASE by default.
          const room = segment.entities
            .find((entity) => entity.type === "room")
            ?.value.toLowerCase();
          const device = segment.entities
            .find((entity) => entity.type === "device")
            ?.value.toLowerCase();
          setSelectedRoom(room);
          setSelectedDevice(device);
          // Set desired device powerOn based on the intent
          const isPowerOn = segment.intent.intent === "turn_on";
          if (
            room &&
            device &&
            appState.rooms[room] !== undefined &&
            appState.rooms[room][device] !== undefined
          ) {
            return {
              ...appState,
              rooms: {
                ...appState.rooms,
                [room]: { ...appState.rooms[room], [device]: {...appState.rooms[room][device], powerOn: isPowerOn }},
              },
            };
          }
          break;
      }
      return appState;
    },
    [appState]
  );

  // Render the app state as outlined boxes representing rooms with devices in them
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexWrap: "wrap",
      }}
    >
      <img src={imgBase} style={{height:"100%", position: "absolute"}}/>
      {Object.keys(appState.rooms).map((room) => 
          {return Object.keys(appState.rooms[room]).map((device) => (
            <Device key={device} url={appState.rooms[room][device].img} device={device} state={appState.rooms[room][device].powerOn} tentativeState={tentativeAppState.rooms[room][device].powerOn} isTentativelySelected={selectedDevice === device && (!selectedRoom || selectedRoom === room)}/>
          ))}
      )}
    </div>
  );
}

const Device: React.FC<{ device: string, state: boolean, tentativeState: boolean, isTentativelySelected: boolean, url?: string }> = props => {
  const [springProps, setSpringProps] = useSpring(() => ({
    backgroundColor: "lightgray",
    config: { tension: 500 },
  }));

  const [changeEffect, setChangeEffect] = useSpring(() => ({
    changeEffect: 0,
    to: {changeEffect: 0}
  }));

  useEffect(() => {
    setSpringProps({
      from: {backgroundColor: "#ffffff"},
      backgroundColor: props.isTentativelySelected
        ? "cyan"
        : "lightgray",
      config: { tension: 200 }
    })
  }, [props.isTentativelySelected]);

  useEffect(() => {
    const changed = props.state !== props.tentativeState;
    if (changed) {
      setChangeEffect({
        to: [{changeEffect: 1, config: { tension: 0 }}, {changeEffect: 0, config: { duration: 650 }}],
      });
    }
  }, [props.state, props.tentativeState]);

  if (!props.url) return null;

  return (
    <animated.img
      key={props.device}
      src={props.url}
      style={{
        position: "absolute",
        height: "100%",
        opacity: props.state ? 1 : 0,
        transform: changeEffect.changeEffect.interpolate(
          x => `translate3d(0, ${Math.sin((x as number) * Math.PI) * -10}px, 0)`,
        ),
        boxShadow: changeEffect.changeEffect.interpolate(
          x => `0 0 ${(x as number) * 50}px cyan`,
        ),
      }}
    >
    </animated.img>
  )
}

