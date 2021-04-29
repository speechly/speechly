<svelte:options tag="push-to-talk-button" immutable={true} />

<script lang="ts">
  import { Client, ClientState, Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import "./holdable-button.svelte";
  import "./components/callout.svelte";
  import type { IHoldEvent } from "./types";

  const SHORT_PRESS_TRESHOLD_MS = 600
  const INSTRUCTION_PREROLL_MS = 500

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
  export let showtime = "5000";

  let icon: ClientState = ClientState.Disconnected;
  let buttonHeld = false;
  let success = undefined;
  let timeout = null;
  let tipCalloutVisible = false;
  let mounted = false;

  $: tipCallOutText = intro;
  $: showPowerOn = poweron !== undefined && poweron !== "false";
  $: icon = showPowerOn ? ClientState.Disconnected : ClientState.Connected;
  $: connectSpeechly(appid);

  let client = null;
  let clientState: ClientState = undefined;

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const thisComponent = get_current_component();
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(
      new CustomEvent(name, {
        detail,
        composed: true, // propagate across the shadow DOM
      })
    );
  };

  onMount(() => {
    mounted = true;
    // Transition in button
    connectSpeechly(appid);
  });

  const connectSpeechly = (appid: string) => {
    if (mounted && appid && !client) {
      console.log("Create client with appId", appid);
      client = new Client({
        appId: appid,
      });

      client.onStateChange(onStateChange);

      client.onSegmentChange((segment: Segment) => {
        // Pass on segment updates from Speechly API as events
        dispatchUnbounded("speechsegment", segment);
        // And as window.postMessages
        window.postMessage({ type: "speechsegment", segment: segment }, "*");
      });

      scheduleCallout();
    } else {
      console.warn(
        "No appid attribute specified. Speechly voice services are unavailable."
      );
    }
  }

  const scheduleCallout = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    if (timeout === null) {
      timeout = window.setTimeout(() => {
        tipCalloutVisible = true;
        timeout = null;
        if ((showtime as unknown as number) > 0) {
          timeout = window.setTimeout(() => {
            tipCalloutVisible = false;
            timeout = null;
          }, (showtime as unknown as number));
        }
      }, INSTRUCTION_PREROLL_MS);
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
        if (appid) initializeSpeechly();
      } else if (isStartable(clientState)) {
        client.startContext();
      }
    }
    // Send as window.postMessages
    window.postMessage({ type: "holdstart" }, "*");

  };

  const tangentEnd = (event) => {
    const holdEventData: IHoldEvent = event.detail;
    if (success && holdEventData.timeMs < SHORT_PRESS_TRESHOLD_MS) {
      tipCallOutText = hint;
      scheduleCallout();
    }

    buttonHeld = false;
    if (client) {
      if (isStoppable(clientState)) {
        client.stopContext();
      }
    }

    updateSkin();

    // Send as window.postMessages
    window.postMessage({ type: "holdend" }, "*");
  };

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
      case ClientState.Stopping:
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
        if (!showPowerOn && buttonHeld && isStartable(clientState)) {
          client.startContext();
        }
        break;
    }
    // Broadcast state changes
    window.postMessage({ type: "speechstate", state: s }, "*");
  };

  const setInitialized = (newSuccess: boolean, status: string) => {
    if (success === undefined) {
      success = newSuccess;
      dispatchUnbounded("initialized", { success, status });
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
    <call-out {fontsize} show={tipCallOutText !== "" && tipCalloutVisible && !hide ? "true" : "false"}>{tipCallOutText}</call-out>
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
