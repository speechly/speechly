<svelte:options tag="mic-frame" immutable={true} />

<svg
  class="buttonFrameEl"
  viewBox="0 0 92 92"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
  <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
    <stop stop-color="var(--gradient-stop1)" offset="0%" />
    <stop stop-color="var(--gradient-stop2)" offset="100%" />
  </linearGradient>
  </defs>
  <g fill="none" fillRule="nonzero">
  <path
      d="M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
      fill="#FFF"
  />
  <path
      d="M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
      fill="url(#a)"
  />
  </g>
</svg>

<style>
  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    transform: rotate(var(--fx-rotation));
  }
</style>

