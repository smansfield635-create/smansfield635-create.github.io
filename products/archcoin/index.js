/* TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · RECEIVING VAULT FROM PRODUCTS SOURCE · B6

   RESULT:
     - Corrects ARCHCOIN after Products became the source-waterfall chamber.
     - ARCHCOIN no longer claims to originate the full product waterfall.
     - ARCHCOIN receives the protected-value stream from /products/.
     - Builds a physical Vault Chamber with one receiving waterfall core.
     - Splits the received stream into four garden chambers.
     - Keeps ARCHCOIN as the four-coin financial transaction template.
     - Keeps Vault / Products / Upper Room / Showroom / Compass backlinks.
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

const GARDENS = Object.freeze([
  {
    key: "North",
    name: "North Garden",
    coin: "North Coin",
    short: "N",
    role: "Contract Authority",
    position: "north",
    read: "Contracts, permissions, signatures, terms, authority, and the binding frame for the transaction.",
    water: "The protected stream reaches North as agreement: value cannot move cleanly unless the contract is named."
  },
  {
    key: "East",
    name: "East Garden",
    coin: "East Coin",
    short: "E",
    role: "Inbound Value",
    position: "east",
    read: "Accounts receivable, incoming value, receipts, deposits, counterparty inflow, and value received.",
    water: "The protected stream reaches East as arrival: value enters the chamber and becomes visible."
  },
  {
    key: "South",
    name: "South Garden",
    coin: "South Coin",
    short: "S",
    role: "Outbound Obligation",
    position: "south",
    read: "Accounts payable, outgoing value, settlement duty, obligations, and pressure owed.",
    water: "The protected stream reaches South as responsibility: every transaction carries an obligation to settle."
  },
  {
    key: "West",
    name: "West Garden",
    coin: "West Coin",
    short: "W",
    role: "Growth / Allocation",
    position: "west",
    read: "Growth allocation, marketing flow, GYP value flow, reinvestment, and expansion pressure.",
    water: "The protected stream reaches West as expansion: value can be routed toward growth without losing the bond frame."
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

function gardenCard(garden) {
  const card = el("article", "coin-card");
  card.append(
    el("small", "", garden.short + " · " + garden.coin),
    el("strong", "", garden.role),
    el("span", "", garden.read)
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
  if (document.getElementById("archcoin-receiving-vault-style")) return;

  const style = document.createElement("style");
  style.id = "archcoin-receiving-vault-style";
  style.textContent = `
    .vault-shell{display:grid;gap:16px}

    .topbar,.vault-hero,.machine-panel,.panel,.route-panel{
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

    .brand{display:flex;align-items:center;gap:12px}

    .brand-mark{
      width:42px;
      height:42px;
      border-radius:14px;
      transform:rotate(45deg);
      border:1px solid rgba(241,210,141,.24);
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.13),transparent 45%),
        linear-gradient(180deg,rgba(18,36,78,.96),rgba(10,22,48,.88));
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

    .vault-hero,.machine-panel,.panel,.route-panel{padding:22px}

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

    .hero-text,.panel-text{
      margin:0;
      max-width:78ch;
      color:var(--muted);
      font-size:17px;
      line-height:1.75;
    }

    .stat-grid,.coin-grid,.feature-grid,.route-grid{
      display:grid;
      gap:12px;
      margin-top:18px;
    }

    .stat-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
    .coin-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
    .feature-grid{grid-template-columns:repeat(3,minmax(0,1fr))}

    .stat-card,.coin-card,.feature-card,.route-card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:14px;
      background:rgba(255,255,255,.03);
    }

    .stat-card{min-height:100px}

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
      min-height:760px;
      margin-top:18px;
      border:1px solid rgba(255,255,255,.08);
      border-radius:30px;
      overflow:hidden;
      background:
        radial-gradient(ellipse at 50% 12%,rgba(126,203,255,.08),transparent 24%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.12),rgba(127,255,212,.045) 30%,rgba(0,0,0,0) 58%),
        radial-gradient(circle at 50% 58%,rgba(241,210,141,.055),transparent 72%),
        linear-gradient(180deg,rgba(2,6,14,.58),rgba(2,4,10,.92));
      perspective:1400px;
      isolation:isolate;
    }

    .products-inlet{
      position:absolute;
      left:50%;
      top:18px;
      transform:translateX(-50%);
      min-width:min(86%,420px);
      border:1px solid rgba(127,255,212,.20);
      border-radius:999px;
      padding:10px 14px;
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.12),transparent 62%),
        rgba(3,9,18,.74);
      color:var(--muted);
      text-align:center;
      z-index:12;
      font-size:.82rem;
      line-height:1.35;
    }

    .products-inlet strong{
      color:var(--text);
      font-weight:900;
    }

    .inlet-fall{
      position:absolute;
      left:50%;
      top:58px;
      width:18px;
      height:130px;
      transform:translateX(-50%);
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.74),
          rgba(126,203,255,.46),
          rgba(127,255,212,.18),
          rgba(126,203,255,.42),
          transparent
        );
      opacity:.78;
      filter:drop-shadow(0 0 18px rgba(126,203,255,.28));
      z-index:7;
      overflow:hidden;
    }

    .inlet-fall::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        repeating-linear-gradient(
          180deg,
          transparent 0 16px,
          rgba(255,255,255,.48) 16px 22px,
          transparent 22px 38px
        );
      animation:inletDrop 1.8s linear infinite;
    }

    .vault-room{
      position:absolute;
      left:50%;
      top:54%;
      width:min(92%,680px);
      aspect-ratio:1;
      transform:translate(-50%,-50%);
      border-radius:50%;
      background:
        radial-gradient(circle at 50% 50%,rgba(5,11,22,.10) 0 18%,transparent 18.3%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.10),transparent 34%),
        conic-gradient(
          from 45deg,
          rgba(127,255,212,.09),
          rgba(126,203,255,.04),
          rgba(241,210,141,.08),
          rgba(126,203,255,.04),
          rgba(127,255,212,.09)
        );
      z-index:1;
      filter:drop-shadow(0 30px 56px rgba(0,0,0,.34));
    }

    .vault-room::before{
      content:"";
      position:absolute;
      inset:0;
      border-radius:50%;
      border:18px solid rgba(145,173,205,.13);
      box-shadow:
        inset 0 0 32px rgba(255,255,255,.055),
        inset 0 0 96px rgba(0,0,0,.34),
        0 0 80px rgba(127,255,212,.07);
      background:
        repeating-conic-gradient(
          from 0deg,
          rgba(255,255,255,.055) 0deg 4deg,
          transparent 4deg 16deg
        );
      pointer-events:none;
    }

    .vault-room::after{
      content:"";
      position:absolute;
      inset:11%;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.11);
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.06),transparent 28%),
        repeating-radial-gradient(
          circle at 50% 50%,
          rgba(255,255,255,.035) 0 1px,
          transparent 1px 28px
        );
      box-shadow:
        inset 0 0 48px rgba(0,0,0,.32),
        0 0 34px rgba(126,203,255,.08);
      pointer-events:none;
    }

    .vault-door{
      position:absolute;
      width:23%;
      height:20%;
      border:1px solid rgba(255,255,255,.16);
      border-radius:999px 999px 22px 22px;
      background:
        radial-gradient(circle at 50% 0%,rgba(255,255,255,.12),transparent 32%),
        linear-gradient(180deg,rgba(15,28,48,.92),rgba(5,10,20,.96));
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.035),
        0 16px 28px rgba(0,0,0,.28);
      z-index:3;
    }

    .vault-door::before{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:42%;
      aspect-ratio:1;
      transform:translate(-50%,-50%) rotate(45deg);
      border:1px solid rgba(127,255,212,.24);
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.12),transparent 62%),
        rgba(255,255,255,.025);
      box-shadow:0 0 20px rgba(127,255,212,.08);
    }

    .vault-door.north{left:50%;top:1.6%;transform:translateX(-50%)}
    .vault-door.east{right:1.6%;top:50%;transform:translateY(-50%) rotate(90deg)}
    .vault-door.south{left:50%;bottom:1.6%;transform:translateX(-50%) rotate(180deg)}
    .vault-door.west{left:1.6%;top:50%;transform:translateY(-50%) rotate(-90deg)}

    .vault-floor{
      position:absolute;
      left:50%;
      top:50%;
      width:66%;
      aspect-ratio:1;
      transform:translate(-50%,-50%) rotateX(58deg);
      border-radius:50%;
      border:1px solid rgba(255,255,255,.10);
      background:
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.10),transparent 18%),
        repeating-conic-gradient(
          from 0deg,
          rgba(255,255,255,.050) 0deg 2deg,
          transparent 2deg 22deg
        );
      box-shadow:
        inset 0 0 44px rgba(0,0,0,.35),
        0 0 34px rgba(126,203,255,.08);
      z-index:2;
      pointer-events:none;
    }

    .garden-alcove{
      position:absolute;
      width:24%;
      min-height:92px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:24px;
      background:
        radial-gradient(circle at 50% 12%,rgba(127,255,212,.12),transparent 36%),
        linear-gradient(180deg,rgba(5,13,23,.82),rgba(7,11,19,.94));
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.035),
        0 20px 34px rgba(0,0,0,.30);
      display:grid;
      place-items:center;
      text-align:center;
      padding:11px;
      cursor:pointer;
      z-index:6;
    }

    .garden-alcove::before{
      content:"";
      position:absolute;
      inset:10px;
      border-radius:18px;
      border:1px solid rgba(127,255,212,.12);
      background:
        radial-gradient(circle at 50% 100%,rgba(127,255,212,.14),transparent 60%),
        linear-gradient(180deg,transparent,rgba(127,255,212,.035));
      pointer-events:none;
    }

    .garden-alcove:hover,
    .garden-alcove:focus-visible{
      outline:none;
      border-color:rgba(127,255,212,.34);
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.04),
        0 20px 34px rgba(0,0,0,.30),
        0 0 30px rgba(127,255,212,.10);
    }

    .garden-alcove[data-active="true"]{
      border-color:rgba(241,210,141,.48);
      background:
        radial-gradient(circle at 50% 12%,rgba(241,210,141,.18),transparent 36%),
        linear-gradient(180deg,rgba(12,17,25,.90),rgba(7,11,19,.96));
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.04),
        0 20px 34px rgba(0,0,0,.30),
        0 0 38px rgba(241,210,141,.13);
    }

    .garden-alcove.north{left:50%;top:11%;transform:translateX(-50%)}
    .garden-alcove.east{right:10%;top:50%;transform:translateY(-50%)}
    .garden-alcove.south{left:50%;bottom:11%;transform:translateX(-50%)}
    .garden-alcove.west{left:10%;top:50%;transform:translateY(-50%)}

    .garden-plaque{
      position:relative;
      z-index:2;
      display:grid;
      gap:4px;
    }

    .garden-plaque small{
      color:var(--accent);
      font-size:10px;
      letter-spacing:.12em;
      text-transform:uppercase;
      font-weight:900;
    }

    .garden-plaque strong{
      color:var(--text);
      font-size:.96rem;
      line-height:1.08;
    }

    .garden-plaque span{
      color:var(--muted);
      font-size:.76rem;
      line-height:1.25;
    }

    .waterfall-core{
      position:absolute;
      left:50%;
      top:50%;
      width:178px;
      height:178px;
      transform:translate(-50%,-50%);
      border-radius:50%;
      border:1px solid rgba(255,255,255,.18);
      background:
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.42),transparent 13%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.36),rgba(127,255,212,.13) 48%,rgba(0,0,0,.20) 100%);
      box-shadow:
        0 24px 42px rgba(0,0,0,.34),
        inset 0 0 44px rgba(126,203,255,.18),
        0 0 96px rgba(127,255,212,.18);
      z-index:8;
      overflow:hidden;
      display:grid;
      place-items:center;
      text-align:center;
      padding:20px;
    }

    .waterfall-core::before{
      content:"";
      position:absolute;
      left:50%;
      top:-28%;
      width:60%;
      height:156%;
      transform:translateX(-50%);
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.82),
          rgba(126,203,255,.42) 26%,
          rgba(127,255,212,.20) 50%,
          rgba(126,203,255,.45) 74%,
          rgba(255,255,255,.62)
        );
      opacity:.78;
      filter:blur(.7px);
      animation:waterfallDrop 2.8s linear infinite;
    }

    .waterfall-core::after{
      content:"";
      position:absolute;
      inset:14px;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.17);
      background:
        repeating-conic-gradient(
          from 0deg,
          transparent 0deg 14deg,
          rgba(255,255,255,.085) 14deg 17deg,
          transparent 17deg 32deg
        );
      animation:waterCircle 14s linear infinite;
      opacity:.78;
    }

    .waterfall-label{
      position:relative;
      z-index:3;
      color:var(--text);
      font-size:15px;
      line-height:1.18;
      letter-spacing:.08em;
      text-transform:uppercase;
      font-weight:900;
      text-shadow:0 2px 12px rgba(0,0,0,.68);
    }

    .water-channel{
      position:absolute;
      left:50%;
      top:50%;
      width:28%;
      height:9px;
      transform-origin:left center;
      border-radius:999px;
      background:
        linear-gradient(
          90deg,
          rgba(255,255,255,.85),
          rgba(126,203,255,.52),
          rgba(127,255,212,.15),
          transparent
        );
      opacity:.72;
      z-index:4;
      filter:drop-shadow(0 0 12px rgba(126,203,255,.24));
      overflow:hidden;
      pointer-events:none;
    }

    .water-channel::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        repeating-linear-gradient(
          90deg,
          transparent 0 18px,
          rgba(255,255,255,.48) 18px 24px,
          transparent 24px 42px
        );
      animation:waterRun 1.7s linear infinite;
    }

    .water-channel.north{transform:rotate(-90deg)}
    .water-channel.east{transform:rotate(0deg)}
    .water-channel.south{transform:rotate(90deg)}
    .water-channel.west{transform:rotate(180deg)}

    .vault-caption{
      position:absolute;
      left:50%;
      bottom:16px;
      transform:translateX(-50%);
      width:min(92%,700px);
      color:var(--muted2);
      text-align:center;
      font-size:.84rem;
      line-height:1.45;
      z-index:10;
      pointer-events:none;
    }

    .chamber-controls{display:none}

    .rows{display:grid;gap:10px}

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

    .route-grid{grid-template-columns:repeat(4,minmax(0,1fr))}

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

    @keyframes inletDrop{
      from{transform:translateY(-38px)}
      to{transform:translateY(38px)}
    }

    @keyframes waterfallDrop{
      0%{transform:translateX(-50%) translateY(-22%)}
      100%{transform:translateX(-50%) translateY(22%)}
    }

    @keyframes waterCircle{
      from{transform:rotate(0deg)}
      to{transform:rotate(360deg)}
    }

    @keyframes waterRun{
      from{transform:translateX(-42px)}
      to{transform:translateX(42px)}
    }

    @media (max-width:1080px){
      .stat-grid,.coin-grid,.feature-grid,.route-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .lower-grid{grid-template-columns:1fr}
    }

    @media (max-width:760px){
      .topbar{border-radius:24px}
      .stat-grid,.coin-grid,.feature-grid,.route-grid{grid-template-columns:1fr}
      .row{grid-template-columns:1fr}
      .rv{text-align:left}

      .machine-stage{
        min-height:auto;
        display:grid;
        gap:14px;
        padding:14px;
      }

      .products-inlet{
        position:relative;
        left:auto;
        top:auto;
        transform:none;
        min-width:0;
        width:100%;
        order:1;
      }

      .inlet-fall{display:none}

      .vault-room{
        position:relative;
        left:auto;
        top:auto;
        transform:none;
        width:min(100%,360px);
        margin:0 auto;
        order:2;
      }

      .vault-door{opacity:.72}
      .garden-alcove{display:none}

      .waterfall-core{
        width:128px;
        height:128px;
      }

      .waterfall-label{font-size:12px}
      .water-channel{width:24%}

      .vault-caption{
        position:relative;
        left:auto;
        bottom:auto;
        transform:none;
        width:100%;
        margin:0;
        order:3;
      }

      .chamber-controls{
        display:grid;
        grid-template-columns:1fr;
        gap:10px;
        order:4;
      }

      .chamber-control{
        border:1px solid rgba(255,255,255,.12);
        border-radius:18px;
        padding:13px;
        background:
          linear-gradient(180deg,rgba(8,12,19,.84),rgba(12,18,30,.90)),
          radial-gradient(circle at 92% 12%,rgba(127,255,212,.08),transparent 28%);
        color:var(--text);
        text-align:left;
      }

      .chamber-control[data-active="true"]{
        border-color:rgba(241,210,141,.42);
        box-shadow:0 0 24px rgba(241,210,141,.10);
      }

      .chamber-control small{
        display:block;
        color:var(--accent);
        font-size:10px;
        letter-spacing:.12em;
        text-transform:uppercase;
        font-weight:900;
        margin-bottom:5px;
      }

      .chamber-control strong{
        display:block;
        font-size:1rem;
        line-height:1.12;
        margin-bottom:4px;
      }

      .chamber-control span{
        display:block;
        color:var(--muted);
        line-height:1.35;
        font-size:.86rem;
      }
    }

    @media (prefers-reduced-motion:reduce){
      .inlet-fall::after,
      .waterfall-core::before,
      .waterfall-core::after,
      .water-channel::after{
        animation:none!important;
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
    el("p", "brand-subtitle", "ARCHCOIN / Products-fed Transaction Vault")
  );

  brand.append(mark, copy);

  const actions = el("nav", "action-row");
  actions.append(
    button("Products Source", ROUTES.products, true),
    button("Vault Chamber", ROUTES.vault),
    button("Upper Room", ROUTES.upperRoom),
    button("Showroom", ROUTES.showroom),
    button("Compass", ROUTES.compass)
  );

  topbar.append(brand, actions);
  return topbar;
}

function buildHero() {
  const hero = el("section", "vault-hero");
  const eyebrow = el("div", "eyebrow", "ARCHCOIN · PRODUCTS-FED VAULT CHAMBER");
  const title = el("h1", "hero-title", "The Vault receives the stream.");
  const text = el(
    "p",
    "hero-text",
    "Products is the parent source chamber. ARCHCOIN is the protected Vault Chamber that receives the source stream and routes it through four financial gardens: contract authority, inbound value, outbound obligation, and growth allocation."
  );

  const statGrid = el("div", "stat-grid");
  statGrid.append(
    statCard("Source", "Products"),
    statCard("Receiver", "ARCHCOIN Vault"),
    statCard("Core", "Receiving Waterfall"),
    statCard("Garden Chambers", "4")
  );

  const controls = el("div", "action-row");
  controls.append(
    button("Back to Products", ROUTES.products, true),
    button("Vault Chamber", ROUTES.vault),
    button("Upper Room", ROUTES.upperRoom),
    button("Showroom", ROUTES.showroom)
  );

  hero.append(eyebrow, title, text, statGrid, controls);
  return hero;
}

function buildTemplatePanel() {
  const panel = el("section", "panel");

  panel.append(
    el("h2", "panel-title", "Four Gardens / Four Coins"),
    el(
      "p",
      "panel-text",
      "Every transaction enters the Vault as a protected stream and circulates through four chambers: contract authority, inbound value, outbound obligation, and growth or allocation pressure."
    )
  );

  const grid = el("div", "coin-grid");
  GARDENS.forEach((garden) => grid.appendChild(gardenCard(garden)));
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
      "ARCHCOIN provides the transaction template and bonding logic. Products supplies the source stream; the Vault protects and organizes that stream through the four-garden transaction frame."
    )
  );

  const grid = el("div", "feature-grid");

  grid.append(
    featureCard("Classify Transaction", "Identify which garden controls the transaction read: contract, inbound value, obligation, or allocation."),
    featureCard("Route Value", "Map incoming and outgoing value movement without reducing everything to one ordinary coin."),
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

function buildAlcove(garden) {
  const node = el("button", "garden-alcove " + garden.position);
  node.type = "button";
  node.dataset.key = garden.key;
  node.dataset.active = garden.key === "North" ? "true" : "false";

  const plaque = el("span", "garden-plaque");
  plaque.innerHTML =
    `<small>${garden.short} · ${garden.coin}</small>` +
    `<strong>${garden.name}</strong>` +
    `<span>${garden.role}</span>`;

  node.appendChild(plaque);
  return node;
}

function buildMobileControl(garden) {
  const node = el("button", "chamber-control");
  node.type = "button";
  node.dataset.key = garden.key;
  node.dataset.active = garden.key === "North" ? "true" : "false";
  node.innerHTML =
    `<small>${garden.short} · ${garden.coin}</small>` +
    `<strong>${garden.name} · ${garden.role}</strong>` +
    `<span>${garden.read}</span>`;
  return node;
}

function buildMachinePanel() {
  const machine = el("section", "machine-panel");
  const machineTitle = el("h2", "panel-title", "Receiving Vault Room");
  const machineText = el(
    "p",
    "panel-text",
    "The waterfall starts in Products. ARCHCOIN receives that stream inside the Vault, then circulates it through four garden chambers built into the wall."
  );

  const stage = el("div", "machine-stage");
  stage.id = "machineStage";

  const inlet = el("div", "products-inlet");
  inlet.innerHTML = `<strong>Products Source Chamber</strong> sends the protected-value stream into the ARCHCOIN Vault.`;

  const inletFall = el("div", "inlet-fall");

  const room = el("div", "vault-room");
  const floor = el("div", "vault-floor");

  const waterfall = el("div", "waterfall-core");
  waterfall.innerHTML = `<span class="waterfall-label">RECEIVING<br>VAULT<br>CORE</span>`;

  room.append(
    el("div", "vault-door north"),
    el("div", "vault-door east"),
    el("div", "vault-door south"),
    el("div", "vault-door west"),
    floor,
    el("div", "water-channel north"),
    el("div", "water-channel east"),
    el("div", "water-channel south"),
    el("div", "water-channel west"),
    waterfall
  );

  GARDENS.forEach((garden) => room.appendChild(buildAlcove(garden)));

  const caption = el(
    "p",
    "vault-caption",
    "Products is the source. ARCHCOIN is the receiving Vault. The stream enters the core, then circulates through contract authority, inbound value, outbound obligation, and growth allocation."
  );

  const controls = el("div", "chamber-controls");
  GARDENS.forEach((garden) => controls.appendChild(buildMobileControl(garden)));

  stage.append(inlet, inletFall, room, caption, controls);
  machine.append(machineTitle, machineText, stage);

  return machine;
}

function buildReceiptPanel() {
  const receipt = el("section", "panel");
  const receiptTitle = el("h2", "panel-title", "Vault Receipt");
  const receiptRows = el("div", "rows");

  receiptRows.append(
    infoRow("Source chamber", "Products"),
    infoRow("Selected chamber", "North Garden"),
    infoRow("Coin position", "North Coin"),
    infoRow("Transaction role", "Contract Authority"),
    infoRow("Garden read", "Contracts, permissions, signatures, terms, authority, and the binding frame for the transaction."),
    infoRow("Water circulation", "The protected stream reaches North as agreement: value cannot move cleanly unless the contract is named.")
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
    "Products is the source chamber. ARCHCOIN is the receiving Vault Chamber. The route remains connected to the rest of Richie’s Manor."
  );

  const routeGrid = el("div", "route-grid");

  routeGrid.append(
    routeCard("Products Source", "Return to the parent waterfall chamber.", ROUTES.products, true),
    routeCard("Vault Chamber", "ARCHCOIN four-garden transaction vault.", ROUTES.vault),
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

function setActiveGarden(key) {
  const garden = GARDENS.find((item) => item.key === key) || GARDENS[0];
  const rows = APP.querySelector(".rows");

  document.querySelectorAll(".garden-alcove, .chamber-control").forEach((node) => {
    node.dataset.active = node.dataset.key === garden.key ? "true" : "false";
  });

  if (!rows) return;

  rows.replaceChildren(
    infoRow("Source chamber", "Products"),
    infoRow("Selected chamber", garden.name),
    infoRow("Coin position", garden.coin),
    infoRow("Transaction role", garden.role),
    infoRow("Garden read", garden.read),
    infoRow("Water circulation", garden.water)
  );
}

function bindGardenActions() {
  const nodes = Array.from(document.querySelectorAll(".garden-alcove, .chamber-control"));

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      setActiveGarden(node.dataset.key || "North");
    });
  });
}

function boot() {
  if (!APP) return;

  injectStyles();
  APP.className = "page";
  APP.replaceChildren(buildShell());
  bindGardenActions();
  resizeCanvas();

  function frame() {
    drawField();
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
