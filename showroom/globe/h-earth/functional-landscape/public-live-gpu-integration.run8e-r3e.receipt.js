/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 integration wrapper */
import '../diagnostic/renderer-startup-observer.v1.js';
await import('../arrival-loader.js');
const releaseArrivalLoaderAtReady = event => {
  if (event.detail?.stages?.READY_PUBLISHED !== 'PASS') return;
  window.removeEventListener('h-earth-renderer-startup-receipt', releaseArrivalLoaderAtReady);
  const loader = document.querySelector('.h-earth-experience-loader');
  if (!loader) return;
  loader.dataset.ready = 'true';
  loader.style.transition = 'none';
  loader.style.display = 'none';
};
window.addEventListener('h-earth-renderer-startup-receipt', releaseArrivalLoaderAtReady);
try {
  await import('./public-live-gpu-integration.run8e-r3e.js');
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.constructorReturned();
} catch (error) {
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.fail('RENDERER_CONSTRUCTOR_RETURNED', error);
  throw error;
}
