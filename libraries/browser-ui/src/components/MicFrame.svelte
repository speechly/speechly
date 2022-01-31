<script>
  export let frameRadius = 46;
</script>
<svg
  class="Frame"
  viewBox="0 0 92 92"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
  <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
    <stop stop-color="var(--gradient-stop1)" offset="0%" />
    <stop stop-color="var(--gradient-stop2)" offset="100%" />
  </linearGradient>
  </defs>
  <circle cx="46" cy="46" r="{frameRadius}" stroke="none" fill="var(--frame-background)"/>
  <circle cx="46" cy="46" r="{frameRadius}" stroke="url(#a)" stroke-width="var(--frame-stroke-width)" fill="none"/>
</svg>

<style>
.Frame {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: translate(-50%, -50%) rotate(var(--fx-rotation));
  transition: width 0.1s, height 0.1s;
  pointer-events: none;
  user-select: none;
}

</style>