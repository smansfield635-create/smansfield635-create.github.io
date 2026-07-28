import { chromium } from 'playwright';
import fs from 'node:fs';

const baseURL = process.env.PRODUCTS_TEST_URL || 'http://127.0.0.1:4173/products/';
const outDir = 'verification/products-donor-browser-evidence';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true
});
const page = await context.newPage();
const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', error => consoleErrors.push(String(error)));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsControllerStatus === 'available');
await page.screenshot({ path: `${outDir}/01-primary-entry.png`, fullPage: true });

await page.click('[data-products-primary-entry]');
await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === 'CLUSTER_OPEN');
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/02-cluster-open.png`, fullPage: true });

const geometry = await page.evaluate(() => {
  const scene = document.querySelector('[data-products-scene]');
  const centerLayer = document.querySelector('[data-products-center-layer]');
  const planet = document.querySelector('[data-products-planet-mount]');
  const crystal = scene?.querySelector('canvas[data-products-crystals-canvas]');
  const semantic = document.querySelector('[data-products-semantic]');
  const control = document.querySelector('[data-products-center-control]');
  const primaryProduct = document.querySelector('[data-products-product][data-primary="true"]');
  const label = primaryProduct?.querySelector('.products-star__label');
  const box = element => element ? element.getBoundingClientRect().toJSON() : null;
  const z = element => element ? Number.parseInt(getComputedStyle(element).zIndex || '0', 10) : null;
  return {
    scene: box(scene),
    centerLayer: box(centerLayer),
    planet: box(planet),
    control: box(control),
    primaryProduct: box(primaryProduct),
    label: box(label),
    z: {
      centerLayer: z(centerLayer),
      crystal: z(crystal),
      semantic: z(semantic)
    },
    pointer: {
      planet: planet ? getComputedStyle(planet).pointerEvents : null,
      control: control ? getComputedStyle(control).pointerEvents : null,
      semantic: semantic ? getComputedStyle(semantic).pointerEvents : null
    },
    centerHidden: control?.hidden ?? true,
    returnHidden: document.querySelector('[data-products-return-main-compass]')?.hidden ?? true,
    url: location.pathname
  };
});

assert(geometry.centerLayer && geometry.planet && geometry.control, 'CENTER_GEOMETRY_MISSING');
assert(geometry.z.centerLayer === 2, `CENTER_LAYER_Z_INVALID:${geometry.z.centerLayer}`);
assert(geometry.z.crystal === 3, `CRYSTAL_LAYER_Z_INVALID:${geometry.z.crystal}`);
assert(geometry.z.semantic === 4, `SEMANTIC_LAYER_Z_INVALID:${geometry.z.semantic}`);
assert(geometry.pointer.planet === 'none', `PLANET_POINTER_AUTHORITY_INVALID:${geometry.pointer.planet}`);
assert(geometry.pointer.control === 'auto', `CENTER_CONTROL_POINTER_INVALID:${geometry.pointer.control}`);
assert(geometry.centerHidden === false, 'CENTER_CONTROL_NOT_AVAILABLE');
assert(geometry.returnHidden === true, 'RETURN_OPTION_PREOPENED');
assert(geometry.control.width <= 104, `CENTER_CONTROL_OVERSIZED:${geometry.control.width}`);
assert(geometry.planet.width <= 104, `PLANET_OVERSIZED:${geometry.planet.width}`);
assert(geometry.url === '/products/', `INITIAL_ROUTE_CHANGED:${geometry.url}`);

await page.click('[data-products-center-control]');
await page.waitForFunction(() => document.querySelector('[data-products-return-main-compass]')?.hidden === false);
await page.screenshot({ path: `${outDir}/03-main-compass-disclosed.png`, fullPage: true });

const disclosure = await page.evaluate(() => ({
  url: location.pathname,
  expanded: document.querySelector('[data-products-center-control]')?.getAttribute('aria-expanded'),
  returnHidden: document.querySelector('[data-products-return-main-compass]')?.hidden,
  state: document.querySelector('[data-page-id="products"]')?.dataset.productsState,
  disclosure: document.querySelector('[data-page-id="products"]')?.dataset.productsCenterDisclosure
}));
assert(disclosure.url === '/products/', `FIRST_TAP_NAVIGATED:${disclosure.url}`);
assert(disclosure.expanded === 'true', `CENTER_NOT_EXPANDED:${disclosure.expanded}`);
assert(disclosure.returnHidden === false, 'RETURN_OPTION_NOT_REVEALED');
assert(disclosure.state === 'CLUSTER_OPEN', `STATE_CHANGED_ON_DISCLOSURE:${disclosure.state}`);
assert(disclosure.disclosure === 'open', `DISCLOSURE_DATASET_INVALID:${disclosure.disclosure}`);

await page.click('[data-products-return-main-compass]');
await page.waitForURL(url => url.pathname === '/');
assert(new URL(page.url()).pathname === '/', `EXPLICIT_RETURN_FAILED:${page.url()}`);

fs.writeFileSync(`${outDir}/results.json`, JSON.stringify({
  status: 'PASS',
  baseURL,
  geometry,
  disclosure,
  consoleErrors
}, null, 2));

await browser.close();
console.log('PRODUCTS_DONOR_BROWSER_GATE_PASS');
