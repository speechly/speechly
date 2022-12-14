<script lang="ts">
  import { onMount } from "svelte";
  import { fade as fade_orig } from 'svelte/transition';
  import MicIcon from "./components/MicIcon.svelte";
  import fix from './fixTransition'
  import { createDispatchUnbounded} from "./fixDispatch";
  import { AudioSourceState, DecoderState, MessageType } from "./constants";

  export let hide = "auto";
  export let clientstate: string = undefined;
  export let microphonestate: string = undefined;
  export let remsize = "1.0rem";
  export let position = "fixed";
  export let customcssurl = undefined;
  export let customtypography = undefined;

  $: if (clientstate) onClientStateChange(parseInt(clientstate) as DecoderState)
  $: if (microphonestate) onAudioSourceStateChange(microphonestate as AudioSourceState)

  let firstConnect = true;

  const PagePriming = 'PagePriming'
  const HttpsRequired = 'HttpsRequired'

  const dispatchUnbounded = createDispatchUnbounded();
  const fade = fix(fade_orig);

  $: visibility = mounted && hide === "false";
  $: defaultTypography = customtypography === undefined || customtypography === "false";

  let mounted = false;
  let page: DecoderState | AudioSourceState | string = PagePriming;
  let introTimeout = null;
  let showAllowButton = false;

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

  const initialize = async() => {
    dispatchUnbounded(MessageType.requeststartmicrophone);
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
        showAllowButton = true;
        page = PagePriming
        break;
      case MessageType.speechstate:
        onClientStateChange(e.data.state)
        break;
      case MessageType.audiosourcestate:
        onAudioSourceStateChange(e.data.state)
        break;
      case MessageType.holdstart:
        switch (e.data.audioSourceState) {
          case AudioSourceState.NoAudioConsent:
          case AudioSourceState.NoBrowserSupport:
            showError(e.data.audioSourceState);
            break;
        }
        break;
      default:
        break;
    }
  }

  const showError = (e: DecoderState | AudioSourceState | string) => {
    if (hide === "auto") {
      visibility = true;
    }
    // Cancel pending prompt
    if (introTimeout) {
      window.clearTimeout(introTimeout);
      introTimeout = null;
    }
    // Provide special instructions for non-https access
    if (window?.location?.protocol !== 'https:' && !isLocalHost(window.location.hostname)) {
      page = HttpsRequired;
      return;
    }
    page = e;
  }

  const replaceWithHttps = () => {
    const url = window.location.href;
    const newUrl = url.replace("http:", "https:");
    window.location.replace(newUrl)
  }

  const onAudioSourceStateChange = (state: AudioSourceState) => {
    switch (state) {
      case AudioSourceState.Starting:
        // Allow only going forward in pages to prevent hiding an error
        if (page === PagePriming) {
          page = state;
          introTimeout = window.setTimeout(() => {
            introTimeout = null;
            if (hide === "auto") {
              visibility = true;
            }
          }, 500);
        } else {
          visibility = true;
        }
        break;
      case AudioSourceState.Started:
        if (firstConnect) {
          // All good, hide this popup
          firstConnect = false;
          if (introTimeout) {
            // Quick init indicates mic permission is cached. Cancel displaying intro popup.
            window.clearTimeout(introTimeout);
            introTimeout = null;
            closeSelf();
          } else {
            closeSelf({firstrun: true});
          }
        }
        break;
      case AudioSourceState.NoAudioConsent:
      case AudioSourceState.NoBrowserSupport:
        showError(state);
        break;
    }
  }

  const onClientStateChange = (state: DecoderState) => {
    switch (state) {
      case DecoderState.Failed:
        showError(state);
        break;
    }
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
  <modalbg transition:fade="{{duration: 200}}" />
  <modalcontent class:defaultTypography={defaultTypography} class="{position}">
    <main>
      {#if page === PagePriming || page === AudioSourceState.Starting}
        <h2><slot name="priming-title">Allow microphone</slot></h2>
        <p>
          <slot name="priming-body">
            To use voice input, press <strong>Allow</strong> to give {window.location.hostname} access to your microphone.
            Audio is only captured when <span style="display: inline-block; position: relative; color: white; width: 20px; height: 10px; --icon-color: white; --icon-size: 20px;"><MicIcon /></span> button is pressed.
          </slot>
        </p>
        <options>
          <button on:click={closeSelf} class="button button-secondary">Not now</button>
          {#if showAllowButton}
            <button on:click={initialize} class="button button-primary" disabled={page === AudioSourceState.Starting}>Allow</button>
          {/if}
        </options>
      {:else if page === HttpsRequired}
        <h2>HTTPS required</h2>
        <p>
          To use the voice interface, please visit this site using the secure
          HTTPS protocol.
        </p>
        <options>
          <button on:click={closeSelf} class="button button-secondary">Ok, got it</button>
          <button on:click={replaceWithHttps} class="button button-primary">
            Try with HTTPS
          </button>
        </options>
      {:else if page === AudioSourceState.NoAudioConsent}
        <h2>Microphone blocked</h2>
        <p>
          To use voice input, {window.location.hostname} needs access to your microphone. Check your
          browser preferences to allow microphone access and reload the page.
        </p>
        <options>
          <button on:click={closeSelf} class="button button-secondary">Ok, got it</button>
          <button on:click={() => {window.location.reload()}} class="button button-primary">Reload page</button>
        </options>
      {:else if page === AudioSourceState.NoBrowserSupport}
        <h2>Unsupported browser</h2>
        <p>
          To use voice input, please visit this site using a supported browser.
        </p>
        <options>
          <button on:click={closeSelf} class="button button-primary">Ok, got it</button>
        </options>
      {:else}
        <h2>Failed to connect to Speechly</h2>
        <p>
          Please check your internet connection. If the problem persists, please try again later.
        </p>
        <options>
          <button on:click={closeSelf} class="button button-primary">Ok, got it</button>
        </options>
      {/if}
    </main>
    <footer>
      Voice input is automatically transcribed by <a target="_blank" href="https://speechly.com/" rel="noopener noreferrer">Speechly</a> and can be used to improve the quality of service under <a target="_blank" href="https://www.speechly.com/privacy/terms-and-conditions" rel="noopener noreferrer">terms of use</a>.
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

    background-color: rgba(0,0,0,0.75);
    backdrop-filter: blur(3px);
  }

  modalcontent {
    z-index: 2001;
    pointer-events: auto;

    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    padding: 1.5rem;

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

  .defaultTypography {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #fff;
    font-size: 1rem;
    line-height: 1.5;
  }

  .defaultTypography h2 {
    font-family: 'Saira Condensed', sans-serif;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    color: #fff;
    font-size: 1.5rem;
    line-height: 1.25;
  }

  main {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    margin: auto 0;
    padding: 1.5rem 0;
  }

  options {
    display: flex;
    margin-top: 2rem;
    gap: 8px;
  }

  .button {
    background-color: transparent;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    min-width: 7rem;
    padding: 0.5rem 1.5rem;
    transition: all 0.15s ease;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  .button[disabled],
  .button:disabled {
    cursor: auto;
    opacity: 0.5;
    pointer-events: none;
  }

  .button-secondary {
    border-color: #fff;
    color: #fff;
  }

  .button-secondary:hover {
    border-color: #ccc;
    color: #ccc;
  }

  .button-primary {
    background-color: #fff;
    border-color: #fff;
    color: #000;
  }

  .button-primary:hover {
    border-color: #ccc;
    background-color: #ccc;
    color: #000;
  }

  footer {
    box-sizing: border-box;
    font-size: 0.75rem;
    color: #999;
    margin: 0;
  }

  a,
  a:visited {
    color: #999;
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }

  a:hover {
    color: #ccc;
  }
</style>
