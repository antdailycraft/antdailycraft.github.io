// The source uses CSV, including quoted fields. Do not treat missing values as zero.
function csvRows(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  const source = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && (char === ',' || char === '\n')) {
      row.push(field.trim()); field = '';
      if (char === '\n') { rows.push(row); row = []; }
    } else field += char;
  }
  if (quoted) throw new Error('Invalid CSV quotes');
  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows;
}

export function parseSeries(csv, column) {
  const [header = [], ...rows] = csvRows(csv);
  const dateIndex = header.indexOf('Date');
  const valueIndex = header.indexOf(column);
  if (dateIndex < 0 || valueIndex < 0) throw new Error('Missing CSV columns');
  const series = new Map();
  let invalidRows = 0;
  for (const row of rows) {
    if (row.every(value => !value)) continue;
    const date = row[dateIndex];
    const raw = row[valueIndex];
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date || '') && Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === date;
    const value = Number(raw);
    if (!validDate || !raw || !Number.isFinite(value) || value < 0) { invalidRows++; continue; }
    series.set(date, value);
  }
  return { points: [...series].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value })), invalidRows };
}

export function alignSeries(prices, dividends) {
  const priceMap = new Map(prices.map(point => [point.date, point.value]));
  const dividendMap = new Map(dividends.map(point => [point.date, point.value]));
  const dates = [...new Set([...priceMap.keys(), ...dividendMap.keys()])].sort();
  return { dates, prices: dates.map(date => priceMap.get(date) ?? null), dividends: dates.map(date => dividendMap.get(date) ?? null) };
}
