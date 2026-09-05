//validate youtube ids and construct youtube asset urls
(function attachYouTubeUtils(globalScope) {
  const YOUTUBE_HOSTS = Object.freeze({
    embed: 'https://www.youtube-nocookie.com',
    thumbnail: 'https://img.youtube.com',
    watch: 'https://www.youtube.com'
  });

  function assertYouTubeId(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id);
  }

  function cleanVideoId(value) {
    if (!value) return null;
    const cleanedValue = value.split(/[?#]/)[0].trim() || null;
    return assertYouTubeId(cleanedValue) ? cleanedValue : null;
  }

  function extractYouTubeVideoId(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');

      if (host === 'youtu.be') {
        const shortId = cleanVideoId(parsed.pathname.replace(/^\//, '').split('/')[0]);
        return shortId;
      }

      if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (parsed.pathname === '/watch') {
          return cleanVideoId(parsed.searchParams.get('v'));
        }

        const pathParts = parsed.pathname.split('/').filter(Boolean);
        const embedIndex = pathParts.indexOf('embed');
        if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
          return cleanVideoId(pathParts[embedIndex + 1]);
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  function getYouTubeThumbnailCandidates(videoId) {
    if (!assertYouTubeId(videoId)) return [];

    return ['hqdefault', 'mqdefault', 'sddefault', 'default']
      .map((quality) => `${YOUTUBE_HOSTS.thumbnail}/vi/${encodeURIComponent(videoId)}/${quality}.jpg`);
  }

  function buildEmbedUrl(videoId) {
    if (!assertYouTubeId(videoId)) return '';
    return `${YOUTUBE_HOSTS.embed}/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`;
  }

  function buildWatchUrl(videoId) {
    if (!assertYouTubeId(videoId)) return '';
    return `${YOUTUBE_HOSTS.watch}/watch?v=${encodeURIComponent(videoId)}`;
  }

  function getVideoUrls(videoId) {
    const cleanId = cleanVideoId(videoId);
    if (!cleanId) return null;

    return Object.freeze({
      embed: buildEmbedUrl(cleanId),
      thumbnails: Object.freeze(getYouTubeThumbnailCandidates(cleanId)),
      watch: buildWatchUrl(cleanId)
    });
  }

  globalScope.YouTubeUtils = {
    isValidVideoId: assertYouTubeId,
    cleanVideoId,
    extractYouTubeVideoId,
    getYouTubeThumbnailCandidates,
    buildEmbedUrl,
    buildWatchUrl,
    getVideoUrls
  };
})(window);
