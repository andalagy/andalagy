//render individual film detail pages
(function () {
  function filmDetailView(id) {
    const films = window.APP_DATA?.films || [];
    const cleanId = window.AppUtils.cleanVideoId(id);
    if (!cleanId) return `<section class="page-section"><h1>film not found</h1></section>`;

    const film = films.find((item) => window.AppUtils.cleanVideoId(item.youtubeId) === cleanId);
    if (!film) return `<section class="page-section"><h1>film not found</h1></section>`;

    return window.AppUtils.protectedContentView({
      item: film,
      type: 'film',
      id: cleanId,
      renderContent: () => filmContentView(film, cleanId)
    });
  }

  function filmContentView(film, cleanId) {
    const validId = window.AppUtils.isValidVideoId(cleanId);
    return `<section class="page-section detail" data-anim-key="film:${cleanId}:section" data-reveal="section">
      <div class="player-wrap" data-player-wrap data-film-id="${cleanId}" data-state="${validId ? 'embed' : 'fallback'}" data-anim-key="film:${cleanId}:player" data-reveal="section">
        <div class="player-ratio">
          ${
            validId
              ? `<div data-film-embed-mount data-film-title="${window.AppUtils.lower(film.title)}"></div>`
              : window.AppUtils.filmFallbackView(film, 'invalid id')
          }
        </div>
        ${
          validId
            ? `<a class="player-watch-link" target="_blank" rel="noopener noreferrer" href="${window.YouTubeUtils.buildWatchUrl(cleanId)}">view on youtube</a>`
            : ''
        }
      </div>
      <h1 data-anim-key="film:${cleanId}:title" data-reveal="heading">${window.AppUtils.lower(film.title)}</h1>
      <p data-anim-key="film:${cleanId}:statement" data-reveal="text">${window.AppUtils.lower(film.statement)}</p>
      <div class="detail-meta-static" data-no-reveal>
        <p class="meta"><span class="meta-item">${window.AppUtils.lower(film.year)}</span> · <span class="meta-item">${window.AppUtils.lower(film.runtime)}</span> · <span class="meta-item">${window.AppUtils.lower(film.role)}</span></p>
      </div>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.filmDetailView = filmDetailView;
})();
