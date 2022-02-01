import el from './usage-overlay.svelte';

if (!customElements.get("usage-overlay")) {
    customElements.define("usage-overlay", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement usage-overlay")
}
