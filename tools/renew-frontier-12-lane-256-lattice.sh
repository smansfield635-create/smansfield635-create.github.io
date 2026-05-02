#!/usr/bin/env bash
set -euo pipefail

CONTRACT="FRONTIER_12_LANE_256_LATTICE_REINTRODUCTION_TNT_v1"

LANES=$(cat <<'LANES'
closed-loop|Closed Loop|The loop closes when the return path is built.|Closed Loop turns expansion into a system that can receive feedback, correct itself, prove completion, and return without falling apart.|Feedback;Return logic;Proof loops;Completion pathways|Input;Signal;Correction;Receipt
energy|Energy|Energy is pressure disciplined into usable motion.|Energy carries power, force, movement, charge, capacity, and operating pressure without letting intensity become chaos.|Power;Motion;Capacity;Pressure|Ignition;Flow;Charge;Sustain
infrastructure|Infrastructure|The future needs rails before speed.|Infrastructure holds the support layers, utilities, foundations, route rails, and unseen systems that let expansion survive contact with reality.|Support layers;Rails;Utilities;Foundation|Base;Supply;Transport;Continuity
lattice|Lattice|The lattice is the grid under the edge.|Lattice carries state-space organization, grid logic, 256-field structure, and the geometry needed to keep the Frontier from becoming an unbounded pile of ideas.|Grid logic;State space;Structural mapping;256 geometry|Nodes;Edges;Cells;Fields
manual|Manual|A frontier without instructions becomes noise.|Manual turns discovery into usable operating knowledge: instructions, field notes, reference logic, controls, and repeatable procedure.|Instructions;Reference logic;Field notes;Controls|Read;Operate;Verify;Repeat
shimmer|Shimmer|The signal has to be felt before it can be followed.|Shimmer carries surface effect, perception layer, atmosphere, resonance, and the visual-signal language of future systems.|Signal;Atmosphere;Perception;Surface effect|Glow;Trace;Tone;Field
trajectory|Trajectory|Direction turns movement into a path.|Trajectory turns motion into readable movement: direction, progress, path projection, velocity, and future-course mapping.|Direction;Path projection;Progress mapping;System motion|Bearing;Vector;Course;Arrival
urban|Urban|The city is where systems meet people.|Urban carries built-environment logic, civic surfaces, population layers, access routes, density, and the visible structure of human systems.|City systems;Population layers;Civic surfaces;Built environment|District;Flow;Access;Civic
vision-remote|Vision Remote|Distance still needs a clear line of sight.|Vision Remote carries remote visibility, distributed sightlines, distance interfaces, relay logic, and the ability to inspect from beyond the immediate room.|Remote visibility;Distance interfaces;Distributed sightlines;Relay logic|Source;Relay;Signal;Receive
vision|Vision|The future must be seen before it can be built.|Vision carries visual systems, imagination surface, sightline planning, render direction, and the first public shape of what comes next.|Visual systems;Imagination surface;Sightlines;Future-facing design|Image;Focus;Frame;Reveal
waste|Waste|Nothing is waste until the system refuses to recover it.|Waste carries loss, recovery, inefficiency, disposal, circularity, cleanup logic, and the discipline of turning leakage into usable return.|Loss;Recovery;Circularity;Cleanup logic|Leak;Sort;Recover;Return
water|Water|Water is the baseline flow under every living system.|Water carries flow, support, survival layer, resource movement, maritime logic, hydration logic, and baseline systems.|Flow;Support;Resource motion;Baseline systems|Source;Channel;Reservoir;Return
LANES
)

emit_sibling_cards() {
  local current="$1"
  while IFS='|' read -r slug title statement lead owns sectors; do
    [ -z "$slug" ] && continue
    if [ "$slug" = "$current" ]; then
      current_attr=' aria-current="page"'
      label="Current Lane"
      action="Current route"
    else
      current_attr=""
      label="Sibling Lane"
      action="Open lane"
    fi

    cat <<HTML
        <a class="lane-card" href="/frontier/${slug}/"${current_attr}>
          <span>${label}</span>
          <h3>${title}</h3>
          <p>${lead}</p>
          <strong>${action}</strong>
        </a>
HTML
  done <<< "$LANES"
}

emit_owner_cards() {
  local owns="$1"
  local i=1
  IFS=';' read -ra parts <<< "$owns"
  for item in "${parts[@]}"; do
    cat <<HTML
        <article class="metric-card">
          <span>Lane ownership ${i}</span>
          <h3>${item}</h3>
          <p>This function belongs to the lane and expands through the 256 lattice without taking over another Frontier lane.</p>
        </article>
HTML
    i=$((i + 1))
  done
}

write_lane() {
  local slug="$1"
  local title="$2"
  local statement="$3"
  local lead="$4"
  local owns="$5"
  local sectors="$6"
  local route="/frontier/${slug}/"
  local page_id="frontier-${slug}"
  local file="frontier/${slug}/index.html"
  local lane_contract="FRONTIER_${slug^^}_256_LATTICE_REINTRODUCTION_TNT_v1"
  lane_contract="${lane_contract//-/_}"

  mkdir -p "frontier/${slug}"

  cat > "$file" <<HTML
<!doctype html>
<html
  lang="en"
  data-page-id="${page_id}"
  data-page="${page_id}"
  data-route="${route}"
  data-contract="${lane_contract}"
  data-collective-contract="${CONTRACT}"
  data-generation="frontier-256-lane-gateway-v1"
  data-estate="rich-manor-and-estate"
  data-parent-route="/frontier/"
  data-structural-parent-route="/explore/"
  data-current-route="${route}"
  data-frontier-lane="${slug}"
  data-construct-class="frontier-lane"
  data-lattice-enabled="true"
  data-lattice-scale="256"
  data-lattice-geometry="4x4x4x4"
  data-lattice-quadrants="4"
  data-lattice-sectors="16"
  data-lattice-checkpoints="64"
  data-lattice-cells="256"
  data-heavy-runtime-loaded="false"
  data-visual-pass-claimed="false"
>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Frontier / ${title} · Diamond Gate Bridge</title>
  <meta name="description" content="${title} is a Frontier lane renewed with 256-lattice geometry, parent backlinks, sibling backlinks, origin routing, and Gauges-readable receipts.">
  <link rel="stylesheet" href="/assets/dgb-ui-shell.css?v=DGB_GLOBAL_UI_SHELL_ALIGNMENT_TNT_v1">

  <style>
    :root {
      --gold: #f2c76f;
      --text: #f5f7fb;
      --muted: rgba(226,234,248,.76);
      --line: rgba(180,205,255,.18);
      --blue: #a9c5ff;
      --green: #8ff0c6;
      --purple: #d7a5ff;
      --orange: #ff9f7a;
    }

    body {
      overflow-x: hidden;
      background:
        radial-gradient(circle at 50% -8%, rgba(242,199,111,.14), transparent 34%),
        radial-gradient(circle at 84% 68%, rgba(215,165,255,.12), transparent 34%),
        radial-gradient(circle at 18% 80%, rgba(125,181,255,.10), transparent 34%),
        linear-gradient(180deg, #050813, #070c18 58%, #040711);
    }

    .lane-stage,
    .lane-panel {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(242,199,111,.24);
      border-radius: 36px;
      background:
        radial-gradient(circle at 80% 20%, rgba(215,165,255,.10), transparent 26rem),
        linear-gradient(180deg, rgba(12,20,38,.86), rgba(6,10,22,.97));
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.035),
        0 28px 90px rgba(0,0,0,.38);
      padding: clamp(28px, 6vw, 70px);
      margin-top: 18px;
      isolation: isolate;
    }

    .lane-stage::before,
    .lane-panel::before {
      content: "";
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(circle at 78% 52%, rgba(242,199,111,.10), transparent 18%),
        radial-gradient(circle at 78% 52%, transparent 0 23%, rgba(215,165,255,.13) 24%, transparent 25% 100%),
        radial-gradient(circle at 78% 52%, transparent 0 45%, rgba(169,197,255,.10) 46%, transparent 47% 100%);
      filter: blur(8px);
      opacity: .76;
      pointer-events: none;
      z-index: -2;
    }

    .hero-mark,
    .route-kicker,
    .lane-card span,
    .metric-card span,
    .sector-card span,
    .geometry-card span {
      margin: 0 0 14px;
      color: var(--gold);
      font-size: .78rem;
      font-weight: 950;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    .hero-title {
      max-width: 1100px;
      margin: 0;
      color: var(--text);
      font-size: clamp(3rem, 10vw, 7.4rem);
      line-height: .88;
      letter-spacing: -.07em;
      text-wrap: balance;
    }

    .hero-title span {
      color: #ffe5a3;
      text-shadow: 0 0 42px rgba(242,199,111,.15);
    }

    .hero-lead {
      max-width: 920px;
      margin: 24px 0 0;
      color: rgba(245,247,251,.88);
      font-size: clamp(1.22rem, 3.2vw, 1.94rem);
      line-height: 1.18;
      letter-spacing: -.035em;
      text-wrap: balance;
    }

    .body-copy,
    .section-copy {
      max-width: 900px;
      color: var(--muted);
      font-size: 1.08rem;
      line-height: 1.58;
    }

    .body-copy {
      margin: 18px 0 0;
    }

    .section-copy {
      margin: 0;
    }

    .chip-row,
    .action-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 26px;
    }

    .lane-chip {
      display: inline-flex;
      align-items: center;
      min-height: 38px;
      border: 1px solid rgba(172,191,230,.24);
      border-radius: 999px;
      padding: 8px 13px;
      color: rgba(242,246,255,.88);
      background: rgba(255,255,255,.045);
      font-size: .86rem;
      font-weight: 850;
    }

    .lane-chip.lock {
      border-color: rgba(242,199,111,.58);
      color: #ffe7a7;
      background: rgba(242,199,111,.11);
    }

    .section-title {
      margin: 0 0 12px;
      color: var(--text);
      font-size: clamp(2.1rem, 6vw, 4.2rem);
      line-height: .94;
      letter-spacing: -.055em;
      text-wrap: balance;
    }

    .geometry-grid,
    .metric-grid,
    .sector-grid,
    .lane-grid,
    .route-grid {
      display: grid;
      gap: 14px;
      margin-top: 24px;
    }

    .geometry-grid,
    .metric-grid,
    .sector-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .lane-grid,
    .route-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .geometry-card,
    .metric-card,
    .sector-card,
    .lane-card,
    .route-card {
      position: relative;
      min-height: 158px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 18px;
      background:
        radial-gradient(circle at 18% 0%, rgba(215,165,255,.11), transparent 36%),
        rgba(255,255,255,.045);
      color: var(--text);
      text-decoration: none;
      overflow: hidden;
    }

    .geometry-card h3,
    .metric-card h3,
    .sector-card h3,
    .lane-card h3,
    .route-card h3 {
      margin: 0;
      color: var(--text);
      font-size: 1.28rem;
      line-height: 1.04;
      letter-spacing: -.03em;
    }

    .geometry-card p,
    .metric-card p,
    .sector-card p,
    .lane-card p,
    .route-card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.48;
      flex: 1;
    }

    .lane-card strong,
    .route-card strong {
      color: #ffe7a7;
      font-size: .92rem;
    }

    .lattice-board {
      display: grid;
      grid-template-columns: repeat(16, minmax(0, 1fr));
      gap: 4px;
      margin-top: 24px;
      padding: 14px;
      border: 1px solid rgba(242,199,111,.20);
      border-radius: 26px;
      background:
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255,255,255,.025) 1px, transparent 1px),
        rgba(0,0,0,.20);
      background-size: 32px 32px;
    }

    .lattice-cell {
      aspect-ratio: 1;
      min-height: 34px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(180,205,255,.12);
      border-radius: 8px;
      background: rgba(255,255,255,.035);
      color: rgba(245,247,251,.86);
      font-size: .64rem;
      font-weight: 850;
      line-height: 1;
    }

    .lattice-cell i {
      display: block;
      margin-top: 3px;
      color: rgba(226,234,248,.46);
      font-size: .48rem;
      font-style: normal;
      font-weight: 700;
    }

    .lattice-cell:nth-child(4n+1) {
      border-color: rgba(242,199,111,.22);
    }

    .lattice-cell:nth-child(16n) {
      background: rgba(242,199,111,.075);
    }

    .lane-receipt {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .audit-source {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(0 0 0 0) !important;
      clip-path: inset(50%) !important;
      white-space: nowrap !important;
      border: 0 !important;
      padding: 0 !important;
      margin: -1px !important;
    }

    @media (max-width: 1100px) {
      .geometry-grid,
      .metric-grid,
      .sector-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .lane-grid,
      .route-grid {
        grid-template-columns: 1fr;
      }

      .lattice-board {
        grid-template-columns: repeat(8, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .lane-stage,
      .lane-panel {
        border-radius: 28px;
        padding: 30px 22px;
      }

      .hero-title {
        font-size: clamp(3.15rem, 14vw, 5.1rem);
      }

      .geometry-grid,
      .metric-grid,
      .sector-grid {
        grid-template-columns: 1fr;
      }

      .lattice-board {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  </style>
</head>

<body
  data-page="${page_id}"
  data-route="${route}"
  data-parent-route="/frontier/"
  data-structural-parent-route="/explore/"
  data-frontier-lane="${slug}"
  data-lattice-enabled="true"
>
  <a class="dgb-skip" href="#main">Skip to Frontier / ${title}</a>

  <header class="dgb-site-header">
    <div class="dgb-header-inner">
      <div class="dgb-brand-row">
        <a class="dgb-brand" href="/">Diamond Gate Bridge</a>
        <div class="dgb-subtitle">Explore · Frontier</div>
        <div class="dgb-room-line">Frontier / ${title} · 256 Lattice Lane</div>
      </div>

      <nav class="dgb-nav" aria-label="Primary navigation">
        <a href="/">Compass</a>
        <a href="/explore/">Explore</a>
        <a href="/frontier/">Frontier</a>
        <a href="${route}" aria-current="page">${title}</a>
        <a href="/laws/">Laws</a>
        <a href="/products/">Products</a>
        <a href="/showroom/">Showroom</a>
        <a href="/gauges/">Gauges</a>
      </nav>
    </div>
  </header>

  <main id="main" class="dgb-main">
    <section class="lane-stage">
      <p class="hero-mark">Explore / Frontier / ${title} · 256 Lattice Reintroduction</p>
      <h1 class="hero-title">${statement%.*} <span>.</span></h1>
      <p class="hero-lead">${lead}</p>
      <p class="body-copy">
        This is still the existing lane file at <strong>${route}</strong>. No route was changed.
        The 256 lattice is reintroduced inside the lane so the page now has geometry, scale, origin, backlinks, and verification.
      </p>

      <div class="chip-row">
        <span class="lane-chip lock">${route}</span>
        <span class="lane-chip lock">Parent: /frontier/</span>
        <span class="lane-chip lock">Structural parent: /explore/</span>
        <span class="lane-chip">4 quadrants</span>
        <span class="lane-chip">16 nodes</span>
        <span class="lane-chip">64 checkpoints</span>
        <span class="lane-chip">256 states</span>
      </div>

      <div class="action-row">
        <a class="dgb-button" href="/frontier/">Return to Frontier</a>
        <a class="dgb-button secondary" href="/explore/">Return to Explore</a>
        <a class="dgb-button secondary" href="#lane-256">Open 256 Lattice</a>
        <a class="dgb-button secondary" href="/gauges/">Read Gauges</a>
      </div>
    </section>

    <section class="lane-panel">
      <p class="hero-mark">256 geometry</p>
      <h2 class="section-title">The lane now has scale.</h2>
      <p class="section-copy">
        The geometry is 4 × 4 × 4 × 4: four quadrants, sixteen node-bands, sixty-four checkpoints, and two hundred fifty-six states.
      </p>

      <div class="geometry-grid">
        <article class="geometry-card"><span>Quadrants</span><h3>4</h3><p>The lane holds four directional faces: origin, function, proof, and return.</p></article>
        <article class="geometry-card"><span>Node bands</span><h3>16</h3><p>Each quadrant unfolds into four local node bands for lane-specific organization.</p></article>
        <article class="geometry-card"><span>Checkpoints</span><h3>64</h3><p>Each node band expands into four checkpoints for pressure, status, motion, and receipt.</p></article>
        <article class="geometry-card"><span>States</span><h3>256</h3><p>The full lane surface becomes a 256-state gateway instead of a thin backlink page.</p></article>
      </div>
    </section>

    <section class="lane-panel">
      <p class="hero-mark">Lane ownership</p>
      <h2 class="section-title">What ${title} owns.</h2>
      <p class="section-copy">This page expands its own lane function without swallowing the rest of Frontier.</p>
      <div class="metric-grid">
$(emit_owner_cards "$owns")
      </div>
    </section>

    <section class="lane-panel" id="lane-256">
      <p class="hero-mark">Visible 256 lattice</p>
      <h2 class="section-title">16 local sectors. 256 cells.</h2>
      <p class="section-copy">
        Each sector contains 16 cells. Each quadrant contains 64 cells. The board below gives the lane a visible geometry surface.
      </p>

      <div id="sector-grid" class="sector-grid" data-sector-roots="${sectors}"></div>
      <div id="lattice-board" class="lattice-board" aria-label="${title} 256-cell lattice"></div>
    </section>

    <section class="lane-panel">
      <p class="hero-mark">Frontier collective backlinks</p>
      <h2 class="section-title">Every sibling stays reachable.</h2>
      <p class="section-copy">
        Physical sibling routes remain under <strong>/frontier/[lane]/</strong>. This prevents the old 404 route mismatch from returning.
      </p>

      <div class="lane-grid">
$(emit_sibling_cards "$slug")
      </div>
    </section>

    <section class="lane-panel">
      <p class="hero-mark">Origin, parent, proof, diagnostics</p>
      <h2 class="section-title">No orphan lanes.</h2>
      <p class="section-copy">
        This lane keeps its origin route, Frontier parent, Explore structural parent, and verification routes visible.
      </p>

      <div class="route-grid">
        <a class="route-card" href="${route}"><span class="route-kicker">Origin route</span><h3>${title}</h3><p>The current lane remains its own origin page unless a stronger origin route is later confirmed.</p><strong>Current origin</strong></a>
        <a class="route-card" href="/frontier/"><span class="route-kicker">Parent</span><h3>Frontier</h3><p>Return to the expansion-edge root page.</p><strong>Open Frontier</strong></a>
        <a class="route-card" href="/explore/"><span class="route-kicker">Structural parent</span><h3>Explore</h3><p>Return to the route-map surface that structurally contains Frontier.</p><strong>Open Explore</strong></a>
        <a class="route-card" href="/laws/"><span class="route-kicker">Rule layer</span><h3>Laws</h3><p>Use Laws when expansion needs boundary control.</p><strong>Open Laws</strong></a>
        <a class="route-card" href="/showroom/"><span class="route-kicker">Proof layer</span><h3>Showroom</h3><p>Use Showroom when a claim needs public inspection.</p><strong>Open Showroom</strong></a>
        <a class="route-card" href="/gauges/"><span class="route-kicker">Diagnostics</span><h3>Gauges</h3><p>Use Gauges when route and receipt truth must be measured.</p><strong>Open Gauges</strong></a>
        <a class="route-card" href="/products/"><span class="route-kicker">Product layer</span><h3>Products</h3><p>Use Products when a lane becomes product-ready.</p><strong>Open Products</strong></a>
      </div>
    </section>

    <section class="dgb-card">
      <h2>Route receipt</h2>
      <pre class="dgb-receipt lane-receipt">${lane_contract}
collective_contract=${CONTRACT}
route=${route}
page=${page_id}
origin_route=${route}
parent_route=/frontier/
structural_parent_route=/explore/
frontier_lane=${slug}
physical_sibling_base=/frontier/
lattice_enabled=true
lattice_scale=256
lattice_mode=frontier-lane-expansion
lattice_geometry=4x4x4x4
lattice_quadrants=4
lattice_node_bands=16
lattice_checkpoints=64
lattice_states=256
heavy_runtime_loaded=false
planet_render_touched=false
runtime_touched=false
gauges_logic_touched=false
visual_pass_claimed=false</pre>
    </section>

    <section class="audit-source" aria-label="Frontier lane audit source">
      <a href="/frontier/">Frontier</a>
      <a href="/explore/">Explore</a>
$(while IFS='|' read -r s t st le ow se; do [ -n "$s" ] && printf '      <a href="/frontier/%s/">%s</a>\n' "$s" "$t"; done <<< "$LANES")
      <a href="/laws/">Laws</a>
      <a href="/products/">Products</a>
      <a href="/showroom/">Showroom</a>
      <a href="/gauges/">Gauges</a>
      <span>${lane_contract}</span>
      <span>${CONTRACT}</span>
    </section>
  </main>

  <footer class="dgb-footer">
    ${lane_contract} · Explore / Frontier / ${title} · 256 Lattice Lane.
  </footer>

  <script>
    (function () {
      "use strict";

      var sectorGrid = document.getElementById("sector-grid");
      var board = document.getElementById("lattice-board");
      var roots = (sectorGrid && sectorGrid.getAttribute("data-sector-roots") || "Origin;Function;Proof;Return").split(";");

      if (sectorGrid) {
        for (var s = 0; s < 16; s += 1) {
          var sector = document.createElement("article");
          var root = roots[Math.floor(s / 4)] || "Sector";
          var start = s * 16 + 1;
          var end = start + 15;

          sector.className = "sector-card";
          sector.innerHTML =
            "<span>Sector " + String(s + 1).padStart(2, "0") + "</span>" +
            "<h3>" + root + " " + ((s % 4) + 1) + "</h3>" +
            "<p>Cells " + String(start).padStart(3, "0") + "–" + String(end).padStart(3, "0") + " define this local 16-cell band.</p>";

          sectorGrid.appendChild(sector);
        }
      }

      if (board) {
        for (var i = 1; i <= 256; i += 1) {
          var q = Math.floor((i - 1) / 64) + 1;
          var sectorNo = Math.floor((i - 1) / 16) + 1;
          var local = ((i - 1) % 16) + 1;
          var cell = document.createElement("span");

          cell.className = "lattice-cell";
          cell.title = "${title} · Q" + q + " · Sector " + sectorNo + " · Cell " + i;
          cell.innerHTML = String(i).padStart(3, "0") + "<i>Q" + q + " S" + sectorNo + "." + local + "</i>";

          board.appendChild(cell);
        }
      }
    })();
  </script>
</body>
</html>
HTML

  echo "renewed ${file}"
}

while IFS='|' read -r slug title statement lead owns sectors; do
  [ -z "$slug" ] && continue
  write_lane "$slug" "$title" "$statement" "$lead" "$owns" "$sectors"
done <<< "$LANES"

echo "${CONTRACT}: renewed all 12 existing Frontier lane index.html files."
