(()=>{
  'use strict';
  const receipt=Object.freeze({
    retired:true,
    authoritative:false,
    replacement:'assets/compass/compass.capability-carousel.js',
    contract:'COMPASS_LEGACY_EDITORIAL_CAROUSEL_RETIRED_v1'
  });
  Object.defineProperty(globalThis,'CompassLegacyEditorialCarousel',{configurable:false,enumerable:false,get:()=>receipt});

  // Compatibility shim only: Track B owns upper-page presentation, never carousel behavior.
  if(!document.querySelector('script[data-compass-track-b]')){
    const script=document.createElement('script');
    script.src='/assets/compass/compass.track-b.js?v=track-b-v1';
    script.defer=true;
    script.dataset.compassTrackB='true';
    document.head.append(script);
  }
})();
