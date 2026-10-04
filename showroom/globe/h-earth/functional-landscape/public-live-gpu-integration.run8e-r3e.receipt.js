/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js?cb=3484866a4f3879ca';
await import('../arrival-loader.js');
try {
  await import('./public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=063138748db11d24');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
