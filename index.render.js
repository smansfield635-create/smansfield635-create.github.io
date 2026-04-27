(function () {
  "use strict";

  const routes = [
    { href: "/", label: "Compass", note: "orientation" },
    { href: "/door/", label: "Door", note: "entry threshold" },
    { href: "/home/", label: "Home", note: "receiving hall" },
    { href: "/products/", label: "Products", note: "source chamber" },
    { href: "/showroom/", label: "Showroom", note: "public proof" },
    { href: "/gauges/", label: "Gauges", note: "live authority" }
  ];

  const zoomLabels = {
    estate: "Estate",
    oak: "Oak",
    habitat: "Habitat",
    wildlife: "Wildlife"
  };

  const zoneLabels = {
    roots: "Roots",
    bark: "Bark",
    hollow: "Hollow",
    branches: "Branches",
    canopy: "Canopy",
    snowVerge: "Snow verge"
  };

  const wildlifeText = {
    roots: "Root shelter, low tracks, and snow-crust openings sit at the base of the old oak.",
    bark: "Bark insects, frost ledges, and vertical cracks make the trunk inspectable.",
    hollow: "The hollow carries shadow, shelter, and a small protected habitat read.",
    branches: "Branch movement, nest structure, and small winter life sit above the trunk.",
    canopy: "Bird hints and frost-heavy leaves remain subtle inside the canopy.",
    snowVerge: "Tracks, broken grass, and snow-verge life mark the edge of the road."
  };

  function el(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined) return;

      if (key === "className") {
        node.className = value;
        return;
      }

      if (key === "text") {
        node.textContent = value;
        return;
      }

      node.setAttribute(key, String(value));
    });

    (children || []).forEach((child) => {
      if (typeof child === "string") {
        node.appendChild(document.createTextNode(child));
      } else if (child) {
        node.appendChild(child);
      }
    });

    return node;
  }

  function sceneCopy(kicker, title, body, id) {
    return el("article", { className: "scene-copy" }, [
      el("p", { className: "eyebrow", text: kicker }),
      el(id ? "h1" : "h2", id ? { id, text: title } : { text: title }),
      el("p", { className: "lead", text: body })
    ]);
  }

  function buttonList(className, label, items, attrName, currentValue) {
    return el("div", { className, role: "group", "aria-label": label },
      Object.entries(items).map(([value, text]) =>
        el("button", {
          type: "button",
          className: currentValue === value ? "scene-control active" : "scene-control",
          [attrName]: value,
          "aria-pressed": currentValue === value ? "true" : "false",
          text
        })
      )
    );
  }

  function renderFlat(root) {
    const grid = el("div", { className: "flat-map-grid" },
      routes.map((route) =>
        el("a", { className: "flat-node", href: route.href }, [
          route.label,
          el("small", { text: route.note })
        ])
      )
    );

    root.appendChild(
      el("section", { className: "flat-scene", "aria-label": "Flat World verified route map" }, [
        el("div", { className: "flat-map", "aria-hidden": "true" }, [grid]),
        sceneCopy(
          "Flat World · locked baseline",
          "Rich Manor and Estate",
          "Flat World is the verified 2D route map. It stays default, readable, and recoverable. Round World may inspect the living estate without changing routes, faking Gauges health, or replacing the Manor.",
          "H1_COMPASS"
        )
      ])
    );
  }

  function renderManor() {
    return el("div", { className: "manor-layer", "aria-label": "Rich Manor behind the oak" }, [
      el("div", { className: "manor-roof" }),
      el("div", { className: "manor-body" }, [
        el("b", { text: "Rich Manor" }),
        el("span", { text: "Central authority behind the winter foreground." })
      ])
    ]);
  }

  function renderOak(state) {
    const activeZone = state.treeZone || "roots";

    return el("div", {
      className: "old-oak",
      "aria-label": "Massive 256-year-old snow-dusted oak",
      "data-tree-object": "256-year-oak",
      "data-active-tree-zone": activeZone
    }, [
      el("div", { className: "oak-canopy zone-target", "data-zone-object": "canopy", "aria-hidden": "true" }),
      el("div", { className: "oak-trunk zone-target", "data-zone-object": "bark", "aria-hidden": "true" }),
      el("div", { className: "oak-roots zone-target", "data-zone-object": "roots", "aria-hidden": "true" }),
      el("div", { className: "root-arm root-arm-left", "aria-hidden": "true" }),
      el("div", { className: "root-arm root-arm-right", "aria-hidden": "true" }),
      el("div", { className: "hollow zone-target", "data-zone-object": "hollow", "aria-hidden": "true" }),
      el("div", { className: "branch-line branch-one zone-target", "data-zone-object": "branches", "aria-hidden": "true" }),
      el("div", { className: "branch-line branch-two zone-target", "data-zone-object": "branches", "aria-hidden": "true" }),

      el("div", { className: "wildlife-layer", "data-wildlife-system": "inspectable", "aria-hidden": state.zoom === "wildlife" ? "false" : "true" }, [
        el("span", { className: "wildlife-mark track track-one", "data-wildlife-object": "track_marks" }),
        el("span", { className: "wildlife-mark track track-two", "data-wildlife-object": "track_marks" }),
        el("span", { className: "wildlife-mark nest", "data-wildlife-object": "branch_nest" }),
        el("span", { className: "wildlife-mark insect insect-one", "data-wildlife-object": "bark_insects" }),
        el("span", { className: "wildlife-mark insect insect-two", "data-wildlife-object": "bark_insects" }),
        el("span", { className: "wildlife-mark hollow-shadow", "data-wildlife-object": "hollow_shadow" }),
        el("span", { className: "wildlife-mark bird-hint", "data-wildlife-object": "canopy_bird_hint" }),
        el("span", { className: "wildlife-mark verge-life", "data-wildlife-object": "snow_verge_life" })
      ]),

      el("div", { className: "oak-name" }, [
        el("b", { text: "256-Year Oak" }),
        el("span", { text: "Old, heavy, snow-dusted, rooted, and inspectable in front of the Manor." })
      ])
    ]);
  }

  function renderSnowGrass() {
    const field = el("div", { className: "snow-blade-field", "aria-hidden": "true" });
    const blades = [
      [2, 74, -8, .65], [5, 98, 6, .58], [8, 64, -4, .62], [12, 110, 9, .70],
      [16, 82, -11, .62], [20, 118, 7, .70], [24, 72, -5, .56], [28, 104, 12, .65],
      [32, 86, -7, .60], [36, 122, 5, .70], [40, 72, -9, .58], [44, 108, 8, .64],
      [48, 92, -6, .62], [52, 126, 7, .72], [56, 80, -10, .58], [60, 114, 8, .68],
      [64, 76, -5, .58], [68, 102, 10, .66], [72, 84, -8, .60], [76, 118, 6, .69],
      [80, 72, -9, .55], [84, 106, 8, .64], [88, 88, -7, .60], [92, 120, 5, .68],
      [96, 78, -6, .56]
    ];

    blades.forEach(([x, h, r, o]) => {
      const blade = el("span", { className: "grass-blade" });
      blade.style.setProperty("--x", `${x}%`);
      blade.style.setProperty("--h", `${h}px`);
      blade.style.setProperty("--r", `${r}deg`);
      blade.style.setProperty("--o", String(o));
      field.appendChild(blade);
    });

    return field;
  }

  function renderInspectorPanel(state) {
    const zone = state.treeZone || "roots";

    return el("aside", { className: "inspector-panel", "aria-label": "Tree inspection readout" }, [
      el("p", { className: "eyebrow", text: "Tree inspection" }),
      el("h3", { text: zoneLabels[zone] || "Roots" }),
      el("p", { text: wildlifeText[zone] || wildlifeText.roots }),
      el("div", { className: "inspection-receipt" }, [
        el("span", { text: `Zoom: ${zoomLabels[state.zoom] || "Estate"}` }),
        el("span", { text: `Zone: ${zoneLabels[zone] || "Roots"}` }),
        el("span", { text: "Ground: snow with grass breaks" }),
        el("span", { text: "Routes: unchanged" })
      ])
    ]);
  }

  function renderRoundControls(state) {
    return el("div", { className: "round-control-dock", "aria-label": "Round World inspection controls" }, [
      buttonList("scene-control-row", "Round zoom controls", zoomLabels, "data-zoom", state.zoom),
      buttonList("scene-control-row zone-row", "Tree zone controls", zoneLabels, "data-tree-zone", state.treeZone)
    ]);
  }

  function renderRound(root, state) {
    const zoom = state.zoom || "estate";
    const zone = state.treeZone || "roots";

    root.appendChild(
      el("section", {
        className: `round-scene zoom-${zoom}`,
        "aria-label": "Round World snow-ground oak ecosystem",
        "data-round-world": "tree-of-life",
        "data-ground-condition": "snow",
        "data-zoom-level": zoom,
        "data-tree-zone": zone
      }, [
        el("div", { className: "winter-sky", "aria-hidden": "true" }),
        el("div", { className: "winter-ridge", "aria-hidden": "true" }),
        el("div", { className: "snow-ground", "aria-hidden": "true" }),
        el("div", { className: "u-road", "aria-hidden": "true" }),
        el("div", { className: "road-grain", "aria-hidden": "true" }),

        sceneCopy(
          "World is round · inspectable winter estate",
          zoom === "estate" ? "The snow shows the ground now." :
          zoom === "oak" ? "Move closer to the old oak." :
          zoom === "habitat" ? "The tree separates into habitats." :
          "The wildlife becomes discoverable.",
          zoom === "estate"
            ? "The Manor sits behind the 256-year-old oak. Snow is on the ground. Grass breaks through near the visitor. The U-road bends around the living foreground."
            : zoom === "oak"
              ? "The oak grows in frame without replacing the Manor. Roots, trunk, bark, canopy, road, and snow-ground remain tied together."
              : zoom === "habitat"
                ? "Roots, bark, hollow, branches, canopy, and snow verge become inspectable zones rather than one decorative tree shape."
                : "Tracks, bark insects, branch nest, hollow shadow, snow-verge life, and small canopy hints appear only inside their habitat zones."
        ),

        renderRoundControls(state),
        renderInspectorPanel(state),
        renderManor(),
        renderOak(state),

        el("span", { className: "scene-label label-estate" }, [
          el("b", { text: "256-acre estate" }),
          " · winter ground inside the boundary"
        ]),
        el("span", { className: "scene-label label-road" }, [
          el("b", { text: "U-road" }),
          " · arrival, motion, return"
        ]),

        renderSnowGrass()
      ])
    );
  }

  function renderGlobe(root) {
    root.appendChild(
      el("section", { className: "globe-scene", "aria-label": "Globe Meta later locked state" }, [
        el("article", { className: "globe-card" }, [
          el("div", { className: "globe-orb", "aria-hidden": "true" }),
          el("p", { className: "eyebrow", text: "Globe / Meta · locked later" }),
          el("h2", { text: "Not implemented in this pass." }),
          el("p", {
            className: "lead",
            text: "The Globe view remains reserved for a later Meta build. This file does not create a fake 3D renderer, fake route health, fake universe map, or new routes."
          })
        ])
      ])
    );
  }

  function render(state, root) {
    if (!root) return;

    const nextState = {
      mode: state && state.mode ? state.mode : "flat",
      zoom: state && state.zoom ? state.zoom : "estate",
      treeZone: state && state.treeZone ? state.treeZone : "roots",
      wildlifeFocus: state && state.wildlifeFocus ? state.wildlifeFocus : "none"
    };

    root.replaceChildren();
    root.dataset.renderStatus = "rendering";
    root.dataset.renderMode = nextState.mode;
    root.dataset.zoomLevel = nextState.zoom;
    root.dataset.treeZone = nextState.treeZone;
    root.dataset.wildlifeFocus = nextState.wildlifeFocus;

    if (nextState.mode === "round") {
      renderRound(root, nextState);
    } else if (nextState.mode === "globe") {
      renderGlobe(root);
    } else {
      renderFlat(root);
    }

    root.dataset.renderStatus = "complete";
  }

  window.DGBIndexRender = Object.freeze({
    render
  });
})();
