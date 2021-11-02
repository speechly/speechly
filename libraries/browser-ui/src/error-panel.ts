import el from './error-panel.svelte';

if (!customElements.get("error-panel")) {
  customElements.define("error-panel", el as any as CustomElementConstructor);
} else {
  console.warn("Skipping re-defining customElement error-panel")
}
