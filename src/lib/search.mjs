/** Normalize Korean composition, case and whitespace consistently at build/run time. */
export function normalizeSearch(value) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

export function matchesSearch(text, query, categories, category = 'all') {
  const normalized = normalizeSearch(text);
  return (category === 'all' || categories.includes(category)) &&
    normalizeSearch(query).split(' ').filter(Boolean).every(term => normalized.includes(term));
}

export function readSearchState(url, categories) {
  const category = url.searchParams.get('category') || 'all';
  return { query: url.searchParams.get('q') || '', category: categories.includes(category) ? category : 'all' };
}

export function searchURL(url, query, category) {
  const result = new URL(url);
  const trimmed = query.trim();
  if (trimmed) result.searchParams.set('q', trimmed);
  else result.searchParams.delete('q');
  if (category !== 'all') result.searchParams.set('category', category);
  else result.searchParams.delete('category');
  result.hash = 'records';
  return result;
}
