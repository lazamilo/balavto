(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!window.gsap;
  root.classList.add(hasGsap ? 'js' : 'no-js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ---------- smooth scroll ----------
  let lenis = null;
  if (hasGsap && window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' });
  }));

  // ---------- nav ----------
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('.nav__burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  const mega = $('.has-mega');
  mega.querySelector('.nav__link').addEventListener('click', () => mega.classList.toggle('open'));
  document.addEventListener('click', e => { if (!mega.contains(e.target)) mega.classList.remove('open'); });

  // ---------- brand switcher ----------
  const brands = [
    ['Volvo', 'Vodilni mednarodni proizvajalec vrhunske gradbene mehanizacije. Bagri, kolesni nakladalniki in knikasti demperji, tudi po meri.'],
    ['McCloskey', 'Celovite rešitve za drobljenje, sejanje in recikliranje materialov. Od leta 1985 med največjimi proizvajalci mobilne opreme na svetu.'],
    ['Soilmec', 'Vodilno mednarodno podjetje na področju oblikovanja, proizvodnje in distribucije opreme za zemeljsko inženirstvo.'],
    ['Lännen', 'Pametne in mobilne večnamenske rešitve za težke pogoje z rovokopači Lännen 8600M, 8700M in 8800M.'],
    ['DandA', 'Zanesljiva hidravlična kladiva za bagre vseh velikosti. Sistem Silenced za tišje delo in lastna patentirana tehnologija.'],
    ['BAT', 'Moč, vzdržljivost in zanesljivost po ugodni ceni. Na voljo s centralnim mazanjem, števcem ur in priklopno ploščo za vaš bager.']
  ];
  const accs = $$('.acc'), sms = $$('.sm');
  const t = $('[data-k="t"]'), d = $('[data-k="d"]');
  const setBrand = i => {
    accs.forEach((a, k) => a.classList.toggle('is-active', k === i));
    sms.forEach((s, k) => s.classList.toggle('is-on', k === i));
    const txt = $('.showcase__txt');
    if (hasGsap && !reduce) {
      gsap.to(txt, { opacity: 0, y: 8, duration: .18, onComplete() {
        t.textContent = brands[i][0]; d.textContent = brands[i][1];
        gsap.to(txt, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' });
      } });
    } else { t.textContent = brands[i][0]; d.textContent = brands[i][1]; }
  };
  accs.forEach((a, i) => a.addEventListener('click', () => setBrand(i)));
  $$('[data-brand]').forEach(a => a.addEventListener('click', () => setBrand(+a.dataset.brand)));

  // ---------- market tabs ----------
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('is-active', x === tab));
    const f = tab.dataset.f;
    $$('.trow:not(.trow--head)').forEach(r => r.classList.toggle('is-hidden', f !== 'all' && !r.dataset.c.split(' ').includes(f)));
    if (hasGsap && !reduce) gsap.fromTo('.trow:not(.trow--head):not(.is-hidden)', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: .05, duration: .45, ease: 'power3.out' });
  }));

  // ---------- segmented controls + forms ----------
  $$('.seg').forEach(seg => seg.addEventListener('click', e => {
    const b = e.target.closest('.seg__b'); if (!b) return;
    $$('.seg__b', seg).forEach(x => x.classList.toggle('is-on', x === b));
  }));
  $$('#quote, #inq').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('is-sent'); }));

  // ---------- transport country chips ----------
  const cs = $$('.countries li');
  let ci = 0;
  if (!reduce) setInterval(() => { cs.forEach((c, k) => c.classList.toggle('on', k <= ci)); ci = (ci + 1) % (cs.length + 3); }, 420);
  else cs.forEach(c => c.classList.add('on'));

  // ---------- counters ----------
  const runCount = el => {
    const to = +el.dataset.to;
    if (!hasGsap || reduce) { el.textContent = to; return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) });
  };

  if (!hasGsap) { $$('.count').forEach(runCount); return; }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- loader + hero intro ----------
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  if (reduce) { $('.loader').remove(); }
  else {
    intro
      .to('.loader__logo img', { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut' })
      .to('.loader__bar span', { scaleX: 1, duration: .9, ease: 'power3.inOut' }, '<')
      .to('.loader', { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '+=.15')
      .add(() => $('.loader').remove())
      .from('.hero .line>span', { yPercent: 110, duration: 1.2, stagger: .08 }, '-=.45')
      .to('.hero .rv', { opacity: 1, y: 0, duration: 1, stagger: .08 }, '-=.9')
      .from('.hero__frame', { clipPath: 'inset(12% 6% 0 6% round 28px)', duration: 1.4 }, '-=1')
      .from('.fcard', { y: 40, opacity: 0, duration: 1, stagger: .12 }, '-=.9')
      .to('.fcard--parts .bar span', { scaleX: .66, duration: 1.6, ease: 'power2.inOut' }, '-=.4')
      .add(() => $$('.hero .count').forEach(runCount), '-=1.4');
  }

  if (reduce) { $$('.count').forEach(runCount); return; }

  // hero parallax
  gsap.to('.hero__img', { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 80%', end: 'bottom top', scrub: true } });
  gsap.to('.fcard--machine', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 40%', end: 'bottom top', scrub: true } });
  gsap.to('.fcard--parts', { y: 40, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 40%', end: 'bottom top', scrub: true } });

  // section line reveals
  $$('.split').forEach(h => {
    if (h.closest('.hero')) return;
    gsap.from($$('.line>span', h), { yPercent: 110, duration: 1.1, stagger: .08, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  $$('.rv').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.count').forEach(el => { if (!el.closest('.hero')) ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => runCount(el) }); });

  // refurb steps
  const steps = $$('.rstep'), rms = $$('.rm'), meter = $('.refurb__meter span');
  steps.forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 60%', end: 'bottom 60%',
    onToggle: self => { if (!self.isActive) return;
      steps.forEach((x, k) => x.classList.toggle('is-on', k === i));
      rms.forEach((x, k) => x.classList.toggle('is-on', k === i));
      meter.style.transform = `scaleX(${(i + 1) / steps.length})`;
    }
  }));

  // bento stagger + mini parallax
  gsap.from('.tile__vis--grid span', { scale: 0, duration: .6, stagger: { each: .04, from: 'random' }, ease: 'back.out(2)', scrollTrigger: { trigger: '.tile--make', start: 'top 80%' } });
  gsap.fromTo('.tile--service img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.tile--service', start: 'top bottom', end: 'bottom top', scrub: true } });

  // B-Quick: product drifts in, pins pop
  gsap.from('.bq__img', { x: 120, rotate: -6, opacity: 0, duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: '.bq', start: 'top 70%' } });
  gsap.from('.pin', { scale: .6, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(2)', scrollTrigger: { trigger: '.bq__stage', start: 'top 60%' } });

  // transport parallax
  gsap.fromTo('.transport__img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.transport', start: 'top bottom', end: 'bottom top', scrub: true } });

  // footer wordmark rise
  gsap.from('.foot__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.foot__word', start: 'top 95%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
