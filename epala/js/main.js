/* Elisabetta Pala — interazioni del concept.
   Script classico (funziona anche aprendo index.html da file://). */
(function () {
  'use strict';

  const { categories } = window.EP_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const canEmbed = location.protocol !== 'file:';   // YouTube non si incorpora da file://
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ------------------------------------------------------------------
     Diaframma: 7 lamelle sopra la pagina. Ogni lamella è un grande
     rettangolo ruotato attorno al centro del foro; il suo bordo sinistro è
     il bordo della lamella. Si anima solo "transform" (ruota + trasla), quindi
     l'animazione gira sulla GPU ed è fluida. Ogni lamella sta sopra la successiva:
     da qui il disegno a girandola, con il riflesso lungo i bordi.
     ------------------------------------------------------------------ */
  const shutter = (() => {
    const BLADES = 7, STEP = 360 / BLADES;
    const ROT_OPEN = -30, ROT_CLOSED = -100;  // gradi: le lamelle ruotano chiudendosi
    const box = document.createElement('div');
    box.className = 'shutter';
    box.setAttribute('aria-hidden', 'true');
    const blades = Array.from({ length: BLADES }, (_, i) => {
      const b = document.createElement('i');
      b.style.zIndex = BLADES - i;
      box.appendChild(b);
      return b;
    });
    document.body.appendChild(box);

    let rMax = 0;
    const set = (r, rot, ms) => blades.forEach((b, i) => {
      b.style.transitionDuration = `${ms}ms`;
      b.style.transform = `rotate(${rot + i * STEP}deg) translateX(${r}px)`;
    });
    const wait = (ms) => new Promise((res) => setTimeout(res, ms + 20));
    return {
      close({ x = innerWidth / 2, y = innerHeight / 2, duration = 420 } = {}) {
        if (reduceMotion) return Promise.resolve();
        rMax = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 8;
        box.style.setProperty('--cx', `${x}px`);
        box.style.setProperty('--cy', `${y}px`);
        box.style.setProperty('--ease', 'cubic-bezier(.5, 0, .75, 0)');
        set(rMax, ROT_OPEN, 0);
        box.classList.add('is-active');
        box.getBoundingClientRect();              // applica lo stato iniziale prima della transizione
        set(-2, ROT_CLOSED, duration);
        return wait(duration);
      },
      open({ duration = 760 } = {}) {
        if (reduceMotion) return Promise.resolve();
        box.style.setProperty('--ease', 'cubic-bezier(.25, 1, .5, 1)');
        set(rMax, ROT_OPEN, duration);
        return wait(duration).then(() => box.classList.remove('is-active'));
      },
    };
  })();

  /* ------------------------------------------------------------------
     HERO: una stampa Polaroid per categoria. Cadono sul tavolo, si
     sviluppano, e al passaggio del mouse si raddrizzano e si ingrandiscono.
     ------------------------------------------------------------------ */
  const ROT = [-5, 3, -2, 6, -4, 2, -6, 4];
  const LIFT = [8, -10, 14, -4, 10, -12, 6, -6];
  const prints = $('#prints');
  prints.innerHTML = categories.map((c, i) => `
    <li><button class="print" style="--i:${i};--r:${ROT[i % 8]}deg;--y:${LIFT[i % 8]}px"
        data-i="${i}" data-af="${c.title}"
        aria-label="Apri la galleria ${c.title}">
      <img src="${c.cover.thumb}" alt="" draggable="false">
      <span class="print__cap">${c.title}</span>
    </button></li>`).join('');
  $$('.print', prints).forEach((b) => b.addEventListener('click', (e) => {
    openGallery(+b.dataset.i, e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
  }));
  // le stampe "cadono" appena le immagini sono pronte (o dopo 1.5s al massimo)
  const firstImgs = $$('img', prints).map((im) => (im.decode ? im.decode().catch(() => {}) : null));
  Promise.race([Promise.all(firstImgs), new Promise((r) => setTimeout(r, 1500))]).then(() => {
    requestAnimationFrame(() => prints.classList.add('in'));
    setTimeout(() => prints.classList.add('settled'), 1650);
  });

  /* ------------------------------------------------------------------
     Scroll morbido per i link interni, con la curva "ease-in-out" di Apple
     (CAMediaTimingFunction: 0.42, 0, 0.58, 1). La durata cresce con la
     distanza (0.9–1.6s), più lenta dello smooth scroll nativo del browser.
     Rotella o tocco interrompono l'animazione.
     ------------------------------------------------------------------ */
  function cubicBezier(x1, y1, x2, y2) {
    const bx = (t) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
    const by = (t) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
    return (x) => {
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; }
      return by(t);
    };
  }
  const appleEase = cubicBezier(.42, 0, .58, 1);
  let scrollAnim = 0;
  const stopScroll = () => cancelAnimationFrame(scrollAnim);
  addEventListener('wheel', stopScroll, { passive: true });
  addEventListener('touchstart', stopScroll, { passive: true });

  function smoothScrollTo(y) {
    stopScroll();
    const from = scrollY;
    const to = clamp(y, 0, document.documentElement.scrollHeight - innerHeight);
    const dist = Math.abs(to - from);
    if (reduceMotion || dist < 2) { scrollTo(0, to); return; }
    const duration = clamp(900 + dist * .18, 900, 1600);
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      scrollTo(0, from + (to - from) * appleEase(k));
      if (k < 1) scrollAnim = requestAnimationFrame(step);
    };
    scrollAnim = requestAnimationFrame(step);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target && id !== 'top') return;
    e.preventDefault();
    const y = target ? target.getBoundingClientRect().top + scrollY : 0;
    smoothScrollTo(y);
    history.pushState(null, '', '#' + (id || 'top'));
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  /* ------------------------------------------------------------------
     NAV: tema chiaro/scuro in base alla sezione sotto la barra
     ------------------------------------------------------------------ */
  const nav = $('#nav');
  const heroEl = $('#hero');
  const badge = $('#concept-badge');
  const themed = $$('[data-theme]').filter((el) => el !== nav);
  function updateNav() {
    nav.classList.toggle('is-scrolled', scrollY > 40);
    // il badge "concept" compare solo dopo l'hero, per non coprire l'HUD
    badge.classList.toggle('is-hidden', heroEl.getBoundingClientRect().bottom > innerHeight * .9);
    const y = nav.offsetHeight / 2;
    for (const sec of themed) {
      const r = sec.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { nav.dataset.theme = sec.dataset.theme; break; }
    }
  }
  addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  const burger = $('.nav__burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    menu.hidden = !open;
    if (open) nav.dataset.theme = 'dark'; else updateNav();
    document.documentElement.style.overflow = open ? 'hidden' : '';
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => burger.click()));

  /* ------------------------------------------------------------------
     Reveal + "sviluppo" delle immagini all'ingresso nel viewport
     ------------------------------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .develop, .polaroids, .timeline, .footer__sig').forEach((el) => io.observe(el));
  // la firma in alto si scrive da sola appena la pagina è pronta
  const navLogo = $('.nav__logo');
  const writeLogo = () => setTimeout(() => navLogo.classList.add('in'), 250);
  if (navLogo.complete) writeLogo(); else navLogo.addEventListener('load', writeLogo);

  /* Video: parte solo quando è visibile */
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting && !reduceMotion) { v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { threshold: .1 });
  const watchVideo = (v) => vio.observe(v);
  $$('video[data-autoplay]').forEach(watchVideo);

  /* ------------------------------------------------------------------
     Tilt 3D con riflesso (card, ritratto)
     ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach((el) => {
      const max = parseFloat(el.dataset.tilt || 8);
      let raf = 0;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = clamp((e.clientX - r.left) / r.width, 0, 1);
        const my = clamp((e.clientY - r.top) / r.height, 0, 1);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = 'transform .12s ease-out';
          el.style.transform = `perspective(1000px) rotateX(${(.5 - my) * max}deg) rotateY(${(mx - .5) * max}deg)`;
          el.style.setProperty('--mx', mx.toFixed(3));
          el.style.setProperty('--my', my.toFixed(3));
        });
      });
      el.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        el.style.transition = '';
        el.style.transform = '';
        el.style.setProperty('--mx', .5);
        el.style.setProperty('--my', .5);
      });
    });
  }

  /* ------------------------------------------------------------------
     Punto AF: segue il puntatore sopra le immagini, mette a fuoco,
     e mostra i dati di scatto reali quando disponibili.
     ------------------------------------------------------------------ */
  const af = $('#af'), afLabel = $('#af-label');
  if (finePointer && af) {
    let tx = -100, ty = -100, x = -100, y = -100, target = null, lockT = 0;
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      const t = e.target.closest && e.target.closest('[data-af]');
      if (t !== target) {
        target = t;
        clearTimeout(lockT);
        af.classList.remove('is-locked');
        if (t) {
          afLabel.textContent = t.dataset.exif || t.dataset.af || '';
          af.classList.add('is-on');
          lockT = setTimeout(() => af.classList.add('is-locked'), 280);
        } else af.classList.remove('is-on');
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { target = null; af.classList.remove('is-on', 'is-locked'); });
    (function loop() {
      x += (tx - x) * .28; y += (ty - y) * .28;
      af.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  const N = categories.length;

  /* Le card dei servizi aprono direttamente la galleria corrispondente */
  $$('[data-open]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const i = categories.findIndex((c) => c.slug === a.dataset.open);
    openGallery(i, e.clientX, e.clientY);
  }));

  /* ------------------------------------------------------------------
     GALLERIA: provino orizzontale con profondità di campo —
     il fotogramma al centro è a fuoco, i laterali ruotano e si sfocano.
     ------------------------------------------------------------------ */
  const gallery = $('#gallery'), track = $('#gallery-track');
  let gIndex = 0, gItems = [], lastFocus = null, gOpen = false;

  function buildGallery(i) {
    const c = categories[i];
    gIndex = i;
    $('#gallery-group').textContent = c.group;
    $('#gallery-title').textContent = c.title;
    $('#gallery-lede').textContent = c.lede;
    const next = categories[(i + 1) % N];
    $('#gallery-next-title').textContent = next.title;
    const imgs = c.images.map((im, k) => `
      <figure class="g-item" style="aspect-ratio:${im.w}/${im.h}" data-w="${im.w}" data-h="${im.h}" data-full="${im.full}"
          data-af="${c.title} · ${String(k + 1).padStart(2, '0')}"${im.exif ? ` data-exif="${im.exif}"` : ''}>
        <div class="g-item__in"><img src="${im.full}" alt="${c.title}, fotografia ${k + 1}" ${k > 2 ? 'loading="lazy"' : ''} draggable="false"></div>
      </figure>`).join('');
    const yts = (c.youtube || []).map((v) => `
      <a class="g-item g-item--yt" href="https://www.youtube.com/shorts/${v.id}" target="_blank" rel="noopener"
          data-yt="${v.id}" data-w="9" data-h="16" data-cap="${v.title}"
          data-af="${finePointer ? 'Clicca' : 'Tocca'} per riprodurre">
        <div class="g-item__in"><img src="https://i.ytimg.com/vi/${v.id}/${v.oar ? 'oardefault' : 'hqdefault'}.jpg" alt="${v.title}" loading="lazy"><span>▶</span></div>
      </a>`).join('');
    track.innerHTML = imgs + yts;
    gItems = $$('.g-item', track);
    $$('figure.g-item', track).forEach((fig) => fig.addEventListener('click', () => openViewer(fig)));
    // i video si aprono nella stessa vista a schermo intero; da file:// YouTube
    // non permette l'incorporamento, quindi lì il link apre YouTube
    if (canEmbed) $$('.g-item--yt', track).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openViewer(a); }));
    $('#gallery-total').textContent = String(gItems.length).padStart(2, '0');
    track.scrollLeft = 0;
    gTarget = -1;
    requestAnimationFrame(updateTrack);
  }
  function updateTrack() {
    const mid = track.clientWidth / 2;
    let best = 1e9, bi = 0;
    gItems.forEach((it, k) => {
      const c = it.offsetLeft + it.offsetWidth / 2 - track.scrollLeft - mid;
      const o = clamp(c / mid, -1.6, 1.6);
      const a = Math.abs(o);
      if (a < best) { best = a; bi = k; }
      const inner = it.firstElementChild;
      inner.style.transform = reduceMotion ? '' : `perspective(1400px) rotateY(${(-o * 26).toFixed(2)}deg) translateZ(${(-a * 170).toFixed(1)}px)`;
      inner.style.opacity = reduceMotion ? '' : (1 - Math.min(a, 1) * .5).toFixed(3);
    });
    $('#gallery-index').textContent = String(bi + 1).padStart(2, '0');
    const cur = gItems[bi];
    $('#gallery-exif').textContent = cur && cur.dataset.exif ? cur.dataset.exif : '';
  }
  track.addEventListener('scroll', () => requestAnimationFrame(updateTrack), { passive: true });
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { track.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });
  addEventListener('resize', () => gOpen && updateTrack());

  // Frecce: si parte dal fotogramma più vicino al centro (o da quello verso cui
  // stiamo già scorrendo), così ogni pressione sposta sempre di uno, in entrambe le direzioni.
  let gTarget = -1, gTargetAt = 0;
  function step(dir) {
    const mid = track.scrollLeft + track.clientWidth / 2;
    const centers = gItems.map((it) => it.offsetLeft + it.offsetWidth / 2);
    let cur = 0;
    centers.forEach((c, k) => { if (Math.abs(c - mid) < Math.abs(centers[cur] - mid)) cur = k; });
    if (gTarget >= 0 && performance.now() - gTargetAt < 700) cur = gTarget;
    const k = clamp(cur + dir, 0, gItems.length - 1);
    gTarget = k; gTargetAt = performance.now();
    track.scrollTo({ left: centers[k] - track.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  async function openGallery(i, x, y) {
    if (i < 0) return;
    lastFocus = document.activeElement;
    gOpen = true;
    await shutter.close({ x, y });
    buildGallery(i);
    gallery.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    gallery.classList.add('is-open');
    updateTrack();
    $('#gallery-close').focus({ preventScroll: true });
    await shutter.open();
  }
  async function closeGallery() {
    if (!gOpen) return;
    gOpen = false;
    await shutter.close({ duration: 380 });
    gallery.classList.remove('is-open');
    gallery.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
    await shutter.open({ duration: 650 });
  }
  $('#gallery-close').addEventListener('click', closeGallery);
  $('#gallery-next').addEventListener('click', () => {
    const n = (gIndex + 1) % N;
    // chiude e riapre il diaframma sul progetto successivo
    shutter.close({ duration: 400 }).then(() => {
      buildGallery(n);
      return shutter.open({ duration: 700 });
    });
  });
  /* ------------------------------------------------------------------
     Foto a schermo intero. FLIP: l'immagine parte esattamente dalla sua
     posizione nella galleria e cresce fino a riempire lo schermo.
     Un tocco / clic (o Esc, o ✕) la riporta al suo posto.
     ------------------------------------------------------------------ */
  const viewer = $('#viewer'), vMedia = $('#viewer-media'), vImg = $('#viewer-img'), vFrame = $('#viewer-frame');
  let vOpen = false, vFig = null, vFit = null, vBusy = false;
  const HINT = finePointer ? 'Scorri o ← → · Clicca per tornare' : 'Scorri · Tocca per tornare';
  const HINT_VIDEO = finePointer ? 'Scorri o ← → · Clicca fuori dal video per tornare' : 'Scorri · Tocca fuori dal video per tornare';
  const vFigs = () => $$(canEmbed ? '.g-item' : 'figure.g-item', track);

  function fitRect(w, h) {
    const pad = innerWidth < 600 ? 0 : 48;
    const k = Math.min((innerWidth - pad * 2) / w, (innerHeight - pad * 2) / h);
    return { x: (innerWidth - w * k) / 2, y: (innerHeight - h * k) / 2, w: w * k, h: h * k };
  }
  function fromRect(r) {
    // trasformazione che riporta il contenuto a schermo intero sopra il rettangolo r
    const k = Math.max(r.width / vFit.w, r.height / vFit.h);
    const dx = r.left + r.width / 2 - (vFit.x + vFit.w * k / 2);
    const dy = r.top + r.height / 2 - (vFit.y + vFit.h * k / 2);
    return `translate(${dx}px, ${dy}px) scale(${k})`;
  }
  const srcRect = (fig) => fig.firstElementChild.getBoundingClientRect();
  const stopVideo = () => { vFrame.removeAttribute('src'); };
  function place(fig) {
    vFit = fitRect(+fig.dataset.w, +fig.dataset.h);
    Object.assign(vMedia.style, { left: `${vFit.x}px`, top: `${vFit.y}px`, width: `${vFit.w}px`, height: `${vFit.h}px` });
    const yt = fig.dataset.yt;
    viewer.classList.toggle('is-video', !!yt);
    vImg.hidden = !!yt;
    vFrame.hidden = !yt;
    if (yt) {
      vFrame.src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    } else {
      stopVideo();
      vImg.src = fig.dataset.full;
      vImg.alt = $('img', fig).alt;
    }
    $('#viewer-cap').textContent = fig.dataset.cap || fig.dataset.exif || fig.dataset.af || '';
    $('#viewer-hint').textContent = yt ? HINT_VIDEO : HINT;
  }
  function openViewer(fig) {
    if (vOpen) return;
    const r = srcRect(fig);
    place(fig);
    vMedia.style.transition = 'none';
    vMedia.style.transform = fromRect(r);
    vMedia.style.opacity = '';
    viewer.hidden = false;
    fig.style.visibility = 'hidden';
    vFig = fig; vOpen = true;
    vMedia.getBoundingClientRect();
    vMedia.style.transition = '';
    requestAnimationFrame(() => { vMedia.style.transform = 'none'; viewer.classList.add('is-open'); });
    $('#viewer-close').focus({ preventScroll: true });
  }
  function closeViewer() {
    if (!vOpen) return;
    vOpen = false;
    // la galleria dietro si allinea alla foto corrente, così torna al posto giusto
    track.scrollLeft = vFig.offsetLeft + vFig.offsetWidth / 2 - track.clientWidth / 2;
    updateTrack();
    vMedia.style.transition = '';
    vMedia.style.opacity = '';
    vMedia.style.transform = fromRect(srcRect(vFig));
    viewer.classList.remove('is-open');
    const fig = vFig;
    setTimeout(() => { viewer.hidden = true; fig.style.visibility = ''; stopVideo(); }, reduceMotion ? 0 : 470);
  }
  // Foto successiva/precedente: quella attuale scivola via, la nuova entra dal lato opposto
  function stepViewer(dir, fromX = 0) {
    if (!vOpen || vBusy) return;
    const list = vFigs(), k = list.indexOf(vFig) + dir;
    if (k < 0 || k >= list.length) {            // fine della serie: piccolo rimbalzo
      vMedia.style.transition = '';
      vMedia.style.transform = 'none';
      return;
    }
    vBusy = true;
    const out = reduceMotion ? 0 : 220, inn = reduceMotion ? 0 : 340;
    vMedia.style.transition = `transform ${out}ms cubic-bezier(.4, 0, 1, 1), opacity ${out}ms`;
    vMedia.style.transform = `translateX(${(fromX ? Math.sign(fromX) : -dir) * innerWidth * .35}px)`;
    vMedia.style.opacity = '0';
    setTimeout(() => {
      vFig.style.visibility = '';
      vFig = list[k];
      vFig.style.visibility = 'hidden';
      place(vFig);
      vMedia.style.transition = 'none';
      vMedia.style.transform = `translateX(${dir * innerWidth * .35}px)`;
      vMedia.getBoundingClientRect();
      vMedia.style.transition = `transform ${inn}ms cubic-bezier(.2, .8, .2, 1), opacity ${inn}ms`;
      vMedia.style.transform = 'none';
      vMedia.style.opacity = '1';
      setTimeout(() => { vBusy = false; vMedia.style.transition = ''; }, inn);
    }, out);
  }

  // Trascinamento col dito (o col mouse): la foto segue, oltre la soglia cambia
  let drag = null, dragged = false, dragEndAt = 0;
  viewer.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.viewer__close') || vBusy) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0 };
    dragged = false;
  });
  viewer.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    if (Math.abs(drag.dx) > 8) {
      dragged = true;
      vMedia.style.transition = 'none';
      vMedia.style.transform = `translateX(${drag.dx}px)`;
      vMedia.style.opacity = String(1 - Math.min(Math.abs(drag.dx) / innerWidth, .5));
    }
  });
  const endDragV = () => {
    if (!drag) return;
    const dx = drag.dx; drag = null;
    if (!dragged) return;
    dragEndAt = performance.now();
    if (Math.abs(dx) > Math.min(90, innerWidth * .18)) stepViewer(dx < 0 ? 1 : -1, dx);
    else { vMedia.style.transition = ''; vMedia.style.transform = 'none'; vMedia.style.opacity = '1'; }
  };
  viewer.addEventListener('pointerup', endDragV);
  viewer.addEventListener('pointercancel', endDragV);
  // un tocco o un clic (senza trascinare) riporta la foto al suo posto
  viewer.addEventListener('click', () => { if (performance.now() - dragEndAt > 300) closeViewer(); });
  // trackpad / rotella orizzontale (anche verticale, per chi ha solo il mouse)
  let wheelAcc = 0, wheelLock = 0;
  viewer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (performance.now() < wheelLock) return;
    wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(wheelAcc) > 40) {
      stepViewer(wheelAcc > 0 ? 1 : -1);
      wheelAcc = 0;
      wheelLock = performance.now() + 650;      // assorbe l'inerzia del trackpad
    }
  }, { passive: false });
  addEventListener('resize', () => { if (vOpen) { vOpen = false; viewer.hidden = true; viewer.classList.remove('is-open'); vFig.style.visibility = ''; stopVideo(); } });

  addEventListener('keydown', (e) => {
    if (vOpen) {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') stepViewer(1);
      if (e.key === 'ArrowLeft') stepViewer(-1);
      return;
    }
    if (!gOpen) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'Tab') {
      // focus trap minimale
      const f = $$('button, a[href], [tabindex="0"]', gallery).filter((el) => !el.hidden);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------------------------------------------------------
     Polaroid: su touch si aprono a ventaglio con un tap
     ------------------------------------------------------------------ */
  const pol = $('#polaroids');
  pol.addEventListener('click', () => pol.classList.toggle('is-fanned'));

  /* Form demo */
  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    $('#form-note').textContent = f.checkValidity()
      ? 'Grazie! (Demo: nel sito reale il messaggio arriverà a info@elisabettapala.com)'
      : 'Compila nome, email e messaggio.';
  });

  /* Badge concept */
  $('button', badge).addEventListener('click', () => { badge.hidden = true; });
})();
