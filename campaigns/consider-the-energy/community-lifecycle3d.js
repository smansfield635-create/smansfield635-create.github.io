const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_STATIC_INTEGRATED_SEASONAL_TREE_V1',
  object: 'COMMUNITY_STATIC_FOUR_SEASON_TREE_COMPOSITION',
  medium: 'INLINE_SVG',
  motion: 'NONE',
  seasonCount: 4,
  seasonMap: Object.freeze({ SPRING: 'NW', SUMMER: 'SW', AUTUMN: 'SE', WINTER: 'NE' }),
  runtimeImageAssets: 0,
  canvas: false,
  webgl: false,
  generatedImageAssets: false
});

const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

function uses(id, points, className = '') {
  return points.map(([x,y,s=1,r=0,o=1]) => `<use href="#${id}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${o}"${className ? ` class="${className}"` : ''}/>`).join('');
}

function mount(host) {
  const doc = host.ownerDocument || document;
  if (!doc.querySelector('style[data-community-static-seasonal-style]')) {
    const style = doc.createElement('style');
    style.dataset.communityStaticSeasonalStyle = 'true';
    style.textContent = `
      [data-community-lifecycle-mount]{position:relative;isolation:isolate;overflow:hidden;min-height:25rem}
      .community-static-seasonal-tree{display:block;width:100%;height:100%;min-height:25rem;aspect-ratio:16/10}
      .community-static-seasonal-tree *{transform-box:fill-box;transform-origin:center}
      @media(max-width:900px){[data-community-lifecycle-mount]{min-height:29rem}.community-static-seasonal-tree{min-height:29rem;aspect-ratio:4/3}}
      @media(max-width:620px){[data-community-lifecycle-mount]{min-height:24rem}.community-static-seasonal-tree{min-height:24rem;aspect-ratio:5/4}}
    `;
    doc.head.append(style);
  }

  const springBlossoms = [
    [120,118,.72,-8],[166,92,.9,12],[220,105,.68,-18],[270,78,.82,4],[315,112,.72,20],
    [356,93,.58,-12],[405,126,.74,9],[455,106,.56,-20],[142,162,.58,0],[204,149,.72,17],
    [261,166,.58,-11],[330,147,.66,6],[390,170,.52,13],[456,156,.48,-8],[100,205,.48,12],
    [182,208,.6,-7],[255,220,.48,19],[336,207,.52,-13],[421,216,.45,10]
  ];
  const springPetals = [
    [96,265,.46,-18,.72],[154,248,.36,22,.62],[238,273,.42,-10,.72],[301,248,.34,30,.58],
    [392,267,.38,-24,.64],[463,244,.32,16,.6],[514,280,.28,-9,.48]
  ];
  const summerLeaves = [
    [104,500,.66,-26],[150,472,.75,15],[198,520,.6,-12],[250,468,.78,30],[306,514,.7,-18],
    [364,475,.72,14],[420,522,.62,-28],[474,483,.7,20],[531,529,.56,-8]
  ];
  const autumnLeaves = [
    [760,533,.48,-22,.9],[808,501,.42,18,.84],[862,548,.52,-12,.9],[915,510,.45,24,.88],
    [970,553,.55,-18,.86],[1024,503,.42,12,.9],[1092,548,.56,25,.86],[1155,500,.46,-16,.84],
    [824,595,.36,17,.72],[900,607,.42,-22,.78],[1007,601,.36,28,.76],[1114,596,.4,-16,.74]
  ];
  const winterStars = [
    [822,88,.55,0,.62],[888,126,.4,0,.7],[958,82,.5,0,.64],[1036,120,.36,0,.58],[1117,77,.48,0,.72],
    [1192,136,.35,0,.62],[842,205,.35,0,.5],[1158,210,.38,0,.58]
  ];
  const canopyLeaves = [
    [517,241,.7,-38],[548,216,.72,-15],[580,201,.76,10],[615,194,.72,-28],[648,188,.8,6],
    [684,194,.74,26],[718,205,.72,-10],[751,223,.68,32],[784,247,.64,-24],[496,277,.65,20],
    [531,270,.78,-12],[570,248,.72,28],[607,240,.7,-34],[644,230,.76,12],[682,244,.72,-12],
    [721,257,.76,30],[762,276,.7,-18],[520,309,.65,-24],[558,296,.72,16],[596,282,.68,-8],
    [636,272,.72,32],[676,286,.68,-27],[715,300,.7,12],[755,316,.62,-15],[553,338,.6,20],
    [591,322,.66,-28],[630,313,.7,10],[671,325,.65,26],[710,341,.6,-14],[610,353,.55,-10],
    [649,349,.62,25],[687,356,.54,-20],[476,249,.52,9],[803,284,.52,-9],[744,188,.56,10]
  ];

  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('community-static-seasonal-tree');
  svg.setAttribute('viewBox', '0 0 1280 800');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'community-static-title community-static-desc');
  svg.innerHTML = `
    <title id="community-static-title">Four seasons surrounding the Consider the Energy tree</title>
    <desc id="community-static-desc">A single static code-drawn landscape joins spring, summer, autumn, and winter around a luminous central tree with visible roots.</desc>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#06121e"/><stop offset=".58" stop-color="#07101a"/><stop offset="1" stop-color="#02070d"/></linearGradient>
      <radialGradient id="centerGlow"><stop stop-color="#52f4e7" stop-opacity=".22"/><stop offset=".45" stop-color="#27c6c2" stop-opacity=".08"/><stop offset="1" stop-color="#07121d" stop-opacity="0"/></radialGradient>
      <linearGradient id="springField" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#163b35"/><stop offset=".55" stop-color="#265b43"/><stop offset="1" stop-color="#102923"/></linearGradient>
      <linearGradient id="summerField" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#092b2d"/><stop offset=".58" stop-color="#145044"/><stop offset="1" stop-color="#16372d"/></linearGradient>
      <linearGradient id="autumnField" x1="1" y1="1" x2="0" y2="0"><stop stop-color="#6f2e13"/><stop offset=".42" stop-color="#9b4a18"/><stop offset="1" stop-color="#3b2617"/></linearGradient>
      <linearGradient id="winterField" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#254f73"/><stop offset=".5" stop-color="#173a57"/><stop offset="1" stop-color="#102635"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#73f0ec" stop-opacity=".2"/><stop offset=".48" stop-color="#5ed8e7" stop-opacity=".82"/><stop offset="1" stop-color="#b8f5ff" stop-opacity=".22"/></linearGradient>
      <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9df"/><stop offset=".52" stop-color="#fff4cf"/><stop offset="1" stop-color="#d8bc82"/></linearGradient>
      <linearGradient id="root" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff3cc"/><stop offset="1" stop-color="#b88d52"/></linearGradient>
      <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f7fbff"/><stop offset="1" stop-color="#9fd6f2"/></linearGradient>
      <linearGradient id="autumnCanopy" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffbf3f"/><stop offset=".45" stop-color="#ef731a"/><stop offset="1" stop-color="#a12c16"/></linearGradient>
      <filter id="treeGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".46"/></filter>
      <filter id="seasonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <path id="leaf" d="M0 0 C10 -11 25 -10 31 0 C21 12 8 13 0 0Z" fill="#45ead5" stroke="#a4fff2" stroke-opacity=".62" stroke-width="1.2"/>
      <path id="seasonLeaf" d="M0 0 C9 -7 21 -6 27 1 C18 10 7 10 0 0Z" fill="currentColor"/>
      <g id="blossom" filter="url(#seasonGlow)"><circle r="5.8" fill="#ffd0df"/><circle cx="7" cy="1" r="5.2" fill="#ff9fbe"/><circle cx="3" cy="-6" r="5" fill="#ffc0d4"/><circle cx="-5" cy="-4" r="4.8" fill="#f58eaf"/><circle cx="-7" cy="3" r="5.2" fill="#ffc8d8"/><circle r="2.3" fill="#ffe8a9"/></g>
      <g id="snowStar" stroke="#dff7ff" stroke-width="2" stroke-linecap="round"><path d="M-9 0H9M0-9V9M-6-6L6 6M6-6L-6 6"/></g>
      <g id="pine"><path d="M0-46L-30-6H-13L-38 28H38L13-6H30Z" fill="#0a2632"/><path d="M0-40L-20-8H-7L-25 21H25L7-8H20Z" fill="#1e5b66" opacity=".75"/><rect x="-3" y="22" width="6" height="19" rx="2" fill="#7c6750"/></g>
      <g id="snowPine"><use href="#pine"/><path d="M-20-8Q0-18 20-8M-25 9Q0-2 25 9M-30 25Q0 14 30 25" fill="none" stroke="#dff4ff" stroke-width="6" stroke-linecap="round" opacity=".95"/></g>
      <g id="grass"><path d="M0 18Q-2 1-12-10M0 18Q3-2 13-14M0 18Q2 3 2-16M0 18Q-6 5-18 1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g>
      <clipPath id="frameClip"><rect x="0" y="0" width="1280" height="800" rx="28"/></clipPath>
    </defs>

    <g clip-path="url(#frameClip)">
      <rect width="1280" height="800" fill="url(#bg)"/>
      <ellipse cx="640" cy="390" rx="455" ry="360" fill="url(#centerGlow)"/>

      <path d="M0 0H650C624 88 606 166 602 246C598 309 611 354 638 391C560 361 482 345 399 343C277 340 153 376 0 333Z" fill="url(#springField)"/>
      <path d="M0 318C154 363 277 339 401 350C492 358 565 382 638 410C604 461 584 518 579 590C573 664 583 733 612 800H0Z" fill="url(#summerField)"/>
      <path d="M1280 326C1124 367 1003 344 876 352C789 358 717 382 642 411C679 468 697 527 703 593C708 665 699 735 670 800H1280Z" fill="url(#autumnField)"/>
      <path d="M630 0H1280V338C1128 374 1002 342 878 345C791 347 718 368 642 392C670 346 683 302 679 244C674 164 655 86 630 0Z" fill="url(#winterField)"/>

      <path d="M0 329C183 381 343 327 474 365C538 384 591 405 642 424" fill="none" stroke="#77e9c6" stroke-opacity=".38" stroke-width="4"/>
      <path d="M1280 332C1107 380 948 330 808 366C747 382 694 404 640 425" fill="none" stroke="#ef9a43" stroke-opacity=".42" stroke-width="4"/>
      <path d="M631 0C659 112 689 228 648 389" fill="none" stroke="#a8e7ff" stroke-opacity=".28" stroke-width="3"/>

      <path d="M0 292C107 260 205 257 298 284C380 307 462 326 544 343C430 316 327 332 216 352C127 367 59 359 0 338Z" fill="#367b4d" opacity=".88"/>
      <path d="M38 272C120 223 196 211 268 235C332 256 389 294 455 314C353 290 273 294 192 314C130 330 75 323 38 310Z" fill="#4c9657" opacity=".66"/>
      <path d="M92 234Q160 126 286 146Q405 161 490 282" fill="none" stroke="#36241d" stroke-width="12" stroke-linecap="round" opacity=".95"/>
      <path d="M184 191Q265 129 351 165M266 163Q294 108 337 83M330 166Q389 120 440 132M205 190Q170 150 136 144" fill="none" stroke="#4e3025" stroke-width="8" stroke-linecap="round"/>
      ${uses('blossom', springBlossoms)}
      ${uses('seasonLeaf', springPetals, 'spring-petals')}
      <g color="#88eab1" opacity=".8">${uses('grass',[[82,334,.8],[135,348,.65],[194,333,.75],[285,347,.8],[386,333,.7],[476,354,.65]])}</g>
      <circle cx="73" cy="210" r="33" fill="#f7d788" opacity=".18"/>

      <path d="M0 470C119 417 208 423 294 456C373 486 459 491 571 457L579 800H0Z" fill="#0d3c36" opacity=".9"/>
      <path d="M-24 682C116 647 180 563 293 562C414 561 484 622 601 589C511 642 443 665 339 654C221 642 128 720 0 738Z" fill="url(#water)" opacity=".84"/>
      <path d="M-8 693C130 651 191 582 294 581C410 580 485 636 588 603" fill="none" stroke="#b7fbff" stroke-width="4" stroke-opacity=".66"/>
      <path d="M0 501C85 451 151 447 210 478C275 512 339 515 401 482C465 448 522 456 580 479" fill="none" stroke="#3b8d62" stroke-width="44" stroke-linecap="round" opacity=".48"/>
      ${uses('seasonLeaf', summerLeaves, 'summer-leaves')}
      <g color="#76df9b" opacity=".85">${uses('grass',[[54,635,1],[108,612,.9],[176,591,.8],[246,612,.95],[337,602,.86],[424,625,.95],[509,609,.75]])}</g>
      <g fill="#d9f9bb" opacity=".85"><circle cx="124" cy="585" r="3"/><circle cx="153" cy="611" r="4"/><circle cx="205" cy="572" r="3"/><circle cx="385" cy="613" r="3"/><circle cx="464" cy="580" r="4"/></g>

      <path d="M699 472C798 431 889 430 971 464C1060 500 1144 492 1280 443V800H670Z" fill="#6d3518" opacity=".82"/>
      <path d="M704 639C820 587 922 604 1018 650C1103 691 1190 684 1280 643V800H670Z" fill="#b15b1c" opacity=".44"/>
      <path d="M980 527Q1050 432 1148 460Q1211 478 1264 543" fill="none" stroke="#4a271a" stroke-width="15" stroke-linecap="round"/>
      <path d="M1043 478Q1082 426 1113 398M1114 455Q1162 407 1215 414M1074 460Q1038 420 1003 424" fill="none" stroke="#53301f" stroke-width="9" stroke-linecap="round"/>
      <g fill="url(#autumnCanopy)" filter="url(#seasonGlow)" opacity=".96"><circle cx="997" cy="425" r="34"/><circle cx="1040" cy="404" r="43"/><circle cx="1088" cy="392" r="40"/><circle cx="1136" cy="405" r="44"/><circle cx="1185" cy="429" r="39"/><circle cx="1231" cy="454" r="34"/><circle cx="1098" cy="438" r="46"/></g>
      <g color="#f4b33f">${uses('grass',[[761,678,1.05],[801,692,.95],[846,670,1.1],[891,700,.92],[938,675,1.04],[1191,682,1],[1234,660,.9]])}</g>
      <g color="#f08224">${uses('seasonLeaf', autumnLeaves)}</g>
      <path d="M1220 704q23-42 46 0q-23 32-46 0Z" fill="#d96a1b" opacity=".78"/>

      <path d="M694 322C776 287 841 269 915 280C1003 294 1086 286 1165 254C1211 236 1248 235 1280 245V351C1139 374 1004 344 879 350C806 353 744 371 674 397Z" fill="url(#snow)" opacity=".93"/>
      <path d="M791 269L879 146L956 250L1036 127L1146 267Z" fill="#2e5d7b" opacity=".9"/>
      <path d="M791 269L879 146L907 191L928 177L956 250ZM960 244L1036 127L1074 181L1092 171L1146 267Z" fill="#ddecf7" opacity=".9"/>
      <path d="M880 350C938 325 994 320 1056 329C1124 339 1184 333 1284 301" fill="none" stroke="#e7f8ff" stroke-width="26" stroke-linecap="round" opacity=".36"/>
      <path d="M913 341C986 325 1050 327 1113 335C1170 342 1219 332 1280 313" fill="none" stroke="#86d7f0" stroke-width="7" stroke-linecap="round" opacity=".72"/>
      ${uses('snowPine',[[774,289,.84],[845,302,.7],[949,286,.78],[1093,298,.84],[1189,282,.72],[1240,296,.61]])}
      ${uses('snowStar', winterStars)}

      <ellipse cx="640" cy="592" rx="210" ry="86" fill="#091712" opacity=".82" filter="url(#softShadow)"/>
      <path d="M476 610C529 574 579 557 640 558C703 557 752 574 804 610C752 643 704 659 641 660C578 660 528 645 476 610Z" fill="#14291e" stroke="#5ce1c7" stroke-opacity=".18" stroke-width="2"/>

      <g fill="none" stroke="url(#root)" stroke-linecap="round" stroke-linejoin="round" filter="url(#treeGlow)">
        <path d="M640 525C612 568 577 600 525 626C476 650 423 657 365 666" stroke-width="18"/>
        <path d="M632 530C603 583 573 624 532 666C501 698 464 724 418 747" stroke-width="10"/>
        <path d="M646 532C675 576 709 603 756 628C809 656 861 662 920 671" stroke-width="18"/>
        <path d="M649 530C681 585 711 627 750 667C781 699 820 726 864 748" stroke-width="10"/>
        <path d="M621 535C587 562 553 576 511 583" stroke-width="9"/>
        <path d="M659 536C695 563 730 578 772 585" stroke-width="9"/>
      </g>

      <g filter="url(#softShadow)">
        <path d="M601 566C614 521 620 477 615 438C611 409 604 388 601 366C620 377 633 390 641 406C649 389 662 375 681 363C676 391 669 414 668 440C665 480 674 522 690 566C673 551 657 543 640 543C624 543 617 551 601 566Z" fill="url(#trunk)"/>
        <g fill="none" stroke="url(#trunk)" stroke-linecap="round" stroke-linejoin="round" filter="url(#treeGlow)">
          <path d="M640 497C635 449 635 405 642 357C648 314 650 269 648 213" stroke-width="25"/>
          <path d="M639 384C605 346 572 313 533 278" stroke-width="18"/>
          <path d="M632 350C598 317 565 292 519 270" stroke-width="13"/>
          <path d="M645 368C684 333 715 304 752 260" stroke-width="18"/>
          <path d="M649 338C690 302 729 277 778 250" stroke-width="13"/>
          <path d="M640 317C618 286 602 252 594 217" stroke-width="12"/>
          <path d="M648 306C674 277 691 240 701 205" stroke-width="12"/>
          <path d="M608 332C570 329 536 314 500 288" stroke-width="10"/>
          <path d="M684 326C720 324 757 308 795 280" stroke-width="10"/>
          <path d="M644 278C625 250 623 224 624 193" stroke-width="9"/>
          <path d="M650 272C666 245 672 217 668 187" stroke-width="9"/>
        </g>
      </g>
      <g filter="url(#seasonGlow)">${uses('leaf', canopyLeaves)}</g>

      <g opacity=".72"><circle cx="640" cy="588" r="6" fill="#fff1c7"/><circle cx="640" cy="588" r="15" fill="none" stroke="#64ead5" stroke-opacity=".3"/></g>
      <path d="M640 153V112" stroke="#fff1ca" stroke-width="2" stroke-opacity=".38"/>
      <circle cx="640" cy="100" r="4" fill="#5ce8dc" opacity=".72"/>
      <rect x="1" y="1" width="1278" height="798" rx="28" fill="none" stroke="#a5dce7" stroke-opacity=".12" stroke-width="2"/>
    </g>
  `;

  svg.querySelectorAll('.spring-petals').forEach(node => node.setAttribute('style', 'color:#f5a5bf'));
  svg.querySelectorAll('.summer-leaves').forEach(node => node.setAttribute('style', 'color:#45b978'));

  host.replaceChildren(svg);
  host.setAttribute('role', 'img');
  host.setAttribute('aria-label', 'A static code-drawn Consider the Energy tree joins four permanent seasonal landscapes: spring above left, summer below left, autumn below right, and winter above right.');
  host.dataset.lifecycleStatus = 'static-ready';
  host.dataset.communityVisual = 'STATIC_INTEGRATED_FOUR_SEASON_TREE';
  host.dataset.communityMotion = 'NONE';

  const receipt = Object.freeze({
    schema: 'COMMUNITY_STATIC_INTEGRATED_SEASONAL_TREE_RECEIPT_v1',
    contract: CONTRACT,
    rendered: true,
    inlineSvg: true,
    seasonCount: 4,
    centralTreeDominant: true,
    integratedLandscape: true,
    runtimeImageAssets: 0,
    canvasCount: 0,
    webglContextCount: 0,
    animationLoopCount: 0
  });
  globalThis.DGB_COMMUNITY_STATIC_SEASONAL_TREE_RECEIPT = receipt;
}

export { CONTRACT as DGB_COMMUNITY_STATIC_SEASONAL_TREE_CONTRACT };
