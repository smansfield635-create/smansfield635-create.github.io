const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_CENTERED_BRANDMARK_STAGE_V3',
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

function canopyLeaves() {
  let seed = 0x51eaf;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const leaves = [];
  for (let i = 0; i < 138; i++) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand());
    const x = 350 + Math.cos(a) * rr * 245;
    const y = 168 + Math.sin(a) * rr * 118;
    if (y > 276 || y < 38 || x < 88 || x > 612) continue;
    const scale = .54 + rand() * .43;
    const rot = -38 + rand() * 76;
    const opacity = .82 + rand() * .18;
    leaves.push(`<use href="#cte-leaf" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})" opacity="${opacity.toFixed(2)}"/>`);
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
        min-height: 21rem !important;
        padding: .55rem !important;
        background:
          radial-gradient(circle at 50% 43%, rgba(19, 232, 221, .075), transparent 40%),
          #02050b !important;
      }
      .community-logo-stage {
        display: grid;
        width: 100%;
        min-height: 19.6rem;
        place-items: center;
        overflow: hidden;
      }
      .community-logo-stage__mark {
        display: block;
        width: min(86%, 31rem);
        height: auto;
        max-height: 20.2rem;
        overflow: visible;
        filter: drop-shadow(0 1rem 1.65rem rgba(0,0,0,.58));
      }
      @media (max-width: 900px) {
        [data-community-lifecycle-mount] { min-height: 20rem !important; padding: .45rem !important; }
        .community-logo-stage { min-height: 18.5rem; }
        .community-logo-stage__mark { width: min(82%, 28rem); max-height: 19.2rem; }
      }
      @media (max-width: 560px) {
        [data-community-lifecycle-mount] { min-height: 18rem !important; padding: .35rem !important; }
        .community-logo-stage { min-height: 16.8rem; }
        .community-logo-stage__mark { width: min(88%, 23rem); max-height: 17.5rem; }
      }
    `;
    doc.head.append(style);
  }

  const stage = doc.createElement('div');
  stage.className = 'community-logo-stage';

  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('community-logo-stage__mark');
  svg.setAttribute('viewBox', '0 0 700 660');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'cte-logo-title cte-logo-desc');
  svg.innerHTML = `
    <title id="cte-logo-title">Consider the Energy tree logo</title>
    <desc id="cte-logo-desc">A broad luminous white tree with a dense teal-edged canopy, centered Consider the Energy wordmark, teal side motifs, and a deep spreading white root system.</desc>
    <defs>
      <filter id="cte-cyan-glow" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="4.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cte-white-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <path id="cte-leaf" d="M-16 0 C-10 -13 8 -15 18 -3 C12 10 -4 14 -16 0 Z" fill="#f8ffff" stroke="#1debe0" stroke-width="4.5" stroke-linejoin="round" filter="url(#cte-cyan-glow)"/>
    </defs>

    <g aria-hidden="true">${canopyLeaves()}</g>

    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" filter="url(#cte-white-glow)" aria-hidden="true">
      <path d="M350 305 C350 271 350 236 350 198 C350 157 351 116 352 70" stroke-width="23"/>

      <path d="M350 196 C319 166 294 135 279 95" stroke-width="17"/>
      <path d="M348 211 C307 189 270 159 241 125" stroke-width="16"/>
      <path d="M347 231 C302 216 258 192 216 163" stroke-width="15"/>
      <path d="M346 250 C293 244 242 230 190 207" stroke-width="14"/>
      <path d="M343 269 C286 269 229 263 171 247" stroke-width="12"/>

      <path d="M351 195 C382 164 409 132 426 93" stroke-width="17"/>
      <path d="M352 211 C393 188 432 158 461 123" stroke-width="16"/>
      <path d="M353 231 C399 215 446 190 486 159" stroke-width="15"/>
      <path d="M354 250 C407 243 460 228 513 203" stroke-width="14"/>
      <path d="M357 269 C414 268 472 260 530 243" stroke-width="12"/>

      <path d="M307 170 C286 141 275 114 274 86" stroke-width="11"/>
      <path d="M271 154 C245 131 229 108 221 83" stroke-width="10"/>
      <path d="M246 194 C214 172 190 149 174 126" stroke-width="9"/>
      <path d="M217 226 C184 211 151 193 125 170" stroke-width="8"/>
      <path d="M198 259 C161 257 130 250 103 237" stroke-width="7"/>

      <path d="M393 169 C414 139 426 112 428 84" stroke-width="11"/>
      <path d="M429 153 C455 130 472 107 480 82" stroke-width="10"/>
      <path d="M455 193 C487 171 511 147 527 123" stroke-width="9"/>
      <path d="M484 224 C519 209 551 189 577 166" stroke-width="8"/>
      <path d="M502 257 C540 254 572 247 600 233" stroke-width="7"/>

      <path d="M330 139 C319 111 314 88 317 65" stroke-width="9"/>
      <path d="M373 137 C384 108 389 85 387 63" stroke-width="9"/>
      <path d="M302 218 C278 203 257 185 241 165" stroke-width="8"/>
      <path d="M398 216 C423 201 445 183 462 163" stroke-width="8"/>
      <path d="M279 244 C252 239 225 229 201 215" stroke-width="7"/>
      <path d="M421 243 C449 237 476 227 501 212" stroke-width="7"/>
    </g>

    <line x1="82" y1="316" x2="618" y2="316" stroke="#fff" stroke-width="8" stroke-linecap="round"/>

    <g fill="#fff" text-anchor="middle" font-family="Arial Black, Inter, Arial, sans-serif" font-weight="900" letter-spacing="3.8">
      <text x="350" y="374" font-size="60">CONSIDER</text>
      <text x="350" y="440" font-size="60">THE ENERGY</text>
    </g>

    <line x1="84" y1="462" x2="616" y2="462" stroke="#fff" stroke-width="8" stroke-linecap="round"/>

    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" filter="url(#cte-white-glow)" aria-hidden="true">
      <path d="M350 464 C350 493 350 516 350 536" stroke-width="22"/>

      <path d="M349 526 C319 548 286 565 248 577" stroke-width="15"/>
      <path d="M351 526 C382 548 416 565 454 577" stroke-width="15"/>

      <path d="M337 536 C303 570 264 596 214 617" stroke-width="12"/>
      <path d="M363 536 C398 570 438 596 488 617" stroke-width="12"/>

      <path d="M326 545 C297 586 275 621 264 650" stroke-width="11"/>
      <path d="M374 545 C404 586 427 621 438 650" stroke-width="11"/>

      <path d="M312 553 C274 582 234 601 183 613" stroke-width="10"/>
      <path d="M388 553 C427 581 468 600 519 612" stroke-width="10"/>

      <path d="M296 560 C251 570 209 574 162 571" stroke-width="9"/>
      <path d="M404 560 C449 569 492 573 539 570" stroke-width="9"/>

      <path d="M286 569 C250 604 224 629 207 652" stroke-width="8"/>
      <path d="M414 569 C451 603 478 628 495 652" stroke-width="8"/>

      <path d="M271 576 C226 586 190 596 155 612" stroke-width="7"/>
      <path d="M429 576 C474 586 511 596 546 612" stroke-width="7"/>

      <path d="M258 580 C219 568 185 562 148 563" stroke-width="7"/>
      <path d="M442 580 C481 568 516 562 553 563" stroke-width="7"/>

      <path d="M245 586 C214 615 192 635 177 653" stroke-width="6"/>
      <path d="M455 586 C486 614 509 634 524 652" stroke-width="6"/>

      <path d="M229 592 C199 592 173 596 148 606" stroke-width="6"/>
      <path d="M471 592 C501 592 528 596 553 606" stroke-width="6"/>
    </g>

    <g fill="#f8ffff" stroke="#1debe0" stroke-width="5.5" stroke-linejoin="round" filter="url(#cte-cyan-glow)" aria-hidden="true">
      <path d="M66 386 C82 366 103 365 117 382 C101 401 80 402 66 386 Z"/>
      <path d="M66 386 C57 407 67 426 89 430 C99 409 89 391 66 386 Z"/>
      <path d="M66 386 C49 371 31 372 19 386 C32 402 49 403 66 386 Z"/>

      <path d="M634 386 C618 366 597 365 583 382 C599 401 620 402 634 386 Z"/>
      <path d="M634 386 C643 407 633 426 611 430 C601 409 611 391 634 386 Z"/>
      <path d="M634 386 C651 371 669 372 681 386 C668 402 651 403 634 386 Z"/>
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
    denseCanopy: true,
    deepRootSystem: true
  });
}

export { CONTRACT as DGB_COMMUNITY_LOGO_STAGE_CONTRACT };
