/* Section reveal — fade-up animation when blocks scroll into view.
 *
 * Currently targets `.about-section` on the About page. Could be extended to
 * other selectors later.
 *
 * Defensive design (lesson from the earlier mobile rendering bug):
 *   - The hidden initial state is gated by `html.js-ready` (set synchronously
 *     by an inline script in BaseLayout before first paint). Users with JS
 *     fully disabled never see the hidden state — all content renders normally.
 *   - On init, elements already in the viewport are revealed immediately with
 *     a small stagger; we never trust IntersectionObserver alone to handle
 *     "already-visible" cases.
 *   - Respects `prefers-reduced-motion: reduce` — animation skipped, all
 *     blocks revealed at once.
 */
(function () {
  const SELECTOR = '.about-section';
  const STAGGER_MS = 180; // delay between blocks already in viewport on init

  function reveal(el) {
    if (el.classList.contains('in-view')) return;
    el.classList.add('in-view');
  }

  function initReveal() {
    const targets = document.querySelectorAll(SELECTOR);
    if (targets.length === 0) return;

    // Reduced motion: skip the animation, just reveal everything.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(reveal);
      return;
    }

    const inViewElements = [];
    const offscreenElements = [];

    targets.forEach((el) => {
      if (el.classList.contains('in-view')) return; // already revealed (re-init case)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        inViewElements.push(el);
      } else {
        offscreenElements.push(el);
      }
    });

    // Stagger-reveal blocks already in the viewport on init.
    inViewElements.forEach((el, idx) => {
      setTimeout(() => reveal(el), idx * STAGGER_MS);
    });

    // IntersectionObserver for offscreen blocks; safety fallback if unsupported.
    if (typeof IntersectionObserver === 'undefined') {
      offscreenElements.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    offscreenElements.forEach((el) => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal, { once: true });
  } else {
    initReveal();
  }

  // Re-run after Astro View Transition swap.
  document.addEventListener('astro:after-swap', initReveal);
})();
