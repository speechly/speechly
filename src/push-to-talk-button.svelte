<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import { Client, ClientState, Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import "./holdable-button.ts";
  import "./call-out.ts";
  import { createDispatchUnbounded} from "./fixDispatch";
  import type { IHoldEvent } from "./types";

  const SHORT_PRESS_TRESHOLD_MS = 600
  const dispatchUnbounded = createDispatchUnbounded();

  export let projectid: string = undefined;
  export let appid: string = undefined;
  export let size = "6rem";
  export let capturekey = " ";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";
  export let poweron = undefined;
  export let hide = undefined;
  export let placement = undefined;
  export let voffset = "3rem";
  export let intro = "Hold to talk";
  export let hint = "Hold to talk";
  export let fontsize = "1.2rem";
  export let showtime = 10000;
  export let textcolor = "#ffffff";
  export let backgroundcolor = "#202020";
  export let taptotalktime = 8000; // ms to listen after tap. Set to 0 to disable tap-to-talk.
  export let silencetohanguptime = 4000; // ms of silence to listen before hangup

  let icon: ClientState = ClientState.Disconnected;
  let buttonHeld = false;
  let initializedSuccessfully = undefined;
  let tipCalloutVisible = false;
  let mounted = false;

  let stopContextTimeout = null;
  let holdListening = false;

  $: tipCallOutText = intro;
  $: showPowerOn = poweron !== undefined && poweron !== "false";
  $: icon = showPowerOn ? ClientState.Disconnected : ClientState.Connected;
  $: connectSpeechly(projectid, appid);

  let client = null;
  let clientState: ClientState = undefined;

  onMount(() => {
    mounted = true;
    connectSpeechly(projectid, appid);
  });

  const connectSpeechly = (projectid: string, appid: string) => {
    if (mounted && !client && (projectid || appid)) {
      const clientOptions = {
        ...(appid && !projectid && {appId: appid}),
        ...(projectid && {projectId: projectid}),
      }
      console.log("Creating client with ClientOptions", clientOptions);

      client = new Client(clientOptions);

      client.onStateChange(onStateChange);

      client.onSegmentChange((segment: Segment) => {
        // Refresh stopContext timeout if set
        if (stopContextTimeout) setStopContextTimeout(silencetohanguptime);
        // Pass on segment updates from Speechly API as events
        dispatchUnbounded("speechsegment", segment);
        // And as window.postMessages
        window.postMessage({ type: "speechsegment", segment: segment }, "*");
      });

      tipCalloutVisible = true;
    }
  }

  const initializeSpeechly = async () => {
    // Create a new Client. appid and language are configured in the dashboard.

    // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
    // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
    (async () => {
      try {
        console.log("Initializing...", client);
        dispatchUnbounded("starting");
        await client.initialize();
        console.log("Initialized");
      } catch (e) {
        console.log("Initialization failed", e);
        client = null;
      }
    })();
  };

  const tangentStart = (event) => {
    buttonHeld = true;
    tipCalloutVisible = false;
    if (client) {
      // Connect on 1st press
      if (isConnectable(clientState)) {
        if (appid || projectid) {
          initializeSpeechly();
        } else {
          console.warn(
            "No appid attribute specified. Speechly voice services are unavailable."
          );
        }
      } else {
        if (stopContextTimeout) {
          window.clearTimeout(stopContextTimeout);
          stopContextTimeout = null;
        }
        if (isStartable(clientState)) {
          console.log(appid)
          client.startContext(appid);
        }
      }
    }
    // Send as window.postMessages
    window.postMessage({ type: "holdstart", state: clientState }, "*");

  };

  const tangentEnd = (event) => {
    const holdEventData: IHoldEvent = event.detail;
    buttonHeld = false;

    if (initializedSuccessfully !== false) {
      // Detect short press
      if (holdEventData.timeMs < SHORT_PRESS_TRESHOLD_MS) {
        if (taptotalktime == 0) {
          tipCallOutText = hint;
          tipCalloutVisible = true;
        } else {
          // Short press when not recording = schedule "silence based stop"
          if (!holdListening) {
            setStopContextTimeout(taptotalktime);
          }
        }
      }

      if (!stopContextTimeout) {
        stopListening();
      }
    }

    // Send as window.postMessages
    window.postMessage({ type: "holdend" }, "*");
  };

  const setStopContextTimeout = (timeoutMs: number) => {
    holdListening = true;
    if (stopContextTimeout) {
      window.clearTimeout(stopContextTimeout);
    }
    stopContextTimeout = window.setTimeout(() => {
      stopContextTimeout = null;
      stopListening();
    }, timeoutMs);
  }

  const stopListening = () => {
    holdListening = false;
    if (client) {
      if (isStoppable(clientState)) {
        client.stopContext();
      }
    }
    updateSkin();
  }

  const updateSkin = () => {
    if (clientState) icon = clientState;
  };

  const isConnectable = (clientState?: ClientState) => {
    if (!clientState) return true;
    return clientState === ClientState.Disconnected;
  };

  const isStartable = (clientState: ClientState) =>
    clientState === ClientState.Connected;

  const isStoppable = (s: ClientState) => {
    switch (s) {
      case ClientState.Starting:
      case ClientState.Recording:
      // case ClientState.Stopping:
        return true;
      default:
        return false;
    }
  };

  const onStateChange = (s: ClientState) => {
    clientState = s;
    updateSkin();
    switch(s) {
      case ClientState.Failed:
        setInitialized(false, "Failed");
        break;
      case ClientState.NoBrowserSupport:
        setInitialized(false, "NoBrowserSupport");
        break;
      case ClientState.NoAudioConsent:
        setInitialized(false, "NoAudioConsent");
        break;
      case ClientState.Connected:
        setInitialized(true, "Ready");
        // Automatically start recording if button held
        if (!showPowerOn && (buttonHeld || holdListening) && isStartable(clientState)) {
          client.startContext();
        }
        break;
    }
    // Broadcast state changes
    window.postMessage({ type: "speechstate", state: s }, "*");
  };

  const setInitialized = (success: boolean, status: string) => {
    if (initializedSuccessfully === undefined) {
      initializedSuccessfully = success;
      
      window.postMessage({
        type: "initialized",
        success: initializedSuccessfully,
        appId: appid,
        status
      }, "*");

      dispatchUnbounded("initialized", {
        success: initializedSuccessfully,
        appId: appid,
        status
      });
    }
  }
</script>

<holdable-button class:placementBottom={placement === "bottom"}
  on:holdstart={tangentStart}
  on:holdend={tangentEnd}
  {size}
  {icon}
  {capturekey}
  {gradientstop1}
  {gradientstop2}
  {hide}
  style="
    --voffset: {voffset};
    --size: {size};
  ">
  <call-out {fontsize} show={tipCallOutText !== "" && tipCalloutVisible && !hide ? "true" : "false"} showtime={showtime} textcolor={textcolor} backgroundcolor={backgroundcolor}>{tipCallOutText}</call-out>
</holdable-button>

<style>
  .placementBottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(var(--size) + var(--voffset));
    max-height: 100vh;
    pointer-events: none;

    display: flex;
    flex-direction: row;
    justify-content: center;
    z-index: 50;
  }
</style>
