(() => {
  const ENDPOINT = "https://geodiametrics-aggregator.smansfield635.workers.dev/collect";

  const payload = {
    source: document.referrer.includes("osf.io") ? "OSF" :
            document.referrer.includes("github") ? "GitHub" :
            document.referrer ? "External" : "Direct"
  };

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
})();
