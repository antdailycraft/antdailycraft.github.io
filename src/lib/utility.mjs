export function markdownFilename(title, now = new Date()) {
  const slug = title.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
  if (!slug) return '';
  const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  return `${date}-${slug}.md`;
}

export function linesToJSON(value) {
  const trimmed = value.trim();
  return trimmed ? JSON.stringify(trimmed.split(/\r?\n/).map(line => line.trim()), null, 2) : '';
}
