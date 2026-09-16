const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_CENTERED_BRANDMARK_STAGE_V2',
  object: 'CONSIDER_THE_ENERGY_CODE_AUTHORED_BRANDMARK_STAGE',
  medium: 'INLINE_SVG_CODE_ONLY',
  motion: 'NONE',
  runtimeImageAssets: 0,
  canvas: false,
  webgl: false,
  stage: 'REDUCED'
});

const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

const leaves = [
  [188,116,-22,.82],[224,91,8,.92],[264,76,-12,.95],[306,72,10,.9],[350,78,-7,.92],[393,93,16,.88],[432,116,-12,.82],
  [158,151,16,.8],[201,146,-12,.95],[245,128,14,.92],[288,122,-8,.9],[332,124,10,.94],[377,132,-14,.9],[419,150,9,.9],[461,154,-14,.78],
  [145,190,-16,.74],[186,187,14,.9],[226,173,-7,.93],[269,168,12,.9],[313,166,-11,.94],[356,171,13,.92],[398,180,-9,.94],[441,193,11,.86],[475,199,-12,.7],
  [167,225,8,.7],[208,220,-11,.88],[250,211,14,.9],[291,209,-8,.86],[333,211,12,.9],[375,216,-14,.88],[417,226,9,.82],[451,232,-9,.68],
  [205,253,-10,.65],[248,246,11,.76],[290,242,-9,.78],[335,244,12,.8],[379,250,-11,.76],[418,257,8,.64]
];

function leafUses() {
  return leaves.map(([x,y,r,s]) => `<use href="#cte-leaf" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`).join('');
}

function mount(host) {
  const doc = host.ownerDocument || document;

  if (!doc.querySelector('style[data-community-logo-stage-style]')) {
    const style = doc.createElement('style');
    style.dataset.communityLogoStageStyle = 'true';
    style.textContent = `
      [data-community-lifecycle-mount] {
        min-height: 18rem !important;
        padding: .7rem !important;
        background:
          radial-gradient(circle at 50% 46%, rgba(22, 226, 218, .08), transparent 43%),
          #02050b !important;
      }
      .community-logo-stage {
        display: grid;
        width: 100%;
        min-height: 16.4rem;
        place-items: center;
        overflow: hidden;
      }
      .community-logo-stage__mark {
        display: block;
        width: min(68%, 22rem);
        height: auto;
        max-height: 18.5rem;
        filter: drop-shadow(0 .9rem 1.45rem rgba(0,0,0,.56));
      }
      @media (max-width: 900px) {
        [data-community-lifecycle-mount] { min-height: 16.8rem !important; padding: .55rem !important; }
        .community-logo-stage { min-height: 15.4rem; }
        .community-logo-stage__mark { width: min(62%, 19rem); max-height: 16.8rem; }
      }
      @media (max-width: 560px) {
        [data-community-lifecycle-mount] { min-height: 15rem !important; padding: .42rem !important; }
        .community-logo-stage { min-height: 13.7rem; }
        .community-logo-stage__mark { width: min(72%, 16.5rem); max-height: 14.6rem; }
      }
    `;
    doc.head.append(style);
  }

  const stage = doc.createElement('div');
  stage.className = 'community-logo-stage';

  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('community-logo-stage__mark');
  svg.setAttribute('viewBox', '0 0 620 700');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'cte-logo-title cte-logo-desc');
  svg.innerHTML = `
    <title id="cte-logo-title">Consider the Energy tree logo</title>
    <desc id="cte-logo-desc">A white tree with teal leaves rises above the Consider the Energy wordmark, with white roots and teal leaf motifs on a black field.</desc>
    <defs>
      <filter id="cte-cyan-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="3.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cte-white-glow" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation="1.1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <path id="cte-leaf" d="M0 0 C10 -12 25 -12 34 0 C24 13 10 14 0 0 Z" fill="#efffff" stroke="#18e7de" stroke-width="5" stroke-linejoin="round" filter="url(#cte-cyan-glow)"/>
    </defs>

    <rect width="620" height="700" rx="22" fill="#020204"/>

    <g aria-hidden="true">${leafUses()}</g>

    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" filter="url(#cte-white-glow)" aria-hidden="true">
      <path d="M310 286 C308 250 310 212 311 172 C312 139 314 108 316 78" stroke-width="17"/>
      <path d="M311 179 C280 157 253 136 229 108" stroke-width="13"/>
      <path d="M311 199 C271 190 229 174 188 150" stroke-width="12"/>
      <path d="M312 220 C267 218 220 214 172 199" stroke-width="11"/>
      <path d="M312 167 C340 145 370 120 397 94" stroke-width="13"/>
      <path d="M312 194 C351 180 391 157 425 126" stroke-width="12"/>
      <path d="M312 219 C356 216 403 203 448 181" stroke-width="11"/>
      <path d="M270 151 C252 127 246 106 247 86" stroke-width="9"/>
      <path d="M355 152 C373 130 381 107 383 86" stroke-width="9"/>
      <path d="M225 184 C206 169 191 153 181 136" stroke-width="8"/>
      <path d="M402 179 C423 164 442 147 455 129" stroke-width="8"/>
      <path d="M310 286 C286 276 266 266 244 248" stroke-width="12"/>
      <path d="M310 286 C335 275 357 263 377 244" stroke-width="12"/>
    </g>

    <line x1="118" y1="302" x2="502" y2="302" stroke="#fff" stroke-width="7" stroke-linecap="round"/>

    <g fill="#fff" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="950" letter-spacing="3">
      <text x="310" y="354" font-size="50">CONSIDER</text>
      <text x="310" y="414" font-size="50">THE ENERGY</text>
    </g>

    <line x1="120" y1="435" x2="500" y2="435" stroke="#fff" stroke-width="7" stroke-linecap="round"/>

    <g fill="none" stroke="#fff" stroke-linecap="round" filter="url(#cte-white-glow)" aria-hidden="true">
      <path d="M310 438 C309 469 310 493 310 516" stroke-width="15"/>
      <path d="M310 500 C284 521 256 539 220 553" stroke-width="12"/>
      <path d="M310 502 C338 519 367 536 402 550" stroke-width="12"/>
      <path d="M301 514 C266 548 228 575 176 596" stroke-width="10"/>
      <path d="M319 514 C356 547 395 573 446 594" stroke-width="10"/>
      <path d="M294 525 C269 574 252 611 247 646" stroke-width="9"/>
      <path d="M326 525 C353 574 371 611 375 646" stroke-width="9"/>
      <path d="M281 534 C245 570 211 607 191 644" stroke-width="8"/>
      <path d="M339 535 C376 570 408 607 428 644" stroke-width="8"/>
      <path d="M265 543 C226 562 189 575 148 580" stroke-width="7"/>
      <path d="M354 543 C394 562 431 575 473 581" stroke-width="7"/>
      <path d="M248 553 C208 544 172 540 136 541" stroke-width="7"/>
      <path d="M372 553 C413 545 450 541 486 542" stroke-width="7"/>
    </g>

    <g fill="#efffff" stroke="#18e7de" stroke-width="5" stroke-linejoin="round" filter="url(#cte-cyan-glow)" aria-hidden="true">
      <path d="M74 352 C89 335 108 334 119 350 C105 365 86 366 74 352 Z"/>
      <path d="M74 352 C67 373 77 388 96 390 C102 370 94 356 74 352 Z"/>
      <path d="M74 352 C60 339 45 339 34 350 C45 364 60 365 74 352 Z"/>
      <path d="M546 352 C531 335 512 334 501 350 C515 365 534 366 546 352 Z"/>
      <path d="M546 352 C553 373 543 388 524 390 C518 370 526 356 546 352 Z"/>
      <path d="M546 352 C560 339 575 339 586 350 C575 364 560 365 546 352 Z"/>
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
    codeAuthoredBrandmark: true
  });
}

export { CONTRACT as DGB_COMMUNITY_LOGO_STAGE_CONTRACT };
