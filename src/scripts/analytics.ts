// Google Analytics 4 — deferred load on first user interaction or idle
// Loaded AFTER LCP and only when the browser is idle or user interacts,
// to minimize unused JS impact on PageSpeed performance score.
// GA queues events in dataLayer before the script arrives, so no data is lost.
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let gtagLoaded = false;

function loadGtag() {
  if (gtagLoaded) return;
  gtagLoaded = true;

  // Set up dataLayer and gtag stub first — GA will process the queue when it loads
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-YLY8403C61');

  // Dynamically inject gtag.js
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-YLY8403C61';
  s.async = true;
  document.head.appendChild(s);
}

// Strategy: load on first user interaction, with idle fallback after 5s
const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'] as const;

function onInteraction() {
  loadGtag();
  for (const evt of interactionEvents) {
    window.removeEventListener(evt, onInteraction, { capture: true });
  }
}

// Listen for user interaction (passive, capture phase for earliest detection)
for (const evt of interactionEvents) {
  window.addEventListener(evt, onInteraction, { capture: true, passive: true, once: true } as AddEventListenerOptions);
}

// Fallback: load after 5s idle timeout if no interaction occurs
if ('requestIdleCallback' in window) {
  (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
    .requestIdleCallback(() => loadGtag(), { timeout: 5000 });
} else {
  setTimeout(() => loadGtag(), 5000);
}

// Vercel Analytics
import { inject } from '@vercel/analytics';
inject();
