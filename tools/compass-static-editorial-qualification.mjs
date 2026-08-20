import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const gen1537 = fs.readFileSync('assets/compass/compass.gen1537.recovery.js', 'utf8');
const capability = fs.readFileSync('assets/compass/compass.capability-carousel.js', 'utf8');

const fail = (message) => { throw new Error(message); };
const has = (needle, label = needle) => { if (!html.includes(needle)) fail(`missing: ${label}`); };
const absent = (needle, label = needle) => { if (html.includes(needle)) fail(`forbidden: ${label}`); };
const indexOf = (needle) => {
  const i = html.indexOf(needle);
  if (i < 0) fail(`cannot order missing marker: ${needle}`);
  return i;
};

// Editorial result requirements.
has('DiamondGateBridge.com', 'brand treatment');
has('New here? Open the introduction.', 'collapsed Chapter One summary');
has('What is Diamond Gate Bridge?', 'Diamond Gate disclosure');
has('diamond-gate-compass-mirrorland-36s.mp4', 'Chapter One film');
has('data-compass-scene', 'Compass scene');
has('Built Different', 'Built Different evidence');
has('data-compass-capability-switcher', 'Track A capability placeholder');
has('Build Your Own Custom Site', 'final custom build CTA');

// Static source order: Compass -> Built Different -> capability -> final CTA.
const compassAt = indexOf('data-compass-scene');
const builtAt = indexOf('Built Different');
const capabilityAt = indexOf('data-compass-capability-switcher');
const ctaAt = indexOf('Build Your Own Custom Site');
if (!(compassAt < builtAt && builtAt < capabilityAt && capabilityAt < ctaAt)) {
  fail(`editorial order invalid: ${JSON.stringify({compassAt,builtAt,capabilityAt,ctaAt})}`);
}

// Flagship clutter must not remain visible in the editorial document.
absent('class="compass-selective-routes"', 'legacy selected-route directory');
absent('The Compass exposes the same destinations to keyboard, touch, pointer, and reduced-motion users.', 'legacy bottom disclosure paragraph');

// The old standalone explanation must not remain the dominant heading.
absent('<summary>Why Diamond Gate exists</summary>', 'legacy Why Diamond Gate exists disclosure');

// Track B implementation must stay dead.
absent('compass.track-b.js', 'Track B runtime loader');
absent('positionCapability(', 'post-load capability reparenting');
absent('positionTrackBPlaceholder(', 'Track B placeholder reparenting');

// Gen1537 can route H-Earth only; it cannot own Compass presentation.
for (const required of ['mounted:false','retired:true','authoritative:false','capabilityPlacementAuthority:false','repeatedReparenting:false']) {
  if (!gen1537.includes(required)) fail(`Gen1537 contract missing ${required}`);
}
for (const forbidden of ['positionCapability(', 'requestAnimationFrame(positionCapability)', 'MutationObserver']) {
  if (gen1537.includes(forbidden)) fail(`Gen1537 regained forbidden presentation behavior: ${forbidden}`);
}
if (!gen1537.includes("'/showroom/globe/h-earth/'")) fail('Gen1537 lost canonical H-Earth route');

// Track A capability core remains the owner. Qualification does not demand implementation edits here.
if (!capability.includes('Swipe to rotate.')) fail('Track A capability guidance floor changed');
if (capability.includes('compass.track-b.js')) fail('Track A capability runtime dynamically loads Track B');

console.log(JSON.stringify({
  result: 'STATIC_EDITORIAL_SOURCE_PASS',
  order: {compassAt,builtAt,capabilityAt,ctaAt},
  gen1537: 'retired-route-only',
  trackA: 'protected'
}, null, 2));
