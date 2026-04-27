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

  function textBlock(kicker, title, body, id) {
    return el("article", { className: "scene-copy" }, [
      el("p", { className: "eyebrow", text: kicker }),
      el(id ? "h1" : "h2", id ? { id, text: title } : { text: title }),
      el("p", { className: "lead", text: body })
    ]);
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
        textBlock(
          "Flat World · locked baseline",
          "Rich Manor and Estate",
          "Flat World is the verified 2D route map. It stays default, readable, and recoverable. Round World may render the living estate without changing routes, faking Gauges health, or replacing the Manor.",
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

  function renderOak() {
    return el("div", { className: "old-oak", "aria-label": "Massive 256-year-old snow-dusted oak" }, [
      el("div", { className: "oak-canopy" }),
      el("div", { className: "oak-trunk" }),
      el("div", { className: "oak-roots" }),
      el("div", { className: "hollow", "aria-hidden": "true" }),
      el("div", { className: "oak-name" }, [
        el("b", { text: "256-Year Oak" }),
        el("span", { text: "Old, heavy, snow-dusted, rooted, and alive in front of the Manor." })
      ])
    ]);
  }

  function renderSnowBlades() {
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

  function renderDock() {
    return el("div", { className: "scene-dock", "aria-label": "Compact Round World relation summary" }, [
      el("div", { className: "dock-card" }, [
        el("b", { text: "Snow ground" }),
        "Grass still exists under the snow; blades break through near the visitor."
      ]),
      el("div", { className: "dock-card" }, [
        el("b", { text: "Ecosystem" }),
        "Roots, bark, hollows, canopy, soil, and snow remain one living estate condition."
      ]),
      el("div", { className: "dock-card" }, [
        el("b", { text: "Summits" }),
        "256 diamonds / 256 carats of human potential remain attached to the Manor field."
      ]),
      el("div", { className: "dock-card" }, [
        el("b", { text: "Proof" }),
        "Gauges remain live authority. Render quality does not fake evidence."
      ])
    ]);
  }

  function renderRound(root) {
    root.appendChild(
      el("section", {
        className: "round-scene",
        "aria-label": "Round World rendered snow-ground estate scene",
        "data-round-world": "tree-of-life",
        "data-ground-condition": "snow"
      }, [
        el("div", { className: "winter-ridge", "aria-hidden": "true" }),
        el("div", { className: "snow-ground", "aria-hidden": "true" }),
        el("div", { className: "u-road", "aria-hidden": "true" }),
        el("div", { className: "road-grain", "aria-hidden": "true" }),
        textBlock(
          "World is round · snow-ground estate",
          "The ground has weather now.",
          "The Manor sits behind the 256-year-old oak. Snow is on the ground. Grass breaks through near the visitor. The U-road bends around the living foreground instead of floating as a symbolic outline."
        ),
        renderDock(),
        renderManor(),
        renderOak(),
        el("span", { className: "scene-label label-estate" }, [
          el("b", { text: "256-acre estate" }),
          " · winter ground inside the boundary"
        ]),
        el("span", { className: "scene-label label-road" }, [
          el("b", { text: "U-road" }),
          " · arrival, motion, return"
        ]),
        renderSnowBlades()
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

  function render(mode, root) {
    if (!root) return;

    root.replaceChildren();
    root.dataset.renderStatus = "rendering";
    root.dataset.renderMode = mode;

    if (mode === "round") {
      renderRound(root);
    } else if (mode === "globe") {
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
