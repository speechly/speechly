<svelte:options tag="big-transcript" immutable={true} />

<script lang="ts">
  import type { Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import type { ITaggedWord } from "./types";
  import fix from './transFix'
  import { get_current_component } from "svelte/internal";
  import { fade as fade_orig } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import {interpolateLinearf, fadeIn} from "./TableInterpolator"
  import "./components/vu-meter.svelte";

  export let placement = undefined;
  export let voffset = "3rem";
  export let hoffset = "2rem";
  export let fontsize = "1.5rem";

  let words: ITaggedWord[] = [];
  let vumeter = undefined;
  let visible = false;
  let buttonheld = false;

  $: showlistening = (words.length === 0 && buttonheld);

  const thisComponent = get_current_component();
 
  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  const fade = fix(fade_orig);

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

  const slideTransition = fix((node, {delay = 0, duration = 350}) => {
    return {
      delay,
      duration,
      css: (t: number) => `
        max-width: ${interpolateLinearf(fadeIn, t, 0.0, 1.0) * 10}rem;
      `
    };
  });

  const handleMessage = (e) => {
    switch (e.data.type) {
      case "speechsegment":
        onSegmentUpdate(e.data.segment);
        break;
      case "holdstart":
        buttonheld = true;
        words = [];
        break;
      case "holdend":
        buttonheld = false;
        break;
      default:
        break;
    }
  }

  const onSegmentUpdate = (segment: Segment) => {
    if (segment === undefined) return;

    if (vumeter) vumeter.dispatchEvent(new CustomEvent("updateVU", {detail: {level: 1.0, seekTimeMs: 1000}}));

    visible = !segment.isFinal;

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
">

  {#if buttonheld || visible}
    <div class="BigTranscript" in:revealTransition out:revealTransition="{{delay: words.length > 0 ? 2000 : 0}}">
      <div class="TranscriptItem">
        <div class="TransscriptItemBgDiv"/>
          <div class="TransscriptItemContent">
            <vu-meter bind:this={vumeter} out:slideTransition="{{duration: 200}}"></vu-meter>
            {#if showlistening}
              <div class="listening" in:slideTransition="{{duration: 400}}" out:slideTransition="{{duration: 200}}">Listening...</div>
            {/if}
          </div>
        </div>
        {#each words as word}
          <div class="TranscriptItem {entityClass(word)}" class:Entity={word.entityType !== null} class:Final={word.isFinal}>
            <div class="TransscriptItemBgDiv" in:slideTransition/>
            <div class="TransscriptItemContent">
              {word.word}{" "}
            </div>
          </div>
        {/each}
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
    line-height: 120%;
    margin-bottom:1.5rem;

    display:flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
}
  .TranscriptItem {
    position: relative;
    margin-left: 0.25em;

    display:flex;
    flex-direction: row;
    align-items: center;
  }

  .Entity {
    color: cyan;
  }

  .TransscriptItemContent {
    z-index: 1;
    display:flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
  }

  .TransscriptItemBgDiv {
    position: absolute;
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    margin: -0.4rem -0.6rem;
    padding: 0.4rem 0.6rem;
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
    animation: flow 2s ease-in-out infinite;
    background: linear-gradient(-60deg, #fffa, #fffa, #fff4, #fff4);
    background-size: 300%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-box-decoration-break: clone;
  }

  @keyframes flow {
    0% {background-position: 0 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0 50%;}
  }
</style>
