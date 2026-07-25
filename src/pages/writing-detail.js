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

  function pdfDocumentConfig(item) {
    const pdf = item.pdf && typeof item.pdf === 'object' ? item.pdf : {};
    const src = item.pdfUrl || pdf.src || defaultPdfPath(item);
    const downloadLabel = pdf.downloadLabel || item.pdfDownloadLabel || 'download pdf';
    return { src, downloadLabel };
  }

  function pdfUrl(src) {
    if (/^(https?:)?\/\//i.test(src) || String(src).startsWith('data:')) return src;
    const normalized = String(src || '').startsWith('/') ? src : `/${src}`;
    return window.AppUtils.toUrl(normalized);
  }

  function writingContentHtml(item) {
    const pdf = pdfDocumentConfig(item);
    const src = pdfUrl(pdf.src);
    const title = window.AppUtils.lower(item.title);
    const accessibleLabel = `open ${title} pdf`;
    const downloadLabel = window.AppUtils.lower(pdf.downloadLabel);
    return `<figure class="pdf-document-preview" data-pdf-preview data-pdf-src="${escapeHtml(src)}">
      <a class="pdf-document-link" href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessibleLabel)}">
        <canvas class="pdf-document-canvas" data-pdf-canvas aria-hidden="true"></canvas>
        <span class="pdf-document-placeholder" data-pdf-placeholder aria-hidden="true"></span>
        <span class="pdf-document-open" aria-hidden="true">open pdf</span>
      </a>
      <figcaption>
        <a class="pdf-document-download" href="${escapeHtml(src)}" download>${escapeHtml(downloadLabel)}</a>
      </figcaption>
    </figure>`;
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
