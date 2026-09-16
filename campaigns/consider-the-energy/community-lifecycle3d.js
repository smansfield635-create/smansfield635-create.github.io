const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_FILLED_ORGANIC_BRANDMARK_STAGE_V4',
  object: 'CONSIDER_THE_ENERGY_FILLED_ORGANIC_BRANDMARK',
  medium: 'INLINE_SVG_CODE_ONLY',
  motion: 'NONE',
  runtimeImageAssets: 0,
  canvas: false,
  webgl: false,
  structuralStrokeCenterlines: false,
  stage: 'REDUCED'
});

const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

const P = (x, y) => ({ x, y });
const lerp = (a, b, t) => a + (b - a) * t;

function cubicPoint(branch, t) {
  const u = 1 - t;
  const { p0, p1, p2, p3 } = branch;
  return P(
    u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
  );
}

function cubicTangent(branch, t) {
  const u = 1 - t;
  const { p0, p1, p2, p3 } = branch;
  const x =
    3*u*u*(p1.x-p0.x) +
    6*u*t*(p2.x-p1.x) +
    3*t*t*(p3.x-p2.x);
  const y =
    3*u*u*(p1.y-p0.y) +
    6*u*t*(p2.y-p1.y) +
    3*t*t*(p3.y-p2.y);
  const m = Math.hypot(x, y) || 1;
  return P(x/m, y/m);
}

function widthAt(branch, t) {
  const base = lerp(branch.w0, branch.w1, t);
  return base * (0.96 + 0.04 * Math.sin(Math.PI * t));
}

function ribbonPath(branch, steps = 18) {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = cubicPoint(branch, t);
    const d = cubicTangent(branch, t);
    const n = P(-d.y, d.x);
    const w = widthAt(branch, t) * 0.5;
    left.push(P(p.x + n.x*w, p.y + n.y*w));
    right.push(P(p.x - n.x*w, p.y - n.y*w));
  }
  const pts = left.concat(right.reverse());
  return `M${pts.map((p, i) => `${i ? 'L' : ''}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')}Z`;
}

const BRANCHES = [
  { id:'trunk', p0:P(350,318), p1:P(346,270), p2:P(351,197), p3:P(352,72),  w0:42,w1:13,leafCount:3 },

  { id:'l1', p0:P(350,246), p1:P(318,210), p2:P(288,152), p3:P(264,88),  w0:28,w1:7,leafCount:7 },
  { id:'l2', p0:P(348,258), p1:P(304,233), p2:P(250,184), p3:P(210,128), w0:25,w1:7,leafCount:8 },
  { id:'l3', p0:P(346,274), p1:P(296,261), p2:P(222,223), p3:P(160,176), w0:22,w1:6,leafCount:8 },
  { id:'l4', p0:P(343,289), p1:P(286,286), p2:P(206,269), p3:P(119,233), w0:18,w1:5,leafCount:8 },
  { id:'l5', p0:P(327,219), p1:P(293,179), p2:P(260,124), p3:P(242,63),  w0:16,w1:5,leafCount:6 },
  { id:'l6', p0:P(294,190), p1:P(259,150), p2:P(214,112), p3:P(171,96),  w0:13,w1:4,leafCount:6 },
  { id:'l7', p0:P(257,178), p1:P(220,155), p2:P(172,139), p3:P(127,141), w0:10,w1:3.5,leafCount:5 },
  { id:'l8', p0:P(235,222), p1:P(196,205), p2:P(145,198), p3:P(98,207),  w0:10,w1:3.5,leafCount:5 },

  { id:'r1', p0:P(351,245), p1:P(386,205), p2:P(416,150), p3:P(438,86),  w0:27,w1:7,leafCount:7 },
  { id:'r2', p0:P(353,258), p1:P(397,232), p2:P(451,181), p3:P(492,126), w0:25,w1:7,leafCount:8 },
  { id:'r3', p0:P(355,273), p1:P(408,258), p2:P(480,219), p3:P(546,171), w0:22,w1:6,leafCount:8 },
  { id:'r4', p0:P(358,288), p1:P(419,283), p2:P(497,264), p3:P(585,225), w0:18,w1:5,leafCount:8 },
  { id:'r5', p0:P(373,217), p1:P(407,176), p2:P(442,120), p3:P(462,61),  w0:16,w1:5,leafCount:6 },
  { id:'r6', p0:P(407,187), p1:P(443,148), p2:P(490,110), p3:P(534,94),  w0:13,w1:4,leafCount:6 },
  { id:'r7', p0:P(443,176), p1:P(481,152), p2:P(529,135), p3:P(575,136), w0:10,w1:3.5,leafCount:5 },
  { id:'r8', p0:P(466,219), p1:P(507,202), p2:P(558,194), p3:P(606,202), w0:10,w1:3.5,leafCount:5 },

  { id:'c1', p0:P(350,184), p1:P(332,145), p2:P(321,101), p3:P(319,53), w0:14,w1:4,leafCount:5 },
  { id:'c2', p0:P(353,183), p1:P(370,143), p2:P(381,101), p3:P(383,52), w0:14,w1:4,leafCount:5 },
  { id:'c3', p0:P(311,151), p1:P(288,119), p2:P(277,90), p3:P(279,57),  w0:10,w1:3.5,leafCount:4 },
  { id:'c4', p0:P(391,149), p1:P(414,117), p2:P(425,88), p3:P(424,55),  w0:10,w1:3.5,leafCount:4 }
];

const ROOTS = [
  { p0:P(350,500), p1:P(323,526), p2:P(281,550), p3:P(226,566), w0:30,w1:5 },
  { p0:P(350,501), p1:P(382,526), p2:P(423,550), p3:P(479,566), w0:29,w1:5 },
  { p0:P(342,507), p1:P(308,550), p2:P(270,594), p3:P(235,642), w0:22,w1:4 },
  { p0:P(358,507), p1:P(394,550), p2:P(433,594), p3:P(468,642), w0:22,w1:4 },
  { p0:P(336,514), p1:P(300,568), p2:P(253,607), p3:P(193,628), w0:17,w1:3.5 },
  { p0:P(364,514), p1:P(401,568), p2:P(448,606), p3:P(510,627), w0:17,w1:3.5 },
  { p0:P(329,521), p1:P(286,544), p2:P(230,559), p3:P(160,562), w0:14,w1:3.2 },
  { p0:P(371,521), p1:P(415,544), p2:P(471,559), p3:P(541,561), w0:14,w1:3.2 },
  { p0:P(319,527), p1:P(270,562), p2:P(221,599), p3:P(176,651), w0:12,w1:3 },
  { p0:P(381,527), p1:P(431,562), p2:P(480,598), p3:P(525,650), w0:12,w1:3 },
  { p0:P(311,535), p1:P(262,542), p2:P(206,539), p3:P(143,526), w0:10,w1:2.6 },
  { p0:P(389,535), p1:P(439,542), p2:P(496,539), p3:P(559,526), w0:10,w1:2.6 },
  { p0:P(302,541), p1:P(261,580), p2:P(232,614), p3:P(213,651), w0:9,w1:2.4 },
  { p0:P(398,541), p1:P(440,580), p2:P(469,614), p3:P(488,651), w0:9,w1:2.4 },
  { p0:P(290,548), p1:P(242,564), p2:P(195,581), p3:P(151,609), w0:8,w1:2.3 },
  { p0:P(410,548), p1:P(459,564), p2:P(506,581), p3:P(551,609), w0:8,w1:2.3 },
  { p0:P(278,553), p1:P(239,575), p2:P(207,607), p3:P(186,641), w0:7,w1:2.2 },
  { p0:P(422,553), p1:P(462,575), p2:P(494,607), p3:P(515,641), w0:7,w1:2.2 }
];

function branchMarkup() {
  return BRANCHES.map(b => `<path d="${ribbonPath(b)}"/>`).join('');
}

function rootMarkup() {
  return ROOTS.map(b => `<path d="${ribbonPath(b, 16)}"/>`).join('');
}

function leafMarkup() {
  const leaves = [];
  let k = 0;
  for (const branch of BRANCHES) {
    const count = branch.leafCount || 0;
    if (!count) continue;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? .85 : .42 + (.53 * i / (count - 1));
      const p = cubicPoint(branch, t);
      const d = cubicTangent(branch, t);
      const n = P(-d.y, d.x);
      const side = (i + k) % 2 ? 1 : -1;
      const spread = 11 + 8 * t + (i % 3) * 2.5;
      const x = p.x + n.x * spread * side;
      const y = p.y + n.y * spread * side;
      const tangentAngle = Math.atan2(d.y, d.x) * 180 / Math.PI;
      const rot = tangentAngle + (side > 0 ? -42 : 42) + ((i % 3) - 1) * 9;
      const scale = .58 + .22 * t + (i % 2) * .07;
      leaves.push(`<use href="#cte-leaf" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})"/>`);
      if (t > .78 && i % 2 === 0) {
        const x2 = p.x - n.x * spread * side * .72;
        const y2 = p.y - n.y * spread * side * .72;
        leaves.push(`<use href="#cte-leaf-small" transform="translate(${x2.toFixed(1)} ${y2.toFixed(1)}) rotate(${(rot+58).toFixed(1)}) scale(${(scale*.86).toFixed(2)})"/>`);
      }
    }
    k++;
  }

  const crown = [
    [126,171,-18,.78],[151,122,22,.82],[184,84,-14,.86],[221,54,12,.82],
    [261,39,-8,.86],[304,31,12,.82],[350,27,-2,.88],[397,31,-12,.84],
    [441,42,10,.84],[483,60,-12,.86],[522,90,18,.82],[558,127,-20,.82],
    [585,169,15,.78],[106,219,-10,.72],[592,216,12,.72]
  ];
  for (const [x,y,r,s] of crown) {
    leaves.push(`<use href="#cte-leaf" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`);
  }
  return leaves.join('');
}

function mount(host) {
  const doc = host.ownerDocument || document;

  if (!doc.querySelector('style[data-community-logo-stage-style]')) {
    const style = doc.createElement('style');
    style.dataset.communityLogoStageStyle = 'true';
    style.textContent = `
      [data-community-lifecycle-mount] {
        min-height: 20rem !important;
        padding: .45rem !important;
        background:
          radial-gradient(circle at 50% 42%, rgba(25, 238, 226, .075), transparent 42%),
          #02050b !important;
      }
      .community-logo-stage {
        display: grid;
        width: 100%;
        min-height: 18.6rem;
        place-items: center;
        overflow: hidden;
      }
      .community-logo-stage__mark {
        display: block;
        width: min(91%, 34rem);
        height: auto;
        max-height: 20rem;
        overflow: visible;
        filter: drop-shadow(0 1rem 1.7rem rgba(0,0,0,.58));
      }
      @media (max-width: 900px) {
        [data-community-lifecycle-mount] { min-height: 18.8rem !important; padding: .4rem !important; }
        .community-logo-stage { min-height: 17.6rem; }
        .community-logo-stage__mark { width: min(88%, 30rem); max-height: 18.8rem; }
      }
      @media (max-width: 560px) {
        [data-community-lifecycle-mount] { min-height: 17.4rem !important; padding: .3rem !important; }
        .community-logo-stage { min-height: 16.2rem; }
        .community-logo-stage__mark { width: min(94%, 25rem); max-height: 17.2rem; }
      }
    `;
    doc.head.append(style);
  }

  const stage = doc.createElement('div');
  stage.className = 'community-logo-stage';

  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('community-logo-stage__mark');
  svg.setAttribute('viewBox', '0 0 700 675');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'cte-logo-title cte-logo-desc');

  const leaves = leafMarkup();
  const branches = branchMarkup();
  const roots = rootMarkup();

  svg.innerHTML = `
    <title id="cte-logo-title">Consider the Energy tree logo</title>
    <desc id="cte-logo-desc">A broad organic white tree with tapered filled branches, dense teal-edged leaves, the Consider the Energy wordmark, teal side leaf motifs, and a deep filled root system.</desc>
    <defs>
      <filter id="cte-cyan-glow" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="3.4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cte-white-glow" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation=".75" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <path id="cte-leaf" d="M-16 0 C-11 -11 -1 -15 10 -10 C18 -6 20 2 14 8 C5 15 -7 12 -16 0 Z"
        fill="#f8ffff" stroke="#1debe0" stroke-width="4" stroke-linejoin="round" filter="url(#cte-cyan-glow)"/>
      <path id="cte-leaf-small" d="M-13 0 C-8 -9 1 -12 9 -8 C15 -4 16 2 11 7 C4 11 -6 10 -13 0 Z"
        fill="#f8ffff" stroke="#1debe0" stroke-width="3.5" stroke-linejoin="round" filter="url(#cte-cyan-glow)"/>
    </defs>

    <g aria-hidden="true">${leaves}</g>

    <g fill="#fff" filter="url(#cte-white-glow)" aria-hidden="true">
      ${branches}
      <path d="M329 314
               C330 292 329 273 330 254
               C331 232 336 214 343 198
               C346 190 354 190 357 198
               C364 214 369 232 370 254
               C371 274 370 294 371 314
               C361 319 339 319 329 314 Z"/>
    </g>

    <line x1="95" y1="326" x2="605" y2="326" stroke="#fff" stroke-width="8" stroke-linecap="round"/>

    <g fill="#fff" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif" font-weight="900">
      <text x="350" y="385" font-size="59" textLength="334" lengthAdjust="spacingAndGlyphs">CONSIDER</text>
      <text x="350" y="447" font-size="58" textLength="404" lengthAdjust="spacingAndGlyphs">THE ENERGY</text>
    </g>

    <line x1="96" y1="468" x2="604" y2="468" stroke="#fff" stroke-width="8" stroke-linecap="round"/>

    <g fill="#fff" filter="url(#cte-white-glow)" aria-hidden="true">
      <path d="M331 469
               C334 489 335 503 337 518
               C339 527 343 534 350 540
               C357 534 361 527 363 518
               C365 503 366 489 369 469 Z"/>
      ${roots}
    </g>

    <g fill="#f8ffff" stroke="#1debe0" stroke-width="5" stroke-linejoin="round" filter="url(#cte-cyan-glow)" aria-hidden="true">
      <path d="M73 390 C91 370 113 369 127 387 C111 406 89 408 73 390 Z"/>
      <path d="M73 390 C64 413 75 433 98 436 C107 414 97 396 73 390 Z"/>
      <path d="M73 390 C55 374 35 375 21 391 C35 407 54 408 73 390 Z"/>

      <path d="M627 390 C609 370 587 369 573 387 C589 406 611 408 627 390 Z"/>
      <path d="M627 390 C636 413 625 433 602 436 C593 414 603 396 627 390 Z"/>
      <path d="M627 390 C645 374 665 375 679 391 C665 407 646 408 627 390 Z"/>
    </g>
  `;

  stage.append(svg);
  host.replaceChildren(stage);
  host.dataset.communityLogoStage = 'ready';
  host.dataset.lifecycleStatus = 'ready';

  globalThis.DGB_COMMUNITY_LOGO_STAGE_RECEIPT = Object.freeze({
    contract: CONTRACT,
    centered: true,
    reducedStage: true,
    runtimeImageAssets: 0,
    codeAuthoredBrandmark: true,
    filledStructuralGeometry: true,
    randomCanopy: false,
    branchAnchoredLeaves: true
  });
}

export { CONTRACT as DGB_COMMUNITY_LOGO_STAGE_CONTRACT };
