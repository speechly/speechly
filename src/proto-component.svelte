<svelte:options tag="proto-component" immutable={true} />

<script lang="ts">
  import type { Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import type { ITaggedWord } from "./types";
  import fix from './transFix'
  import { get_current_component } from "svelte/internal";
  import { fade as fade_orig } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import {interpolateLinearf, fadeIn} from "./TableInterpolator"

  const thisComponent = get_current_component();
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  const fade = fix(fade_orig);

  const revealTransition = fix((node, {delay = 0, duration = 800}) => {
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

  const slideTransition = fix((node, {delay = 0, duration = 250}) => {
    return {
      delay,
      duration,
      css: (t: number) => `
        max-width: ${interpolateLinearf(fadeIn, t, 0.0, 1.0) * 10}rem;
      `
    };
  });

  let words: ITaggedWord[] = [{word: "Initializing", entityType: null, isFinal: true, serialNumber: 1}];
  let visible = false;

  const pingHandler = (e) => {
    dispatchUnbounded("debug", "proto-component.ping 1");
  };

  const onSegmentUpdate = (segment: Segment) => {
    dispatchUnbounded("debug", "proto-component.onSegmentUpdate 1");

    if (segment === undefined) return;

    dispatchUnbounded("debug", "proto-component.onSegmentUpdate 2");

    visible = !segment.isFinal;

    // Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
    words = []
    segment.words.forEach(w => {
      words[w.index] = { word: w.value, serialNumber: w.index, entityType: null, isFinal: w.isFinal }
    })

    // Tag words with entities
    segment.entities.forEach(e => {
      words.slice(e.startPosition, e.endPosition).forEach(w => {
        w.entityType = e.type
        w.isFinal = e.isFinal
      })
    })

    // Remove holes from word array
    words = words.flat()
    // words = [...words];
  };

  thisComponent.onSegmentUpdate = onSegmentUpdate;

  onMount (() => {
    console.log("-------------------------")
    let requestId = null;

    const onSegmentUpdateAdapter = (e) => onSegmentUpdate(e.detail);

    thisComponent.addEventListener("segment-update", onSegmentUpdateAdapter);
    thisComponent.addEventListener("ping", pingHandler);

    const tick = () => {
      requestId = requestAnimationFrame(tick);
    };

    // tick();

    return () => {
      cancelAnimationFrame(requestId);
      thisComponent.removeEventListener("ping", pingHandler);
      thisComponent.removeEventListener("segment-update", onSegmentUpdateAdapter);
    }
  });

</script>

<svelte:window on:message={(e) => {e.data.type === "segment-update" && onSegmentUpdate(e.data.segment)}}/>

  <div class="BigTranscript">
    <div style="color: red;">Test test 2</div>
      <!--
    {#if visible}
      <div style="margin-bottom:1.5rem" in:revealTransition out:revealTransition="{{delay: 2000}}">
      -->
      <div style="margin-bottom:1.5rem">
<!--
          {#each words as word}
          <div class={`TranscriptItem ${word.entityType !== null ? 'Entity' : ''} ${word.isFinal ? 'Final' : ''} ${word.entityType ?? ''}`}>
            <div in:slideTransition class="TransscriptItemBgDiv"/>
            <div class="TransscriptItemBgDiv"/>
            <div class="TransscriptItemContent">
              {word.word}{" "}
            </div>
          </div>
        {/each}
        -->
      </div>
  <!--
      {/if}
  -->
  </div>
  
<style>
  .BigTranscript {
    position: relative;
    user-select: none;
  }

  .TranscriptItem {
    position: relative;
    display: inline-block;
    margin-left: 0.25rem;
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
</style>
  