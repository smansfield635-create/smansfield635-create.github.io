const mount = document.querySelector('[data-community-lifecycle-mount]');

if (mount) {
  renderCommunityLogo(mount).catch((error) => {
    console.error('COMMUNITY_LOGO_PRODUCTION_FAILED', error);
    mount.replaceChildren(buildFallback());
  });
}

async function renderCommunityLogo(root) {
  const response = await fetch('./community-logo.topology.v1.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`TOPOLOGY_HTTP_${response.status}`);

  const topology = await response.json();
  const svg = buildLogo(topology);

  root.classList.add('campaign-hero__media--native', 'community-logo-production');
  root.setAttribute('aria-label', 'Consider the Energy community tree emblem');
  root.replaceChildren(svg);
}

function buildLogo(topology) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 1152 1536');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'community-logo-title community-logo-desc');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.maxHeight = '36rem';
  svg.style.display = 'block';
  svg.style.filter = 'drop-shadow(0 24px 42px rgba(0,0,0,.5))';

  const title = node(NS, 'title', { id: 'community-logo-title' }, 'Consider the Energy community tree');
  const desc = node(NS, 'desc', { id: 'community-logo-desc' }, 'A topology-driven tree emblem with ten crown branches, sixteen roots, and six side motifs on a dark luminous stage.');
  const defs = buildDefs(NS);
  svg.append(title, desc, defs);

  const stage = node(NS, 'g', { 'aria-hidden': 'true' });
  stage.append(
    node(NS, 'rect', { x: 72, y: 64, width: 1008, height: 1408, rx: 82, fill: 'url(#stage-bg)', stroke: 'rgba(255,255,255,.12)', 'stroke-width': 2 }),
    node(NS, 'ellipse', { cx: 576, cy: 674, rx: 430, ry: 520, fill: 'url(#stage-aura)', opacity: .72 }),
    node(NS, 'circle', { cx: 576, cy: 641, r: 282, fill: 'none', stroke: 'url(#halo-stroke)', 'stroke-width': 2, opacity: .26 }),
    node(NS, 'circle', { cx: 576, cy: 641, r: 350, fill: 'none', stroke: 'url(#halo-stroke)', 'stroke-width': 1.25, opacity: .12 })
  );

  for (const [x, y, r, a] of STAR_POINTS) {
    stage.append(node(NS, 'circle', { cx: x, cy: y, r, fill: '#fff6d8', opacity: a }));
  }

  svg.append(stage);

  const art = node(NS, 'g', { 'aria-hidden': 'true' });
  const origin = topology.origin.point_px;
  const branchEntries = Object.entries(topology.branches);
  const rootEntries = Object.entries(topology.roots);
  const motifEntries = Object.entries(topology.motifs);

  art.append(buildCanopy(NS, branchEntries));
  art.append(buildRoots(NS, origin, rootEntries));
  art.append(buildTrunk(NS, origin));
  art.append(buildBranches(NS, origin, branchEntries));
  art.append(buildMotifs(NS, motifEntries));
  art.append(buildCore(NS, origin));

  svg.append(art);
  svg.append(buildCaption(NS));
  return svg;
}

function buildDefs(NS) {
  const defs = node(NS, 'defs');
  defs.innerHTML = `
    <linearGradient id="stage-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#08111f"/>
      <stop offset=".5" stop-color="#030710"/>
      <stop offset="1" stop-color="#010308"/>
    </linearGradient>
    <radialGradient id="stage-aura" cx="50%" cy="42%" r="58%">
      <stop offset="0" stop-color="#f3c86f" stop-opacity=".18"/>
      <stop offset=".46" stop-color="#79cfff" stop-opacity=".07"/>
      <stop offset="1" stop-color="#02040a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6f3c1c"/>
      <stop offset=".45" stop-color="#b16e34"/>
      <stop offset="1" stop-color="#4a2514"/>
    </linearGradient>
    <linearGradient id="wood-light" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e3a85f" stop-opacity=".25"/>
      <stop offset=".5" stop-color="#ffe4a1" stop-opacity=".7"/>
      <stop offset="1" stop-color="#e3a85f" stop-opacity=".18"/>
    </linearGradient>
    <radialGradient id="canopy-gold">
      <stop offset="0" stop-color="#ffd77e" stop-opacity=".42"/>
      <stop offset=".55" stop-color="#be7d28" stop-opacity=".22"/>
      <stop offset="1" stop-color="#2a1807" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="canopy-cyan">
      <stop offset="0" stop-color="#82e8ff" stop-opacity=".24"/>
      <stop offset=".62" stop-color="#2f7796" stop-opacity=".12"/>
      <stop offset="1" stop-color="#031019" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="root-stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d4964e" stop-opacity=".92"/>
      <stop offset="1" stop-color="#6b361d" stop-opacity=".42"/>
    </linearGradient>
    <linearGradient id="branch-stroke" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#7c421f"/>
      <stop offset=".72" stop-color="#c68442"/>
      <stop offset="1" stop-color="#f0bb6f"/>
    </linearGradient>
    <linearGradient id="halo-stroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3c86f"/>
      <stop offset="1" stop-color="#79cfff"/>
    </linearGradient>
    <filter id="soft-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="tiny-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  return defs;
}

function buildCanopy(NS, branches) {
  const group = node(NS, 'g', { opacity: .95 });
  const clusters = branches.map(([id, value], index) => {
    const [x, y] = value.point_px;
    const outer = index % 2 === 0 ? 'url(#canopy-gold)' : 'url(#canopy-cyan)';
    const rx = 116 + (index % 3) * 17;
    const ry = 94 + ((index + 1) % 3) * 16;
    return node(NS, 'ellipse', { cx: x, cy: y - 10, rx, ry, fill: outer, opacity: .78, 'data-branch-anchor': id });
  });
  clusters.forEach((cluster) => group.append(cluster));

  group.append(
    node(NS, 'ellipse', { cx: 558, cy: 505, rx: 306, ry: 232, fill: 'url(#canopy-gold)', opacity: .45 }),
    node(NS, 'ellipse', { cx: 590, cy: 518, rx: 338, ry: 250, fill: 'url(#canopy-cyan)', opacity: .23 })
  );
  return group;
}

function buildBranches(NS, origin, branches) {
  const group = node(NS, 'g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  branches.forEach(([id, value], index) => {
    const [x, y] = value.point_px;
    const dx = x - origin[0];
    const bendX = origin[0] + dx * .44;
    const bendY = origin[1] - 88 - index * 4;
    const path = `M ${origin[0]} ${origin[1] - 18} Q ${bendX} ${bendY} ${x} ${y}`;
    group.append(
      node(NS, 'path', { d: path, stroke: 'rgba(0,0,0,.52)', 'stroke-width': 23 }),
      node(NS, 'path', { d: path, stroke: 'url(#branch-stroke)', 'stroke-width': 13, 'data-branch': id }),
      node(NS, 'circle', { cx: x, cy: y, r: 7, fill: '#ffe1a0', opacity: .84, filter: 'url(#tiny-glow)' })
    );
  });
  return group;
}

function buildRoots(NS, origin, roots) {
  const group = node(NS, 'g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const rootStartY = origin[1] + 125;
  roots.forEach(([id, value], index) => {
    const [x, y] = value.tip_point_px;
    const spread = (index - 7.5) / 7.5;
    const c1x = origin[0] + spread * 80;
    const c1y = rootStartY + 58;
    const c2x = x - spread * 72;
    const c2y = y - 96;
    const path = `M ${origin[0]} ${rootStartY} C ${c1x} ${c1y} ${c2x} ${c2y} ${x} ${y}`;
    const width = Math.max(5.5, 12.5 - Math.abs(index - 7.5) * .62);
    group.append(
      node(NS, 'path', { d: path, stroke: 'rgba(0,0,0,.52)', 'stroke-width': width + 7 }),
      node(NS, 'path', { d: path, stroke: 'url(#root-stroke)', 'stroke-width': width, 'data-root': id })
    );
  });
  return group;
}

function buildTrunk(NS, origin) {
  const group = node(NS, 'g');
  const x = origin[0];
  const y = origin[1];
  const trunk = `M ${x - 61} ${y + 155}
    C ${x - 39} ${y + 99}, ${x - 33} ${y + 40}, ${x - 20} ${y - 6}
    C ${x - 6} ${y - 50}, ${x + 14} ${y - 60}, ${x + 25} ${y - 5}
    C ${x + 35} ${y + 49}, ${x + 47} ${y + 104}, ${x + 66} ${y + 157}
    Z`;
  group.append(
    node(NS, 'path', { d: trunk, fill: 'rgba(0,0,0,.55)', transform: 'translate(0 8)' }),
    node(NS, 'path', { d: trunk, fill: 'url(#wood)' }),
    node(NS, 'path', { d: `M ${x - 10} ${y + 132} C ${x - 1} ${y + 82}, ${x + 2} ${y + 28}, ${x + 4} ${y - 30}`, fill: 'none', stroke: 'url(#wood-light)', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .76 })
  );
  return group;
}

function buildMotifs(NS, motifs) {
  const group = node(NS, 'g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  motifs.forEach(([id, value], index) => {
    const [x, y] = value.point_px;
    const left = id.includes('M-L');
    const direction = left ? -1 : 1;
    const tone = index < 3 ? '#79cfff' : '#f3c86f';
    group.append(
      node(NS, 'circle', { cx: x, cy: y, r: 26, stroke: tone, 'stroke-width': 4, opacity: .72 }),
      node(NS, 'path', { d: `M ${x - 13 * direction} ${y - 9} Q ${x + 1 * direction} ${y - 28} ${x + 18 * direction} ${y - 7} Q ${x + 4 * direction} ${y + 8} ${x + 20 * direction} ${y + 24}`, stroke: tone, 'stroke-width': 4.5, opacity: .82, filter: 'url(#tiny-glow)' })
    );
  });
  return group;
}

function buildCore(NS, origin) {
  const [x, y] = origin;
  const group = node(NS, 'g', { filter: 'url(#tiny-glow)' });
  group.append(
    node(NS, 'circle', { cx: x, cy: y, r: 24, fill: '#f3c86f', opacity: .14 }),
    node(NS, 'circle', { cx: x, cy: y, r: 8, fill: '#ffe6a9', opacity: .94 })
  );
  return group;
}

function buildCaption(NS) {
  const group = node(NS, 'g', { 'aria-hidden': 'true' });
  group.append(
    node(NS, 'text', { x: 576, y: 1274, 'text-anchor': 'middle', fill: '#fff2cf', 'font-size': 43, 'font-family': 'Inter, system-ui, sans-serif', 'font-weight': 800, 'letter-spacing': 5 }, 'CONSIDER THE ENERGY'),
    node(NS, 'text', { x: 576, y: 1324, 'text-anchor': 'middle', fill: '#b9c9dc', 'font-size': 20, 'font-family': 'Inter, system-ui, sans-serif', 'font-weight': 650, 'letter-spacing': 6, opacity: .82 }, 'COMMUNITY · ROOTS · RESPONSIBILITY')
  );
  return group;
}

function buildFallback() {
  const panel = document.createElement('div');
  panel.className = 'campaign-native-visual';
  panel.setAttribute('role', 'img');
  panel.setAttribute('aria-label', 'Consider the Energy community emblem');
  panel.style.display = 'grid';
  panel.style.placeItems = 'center';
  panel.style.padding = '2rem';
  panel.style.textAlign = 'center';
  panel.innerHTML = '<strong style="font-size:clamp(2rem,5vw,4rem);letter-spacing:-.05em;color:#f3c86f">CONSIDER THE ENERGY</strong>';
  return panel;
}

function node(NS, tag, attrs = {}, text = '') {
  const el = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  if (text) el.textContent = text;
  return el;
}

const STAR_POINTS = Object.freeze([
  [150,181,2.1,.52],[251,116,1.3,.36],[392,171,1.7,.42],[724,132,1.4,.4],[920,185,2,.48],
  [998,334,1.4,.3],[176,358,1.4,.32],[1013,604,1.8,.42],[117,648,1.3,.33],[1016,924,1.6,.35],
  [157,1046,1.6,.38],[934,1164,1.5,.32],[274,1288,1.2,.3],[791,1364,1.9,.38],[1001,1306,1.1,.28]
]);
