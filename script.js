(() => {
  const overlay = document.getElementById('privacy');
  const link = document.getElementById('privacy-link');
  if (!overlay || !link) return;
  const close = overlay.querySelector('.privacy-close');
  const open = (e) => { e.preventDefault(); overlay.hidden = false; document.body.style.overflow = 'hidden'; close.focus(); };
  const shut = () => { overlay.hidden = true; document.body.style.overflow = ''; link.focus(); };
  link.addEventListener('click', open);
  close.addEventListener('click', shut);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) shut(); });
})();

/* ══════════════════════════════════════════════════════════════
   ПУТЬ ИДЕИ · интенсив 25 августа, Сколково

   Заявки принимаются напрямую в Telegram, поэтому формы на сайте нет.
   Ссылка на Telegram (профиль @wernigor) прописана в index.html
   в двух кнопках — в хедере и в финальном блоке «Записаться».
   Если профиль изменится, поменяйте её поиском по строке t.me
   ══════════════════════════════════════════════════════════════ */

/* класс .js ставится в <head> — до первой отрисовки, чтобы блоки не мигали */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ───────── Хедер: линия после скролла + инверсия над тёмными блоками ───────── */
(() => {
  const header = $('.site-header');
  if (!header) return;

  const darkZones = $$('.section--dark, .shot');
  let ticking = false;

  const update = () => {
    ticking = false;
    header.classList.toggle('is-stuck', window.scrollY > 24);

    const line = header.offsetHeight * 0.6;   // «линия взгляда» внутри хедера
    const overDark = darkZones.some((zone) => {
      const r = zone.getBoundingClientRect();
      return r.top <= line && r.bottom >= line;
    });
    header.classList.toggle('is-inverted', overDark);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();


/* ───────── Появление блоков при скролле ───────── */
(() => {
  const items = $$('.reveal');
  if (!items.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children).filter(n => n.classList.contains('reveal'));
      const order = Math.max(0, siblings.indexOf(entry.target));
      entry.target.style.transitionDelay = Math.min(order, 6) * 60 + 'ms';
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  items.forEach(el => io.observe(el));
})();


/* ───────── Линия таймлайна заполняется по мере чтения ───────── */
(() => {
  const timeline = $('.js-timeline');
  const fill = $('.js-timeline-fill');
  if (!timeline || !fill || reduceMotion) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.62;          // «точка чтения» на экране
    const progress = (anchor - rect.top) / rect.height;
    fill.style.transform = 'scaleY(' + Math.min(1, Math.max(0, progress)).toFixed(4) + ')';
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
