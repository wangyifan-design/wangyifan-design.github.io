/* Scramble / glitch animation for headings.
 *
 * Targets: every <h1> and <h2> inside <main>. Skip with class="no-scramble"
 * or data-no-scramble.
 *
 * Behavior:
 *   - <h1>: scrambles immediately on page load (and on Astro View Transition swap).
 *   - <h2>: scrambles when scrolled into view (IntersectionObserver), once only.
 *
 * Robustness:
 *   - Default state is the real text. If JS or IO fails, headings still show
 *     correctly — they just won't animate. (Lesson from the earlier mobile bug
 *     where opacity:0 + reveal-on-scroll hid content when the observer didn't
 *     fire.)
 *   - Respects prefers-reduced-motion: reduce (skips animation entirely).
 *   - Marks animated elements with data-scrambled="true" so re-init calls are
 *     no-ops.
 */
(function () {
  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+=<>?/|~^';

  // Tuning knobs.
  const PER_CHAR_REVEAL_MS = 35;   // delay between when char N and char N+1 lock in
  const SHUFFLE_INTERVAL = 50;     // ms between re-rolling the still-scrambled chars
  const TAIL_PADDING_MS = 80;      // extra time after the last char locks (smoother end)
  const STAGGER_BETWEEN_H1S = 120; // if multiple headings are immediately visible

  function randomChar() {
    return POOL[Math.floor(Math.random() * POOL.length)];
  }

  function scramble(el) {
    if (el.dataset.scrambled === 'true') return;
    el.dataset.scrambled = 'true';

    // Capture original text once. Array.from to be safe with surrogate pairs.
    const original = el.textContent;
    const chars = Array.from(original);
    if (chars.length === 0) return;

    const start = performance.now();
    let lastShuffle = start;
    let scrambled = chars.map(() => randomChar());

    function frame(now) {
      const elapsed = now - start;

      // Periodically re-roll the still-scrambled positions for a cleaner glitch.
      if (now - lastShuffle > SHUFFLE_INTERVAL) {
        scrambled = scrambled.map(() => randomChar());
        lastShuffle = now;
      }

      let out = '';
      let done = true;
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        // Don't shuffle whitespace — keeps word boundaries readable.
        if (/\s/.test(c)) {
          out += c;
          continue;
        }
        const revealAt = i * PER_CHAR_REVEAL_MS;
        if (elapsed >= revealAt + TAIL_PADDING_MS) {
          out += c;
        } else {
          out += scrambled[i];
          done = false;
        }
      }

      el.textContent = out;
      if (!done) {
        requestAnimationFrame(frame);
      } else {
        // Snap to the exact original (textContent could have drifted if any
        // weird unicode normalization happened).
        el.textContent = original;
      }
    }

    requestAnimationFrame(frame);
  }

  function initScramble() {
    // Respect user preference.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rawTargets = document.querySelectorAll(
      'main h1:not([data-no-scramble]):not(.no-scramble),' +
      'main h2:not([data-no-scramble]):not(.no-scramble)'
    );
    // Exclude h2 headings inside MDX-rendered project content — those come
    // from `##` in markdown and can't easily be given a class; skip wholesale.
    const targets = Array.from(rawTargets).filter((el) => {
      if (el.tagName === 'H2' && el.closest('.project-content')) return false;
      return true;
    });
    if (targets.length === 0) return;

    let immediateDelay = 0;

    targets.forEach((el) => {
      if (el.dataset.scrambled === 'true') return;

      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      // h1 → always fire on load. h2 already in viewport on load → also fire.
      // h2 below the fold → wait for IntersectionObserver.
      if (el.tagName === 'H1' || inViewport) {
        const delay = immediateDelay;
        immediateDelay += STAGGER_BETWEEN_H1S;
        setTimeout(() => scramble(el), delay);
        return;
      }

      // Lazy trigger for off-screen h2s.
      if (typeof IntersectionObserver === 'undefined') {
        scramble(el);
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              scramble(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -15% 0px', threshold: 0.2 }
      );
      io.observe(el);
    });
  }

  // First load.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScramble, { once: true });
  } else {
    initScramble();
  }

  // Re-run after Astro View Transition swap (new document → fresh headings
  // without data-scrambled, so they animate from scratch).
  document.addEventListener('astro:after-swap', initScramble);
})();
