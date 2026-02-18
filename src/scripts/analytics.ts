// Google Analytics 4 — initialization (CSP-safe: runs from external script file)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    gtag: (...args: unknown[]) => void;
  }
}

window.dataLayer = window.dataLayer || [];
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}
window.gtag = gtag;
window.gtag('js', new Date());
window.gtag('config', 'G-YLY8403C61');

// Vercel Analytics
import { inject } from '@vercel/analytics';
inject();
