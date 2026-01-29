window.__GEO_LIVE__ = function(){
  const KEY="geo_live_site";
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
};
