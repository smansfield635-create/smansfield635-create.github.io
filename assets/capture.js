(() => {
  const BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const COLLECT = BASE + "/collect";
  const METRICS = BASE + "/metrics";

  const now = Date.now();
  const SKEY = "geo_session_ts";
  const TEN_MIN = 10 * 60 * 1000;

  const ref = document.referrer || "";

  const post = (body) => fetch(COLLECT, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body)
  }).catch(()=>{});

  // pageview (always)
  post({ pageview:true, referrer: ref });

  // session (throttled per device)
  const last = Number(localStorage.getItem(SKEY) || 0);
  if (now - last > TEN_MIN) {
    localStorage.setItem(SKEY, String(now));
    post({ session:true, referrer: ref });
  }

  // clicks
  document.addEventListener("click", () => post({ click:true, referrer: ref }));

  // optional warm read (no increment)
  fetch(METRICS + "?t=" + Date.now(), { cache:"no-store" }).catch(()=>{});
})();
