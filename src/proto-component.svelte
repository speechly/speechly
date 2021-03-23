<svelte:options tag="proto-component" immutable={true} />

<script lang="ts">
  import { get_current_component } from "svelte/internal";
  import { onMount } from "svelte";
  import type { ITaggedWord } from "./types";
  import { fadeIn, interpolateLinearf } from "./TableInterpolator";
  import fix from "./transFix";
  import { cubicInOut } from "svelte/easing";
  import { fade as fade_orig } from 'svelte/transition';

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

  onMount (() => {
    console.log("-------------------------")

    thisComponent.addEventListener("ping", pingHandler);

    return () => {
      thisComponent.removeEventListener("ping", pingHandler);
    }
  });

</script>

<div class="ProtoComponent">
  <div style="color: blue;">proto-component 2</div>
</div>

<style>
  .ProtoComponent {
    position: relative;
    user-select: none;
  }
</style>
