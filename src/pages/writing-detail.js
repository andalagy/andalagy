//render individual writing detail pages
(function () {
  function escapeHtml(text) {
    return String(text || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function defaultPdfPath(item) {
    return `/src/writings/${encodeURIComponent(item.slug)}.pdf`;
  }

  function pdfResourceConfig(item) {
    const pdf = item.pdf && typeof item.pdf === 'object' ? item.pdf : {};
    const src = item.pdfUrl || pdf.src || defaultPdfPath(item);
    const title = pdf.title || item.pdfTitle || `${item.title} pdf`;
    const downloadLabel = pdf.downloadLabel || item.pdfDownloadLabel || 'download pdf';
    const openLabel = pdf.openLabel || item.pdfOpenLabel || 'open pdf';
    return { src, title, downloadLabel, openLabel };
  }

  function pdfUrl(src) {
    if (/^(https?:)?\/\//i.test(src) || String(src).startsWith('data:')) return src;
    const normalized = String(src || '').startsWith('/') ? src : `/${src}`;
    return window.AppUtils.toUrl(normalized);
  }

  function writingContentHtml(item) {
    const pdf = pdfResourceConfig(item);
    const src = pdfUrl(pdf.src);
    const safeTitle = escapeHtml(pdf.title);
    return `<div class="pdf-resource-card">
      <span class="pdf-resource-mark" aria-hidden="true">pdf</span>
      <div class="pdf-resource-copy">
        <h2>${safeTitle}</h2>
      </div>
      <div class="pdf-resource-actions">
        <a class="quiet-btn pdf-resource-action" href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pdf.openLabel)}</a>
        <a class="quiet-btn pdf-resource-action" href="${escapeHtml(src)}" download target="_blank" rel="noopener noreferrer">${escapeHtml(pdf.downloadLabel)}</a>
      </div>
    </div>`;
  }

  function writingDetailView(slug) {
    const writings = window.APP_DATA?.writings || [];
    const item = writings.find((entry) => entry.slug === slug);
    if (!item) return `<section class="page-section"><h1>writing not found</h1></section>`;

    const itemYear = Number(item.year);
    const dateYear = new Date(item.date).getFullYear();
    const year = Number.isFinite(itemYear)
      ? itemYear
      : (Number.isFinite(dateYear) ? dateYear : null);

    return `<section class="page-section writing-detail page page--writing-detail">
      <h1>${window.AppUtils.lower(item.title)}</h1>
      <p class="writing-excerpt writing-excerpt--detail">${window.AppUtils.lower(item.excerpt)}</p>
      ${year ? `<p class="writing-year" aria-label="${year}">${year}</p>` : ''}
      <article>
        ${writingContentHtml(item)}
      </article>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.writingDetailView = writingDetailView;
})();
