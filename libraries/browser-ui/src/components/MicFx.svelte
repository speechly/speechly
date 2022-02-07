<svg
  class="Fx"
  viewBox="0 0 246 246"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient x1="50%" y1="10%" x2="50%" y2="100%" id="a">
      <stop stop-color="var(--fx-gradient-stop1)" offset="0%" />
      <stop stop-color="var(--fx-gradient-stop2)" offset="100%" />
    </linearGradient>
    <filter
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
      filterUnits="objectBoundingBox"
      id="b"
    >
      <feGaussianBlur stdDeviation="18" in="SourceGraphic" />
    </filter>
  </defs>
  <circle
    filter="url(#b)"
    cx="124"
    cy="124"
    r="79"
    fill="url(#a)"
    fillRule="evenodd"
  />
</svg>

<style>
  .Fx {
    position: absolute;
    width: var(--fx-size);
    height: var(--fx-size);
    top: 50%;
    left: 50%;
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%) rotate(var(--fx-rotation));
    pointer-events: none;
    opacity: var(--fx-opacity);
  }
</style>