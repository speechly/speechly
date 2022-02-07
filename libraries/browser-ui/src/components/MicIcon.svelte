<script lang="ts">
  import {
    Icon
  } from "../constants";

  export let icon: Icon = Icon.Mic;
</script>

{#if icon === Icon.MicActive}
<svg
  class="Icon"
  viewBox="0 0 56 56"
  xmlns="http://www.w3.org/2000/svg"
>
  <linearGradient id="gradient" x1="50%" y1="-200%" x2="50%" y2="200%">
    <animate attributeName="y1" values="-200%; 0%;" dur="2s" repeatCount="indefinite" />
    <animate attributeName="y2" values="200%; 400%;" dur="2s" repeatCount="indefinite" />
    <stop offset="0%" stop-color="var(--gradient-stop1)"></stop>
    <stop offset="25%" stop-color="var(--gradient-stop2)"></stop>
    <stop offset="50%" stop-color="var(--gradient-stop1)"></stop>
    <stop offset="75%" stop-color="var(--gradient-stop2)"></stop>
    <stop offset="100%" stop-color="var(--gradient-stop1)"></stop>
  </linearGradient>>
  <g fill="url(#gradient)" fill-rule="evenodd">
    <path
      d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
    />
    <rect x="20" y="1" width="16" height="37" rx="8" />
  </g>
</svg>
{/if}

{#if icon === Icon.Mic}
<svg
  class="Icon"
  viewBox="0 0 56 56"
  xmlns="http://www.w3.org/2000/svg"
>
  <g fill="var(--icon-color)" fill-rule="evenodd">
    <path
      d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
    />
    <rect x="20" y="1" width="16" height="37" rx="8" />
  </g>
</svg>
{/if}

{#if icon === Icon.Error}
<svg class="Icon" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--icon-color)" fill-rule="evenodd">
    <path
      d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
      fill-rule="nonzero"
    />
    <path d="M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z" />
  </g>
</svg>
{/if}

{#if icon === Icon.Denied}
<svg class="Icon" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--icon-color)" fill-rule="nonzero">
    <path d="M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z" />
    <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
  </g>
</svg>
{/if}

<style>
  .Icon {
    position: absolute;
    width: var(--icon-size);
    height: var(--icon-size);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: 0.25s;
    opacity: var(--icon-opacity);
  }

</style>