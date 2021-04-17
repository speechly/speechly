<svelte:options tag="holdable-button" immutable={true} />

<script lang="ts">

  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import "./components/mic-frame.svelte";
  import "./components/mic-icon.svelte";
  import "./components/mic-fx.svelte";
  import type { IAppearance } from "./types";
  import { Icon, Effect, Behaviour, SpeechState, stateToAppearance } from "./types";
  
  export let icon = SpeechState.Idle as string;
  export let capturekey = " ";
  export let size = "6rem";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";

  let tangentHeld = false;
  let holdStartTimestamp = 0;
  let rotation = [0.0, 0.0];
  let scale = [0.0, 0.0];
  let iconOpacity = [1.0, 1.0];
  let fxOpacity = [0.0, 0.0];
  let effectiveAppearance: IAppearance = stateToAppearance[icon];
  let timeout = null;
  let prevFrameMillis = 0;
  let frameMillis = 0;


  // Run this reactive statement whenever icon parameters (icon) changes
  $: {
    if (!tangentHeld) updateSkin(stateToAppearance[icon]);
  };

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const thisComponent = get_current_component();
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  onMount (() => {
    // Transition in button
    scale[0] = 1;

    let requestId = null;

    const tick = () => {
      prevFrameMillis = frameMillis;
      frameMillis = new Date().getTime();
      const tickMs = frameMillis - prevFrameMillis;

      if (effectiveAppearance.effect === Effect.Connecting) {
        // Animate iconOpacity when starting
        iconOpacity[0] = Math.cos(frameMillis / 2500 * Math.PI*2)* 0.25 + 0.25;
      }
      if (effectiveAppearance.effect === Effect.Busy) {
        // Animate iconOpacity when tarting
        iconOpacity[0] = Math.cos(frameMillis / 1000 * Math.PI*2)* 0.25 + 0.25;
      }

      scale = animateValue(scale, 0.2, tickMs);
      iconOpacity = animateValue(iconOpacity, 0.08, tickMs);
      fxOpacity = animateValue(fxOpacity, 0.08, tickMs);
      rotation = animateValue([rotation[0] + 2.5, rotation[1]], 0.05, tickMs);
      requestId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(requestId);
  });

  const tangentStart = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!tangentHeld) {
      tangentHeld = true;
      holdStartTimestamp = Date.now()
      scale[0] = 1.35;
      fxOpacity[0] = 1.0;
      vibrate();

      // Connect on 1st press
      if (effectiveAppearance.behaviour === Behaviour.Click) {
        // Play a rotation whirl
        rotation[0] += 720;
        // Auto-release hold after some time
        if (timeout === null) {
          timeout = window.setTimeout(() => {
            fxOpacity[0] = 0;
            scale[0] = 0;
            // updateSkin();
            timeout = null;
          }, 500);
        }
      }

      // Trigger callback defined as property
      if (thisComponent.onholdstart) thisComponent.onholdstart();
      // Also trigger an event
      dispatchUnbounded('holdstart');
    }
  };

  const tangentEnd = () => {
    if (tangentHeld) {
      scale[0] = 1.0;
      fxOpacity[0] = 0.0;
      tangentHeld = false;
      const eventPayload = {
        timeMs: Date.now() - holdStartTimestamp
      };
      vibrate();

      // Cancel any pending auto-release
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      // Trigger callback defined as property
      if (thisComponent.onholdend) thisComponent.onholdend(eventPayload);
      // Also trigger an event
      dispatchUnbounded('holdend', eventPayload);
    }
  };

  const keyDownCallback = (event) => {
    if (capturekey) {
      if (event.key === capturekey) {
        var focused_element = (
          document.hasFocus() &&
          document.activeElement !== document.body &&
          document.activeElement !== document.documentElement &&
          document.activeElement
        ) || null;
        if (!focused_element) {
          if (!event.repeat) {
            tangentStart(event);
          } else {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    }
  };

  const keyUpCallBack = (event) => {
    if (event.key === capturekey) {
      tangentEnd();
    }
  };

  const animateValue = (value: number[], pull: number, tickMs: number) => {
    const NOMINAL_FRAME_MILLIS = 1000.0/60;
    pull = Math.pow(pull, NOMINAL_FRAME_MILLIS / tickMs);
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

  const updateSkin = (newAppearance: IAppearance) => {
    if (effectiveAppearance !== newAppearance) {
      effectiveAppearance = newAppearance;

      switch (newAppearance.icon) {
        case Icon.Mic:
          iconOpacity[0] = 1.0;
          break;
      }
    }
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
  <mic-icon icon={effectiveAppearance.icon} style="
    opacity: {iconOpacity[1]};
  "/>
</main>

<style>
  main {
    position: relative;
    user-select: none;
  }
</style>
