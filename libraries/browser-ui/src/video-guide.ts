import el from './video-guide.svelte';

if (!customElements.get("video-guide")) {
    customElements.define("video-guide", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement video-guide")
}
