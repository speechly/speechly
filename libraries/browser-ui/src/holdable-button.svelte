<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import MicFrame from "./components/MicFrame.svelte";
  import MicIcon from "./components/MicIcon.svelte";
  import MicFx from "./components/MicFx.svelte";
  import type { IAppearance, IHoldEvent } from "./types";
  import {
    DecoderState,
    Icon,
    Effect,
    Behaviour,
    MessageType,
    clientStateToAppearance,
TriggerFx,
  } from "./constants";

  export let icon = DecoderState.Disconnected;
  export let capturekey = " ";
  export let hide = undefined;
  export let size = "80px";
  export let holdscale = "1.35";
  export let borderscale = "0.075";
  export let iconsize = "60%";
  export let fxsize = "250%";
  export let backgroundcolor = "#ffffff";
  export let iconcolor = "#000000";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";
  export let fxgradientstop1 = undefined
  export let fxgradientstop2 = undefined
  export let customcssurl = undefined;
  export const isbuttonpressed = () => tangentHeld;

  $: visible = hide === undefined || hide === "false";
  $: frameStrokeWidth = `${46 * (borderscale as unknown as number)}`;
  $: frameRadius = 46 - 23 * (borderscale as unknown as number);
  $: buttonHeldScale = (holdscale as unknown as number);

  let tangentHeld = false;
  let holdStartTimestamp = 0;
  let rotation = [0.0, 0.0];
  let scale = [0.0, 0.0];
  let iconOpacity = [1.0, 1.0];
  let fxOpacity = [0.0, 0.0];
  let effectiveAppearance: IAppearance = clientStateToAppearance[icon];
  let timeout = null;
  let prevFrameMillis = 0;
  let frameMillis = 0;

  // Run this reactive statement whenever icon parameters (icon) changes
  $: {
    updateSkin(tangentHeld, icon);
  }

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
    // Transition in button
    scale = [1, 0];

    let requestId = null;

    const tick = () => {
      prevFrameMillis = frameMillis;
      frameMillis = new Date().getTime();
      const tickMs = frameMillis - (prevFrameMillis || frameMillis);

      if (effectiveAppearance.effect === Effect.Connecting) {
        // Animate iconOpacity when starting
        iconOpacity[0] =
          Math.cos((frameMillis / 2500) * Math.PI * 2) * 0.25 + 0.25;
      }
      if (effectiveAppearance.effect === Effect.Busy) {
        // Animate iconOpacity when tarting
        iconOpacity[0] =
          Math.cos((frameMillis / 1000) * Math.PI * 2) * 0.25 + 0.25;
      }

      scale = [
        scale[0],
        animateValue(scale[1], visible ? scale[0] : 0, 0.2, tickMs),
      ];
      iconOpacity = [
        iconOpacity[0],
        animateValue(iconOpacity[1], iconOpacity[0], 0.08, tickMs),
      ];
      fxOpacity = [
        fxOpacity[0],
        animateValue(fxOpacity[1], fxOpacity[0], 0.08, tickMs),
      ];
      rotation = [
        rotation[0] + 2.5,
        animateValue(rotation[1], rotation[0], 0.05, tickMs),
      ];
      requestId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(requestId);
  });

  const tangentStart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (visible && !tangentHeld) {
      tangentHeld = true;
      holdStartTimestamp = Date.now();
      vibrate();

      // Play a rotation whirl
      if (effectiveAppearance.triggerFx === TriggerFx.Whirl) {
        rotation[0] += 720;
      }

      // Connect on 1st press
      if (effectiveAppearance.behaviour === Behaviour.Click) {
        // Auto-release hold after some time
        if (timeout === null) {
          timeout = window.setTimeout(() => {
            fxOpacity[0] = 0;
            // scale[0] = 0;
            // updateSkin();
            timeout = null;
          }, 500);
        }
      }

      // Trigger callback defined as property
      if (thisComponent.onholdstart) thisComponent.onholdstart();
      // Also trigger an event
      dispatchUnbounded(MessageType.holdstart);
    }
  };

  const tangentEnd = () => {
    if (tangentHeld) {
      tangentHeld = false;
      const eventPayload: IHoldEvent = {
        timeMs: Date.now() - holdStartTimestamp,
      };
      vibrate();

      // Cancel any pending auto-release
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      // Trigger callback defined as property
      if (thisComponent.onholdend) thisComponent.onholdend(eventPayload);
      // Also trigger an event
      dispatchUnbounded("holdend", eventPayload);
    }
  };

  const keyDownCallback = (event) => {
    if (capturekey) {
      if (event.key === capturekey) {
        var focused_element =
          (document.hasFocus() &&
            document.activeElement !== document.body &&
            document.activeElement !== document.documentElement &&
            document.activeElement) ||
          null;
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

  const animateValue = (
    value: number,
    target: number,
    pull: number,
    tickMs: number
  ) => {
    const NOMINAL_FRAME_MILLIS = 1000.0 / 60;
    pull = Math.pow(pull, NOMINAL_FRAME_MILLIS / tickMs);
    return value * (1.0 - pull) + target * pull;
  };

  const vibrate = (durationMs = 5) => {
    if (navigator.vibrate !== undefined) {
      navigator.vibrate(durationMs);
    }
  };

  const updateSkin = (buttonHeld: boolean, clientState: DecoderState) => {
    effectiveAppearance = clientStateToAppearance[clientState];

    scale[0] = buttonHeld ? buttonHeldScale : 1.0;
    fxOpacity[0] = (buttonHeld || clientState == DecoderState.Active) ? 1.0 : 0.0;

    switch (effectiveAppearance.icon) {
      case Icon.MicActive:
      case Icon.Mic:
      case Icon.Denied:
      case Icon.Error:
        iconOpacity[0] = 1.0;
        break;
    }
  };
</script>

<svelte:window
  on:mouseup={tangentEnd}
  on:keydown={keyDownCallback}
  on:keyup={keyUpCallBack}
/>

{#if customcssurl !== undefined}
  <link href="{customcssurl}" rel="stylesheet">
{/if}

<main
  on:mousedown={tangentStart}
  on:touchstart={tangentStart}
  on:dragstart={tangentStart}
  on:mouseup={tangentEnd}
  on:touchend={tangentEnd}
  on:dragend={tangentEnd}
  class="HoldableButton"
  class:pressed={tangentHeld}
  style="
    width:{size};
    height:{size};
    --gradient-stop1: {gradientstop1};
    --gradient-stop2: {gradientstop2};
    --fx-gradient-stop1: {fxgradientstop1 || gradientstop1};
    --fx-gradient-stop2: {fxgradientstop2 || gradientstop2};
    --fx-rotation: {rotation[1]}deg;
    --fx-opacity: {fxOpacity[1]};
    --fx-size: {fxsize};
    --icon-opacity: {iconOpacity[1]};
    --icon-size: {iconsize};
    --icon-color: {iconcolor};
    --frame-stroke-width: {frameStrokeWidth};
    --frame-background: {backgroundcolor};
    transform: scale({scale[1]});
  "
>
  <MicFx/>
  <MicFrame frameRadius={frameRadius}/>
  <MicIcon
    icon={effectiveAppearance.icon}
  />
  <slot></slot>

</main>

<style>

  main {
    text-align: left;
    position: relative;
    pointer-events: auto;
    cursor: pointer;
    border-radius: 50%;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
  }
</style>
