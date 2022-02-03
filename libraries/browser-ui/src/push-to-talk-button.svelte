<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import type { Segment, IHoldEvent } from "./types";
  import "./holdable-button.ts";
  import "./call-out.ts";
  import { Client } from "@speechly/browser-client";
  import { ClientState, LocalStorageKeys, MessageType } from "./constants";
  import { onMount } from "svelte";
  import { createDispatchUnbounded} from "./fixDispatch";

  const TAP_TRESHOLD_MS = 600
  const PERMISSION_PRE_GRANTED_TRESHOLD_MS = 1500
  const dispatchUnbounded = createDispatchUnbounded();

  export let projectid: string = undefined;
  export let appid: string = undefined;
  export let loginurl = undefined;
  export let apiurl = undefined;

  export let capturekey = " ";
  export let poweron = undefined;
  export let hide = undefined;
  export let taptotalktime = 8000; // ms to listen after tap. Set to 0 to disable tap-to-talk.
  export let silencetohanguptime = 1000; // ms of silence to listen before hangup

  export let intro = "Hold to talk";
  export let hint = "Hold to talk";
  export let showtime = 10000;

  export let placement = undefined;
  export let size = "80px";
  export let voffset = "2.5rem";

  export let backgroundcolor = "#ffffff";
  export let iconcolor = "#000000";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";

  export let fontsize = "1.2rem";
  export let textcolor = "#ffffff";
  export let hintbackgroundcolor = "#202020";

  export let holdscale = "1.35";
  export let borderscale = "0.075";
  export let iconsize = "60%";
  export let fxsize = "250%";
  export let cssimport = undefined;
  export let customtypo = undefined;

  let useFTUEPermissionPriming = false;
  let icon: ClientState = ClientState.Disconnected;
  let holdListenActive = false;
  let initializedSuccessfully = undefined;
  let tipCalloutVisible = false;
  let mounted = false;

  let tapListenTimeout = null;
  let tapListenActive = false;
  let tangentStartPromise = null;

  $: tipCallOutText = intro;
  $: showPowerOn = poweron !== undefined && poweron !== "false";
  $: icon = showPowerOn ? ClientState.Disconnected : ClientState.Connected;
  $: connect(projectid, appid);
  $: defaultTypography = customtypo === undefined || customtypo === "false";

  let client = null;
  let clientState: ClientState = undefined;

  onMount(() => {
    mounted = true;
    useFTUEPermissionPriming = (document.querySelector("intro-popup") !== null) && (localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null);
    connect(projectid, appid);
  });

  const connect = (projectid: string, appid: string) => {
    if (mounted && !client && (projectid || appid)) {
      const clientOptions = {
        ...(appid && !projectid && {appId: appid}),
        ...(projectid && {projectId: projectid}),
        ...(loginurl && {loginUrl: loginurl}),
        ...(apiurl && {apiUrl: apiurl}),
      }
      client = new Client(clientOptions);

      client.onStateChange(onStateChange);
      client.onSegmentChange((segment: Segment) => {
        // Refresh stopContext timeout if set
        if (tapListenTimeout) setStopContextTimeout(silencetohanguptime);
        // Pass on segment updates from Speechly API as events
        dispatchUnbounded(MessageType.speechsegment, segment);
        // And as window.postMessages
        window.postMessage({ type: MessageType.speechsegment, segment: segment }, "*");
      });

      // Temporary check for client.connect function
      if (typeof client.connect === "function") {
        client.connect();
      }

      tipCalloutVisible = true;
    }
  }

  const initialize = async () => {
    // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
    // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).

    try {
      dispatchUnbounded("starting");
      window.postMessage({
        type: MessageType.speechlystarting
      }, "*");
      await client.initialize();
    } catch (e) {
      console.error("Speechly initialization failed", e);
      client = null;
    }
  };

  const tangentStart = async (event) => {
    tangentStartPromise = (async () => {
      tipCalloutVisible = false;
      if (client) {
        // Connect on 1st press
        if (useFTUEPermissionPriming) {
          window.postMessage({
            type: MessageType.speechlyrequestpriming
          }, "*");
        } else if (isConnectable(clientState)) {
          if (appid || projectid) {
            const initStartTime = Date.now();
            await initialize();
            // Long init time suggests permission dialog --> prevent listening start
            holdListenActive = !showPowerOn && Date.now() - initStartTime < PERMISSION_PRE_GRANTED_TRESHOLD_MS;
          } else {
            console.warn(
              "No appid/projectid attribute specified. Speechly voice services are unavailable."
            );
          }
        } else {
          holdListenActive = true;
        }

        if (holdListenActive) {
          if (tapListenTimeout) {
            window.clearTimeout(tapListenTimeout);
            tapListenTimeout = null;
          }
          if (isStartable(clientState)) {
            dispatchUnbounded("startcontext");
            client.startContext(appid);
          }
        }
      }
      // Send as window.postMessages
      window.postMessage({ type: MessageType.holdstart, state: clientState }, "*");
    })()
  };

  const tangentEnd = async (event) => {
    // Ensure async tangentStart and end are run in appropriate order
    await tangentStartPromise;

    if (client && holdListenActive) {
      holdListenActive = false;
      const holdEventData: IHoldEvent = event.detail;

      // Detect short press
      if (holdEventData.timeMs < TAP_TRESHOLD_MS) {
        if (taptotalktime == 0) {
          tipCallOutText = hint;
          tipCalloutVisible = true;
        } else {
          // Short press when not recording = schedule "silence based stop"
          if (!tapListenActive) {
            setStopContextTimeout(taptotalktime);
          }
        }
      }

      if (!tapListenTimeout) {
        stopListening();
      }
    }

    // Send as window.postMessages
    window.postMessage({ type: "holdend" }, "*");
  };

  const setStopContextTimeout = (timeoutMs: number) => {
    tapListenActive = true;
    if (tapListenTimeout) {
      window.clearTimeout(tapListenTimeout);
    }
    tapListenTimeout = window.setTimeout(() => {
      tapListenTimeout = null;
      stopListening();
    }, timeoutMs);
  }

  const stopListening = () => {
    tapListenActive = false;
    if (client) {
      if (isStoppable(clientState)) {
        client.stopContext();
        dispatchUnbounded("stopcontext");
      }
    }
    updateSkin();
  }

  const updateSkin = () => {
    if (clientState !== null) icon = clientState;
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
      case ClientState.NoBrowserSupport:
      case ClientState.NoAudioConsent:
        setInitialized(false, s as unknown as string);
        break;
      case ClientState.Connected:
        setInitialized(true, s as unknown as string);
        // Automatically start recording if button held
        if (!showPowerOn && (holdListenActive || tapListenActive) && isStartable(clientState)) {
          dispatchUnbounded("startcontext");
          client.startContext(appid);
        }
        break;
    }
    // Broadcast state changes
    window.postMessage({ type: MessageType.speechstate, state: s }, "*");
  };

  const setInitialized = (success: boolean, state: string) => {
    if (initializedSuccessfully === undefined) {
      initializedSuccessfully = success;
      useFTUEPermissionPriming = false;
      if (localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null) {
        localStorage.setItem(LocalStorageKeys.SpeechlyFirstConnect, String(Date.now()));
      }
      
      window.postMessage({
        type: MessageType.initialized,
        success: initializedSuccessfully,
        appId: appid,
        state
      }, "*");

      dispatchUnbounded(MessageType.initialized, {
        success: initializedSuccessfully,
        appId: appid,
        state
      });

    }
  }

  const handleMessage = (e) => {
    switch (e.data.type) {
      case MessageType.showhint:
        tipCallOutText = e.data.hint;
        tipCalloutVisible = true;
        break;
      case MessageType.speechlyintroready:
        useFTUEPermissionPriming = localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null;
        break;
    }
  }

</script>

<svelte:window on:message={handleMessage}/>

<svelte:head>
  {#if defaultTypography}
    <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
  {/if}
</svelte:head>

<holdable-button class:placementBottom={placement === "bottom"}
  on:holdstart={tangentStart}
  on:holdend={tangentEnd}
  {size}
  {icon}
  {capturekey}
  {gradientstop1}
  {gradientstop2}
  {hide}

  {backgroundcolor}
  {iconcolor}
  {holdscale}
  {borderscale}
  {iconsize}
  {fxsize}
  {cssimport}

  style="
    --voffset: {voffset};
    --size: {size};
    --textcolor: {textcolor};
    --fontsize: {fontsize};
  ">
  <call-out class:defaultTypography={defaultTypography} show={tipCallOutText !== "" && tipCalloutVisible && !hide ? "true" : "false"} showtime={showtime} backgroundcolor={hintbackgroundcolor}>{tipCallOutText}</call-out>
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

  call-out.defaultTypography {
    font-family: 'Saira Condensed', sans-serif;
    color: var(--textcolor);
    font-size: var(--fontsize);
    line-height: 120%;
    text-transform: uppercase;
  }

</style>
