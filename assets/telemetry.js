(function(){
  window.GEO = window.GEO || {};
  const q = [];
  const now = () => new Date().toISOString();

  GEO.telemetry = {
    event(type, data){
      q.push({ type, data: data || {}, t: now() });
      // No network calls here during demolition-safe mode.
      // You can wire this later to your endpoint.
      try{ console.log("[telemetry]", type, data || {}); }catch(e){}
    },
    dump(){ return q.slice(); }
  };
})();
