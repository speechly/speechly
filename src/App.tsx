import React, { useCallback, useEffect, useState } from "react";
import {
  SpeechSegment,
  SpeechProvider,
  useSpeechContext,
  Entity,
} from "@speechly/react-client";
import {
  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel,
} from "./@speechly/react-ui";
import { animated, useSpring } from "react-spring";
import { MapInteractionCSS } from 'react-map-interaction';
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
import HttpsRedirect from "./components/HttpsRedirect";

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

const validRooms = [
  "living room",
  "bedroom",
  "kitchen",
  "garage",
  "terrace",
]

const validDevices = [
  "lights",
  "radio",
  "television",
]

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
      <HttpsRedirect>
        <SpeechProvider
          appId="738ec39c-3a5c-435f-aa5a-4d815a3e8d87"
          language="en-US"
        >
          <BigTranscriptContainer>
            <BigTranscript />
          </BigTranscriptContainer>
          <PushToTalkButtonContainer>
            <ErrorPanel/>
            <PushToTalkButton captureKey=" " />
          </PushToTalkButtonContainer>
          <SpeechlyApp />
        </SpeechProvider>
      </HttpsRedirect>
    </div>
  );
}

function SpeechlyApp() {
  const { segment } = useSpeechContext();

  const [appState, setAppState] = useState<AppState>(DefaultAppState);
  const [tentativeAppState, setTentativeAppState] = useState<AppState>(DefaultAppState);

  const [selectedRooms, setSelectedRooms] = useState<Entity[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Entity[]>([]);

  // This effect is fired whenever there's a new speech segment available
  useEffect(() => {
    if (segment) {
      let alteredState = alterAppState(segment);
      // Set current app state
      setTentativeAppState(alteredState);
      if (segment.isFinal) {
        // Store the final app state as basis of next utterance
        setAppState(alteredState);
        // setSelectedRoom(undefined);
        // setSelectedDevice(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Create a modified app state by applying the speech segment info to the base state
  const alterAppState = useCallback(
    (segment: SpeechSegment): AppState => {
      console.log(segment);
      // Get values for room and device entities. Note that values are UPPER CASE by default.
      let workingState = appState;
      let newRooms = segment.entities
        .filter((entity) => entity.type === "room" && validRooms.includes(entity.value.toLowerCase()));
      let newDevices = segment.entities
        .filter((entity) => entity.type === "device" && validDevices.includes(entity.value.toLocaleLowerCase()));

      let rooms = newRooms.length > 0 ? newRooms : selectedRooms;
      let devices = newDevices.length > 0 ? newDevices : selectedDevices;

      switch (segment.intent.intent) {
        case "turn_on":
        case "turn_off":
        case "select":
          // Set desired device powerOn based on the intent
          if (segment.intent.intent === "turn_on" || segment.intent.intent === "turn_off") {
            const isPowerOn = segment.intent.intent === "turn_on";
            workingState = rooms.reduce((prev: AppState, room: Entity) => {
              return devices.reduce((prev: AppState, device: Entity) => {
                if (room.isFinal && device.isFinal) {
                  const roomKey = room.value.toLowerCase();
                  const deviceKey = device.value.toLowerCase();
                  if (
                    prev.rooms[roomKey] !== undefined &&
                    prev.rooms[roomKey].devices[deviceKey] !== undefined
                  ) {
                    return {
                      ...prev,
                      rooms: {
                        ...prev.rooms,
                        [roomKey]: { ...prev.rooms[roomKey], devices: {...prev.rooms[roomKey].devices, [deviceKey]: {...prev.rooms[roomKey].devices[deviceKey], powerOn: isPowerOn }}},
                      },
                    };
                  }
                }
                return prev;
              }, prev);
            }, {...workingState});
          }
          break;
      }

      if (segment.isFinal) {
        // Set entities as tentative for the next segment
        rooms.forEach(x => x.isFinal = false);
        devices.forEach(x => x.isFinal = false);
      }

      setSelectedRooms(rooms);
      setSelectedDevices(devices);

      return workingState;
    },
    [appState, selectedRooms, selectedDevices]
  );

  // Render the app state as outlined boxes representing rooms with devices in them
  return (
      <MapInteractionCSS minScale={0.5} maxScale={3.0} defaultValue={{scale: 0.90, translation: {x:0, y:0}}}>
      <div
        style={{
          position: "relative",
          width: "125vh",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img src={imgBase} style={{height:"100%", position: "absolute"}}/>
        {Object.keys(appState.rooms).map((room) => 
            {return Object.keys(appState.rooms[room].devices).map((device) => (
              <DeviceImage key={device} url={appState.rooms[room].devices[device].img} device={device} state={appState.rooms[room].devices[device].powerOn} tentativeState={tentativeAppState.rooms[room].devices[device].powerOn}/>
            ))}
        )}
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
                selectedRooms.find(x => x.value.toLowerCase() === room) ? "cyan" : "white"}}>
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
                <Device key={device} device={device} state={appState.rooms[room].devices[device].powerOn} tentativeState={tentativeAppState.rooms[room].devices[device].powerOn} isTentativelySelected={selectedDevices.find(d => d.value.toLowerCase() === device) !== undefined && (selectedRooms.length === 0 || selectedRooms.find(d => d.value.toLowerCase() === room) !== undefined)}/>
              ))}
            </div>
          </div>
        ))}
      </div>
      </MapInteractionCSS>
  );
}

const DeviceImage: React.FC<{ device: string, state: boolean, tentativeState: boolean, url?: string }> = props => {
  const [springProps, setSpringProps] = useSpring(() => ({
    opacity: props.tentativeState ? 1 : 0,
    config: { tension: 500 },
  }));

  useEffect(() => {
    setSpringProps({
      opacity: props.tentativeState ? 1 : 0,
      config: { tension: 500 }
    })
  }, [props.tentativeState]);

  if (!props.url) return null;

  return (
    <animated.img
      key={props.device}
      src={props.url}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        ...springProps,
      }}
    >
    </animated.img>
  )
}

