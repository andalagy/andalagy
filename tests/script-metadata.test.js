const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const window = {};
vm.runInNewContext(fs.readFileSync('src/scripts.js', 'utf8'), { window });

const scripts = Object.fromEntries(window.SCRIPTS_DATA.map((script) => [script.slug, script]));
assert.equal(scripts.absence.year, '2026');
assert.equal(scripts['ride-home'].year, '2025');
assert.equal(scripts['keep-it-simple'].year, '2024');
assert.equal(scripts.absence.pageCount, 16);
assert.equal(scripts['keep-it-simple'].pageCount, 2);
assert.ok(Object.hasOwn(scripts['ride-home'], 'pageCount'));

function pdfPageCount(path) {
  const source = fs.readFileSync(path, 'latin1');
  const counts = [...source.matchAll(/\/Count\s+(\d+)/g)].map((match) => Number(match[1]));
  return Math.max(...counts);
}

assert.equal(scripts.absence.pageCount, pdfPageCount('src/scripts/absence.pdf'));
assert.equal(scripts['keep-it-simple'].pageCount, pdfPageCount('src/scripts/keep-it-simple.pdf'));

const detailRenderer = fs.readFileSync('src/pages/script-detail.js', 'utf8');
assert.match(detailRenderer, /detail-meta-static script-meta/);
assert.match(detailRenderer, /data-script-page-total/);
assert.match(detailRenderer, /count === 1 \? 'page' : 'pages'/);

const application = fs.readFileSync('script.js', 'utf8');
assert.match(application, /detailPageCount\.textContent = `\$\{pdf\.numPages\}/);

const listingRenderer = fs.readFileSync('src/pages/scripts.js', 'utf8');
assert.doesNotMatch(listingRenderer, /pageCount|\.year/);
