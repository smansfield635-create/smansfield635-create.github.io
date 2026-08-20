import { chromium } from 'playwright';

const base = process.env.COMPASS_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({headless:true});
const viewports = {
  desktop:{width:1440,height:1100},
  tablet:{width:900,height:1000},
  phone:{width:412,height:915}
};
const receipts = {};

for (const [name, viewport] of Object.entries(viewports)) {
  const page = await browser.newPage({viewport});
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForTimeout(900);

  const scene = page.locator('[data-compass-scene]').first();
  if (await scene.count() !== 1) throw new Error(`${name}: Compass scene missing`);
  const box = await scene.boundingBox();
  if (!box || box.height < 430) throw new Error(`${name}: Compass scene below protected 430px floor: ${box?.height||0}`);

  const initial = await page.locator('[data-compass-root]').getAttribute('data-compass-mode');
  if (initial !== 'CONSTELLATION') throw new Error(`${name}: initial Compass mode ${initial}`);

  // Exercise the existing Track A constellation input without assuming a presentation-specific star position.
  const cx = box.x + box.width * 0.52;
  const cy = box.y + box.height * 0.52;
  await page.mouse.move(cx,cy);
  await page.mouse.down();
  await page.mouse.move(cx - Math.min(110,box.width*0.2),cy,{steps:8});
  await page.mouse.up();
  await page.waitForTimeout(450);
  const postDrag = await page.locator('[data-compass-root]').evaluate(root => ({
    mode:root.dataset.compassMode,
    orbitIndex:root.dataset.compassOrbitIndex,
    readable:root.dataset.readableCardinal,
    foreground:root.dataset.renderedForegroundCardinal
  }));
  if (postDrag.mode !== 'CONSTELLATION') throw new Error(`${name}: drag broke constellation mode ${JSON.stringify(postDrag)}`);

  // Open a semantic cardinal through the existing controller and confirm a cluster is produced.
  const east = page.locator('[data-compass-cardinal][data-cardinal-id="east"]');
  await east.click({force:true});
  await page.waitForTimeout(550);
  const cluster = await page.locator('[data-compass-root]').evaluate(root => ({
    mode:root.dataset.compassMode,
    wing:root.dataset.activeClusterWing||root.dataset.selectedWing||'',
    primary:root.dataset.clusterPrimaryRoom||'',
    preview:root.dataset.clusterPreviewPrimaryRoom||''
  }));
  if (!['CLUSTER_OPEN','ROOM_SELECTED'].includes(cluster.mode)) throw new Error(`${name}: cardinal did not open Track A cluster ${JSON.stringify(cluster)}`);

  // Return to orbit using the existing controller surface if available.
  const back = page.locator('[data-compass-return-to-orbit]');
  if (await back.count()) {
    await back.click({force:true});
    await page.waitForTimeout(400);
    const returned = await page.locator('[data-compass-root]').getAttribute('data-compass-mode');
    if (returned !== 'CONSTELLATION') throw new Error(`${name}: Return to Orbit failed: ${returned}`);
  }

  // Existing Track A capability carousel must remain the interaction owner: no arrow controls, swipe guidance, rotation changes state.
  const orbit = page.locator('[data-capability-orbit]').first();
  if (await orbit.count() !== 1) throw new Error(`${name}: Track A capability orbit not mounted`);
  const arrows = await orbit.locator('[data-orbit-next],[data-orbit-previous]').count();
  if (arrows !== 0) throw new Error(`${name}: protected swipe-only carousel gained arrow controls (${arrows})`);
  const guidance = (await orbit.locator('.compass-capability-guidance').first().textContent() || '').trim();
  if (guidance !== 'Swipe to rotate.') throw new Error(`${name}: capability guidance changed: ${JSON.stringify(guidance)}`);
  const before = await orbit.evaluate(el => ({index:el.dataset.orbitIndex||el.dataset.index||'', text:el.innerText}));
  const obox = await orbit.boundingBox();
  if (!obox) throw new Error(`${name}: capability orbit has no rendered bounds`);
  const ox = obox.x + obox.width*0.72, oy = obox.y + Math.min(obox.height*0.5,220);
  await page.mouse.move(ox,oy); await page.mouse.down(); await page.mouse.move(ox-Math.min(130,obox.width*0.3),oy,{steps:9}); await page.mouse.up();
  await page.waitForTimeout(650);
  const after = await orbit.evaluate(el => ({index:el.dataset.orbitIndex||el.dataset.index||'', text:el.innerText}));
  if (before.index && after.index && before.index === after.index) throw new Error(`${name}: capability swipe did not rotate (${before.index})`);

  // H-Earth must remain canonical and Gen1537 must remain retired/non-authoritative.
  const hEarth = await page.locator('[data-compass-room][data-label="H-Earth"]').first().evaluate(el => ({href:el.getAttribute('href'),route:el.dataset.route}));
  if (hEarth.href !== '/showroom/globe/h-earth/' || hEarth.route !== '/showroom/globe/h-earth/') throw new Error(`${name}: H-Earth route regression ${JSON.stringify(hEarth)}`);
  const gen = await page.evaluate(() => globalThis.DGB_COMPASS_GEN1537_LIVE_RECOVERY?.receipt?.() || null);
  if (!gen || gen.mounted!==false || gen.retired!==true || gen.authoritative!==false || gen.capabilityPlacementAuthority!==false || gen.repeatedReparenting!==false) throw new Error(`${name}: Gen1537 regained authority ${JSON.stringify(gen)}`);

  if (errors.length) throw new Error(`${name}: browser errors: ${errors.join(' | ')}`);
  receipts[name] = {sceneHeight:box.height,postDrag,cluster,guidance,hEarth,gen};
  await page.close();
}

await browser.close();
console.log(JSON.stringify({result:'TRACK_A_INTERACTION_PASS',receipts},null,2));
