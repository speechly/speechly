<svelte:options tag={null} immutable={true} />

<script lang="ts">
  import { ClientState, MessageType } from "./constants";  // Re-exported from @speechl./fixTransitionclient. See types.ts for explanation.

  const InvaldAppId = 'InvaldAppId'
  const HttpsRequired = 'HttpsRequired'

  export let placement = null;

  const isLocalHost = (hostname: string): boolean =>
    !!(
      hostname === 'localhost' ||
      hostname === '[::1]' ||
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    )

  /**
   * An optional dismissable component that renders an error message if something
   * prevents Speechly SDK from functioning. It also provides recovery instructions.
   * Error Panel responds to Push-To-Talk Button presses via window.message
   *
   * @public
   */

  let visible: ClientState | string = null;

  const handleMessage = (e) => {
    switch (e.data.type) {
      case MessageType.holdstart:
        micButtonPressed(e.data.state);
        break;
      default:
        break;
    }
  }

  const micButtonPressed = (state: ClientState) => {
    switch (state) {
      case ClientState.Failed:
        visible = InvaldAppId;
        break
      case ClientState.NoAudioConsent:
      case ClientState.NoBrowserSupport:
        // Provide special instructions for non-https access
        if (
          window?.location?.protocol !== 'https:' &&
          !isLocalHost(window.location.hostname)
        ) {
          visible = HttpsRequired;
          break
        }
        visible = state;
        break
      default:
        break
    }
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window
  on:message={handleMessage}
/>

<main class:bottom={placement === "bottom"}>
  {#if visible}
    <errorDiv>
      <errorLeft on:click={() => {visible = null}}>
        &times;
      </errorLeft>
      
      {#if visible === InvaldAppId}
        <errorRight>
          <h1>Failed to connect Speechly</h1>
          <p>
            Please check that Speechly application id has been successfully deployed.
          </p>
          <p>
            <a href="https://docs.speechly.com/faq/#error-invalid-app-id">
              Troubleshooting
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href={window.location.href}>Reload</a>
          </p>
        </errorRight>
      {/if}
      {#if visible === ClientState.NoAudioConsent}
        <errorRight>
          <h1>No Mic Permission</h1>
          <p>
            To use the voice interface, please allow your web browser access the
            microphone and reload.
          </p>
          <p>
            <a href="https://docs.speechly.com/faq/#error-no-audio-consent">
              Troubleshooting
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href={window.location.href}>Reload</a>
          </p>
        </errorRight>
      {/if}
      {#if visible === ClientState.NoBrowserSupport}
        <errorRight>
          <h1>Unsupported Browser</h1>
          <p>
            To use the voice interface, please visit this site using a supported
            browser.
          </p>
          <p>
            <a href="https://docs.speechly.com/client-libraries/supported-browsers/#error-no-browser-support">
              Troubleshooting
            </a>
          </p>
        </errorRight>
      {/if}
      {#if visible === HttpsRequired}
        <errorRight>
          <h1>HTTPS Required</h1>
          <p>
            To use the voice interface, please visit this site using the secure
            https:// protocol.
          </p>
          <p>
            <a href="https://docs.speechly.com/faq/#error-https-required">
              Troubleshooting
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href={window.location.href.replace(/^http(?!s)/, 'https')}>
              Try with HTTPS
            </a>
          </p>
        </errorRight>
      {/if}
    </errorDiv>
  {/if}
</main>

<style>
  main.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 10em;
    z-index: 51;
    user-select: none;
    pointer-events: none;
  }

  errorDiv {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    min-height: 10em;
    background-color: white;
    user-select: text;
    pointer-events: all;
    color: black;
    display: flex;
    box-shadow: 0 0 8px #00000040;
    flex-direction: row;
  }

  errorLeft {
    box-sizing: border-box;
    width: 2rem;
    background-color: red;
    padding: 0.2rem 0.2rem;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    font-size: 1.5rem;
    cursor: pointer;
  }

  errorRight {
    background-color: white;
    padding: 1rem 3rem 1rem 1rem;
    overflow: auto;
    flex-grow: 1;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
    padding: 0 0 0.5rem 0;
    font-family: 'Saira Condensed', sans-serif;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    padding: 0 0 0.5rem 0;
    color: #999;
  }

  a {
    color: #000;
  }

</style>