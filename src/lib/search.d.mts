export function normalizeSearch(value: string): string;
export function matchesSearch(text: string, query: string, categories: string[], category?: string): boolean;
export function readSearchState(url: URL, categories: string[]): { query: string; category: string };
export function searchURL(url: string | URL, query: string, category: string): URL;
