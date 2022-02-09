<script lang="ts">
  import { onMount } from "svelte";
  import { fade as fade_orig } from 'svelte/transition';
  import MicIcon from "./components/MicIcon.svelte";
  import SpeechlyLogo from "./components/SpeechlyLogo.svelte";
  import fix from './fixTransition'
  import { createDispatchUnbounded} from "./fixDispatch";

  export let video = "";
  export let hide = undefined;
  export let remsize = "1.0rem";
  export let position = "fixed";

  const dispatchUnbounded = createDispatchUnbounded();
  const fade = fix(fade_orig);
  $: visibility = mounted && hide === "false";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const closeSelf = () => {
    visibility = false;
    dispatchUnbounded("speechlyvideoclosed");
    window.postMessage({ type: "speechlyvideoclosed" }, "*");
  }

  const ignore = (e) => {
    e.stopPropagation();
  }

  const handleKeydown = (event) => {
    if (mounted && event.key === 'Escape') {
      event.preventDefault();
      closeSelf();
    }
  }
</script>

<svelte:options tag={null} immutable={true} />
<svelte:window on:keydown={handleKeydown}/>

<modal style="
  --remsize: {remsize};
">
{#if visibility}
  <modalcontent transition:fade class="{position}">
    <animation>
      <button class="close" on:click={closeSelf}/>
      <video width="100%" height="auto" autoplay muted loop>
        <source src={video} type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </animation>
  </modalcontent>
{/if}
</modal>

<style>

  modal {
    font-size: var(--remsize);
    height: 100%;
  }

  modalcontent {
    z-index: 2001;
    pointer-events: none;
  }

  modalcontent.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  modalcontent.absolute {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
  }
  
  animation {
    position: absolute;
    box-sizing: border-box;
    width: 300px;
    margin: 1rem;
    top:0;
    right:0;
    border-radius: 8px;
    pointer-events: auto;
  }

  video {
    box-sizing: border-box;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #0002;
  }
  
  .close {
    --button-size: 1.5rem;
    display: block;
    box-sizing: border-box;
    position: absolute;
    z-index: 1000;
    top: 0.25rem;
    right: 0.25rem;
    margin: 0;
    padding: 0;
    width: var(--button-size);
    height: var(--button-size);
    border: 0;
    color: black;
    border-radius: 1.5rem;
    background: transparent;
    box-shadow: 0 0 0 1px transparent;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    -webkit-appearance: none;
  }

  .close:before, .close:after {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    width: calc(var(--button-size) - 0.5rem);
    height: 1px;
    background: #728195;
    transform-origin: center;
    transition: height 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .close:before {
    -webkit-transform: translate(0, -50%) rotate(45deg);
    -moz-transform: translate(0, -50%) rotate(45deg);
    transform: translate(0, -50%) rotate(45deg);
    left: 0.25rem;
  }

  .close:after {
    -webkit-transform: translate(0, -50%) rotate(-45deg);
    -moz-transform: translate(0, -50%) rotate(-45deg);
    transform: translate(0, -50%) rotate(-45deg);
    left: 0.25rem;
  }

  .close:hover {
    background: #ffffff;
  }

  .close:hover:before, .close:hover:after {
    height: 2px;
    background: black;
  }

  .close:focus {
    border-color: #3399ff;
    box-shadow: 0 0 0 2px #3399ff;
  }

  .close:active {
    transform: scale(0.9);
  }

  .close:hover, .close:focus, .close:active {
    outline: none;
  }
</style>
