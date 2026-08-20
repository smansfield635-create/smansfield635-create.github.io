(()=>{
'use strict';
const receipt=Object.freeze({
  mounted:false,
  retired:true,
  authoritative:false,
  version:'gen1537-historical-artifact-retired',
  instrumentMounted:false,
  lowerCarouselPreserved:true,
  clusterGuidanceMounted:false
});
Object.defineProperty(globalThis,'DGB_COMPASS_GEN1537_LIVE_RECOVERY',{
  configurable:true,
  enumerable:false,
  writable:false,
  value:Object.freeze({mounted:false,retired:true,authoritative:false,version:receipt.version,receipt:()=>receipt,stop:()=>{}})
});
})();
