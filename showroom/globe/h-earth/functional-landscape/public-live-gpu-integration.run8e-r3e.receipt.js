/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js?cb=fd66e9719b883594';
await import('../arrival-loader.js?cb=adc56ba904a45b50');
try {
  await import('./public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=c23884f63c776088');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
