(function(){
  const KEY = "geo_live_site";
  const now = () => new Date().toISOString();

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
  }
  function save(o){ localStorage.setItem(KEY, JSON.stringify(o)); }

  const state = load() || {
    timestamp: now(),
    interaction: { sessions_24h: 0, pageviews_24h: 0, clicks_24h: 0, avg_time_sec: 0 },
    sources_24h: [
      { label: "Direct", value: 0 },
      { label: "OSF", value: 0 },
      { label: "GitHub", value: 0 },
      { label: "Other", value: 0 }
    ],
    _sessionStart: 0,
    _sessionPages: 0,
    _sessionTime: 0
  };

  // new session per tab load
  state.interaction.sessions_24h += 1;
  state.interaction.pageviews_24h += 1;
  state._sessionStart = Date.now();
  state._sessionPages += 1;
  state.timestamp = now();
  save(state);

  document.addEventListener("click", () => {
    state.interaction.clicks_24h += 1;
    state.timestamp = now();
    save(state);
  });

  window.addEventListener("beforeunload", () => {
    const dur = Math.round((Date.now() - state._sessionStart) / 1000);
    state._sessionTime += dur;
    const sessions = Math.max(1, state.interaction.sessions_24h);
    state.interaction.avg_time_sec = Math.round(state._sessionTime / sessions);
    state.timestamp = now();
    save(state);
  });
})();
