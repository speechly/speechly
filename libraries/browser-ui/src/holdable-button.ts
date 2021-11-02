import el from './holdable-button.svelte';

if (!customElements.get("holdable-button")) {
    customElements.define("holdable-button", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement holdable-button")
}
