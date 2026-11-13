// Keep old posts readable when a third-party image URL disappears.
document.querySelectorAll<HTMLImageElement>('.article-reading-surface .prose img').forEach(image => {
  function showUnavailable() {
    if (!image.isConnected) return;
    const notice = document.createElement('span');
    notice.className = 'image-unavailable';
    const message = document.createElement('span');
    message.textContent = '본문 이미지를 불러오지 못했습니다. 원본 주소가 변경되었거나 이미지가 삭제되었을 수 있습니다.';
    const link = document.createElement('a');
    link.href = image.currentSrc || image.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '원본 이미지 주소 확인 ↗';
    notice.append(message, link);
    const target = image.parentElement?.tagName === 'A' ? image.parentElement : image;
    target.replaceWith(notice);
  }
  image.addEventListener('error', showUnavailable, { once: true });
  if (image.complete && image.naturalWidth === 0) showUnavailable();
});
