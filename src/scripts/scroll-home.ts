// The Scrollcraft runtime is upstream code; site-specific choreography lives here.
async function start() {
  const root = document.querySelector<HTMLElement>('#scroll-experience');
  if (!root) return;
  if (matchMedia('(max-width: 768px)').matches) root.querySelectorAll('[data-sc-act="pin"], [data-sc-act="pan"]').forEach(el => el.setAttribute('data-sc-act', 'flow'));
  try {
    await new Promise<void>((resolve, reject) => { const script = document.createElement('script'); script.src = '/vendor/scrollcraft.js'; script.onload = () => resolve(); script.onerror = reject; document.head.append(script); });
    (window as unknown as { ScrollCraft: { mount: (root: HTMLElement) => unknown } }).ScrollCraft.mount(root);
  } catch { document.documentElement.classList.remove('sc-ready'); }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches) document.body.classList.add('sc-motion');
  const hero = document.querySelector<HTMLElement>('.craft-hero')!;
  if (!reduced.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', event => { const rect = hero.getBoundingClientRect(); hero.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 20}px`); hero.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 12}px`); }, { passive: true });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--pointer-x','0px'); hero.style.setProperty('--pointer-y','0px'); });
  }
  const posts = root.querySelectorAll<HTMLElement>('[data-post]');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('post-arrived'); observer.unobserve(entry.target); } }), { threshold: .08 });
  posts.forEach(post => observer.observe(post));
}
start();
