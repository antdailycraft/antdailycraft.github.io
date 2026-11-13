import { readFileSync, writeFileSync } from 'node:fs';
const images = {
  original: 'github-pages-2026-11-11.png',
  astro: 'astro-developed-2026-11-11.png',
  current: 'scrollcraft-updated-desktop.png',
  featured: 'scrollcraft-updated-featured.png',
  topics: 'scrollcraft-updated-topics.png',
  mobile: 'scrollcraft-updated-mobile.png',
};
const template = readFileSync(new URL('./design-comparison.template.html', import.meta.url), 'utf8');
const html = template.replace(/\{\{asset:(\w+)\}\}/g, (_, key) => {
  if (!images[key]) throw new Error(`Unknown screenshot: ${key}`);
  return 'data:image/png;base64,' + readFileSync(new URL('../screenshots/' + images[key], import.meta.url)).toString('base64');
});
writeFileSync(new URL('../public/design-comparison.html', import.meta.url), html);
console.log('Generated public/design-comparison.html (self-contained)');
