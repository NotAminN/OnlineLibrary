// GSAP utilities (spec §59, §60) + Lenis smooth scroll (spec §61).
// All animation respects prefers-reduced-motion.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

export function initSmoothScroll() {
  if (prefersReduced) return null;
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // expose for command palette / anchors
  window.__lenis = lenis;
  return lenis;
}

export function scrollToTop() { lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0); }
export function scrollToEl(target) { lenis ? lenis.scrollTo(target, { offset: -80 }) : target.scrollIntoView({ behavior: 'smooth' }); }

// ---- Reveal helpers ----
export function reveal(target, opts = {}) {
  if (prefersReduced) { target.style.opacity = 1; target.style.transform = 'none'; return; }
  const { y = 24, duration = 0.7, delay = 0, stagger = 0, selector = null } = opts;
  const els = selector ? target.querySelectorAll(selector) : [target];
  gsap.set(els, { opacity: 0, y });
  return gsap.to(els, { opacity: 1, y: 0, duration, delay, stagger, ease: 'power3.out', clearProps: 'transform' });
}

export function fadeUp(target, { y = 24, duration = 0.8, delay = 0, stagger = 0.08, selector = null } = {}) {
  if (prefersReduced) { (selector ? target.querySelectorAll(selector) : [target]).forEach((e) => { e.style.opacity = 1; e.style.transform = 'none'; }); return; }
  const els = selector ? target.querySelectorAll(selector) : [target];
  gsap.fromTo(els,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, stagger, ease: 'power3.out', clearProps: 'transform' });
}

export function staggerReveal(selector, parent = document, opts = {}) {
  const els = parent.querySelectorAll(selector);
  if (!els.length) return;
  if (prefersReduced) { els.forEach((e) => (e.style.opacity = 1)); return; }
  gsap.fromTo(els,
    { opacity: 0, y: opts.y ?? 28 },
    { opacity: 1, y: 0, duration: opts.duration ?? 0.7, stagger: opts.stagger ?? 0.07, ease: 'power3.out', clearProps: 'transform',
      scrollTrigger: opts.scroll ? { trigger: parent, start: 'top 85%' } : undefined });
}

export function parallax(target, { amount = 40 } = {}) {
  if (prefersReduced) return;
  gsap.to(target, { yPercent: -amount / 10, ease: 'none', scrollTrigger: { trigger: target, start: 'top bottom', end: 'bottom top', scrub: true } });
}

// ScrollTrigger-based section reveal used in homepage.
export function sectionReveal(section) {
  const items = section.querySelectorAll('[data-reveal]');
  if (prefersReduced) { items.forEach((i) => (i.style.opacity = 1)); return; }
  items.forEach((item) => {
    gsap.fromTo(item, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
      scrollTrigger: { trigger: item, start: 'top 88%' }
    });
  });
}

export function heroSequence(elements = []) {
  if (prefersReduced) { elements.forEach((e) => (e.style.opacity = 1)); return; }
  gsap.fromTo(elements.filter(Boolean), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'transform' });
}

export function killScrollTriggers() { ScrollTrigger.getAll().forEach((t) => t.kill()); }

export { gsap, ScrollTrigger, Lenis };
