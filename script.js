/* GSAP Flip driven grid expansion */
(function() {
  const grid = document.querySelector('.feature-grid .grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card'));

  const supportsHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = null;

  function flipFrom(state, opts) {
    if (reduceMotion) return; // instant change when reduced motion
    gsap.registerPlugin(Flip);
    Flip.from(state, Object.assign({
      duration: 0.6,
      ease: 'power2.inOut',
      absolute: true,
      nested: true,
      stagger: 0.004
    }, opts || {}));
  }

  function expandCard(card) {
    if (active === card) return; // already expanded
    const state = !reduceMotion ? Flip.getState([grid, ...cards]) : null; // include grid for class changes
    grid.classList.add('reflow');
    cards.forEach(c => c.classList.toggle('is-expanded', c === card));
    active = card;
    cards.forEach(c => c.setAttribute('aria-expanded', c === card ? 'true' : 'false'));
    flipFrom(state);
  }

  function collapse() {
    if (!active) return;
    const state = !reduceMotion ? Flip.getState([grid, ...cards]) : null;
    grid.classList.remove('reflow');
    cards.forEach(c => c.classList.remove('is-expanded'));
    cards.forEach(c => c.setAttribute('aria-expanded', 'false'));
    active = null;
    flipFrom(state, { duration: 0.5 });
  }

  // Hover/focus interactions
  if (supportsHover) {
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => expandCard(card));
      card.addEventListener('focusin', () => expandCard(card));
    });
    grid.addEventListener('mouseleave', collapse);
  }

  // Touch/click toggle (one at a time)
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (active === card) collapse(); else expandCard(card);
  });

  // Keyboard escape to collapse
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') collapse();
  });
})(); 