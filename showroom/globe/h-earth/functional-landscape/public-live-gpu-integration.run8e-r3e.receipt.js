/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js?cb=woodland-delivery-20261006';
// Initiate the existing canonical owner before navigation's synchronous graph.
const earlyPreparationQuery=new URLSearchParams(globalThis.location?.search??'');
if(earlyPreparationQuery.get('visual')==='terrain-relief-v2' &&
  !['renderer-custody','water-index-span','water-attribution','ocean-presentation','ocean-proof'].some(key=>earlyPreparationQuery.get(key)==='v1') &&
  typeof globalThis.Worker==='function' &&
  globalThis.document?.getElementById?.('h-earth-3d-route-root')?.getAttribute?.('data-h-earth-public-route')==='functional-landscape' &&
  globalThis.document?.getElementById?.('h-earth-functional-landscape-route')){
  import('../render/live-render-package.run8e-r2.canonical.js?cb=woodland-delivery-20261006').catch(()=>{});
}
await import('../arrival-loader.js?cb=h-earth-bounded-progress-v1');
try {
  await import('./public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=mountain-traversal-20261006');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
