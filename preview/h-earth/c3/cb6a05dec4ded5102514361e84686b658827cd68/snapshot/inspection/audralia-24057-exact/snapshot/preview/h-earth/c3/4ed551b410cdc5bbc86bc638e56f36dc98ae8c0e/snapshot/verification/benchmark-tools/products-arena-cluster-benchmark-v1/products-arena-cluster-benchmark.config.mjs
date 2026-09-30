const freeze = value => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freeze(child);
  return Object.freeze(value);
};

export const TOOL_ID = "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1";
export const ORIGIN = process.env.PRODUCTS_ARENA_ORIGIN || "http://127.0.0.1:4173";

export const PROFILES = freeze({
  PHONE_COMPACT: { width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  PHONE_REFERENCE: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  TABLET: { width: 820, height: 1180, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true },
  DESKTOP: { width: 1440, height: 1100, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
});

export const PRODUCTS = freeze([
  { id: "archcoin", route: "/products/archcoin/" },
  { id: "five-flags", route: "/products/five-flags/" },
  { id: "aai", route: "/products/on-your-side-ai/" },
  { id: "education", route: "/products/education/" },
  { id: "nutrition", route: "/products/nutrition/" },
  { id: "book", route: "/nine-summits-of-love/" }
]);

export const SELECTORS = freeze({
  root: '[data-page-id="products"]',
  scene: '[data-products-scene]',
  primary: '[data-products-primary-entry]',
  products: '[data-products-product]',
  centerControl: '[data-products-center-control]',
  planetMount: '[data-products-planet-mount]',
  planetVisual: '[data-products-planet-canvas], [data-products-planet-fallback]',
  cosmos: '[data-products-cosmic-field]',
  cosmosCanvases: 'canvas[data-products-cosmos-canvas]',
  crystalsCanvas: 'canvas[data-products-crystals-canvas]',
  enterProduct: '[data-products-enter]',
  returnToOrbit: '[data-products-return-to-orbit]'
});

export const OUTPUTS = freeze({
  receipt: "products-arena-cluster-benchmark-v1.json",
  screenshots: "products-arena-cluster-benchmark-v1-screenshots"
});
