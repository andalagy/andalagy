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
    const downloadLabel = pdf.downloadLabel || item.pdfDownloadLabel || 'download';
    const note = pdf.note || item.pdfNote || 'custom pdf viewer';
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
    return `<div class="pdf-viewer-shell" data-pdf-viewer data-pdf-src="${escapeHtml(src)}" data-pdf-title="${safeTitle}">
      <div class="pdf-viewer-topbar">
        <div>
          <p class="pdf-viewer-kicker">${escapeHtml(viewer.note)}</p>
          <h2>${safeTitle}</h2>
        </div>
        <a class="quiet-btn pdf-viewer-action" href="${escapeHtml(src)}" download target="_blank" rel="noopener noreferrer">${escapeHtml(viewer.downloadLabel)}</a>
      </div>
      <div class="pdf-viewer-controls" aria-label="pdf viewer controls">
        <button type="button" class="pdf-icon-btn" data-pdf-prev aria-label="previous page">←</button>
        <span class="pdf-page-meter"><span data-pdf-page>1</span>/<span data-pdf-pages>–</span></span>
        <button type="button" class="pdf-icon-btn" data-pdf-next aria-label="next page">→</button>
        <span class="pdf-control-spacer" aria-hidden="true"></span>
        <button type="button" class="pdf-icon-btn" data-pdf-zoom-out aria-label="zoom out">−</button>
        <span class="pdf-zoom-meter" data-pdf-zoom>100%</span>
        <button type="button" class="pdf-icon-btn" data-pdf-zoom-in aria-label="zoom in">+</button>
      </div>
      <div class="pdf-canvas-stage" data-pdf-stage>
        <canvas data-pdf-canvas aria-label="${safeTitle}"></canvas>
        <div class="pdf-viewer-status" data-pdf-status>loading pdf…</div>
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
