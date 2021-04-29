<svelte:options tag="big-transcript" immutable={true} />

<script lang="ts">
  import type { Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import type { ITaggedWord } from "./types";
  import fix from './transFix'
  import { get_current_component } from "svelte/internal";
  import { fade as fade_orig, draw as draw_orig } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import {interpolateLinearf, fadeIn} from "./TableInterpolator"
  import "./components/vu-meter.svelte";

  const HIDE_TIMEOUT_MS = 2000;

  export let placement = undefined;
  export let voffset = "3rem";
  export let hoffset = "2rem";
  export let fontsize = "1.5rem";
  export let color = "#15e8b5";

  let words: ITaggedWord[] = [];
  let vumeter = undefined;
  let visible = false;
  let buttonheld = false;
  let timeout = null;

  $: showlistening = (words.length === 0 && buttonheld);
  let acknowledged = false;
  let finalsegment = false;

  const thisComponent = get_current_component();
 
  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  const fade = fix(fade_orig);
  const draw = fix(draw_orig);

  const revealTransition = fix((node, {delay = 0, duration = 400}) => {
    return {
      delay,
      duration,
      easing: cubicInOut,
      css: (t: number) => `
        opacity: ${interpolateLinearf(fadeIn, t, 0.0, 1.0)};
        max-height: ${interpolateLinearf(fadeIn, t, 0.0, 0.6) * 10}rem;
        margin-bottom: ${interpolateLinearf(fadeIn, t, 0.0, 0.6) * 1.5}rem;
      `
    };
  });

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
      case "speechsegment":
        onSegmentUpdate(e.data.segment);
        break;
      case "holdstart":
        cancelHide();
        buttonheld = true;
        acknowledged = false;
        finalsegment = false;
        words = [];
        break;
      case "holdend":
        buttonheld = false;
        break;
      case "speechhandled":
        if (e.data.success) {
          acknowledged = true;
        }
        break;
      default:
        break;
    }
  }

  const onSegmentUpdate = (segment: Segment) => {
    if (segment === undefined) return;

    // Animate VU meter
    if (vumeter && buttonheld) vumeter.dispatchEvent(new CustomEvent("updateVU", {detail: {level: 1.0, seekTimeMs: 1000}}));

    if (segment.isFinal) {
      finalsegment = true;
      scheduleHide(words.length > 0 ? HIDE_TIMEOUT_MS : 0);
    } else {
      visible = true;
    }
    
    // Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
    words = []
    segment.words.forEach(w => {
      words[w.index] = { word: w.value, serialNumber: w.index, entityType: null, isFinal: w.isFinal, hide: false }
    })

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

    // Remove holes and hidden from word array
    words = words.filter(w => !w.hide);
  };

  thisComponent.onSegmentUpdate = onSegmentUpdate;

  const entityClass = (word: ITaggedWord) => {
    return word.entityType || "";
  }

  const pingHandler = (e) => {
    dispatchUnbounded("debug", "big-transcript.ping 1");
  };

  const scheduleHide = (prerollMs = 0) => {
    cancelHide();

    timeout = window.setTimeout(() => {
      visible = false;
      timeout = null;
    }, prerollMs);
  }

  const cancelHide = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  }

  onMount (() => {
    let requestId = null;

    const onSegmentUpdateAdapter = (e) => onSegmentUpdate(e.detail);

    thisComponent.addEventListener("speechsegment", onSegmentUpdateAdapter);
    thisComponent.addEventListener("ping", pingHandler);

    return () => {
      cancelAnimationFrame(requestId);
      thisComponent.removeEventListener("speechsegment", onSegmentUpdateAdapter);
      thisComponent.removeEventListener("ping", pingHandler);
    }
  });

</script>

<svelte:window
  on:message={handleMessage}
/>

<main class:placementTop={placement === "top"} style="
  --voffset: {voffset};
  --hoffset: {hoffset};
  --fontsize: {fontsize};
  --highlight-color: {color};
">

  {#if buttonheld || visible}
    <div class="BigTranscript" in:revealTransition out:revealTransition>
      {#if !finalsegment}
      <div class="TranscriptItem" in:slideTransition="{{duration: 200}}" out:slideTransition="{{duration: 200, maxWidth: 3}}">
        <div class="TransscriptItemBgDiv"/>
        <div class="TransscriptItemContent">
          <vu-meter bind:this={vumeter} color={color}></vu-meter>
          {#if showlistening}
            <div class="listening" in:slideTransition="{{duration: 400}}" out:slideTransition="{{duration: 200}}">Listening...</div>
          {/if}
        </div>
      </div>
      {/if}
      {#each words as word, index}
        <div class="TranscriptItem {entityClass(word)}" class:Entity={word.entityType !== null} class:Final={word.isFinal}>
          <div class="TransscriptItemBgDiv" in:slideTransition/>
          <div class="TransscriptItemContent" in:slideTransition>
            {word.word}
            {#if index < words.length}
              <span style={index < words.length - 1 ? "width:0.25em;" : acknowledged ? "width:1.2em;" : ""}></span>
            {/if}
          </div>
        </div>
      {/each}
      {#if acknowledged}
        <div class="TranscriptItem" in:slideTransition="{{duration: 200, maxWidth: 3}}">
          <div class="TransscriptItemBgDiv" style="background-color: {color};"/>
          <div style="width:1.0rem; height: 1rem; position: relative;">
            <svg style="width:2rem; height: 2rem; position: absolute; transform: translate(-0.5rem, -0.5rem); stroke: #eee" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path in:draw="{{duration: 500}}" stroke="currentColor" stroke-width="3" d="M7.191 11.444l4.059 6.107 7.376-12.949" fill="none" fill-rule="evenodd"/></svg>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</main>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
</svelte:head>

<style>
  .BigTranscript {
    position: relative;
    user-select: none;
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
    color: #fff;
    font-size: var(--fontsize);
    line-height: 135%;
    margin-bottom:1.5rem;

    display:flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
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
    background-color: #000;
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
    background: linear-gradient(-60deg, #fff8, #fffc, #fff8, #fffc, #fff8);
    background-size: 200%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-box-decoration-break: clone;
  }

  @keyframes flow {
    0% {background-position: 0 50%;}
    100% {background-position: 100% 50%;}
  }
</style>
