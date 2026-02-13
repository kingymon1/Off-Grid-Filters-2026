// Activate Google Fonts (deferred from media="print" to avoid render-blocking CSP-safe)
const fontLink = document.getElementById('google-fonts') as HTMLLinkElement | null;
if (fontLink) fontLink.media = 'all';

// Scroll reveal observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-blur, .reveal-scale, .stagger-grid').forEach((el) => revealObserver.observe(el));

// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        scrollProgress.style.transform = `scaleX(${progress})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Spotlight card effect (mouse-following glow) — cached rects to avoid forced reflow
const cardRects = new WeakMap<Element, DOMRect>();
document.querySelectorAll('.spotlight-card').forEach((card) => {
  cardRects.set(card, card.getBoundingClientRect());
  card.addEventListener('mousemove', (e) => {
    const rect = cardRects.get(card)!;
    const x = ((e as MouseEvent).clientX - rect.left) + 'px';
    const y = ((e as MouseEvent).clientY - rect.top) + 'px';
    (card as HTMLElement).style.setProperty('--mouse-x', x);
    (card as HTMLElement).style.setProperty('--mouse-y', y);
  });
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    cardRects.set(card, card.getBoundingClientRect());
  });
}, { passive: true });

// Animated counters
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = el.dataset.target || el.textContent || '0';
        const isDecimal = target.includes('.');
        const suffix = target.replace(/[\d.]/g, '');
        const numericTarget = parseFloat(target);
        if (isNaN(numericTarget)) return;
        const duration = 1500;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = numericTarget * eased;
          el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));
