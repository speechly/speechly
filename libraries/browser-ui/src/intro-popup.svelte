<script lang="ts">
  import { onMount } from "svelte";
  import { fade as fade_orig } from 'svelte/transition';
  import MicIcon from "./components/MicIcon.svelte";
  import fix from './fixTransition'
  import { createDispatchUnbounded} from "./fixDispatch";
  import { ClientState } from "@speechly/browser-client";

  export let hide = undefined;
  export let remsize = "1.0rem";
  export let position = "fixed";

  const HttpsRequired = 'HttpsRequired'
  const dispatchUnbounded = createDispatchUnbounded();
  const fade = fix(fade_orig);

  $: visibility = mounted && hide === "false";

  let mounted = false;
  let errorState: ClientState | string | null = null;
  let appId: null;
  let introTimeout = null;

  const isLocalHost = (hostname: string): boolean =>
    !!(
      hostname === 'localhost' ||
      hostname === '[::1]' ||
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    )

  onMount(() => {
    mounted = true;
  });

  const closeSelf = () => {
    visibility = false;
    dispatchUnbounded("speechlyintroclosed");
    window.postMessage({ type: "speechlyintroclosed" }, "*");
  }

  const handleKeydown = (event) => {
    if (mounted && event.key === 'Escape') {
      event.preventDefault();
      closeSelf();
    }
  }

  const handleMessage = (e) => {
    switch (e.data.type) {
      case "speechlystarting":
        introTimeout = window.setTimeout(() => {
          introTimeout = null;
          visibility = true;
        }, 500);
        break;

      case "holdstart":
        switch (e.data.state) {
          case ClientState.Failed:
          case ClientState.NoAudioConsent:
          case ClientState.NoBrowserSupport:
            showError(e.data.state);
            break;
        }
        break;
      case "initialized":
        appId = e.data.appId;
        if (e.data.success) {
          if (introTimeout) {
            window.clearTimeout(introTimeout);
            introTimeout = null;
          } else {
            window.postMessage({ type: "runspeechlytutorial" }, "*");
          }
          closeSelf();
        } else {
          showError(e.data.state);
        }
        break;
      default:
        break;
    }
  }

  const showError = (e: ClientState | string) => {
    visibility = true;
    // Provide special instructions for non-https access
    if (window?.location?.protocol !== 'https:' && !isLocalHost(window.location.hostname)) {
      errorState = HttpsRequired;
      return;
    }
    errorState = e;
  }

</script>

<svelte:options tag={null} immutable={true} />
<svelte:window on:keydown={handleKeydown} on:message={handleMessage}/>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
</svelte:head>

<modal style="
  --remsize: {remsize};
">
{#if visibility}
  <modalbg transition:fade on:click={closeSelf} />

  <modalcontent transition:fade class="{position}">
    <main>
      {#if errorState === null}
        <h2>↖ <slot name="mic-prompt-title">Allow searching with voice</slot></h2>
        <p>
          <slot name="mic-prompt-body">
            Please click <b>Allow</b> to use the microphone.
            We'll only listen to you when you press the <span style="display: inline-block; position: relative; color: white; width: 20px; height: 10px; --icon-color: white; --icon-size: 20px;"><MicIcon /></span> button.
          </slot>
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Got it</button>
        </options>
      {:else if errorState === HttpsRequired}
        <h2>HTTPS Required 😢</h2>
        <p>
          To use the voice interface, please visit this site using the secure
          https:// protocol.
        </p>

        <options>
          <button on:click={() => {window.location.href.replace(/^http(?!s)/, 'https')}} class="wide">
            Try with HTTPS
          </button>
        </options>
      {:else if errorState === ClientState.NoAudioConsent}
        <h2>Voice unavailable 😢</h2>
        <p>
          Please reload the page to try again.
        </p>
        <p>
          If that doesn't work, check your browser preferences to re-allow microphone use.
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Got it</button>
        </options>
      {:else if errorState === ClientState.NoBrowserSupport}
        <h2>Unsupported Browser 😢</h2>
        <p>
          To use the voice interface, please visit this site using a supported
          browser.
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Aww, bummer</button>
        </options>
      {:else}
        <h2>Failed to connect Speechly 😢</h2>
        <p>
          Please check that Speechly application id '{appId}' has been successfully deployed.
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Aww, bummer</button>
        </options>
      {/if}
    </main>

    <footer>
      Voice input is automatically transcribed by <a target="_new" href="https://speechly.com/">Speechly</a> and can be used to improve the quality of service under <a target="_new" href="https://www.speechly.com/privacy/terms-and-conditions">terms of use</a>.
    </footer>

  </modalcontent>
{/if}
</modal>

<style>

  modal {
    font-size: var(--remsize);
    pointer-events: none;
    height: 100%;
  }

  modalbg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 2000;
    pointer-events: auto;

    background-color: #000000c0;
  }

  modalcontent {
    z-index: 2001;
    pointer-events: auto;

    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    padding: 2.5rem 2rem;
  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: #fff;
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

  main {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    margin: auto 0;
  }
  
  b {
    animation: pulse 1s alternate infinite;
  }

  @keyframes pulse {
  0% {
    color: #ffffff;
  }
  100% {
    color: #80bbff;
  }
}

  footer {
    box-sizing: border-box;

    font-size: 85%;
    color: #aaa;
    margin: 0;
  }

  h2
  {
    font-family: 'Saira Condensed', sans-serif;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    color: #fff;
    font-size: 135%;
    line-height: 120%;
  }
  
  p {
    line-height: 150%;
    color: #fff;
    font-size: 1rem;
  }

  options {
    display: block;
    margin-top: 2em;
  }
      
  button.wide {
    box-sizing: border-box;
    min-width: 10rem;
    max-width: 100%;
    padding: 0.66rem;
    background-color: #aaa;
    border: none;
    border-radius: 10rem;
    font-size: 100%;
  
    transition: 0.3s;
    color: #000;
    line-height: 120%;
  }
  
  button.wide:hover {
    background-color: #ffff;
    transition: 0.3s;
  }
  
  a,
  a:visited {
    color: #aaa;
    transition: 0.3s;
  }
  
  a:hover {
    color: #fff;
    transition: 0.3s;
  }
  
  .sidePanelLogo {
    width: 85%;
    padding: 0.75rem 0 0.75rem 0;
  }
    
  @media (max-width: 480px) {
  }
  
  @media (min-width: 480px) and (max-width: 688px) {  
    main {
      width: 600px;
    }
  }
  
  @media (min-width: 688px) {
    main {
      width: 600px;
    }
  }
</style>
