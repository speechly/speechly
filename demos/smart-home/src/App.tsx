import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  SpeechSegment,
  SpeechProvider,
  useSpeechContext,
  Entity,
  Intent,
  SpeechState,
} from "@speechly/react-client";
import {
  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel,
} from "@speechly/react-ui";
import { isWebpSupported } from "react-image-webp/dist/utils";
import { animated, useSpring } from "react-spring";
import Device from "./components/Device";
import PanContainer from "./components/PanContainer";
import QueryString from "query-string";

import HttpsRedirect from "./components/HttpsRedirect";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";

const appId = process.env.REACT_APP__SPEECHLY_APP_ID || "738ec39c-3a5c-435f-aa5a-4d815a3e8d87"
const FORGETTING_TIMEOUT_MS = 12000;

type DeviceStates = {
  statusLeft: string;
  statusTop: string;
  devices: {
    [device: string]: {
      powerOn: boolean;
      img?: string;
    };
  };
};

type Rooms<T> = {
  [room: string]: T;
};

type AppState = {
  rooms: Rooms<DeviceStates>;
};

const validRooms = ["living room", "bedroom", "kitchen", "garage", "terrace"];

const validDevices = ["lights", "radio", "television"];

const allDevices = ["everything", "all devices", "every device"];

const DefaultAppState = {
  rooms: {
    "living room": {
      statusLeft: "65%",
      statusTop: "35%",
      devices: {
        lights: { powerOn: true, img: "livingroom-lights" },
        radio: { powerOn: true, img: "livingroom-music" },
        television: { powerOn: true, img: "livingroom-tv" },
      },
    },
    bedroom: {
      statusLeft: "40%",
      statusTop: "10%",
      devices: {
        lights: { powerOn: true, img: "bedroom-lights" },
        radio: { powerOn: true, img: "bedroom-music" },
      },
    },
    garage: {
      statusLeft: "20%",
      statusTop: "35%",
      devices: {
        lights: { powerOn: true, img: "garage-lights" },
      },
    },
    kitchen: {
      statusLeft: "40%",
      statusTop: "60%",
      devices: {
        lights: { powerOn: true, img: "kitchen-lights" },
      },
    },
    terrace: {
      statusLeft: "80%",
      statusTop: "60%",
      devices: {
        lights: { powerOn: true, img: "terrace-lights" },
      },
    },
  },
};

// http://localhost:3000/?backgroundColor=%23ff00ff&zoom=0.5&zoomPan=false
const queryParams = {
  backgroundColor: "#CEDCEE",
  ...QueryString.parse(window.location.search), // This suffices for strings
  zoom: Number(QueryString.parse(window.location.search).zoom || 0.9),
  zoomPan: !(QueryString.parse(window.location.search).zoomPan === "false"),
};

export default function App() {
  return (
    <HttpsRedirect>
      <div className="App" style={{ backgroundColor: queryParams.backgroundColor }}>
        <SpeechProvider
          appId={appId}
        >
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
            <SpeechlyApp />
          </PanContainer>
        </SpeechProvider>
      </div>
    </HttpsRedirect>
  );
}

function SpeechlyApp() {
  const { segment, speechState } = useSpeechContext();
  const [appState, setAppState] = useState<AppState>(DefaultAppState);
  const [tentativeAppState, setTentativeAppState] = useState<AppState>(
    DefaultAppState
  );

  const timer = useRef<number | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<Entity[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Entity[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<Intent>({
    intent: "",
    isFinal: false,
  });

  useEffect(() => {
    switch(speechState) {
      case SpeechState.Idle:
        PubSub.publish(SpeechlyUiEvents.Notification, {message: `Press the button to start`});
        break;
      case SpeechState.Ready:
        if (appState === DefaultAppState) {
          PubSub.publish(SpeechlyUiEvents.Notification, {message: `Say "Turn off everything"`, footnote: "Hold the button while talking"});
        }
        break;
    }
  }, [speechState, appState]);

  // This effect is fired whenever there's a new speech segment available
  useEffect(() => {
    if (segment) {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }

      const {alteredState, effectiveIntent, numChanges} = alterAppState(segment);
      // Set current app state
      setTentativeAppState(alteredState);
      if (segment.isFinal) {
        // Store the final app state as basis of next utterance
        setAppState(alteredState);
        timer.current = window.setTimeout(() => {
          setSelectedRooms([]);
          setSelectedDevices([]);
          setSelectedIntent({ intent: "", isFinal: false });
        }, FORGETTING_TIMEOUT_MS);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Create a modified app state by applying the speech segment info to the base state
  const alterAppState = useCallback(
    (segment: SpeechSegment): {alteredState: AppState, effectiveIntent: string, numChanges: number} => {
      let numChanges = 0;
      let numSelections = 0;
      // console.log(segment);
      let workingState = appState;
      // Get values for room and device entities. Note that values are UPPER CASE by default.
      let newRooms = segment.entities.filter(
        (entity) =>
          entity.type === "room" &&
          validRooms.includes(entity.value.toLowerCase())
      );
      let newDevices: Entity[] = [];

      // Check if all devices are targeted and if that's final
      let selectAll = segment.entities.reduce((prev, entity) => {
        if (
          entity.type === "device" &&
          allDevices.includes(entity.value.toLocaleLowerCase())
        ) {
          return Math.max(prev, entity.isFinal ? 2 : 1);
        }
        return prev;
      }, 0);

      if (selectAll > 0) {
        newDevices = validDevices.map(
          (deviceName) =>
            ({ value: deviceName, isFinal: selectAll > 1 } as Entity)
        );
        numSelections++;
      } else {
        newDevices = segment.entities.filter(
          (entity) =>
            entity.type === "device" &&
            validDevices.includes(entity.value.toLocaleLowerCase())
        );
        numSelections += newDevices.length;
      }

      let rooms =
        newRooms.length > 0
          ? newRooms
          : selectedRooms.length > 0
          ? selectedRooms
          : validRooms.map(
              (name) => ({ value: name, isFinal: false } as Entity)
            );
      let devices = newDevices.length > 0 ? newDevices : selectedDevices;
      let intent = segment.intent;

      numSelections += newRooms.length;

      switch (segment.intent.intent) {
        case "turn_on":
        case "turn_off":
          setSelectedIntent(intent);
          break;
        default:
          // Restore earlier intent
          intent = selectedIntent;
          break;
      }

      let effectiveIntent = "select";

      switch (intent.intent) {
        case "turn_on":
        case "turn_off":
          // Set desired device powerOn based on the intent
          let numNewTargets = 0;
          let numRememberedTargets = 0;
          if (newDevices.length > 0) numNewTargets++;
          if (newRooms.length > 0) numNewTargets++;
          if (selectedDevices.length > 0) numRememberedTargets++;
          if (selectedRooms.length > 0) numRememberedTargets++;

          let applyChanges: boolean = false;
          if (segment.isFinal) applyChanges = true;
          if (numNewTargets >= 2) applyChanges = true;
          if (numNewTargets >= 1 && numRememberedTargets > 1) applyChanges = true;

          if (applyChanges) {
            effectiveIntent = intent.intent;
            const isPowerOn = intent.intent === "turn_on";
            workingState = rooms.reduce(
              (prev: AppState, room: Entity) => {
                return devices.reduce((prev: AppState, device: Entity) => {
                  const roomKey = room.value.toLowerCase();
                  const deviceKey = device.value.toLowerCase();
                  if (
                    prev.rooms[roomKey] !== undefined &&
                    prev.rooms[roomKey].devices[deviceKey] !== undefined
                  ) {
                    if (prev.rooms[roomKey].devices[deviceKey].powerOn !== isPowerOn) {
                      numChanges++;
                      return {
                        ...prev,
                        rooms: {
                          ...prev.rooms,
                          [roomKey]: {
                            ...prev.rooms[roomKey],
                            devices: {
                              ...prev.rooms[roomKey].devices,
                              [deviceKey]: {
                                ...prev.rooms[roomKey].devices[deviceKey],
                                powerOn: isPowerOn,
                              },
                            },
                          },
                        },
                      };
                    }
                  }
                  return prev;
                }, prev);
              },
              { ...workingState }
            );
          }
          break;
      }

      if (segment.isFinal) {
        // Set entities as tentative for the next segment
        newRooms.forEach((x) => (x.isFinal = false));
        newDevices.forEach((x) => (x.isFinal = false));
        intent.isFinal = false;
      }

      if (newRooms.length > 0) setSelectedRooms(newRooms);
      if (newDevices.length > 0) setSelectedDevices(newDevices);

      return {
        alteredState: workingState,
        effectiveIntent,
        numChanges: effectiveIntent === "select" ? numSelections : numChanges };
    },
    [appState, selectedRooms, selectedDevices]
  );

  // Render the app state as outlined boxes representing rooms with devices in them
  return (
    <div
      style={{
        position: "relative",
        width: "125vh",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src={isWebpSupported() ? `img-webp/base.webp` : `img-png/base.png`}
        alt=""
        style={{ height: "100%", position: "absolute" }}
      />
      {Object.keys(tentativeAppState.rooms).map((room) => {
        return Object.keys(tentativeAppState.rooms[room].devices).map((device) => (
          <DeviceImage
            key={device}
            url={tentativeAppState.rooms[room].devices[device].img}
            device={device}
            state={tentativeAppState.rooms[room].devices[device].powerOn}
            tentativeState={
              tentativeAppState.rooms[room].devices[device].powerOn
            }
          />
        ));
      })}
      {Object.keys(tentativeAppState.rooms).map((room) => (
        <div
          key={room}
          style={{
            position: "absolute",
            left: tentativeAppState.rooms[room].statusLeft,
            top: tentativeAppState.rooms[room].statusTop,
            width: "12rem",
            height: "12rem",
            padding: "0rem",
          }}
        >
          <span
            style={{
              borderRadius: "1rem",
              padding: "0rem 0.5rem",
              backgroundColor: selectedRooms.find(
                (x) => x.value.toLowerCase() === room
              )
                ? "cyan"
                : "white",
            }}
          >
            {room}
          </span>
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
            {Object.keys(tentativeAppState.rooms[room].devices).map((device) => (
              <Device
                key={device}
                device={device}
                state={tentativeAppState.rooms[room].devices[device].powerOn}
                tentativeState={
                  tentativeAppState.rooms[room].devices[device].powerOn
                }
                isTentativelySelected={
                  selectedDevices.find(
                    (d) => d.value.toLowerCase() === device
                  ) !== undefined &&
                  (selectedRooms.length === 0 ||
                    selectedRooms.find(
                      (d) => d.value.toLowerCase() === room
                    ) !== undefined)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const DeviceImage: React.FC<{
  device: string;
  state: boolean;
  tentativeState: boolean;
  url?: string;
}> = (props) => {
  const [springProps, setSpringProps] = useSpring(() => ({
    opacity: props.tentativeState ? 1 : 0,
    config: { tension: 500 },
  }));

  useEffect(() => {
    setSpringProps({
      opacity: props.tentativeState ? 1 : 0,
      config: { tension: 500 },
    });
  }, [props.tentativeState]);

  if (!props.url) return null;

  return (
    <animated.img
      key={props.device}
      src={
        isWebpSupported()
          ? `img-webp/${props.url}.webp`
          : `img-png/${props.url}.png`
      }
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        ...springProps,
      }}
    ></animated.img>
  );
};
