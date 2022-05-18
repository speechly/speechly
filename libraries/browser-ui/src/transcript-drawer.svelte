<svelte:options tag={null} immutable={true}/>

<script lang="ts">
  import type { Segment } from '@speechly/browser-client';
  import { DecoderState, MessageType } from "./constants";  // Re-exported from @speechly/browser-client. See types.ts for explanation.
  import { cubicIn, cubicOut, linear } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import "./big-transcript.ts";

  export let height = "8rem";
  export let hint = ""; // `Try: "Show me blue jeans"`;
  export let fontsize = "1.5rem";
  export let hintfontsize = "0.9rem";
  export let color = "#ffffff";
  export let smalltextcolor = "#ffffff70";
  export let highlightcolor = "#15e8b5";
  export let backgroundcolor = "#202020";
  export let gradientstop1 = "#ffffff88";
  export let gradientstop2 = "#ffffffcc";
  export let formattext = undefined;
  export let demomode = undefined;
  export let customcssurl = undefined;
  export let customtypography = undefined;

  let hints = [];
  let hintNumber = 0;
  let effectiveHint = "";
  let bigTranscript = undefined;

  $: sethint(hint);
  $: defaultTypography = customtypography === undefined || customtypography === "false";
  
  export const speechhandled = (success: boolean) => {
    if (bigTranscript) bigTranscript.speechhandled(success);
  }

  export const speechstate = (state: DecoderState) => {
    if (bigTranscript) bigTranscript.speechstate(state);
  }

  export const speechsegment = (segment: Segment, forward = true) => {
    hintTransition.set({opacity: 0});
    if (bigTranscript && forward) bigTranscript.speechsegment(segment);
    if (segment.isFinal) {
      hintNumber++;
      if (hintNumber < hints.length) {
        effectiveHint = hints[hintNumber];
      } else {
        effectiveHint = hints[Math.floor(Math.random() * hints.length)];
      }
    }
  }

  export const sethint = (text: string) => {
    hintNumber = 0;
    hint = text;
    hints = [];
    try {
      hints = JSON.parse(hint);
      // Wrap a plain string in a hints array
      if (typeof hints === 'string' || hints instanceof String) {
        hints = [hints];
      }
    } catch (e) {
      hints[0] = hint || "";
    }
    effectiveHint = hints[hintNumber];
  }

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
      case MessageType.speechsegment:
        speechsegment(e.data.segment, false);
        break;
      case MessageType.transcriptdrawerhint:
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

{#if customcssurl !== undefined}
  <link href="{customcssurl}" rel="stylesheet">
{/if}

<main class="placementTop" style="
  --height: {height};
  --smalltextcolor: {smalltextcolor};
  --hintfontsize: {hintfontsize};
">
  <div class="drawer" style="
    background-color: {backgroundcolor};
    opacity: {$opacityTransition.opacity};
    transform: translate(0px, {$positionTransition.y}rem);
  ">
    <div class="pad">
      <big-transcript bind:this={bigTranscript} on:visibilitychanged={bigTranscriptVisibilityChanged} customtypography={customtypography} customcssurl={customcssurl} formattext={formattext} fontsize={fontsize} color={color} backgroundcolor="none" highlightcolor={highlightcolor} gradientstop1={gradientstop1} gradientstop2={gradientstop2} demomode={demomode}></big-transcript>
      <div class="hint" class:defaultTypography={defaultTypography} style="opacity: {$hintTransition.opacity};">
        {effectiveHint}
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
    margin-top: 0.15rem;
  }

  .defaultTypography {
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
    color: var(--smalltextcolor);
    font-size: var(--hintfontsize);
    line-height: 135%;
  }

</style>