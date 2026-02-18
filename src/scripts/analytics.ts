// Google Analytics 4 — deferred load after page 'load' event
// Loaded AFTER the LCP image to avoid bandwidth competition and critical request chaining.
// GA queues events in dataLayer before the script arrives, so no data is lost.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    gtag: (...args: unknown[]) => void;
  }
}

window.addEventListener('load', () => {
  // Set up dataLayer and gtag stub first — GA will process the queue when it loads
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-YLY8403C61');

  // Dynamically inject gtag.js — fires after LCP is already captured
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-YLY8403C61';
  s.async = true;
  document.head.appendChild(s);
}, { passive: true, once: true });

// Vercel Analytics
import { inject } from '@vercel/analytics';
inject();
