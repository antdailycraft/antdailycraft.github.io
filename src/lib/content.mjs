import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { parse } from 'yaml';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';
const highlighter = await createHighlighter({ themes: ['github-light'], langs: ['javascript', 'typescript', 'json', 'python', 'ruby', 'html', 'css', 'shellscript', 'yaml', 'markdown'] });
marked.use({ renderer: { code({ text, lang }) {
  const aliases = { shell: 'shellscript', sh: 'shellscript', bash: 'shellscript', yml: 'yaml' };
  const language = aliases[lang] || lang || 'text';
  return highlighter.codeToHtml(text, { lang: highlighter.getLoadedLanguages().includes(language) ? language : 'text', theme: 'github-light' });
} } });
export const site = { name: 'Daily Daily On', description: 'IT 기술로 일상을 가볍게. 개발과 업무 자동화, 미국 주식에 관한 기록.', url: 'https://blog.aidaon.com' };
export const labels = { vscode: 'VS Code', python: 'Python', jekyll: 'Jekyll', media: '일상과 음악', tutorial: '튜토리얼', markdown: 'Markdown' };
export const label = (name) => labels[name] || name;
export const terms = (value) => Array.isArray(value) ? value.map(String) : String(value || '').split(/\s+/).filter(Boolean);
export function normalizeMarkdown(body) {
  return body.replace(/\{%\s*highlight\s+(\w+)\s*%\}/g, '```$1').replace(/\{%\s*endhighlight\s*%\}/g, '```')
    .replace(/\{\{\s*site.baseurl\s*\}\}/g, '')
    .replace(/!\[([^\]]*)\]\((\/assets\/[^)]+)\)/g, (_, alt, path) => `![${alt}](${encodeURI(path)})`)
    .replace(/\{:[^}\n]*\}/g, '');
}
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap((file) => file.isDirectory() ? files(join(dir, file.name)) : file.name.endsWith('.md') ? [join(dir, file.name)] : []); }
export const posts = files('_posts').flatMap((file) => {
  const { data, content } = matter(readFileSync(file, 'utf8'));
  if (data.published === false) return [];
  const slug = basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const date = data.date ? new Date(data.date) : new Date(basename(file).slice(0, 10));
  const plain = content.replace(/<[^>]*>|!\[[^\]]*\]\([^)]*\)|\{%[^%]*%\}|[#*`]/g, '').trim();
  return [{ ...data, slug, date, categories: terms(data.categories), tags: terms(data.tags), url: `/${slug}/`,
    description: data.description || plain.slice(0, 140),
    image: data.image ? (/^https?:\/\//.test(data.image) ? data.image : '/' + data.image.replace(/^\//, '')) : null,
    minutes: Math.max(1, Math.ceil(plain.length / 650)), html: marked.parse(normalizeMarkdown(content)), content: plain }];
}).sort((a, b) => b.date - a.date);
export const visiblePosts = posts.filter((post) => !post.hidden);
export const categories = [...new Set(visiblePosts.flatMap((post) => post.categories))];
export const tags = [...new Set(visiblePosts.flatMap((post) => post.tags))];
export const links = parse(readFileSync('_data/links.yaml', 'utf8'));
export const dividends = parse(readFileSync('_data/dividends.yaml', 'utf8'));
export const shortcuts = JSON.parse(readFileSync('_data/site_checker_result.json', 'utf8'));
export const dateLabel = (date) => new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' }).format(date);
