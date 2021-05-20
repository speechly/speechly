<svelte:options tag={null} immutable={true}/>

<script lang="ts">
  import type { Segment } from '@speechly/browser-client/speechly/types';
  import type { ClientState } from "./types";  // Re-exported from @speechly/browser-client. See types.ts for explanation.
  import { cubicIn, cubicOut, linear } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import "./big-transcript.ts";

  export let height = "8rem";
  export let hint = ""; // `Try: "Show me blue jeans"`;
  export let fontsize = "1.5rem";
  export let color = "#ffffff";
  export let smalltextcolor = "#ffffff70";
  export let highlightcolor = "#15e8b5";
  export let backgroundcolor = "#202020";
  export let gradientstop1 = "#ffffff88";
  export let gradientstop2 = "#ffffffcc";

  export const speechhandled = (success: boolean) => {
    if (bigTranscript) bigTranscript.speechhandled(success);
  }

  export const speechstate = (state: ClientState) => {
    if (bigTranscript) bigTranscript.speechstate(state);
  }

  export const speechsegment = (segment: Segment, forward = true) => {
    hintTransition.set({opacity: 0});
    if (bigTranscript && forward) bigTranscript.speechsegment(segment);
  }

  export const sethint = (text: string) => {
    hint = text;
  }

  let bigTranscript = undefined;

  let positionTransition = tweened({ y: -1.0 }, {
    duration: 200,
  });

  let opacityTransition = tweened({ opacity: 0 }, {
    duration: 200,
    easing: linear,
  });

  let hintTransition = tweened({ opacity: 0 }, {
    duration: 200,
    delay: 200,
    easing: linear,
  });

  const bigTranscriptVisibilityChanged = (e) => {
    const visibility = e.detail;
    if (visibility === false) {
      positionTransition.set({y: -1.0}, {easing: cubicIn});
      opacityTransition.set({opacity: 0});
      hintTransition.set({opacity: 0});
    } else {
      positionTransition.set({y: 0}, {easing: cubicOut});
      opacityTransition.set({opacity: 1});
      hintTransition.set({opacity: 1});
    }
  }

  const handleMessage = (e) => {
    switch (e.data.type) {
      case "speechsegment":
        speechsegment(e.data.segment, false);
        break;
      case "hint":
        sethint(e.data.hint)
        break;
      default:
        break;
    }
  }

</script>

<svelte:window
  on:message={handleMessage}
/>

<main class="placementTop" style="
  --height: {height};
  --smalltextcolor: {smalltextcolor};
">
  <div class="drawer" style="
    background-color: {backgroundcolor};
    opacity: {$opacityTransition.opacity};
    transform: translate(0px, {$positionTransition.y}rem);
  ">
    <div class="pad">
      <big-transcript bind:this={bigTranscript} on:visibilitychanged={bigTranscriptVisibilityChanged} fontsize={fontsize} color={color} backgroundcolor={backgroundcolor} highlightcolor={highlightcolor} gradientstop1={gradientstop1} gradientstop2={gradientstop2}></big-transcript>
      <div class="hint" style="opacity: {$hintTransition.opacity};">
        {hint}
      </div>
    </div>
  </div>
</main>

<style>
  .placementTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    pointer-events: none;
  }

  .drawer {
    width: 100%;
    min-height: var(--height);

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    box-shadow: 0 0 0.35rem #0004;
  }

  .pad {
    position: relative;
    padding: 2rem 2rem 0.65rem 1.5rem;
  }

  .hint {
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
    color: var(--smalltextcolor);
    font-size: 0.9rem;
    line-height: 135%;
    margin-top: 0.15rem;
  }

</style>