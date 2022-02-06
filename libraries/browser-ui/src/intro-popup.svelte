<script lang="ts">
  import { onMount } from "svelte";
  import { fade as fade_orig } from 'svelte/transition';
  import MicIcon from "./components/MicIcon.svelte";
  import fix from './fixTransition'
  import { createDispatchUnbounded} from "./fixDispatch";
  import { ClientState, MessageType } from "./constants";

  export let hide = "auto";
  export let remsize = "1.0rem";
  export let position = "fixed";
  export let customcssurl = undefined;
  export let customtypography = undefined;

  const PagePriming = 'PagePriming'
  const PagePrompt = 'PagePrompt'
  const HttpsRequired = 'HttpsRequired'

  const dispatchUnbounded = createDispatchUnbounded();
  const fade = fix(fade_orig);

  $: visibility = mounted && hide === "false";
  $: defaultTypography = customtypography === undefined || customtypography === "false";

  let mounted = false;
  let page: ClientState | string = PagePriming;
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
    window.postMessage({ type: MessageType.speechlyintroready }, "*");
  });

  const closeSelf = (params = {}) => {
    visibility = false;
    dispatchUnbounded("speechlyintroclosed", params);
    window.postMessage({ type: MessageType.speechlyintroclosed, ...params }, "*");
  }

  const initialize = () => {
    window.postMessage({ type: MessageType.speechlystarting }, "*");
    window.SpeechlyClient.initialize();
  }

  const handleKeydown = (event) => {
    if (mounted && event.key === 'Escape') {
      event.preventDefault();
      closeSelf();
    }
  }

  const handleMessage = (e) => {
    switch (e.data.type) {
      case MessageType.speechlypoweron:
        if (hide === "auto") {
          visibility = true;
        }
        break;
      case MessageType.speechlystarting:
        page = PagePrompt;
        introTimeout = window.setTimeout(() => {
          introTimeout = null;
          if (hide === "auto") {
            visibility = true;
          }
        }, 500);
        break;

      case MessageType.holdstart:
        switch (e.data.state) {
          case ClientState.Failed:
          case ClientState.NoAudioConsent:
          case ClientState.NoBrowserSupport:
            showError(e.data.state);
            break;
        }
        break;
      case MessageType.initialized:
        appId = e.data.appId;
        if (e.data.success) {
          if (introTimeout) {
            // Quick init indicates mic permission is cached. Cancel displaying intro popup.
            window.clearTimeout(introTimeout);
            introTimeout = null;
            closeSelf();
          } else {
            closeSelf({firstrun: true});
          }
        } else {
          showError(e.data.state);
        }
        break;
      default:
        break;
    }
  }

  const showError = (e: ClientState | string) => {
    if (hide === "auto") {
      visibility = true;
    }
    // Provide special instructions for non-https access
    if (window?.location?.protocol !== 'https:' && !isLocalHost(window.location.hostname)) {
      page = HttpsRequired;
      return;
    }
    page = e;
  }

</script>

<svelte:options tag={null} immutable={true} />
<svelte:window on:keydown={handleKeydown} on:message={handleMessage}/>

<svelte:head>
  {#if defaultTypography}
    <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
  {/if}
</svelte:head>

{#if customcssurl !== undefined}
  <link href="{customcssurl}" rel="stylesheet">
{/if}

<modal style="
  --remsize: {remsize};
">
{#if visibility}
  <modalbg transition:fade on:click={closeSelf} />

  <modalcontent class:defaultTypography={defaultTypography} transition:fade class="{position}">
    <main>
      {#if page === PagePriming}
        <h2><slot name="prompt-title">Allow microphone</slot></h2>
        <p>
          <slot name="welcome-body">
            Please click <b>Allow</b> to use the microphone.
            We'll only listen to you when you press the <span style="display: inline-block; position: relative; color: white; width: 20px; height: 10px; --icon-color: white; --icon-size: 20px;"><MicIcon /></span> button.
          </slot>
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Later</button>
          <button on:click={initialize} class="wide primary">Allow</button>
        </options>
      {:else if page === PagePrompt}
        <h2>↖ <slot name="prompt-title">Allow microphone</slot></h2>
        <p>
          <slot name="prompt-body">
            Please click <b>Allow</b> to use the microphone.
            We'll only listen to you when you press the <span style="display: inline-block; position: relative; color: white; width: 20px; height: 10px; --icon-color: white; --icon-size: 20px;"><MicIcon /></span> button.
          </slot>
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Got it</button>
        </options>
      {:else if page === HttpsRequired}
        <h2>HTTPS Required</h2>
        <p>
          To use the voice interface, please visit this site using the secure
          https:// protocol.
        </p>

        <options>
          <button on:click={() => {window.location.href.replace(/^http(?!s)/, 'https')}} class="wide">
            Try with HTTPS
          </button>
          <button on:click={closeSelf} class="wide">Later</button>
        </options>
      {:else if page === ClientState.NoAudioConsent}
        <h2>Voice unavailable</h2>
        <p>
          Please reload the page to try again.
        </p>
        <p>
          If that doesn't work, check your browser preferences to re-allow microphone use.
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Later</button>
          <button on:click={() => {window.location.reload()}} class="wide primary">Reload</button>
        </options>
      {:else if page === ClientState.NoBrowserSupport}
        <h2>Unsupported Browser</h2>
        <p>
          To use the voice interface, please visit this site using a supported
          browser.
        </p>

        <options>
          <button on:click={closeSelf} class="wide">Got it</button>
        </options>
      {:else}
        <h2>Failed to connect Speechly</h2>
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
    backdrop-filter: blur(3px);
  }

  modalcontent {
    z-index: 2001;
    pointer-events: auto;

    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    padding: 1.5rem 2rem;
  
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

  .defaultTypography, .defaultTypography button {
    font-family: sans-serif;
    line-height: 150%;
    color: #fff;
    font-size: 1rem;
  }

  .defaultTypography h2 {
    font-family: 'Saira Condensed', sans-serif;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    color: #fff;
    font-size: 135%;
    line-height: 120%;
  }

  main {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    margin: auto 0;
    padding: 2rem 0;
  }
  
  b {
    color: #80bbff;
  }

  footer {
    box-sizing: border-box;

    font-size: 85%;
    color: #aaa;
    margin: 0;
  }
  
  options {
    display: block;
    margin-top: 2.5rem;
  }

  options > * {
    margin-left: 4px;
}

  options > *:first-child {
    margin-left: 0px;
  }
  button.wide {
    box-sizing: border-box;
    min-width: 9rem;
    max-width: 100%;
    padding: 0.60rem;
    border-radius: 10rem;
    font-size: 100%;
    border: 1px solid #aaa;

    background-color: #fff0;  
    transition: 0.3s;
    color: #aaa;
    line-height: 120%;
  }

  button.wide:hover {
    transition: 0.3s;
    border-color: #fff;
    color: #fff;
  }

  button.primary {
    background-color: #aaa;
    border: 0;
    color: #000;
  }

  button.primary:hover {
    border: 0;
    background-color: #ffff;
    transition: 0.3s;
    color: #000;
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
