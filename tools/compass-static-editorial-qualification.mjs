// QUALIFICATION_RETRIGGER_STRENGTHENED_FALLBACK_HEAD_20260820
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const gen1537 = fs.readFileSync('assets/compass/compass.gen1537.recovery.js', 'utf8');
const capability = fs.readFileSync('assets/compass/compass.capability-carousel.js', 'utf8');
const capabilityCore = fs.readFileSync('assets/compass/compass.capability-carousel.core.js', 'utf8');
const crystals = fs.readFileSync('assets/compass/compass.crystals.js', 'utf8');
const trophyScene = fs.readFileSync('assets/compass/compass.trophy-scene.js', 'utf8');
const mediaRegistry = JSON.parse(fs.readFileSync('tools/ai-room-transport/ai-media-source-registry.v1.json', 'utf8'));

const fail = (message) => { throw new Error(message); };
const has = (needle, label = needle) => { if (!html.includes(needle)) fail(`missing: ${label}`); };
const absent = (needle, label = needle) => { if (html.includes(needle)) fail(`forbidden: ${label}`); };
const indexOf = (needle) => {
  const i = html.indexOf(needle);
  if (i < 0) fail(`cannot order missing marker: ${needle}`);
  return i;
};

has('DiamondGateBridge.com', 'brand treatment');
has('New here? Open the introduction.', 'collapsed Chapter One summary');
has('What is Diamond Gate Bridge?', 'Diamond Gate disclosure');
has('data-compass-scene', 'Compass scene');
has('Built Different', 'Built Different evidence');
has('data-capability-orbit="true"', 'static capability orbit');
has('data-first-paint-authority="static"', 'static first-paint authority');
has('data-capability="diagnostic"', 'static diagnostic capability');
has('data-capability="awards"', 'static awards capability');
has('data-capability="house"', 'static house capability');
has('data-human-brain', 'static brain portal anchor');
has('data-award-trophy', 'static trophy portal anchor');
has('data-house-scene', 'static house portal anchor');
absent('data-compass-capability-switcher', 'retired Track A capability placeholder');
has('class="compass-build-cta"', 'final custom build CTA section');
has('id="build-custom-title"', 'final custom build CTA title anchor');
has('Build Your Own Website', 'final custom build CTA title');
has('data-editorial-fallback="true"', 'keyboard-accessible destination fallback');
has('<summary>All destinations</summary>', 'collapsed destination fallback summary');
absent('The Compass exposes the same destinations to keyboard, touch, pointer, and reduced-motion users.', 'legacy bottom disclosure');

const finalMaster = mediaRegistry?.sources?.CHAPTER_01_FINAL_AWARDS_LIVE_MASTER_V1;
if (!finalMaster) fail('missing governing CHAPTER_01_FINAL_AWARDS_LIVE_MASTER_V1 registry entry');
if (finalMaster.ownerApproved !== true) fail('Chapter One final master is not owner-approved');
if (finalMaster.expectedDurationSeconds !== 65.0) fail(`Chapter One final master duration is not 65s: ${finalMaster.expectedDurationSeconds}`);
if (finalMaster.expectedSha256 !== '9be6d48d6a8ceeb6d26a64d12440f929ce7f9bac9b6b48bad301ef9a3f6d881f') fail('Chapter One final master SHA identity drifted');
if (finalMaster.livePromotionTarget !== 'showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4') fail('Chapter One final live promotion target drifted');
has('/' + finalMaster.livePromotionTarget, 'owner-approved 65-second Chapter One Awards live master');

const compassAt = indexOf('data-compass-scene');
const builtAt = indexOf('Built Different');
const capabilityAt = indexOf('data-capability-orbit="true"');
const ctaAt = indexOf('class="compass-build-cta"');
if (!(compassAt < builtAt && builtAt < capabilityAt && capabilityAt < ctaAt)) {
  fail(`editorial order invalid: ${JSON.stringify({compassAt,builtAt,capabilityAt,ctaAt})}`);
}

absent('<summary>Why Diamond Gate exists</summary>', 'legacy Why Diamond Gate exists disclosure');
absent('compass.track-b.js', 'Track B runtime loader');
absent('positionCapability(', 'post-load capability reparenting');
absent('positionTrackBPlaceholder(', 'Track B placeholder reparenting');
if (capability.includes('POST_LOAD_ENHANCEMENT_DELAY_MS')) fail('capability loader regained post-load enhancement delay');
if (capabilityCore.includes('legacy.replaceWith(stage)')) fail('capability core regained visible legacy owner replacement');
if (!capability.includes('[data-capability-orbit][data-first-paint-authority="static"]')) fail('capability loader does not require static first-paint shell');
if (!capabilityCore.includes('[data-capability-orbit][data-first-paint-authority="static"]')) fail('capability core does not bind static first-paint shell');

for (const required of ['mounted:false','retired:true','authoritative:false','capabilityPlacementAuthority:false','repeatedReparenting:false']) {
  if (!gen1537.includes(required)) fail(`Gen1537 contract missing ${required}`);
}
for (const forbidden of ['positionCapability(', 'requestAnimationFrame(positionCapability)', 'MutationObserver']) {
  if (gen1537.includes(forbidden)) fail(`Gen1537 regained forbidden presentation behavior: ${forbidden}`);
}
if (!gen1537.includes("'/showroom/globe/h-earth/'")) fail('Gen1537 lost canonical H-Earth route');

if (!(html.includes('Swipe to rotate.') || capability.includes('Swipe to rotate.') || capabilityCore.includes('Swipe to rotate.'))) fail('Track A capability guidance floor changed');
if (capability.includes('compass.track-b.js') || capabilityCore.includes('compass.track-b.js')) fail('Track A capability runtime dynamically loads Track B');

if (!crystals.includes('COMPASS_CRYSTAL_CONTINUOUS_NORMAL_MOTION_v1')) fail('crystal liveness repair missing');
if (!crystals.includes('if (!state.reducedMotion) return true;')) fail('normal-motion continuous frame contract missing');
if (!crystals.includes('state.reducedMotion')) fail('reduced-motion branch missing');

for (const required of [
  "trophyRenderer:'procedural-webgl-v8-integrated-recessed-plaque'",
  "canvas.dataset.trophyFrames='1'",
  'fallback:false',
  'fallback:true',
  "window.CompassTrophyScene=Object.freeze"
]) {
  if (!trophyScene.includes(required)) fail(`trophy runtime contract missing ${required}`);
}
if (!trophyScene.includes("field?.classList.remove('is-fallback'")) fail('approved trophy renderer does not retire fallback presentation ownership');
if (!trophyScene.includes("fallback.style.setProperty('display','none','important')")) fail('approved trophy renderer does not suppress fallback surface');

console.log(JSON.stringify({
  result: 'STATIC_EDITORIAL_SOURCE_PASS',
  order: {compassAt,builtAt,capabilityAt,ctaAt},
  chapterOne: {
    role: finalMaster.executionRole,
    durationSeconds: finalMaster.expectedDurationSeconds,
    expectedSha256: finalMaster.expectedSha256,
    livePromotionTarget: finalMaster.livePromotionTarget
  },
  accessibilityFallback: 'collapsed-keyboard-accessible',
  crystalLiveness: 'continuous-normal-motion-settle-reduced-motion',
  gen1537: 'retired-route-only',
  trackA: 'static-object-carousel-first-paint-authority',
  trophyRuntime: 'approved-webgl-renderer-required-fallback-not-success'
}, null, 2));
