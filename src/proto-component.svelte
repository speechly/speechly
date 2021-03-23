<svelte:options tag="proto-component" immutable={true} />

<script lang="ts">
  import { get_current_component } from "svelte/internal";
  import { onMount } from "svelte";

  const thisComponent = get_current_component();
  const dispatchUnbounded = (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true, // propagate across the shadow DOM
    }));
  };

  // Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.

  //dispatchUnbounded("debug", "Hello from proto-component constructor 1");

  const pingHandler = (e) => {
    dispatchUnbounded("debug", "proto-component.ping 1");
  };

  onMount (() => {
    console.log("-------------------------")

    thisComponent.addEventListener("ping", pingHandler);

    return () => {
      thisComponent.removeEventListener("ping", pingHandler);
    }
  });

</script>

<div class="ProtoComponent">
  <div style="color: blue;">proto-component</div>
</div>

<style>
  .ProtoComponent {
    position: relative;
    user-select: none;
  }
</style>
