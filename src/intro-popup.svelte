<script lang="ts">
  import { onMount } from "svelte";
  import { fade as fade_orig } from 'svelte/transition';
  import MicIcon from "./components/MicIcon.svelte";
  import SpeechlyLogo from "./components/SpeechlyLogo.svelte";
  import fix from './transFix'

  export let video = "";
  export let hide = undefined;

  const fade = fix(fade_orig);
  $: visibility = mounted && (hide === undefined || hide !== "true");

  let mounted = false;
  let forceInfoVisibility = false;

  onMount(() => {
    mounted = true;
  });

  const closeSelf = () => {
    visibility = false;
    window.postMessage({ type: "speechly-intro-closed" }, "*");
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

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
</svelte:head>

<modal>
{#if visibility}
  <div class="page" transition:fade on:click={closeSelf}>
    <div class="primaryLayout" on:click={ignore}>

      <button on:click={closeSelf} class="close" />

      <div class="layout">
        <main>
          <div class="imageContainer">
              <video class="usageImage" width="100%" height="auto" autoplay muted loop>
                <source src={video} type="video/mp4">
                Your browser does not support the video tag.
              </video>
          </div>
          <div class="bodyTextContainer">
            <h2>Find your favourites faster with&nbsp;voice</h2>
            <p>
              Search Evolve clothing gallery's <b>categories</b>, <b>designers</b> and <b>colors</b> by pressing and holding the
              <span style="width: 1.75rem; height: 1.75rem; vertical-align: middle; margin: -0.25rem -0.5rem 0 -0.5rem; position: relative; display: inline-block;">
                <MicIcon />
              </span>
              <b>push&#8209;to&#8209;talk button</b>.
              <a class="more" href="#info" on:click={() => {forceInfoVisibility = !forceInfoVisibility}}>More info</a>
            </p>
          </div>

        </main>

        <div class="sidePanel" class:forceVisible={forceInfoVisibility}>
          <div class="sidePanelText">
            <div class="sidePanelLogo">
              <SpeechlyLogo/>
            </div>
            <h3>Voice&nbsp;Search Quick&nbsp;Start</h3>
            <ul class="mt-l mb-l">
              <li>Press and hold the
                <span style="width: 1.5rem; height: 1.5rem; vertical-align: middle; margin: -0.20rem -0.35rem 0 -0.35rem; position: relative; display: inline-block;">
                  <MicIcon />
                </span>
                push&#8209;to&#8209;talk button.
              </li>
              <li>Allow the browser to use the mic on the 1st time.</li>
              <li>Say what you need, e.g. <i>"Show me new arrivals"</i></li>
              <li>Release the push&#8209;to&#8209;talk button to stop listening.</li>
              <li>The voice command is detected by Speechly and the search results are shown.</li>
            </ul>
            Learn more at <a href="https://speechly.com/">speechly.com</a>
          </div>
        </div>
      </div>

      <div class="buttonLayout">
        <button on:click={closeSelf} class="wide">Got it!</button>
      </div>

    </div>

  </div>
{/if}
</modal>

<style>
  modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  h1,
  h2,
  h3
  {
    font-family: 'Saira Condensed', sans-serif;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    color: #302865;
    line-height: 120%;
  }
  
  h2 {
    font-size: 135%;
  }
  
  p {
    line-height: 150%;
  }
  
  b {
    color: #302865;
  }
  
  ul {
    min-width: 8rem;
    padding: 0 1rem 0 0;
    list-style-type: none;
  }
  
  li {
    border-left:2px solid #38E7B6;
    margin: 0.75rem 0;
    padding-left: 6px;
    line-height: 135%;
  }
  
  .page {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 2rem 1rem;
  
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  
    background: linear-gradient(180deg, #413783f0, #302865c0 80%);
  }
  
  .primaryLayout {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    background-color: #ffffff;
  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  
    border-radius: 1rem;
  
    box-shadow: 0 0.25rem 1.25rem #0008;
  }
  
  .layout {
    box-sizing: border-box;
    width: 100%;
  
    display: flex;
    flex-direction: column;
    align-self: stretch;
    align-items: flex-start;
    justify-content: flex-start;
  }
  
  .buttonLayout {
    box-sizing: border-box;
    width: 100%;
  
    display: flex;
    flex-direction: column;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 1rem 1rem;
  
    background: linear-gradient(180deg, #d9e3eb, #F7FAFC 15%);
  
  }
  
  main {
    position: relative;
    box-sizing: border-box;
    width: 100%;
  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;
  }
  
  button.wide {
    box-sizing: border-box;
    min-width: 12rem;
    max-width: 100%;
    padding: 0.75rem;
    margin: 1rem;
    background-color: #302865;
    border: none;
    border-radius: 10rem;
  
    transition: 0.3s;
    font-family: 'Saira Condensed', sans-serif;
    font-size: 120%;
    text-transform: uppercase;
    color: #fff;
    line-height: 120%;
  }
  
  button.wide:hover {
    background-color: #6251a5;
    transition: 0.3s;
  }
  
  a,
  a:visited {
    color: #302865;
  }
  
  a:hover {
    color: #6251a5;
  }
  
  .sidePanel {
    box-sizing: border-box;
    width: 100%;
    background: #F7FAFC;
    color: #728195;
    font-size: 85%;
  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    max-height: 0rem;
    transition: 0.5s;
    overflow: hidden;
  }

  .sidePanelText {
    padding: 0.75rem 0.75rem 1.5rem 0.75rem;
  }

  .more {
    white-space: nowrap;
  }

  .forceVisible {
    max-height: 50rem;
    transition: 0.5s;
  }
  
  .mt-m {
    margin-top: 0.75em;
  }
  
  .mb-m {
    margin-bottom: 0.75em;
  }
  
  .mx-m {
    margin-left: 0.75em;
    margin-right: 0.75em;
  }
  
  .mt-l {
    margin-top: 1.5em;
  }
  
  .mb-l {
    margin-bottom: 1.5em;
  }
  
  .imageContainer {
    box-sizing: border-box;
    width: 100%;
    padding:1.0rem;
  }

  .bodyTextContainer {
    padding: 0 2.25rem;  
  }

  .sidePanelLogo {
    width: 85%;
    padding: 0.75rem 0 0.75rem 0;
  }
  
  .usageImage {
    box-sizing: border-box;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  @media (max-width: 480px) {
    .page {
      font-size: 88%;
    }
  
    .imageContainer {
      padding: 0 0 1rem 0;
    }

    .sidePanelText {
      padding: 1.5rem 2.25rem;  
    }

    .sidePanelLogo {
      display: none;
    }
    
    .usageImage {
      border-radius: 1rem 1rem 0 0;
    }
    
  }
  
  @media (min-width: 480px) and (max-width: 688px) {
    .page {
      font-size: 100%;
      padding: 2rem 2rem;
    }
  
    .primaryLayout {
      width: 600px;
    }
  
    .layout {
      flex-direction: row;
      justify-content: flex-start;
    }
  
    .more {
      display: none;
    }
  
    .sidePanel {
      max-height: 50rem;
      width: 11rem;
      flex-shrink: 0;
      min-height: 100%;
      align-self: stretch;
      flex-direction: column;
      border-radius: 0 1rem 0 0;
    }
  
  }
  
  @media (min-width: 688px) {
    .page {
      padding: 2rem 0;
      font-size: 100%;
    }
  
    .primaryLayout {
      width: 600px;
    }
  
    .layout {
      flex-direction: row;
      justify-content: flex-start;
    }
  
    .more {
      display: none;
    }
  
    .sidePanel {
      max-height: 50rem;
      width: 12.5rem;
      flex-shrink: 0;
      min-height: 100%;
      align-self: stretch;
      flex-direction: column;
      border-radius: 0 1rem 0 0;
    }
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
    background: #6251a5;
  }

  .close:hover:before, .close:hover:after {
    height: 2px;
    background: white;
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
