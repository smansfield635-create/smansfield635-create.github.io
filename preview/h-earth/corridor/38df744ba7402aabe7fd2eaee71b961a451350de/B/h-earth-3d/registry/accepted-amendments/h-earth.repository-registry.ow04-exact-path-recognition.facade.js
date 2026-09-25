/**
 * OW04 exact-path recognition full compatibility facade.
 *
 * Preserves every read-only function exposed by the OW03 predecessor facade
 * and overlays only the OW04 exact-path resolution functions. No authority is
 * created by this compatibility layer.
 */
import predecessorFacade from './h-earth.repository-registry.ow03-experience-anchor-evidence-path-recognition.js';
import ow04Facade from './h-earth.repository-registry.ow04-exact-path-recognition.js';

const facade = Object.freeze({
  ...predecessorFacade,
  ...ow04Facade
});

export default facade;
