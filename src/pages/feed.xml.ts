import rss from '@astrojs/rss';
import { visiblePosts, site } from '../lib/content.mjs';
export function GET() {
  return rss({ title: site.name, description: site.description, site: site.url, customData: '<language>ko-kr</language>', items: visiblePosts.map((p) => ({ title: p.title, pubDate: p.date, description: p.description, link: p.url })) });
}
