<svelte:options tag="mic-icon" immutable={true} />

<script>
  import {
    Icon
  } from "../types";

  export let icon = Icon.Mic;
</script>

{#if icon === Icon.Mic}
<svg
  class="buttonIconEl"
  viewBox="0 0 56 56"
  xmlns="http://www.w3.org/2000/svg"
>
  <g fill="#000" fillRule="evenodd">
    <path
      d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
    />
    <rect x="20" y="1" width="16" height="37" rx="8" />
  </g>
</svg>
{/if}

{#if icon === Icon.Error}
<svg class="buttonIconEl" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
  <g fill="#000" fillRule="evenodd">
    <path
      d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
      fillRule="nonzero"
    />
    <path d="M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z" />
  </g>
</svg>
{/if}

{#if icon === Icon.Denied}
<svg class="buttonIconEl" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
  <g fill="#000" fillRule="nonzero">
    <path d="M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z" />
    <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
  </g>
</svg>
{/if}

{#if icon === Icon.Poweron}
<svg class="buttonIconEl" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
  <g fill="#000" fillRule="evenodd">
    <path
      d="M52 28c0 13.255-10.745 24-24 24S4 41.255 4 28c0-8.921 4.867-16.705 12.091-20.842l1.984 3.474C12.055 14.08 8 20.566 8 28c0 11.046 8.954 20 20 20s20-8.954 20-20c0-7.434-4.056-13.92-10.075-17.368L39.91 7.16C47.133 11.296 52 19.079 52 28z"
      fillRule="nonzero"
    />
    <rect x="24" y="1" width="8" height="23" rx="4" />
  </g>
</svg>
{/if}

<style>
  svg {
    position: absolute;
    width: 60%;
    height: 60%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: 0.25s;
  }
</style>
