<svelte:options tag="transcript-drawer" immutable={true} />

<script lang="ts">
  import { onMount } from "svelte";
  import { cubicOut } from 'svelte/easing';
  import "./big-transcript.svelte";
  import { tweened } from 'svelte/motion';

  let buttonheld = false;
  let transition = tweened({ y: -1, opacity: 0 }, {
    duration: 200,
    easing: cubicOut,
  });

  const handleMessage = (e) => {
    switch (e.data.type) {
      case "holdstart":
        buttonheld = true;
        transition.set({y: 0, opacity: 1});
        break;
      case "holdend":
        buttonheld = false;
        transition.set({y: -1, opacity: 0});
        break;
      default:
        break;
    }
  }

</script>

<svelte:window
  on:message={handleMessage}
/>

<main class="placementTop">
  <div class="drawer" style="opacity: {$transition.opacity}; transform: translate(0px, {$transition.y}rem);">
    <div class="pad">
      <big-transcript></big-transcript>
      <div class="hint">
        Try "Show me blue jeans"
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
    z-index: 0;
    pointer-events: none;
  }

  .drawer {
    width: 100%;
    min-height: 12rem;

    background-color: #222;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .pad {
    position: relative;
    padding: 2rem 2rem 1rem 1.5rem;
  }

  .hint {
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
    color: #fff;
    font-size: 0.9rem;
    line-height: 135%;
  }

</style>