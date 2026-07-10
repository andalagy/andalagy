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

  function pdfViewerConfig(item) {
    const pdf = item.pdf && typeof item.pdf === 'object' ? item.pdf : {};
    const src = item.pdfUrl || pdf.src || defaultPdfPath(item);
    const title = pdf.title || item.pdfTitle || `${item.title} pdf`;
    const downloadLabel = pdf.downloadLabel || item.pdfDownloadLabel || 'open pdf';
    const note = pdf.note || item.pdfNote || 'place or replace this pdf in src/writings to update the viewer.';
    return { src, title, downloadLabel, note };
  }

  function pdfUrl(src) {
    if (/^(https?:)?\/\//i.test(src) || String(src).startsWith('data:')) return src;
    const normalized = String(src || '').startsWith('/') ? src : `/${src}`;
    return window.AppUtils.toUrl(normalized);
  }

  function writingContentHtml(item) {
    const viewer = pdfViewerConfig(item);
    const src = pdfUrl(viewer.src);
    const safeTitle = escapeHtml(viewer.title);
    return `<div class="pdf-viewer-shell">
      <div class="pdf-viewer-toolbar">
        <p>${escapeHtml(viewer.note)}</p>
        <a class="quiet-btn pdf-viewer-action" href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer">${escapeHtml(viewer.downloadLabel)}</a>
      </div>
      <object class="pdf-viewer-frame" data="${escapeHtml(src)}" type="application/pdf" aria-label="${safeTitle}">
        <iframe src="${escapeHtml(src)}" title="${safeTitle}" loading="lazy"></iframe>
        <p>this browser cannot display the pdf inline. <a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer">open it here</a>.</p>
      </object>
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
