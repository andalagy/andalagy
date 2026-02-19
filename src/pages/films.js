(function () {
  function filmsView() {
    const films = window.APP_DATA?.films || [];
    return `<section class="page-section" data-anim-key="films:section" data-reveal="section">
      <h1 data-anim-key="films:heading" data-reveal="heading">films</h1>
      <div class="film-grid" data-anim-key="films:grid" data-reveal="section">${films.map(window.AppUtils.filmCard).join('')}</div>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.filmsView = filmsView;
})();
