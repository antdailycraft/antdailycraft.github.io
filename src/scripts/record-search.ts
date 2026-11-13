import { matchesSearch, readSearchState, searchURL } from '../lib/search.mjs';
import { copyText } from './copy-text';

const input = document.querySelector<HTMLInputElement>('#search')!;
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const resets = [...document.querySelectorAll<HTMLButtonElement>('[data-reset-search]')];
const categories = buttons.map(button => button.dataset.filter!);
const rows = [...document.querySelectorAll<HTMLElement>('[data-post]')].map(element => ({
  element, text: element.dataset.search || '', categories: JSON.parse(element.dataset.categories || '[]') as string[],
}));
const status = document.querySelector<HTMLElement>('#search-status')!;
const shareStatus = document.querySelector<HTMLElement>('#share-status')!;
let category = 'all';

function render() {
  let count = 0;
  for (const row of rows) {
    row.element.hidden = !matchesSearch(row.text, input.value, row.categories, category);
    if (!row.element.hidden) count++;
  }
  buttons.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  resets.forEach(button => { button.hidden = !input.value && category === 'all'; });
  document.querySelector<HTMLElement>('#empty-state')!.hidden = count > 0;
  status.textContent = `전체 ${rows.length}개 중 ${count}개의 기록`;
  shareStatus.textContent = '';
}

function restore() {
  const state = readSearchState(new URL(location.href), categories);
  input.value = state.query;
  category = state.category;
  render();
}

function update(push = false) {
  const url = searchURL(location.href, input.value, category);
  if (url.href !== location.href) {
    if (push) history.pushState(null, '', url);
    else history.replaceState(history.state, '', url);
  }
  render();
}

buttons.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter!;
  update(true);
}));
input.addEventListener('input', event => {
  if (!(event as InputEvent).isComposing) update();
});
input.addEventListener('compositionend', () => update());
resets.forEach(button => button.addEventListener('click', () => {
  input.value = '';
  category = 'all';
  update(true);
  input.focus({ preventScroll: true });
}));
const share = document.querySelector<HTMLButtonElement>('#share-search')!;
let sharing = false;
share.addEventListener('click', async () => {
  if (sharing) return;
  sharing = true;
  share.setAttribute('aria-busy', 'true');
  share.textContent = '복사 중…';
  const copied = await copyText(searchURL(location.href, input.value, category).href);
  sharing = false;
  share.removeAttribute('aria-busy');
  share.textContent = '검색 주소 복사';
  shareStatus.textContent = copied ? '현재 검색 주소를 복사했습니다.' : '자동 복사가 제한되어 있습니다. 브라우저 주소 표시줄의 주소를 복사해 주세요.';
});
window.addEventListener('popstate', restore);
window.addEventListener('pageshow', restore);
restore();
['search-controls', 'search-summary', 'search-help'].forEach(id => { document.getElementById(id)!.hidden = false; });
