<svelte:options tag="transcript-drawer" immutable={true} />

<script lang="ts">
  import { cubicIn, cubicOut, linear } from 'svelte/easing';
  import "./big-transcript.svelte";
  import { tweened } from 'svelte/motion';

  export let height = "8rem";
  export let hint = `Try: "Show me blue jeans"`;
  export let textbgcolor = "#202020";

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
        hintTransition.set({opacity: 0});
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
">
  <div class="drawer" style="
    background-color: {textbgcolor};
    opacity: {$opacityTransition.opacity};
    transform: translate(0px, {$positionTransition.y}rem);
  ">
    <div class="pad">
      <big-transcript on:visibilitychanged={bigTranscriptVisibilityChanged} textbgcolor={textbgcolor}></big-transcript>
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
    z-index: 0;
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
    color: #fff7;
    font-size: 0.9rem;
    line-height: 135%;
    margin-top: 0.15rem;
  }

</style>