/* TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · FOUR-COIN FINANCIAL TEMPLATE · B3

   RESULT:
     - Updates ARCHCOIN from ordinary product/coin read to four-coin financial template.
     - Defines North / East / South / West coin positions.
     - Keeps Vault Chamber route as /products/archcoin/.
     - Preserves local safe-boot visual cylinder.
     - Adds boundary language: not automatic chain interoperability, not chain replacement.
     - No external runtime dependency.
*/

const ROOT = "/products/archcoin";

const ROUTES = Object.freeze({
  compass: "/",
  products: "/products/",
  vault: "/products/archcoin/",
  upperRoom: "/big-laugh/upper-room/",
  showroom: "/showroom/"
});

const COINS = Object.freeze([
  {
    key: "North",
    name: "North Coin",
    short: "N",
    angle: 0,
    role: "Contract Authority",
    read: "Defines the agreement, authority, permissions, and binding frame for the transaction."
  },
  {
    key: "East",
    name: "East Coin",
    short: "E",
    angle: 90,
    role: "Inbound Value",
    read: "Reads accounts receivable, incoming value, deposits, receipts, and counterparty inflow."
  },
  {
    key: "South",
    name: "South Coin",
    short: "S",
    angle: 180,
    role: "Outbound Obligation",
    read: "Reads accounts payable, outgoing obligation, settlement pressure, and value owed."
  },
  {
    key: "West",
    name: "West Coin",
    short: "W",
    angle: 270,
    role: "Growth / Allocation",
    read: "Reads growth marketing allocation, GYP value flow, expansion pressure, and reinvestment movement."
  }
]);

const APP = document.getElementById("app");
const CANVAS = document.getElementById("fieldCanvas");
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pointer = { x: 0.5, y: 0.5 };
const field = {
  stars: [],
  width: 0,
  height: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2)
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(label, href, strong = false) {
  const a = document.createElement("a");
  a.className = "action" + (strong ? " strong" : "");
  a.href = href;
  a.textContent = label;
  return a;
}

function statCard(k, v) {
  const card = el("div", "stat-card");
  card.append(el("div", "stat-label", k), el("div", "stat-value", v));
  return card;
}

function infoRow(k, v) {
  const row = el("div", "row");
  row.append(el("div", "rk", k), el("div", "rv", v));
  return row;
}

function featureCard(title, copy) {
  const card = el("article", "feature-card");
  card.append(el("h3", "", title), el("p", "", copy));
  return card;
}

function coinCard(coin) {
  const card = el("article", "coin-card");
  card.append(
    el("small", "", coin.short + " · " + coin.name),
    el("strong", "", coin.role),
    el("span", "", coin.read)
  );
  return card;
}

function routeCard(title, copy, href, strong = false) {
  const card = document.createElement("a");
  card.className = "route-card" + (strong ? " strong" : "");
  card.href = href;
  card.append(el("strong", "", title), el("span", "", copy));
  return card;
}

function injectStyles() {
  if (document.getElementById("archcoin-four-coin-style")) return;

  const style = document.createElement("style");
  style.id = "archcoin-four-coin-style";
  style.textContent = `
    .vault-shell{
      display:grid;
      gap:16px;
    }

    .topbar,
    .vault-hero,
    .machine-panel,
    .panel,
    .route-panel{
      border:1px solid var(--line);
      border-radius:26px;
      background:
        linear-gradient(180deg,var(--panel),var(--panel2)),
        radial-gradient(circle at 82% 18%,rgba(126,203,255,.06),transparent 24%);
      box-shadow:var(--shadow2);
      backdrop-filter:blur(14px);
      -webkit-backdrop-filter:blur(14px);
    }

    .topbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      flex-wrap:wrap;
      padding:14px 18px;
      border-radius:999px;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
    }

    .brand-mark{
      width:42px;
      height:42px;
      border-radius:14px;
      transform:rotate(45deg);
      border:1px solid rgba(241,210,141,.24);
      background:linear-gradient(180deg,rgba(18,36,78,.96),rgba(10,22,48,.88));
      box-shadow:0 12px 28px rgba(0,0,0,.24);
      flex:0 0 auto;
    }

    .brand-title{
      margin:0 0 3px;
      font-size:.96rem;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .brand-subtitle{
      margin:0;
      color:var(--muted);
      font-size:.82rem;
    }

    .vault-hero,
    .machine-panel,
    .panel,
    .route-panel{
      padding:22px;
    }

    .eyebrow{
      display:inline-flex;
      align-items:center;
      gap:8px;
      min-height:34px;
      padding:8px 12px;
      border:1px solid var(--line2);
      border-radius:999px;
      background:rgba(255,255,255,.04);
      color:var(--accent);
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      margin-bottom:14px;
    }

    .hero-title{
      margin:0 0 14px;
      font-size:clamp(36px,6vw,82px);
      line-height:.93;
      letter-spacing:-.06em;
      max-width:12ch;
      font-family:Georgia,"Times New Roman",serif;
    }

    .hero-text,
    .panel-text{
      margin:0;
      max-width:78ch;
      color:var(--muted);
      font-size:17px;
      line-height:1.75;
    }

    .plain-text{
      margin:0;
      color:var(--muted);
      line-height:1.65;
    }

    .stat-grid,
    .coin-grid,
    .feature-grid,
    .route-grid{
      display:grid;
      gap:12px;
      margin-top:18px;
    }

    .stat-grid{
      grid-template-columns:repeat(4,minmax(0,1fr));
    }

    .coin-grid{
      grid-template-columns:repeat(4,minmax(0,1fr));
    }

    .feature-grid{
      grid-template-columns:repeat(3,minmax(0,1fr));
    }

    .stat-card,
    .coin-card,
    .feature-card,
    .route-card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:14px;
      background:rgba(255,255,255,.03);
    }

    .stat-card{
      min-height:100px;
    }

    .stat-label{
      font-size:11px;
      color:var(--muted2);
      letter-spacing:.10em;
      text-transform:uppercase;
      margin-bottom:10px;
    }

    .stat-value{
      font-size:18px;
      font-weight:800;
      line-height:1.2;
    }

    .coin-card{
      min-height:190px;
      display:grid;
      gap:8px;
      align-content:start;
    }

    .coin-card small{
      color:var(--accent);
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      font-weight:800;
    }

    .coin-card strong{
      color:var(--text);
      font-size:1.1rem;
      line-height:1.16;
    }

    .coin-card span{
      color:var(--muted);
      line-height:1.5;
      font-size:.93rem;
    }

    .feature-card h3{
      margin:0 0 8px;
      font-size:1rem;
      line-height:1.2;
    }

    .feature-card p{
      margin:0;
      color:var(--muted);
      line-height:1.55;
      font-size:.94rem;
    }

    .action-row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:18px;
    }

    .action{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:40px;
      padding:10px 14px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:999px;
      background:rgba(255,255,255,.05);
      color:var(--text);
      font-size:12px;
      font-weight:700;
      letter-spacing:.05em;
      text-transform:uppercase;
      text-decoration:none;
    }

    .action.strong{
      border-color:rgba(127,255,212,.26);
      background:rgba(127,255,212,.10);
    }

    .lower-grid{
      display:grid;
      grid-template-columns:minmax(0,1.25fr) minmax(320px,.75fr);
      gap:16px;
    }

    .panel-title{
      margin:0 0 12px;
      font-size:12px;
      font-weight:800;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
      padding-bottom:10px;
      border-bottom:1px solid var(--line);
    }

    .machine-stage{
      position:relative;
      min-height:520px;
      margin-top:18px;
      border:1px solid rgba(255,255,255,.08);
      border-radius:24px;
      overflow:hidden;
      background:
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.10),rgba(127,255,212,.04) 36%,rgba(0,0,0,0) 72%),
        linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,0));
      perspective:1400px;
    }

    .vault-core{
      position:absolute;
      left:50%;
      top:50%;
      width:170px;
      height:170px;
      margin-left:-85px;
      margin-top:-85px;
      border-radius:50%;
      background:
        radial-gradient(circle at 34% 28%,rgba(255,255,255,.24),transparent 16%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.28),rgba(127,255,212,.10) 58%,rgba(0,0,0,.12) 100%);
      border:1px solid rgba(255,255,255,.12);
      box-shadow:
        0 24px 40px rgba(0,0,0,.28),
        inset 0 0 40px rgba(126,203,255,.10),
        0 0 80px rgba(127,255,212,.12);
      display:grid;
      place-items:center;
      text-align:center;
      padding:20px;
      z-index:4;
    }

    .vault-core span{
      font-size:17px;
      line-height:1.25;
      letter-spacing:.08em;
      text-transform:uppercase;
      font-weight:800;
    }

    .vault-ring{
      position:absolute;
      left:50%;
      top:50%;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.10);
      transform-style:preserve-3d;
      pointer-events:none;
    }

    .vault-ring.outer{
      width:520px;
      height:520px;
      margin-left:-260px;
      margin-top:-260px;
      transform:rotateX(72deg) rotateZ(10deg);
      box-shadow:0 0 30px rgba(126,203,255,.08);
    }

    .vault-ring.mid{
      width:390px;
      height:390px;
      margin-left:-195px;
      margin-top:-195px;
      transform:rotateX(72deg) rotateZ(54deg);
      box-shadow:0 0 24px rgba(127,255,212,.08);
    }

    .vault-ring.inner{
      width:270px;
      height:270px;
      margin-left:-135px;
      margin-top:-135px;
      transform:rotateX(72deg) rotateZ(96deg);
      box-shadow:0 0 18px rgba(126,203,255,.06);
    }

    .mint-node{
      position:absolute;
      left:50%;
      top:50%;
      width:166px;
      margin-left:-83px;
      margin-top:-39px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:12px;
      background:
        linear-gradient(180deg,rgba(8,12,19,.80),rgba(12,18,30,.88)),
        radial-gradient(circle at 82% 18%,rgba(126,203,255,.05),transparent 22%);
      color:var(--text);
      box-shadow:0 18px 28px rgba(0,0,0,.28);
      cursor:pointer;
      transform-style:preserve-3d;
    }

    .mint-short{
      display:block;
      font-size:11px;
      letter-spacing:.12em;
      text-transform:uppercase;
      color:var(--accent);
      margin-bottom:8px;
      font-weight:800;
    }

    .mint-label{
      display:block;
      font-size:15px;
      line-height:1.35;
      font-weight:800;
    }

    .rows{
      display:grid;
      gap:10px;
    }

    .row{
      display:grid;
      grid-template-columns:minmax(0,1fr) minmax(0,1fr);
      gap:12px;
      align-items:start;
    }

    .rk{
      color:var(--muted);
      font-size:12px;
      line-height:1.45;
    }

    .rv{
      color:var(--text);
      font-size:12px;
      line-height:1.45;
      text-align:right;
      word-break:break-word;
    }

    .boundary{
      border:1px solid rgba(241,210,141,.22);
      border-radius:18px;
      background:rgba(241,210,141,.045);
      padding:14px;
      margin-top:14px;
      color:var(--muted);
      line-height:1.6;
      font-size:.94rem;
    }

    .route-grid{
      grid-template-columns:repeat(4,minmax(0,1fr));
    }

    .route-card{
      min-height:118px;
      color:var(--text);
      text-decoration:none;
      display:grid;
      gap:8px;
      align-content:start;
    }

    .route-card.strong{
      border-color:rgba(127,255,212,.28);
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.10),transparent 70%),
        rgba(255,255,255,.04);
    }

    .route-card strong{
      display:block;
      font-size:1rem;
      line-height:1.2;
    }

    .route-card span{
      display:block;
      color:var(--muted);
      font-size:.88rem;
      line-height:1.46;
    }

    @media (max-width:1080px){
      .stat-grid,
      .coin-grid,
      .feature-grid,
      .route-grid{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }

      .lower-grid{
        grid-template-columns:1fr;
      }
    }

    @media (max-width:760px){
      .topbar{
        border-radius:24px;
      }

      .stat-grid,
      .coin-grid,
      .feature-grid,
      .route-grid{
        grid-template-columns:1fr;
      }

      .row{
        grid-template-columns:1fr;
      }

      .rv{
        text-align:left;
      }

      .machine-stage{
        min-height:460px;
      }

      .vault-core{
        width:138px;
        height:138px;
        margin-left:-69px;
        margin-top:-69px;
      }

      .vault-core span{
        font-size:15px;
      }

      .mint-node{
        width:138px;
        margin-left:-69px;
      }
    }
  `;
  document.head.appendChild(style);
}

function buildTopbar() {
  const topbar = el("header", "topbar");

  const brand = el("div", "brand");
  const mark = el("div", "brand-mark");
  const copy = el("div");
  copy.append(
    el("p", "brand-title", "Richie’s Manor · Vault Chamber"),
    el("p", "brand-subtitle", "ARCHCOIN / Four-Coin Transaction Template")
  );
  brand.append(mark, copy);

  const actions = el("nav", "action-row");
  actions.append(
    button("Vault Chamber", ROUTES.vault, true),
    button("Products", ROUTES.products),
    button("Upper Room", ROUTES.upperRoom),
    button("Showroom", ROUTES.showroom),
    button("Compass", ROUTES.compass)
  );

  topbar.append(brand, actions);
  return topbar;
}

function buildHero() {
  const hero = el("section", "vault-hero");
  const eyebrow = el("div", "eyebrow", "ARCHCOIN · FOUR-COIN FINANCIAL TEMPLATE");
  const title = el("h1", "hero-title", "The Vault is not a single coin.");
  const text = el(
    "p",
    "hero-text",
    "ARCHCOIN is the Vault Chamber’s meta-financial template: a four-coin transaction map for classifying, routing, binding, and accounting for value movement across existing crypto assets and financial flows."
  );

  const statGrid = el("div", "stat-grid");
  statGrid.append(
    statCard("Public Label", "Vault Chamber"),
    statCard("Product Label", "ARCHCOIN"),
    statCard("True Read", "Four-Coin Template"),
    statCard("Ordinary Coin", "False")
  );

  const controls = el("div", "action-row");
  controls.append(
    button("Vault Chamber", ROUTES.vault, true),
    button("Products", ROUTES.products),
    button("Upper Room", ROUTES.upperRoom),
    button("Showroom", ROUTES.showroom)
  );

  hero.append(eyebrow, title, text, statGrid, controls);
  return hero;
}

function buildTemplatePanel() {
  const panel = el("section", "panel");
  panel.append(
    el("h2", "panel-title", "Four-Coin Transaction Template"),
    el(
      "p",
      "panel-text",
      "Every financial transaction can be read as contract authority plus inbound value plus outbound obligation plus growth or allocation pressure."
    )
  );

  const grid = el("div", "coin-grid");
  COINS.forEach((coin) => grid.appendChild(coinCard(coin)));

  panel.appendChild(grid);
  return panel;
}

function buildFunctionPanel() {
  const panel = el("section", "panel");
  panel.append(
    el("h2", "panel-title", "ARCHCOIN Function"),
    el(
      "p",
      "panel-text",
      "ARCHCOIN provides the transaction template and bonding logic. It organizes value movement without pretending to replace existing assets."
    )
  );

  const grid = el("div", "feature-grid");
  grid.append(
    featureCard("Classify Transaction", "Identify what kind of financial movement is happening and which coin position controls the read."),
    featureCard("Route Value", "Map incoming and outgoing value across the transaction without collapsing every asset into one ordinary coin."),
    featureCard("Bind Obligation", "Tie responsibility, payment pressure, settlement, and counterparty duty back to the transaction frame."),
    featureCard("Track Counterparty Flow", "Read who owes, who receives, who routes, and where the pressure moves next."),
    featureCard("Unify Asset Movement", "Let BTC, ETH, SOL, stablecoins, or other tokens be referenced, wrapped, routed, or accounted for inside one map."),
    featureCard("Preserve Boundary", "Do not claim automatic chain merger. Real interoperability still needs adapters, bridges, wrappers, systems, or oracles.")
  );

  panel.appendChild(grid);

  const boundary = el("div", "boundary");
  boundary.textContent =
    "Boundary: ARCHCOIN is not financial advice, not a brokerage, not an exchange, and not automatic chain interoperability. It is the template and bonding logic for reading transaction movement.";
  panel.appendChild(boundary);

  return panel;
}

function buildMachinePanel() {
  const machine = el("section", "machine-panel");
  const machineTitle = el("h2", "panel-title", "Vault Cylinder");
  const machineText = el(
    "p",
    "panel-text",
    "The cylinder now represents the four-coin transaction template. Select a governor to see the transaction position it controls."
  );

  const stage = el("div", "machine-stage");
  stage.id = "machineStage";

  const core = el("div", "vault-core");
  core.innerHTML = "<span>ARCH<br>COIN<br>TEMPLATE</span>";
  stage.appendChild(core);

  stage.append(
    el("div", "vault-ring outer"),
    el("div", "vault-ring mid"),
    el("div", "vault-ring inner")
  );

  for (const coin of COINS) {
    const node = el("button", "mint-node");
    node.type = "button";
    node.dataset.angle = String(coin.angle);
    node.dataset.key = coin.key;
    node.innerHTML =
      `<span class="mint-short">${coin.short} · ${coin.name}</span>` +
      `<span class="mint-label">${coin.role}</span>`;
    stage.appendChild(node);
  }

  machine.append(machineTitle, machineText, stage);
  return machine;
}

function buildReceiptPanel() {
  const receipt = el("section", "panel");
  const receiptTitle = el("h2", "panel-title", "Vault Receipt");
  const receiptRows = el("div", "rows");
  receiptRows.append(
    infoRow("Template", "ARCHCOIN Four-Coin Transaction Map"),
    infoRow("North Coin", "Contract authority"),
    infoRow("East Coin", "Inbound value / accounts receivable"),
    infoRow("South Coin", "Outbound obligation / accounts payable"),
    infoRow("West Coin", "Growth, marketing allocation, or GYP value flow"),
    infoRow("Status", "Active")
  );
  receipt.append(receiptTitle, receiptRows);
  return receipt;
}

function buildRoutesPanel() {
  const routes = el("section", "route-panel");
  const routeTitle = el("h2", "panel-title", "Manor Backlinks");
  const routeText = el(
    "p",
    "panel-text",
    "The Vault Chamber is now wired back into Richie’s Manor as the ARCHCOIN protected-value and transaction-template chamber."
  );
  const routeGrid = el("div", "route-grid");
  routeGrid.append(
    routeCard("Vault Chamber", "ARCHCOIN four-coin transaction-template route.", ROUTES.vault, true),
    routeCard("Products", "Parent product and system route.", ROUTES.products),
    routeCard("Upper Room", "Attic event chamber and public live-room route.", ROUTES.upperRoom),
    routeCard("Showroom", "Lobby proof surface for the estate.", ROUTES.showroom)
  );
  routes.append(routeTitle, routeText, routeGrid);
  return routes;
}

function buildShell() {
  const shell = el("main", "vault-shell");

  const lower = el("section", "lower-grid");
  lower.append(buildMachinePanel(), buildReceiptPanel());

  shell.append(
    buildTopbar(),
    buildHero(),
    buildTemplatePanel(),
    lower,
    buildFunctionPanel(),
    buildRoutesPanel()
  );

  return shell;
}

function resizeCanvas() {
  if (!CANVAS) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  field.width = w;
  field.height = h;
  CANVAS.width = Math.floor(w * field.dpr);
  CANVAS.height = Math.floor(h * field.dpr);
  CANVAS.style.width = w + "px";
  CANVAS.style.height = h + "px";
  const ctx = CANVAS.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
  buildStars();
}

function buildStars() {
  const count = Math.min(180, Math.max(120, Math.floor((field.width * field.height) / 14000)));
  field.stars = Array.from({ length: count }, () => ({
    x: Math.random() * field.width,
    y: Math.random() * field.height,
    z: 0.25 + Math.random() * 0.75,
    size: 0.6 + Math.random() * 2.2,
    drift: (Math.random() - 0.5) * 0.08,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawField() {
  if (!CANVAS) return;
  const ctx = CANVAS.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, field.width, field.height);

  const gx = (pointer.x - 0.5) * 36;
  const gy = (pointer.y - 0.5) * 36;

  for (const star of field.stars) {
    star.pulse += 0.01 * star.z;
    star.y += star.drift * star.z;
    if (star.y < -10) star.y = field.height + 10;
    if (star.y > field.height + 10) star.y = -10;

    const px = star.x + gx * star.z;
    const py = star.y + gy * star.z;
    const alpha = 0.18 + (Math.sin(star.pulse) * 0.5 + 0.5) * 0.42 * star.z;

    ctx.beginPath();
    ctx.fillStyle = `rgba(190,225,255,${alpha.toFixed(3)})`;
    ctx.arc(px, py, star.size * star.z, 0, Math.PI * 2);
    ctx.fill();
  }

  const grad = ctx.createRadialGradient(
    field.width * 0.5 + gx * 2,
    field.height * 0.34 + gy * 2,
    0,
    field.width * 0.5,
    field.height * 0.5,
    Math.max(field.width, field.height) * 0.48
  );
  grad.addColorStop(0, "rgba(127,255,212,0.05)");
  grad.addColorStop(0.45, "rgba(126,203,255,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, field.width, field.height);
}

function placeNodes(now) {
  const nodes = Array.from(document.querySelectorAll(".mint-node"));
  const rings = {
    outer: { radiusX: 230, radiusY: 108, speed: 0.00016, depth: 52, zipper: 24 },
    inner: { radiusX: 164, radiusY: 78, speed: -0.00022, depth: 34, zipper: 18 }
  };

  nodes.forEach((node, index) => {
    const angleDeg = Number(node.dataset.angle || 0);
    const base = angleDeg * (Math.PI / 180);
    const zipperSign = index % 2 === 0 ? 1 : -1;
    const ring = index < 2 ? rings.outer : rings.inner;
    const t = REDUCED_MOTION ? 0 : now * ring.speed + (zipperSign > 0 ? 0 : Math.PI / 2);
    const theta = base + t;

    const x = Math.sin(theta) * ring.radiusX;
    const y = Math.sin(theta) * Math.cos(theta) * ring.radiusY + zipperSign * ring.zipper * Math.cos(theta);
    const z = Math.cos(theta * 2) * ring.depth + zipperSign * (ring.zipper * 0.4);

    const normalized = (z + ring.depth + ring.zipper * 0.4) / ((ring.depth + ring.zipper * 0.4) * 2);
    const depth = Math.max(0, Math.min(1, normalized));
    const scale = 0.88 + depth * 0.24;
    const opacity = 0.62 + depth * 0.38;

    node.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
    node.style.opacity = opacity.toFixed(3);
    node.style.zIndex = String(Math.round(1000 + z));
  });
}

function bindNodeActions() {
  const nodes = Array.from(document.querySelectorAll(".mint-node"));
  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const key = node.dataset.key || "North";
      const coin = COINS.find((item) => item.key === key) || COINS[0];
      const rows = APP.querySelector(".rows");
      if (!rows) return;

      rows.replaceChildren(
        infoRow("Selected coin", coin.name),
        infoRow("Transaction role", coin.role),
        infoRow("Template read", coin.read),
        infoRow("Transaction formula", "contract + inbound value + outbound obligation + growth/allocation pressure"),
        infoRow("Status", "Position selected")
      );
    });
  });
}

function boot() {
  if (!APP) return;

  injectStyles();
  APP.className = "page";
  APP.replaceChildren(buildShell());
  bindNodeActions();
  resizeCanvas();

  function frame(now) {
    drawField();
    placeNodes(now);
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
}

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / Math.max(window.innerWidth, 1);
  pointer.y = event.clientY / Math.max(window.innerHeight, 1);
}, { passive: true });

window.addEventListener("resize", resizeCanvas);

boot();
