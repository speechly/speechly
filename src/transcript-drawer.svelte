<svelte:options tag="transcript-drawer" immutable={true} />

<script lang="ts">
  import { onMount } from "svelte";
  import fix from './transFix'
  import { get_current_component } from "svelte/internal";
  import { fly as fly_orig } from 'svelte/transition';
  import { quintIn, quintOut } from 'svelte/easing';
  import "./big-transcript.svelte";

  const fly = fix(fly_orig);

  let buttonheld = false;

  const handleMessage = (e) => {
    switch (e.data.type) {
      case "holdstart":
        buttonheld = true;
        break;
      case "holdend":
        buttonheld = false;
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
  {#if buttonheld}
  <div class="drawer" in:fly="{{duration: 300, y: -50, opacity: 0, easing: quintOut}}" out:fly="{{duration: 300, y: -50, opacity: 0, easing: quintOut}}">
    <div class="pad">
      <big-transcript></big-transcript>
    </div>
  </div>
  {/if}
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
  }

  .pad {
    width: 100%;
    position: relative;
    padding: 7rem 2rem 1rem 2rem;
  }

</style>