/** Clipboard API on HTTPS; selection-based fallback for local HTTP previews. */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* Try the browser's selection-based copy when permission is denied. */ }
  const active = document.activeElement as HTMLElement | null;
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('aria-label', '복사할 내용');
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.append(field);
  field.focus({ preventScroll: true });
  field.select();
  try { return document.execCommand('copy'); }
  catch { return false; }
  finally { field.remove(); active?.focus({ preventScroll: true }); }
}
