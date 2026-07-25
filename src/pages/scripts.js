// Render the public scripts listing.
(function () {
  function scriptsView() {
    const scripts = window.APP_DATA?.scripts || [];
    return `<section class="page-section scripts" data-ambient-shift data-anim-key="scripts:section" data-reveal="section">
      <h1 data-anim-key="scripts:heading" data-reveal="heading">scripts</h1>
      <div class="script-grid" data-anim-key="scripts:grid" data-reveal="section">
        ${scripts.map(window.AppUtils.scriptCard).join('')}
      </div>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.scriptsView = scriptsView;
})();
