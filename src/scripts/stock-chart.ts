import { parseSeries, alignSeries } from '../lib/chart-data.mjs';
const symbol = new URLSearchParams(location.search).get('s')?.trim().toUpperCase() || '';
const input = document.querySelector<HTMLInputElement>('#symbol')!;
input.value = symbol;
const status = document.querySelector<HTMLElement>('#chart-status')!;
const note = document.querySelector<HTMLElement>('#chart-note')!;
const container = document.querySelector<HTMLElement>('#stock-chart')!;
const retry = document.querySelector<HTMLButtonElement>('#chart-retry')!;
const base = 'https://picsen.github.io/77C7CE9A5D86BB386D443BB96390FAA120633158699C8844C30B13AB0BF92760B7E441/assets/data/stocks';
let busy = false;
let dispose: (() => void) | undefined;
async function fetchSeries(type: string, column: string) {
  const response = await fetch(`${base}/${encodeURIComponent(symbol)}_${type}.csv`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parseSeries(await response.text(), column);
}
async function load() {
  if (!symbol || busy) return;
  if (!/^[A-Z0-9.^-]{1,15}$/.test(symbol)) {
    status.textContent = '종목 심볼을 확인해 주세요. 영문, 숫자, 점, ^, - 기호를 사용할 수 있습니다.';
    input.setAttribute('aria-invalid', 'true');
    return;
  }
  busy = true;
  retry.disabled = true;
  retry.textContent = '불러오는 중…';
  note.hidden = true;
  container.hidden = true;
  container.setAttribute('aria-busy', 'true');
  dispose?.();
  dispose = undefined;
  status.textContent = `${symbol} 데이터를 불러오는 중입니다…`;
  try {
    const [priceResult, dividendResult] = await Promise.allSettled([
      fetchSeries('price_1d', 'Close'), fetchSeries('dividend', 'Dividends'),
    ]);
    if (priceResult.status !== 'fulfilled' || !priceResult.value.points.length) throw new Error('No valid prices');
    const prices = priceResult.value.points;
    const dividends = dividendResult.status === 'fulfilled' ? dividendResult.value.points : [];
    const messages = [];
    if (dividendResult.status === 'rejected') messages.push('배당 자료를 불러오지 못해 주가만 표시합니다. 배당이 없다는 뜻은 아닙니다.');
    else if (!dividends.length) messages.push('제공된 파일에 표시할 배당 기록이 없습니다.');
    const excluded = priceResult.value.invalidRows + (dividendResult.status === 'fulfilled' ? dividendResult.value.invalidRows : 0);
    if (excluded) messages.push(`날짜나 금액을 확인할 수 없는 ${excluded}개 행은 제외했습니다.`);
    const { renderChart } = await import('./render-stock-chart');
    dispose = renderChart(container, alignSeries(prices, dividends), dividends.length > 0);
    const last = prices.at(-1)!;
    status.textContent = `${symbol} · ${prices[0].date} ~ ${last.date} 주가 기록 · 마지막 종가 $${last.value.toLocaleString('en-US', { maximumFractionDigits: 4 })} (실시간 아님)`;
    container.setAttribute('aria-label', `${symbol}의 과거 주가${dividends.length ? ' 및 배당금' : ''} 차트`);
    note.textContent = messages.join(' ');
    note.hidden = !messages.length;
    retry.hidden = dividendResult.status !== 'rejected';
  } catch {
    dispose?.();
    dispose = undefined;
    container.hidden = true;
    status.textContent = `${symbol} 주가를 불러오지 못했습니다. 심볼을 확인하거나 다시 불러오기를 눌러 주세요. 외부 저장소에 유효한 데이터가 없을 수 있습니다.`;
    retry.hidden = false;
  } finally {
    busy = false;
    retry.disabled = false;
    retry.textContent = '다시 불러오기';
    container.removeAttribute('aria-busy');
  }
}
input.addEventListener('input', () => input.removeAttribute('aria-invalid'));
retry.addEventListener('click', async () => {
  await load();
  if (retry.hidden) {
    status.tabIndex = -1;
    status.focus({ preventScroll: true });
  }
});
load();
