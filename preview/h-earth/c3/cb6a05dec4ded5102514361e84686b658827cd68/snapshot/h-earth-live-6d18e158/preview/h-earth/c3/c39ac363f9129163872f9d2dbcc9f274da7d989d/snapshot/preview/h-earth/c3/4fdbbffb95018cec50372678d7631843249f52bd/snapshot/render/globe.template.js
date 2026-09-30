(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  function s(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    return node;
  }

  function addDefs(svg) {
    const defs = s("defs");

    defs.innerHTML = `
      <radialGradient id="demoOcean" cx="35%" cy="28%" r="74%">
        <stop offset="0%" stop-color="#9bd8ff"/>
        <stop offset="42%" stop-color="#2c78c8"/>
        <stop offset="100%" stop-color="#081c4c"/>
      </radialGradient>

      <radialGradient id="mirrorOcean" cx="35%" cy="28%" r="74%">
        <stop offset="0%" stop-color="#e6ddff"/>
        <stop offset="40%" stop-color="#7058c6"/>
        <stop offset="100%" stop-color="#120828"/>
      </radialGradient>

      <radialGradient id="globeGlow" cx="50%" cy="50%" r="68%">
        <stop offset="0%" stop-color="rgba(242,199,111,.32)"/>
        <stop offset="52%" stop-color="rgba(76,142,255,.20)"/>
        <stop offset="100%" stop-color="rgba(76,142,255,0)"/>
      </radialGradient>

      <filter id="softGlow">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="planetShadow">
        <feDropShadow dx="0" dy="26" stdDeviation="18" flood-color="#000000" flood-opacity=".46"/>
      </filter>
    `;

    svg.appendChild(defs);
  }

  function drawStars(svg) {
    const stars = s("g", { "data-render-layer": "stars" });

    for (let i = 0; i < 190; i += 1) {
      const x = 40 + ((i * 97) % 1520);
      const y = 40 + ((i * 53) % 820);
      const r = i % 13 === 0 ? 1.9 : i % 5 === 0 ? 1.2 : 0.7;

      stars.appendChild(s("circle", {
        cx: x,
        cy: y,
        r,
        fill: "rgba(255,255,255,.72)",
        opacity: i % 7 === 0 ? 0.92 : 0.44
      }));
    }

    svg.appendChild(stars);
  }

  function drawOrbit(svg) {
    const orbit = s("g", { "data-render-layer": "orbit-rings" });

    [
      { rx: 430, ry: 112, rotate: -12, stroke: "rgba(242,199,111,.26)", width: 2 },
      { rx: 500, ry: 142, rotate: 18, stroke: "rgba(118,177,255,.22)", width: 1.6 },
      { rx: 580, ry: 170, rotate: -31, stroke: "rgba(255,255,255,.10)", width: 1.2 }
    ].forEach((ring) => {
      orbit.appendChild(s("ellipse", {
        class: "orbit-ring",
        cx: 800,
        cy: 470,
        rx: ring.rx,
        ry: ring.ry,
        fill: "none",
        stroke: ring.stroke,
        "stroke-width": ring.width,
        transform: `rotate(${ring.rotate} 800 470)`
      }));
    });

    svg.appendChild(orbit);
  }

  function demoLandPaths() {
    return [
      "M 688 386 C 730 350, 772 358, 788 398 C 802 434, 768 458, 724 448 C 680 438, 654 416, 688 386 Z",
      "M 846 344 C 896 324, 956 352, 966 402 C 974 440, 940 468, 900 452 C 856 434, 820 386, 846 344 Z",
      "M 688 520 C 738 500, 788 520, 806 564 C 826 614, 778 640, 728 618 C 688 600, 658 552, 688 520 Z",
      "M 906 540 C 956 512, 1018 532, 1032 582 C 1046 632, 998 670, 946 650 C 900 632, 866 566, 906 540 Z"
    ];
  }

  function mirrorLandPaths() {
    return [
      "M 706 360 C 742 322, 812 330, 842 374 C 876 426, 828 470, 770 452 C 724 438, 670 400, 706 360 Z",
      "M 910 374 C 968 342, 1034 382, 1038 446 C 1042 510, 966 534, 914 492 C 870 456, 862 402, 910 374 Z",
      "M 690 548 C 742 514, 824 534, 842 594 C 862 662, 782 696, 724 656 C 678 624, 652 572, 690 548 Z"
    ];
  }

  function drawGrid(group, clipId, isMirror) {
    const grid = s("g", {
      class: "globe-grid",
      "clip-path": `url(#${clipId})`,
      opacity: isMirror ? 0.30 : 0.22
    });

    for (let i = -4; i <= 4; i += 1) {
      grid.appendChild(s("ellipse", {
        cx: 800,
        cy: 470,
        rx: 236,
        ry: Math.max(18, 236 - Math.abs(i) * 42),
        fill: "none",
        stroke: "rgba(255,255,255,.24)",
        "stroke-width": 1
      }));
    }

    for (let i = -3; i <= 3; i += 1) {
      grid.appendChild(s("ellipse", {
        cx: 800,
        cy: 470,
        rx: Math.max(18, 236 - Math.abs(i) * 48),
        ry: 236,
        fill: "none",
        stroke: "rgba(255,255,255,.20)",
        "stroke-width": 1
      }));
    }

    group.appendChild(grid);
  }

  function drawDemoClouds(group, clipId) {
    const clouds = s("g", {
      class: "globe-cloud",
      "clip-path": `url(#${clipId})`
    });

    [
      "M 610 444 C 672 412, 732 414, 788 452",
      "M 820 560 C 890 520, 976 530, 1032 582",
      "M 738 318 C 804 296, 894 310, 960 350"
    ].forEach((d) => {
      clouds.appendChild(s("path", {
        d,
        fill: "none",
        stroke: "rgba(255,255,255,.30)",
        "stroke-width": 18,
        "stroke-linecap": "round"
      }));
    });

    group.appendChild(clouds);
  }

  function drawMirrorMarker(group) {
    const mark = s("g", {
      "data-render-layer": "mirror-buildable-marker",
      "data-estate-land-placement": "mirror-universe-only"
    });

    mark.appendChild(s("circle", {
      cx: 800,
      cy: 470,
      r: 74,
      fill: "none",
      stroke: "rgba(242,199,111,.60)",
      "stroke-width": 2,
      "stroke-dasharray": "8 10"
    }));

    const label = s("text", {
      class: "universe-subtext",
      x: 800,
      y: 474,
      "text-anchor": "middle"
    });

    label.textContent = "MANOR / ESTATE CONTEXT";
    mark.appendChild(label);
    group.appendChild(mark);
  }

  function drawGlobe(svg, config) {
    const universe = config && config.universe === "mirror" ? "mirror" : "demo";
    const isMirror = universe === "mirror";
    const clipId = isMirror ? "mirrorGlobeClip" : "demoGlobeClip";

    const group = s("g", {
      class: "globe-group",
      "data-render-template": "globe",
      "data-universe": universe,
      "data-demo-universe": "globe-only",
      "data-mirror-universe": "buildable-world-container"
    });

    group.appendChild(s("circle", {
      cx: 800,
      cy: 470,
      r: 330,
      fill: "url(#globeGlow)",
      filter: "url(#softGlow)"
    }));

    group.appendChild(s("circle", {
      class: "globe-core",
      cx: 800,
      cy: 470,
      r: 238,
      fill: isMirror ? "url(#mirrorOcean)" : "url(#demoOcean)",
      stroke: isMirror ? "rgba(242,199,111,.48)" : "rgba(185,224,255,.46)",
      "stroke-width": 3,
      filter: "url(#planetShadow)"
    }));

    const clip = s("clipPath", { id: clipId });
    clip.appendChild(s("circle", { cx: 800, cy: 470, r: 236 }));
    group.appendChild(clip);

    drawGrid(group, clipId, isMirror);

    const land = s("g", {
      class: isMirror ? "globe-mirror-land" : "globe-land",
      "clip-path": `url(#${clipId})`
    });

    const paths = isMirror ? mirrorLandPaths() : demoLandPaths();

    paths.forEach((d, index) => {
      land.appendChild(s("path", {
        d,
        fill: isMirror
          ? index === 0 ? "rgba(242,199,111,.58)" : "rgba(182,151,255,.44)"
          : "rgba(74,148,84,.58)",
        stroke: isMirror ? "rgba(255,247,228,.18)" : "rgba(219,255,220,.18)",
        "stroke-width": 2
      }));
    });

    group.appendChild(land);

    if (isMirror) {
      drawMirrorMarker(group);
    } else {
      drawDemoClouds(group, clipId);
    }

    const title = s("text", {
      class: "universe-label",
      x: 800,
      y: 760,
      "text-anchor": "middle"
    });

    title.textContent = isMirror ? "Mirror / Nine Summits Universe" : "Demo Universe Globe";
    group.appendChild(title);

    const sub = s("text", {
      class: "universe-subtext",
      x: 800,
      y: 786,
      "text-anchor": "middle"
    });

    sub.textContent = isMirror
      ? "Buildable world container for Rich Manor and Estate."
      : "Globe-only presentation. No estate land is built here.";

    group.appendChild(sub);
    svg.appendChild(group);
  }

  function createScene(config) {
    const universe = config && config.universe === "mirror" ? "mirror" : "demo";

    const scene = document.createElement("section");
    scene.className = "universe-scene";
    scene.setAttribute("aria-label", universe === "mirror" ? "Mirror Universe globe" : "Demo Universe globe");
    scene.dataset.renderTemplate = "globe";
    scene.dataset.universe = universe;

    const svg = s("svg", {
      class: "universe-svg",
      viewBox: "0 0 1600 900",
      role: "img",
      "aria-label": universe === "mirror"
        ? "Mirror and Nine Summits Universe buildable globe"
        : "Demo Universe globe-only presentation"
    });

    addDefs(svg);
    drawStars(svg);
    drawOrbit(svg);
    drawGlobe(svg, { universe });

    scene.appendChild(svg);
    return scene;
  }

  window.DGBGlobeTemplate = Object.freeze({
    createScene
  });
})();
