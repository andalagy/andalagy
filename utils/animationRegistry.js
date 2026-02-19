(function () {
  const seenKeys = new Set();
  const STORAGE_PREFIX = 'anim:seen:';

  function toStorageKey(key) {
    return `${STORAGE_PREFIX}${String(key || '').trim()}`;
  }

  function hasSeen(key) {
    const normalized = String(key || '').trim();
    if (!normalized) return false;
    if (seenKeys.has(normalized)) return true;
    try {
      if (window.sessionStorage.getItem(toStorageKey(normalized)) === '1') {
        seenKeys.add(normalized);
        return true;
      }
    } catch (_) {
      // ignore storage errors and continue with in-memory registry only
    }
    return false;
  }

  function markSeen(key) {
    const normalized = String(key || '').trim();
    if (!normalized) return;
    seenKeys.add(normalized);
    try {
      window.sessionStorage.setItem(toStorageKey(normalized), '1');
    } catch (_) {
      // ignore storage errors and continue with in-memory registry only
    }
  }

  window.AnimationRegistry = {
    hasSeen,
    markSeen
  };
})();
