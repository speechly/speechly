<svelte:options tag="push-to-talk-button" immutable={true} />

<script lang="ts">
  import { Client, ClientState, Segment } from "@speechly/browser-client";
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import "./holdable-button.svelte";
  import "./components/mic-frame.svelte";
  import "./components/mic-icon.svelte";
  import "./components/mic-fx.svelte";

  export let appid: string = undefined;
  export let size = "6rem";
  export let icon: ClientState = ClientState.Disconnected;
  export let capturekey = " ";
  export let gradientstop1 = "#15e8b5";
  export let gradientstop2 = "#4fa1f9";
  export let hide = undefined;
  export let placement = undefined;

  let client = null;
  let clientState: ClientState = undefined;

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
  const thisComponent = get_current_component();
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(
      new CustomEvent(name, {
        detail,
        composed: true, // propagate across the shadow DOM
      })
    );
  };

  onMount(() => {
    // Transition in button
    if (appid) {
      console.log("Create client with appId", appid);
      client = new Client({
        appId: appid,
      });

      client.onStateChange(onStateChange);

      client.onSegmentChange((segment: Segment) => {
        // Pass on segment updates from Speechly API as events
        dispatchUnbounded("speechsegment", segment);
        // And as window.postMessages
        window.postMessage({ type: "speechsegment", segment: segment }, "*");
      });
    } else {
      console.warn(
        "No appid attribute specified. Speechly voice services are unavailable."
      );
    }
  });

  const initializeSpeechly = async () => {
    // Create a new Client. appid and language are configured in the dashboard.

    // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
    // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
    (async () => {
      try {
        console.log("Initializing...", client);
        await client.initialize();
        console.log("Initialized");
      } catch (e) {
        console.log("Initialization failed", e);
        client = null;
      }
    })();
  };

  const tangentStart = (event) => {
    if (client) {
      // Connect on 1st press
      if (isConnectable(clientState)) {
        if (appid) initializeSpeechly();
      } else {
        if (isStartable(clientState)) {
          client.startContext();
        }
      }
    }
  };

  const tangentEnd = () => {
    if (client) {
      if (isStoppable(clientState)) {
        client.stopContext();
      }
    }

    updateSkin();
  };

  const updateSkin = () => {
    switch (clientState) {
      case ClientState.Failed:
        dispatchUnbounded("error", { status: "Failed" });
        break;
      case ClientState.NoBrowserSupport:
        dispatchUnbounded("error", { status: "NoBrowserSupport" });
        break;
      case ClientState.NoAudioConsent:
        dispatchUnbounded("error", { status: "NoAudioConsent" });
        break;
      default:
        break;
    }
    icon = clientState;
  };

  const isConnectable = (clientState?: ClientState) => {
    if (!clientState) return true;
    return clientState === ClientState.Disconnected;
  };

  const isStartable = (clientState: ClientState) =>
    clientState === ClientState.Connected;

  const isStoppable = (s: ClientState) => {
    switch (s) {
      case ClientState.Starting:
      case ClientState.Recording:
      case ClientState.Stopping:
        return true;
      default:
        return false;
    }
  };

  const onStateChange = (s: ClientState) => {
    clientState = s;
    updateSkin();
  };
</script>

{#if placement === "bottom"}
  <main>
    <holdable-button
      on:holdstart={tangentStart}
      on:holdend={tangentEnd}
      {size}
      {icon}
      {capturekey}
      {gradientstop1}
      {gradientstop2}
      {hide}
    />
  </main>
{:else}
  <holdable-button
    on:holdstart={tangentStart}
    on:holdend={tangentEnd}
    {size}
    {icon}
    {capturekey}
    {gradientstop1}
    {gradientstop2}
    {hide}
  />
{/if}

<style>
  main {
    width: 100vw;
    height: 9.2rem;
    position: fixed;
    bottom: 0;
    pointer-events: none;

    display: flex;
    flex-direction: row;
    justify-content: center;
    z-index: 50;
  }
</style>
