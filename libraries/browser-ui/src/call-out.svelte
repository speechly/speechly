<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import fix from './fixTransition'

  const INSTRUCTION_PREROLL_MS = 500

  export let show = undefined;
  export let showtime = 10000;
  export let backgroundcolor = "#202020";
  export let xalign = "50%"
  export let width = "auto";

  let sourceAnchors = { x: '50%', y: '10%' };
  $: destAnchors = { x: xalign, y: '100%' };
  let arrowSize = { value: 0.55, unit: 'rem' };
  let useShadow = false;
  let borderRadius = "0rem";
  let timeout = null;
  let showCallout = false;

  // Preroll and auto-hide logic
  $: scheduleShow(show) 

  const circlewipe = fix((node, { duration = 250 }) => {
    return {
      duration,
      css: (t: number) => {
        return `
          clip-path: circle(${t * 100}% at ${destAnchors.x} 50%);
        `
      }
    }
  });

  const scheduleShow = (show) => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    if (show !== undefined && show !== "false") {
      timeout = window.setTimeout(() => {
        showCallout = true;
        timeout = null;
        if ((showtime as unknown as number) > 0) {
          timeout = window.setTimeout(() => {
            showCallout = false;
            timeout = null;
          }, (showtime as unknown as number));
        }
      }, INSTRUCTION_PREROLL_MS);
    } else {
      showCallout = false;
    }
  }

  const onMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    showCallout = false;
  }

</script>

<main style="
  --ax: {sourceAnchors.x};
  --ay: {sourceAnchors.y};
  --halign: {destAnchors.x};
  --valign: {destAnchors.y};
  --borderradius: {borderRadius};
  --arrowpad: {`${arrowSize.value}${arrowSize.unit}`};
  --backgroundcolor: {backgroundcolor};
  --size: {`${arrowSize.value * Math.sqrt(2)}${arrowSize.unit}`};
  --offsetx: {"0rem"};
  --offsety: {`${arrowSize.value}${arrowSize.unit}`};
">
  {#if showCallout}
    <div class="CalloutContainerDiv"
      on:mousedown={onMouseDown}
      on:touchstart={onMouseDown}
      on:dragstart={onMouseDown}
      in:circlewipe
      out:circlewipe
      style="
        width: {width};
      "
    >
      <div class="CalloutDiv" class:useShadow={useShadow}><slot></slot></div>
      <div class="ArrowDiv" style="
        --ax: {destAnchors.x};
        --ay: 100%;
      "/>
      {#if useShadow}
        <div class="ArrowShadowDiv"/>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    margin:0;
    padding:0;
  }

  .CalloutContainerDiv {
    position: absolute;
    left: var(--ax);
    top: var(--ay);
    transform: translate(calc(-1 * var(--halign)), calc(-1 * var(--valign)));
    padding: var(--arrowpad);
    z-index: 10;
    pointer-events: auto;
  }

  .CalloutDiv {
    position: relative;
    box-sizing: border-box;
    min-width: 8rem;
    border-radius: var(--borderradius);
    padding: 0.50rem 1rem;
    background-color: var(--backgroundcolor);
    text-align: center;
    user-select: none;
    z-index: 10;
  }

  .useShadow {
    box-shadow: 0 0.2rem 0.5rem #00000040;
  }

  .ArrowDiv {
    position: absolute;
    left: calc(var(--ax) - var(--offsetx));
    top: calc(var(--ay) - var(--offsety));

    transform: translate(-50%, -50%) rotate(45deg);
    width: var(--size);
    height: var(--size);
    background-color: var(--backgroundcolor);
    z-index: 10;
  }

  .ArrowShadowDiv {
    position: absolute;
    left: calc(var(--ax) - var(--offsetx));
    top: calc(var(--ay) - var(--offsety));

    transform: translate(-50%, -50%) rotate(45deg);
    width: var(--size);
    height: var(--size);
    background-color: var(--backgroundcolor);
    background-color: #00000000;
    box-shadow: 0 0.2rem 0.5rem #00000040;
    z-index: 9;
  }

</style>