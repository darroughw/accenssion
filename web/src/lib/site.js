// Accession Builders homepage: menu overlay + FAQ accordion
(function () {
  const menu = document.getElementById('site-menu');
  const toggle = document.querySelector('.menu-toggle');
  const closeBtn = menu.querySelector('.menu-close');

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  }
  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    toggle.focus();
  }

  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });
  // In-page links inside the menu close it before scrolling.
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) closeMenu();
  });
  // Keep focus inside the open menu.
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = menu.querySelectorAll('a[href], button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Hovering or focusing a discipline expands it (design: "hover/expanded" state).
  const disciplines = menu.querySelectorAll('.discipline');
  disciplines.forEach((d) => {
    const activate = () => disciplines.forEach((o) => o.classList.toggle('is-open', o === d));
    d.addEventListener('mouseenter', activate);
    d.addEventListener('focusin', activate);
  });

  // FAQ accordion
  document.querySelectorAll('.faq-row__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.faq-row');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      row.classList.toggle('is-open', open);
    });
  });
})();
