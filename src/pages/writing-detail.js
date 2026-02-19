(function () {
  function writingContentHtml(item) {
    return item.content
      .split('\n\n')
      .map((paragraph, index) => `<p data-anim-key="writing:${item.slug}:paragraph:${index}" data-reveal="text" data-reveal-stagger="${index}">${window.AppUtils.lower(paragraph)}</p>`)
      .join('');
  }

  function writingDetailView(slug) {
    const writings = window.APP_DATA?.writings || [];
    const item = writings.find((entry) => entry.slug === slug);
    if (!item) return `<section class="page-section"><h1>writing not found</h1></section>`;

    return `<section class="page-section writing-detail" data-anim-key="writing:${item.slug}:section" data-reveal="section">
      <a class="back-link" href="${window.AppUtils.toUrl('/writings')}" data-link="/writings" data-anim-key="writing:${item.slug}:back" data-reveal="link">back</a>
      <h1 data-anim-key="writing:${item.slug}:title" data-reveal="heading">${window.AppUtils.lower(item.title)}</h1>
      <article data-anim-key="writing:${item.slug}:article" data-reveal="section">
        ${writingContentHtml(item)}
      </article>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.writingDetailView = writingDetailView;
})();
