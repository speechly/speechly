import { get_current_component } from "svelte/internal";
// Prepare a dispatchUnbounded function to communicate outside shadow DOM box. Svelte native dispatchUnbounded won't do that.
export const createDispatchUnbounded = () => {
  const thisComponent = get_current_component();
  return (name: string, detail?: {}) => {
    thisComponent.dispatchEvent(
      new CustomEvent(name, {
        detail,
        composed: true, // propagate across the shadow DOM
      })
    );
  };
};
