const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function runBrowserScript(path, window = {}) {
  const context = vm.createContext({ window, URL });
  vm.runInContext(fs.readFileSync(path, 'utf8'), context, { filename: path });
  return window;
}

const window = runBrowserScript('youtube-utils.js');
runBrowserScript('src/films.js', window);

const expected = {
  '4uJzOTmVHKQ': 'northern mockingbird',
  qaAV4v811j8: 'the man who waters concrete',
  '-vp76Gp6zoI': 'bohemian rhapsody',
  '9pLS3b_b_oM': 'echoes of tomorrow'
};

assert.equal(
  JSON.stringify(window.FILMS_DATA.map(({ youtubeId, title }) => [youtubeId, title])),
  JSON.stringify(Object.entries(expected))
);

for (const film of window.FILMS_DATA) {
  const { youtubeId } = film;
  assert.equal(window.YouTubeUtils.isValidVideoId(youtubeId), true, `${film.title} has an invalid youtube id`);
  assert.equal(window.YouTubeUtils.cleanVideoId(youtubeId), youtubeId);
  assert.equal(
    window.YouTubeUtils.buildEmbedUrl(youtubeId),
    `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`
  );
  assert.equal(window.YouTubeUtils.buildWatchUrl(youtubeId), `https://www.youtube.com/watch?v=${youtubeId}`);
  assert.equal(
    window.YouTubeUtils.getYouTubeThumbnailCandidates(youtubeId)[0],
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  );
}

const northernMockingbird = window.FILMS_DATA.find(({ title }) => title === 'northern mockingbird');
assert.equal(northernMockingbird.password, 'ilovearlo');

const application = fs.readFileSync('script.js', 'utf8');
assert.doesNotMatch(application, /EMBED_LOAD_TIMEOUT|replaceEmbedWithFallback|iframe\.addEventListener\(['"](?:load|error)/);
assert.match(application, /iframe\.src = window\.YouTubeUtils\.buildEmbedUrl\(id\)/);

console.log(`verified ${window.FILMS_DATA.length} youtube embed configurations`);
