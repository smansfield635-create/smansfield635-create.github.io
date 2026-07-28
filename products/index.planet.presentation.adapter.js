/* /products/index.planet.presentation.adapter.js
   PRODUCTS_CENTER_PLANET_VISIBLE_PRESENTATION_HOTFIX_v1
   Bounded presentation adapter: enlarges the actual center-planet projection and
   suppresses only the planet halo pass. It does not alter the Products cluster,
   its large orbital path, product geometry, controller, routes, or gestures.
*/
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_CENTER_PLANET_PRESENTATION_ADAPTER";
  const PARTICIPANT_KEY = "DGB_LAWS_PLANET_WORLD_PARTICIPANT";
  const SCALE = 2.15;

  if (globalThis[MODULE]?.initialized) return;

  let wrappedParticipant = null;
  let suppressedHaloPasses = 0;
  let scaledSurfacePasses = 0;

  function wrap(source) {
    if (!source || typeof source.draw !== "function") return source;
    if (source.__productsCenterPlanetPresentationWrapped === true) return source;

    return new Proxy(source, {
      get(target, property, receiver) {
        if (property === "__productsCenterPlanetPresentationWrapped") return true;
        if (property === "draw") {
          return options => {
            if (options?.haloPass === true) {
              suppressedHaloPasses += 1;
              return true;
            }

            const projectionMatrix = Array.isArray(options?.projectionMatrix)
              ? options.projectionMatrix.slice()
              : options?.projectionMatrix;

            if (Array.isArray(projectionMatrix) && projectionMatrix.length >= 6) {
              projectionMatrix[0] *= SCALE;
              projectionMatrix[5] *= SCALE;
              scaledSurfacePasses += 1;
            }

            return target.draw({ ...options, projectionMatrix });
          };
        }

        const value = Reflect.get(target, property, receiver);
        return typeof value === "function" ? value.bind(target) : value;
      }
    });
  }

  wrappedParticipant = wrap(globalThis[PARTICIPANT_KEY] || null);

  Object.defineProperty(globalThis, PARTICIPANT_KEY, {
    configurable: true,
    enumerable: true,
    get() {
      return wrappedParticipant;
    },
    set(value) {
      wrappedParticipant = wrap(value);
    }
  });

  globalThis[MODULE] = Object.freeze({
    initialized: true,
    contract: "PRODUCTS_CENTER_PLANET_VISIBLE_PRESENTATION_HOTFIX_v1",
    renderedPlanetScale: SCALE,
    planetHaloPassSuppressed: true,
    largeProductsOrbitPreserved: true,
    ownsClusterGeometry: false,
    ownsProductGeometry: false,
    ownsNavigation: false,
    receipt: () => Object.freeze({
      contract: "PRODUCTS_CENTER_PLANET_VISIBLE_PRESENTATION_HOTFIX_v1",
      renderedPlanetScale: SCALE,
      planetHaloPassSuppressed: true,
      largeProductsOrbitPreserved: true,
      suppressedHaloPasses,
      scaledSurfacePasses,
      participantAvailable: Boolean(wrappedParticipant),
      visualAcceptanceClaimed: false
    })
  });
})();
