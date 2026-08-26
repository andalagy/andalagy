// Render the native screenplay reader shell; PDF.js fills it after the route mounts.
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

  function screenplayViewer(item) {
    if (!item.pdfUrl) return '<p class="screenplay-status">script unavailable.</p>';
    const src = pdfUrl(item.pdfUrl);
    const title = window.AppUtils.lower(item.title);
    return `<div class="screenplay-viewer" data-screenplay-viewer data-pdf-src="${escapeHtml(src)}" aria-label="${escapeHtml(title)} screenplay" tabindex="0">
      <div class="screenplay-controls" aria-label="screenplay controls">
        <button type="button" data-page-previous aria-label="previous screenplay page">previous</button>
        <span class="screenplay-page-count" data-page-count aria-live="polite">page — / —</span>
        <button type="button" data-page-next aria-label="next screenplay page">next</button>
        <a href="${escapeHtml(src)}" download>download pdf</a>
      </div>
      <p class="screenplay-status" data-screenplay-status role="status">loading script…</p>
      <div class="screenplay-pages" data-screenplay-pages aria-label="screenplay pages"></div>
    </div>`;
  }

  function scriptDetailView(slug) {
    const item = (window.APP_DATA?.scripts || []).find((entry) => entry.slug === slug);
    if (!item) return '<section class="page-section"><h1>script not found</h1></section>';
    return window.AppUtils.protectedContentView({
      item,
      type: 'script',
      id: slug,
      renderContent: () => scriptContentView(item)
    });
  }

  function scriptContentView(item) {
    return `<section class="page-section script-detail page page--script-detail">
      <h1>${window.AppUtils.lower(item.title)}</h1>
      ${item.synopsis ? `<p class="script-synopsis">${escapeHtml(window.AppUtils.lower(item.synopsis))}</p>` : ''}
      ${item.year ? `<p class="script-year" aria-label="${escapeHtml(item.year)}">${escapeHtml(item.year)}</p>` : ''}
      <article>${screenplayViewer(item)}</article>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.scriptDetailView = scriptDetailView;
})();
