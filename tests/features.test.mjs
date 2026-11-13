import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSearch, matchesSearch, readSearchState, searchURL } from '../src/lib/search.mjs';
import { markdownFilename, linesToJSON } from '../src/lib/utility.mjs';
import { visiblePosts, categories, label } from '../src/lib/content.mjs';

test('search finds body-only words and requires every word regardless of order/case', () => {
  const post = visiblePosts.find(post => post.slug === 'set-python-formatting-black-in-visual-studio-code');
  const bodyWord = post.content.split(/\s+/).find(word => word.length > 4 && !`${post.title} ${post.description}`.includes(word));
  assert.ok(bodyWord, 'fixture must contain a term beyond title and description');
  const searchable = `${post.title} ${post.description} ${post.content} ${post.categories.map(label).join(' ')} ${post.tags.join(' ')}`;
  assert.ok(matchesSearch(searchable, bodyWord, post.categories));
  assert.ok(matchesSearch(searchable, 'BLACK python', post.categories, 'python'));
  assert.ok(!matchesSearch(searchable, 'black missingword123', post.categories));
  assert.ok(!matchesSearch(searchable, 'black', post.categories, 'media'));
  assert.ok(matchesSearch(searchable, '   ', post.categories));
});

test('search normalizes Korean composition, fullwidth Latin, and whitespace', () => {
  assert.equal(normalizeSearch('  ＰＹＴＨＯＮ\n코드  '), 'python 코드');
  assert.ok(matchesSearch('한글 기록', '한글'.normalize('NFD'), []));
  assert.ok(matchesSearch('코드 Python', ' PYTHON\t코드 ', []));
});

test('search URL round trips reserved characters without losing unrelated parameters', () => {
  const url = searchURL('https://example.com/?source=rss#top', ' C++ & 한글 ', 'python');
  assert.deepEqual(readSearchState(url, categories), { query: 'C++ & 한글', category: 'python' });
  assert.equal(url.searchParams.get('source'), 'rss');
  assert.equal(url.hash, '#records');
  assert.deepEqual(readSearchState(new URL('https://example.com/?category=missing&q=hello'), categories), {query: 'hello', category: 'all'});
  const reset = searchURL(url, '', 'all');
  assert.equal(reset.searchParams.has('q'), false);
  assert.equal(reset.searchParams.has('category'), false);
  assert.equal(reset.searchParams.get('source'), 'rss');
});

test('filename conversion preserves Korean, removes unsafe separators, and uses local date', () => {
  const date = new Date(2026, 10, 13, 0, 5);
  assert.equal(markdownFilename(' Python 코드 정리하기! ', date), '2026-11-13-python-코드-정리하기.md');
  assert.equal(markdownFilename('../안녕\\세상: "Hello"', date), '2026-11-13-안녕-세상-hello.md');
  assert.equal(markdownFilename('한글'.normalize('NFD'), date), '2026-11-13-한글.md');
  assert.equal(markdownFilename(' ! / .. ', date), '');
});

test('JSON conversion escapes quotes/backslashes and preserves intentional blank items', () => {
  assert.deepEqual(JSON.parse(linesToJSON(' first\r\n"quoted"\r\nC:\\temp\r\n\r\n한글 ')), ['first', '"quoted"', 'C:\\temp', '', '한글']);
  assert.equal(linesToJSON(' \n\t '), '');
});
