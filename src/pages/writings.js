//render collective writing detail pages
(function () {
  function writingsView() {
    const writingsData = window.APP_DATA?.writings;
    if (!Array.isArray(writingsData)) {
      console.error('writings data is invalid; expected an array.');
      return `<section class="page-section writings" data-ambient-shift data-anim-key="writings:section" data-reveal="section">
        <h1 data-anim-key="writings:heading" data-reveal="heading">writings</h1>
        <p>unable to load writings right now.</p>
      </section>`;
    }

    return `<section class="page-section writings" data-ambient-shift data-anim-key="writings:section" data-reveal="section">
      <h1 data-anim-key="writings:heading" data-reveal="heading">writings</h1>
      <div class="writing-grid" data-anim-key="writings:grid" data-reveal="section">
        ${writingsData.map(window.AppUtils.writingCard).join('')}
      </div>
    </section>`;
  }

  window.WorkPages = window.WorkPages || {};
  window.WorkPages.writingsView = writingsView;
})();
