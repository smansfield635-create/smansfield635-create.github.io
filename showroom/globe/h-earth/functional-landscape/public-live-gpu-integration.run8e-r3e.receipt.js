/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js?cb=91af5719a8c41be8';
await import('../arrival-loader.js?cb=h-earth-bounded-progress-v1');
try {
  await import('./public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=254702c4102c4d7c');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
