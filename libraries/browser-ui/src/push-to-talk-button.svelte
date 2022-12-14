<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import type { Segment, IHoldEvent } from "./types";
  import "./holdable-button.ts";
  import "./call-out.ts";
  import { BrowserClient, BrowserMicrophone } from "@speechly/browser-client";
  import { DecoderState, AudioSourceState, LocalStorageKeys, MessageType } from "./constants";
  import { onMount } from "svelte";
  import { createDispatchUnbounded} from "./fixDispatch";

  const TAP_TRESHOLD_MS = 600
  const PERMISSION_PRE_GRANTED_TRESHOLD_MS = 1500
  const dispatchUnbounded = createDispatchUnbounded();

  export let projectid: string = undefined;
  export let appid: string = undefined;
  export let apiurl = undefined;

  export let capturekey = " ";
  export let poweron = "auto";
  export let hide = undefined;
  export let taptotalktime = 8000; // ms to listen after tap. Set to 0 to disable tap-to-talk.
  export let silencetohanguptime = 1000; // ms of silence to listen before hangup

  export let placement = undefined;
  export let size = "80px";
  export let voffset = "40px";

  export let intro = "Hold to talk";
  export let hint = "Hold to talk";
  export let showtime = 10000;
  export let hintxalign = "50%"
  export let hintwidth = "auto";

  export let backgroundcolor = "#ffffff";
  export let iconcolor = "#000000";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";
  export let fxgradientstop1 = undefined;
  export let fxgradientstop2 = undefined;

  export let fontsize = "1.0rem";
  export let textcolor = "#ffffff";
  export let hintbackgroundcolor = "#202020";

  export let holdscale = "1.35";
  export let borderscale = "0.075";
  export let iconsize = "60%";
  export let fxsize = "250%";
  export let customcssurl = undefined;
  export let customtypography = undefined;

  let usePermissionPriming = false;
  let holdListenActive = false;
  let wasListening = false;
  let initializedSuccessfully = undefined;
  let tipCalloutVisible = false;
  let mounted = false;

  let tapListenTimeout = null;
  let tangentStartPromise = null;
  let icon: DecoderState | AudioSourceState = DecoderState.Disconnected;

  $: tipCallOutText = intro;
  $: initialize(projectid, appid);
  $: defaultTypography = customtypography === undefined || customtypography === "false";

  let client = null;
  let microphone = null;
  let clientState: DecoderState = DecoderState.Disconnected;
  let audioSourceState: AudioSourceState = AudioSourceState.Stopped;
  let introPopup: HTMLElement = null;

  onMount(() => {
    mounted = true;
    switch (poweron) {
      case "true":
        usePermissionPriming = true;
        break;
      case "auto":
        tryUseIntroPopup(document.querySelector("intro-popup"));
        break;
    }
    initialize(projectid, appid);
  });

  const tryUseIntroPopup = (el: HTMLElement) => {
    if (introPopup === null && el !== null) {
      introPopup = el;
      el.addEventListener(MessageType.requeststartmicrophone, async() => {
        await client.initialize()
        await microphone.initialize()
        await client.attach(microphone.mediaStream)
      });
      usePermissionPriming = localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null;
    }
  }

  const initialize = (projectid: string, appid: string) => {
    if (mounted && !client && (projectid || appid)) {
      const clientOptions = {
        connect: false,
        ...(appid && !projectid && {appId: appid}),
        ...(projectid && {projectId: projectid}),
        ...(apiurl && {apiUrl: apiurl}),
      }

      client = new BrowserClient(clientOptions);
      client.onStateChange(onDecoderStateChange);
      client.onSegmentChange((segment: Segment) => {
        // Refresh stopContext timeout if set
        if (tapListenTimeout) setStopContextTimeout(silencetohanguptime);
        // Pass on segment updates from Speechly API as events
        dispatchUnbounded(MessageType.speechsegment, segment);
        // And as window.postMessages
        window.postMessage({ type: MessageType.speechsegment, segment: segment }, "*");
      });

      microphone = new BrowserMicrophone()
      microphone.onStateChange(onMicrophoneStateChange)
      client.initialize();
      tipCalloutVisible = true;
    }
  }

  const tangentStart = async (event) => {
    tangentStartPromise = (async () => {
      tipCalloutVisible = false;

      // Cancel timeout when button down
      if (tapListenTimeout) {
        window.clearTimeout(tapListenTimeout);
        tapListenTimeout = null;
      }

      if (client) {
        // Connect on 1st press
        if (usePermissionPriming) {
          window.postMessage({
            type: MessageType.speechlypoweron
          }, "*");
        } else if (clientState >= DecoderState.Connected && audioSourceState === AudioSourceState.Started) {
          holdListenActive = true;
        } else {
          if (appid || projectid) {
            // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
            // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
            try {
              const initStartTime = Date.now();
              await client.initialize()
              await microphone.initialize()
              await client.attach(microphone.mediaStream)
              // Long init time suggests permission dialog --> prevent listening start
              holdListenActive = Date.now() - initStartTime < PERMISSION_PRE_GRANTED_TRESHOLD_MS;
            } catch (e) {
              console.error("Speechly initialization failed - ", e);
              holdListenActive = false;
            }
          } else {
            console.warn(
              "No appid/projectid attribute specified. Speechly voice services are unavailable."
            );
          }
        }

        if (holdListenActive) {
          wasListening = client.isActive()
          if (!client.isActive()) {
            dispatchUnbounded(MessageType.startcontext);
            client.start(appid);
          }
        }
      }
      // Send as window.postMessages
      window.postMessage({ type: MessageType.holdstart, state: clientState, audioSourceState: audioSourceState }, "*");
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
          stopListening();
          tipCallOutText = hint;
          tipCalloutVisible = true;
        } else {
          if (wasListening) {
            stopListening();
          } else {
            // schedule "silence based stop"
            setStopContextTimeout(taptotalktime);
          }
        }
      } else {
        stopListening();
      }
    }

    // Send as window.postMessages
    window.postMessage({ type: MessageType.holdend }, "*");
  };

  const setStopContextTimeout = (timeoutMs: number) => {
    if (tapListenTimeout) {
      window.clearTimeout(tapListenTimeout);
    }
    tapListenTimeout = window.setTimeout(() => {
      tapListenTimeout = null;
      stopListening();
    }, timeoutMs);
  }

  const stopListening = () => {
    if (client) {
      client.stop();
      dispatchUnbounded(MessageType.stopcontext);
    }
    updateSkin();
  }

  const updateSkin = () => {
    switch (audioSourceState) {
      case AudioSourceState.NoAudioConsent:
      case AudioSourceState.NoBrowserSupport:
        icon = audioSourceState;
        break;
      default:
        icon = clientState;
        break;
    }
  };

  const onDecoderStateChange = (s: DecoderState) => {
    clientState = s;
    updateSkin();
    // Broadcast state changes
    window.postMessage({ type: MessageType.speechstate, state: s }, "*");
    checkReadyToUse()
  };

  const onMicrophoneStateChange = (state: AudioSourceState) => {
    audioSourceState = state
    // Broadcast state changes
    window.postMessage({ type: MessageType.audiosourcestate, state: state }, "*");
    checkReadyToUse()
    updateSkin();
  };

  const checkReadyToUse = () => {
    if (initializedSuccessfully === undefined) {
      if (clientState === DecoderState.Connected && audioSourceState === AudioSourceState.Started) {
        initializedSuccessfully = true;
        usePermissionPriming = false;

        if (localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null) {
          localStorage.setItem(LocalStorageKeys.SpeechlyFirstConnect, String(Date.now()));
        }
      }
    }
  }

  const handleMessage = (e) => {
    switch (e.data.type) {
      case MessageType.showhint:
        tipCallOutText = e.data.hint;
        tipCalloutVisible = true;
        break;
      case MessageType.speechlyintroready:
        if (poweron === "auto") {
          tryUseIntroPopup(document.querySelector("intro-popup"));
        }
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
  {fxgradientstop1}
  {fxgradientstop2}
  {hide}
  {backgroundcolor}
  {iconcolor}
  {holdscale}
  {borderscale}
  {iconsize}
  {fxsize}
  {customcssurl}

  style="
    --voffset: {voffset};
    --size: {size};
    --textcolor: {textcolor};
    --fontsize: {fontsize};
  ">
  <call-out class:defaultTypography={defaultTypography} width={hintwidth} xalign={hintxalign} show={tipCallOutText !== "" && tipCalloutVisible && !hide ? "true" : "false"} showtime={showtime} backgroundcolor={hintbackgroundcolor}>{tipCallOutText}</call-out>
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
