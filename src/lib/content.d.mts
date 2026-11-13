export interface Post {
  title: string; description: string; slug: string; url: string; date: Date;
  categories: string[]; tags: string[]; image: string | null; minutes: number;
  html: string; content: string; author?: string; hidden?: boolean; featured?: boolean;
}
export const site: { name: string; description: string; url: string };
export const labels: Record<string, string>;
export function label(name: string): string;
export function terms(value: unknown): string[];
export function normalizeMarkdown(body: string): string;
export const posts: Post[];
export const visiblePosts: Post[];
export const categories: string[];
export const tags: string[];
export const links: { url: string; domain: string; title: string; description?: string; screenshot: string }[];
export const dividends: Record<string, string | number>[];
export const shortcuts: Record<string, string>;
export function dateLabel(date: Date): string;
