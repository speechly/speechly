import el from './intro-popup.svelte';

if (!customElements.get("intro-popup")) {
    customElements.define("intro-popup", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement intro-popup")
}
