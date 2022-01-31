<svg
  class="buttonFrameEl"
  viewBox="0 0 92 92"
  xmlns="http://www.w3.org/2000/svg"
  style="
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    transform: rotate(var(--fx-rotation));
  "
>
  <defs>
  <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
    <stop stop-color="var(--gradient-stop1)" offset="0%" />
    <stop stop-color="var(--gradient-stop2)" offset="100%" />
  </linearGradient>
  </defs>
  <circle cx="46" cy="46" style="r: var(--frame-radius)" stroke="none" fill="var(--frame-background)"/>
  <circle cx="46" cy="46" style="r: var(--frame-radius)" stroke="url(#a)" stroke-width="var(--frame-stroke-width)" fill="none"/>
</svg>
