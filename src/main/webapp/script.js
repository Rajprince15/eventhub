
(() => {
  'use strict';

  
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const throttle = (fn, wait = 100) => {
    let last = 0, t;
    return (...args) => {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) { last = now; fn(...args); }
      else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn(...args); }, remaining); }
    };
  };

  
  // API Configuration
  const API_BASE_URL = '/eventhub/api';
  
  // Events will be loaded from backend
  let EVENTS = [];

  const TESTIMONIALS = [
    {
      quote: 'EventHub turned my "maybe one day" into a confirmed front-row seat. Slick, fast, and the reminders are perfect.',
      name: 'Ananya Rao',
      role: 'Product Designer · Linear',
      stars: 5,
      avatar: 'AR',
    },
    {
      quote: 'I run a 600-person fest and EventHub handled it without breaking a sweat. The dashboard alone is worth it.',
      name: 'Karthik Menon',
      role: 'Festival Organizer · Kochi',
      stars: 5,
      avatar: 'KM',
    },
    {
      quote: 'Cleanest event discovery I have used since Eventbrite a decade ago. And it actually respects dark mode.',
      name: 'Léa Dubois',
      role: 'Frontend Engineer · Stripe',
      stars: 4,
      avatar: 'LD',
    },
    {
      quote: 'Three taps from "what is happening this weekend" to a ticket in my wallet. That is the bar now.',
      name: 'Ishaan Verma',
      role: 'CS Senior · IIT Bombay',
      stars: 5,
      avatar: 'IV',
    },
  ];

  const ICON_PATHS = {
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    run: '<path d="M13 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/><path d="m4 22 4-9 5 3 3-6 4 6"/>',
    spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    palette: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1.5 3-3 3h-2a2 2 0 0 0-2 2v1a2 2 0 0 1-3 2"/>',
    racket: '<circle cx="8" cy="8" r="6"/><line x1="12.5" y1="12.5" x2="21" y2="21"/>',
    pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><line x1="2" y1="2" x2="9.5" y2="9.5"/>',
  };

  
  const themeBtn = $('#theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('eh-theme');
  if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('eh-theme', next);
  });

  
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link').forEach(a => a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }));

  
  const navbar = $('#navbar');
  let lastY = window.scrollY;
  window.addEventListener('scroll', throttle(() => {
    const y = window.scrollY;
    if (y > 120 && y > lastY) navbar.classList.add('hidden');
    else navbar.classList.remove('hidden');
    lastY = y;
  }, 120), { passive: true });

  
  const phrases = ['Tech Conferences', 'Cultural Fests', 'Workshops', 'Hackathons'];
  const typed = $('#typed-text');
  let pIdx = 0, cIdx = 0, deleting = false;
  function tick() {
    if (!typed) return;
    const phrase = phrases[pIdx];
    cIdx += deleting ? -1 : 1;
    typed.textContent = phrase.slice(0, cIdx);
    let delay = deleting ? 45 : 90;
    if (!deleting && cIdx === phrase.length) { delay = 1400; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 280; }
    setTimeout(tick, delay);
  }
  tick();

  
  function animateCount(el) {
    const target = +el.dataset.target;
    const dur = 1600;
    const start = performance.now();
    const startVal = 0;
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(startVal + (target - startVal) * eased);
      el.textContent = val >= 1000 ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K+' : val + '+';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = $$('.counter');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObs.observe(c));

  
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObs.observe(el));

  
  // Fetch events from backend
  async function loadEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      EVENTS = await response.json();
      renderEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      toast({ title: 'Error', body: 'Failed to load events. Please refresh the page.' }, 'error');
    }
  }

  const grid = $('#event-grid');
  function eventCard(e) {
    const icon = ICON_PATHS[e.icon] || ICON_PATHS.spark;
    const card = document.createElement('article');
    card.className = 'event-card reveal';
    card.dataset.category = e.category;
    card.dataset.testid = `event-card-${e.id}`;
    card.innerHTML = `
      <div class="event-thumb" style="--g1:${e.gradient[0]};--g2:${e.gradient[1]}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
        <span class="badge" data-cat="${e.category}">${e.category}</span>
      </div>
      <div class="event-body">
        <h3>${e.name}</h3>
        <div class="event-meta">
          <span><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${e.date}</span>
          <span><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${e.location}</span>
        </div>
        <p class="event-seats"><b>${e.seats}</b> seats available</p>
        <button class="btn btn-outline glow register-btn" data-event-id="${e.id}" data-event-name="${e.name}" data-event-meta="${e.date} · ${e.location}" data-testid="register-btn-${e.id}">Register Now</button>
      </div>
    `;
    return card;
  }

  function renderEvents() {
    grid.innerHTML = '';
    EVENTS.forEach(e => grid.appendChild(eventCard(e)));
    $$('.event-card.reveal').forEach(el => revealObs.observe(el));
  }

  // Load events on page load
  loadEvents();

  
  const tabs = $$('.filter-tabs .tab');
  const indicator = $('#tab-indicator');
  function positionIndicator(tab) {
    const r = tab.getBoundingClientRect();
    const parent = tab.parentElement.getBoundingClientRect();
    indicator.style.width = `${r.width}px`;
    indicator.style.transform = `translateX(${r.left - parent.left}px)`;
  }
  function applyFilter(filter) {
    $$('.event-card').forEach(c => {
      const match = filter === 'all' || c.dataset.category === filter;
      c.classList.toggle('hide', !match);
    });
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
      positionIndicator(tab);
      applyFilter(tab.dataset.filter);
    });
  });
  window.addEventListener('load', () => positionIndicator($('.filter-tabs .tab.active')));
  window.addEventListener('resize', throttle(() => {
    const active = $('.filter-tabs .tab.active');
    if (active) positionIndicator(active);
  }, 150));

  
  const toastStack = $('#toast-stack');
  function toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.setAttribute('data-testid', `toast-${type}`);
    t.innerHTML = `<span class="dot"></span><div><strong>${msg.title || ''}</strong><div>${msg.body || msg}</div></div>`;
    toastStack.appendChild(t);
    setTimeout(() => { t.classList.add('leave'); }, 3200);
    setTimeout(() => t.remove(), 3600);
  }

  
  const modal = $('#modal');
  const modalName = $('#modal-event-name');
  const modalMeta = $('#modal-event-meta');
  const rEvent = $('#r-event');
  let activeTrigger = null;
  let currentEventId = null;

  function openModal(eventName, eventMeta, eventId = null) {
    currentEventId = eventId;
    modalName.textContent = eventName || 'an event';
    modalMeta.textContent = eventMeta ? `${eventMeta} · Pick your tickets and lock your spot.` : 'Pick your tickets and lock your spot.';
    rEvent.value = eventName || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#r-name')?.focus(), 50);
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeTrigger?.focus();
    clearErrors($('#register-form'));
    $('#register-form').reset();
    currentEventId = null;
  }

  document.addEventListener('click', (e) => {
    const reg = e.target.closest('.register-btn');
    if (reg) {
      activeTrigger = reg;
      openModal(reg.dataset.eventName, reg.dataset.eventMeta, reg.dataset.eventId);
    }
    if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) closeModal();
  });
  $('#register-cta')?.addEventListener('click', () => openModal('General Registration', 'Choose your favourite event later'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  
  function setError(input, message) {
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!message);
    const err = field.querySelector('.error');
    if (err) err.textContent = message || '';
  }
  function clearErrors(form) {
    $$('.field', form).forEach(f => { f.classList.remove('invalid'); const e = f.querySelector('.error'); if (e) e.textContent = ''; });
  }
  function validateRegistration(form) {
    let ok = true;
    const name = $('#r-name', form);
    const email = $('#r-email', form);
    const phone = $('#r-phone', form);
    const org = $('#r-org', form);
    clearErrors(form);
    if (!name.value.trim() || name.value.trim().length < 2) { setError(name, 'Please enter your full name'); ok = false; }
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email.value.trim())) { setError(email, 'Enter a valid email address'); ok = false; }
    if (!/^[0-9+-s()]{7,15}$/.test(phone.value.trim())) { setError(phone, 'Enter a valid phone number'); ok = false; }
    if (!org.value.trim()) { setError(org, 'Tell us where you are from'); ok = false; }
    return ok;
  }
  $('#register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateRegistration(e.currentTarget)) return;
    
    const formData = {
      eventId: currentEventId,
      fullName: $('#r-name').value.trim(),
      email: $('#r-email').value.trim(),
      phone: $('#r-phone').value.trim(),
      org: $('#r-org').value.trim(),
      tickets: parseInt($('#r-tickets').value)
    };

    // Show loading state
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        closeModal();
        toast({ title: '🎉 Registration Successful!', body: `${formData.tickets} ticket${formData.tickets > 1 ? 's' : ''} locked in. Check your inbox.` }, 'success');
        // Reload events to update seat count
        loadEvents();
      } else {
        toast({ title: 'Registration Failed', body: result.error || 'Something went wrong. Please try again.' }, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({ title: 'Error', body: 'Failed to register. Please check your connection.' }, 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  
  function validateContact(form) {
    let ok = true;
    const name = $('#c-name', form);
    const email = $('#c-email', form);
    const msg = $('#c-msg', form);
    clearErrors(form);
    if (!name.value.trim() || name.value.trim().length < 2) { setError(name, 'Please enter your name'); ok = false; }
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email.value.trim())) { setError(email, 'Enter a valid email'); ok = false; }
    if (!msg.value.trim() || msg.value.trim().length < 10) { setError(msg, 'A few more words help us help you'); ok = false; }
    return ok;
  }
  $('#contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateContact(e.currentTarget)) return;
    
    // TODO: Configure EmailJS
    // Steps to integrate EmailJS:
    // 1. Sign up at https://www.emailjs.com/
    // 2. Create an email service and template
    // 3. Add EmailJS SDK: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    // 4. Initialize: emailjs.init('YOUR_PUBLIC_KEY');
    // 5. Send email:
    /*
    const formData = {
      from_name: $('#c-name').value,
      from_email: $('#c-email').value,
      message: $('#c-msg').value
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
      .then(() => {
        e.currentTarget.reset();
        toast({ title: '✅ Message sent', body: 'We will reply within a working day.' }, 'success');
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        toast({ title: 'Error', body: 'Failed to send message. Please try again.' }, 'error');
      });
    */
    
    // For now, just show success message (remove this when EmailJS is configured)
    e.currentTarget.reset();
    toast({ title: '✅ Message sent', body: 'We will reply within a working day.' }, 'success');
  });

  
  const track = $('#carousel-track');
  const dotsBox = $('#carousel-dots');
  TESTIMONIALS.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 't-card';
    card.setAttribute('data-testid', `testimonial-${i}`);
    card.innerHTML = `
      <span class="quote-icon">"</span>
      <blockquote>${t.quote}</blockquote>
      <div class="t-author">
        <div class="t-avatar">${t.avatar}</div>
        <div class="t-meta">
          <strong>${t.name}</strong>
          <span>${t.role}</span>
          <div class="t-stars" aria-label="${t.stars} stars">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
        </div>
      </div>
    `;
    track.appendChild(card);
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('data-testid', `testimonial-dot-${i}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i, true));
    dotsBox.appendChild(dot);
  });
  let tIndex = 0; let tTimer;
  function goTo(i, manual = false) {
    tIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    track.style.transform = `translateX(-${tIndex * 100}%)`;
    $$('button', dotsBox).forEach((d, idx) => d.classList.toggle('active', idx === tIndex));
    if (manual) { clearInterval(tTimer); startTimer(); }
  }
  function startTimer() { tTimer = setInterval(() => goTo(tIndex + 1), 5200); }
  startTimer();

  
  const topBtn = $('#back-to-top');
  window.addEventListener('scroll', throttle(() => {
    topBtn.classList.toggle('show', window.scrollY > 600);
  }, 120), { passive: true });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  
  const sections = ['home', 'events', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navMap = new Map();
  $$('.nav-link').forEach(a => navMap.set(a.getAttribute('href')?.replace('#', ''), a));
  const sectObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const link = navMap.get(e.target.id);
        if (!link) return;
        navMap.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => sectObs.observe(s));

  
  $('#year').textContent = new Date().getFullYear();
})();

