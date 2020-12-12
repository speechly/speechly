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

import Device from "./components/Device";

import imgBase from "./res/base.png";
import imgLivingRoomLights from "./res/livingroom-lights.png";
import imgLivingRoomMusic from "./res/livingroom-music.png";
import imgLivingRoomTv from "./res/livingroom-tv.png";
import imgBedroomLights from  "./res/bedroom-lights.png";
import imgBedroomMusic from  "./res/bedroom-music.png";
import imgKitchenLights from  "./res/kitchen-lights.png";
import imgTerraceLights from  "./res/terrace-lights.png";
import imgGarageLights from  "./res/garage-lights.png";

type DeviceStates = {
  statusLeft: string,
  statusTop: string,
  devices: {
    [device: string]: {
      powerOn: boolean;
      img?: string;
    }
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
      statusLeft: "65%",
      statusTop: "35%",
      devices: {
        lights: {powerOn: true, img: imgLivingRoomLights},
        radio: {powerOn: true, img: imgLivingRoomMusic},
        television: {powerOn: true, img: imgLivingRoomTv},
      }
    },
    bedroom: {
      statusLeft: "40%",
      statusTop: "10%",
      devices: {
        lights: {powerOn: true, img: imgBedroomLights},
        radio: {powerOn: true, img: imgBedroomMusic},
      }
    },
    garage: {
      statusLeft: "20%",
      statusTop: "35%",
      devices: {
        lights: {powerOn: true, img: imgGarageLights},
      }
    },
    kitchen: {
      statusLeft: "40%",
      statusTop: "60%",
      devices: {
        lights: {powerOn: true, img: imgKitchenLights},
      }
    },
    terrace: {
      statusLeft: "80%",
      statusTop: "60%",
      devices: {
        lights: {powerOn: true, img: imgTerraceLights},
      }
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
            appState.rooms[room].devices[device] !== undefined
          ) {
            return {
              ...appState,
              rooms: {
                ...appState.rooms,
                [room]: { ...appState.rooms[room], devices: {...appState.rooms[room].devices, [device]: {...appState.rooms[room].devices[device], powerOn: isPowerOn }}},
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
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        overflow:"hidden",
      }}
    >
      <div
      style={{
        position: "relative",
        height: "100vh",
      }}>
      {Object.keys(appState.rooms).map((room) => 
          {return Object.keys(appState.rooms[room].devices).map((device) => (
            <DeviceImage key={device} url={appState.rooms[room].devices[device].img} device={device} state={appState.rooms[room].devices[device].powerOn} tentativeState={tentativeAppState.rooms[room].devices[device].powerOn} isTentativelySelected={selectedDevice === device && (!selectedRoom || selectedRoom === room)}/>
          ))}
      )}
      <img src={imgBase} style={{zIndex: -1, height:"100%", position: "relative"}}/>
      {Object.keys(appState.rooms).map((room) => (
        <div
          key={room}
          style={{
            position: "absolute",
            left: appState.rooms[room].statusLeft,
            top: appState.rooms[room].statusTop,
            width: "12rem",
            height: "12rem",
            padding: "0rem",
          }}
        >
          <span style={{
            borderRadius: "1rem",
            padding: "0rem 0.5rem",
            backgroundColor:
              selectedRoom === room ? "cyan" : "white"}}>
          {room}</span>
          <div
            style={{
              paddingTop: "0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {Object.keys(appState.rooms[room].devices).map((device) => (
              <Device key={device} device={device} state={appState.rooms[room].devices[device].powerOn} tentativeState={tentativeAppState.rooms[room].devices[device].powerOn} isTentativelySelected={selectedDevice === device && (!selectedRoom || selectedRoom === room)}/>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

const DeviceImage: React.FC<{ device: string, state: boolean, tentativeState: boolean, isTentativelySelected: boolean, url?: string }> = props => {
  const [springProps, setSpringProps] = useSpring(() => ({
    opacity: props.state ? 1 : 0,
    config: { tension: 500 },
  }));

  useEffect(() => {
    setSpringProps({
      opacity: props.state ? 1 : 0,
      config: { tension: 50 }
    })
  }, [props.state]);

  if (!props.url) return null;

  return (
    <animated.img
      key={props.device}
      src={props.url}
      style={{
        position: "absolute",
        height: "100%",
        ...springProps,
      }}
    >
    </animated.img>
  )
}

