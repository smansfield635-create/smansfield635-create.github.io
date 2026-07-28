/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js';
try {
  await import('./public-live-gpu-integration.run8e-r3e.js');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
  await import('../diagnostic/run8e-r3d/interaction-acceptance.run8e.js');
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
