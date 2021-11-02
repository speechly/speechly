import el from './transcript-drawer.svelte';

if (!customElements.get("transcript-drawer")) {
    customElements.define("transcript-drawer", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement transcript-drawer")
}