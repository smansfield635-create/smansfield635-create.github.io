import { chromium } from 'playwright';
import crypto from 'node:crypto';

const base = process.env.COMPASS_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({headless:true});
const viewports = {
  desktop:{width:1440,height:1100},
  tablet:{width:900,height:1000},
  phone:{width:412,height:915}
};
const receipts = {};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function visibleEnabled(locator) {
  if (await locator.count() !== 1) return false;
  if (!(await locator.isVisible())) return false;
  if (!(await locator.isEnabled())) return false;
  const box = await locator.boundingBox();
  if (!box || box.width < 2 || box.height < 2) return false;
  const hit = await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const top = document.elementFromPoint(x,y);
    return Boolean(top && (top === el || el.contains(top)));
  });
  return hit;
}

async function capabilitySnapshot(orbit) {
  return orbit.evaluate(el => ({
    index:el.dataset.orbitIndex||el.dataset.index||'',
    text:el.innerText,
    selected:[...el.querySelectorAll('[aria-selected]')].map(x => `${x.id||x.textContent?.trim()}:${x.getAttribute('aria-selected')}`),
    transforms:[...el.querySelectorAll('[data-capability-choice],article,a')].slice(0,8).map(x => getComputedStyle(x).transform)
  }));
}

for (const [name, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({viewport, reducedMotion:'no-preference'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForTimeout(900);

  const root = page.locator('[data-compass-root]').first();
  const scene = page.locator('[data-compass-scene]').first();
  if (await scene.count() !== 1) throw new Error(`${name}: Compass scene missing`);
  const box = await scene.boundingBox();
  if (!box || box.height < 430) throw new Error(`${name}: Compass scene below protected 430px floor: ${box?.height||0}`);

  const initial = await root.getAttribute('data-compass-mode');
  if (initial !== 'CONSTELLATION') throw new Error(`${name}: initial Compass mode ${initial}`);

  const cx = box.x + box.width * 0.52;
  const cy = box.y + box.height * 0.52;
  await page.mouse.move(cx,cy);
  await page.mouse.down();
  await page.mouse.move(cx - Math.min(110,box.width*0.2),cy,{steps:8});
  await page.mouse.up();
  await page.waitForTimeout(450);
  const postDrag = await root.evaluate(el => ({
    mode:el.dataset.compassMode,
    orbitIndex:el.dataset.compassOrbitIndex,
    readable:el.dataset.readableCardinal,
    foreground:el.dataset.renderedForegroundCardinal
  }));
  if (postDrag.mode !== 'CONSTELLATION') throw new Error(`${name}: drag broke constellation mode ${JSON.stringify(postDrag)}`);

  const cardinalCandidates = page.locator('[data-compass-cardinal]');
  let openedCardinal = '';
  for (let i = 0; i < await cardinalCandidates.count(); i += 1) {
    const candidate = cardinalCandidates.nth(i);
    if (!(await visibleEnabled(candidate))) continue;
    openedCardinal = await candidate.getAttribute('data-cardinal-id') || `index-${i}`;
    await candidate.click();
    await page.waitForTimeout(550);
    break;
  }
  if (!openedCardinal) throw new Error(`${name}: no cardinal is genuinely pointer-hit-testable`);

  const cluster = await root.evaluate(el => ({
    mode:el.dataset.compassMode,
    wing:el.dataset.activeClusterWing||el.dataset.selectedWing||'',
    primary:el.dataset.clusterPrimaryRoom||'',
    preview:el.dataset.clusterPreviewPrimaryRoom||''
  }));
  if (!['CLUSTER_OPEN','ROOM_SELECTED'].includes(cluster.mode)) throw new Error(`${name}: real cardinal click did not open Track A cluster ${JSON.stringify(cluster)}`);

  const back = page.locator('[data-compass-return-to-orbit]').first();
  let returnPath = 'not-exposed';
  if (await visibleEnabled(back)) {
    await back.click();
    await page.waitForTimeout(400);
    const returned = await root.getAttribute('data-compass-mode');
    if (returned !== 'CONSTELLATION') throw new Error(`${name}: visible Return to Orbit failed: ${returned}`);
    returnPath = 'visible-control';
  } else {
    const activeCardinal = page.locator(`[data-compass-cardinal][data-cardinal-id="${cluster.wing || openedCardinal}"]`).first();
    if (await visibleEnabled(activeCardinal)) {
      await activeCardinal.click();
      await page.waitForTimeout(400);
      const returned = await root.getAttribute('data-compass-mode');
      if (returned === 'CONSTELLATION') returnPath = 'controller-cardinal-toggle';
    }
  }

  const orbit = page.locator('[data-capability-orbit]').first();
  if (await orbit.count() !== 1) throw new Error(`${name}: Track A capability orbit not mounted`);
  const arrows = await orbit.locator('[data-orbit-next],[data-orbit-previous]').count();
  if (arrows !== 0) throw new Error(`${name}: protected swipe-only carousel gained arrow controls (${arrows})`);
  const guidance = (await orbit.locator('.compass-capability-guidance').first().textContent() || '').trim();
  if (guidance !== 'Swipe to rotate.') throw new Error(`${name}: capability guidance changed: ${JSON.stringify(guidance)}`);
  const before = await capabilitySnapshot(orbit);
  const obox = await orbit.boundingBox();
  if (!obox) throw new Error(`${name}: capability orbit has no rendered bounds`);
  const ox = obox.x + obox.width*0.72;
  const oy = obox.y + Math.min(obox.height*0.5,220);
  await page.mouse.move(ox,oy);
  await page.mouse.down();
  await page.mouse.move(ox-Math.min(130,obox.width*0.3),oy,{steps:9});
  await page.mouse.up();
  await page.waitForTimeout(650);
  const after = await capabilitySnapshot(orbit);
  const carouselChanged = before.index !== after.index || before.text !== after.text || JSON.stringify(before.selected)!==JSON.stringify(after.selected) || JSON.stringify(before.transforms)!==JSON.stringify(after.transforms);
  if (!carouselChanged) throw new Error(`${name}: capability swipe produced no observable index/content/selection/geometry change`);

  const hEarth = await page.locator('[data-compass-room][data-label="H-Earth"]').first().evaluate(el => ({href:el.getAttribute('href'),route:el.dataset.route}));
  if (hEarth.href !== '/showroom/globe/h-earth/' || hEarth.route !== '/showroom/globe/h-earth/') throw new Error(`${name}: H-Earth route regression ${JSON.stringify(hEarth)}`);
  const gen = await page.evaluate(() => globalThis.DGB_COMPASS_GEN1537_LIVE_RECOVERY?.receipt?.() || null);
  if (!gen || gen.mounted!==false || gen.retired!==true || gen.authoritative!==false || gen.capabilityPlacementAuthority!==false || gen.repeatedReparenting!==false) throw new Error(`${name}: Gen1537 regained authority ${JSON.stringify(gen)}`);

  const crystalMount = page.locator('[data-compass-crystals-mount]').first();
  if (await crystalMount.count() !== 1 || !(await crystalMount.isVisible())) throw new Error(`${name}: interactive crystal mount missing or invisible`);
  await page.waitForTimeout(Math.max(0,2000 - 900));
  const crystal2 = hash(await crystalMount.screenshot());
  await page.waitForTimeout(6000);
  const crystal8 = hash(await crystalMount.screenshot());
  await page.waitForTimeout(7000);
  const crystal15 = hash(await crystalMount.screenshot());
  if (new Set([crystal2,crystal8,crystal15]).size < 2) throw new Error(`${name}: crystal layer is visually static through 15s under normal motion`);

  const background = await context.newPage();
  await background.goto('about:blank');
  await background.bringToFront();
  await page.waitForTimeout(900);
  await page.bringToFront();
  await page.waitForTimeout(400);
  await background.close();

  if (errors.length) throw new Error(`${name}: browser errors: ${errors.join(' | ')}`);

  const reduceContext = await browser.newContext({viewport, reducedMotion:'reduce'});
  const reduced = await reduceContext.newPage();
  await reduced.goto(base,{waitUntil:'networkidle'});
  await reduced.waitForTimeout(1600);
  const reducedState = await reduced.locator('[data-compass-root]').evaluate(el => ({
    dataset:el.dataset.reducedMotion,
    media:matchMedia('(prefers-reduced-motion: reduce)').matches,
    mode:el.dataset.compassMode
  }));
  if (!reducedState.media) throw new Error(`${name}: reduced-motion emulation was not active`);
  if (String(reducedState.dataset).toLowerCase() !== 'true') throw new Error(`${name}: product did not acknowledge reduced motion ${JSON.stringify(reducedState)}`);
  await reduceContext.close();

  receipts[name] = {
    sceneHeight:box.height,
    postDrag,
    openedCardinal,
    cluster,
    returnPath,
    guidance,
    carouselChanged,
    crystalHashes:{t2:crystal2,t8:crystal8,t15:crystal15},
    reducedState,
    hEarth,
    gen
  };
  await context.close();
}

await browser.close();
console.log(JSON.stringify({result:'TRACK_A_INTERACTION_AND_SUSTAINED_CRYSTAL_PASS',receipts},null,2));
