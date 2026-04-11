const ROOT = "/products/archcoin";
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

function injectStyles() {
  if (document.getElementById("archcoin-local-safeboot-style")) return;

  const style = document.createElement("style");
  style.id = "archcoin-local-safeboot-style";
  style.textContent = `
    .vault-shell{
      display:grid;
      gap:16px;
    }

    .vault-hero,
    .machine-panel,
    .panel{
      border:1px solid var(--line);
      border-radius:26px;
      background:
        linear-gradient(180deg,var(--panel),var(--panel2)),
        radial-gradient(circle at 82% 18%, rgba(126,203,255,.06), transparent 24%);
      box-shadow:var(--shadow2);
      backdrop-filter:blur(14px);
      -webkit-backdrop-filter:blur(14px);
    }

    .vault-hero{
      padding:24px 22px 22px;
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
      max-width:10ch;
    }

    .hero-text,
    .panel-text{
      margin:0;
      max-width:70ch;
      color:var(--muted);
      font-size:17px;
      line-height:1.75;
    }

    .stat-grid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:12px;
      margin-top:18px;
    }

    .stat-card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:14px;
      background:rgba(255,255,255,.03);
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

    .machine-panel,
    .panel{
      padding:20px;
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
        radial-gradient(circle at 50% 50%, rgba(126,203,255,.10), rgba(127,255,212,.04) 36%, rgba(0,0,0,0) 72%),
        linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0));
      perspective:1400px;
    }

    .vault-core{
      position:absolute;
      left:50%;
      top:50%;
      width:160px;
      height:160px;
      margin-left:-80px;
      margin-top:-80px;
      border-radius:50%;
      background:
        radial-gradient(circle at 34% 28%, rgba(255,255,255,.24), transparent 16%),
        radial-gradient(circle at 50% 50%, rgba(126,203,255,.28), rgba(127,255,212,.10) 58%, rgba(0,0,0,.12) 100%);
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
      font-size:18px;
      line-height:1.3;
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
      width:158px;
      margin-left:-79px;
      margin-top:-36px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:12px;
      background:
        linear-gradient(180deg,rgba(8,12,19,.80),rgba(12,18,30,.88)),
        radial-gradient(circle at 82% 18%, rgba(126,203,255,.05), transparent 22%);
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
      color:var(--muted2);
      margin-bottom:8px;
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

    @media (max-width:1080px){
      .stat-grid{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }

      .lower-grid{
        grid-template-columns:1fr;
      }
    }

    @media (max-width:760px){
      .stat-grid{
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
        width:132px;
        height:132px;
        margin-left:-66px;
        margin-top:-66px;
      }

      .mint-node{
        width:136px;
        margin-left:-68px;
      }
    }
  `;
  document.head.appendChild(style);
}

function buildShell() {
  const shell = el("main", "vault-shell");

  const hero = el("section", "vault-hero");
  const eyebrow = el("div", "eyebrow", "ARCHCOIN · RICHIE RICH'S VAULT");
  const title = el("h1", "hero-title", "One parent. One body. Four derived governors.");
  const text = el(
    "p",
    "hero-text",
    "Archcoin remains the parent template and construction authority. The Vault remains the master body. Four archetype mint heads generate a growing vault pile below, with each coin family sharing one production channel while keeping its own face, appearance, and identity. Tap a control assembly to rotate the full cylinder and release one coin."
  );

  const statGrid = el("div", "stat-grid");
  statGrid.append(
    statCard("Parent", "Archcoin"),
    statCard("Master Body", "Vault"),
    statCard("Governors", "4"),
    statCard("Mode", "Local Safe Boot")
  );

  const controls = el("div", "action-row");
  controls.append(
    button("Home", "/", false),
    button("Products", "/products/", false),
    button("Vault", ROOT + "/", true)
  );

  hero.append(eyebrow, title, text, statGrid, controls);

  const machine = el("section", "machine-panel");
  const machineTitle = el("h2", "panel-title", "Vault Cylinder");
  const machineText = el(
    "p",
    "panel-text",
    "The cylinder now runs on a self-contained local motion surface. No external spine runtime is required for this boot path."
  );

  const stage = el("div", "machine-stage");
  stage.id = "machineStage";

  const core = el("div", "vault-core");
  core.innerHTML = "<span>ARCH<br>COIN</span>";
  stage.appendChild(core);

  const ringOuter = el("div", "vault-ring outer");
  const ringMid = el("div", "vault-ring mid");
  const ringInner = el("div", "vault-ring inner");
  stage.append(ringOuter, ringMid, ringInner);

  const nodes = [
    { key: "North", label: "North Governor", short: "N", angle: 0 },
    { key: "East", label: "East Governor", short: "E", angle: 90 },
    { key: "South", label: "South Governor", short: "S", angle: 180 },
    { key: "West", label: "West Governor", short: "W", angle: 270 }
  ];

  for (const item of nodes) {
    const node = el("button", "mint-node");
    node.type = "button";
    node.dataset.angle = String(item.angle);
    node.dataset.key = item.key;
    node.innerHTML =
      `<span class="mint-short">${item.short}</span>` +
      `<span class="mint-label">${item.label}</span>`;
    stage.appendChild(node);
  }

  const receipt = el("section", "panel");
  const receiptTitle = el("h2", "panel-title", "Boot Receipt");
  const receiptRows = el("div", "rows");
  receiptRows.append(
    infoRow("Boot path", "Local self-contained"),
    infoRow("Runtime dependency", "None"),
    infoRow("Failure class cleared", "Missing external spine files"),
    infoRow("Status", "Active")
  );
  receipt.append(receiptTitle, receiptRows);

  machine.append(machineTitle, machineText, stage);

  const lower = el("section", "lower-grid");
  lower.append(machine, receipt);

  shell.append(hero, lower);
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
      const key = node.dataset.key || "Governor";
      const rows = APP.querySelector(".rows");
      if (!rows) return;
      rows.replaceChildren(
        infoRow("Boot path", "Local self-contained"),
        infoRow("Governor selected", key),
        infoRow("Traversal mode", "Figure-eight with zipper law"),
        infoRow("Status", "Coin release simulated")
      );
    });
  });
}

function boot() {
  if (!APP) return;
  injectStyles();
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
