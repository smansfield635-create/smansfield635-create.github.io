(function(){
  window.GEO = window.GEO || {};
  // Minimal engine stub to keep legacy imports non-breaking during demolition-safe phase.
  GEO.engine = {
    status: "RUNNING",
    rpm: 1,
    tick(){
      // No timers as gates; this is a passive status surface only.
      return { status: this.status, rpm: this.rpm, ts: new Date().toISOString() };
    }
  };
})();
