// Header: sticky scroll, mobile menu, dropdown keyboard navigation
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) { header?.classList.add('scrolled'); } else { header?.classList.remove('scrolled'); }
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
  menuIcon?.classList.toggle('hidden');
  closeIcon?.classList.toggle('hidden');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.add('hidden');
    menuIcon?.classList.remove('hidden');
    closeIcon?.classList.add('hidden');
  });
});

document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.nav-btn');
  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { btn?.focus(); (btn as HTMLElement)?.setAttribute('aria-expanded', 'false'); }
  });
  btn?.addEventListener('focus', () => { (btn as HTMLElement).setAttribute('aria-expanded', 'true'); });
  dropdown.addEventListener('focusout', (e) => {
    if (!dropdown.contains((e as FocusEvent).relatedTarget as Node)) { (btn as HTMLElement)?.setAttribute('aria-expanded', 'false'); }
  });
  dropdown.addEventListener('mouseenter', () => { (btn as HTMLElement)?.setAttribute('aria-expanded', 'true'); });
  dropdown.addEventListener('mouseleave', () => { (btn as HTMLElement)?.setAttribute('aria-expanded', 'false'); });
});
