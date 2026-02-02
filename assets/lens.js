(function(){
  window.GEO = window.GEO || {};
  // “Lens” is retained for compatibility during demolition-safe phase.
  // Later we can delete and replace with instrument.js once all imports are updated.
  GEO.lens = {
    project(view){
      // Minimal projection hook (no-op by default).
      return view;
    }
  };
})();
