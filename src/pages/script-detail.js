// Render an individual script and the existing styled PDF preview when available.
(function () {
  function escapeHtml(text) {
    return String(text || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function pdfUrl(src) {
    if (/^(https?:)?\/\//i.test(src) || String(src).startsWith('data:')) return src;
    return window.AppUtils.toUrl(String(src || '').startsWith('/') ? src : `/${src}`);
  }

  function pdfPreview(item) {
    if (!item.pdfAvailable) return '<p class="script-pdf-pending">pdf coming soon.</p>';
    const src = pdfUrl(item.pdfUrl);
    const title = window.AppUtils.lower(item.title);
    return `<figure class="pdf-document-preview" data-pdf-preview data-pdf-src="${escapeHtml(src)}">
      <a class="pdf-document-link" href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" aria-label="open ${escapeHtml(title)} pdf">
        <canvas class="pdf-document-canvas" data-pdf-canvas aria-hidden="true"></canvas>
        <span class="pdf-document-placeholder" data-pdf-placeholder aria-hidden="true"></span>
        <span class="pdf-document-open" aria-hidden="true">open pdf</span>
      </a>
      <figcaption><a class="pdf-document-download" href="${escapeHtml(src)}" download>download pdf</a></figcaption>
    </figure>`;
  }

  function scriptDetailView(slug) {
    const item = (window.APP_DATA?.scripts || []).find((entry) => entry.slug === slug);
    if (!item) return '<section class="page-section"><h1>script not found</h1></section>';
    return `<section class="page-section script-detail page page--script-detail">
      <h1>${window.AppUtils.lower(item.title)}</h1>
      ${item.synopsis ? `<p class="script-synopsis">${escapeHtml(window.AppUtils.lower(item.synopsis))}</p>` : ''}
      ${item.year ? `<p class="script-year" aria-label="${escapeHtml(item.year)}">${escapeHtml(item.year)}</p>` : ''}
      <article>${pdfPreview(item)}</article>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.scriptDetailView = scriptDetailView;
})();
