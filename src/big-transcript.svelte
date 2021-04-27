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

  export let placement = undefined;
  export let voffset = "3rem";
  export let hoffset = "2rem";
  export let fontsize = "1.5rem";

  let words: ITaggedWord[] = [];
  let visible = false;

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const thisComponent = get_current_component();
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

  const onSegmentUpdate = (segment: Segment) => {
    if (segment === undefined) return;

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
      thisComponent.removeEventListener("ping", pingHandler);
      thisComponent.removeEventListener("speechsegment", onSegmentUpdateAdapter);
    }
  });

</script>

<svelte:window on:message={(e) => {e.data.type === "speechsegment" && onSegmentUpdate(e.data.segment)}}/>

<main class:placementTop={placement === "top"} style="
  --voffset: {voffset};
  --hoffset: {hoffset};
  --fontsize: {fontsize};
">
  <div class="BigTranscript">
    {#if visible}
      <div style="margin-bottom:1.5rem" in:revealTransition out:revealTransition="{{delay: 2000}}">
        {#each words as word}
          {#if word}
            <div class="TranscriptItem {entityClass(word)}" class:Entity={word.entityType !== null} class:Final={word.isFinal}>
              <div class="TransscriptItemBgDiv" in:slideTransition/>
              <div class="TransscriptItemContent">
                {word.word}{" "}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
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
}
  .TranscriptItem {
    position: relative;
    display: inline-block;
    margin-left: 0.25em;
  }

  .Entity {
    color: cyan;
  }

  .TransscriptItemContent {
    z-index: 1;
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
</style>
