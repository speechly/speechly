import el from './call-out.svelte';

if (!customElements.get("call-out")) {
    customElements.define("call-out", el as any as CustomElementConstructor);
} else {
    console.warn("Skipping re-defining customElement call-out")
}
