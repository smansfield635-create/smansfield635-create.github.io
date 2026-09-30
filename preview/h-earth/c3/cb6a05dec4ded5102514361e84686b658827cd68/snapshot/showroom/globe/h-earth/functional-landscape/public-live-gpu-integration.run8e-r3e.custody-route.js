/** H_EARTH_DEDICATED_RENDERER_CUSTODY_ROUTE_v1 */
import '../diagnostic/renderer-startup-observer.v1.js';
await import('../arrival-loader.js?v=dedicated-custody-v2');
try {
  globalThis.H_EARTH_DEDICATED_RENDERER_CUSTODY = true;
  await import('./public-live-gpu-integration.run8e-r3e.custody-route-integration.js?v=dedicated-custody-v2');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
