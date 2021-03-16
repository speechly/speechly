<svelte:options tag="push-to-talk-button" immutable={true} />

<script>
  import { Client, ClientState } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import "./components/mic-frame.svelte";
  import "./components/mic-icon.svelte";
  import "./components/mic-fx.svelte";
  
  export let size = "6rem";
  export let icon = "poweron";
  export let capturekey = " ";
  export let appid;
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";

  let tangentHeld = false;
  let rotation = [0.0, 0.0];
  let scale = [0.0, 0.0];
  let fxOpacity = [0.0, 0.0];
  let client = null;
  let ready = false;
  let listening = false;
  let clientState;
  let pendingClientState;
  let timeout = null

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const thisComponent = get_current_component();
  const dispatchUnbounded = (name, detail) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  onMount (() => {
    // Transition in button
    scale[0] = 1;

    if (appid) {
      console.log("Connecting", appid)
      client = new Client({
        appId: appid
      });

      client.onStateChange(onStateChange);
    }

    let requestId = null;

    const tick = () => {
      scale = animateValue(scale, 0.2);
      fxOpacity = animateValue(fxOpacity, 0.08);
      rotation = animateValue([rotation[0] + 2.5, rotation[1]], 0.05);
      requestId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(requestId);
  });

  const connectSpeechly = (appid) => {
    // Create a new Client. appid and language are configured in the dashboard.

    // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
    // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
    (async () => {
      try {
        await client.initialize();
      }
      catch (e) {
        client = null;
      }
    })();

    // Pass on segment updates from Speechly API.
    client.onSegmentChange((segment) => {
      dispatchUnbounded("segment-update", segment);
    })
  }

  const tangentStart = () => {
    if (!tangentHeld) {
      tangentHeld = true;
      scale[0] = 1.35;
      fxOpacity[0] = 1.0;
      vibrate();

      // Trigger callback defined as property
      if (thisComponent.onholdstart) thisComponent.onholdstart();
      // Also trigger an event
      dispatchUnbounded('onholdstart');

      // Connect on 1st press
      if (!ready) {
        // Play a rotation whirl
        rotation[0] += 720;
        // Auto-release hold after some time
        if (timeout === null) {
          timeout = window.setTimeout(() => {
            fxOpacity[0] = 0;
            scale[0] = 1;
            // updateSkin();
            timeout = null;
          }, 500);
        }
        if (appid) connectSpeechly(appid);
      }

      // Control speechly
      if (client && ready && !listening)
        (async () => {
          await client.startContext();
        })();
    }
  };

  const tangentEnd = () => {
    if (tangentHeld) {
      tangentHeld = false;
      scale[0] = 1.0;
      fxOpacity[0] = 0.0;
      vibrate();

      // Cancel any pending auto-release
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      // Trigger callback defined as property
      if (thisComponent.onholdend) thisComponent.onholdend();
      // Also trigger an event
      dispatchUnbounded('onholdend');
      // Control speechly
      if (client && listening)
        (async () => {
          await client.stopContext();
        })();

      updateSkin();
    }
  };

  const keyDownCallback = (event) => {
    if (capturekey) {
      if (event.key === capturekey) {
        if (!event.repeat) {
          tangentStart();
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const keyUpCallBack = (event) => {
    if (event.key === capturekey) {
      tangentEnd();
    }
  };

  const setIcon = (newIcon) => {
    icon = newIcon.toLowerCase();
  };

  const animateValue = (value, pull) => {
    return [
      value[0],
      value[1] = value[1] * (1.0 - pull) + value[0] * pull
    ];
  };

  const vibrate = (durationMs = 5) => {
    if (navigator.vibrate !== undefined) {
      navigator.vibrate(durationMs);
    }
  };

  const updateSkin = () => {
    if (clientState !== pendingClientState) {
      clientState = pendingClientState;
      switch (clientState) {
        case ClientState.Connected:
          ready = true;
          setIcon("mic");
          break;
        case ClientState.Failed:
          setIcon("failed");
          dispatchUnbounded("error", "Failed");
          break;
        case ClientState.NoBrowserSupport:
          setIcon("failed");
          dispatchUnbounded("error", "NoBrowserSupport");
          break;
        case ClientState.NoAudioConsent:
          setIcon("noaudioconsent");
          dispatchUnbounded("error", "NoAudioConsent");
          break;
      }
    }
  };

  const onStateChange = (s) => {
    pendingClientState = s;
    switch (s) {
      case ClientState.Starting:
      case ClientState.Recording:
      case ClientState.Stopping:
        listening = true;
        break;
      case ClientState.Connected:
        listening = false;
        break;
    }
    // Immediately apply changes if not button held
    if (!tangentHeld) updateSkin();
  };
</script>

<svelte:window
  on:mouseup={tangentEnd}
  on:keydown={keyDownCallback}
  on:keyup={keyUpCallBack}
/>

<main
  on:mousedown={tangentStart}
  on:touchstart={tangentStart}
  on:dragstart={tangentStart}
  on:mouseup={tangentEnd}
  on:touchend={tangentEnd}
  on:dragend={tangentEnd}
  style="
    width:{size};
    height:{size};
    transform: scale({scale[1]});
    --gradient-stop1: {gradientstop1};
    --gradient-stop2: {gradientstop2};
    --fx-rotation: {rotation[1]}deg;
  "
>
  <mic-fx style="
    opacity: {fxOpacity[1]};
    transform: rotate({rotation[1]}deg);
  "/>
  <mic-frame/>
  <mic-icon icon={icon}/>
</main>

<style>
  main {
    position: relative;
    user-select: none;
  }
</style>
