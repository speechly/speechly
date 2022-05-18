<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import type { Segment, ITaggedWord } from "./types";
  import { DecoderState, MessageType } from "./constants";  // Re-exported from @speechl./fixTransitionclient. See types.ts for explanation.
  import fix from './fixTransition'
  import { get_current_component } from "svelte/internal";
  import { draw as draw_orig } from 'svelte/transition';
  import {interpolateLinearf, fadeIn} from "./TableInterpolator"
  import VuMeter from "./components/VuMeter.svelte";
  import { tweened } from "svelte/motion";

  const HIDE_TIMEOUT_MS = 2000;
  const HIDE_TIMEOUT_DEMO_MS = 3500;

  export let placement = undefined;
  export let voffset = "3rem";
  export let hoffset = "2rem";
  export let fontsize = "1.5rem";
  export let color = "#ffffff";
  export let highlightcolor = "#15e8b5";
  export let backgroundcolor = "#202020";
  export let gradientstop1 = "#ffffff88";
  export let gradientstop2 = "#ffffffcc";
  export let marginbottom = "0rem";
  export let formattext = undefined;
  export let demomode = undefined;
  export let customcssurl = undefined;
  export let customtypography = undefined;

  $: showlistening = (words.length === 0);
  $: useTextBackground = backgroundcolor !== "none";
  $: useEntityFormatting = formattext === undefined || formattext !== "false";
  $: useDemoMode = demomode !== undefined && demomode !== "false";
  $: defaultTypography = customtypography === undefined || customtypography === "false";
  $: wordTransitionInMs = useDemoMode ? 800 : 350;
  $: {
    const newVisibility = clientState === DecoderState.Active || showingTranscript;
    if (newVisibility !== visibility) {
      dispatchUnbounded("visibilitychanged", newVisibility);
    }
    visibility = newVisibility;
    visibilityTransition.set({transition: visibility ? 1 : 0});
  }
  $: if (!useDemoMode) scheduleHide(0);

  let words: ITaggedWord[] = [];
  let vumeter = undefined;
  let timeout = null;
  let lastSegmentId = null;
  let clientState = DecoderState.Disconnected;
  let showingTranscript = false;
  let visibility = false;
  let acknowledged = false;

  let visibilityTransition = tweened({ transition: 0 }, {
    duration: 200,
  });

  const thisComponent = get_current_component();
 
  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  const draw = fix(draw_orig);

  const slideTransition = fix((node, {delay = 0, duration = 350, maxWidth = 10}) => {
    return {
      delay,
      duration,
      css: (t: number) => `
        max-width: ${interpolateLinearf(fadeIn, t, 0.0, 1.0) * maxWidth}rem;
      `
    };
  });

  const handleMessage = (e) => {
    switch (e.data.type) {
      case MessageType.speechsegment:
        speechsegment(e.data.segment);
        break;
      case MessageType.speechhandled:
        speechhandled(e.data.success);
        break;
      case MessageType.speechstate:
        speechstate(e.data.state);
        break;
      default:
        break;
    }
  }

  export const speechhandled = (success: boolean) => {
    acknowledged = acknowledged || success;
  }

  export const speechstate = (state: DecoderState) => {
    clientState = state;
    if (clientState === DecoderState.Active) {
      acknowledged = false;
      words = [];
      lastSegmentId = null;
    }
  }

  export const speechsegment = (segment: Segment) => {
    if (segment === undefined) return;

    // Animate VU meter
    if (vumeter && (useDemoMode || clientState === DecoderState.Active)) {
      vumeter.updateVU(Math.random() * 0.50 + 0.50, Math.random() * 75 + 75);
    }

    if (segment.isFinal) {
      scheduleHide(words.length > 0 ? (useDemoMode ? HIDE_TIMEOUT_DEMO_MS : HIDE_TIMEOUT_MS) : 0);
    } else {
      if (words.length > 0) {
        if (!showingTranscript) {
          showingTranscript = true;
        }
        scheduleHide(HIDE_TIMEOUT_MS);
      }
    }

    // Detect segment change
    const segmentId = `${segment.contextId}/${segment.id}`;
    if (lastSegmentId !== null) {
      if (lastSegmentId !== segmentId) {
        // New segment within the same utterance
        acknowledged = false;
        lastSegmentId = segmentId;
      }
    } else {
      lastSegmentId = segmentId;
    }
    
    // Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
    words = []
    segment.words.forEach(w => {
      words[w.index] = { word: w.value, serialNumber: w.index, entityType: null, isFinal: w.isFinal, hide: false }
    })

    if (useEntityFormatting) {
      // Replace words with entity values. Note that there may be overlapping tentative entity ranges
      segment.entities.forEach(e => {
        words[e.startPosition].word = e.value;
        words[e.startPosition].entityType = e.type;
        words[e.startPosition].isFinal = e.isFinal;
        words[e.startPosition].hide = false;
        for (let index = e.startPosition+1; index < e.endPosition; index++) {
          // words array may be "holey"
          if (words[index]) words[index].hide = true;
        };
      });
    } else {
      // Tag words as entities
      segment.entities.forEach(e => {
        for (let index = e.startPosition; index < e.endPosition; index++) {
          // words array may be "holey"
          if (words[index]) {
            words[index].entityType = e.type;
            words[index].isFinal = e.isFinal;
          }
        };
      });
    }

    // Remove holes and hidden from word array
    words = words.filter(w => !w.hide);
  };

  const entityClass = (word: ITaggedWord) => {
    return word.entityType || "";
  }

  const scheduleHide = (prerollMs = 0) => {
    cancelHide();

    timeout = window.setTimeout(() => {
      timeout = null;
      if (showingTranscript) {
        showingTranscript = false;
      }
    }, prerollMs);
  }

  const cancelHide = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  }
</script>

<svelte:window
  on:message={handleMessage}
/>

<main
  class="BigTranscript"
  class:placementTop={placement === "top"}
  class:defaultTypography={defaultTypography}
  style="
    --voffset: {voffset};
    --hoffset: {hoffset};
    --fontsize: {fontsize};
    --color: {color};
    --highlight-color: {highlightcolor};
    --text-bg-color: {backgroundcolor};
    --gradient-stop1: {gradientstop1};
    --gradient-stop2: {gradientstop2};
    --marginbottom: {marginbottom};
    --transition: {$visibilityTransition.transition};
    opacity: {$visibilityTransition.transition};
    max-height: {interpolateLinearf(fadeIn, $visibilityTransition.transition, 0.0, 0.6) * 10}rem;
    visibility: {$visibilityTransition.transition !== 0 ? "visible" : "hidden"};
  "
>

  <div class="TranscriptItem">
    {#if useTextBackground}
      <div class="TransscriptItemBgDiv"/>
    {/if}
    <div class="TransscriptItemContent">
      <VuMeter bind:this={vumeter} color={highlightcolor}></VuMeter>
      {#if showlistening}
        <div class="listening" in:slideTransition="{{duration: 400}}">Listening...</div>
      {/if}
    </div>
  </div>
  {#each words as word, index}
    <div class="TranscriptItem {entityClass(word)}" class:Entity={word.entityType !== null} class:Final={word.isFinal}>
      {#if useTextBackground}
        <div class="TransscriptItemBgDiv" in:slideTransition="{{duration: wordTransitionInMs}}"/>
      {/if}
      <div class="TransscriptItemContent" in:slideTransition="{{duration: wordTransitionInMs}}">
        {word.word}
        {#if index < words.length}
          <span style={index < words.length - 1 ? "width:0.25em;" : acknowledged ? "width:1.2em;" : ""}></span>
        {/if}
      </div>
    </div>
  {/each}
  {#if acknowledged}
    <div class="TranscriptItem" in:slideTransition="{{duration: 200, maxWidth: 3}}">
      <div class="TransscriptItemBgDiv" style="background-color: {highlightcolor};"/>
      <div style="width:1.0rem; height: 1rem; position: relative;">
        <svg style="width:2rem; height: 2rem; position: absolute; transform: translate(-0.6rem, -0.5rem); stroke: #eee" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path in:draw="{{duration: 500}}" stroke="currentColor" stroke-width="3" d="M7.191 11.444l4.059 6.107 7.376-12.949" fill="none" fill-rule="evenodd"/></svg>
      </div>
    </div>
  {/if}
</main>

<svelte:head>
  {#if defaultTypography}
    <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
  {/if}
</svelte:head>

{#if customcssurl !== undefined}
  <link href="{customcssurl}" rel="stylesheet">
{/if}

<style>
  main {
    position: relative;
    user-select: none;

    display:flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    margin-bottom: calc(var(--marginbottom) * var(--transition));
    height: fit-content;
  }

  .defaultTypography {
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
    color: var(--color);
    font-size: var(--fontsize);
    line-height: 135%;
  }

  .TranscriptItem {
    position: relative;

    display:flex;
    flex-direction: row;
    align-items: center;
  }

  .Entity {
    color: var(--highlight-color);
  }

  .TransscriptItemContent {
    z-index: 1;
    display:flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }

  .TransscriptItemBgDiv {
    position: absolute;
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    top: -0.2rem;
    left: -0.8rem;
    margin: 0;
    padding: 0.2rem 0.8rem;
    background-color: var(--text-bg-color);
    z-index: -1;
  }

  .placementTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: var(--voffset) var(--hoffset) 0 var(--hoffset);
    z-index: 50;
    pointer-events: none;
  }

  .listening {
    animation: flow 1s linear infinite;
    background: linear-gradient(-60deg, var(--gradient-stop1), var(--gradient-stop2), var(--gradient-stop1), var(--gradient-stop2), var(--gradient-stop1));
    background-size: 200%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-box-decoration-break: clone;
  }

  @keyframes flow {
    0% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }
</style>
