(function(){
  window.GEO = window.GEO || {};
  GEO.metrics = {
    coherence: 1,
    admissible: true,
    set(k,v){ this[k]=v; },
    snapshot(){
      return {
        coherence: this.coherence,
        admissible: this.admissible,
        ts: new Date().toISOString()
      };
    }
  };
})();
