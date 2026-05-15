// Dog interactivity.
//
// • Light mode: eyes + nose track the cursor via --dog-tx / --dog-ty
//   CSS variables (the actual movement happens in dog.css).
// • Dark mode:  the eyes/nose animations are pure CSS (wake-up, blink,
//   wiggle on hover); no JS needed.
//
// Re-runs after every Astro View Transition so it keeps working when the
// user navigates back to home.

let dogAbortController = null;

function bootstrapDog() {
  // Tear down listeners from any previous run (prevents leaks across
  // View Transitions and avoids handlers touching detached nodes).
  if (dogAbortController) dogAbortController.abort();

  const face = document.getElementById('dog-face');
  if (!face) return;

  const pointerArea = document.querySelector('.intro') || face;
  const features = face.querySelectorAll('[data-feature]');
  if (!features.length) return;

  dogAbortController = new AbortController();
  const { signal } = dogAbortController;

  const strength = { eye: 8, nose: 20 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let rafId = null;
  const pointer = { x: 0, y: 0, active: false };

  const applyTransform = () => {
    rafId = null;
    const rect = face.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = pointer.x - cx;
    let dy = pointer.y - cy;
    if (!pointer.active) {
      dx = 0;
      dy = 0;
    }
    const dist = Math.hypot(dx, dy) || 1;
    dx /= dist;
    dy /= dist;

    features.forEach((el) => {
      const type = el.dataset.feature;
      const max = pointer.active ? (strength[type] ?? 6) : 0;
      const x = clamp(dx * max, -max, max);
      const y = clamp(dy * max, -max, max);
      el.style.setProperty('--dog-tx', `${x}px`);
      el.style.setProperty('--dog-ty', `${y}px`);
    });
  };

  const scheduleUpdate = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(applyTransform);
    }
  };

  pointerArea.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    scheduleUpdate();
  }, { signal });

  pointerArea.addEventListener('pointerleave', () => {
    pointer.active = false;
    scheduleUpdate();
  }, { signal });

  window.addEventListener('resize', scheduleUpdate, { passive: true, signal });
  scheduleUpdate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapDog, { once: true });
} else {
  bootstrapDog();
}
document.addEventListener('astro:after-swap', bootstrapDog);
