/* TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · TED TALK RUSSIAN DOLL VAULT · B7

   RESULT:
     - Makes ARCHCOIN less like a scroll page.
     - Converts the page into a TED Talk-style Russian-doll chamber.
     - Keeps Products as the source waterfall.
     - Makes ARCHCOIN the receiving Vault Chamber.
     - Keeps the four-garden transaction template.
     - Uses one primary stage instead of many long stacked panels.
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
    water: "The stream reaches North as agreement. Value cannot move cleanly until the contract is named."
  },
  {
    key: "East",
    name: "East Garden",
    coin: "East Coin",
    short: "E",
    role: "Inbound Value",
    position: "east",
    read: "Accounts receivable, incoming value, receipts, deposits, counterparty inflow, and value received.",
    water: "The stream reaches East as arrival. Value enters the chamber and becomes visible."
  },
  {
    key: "South",
    name: "South Garden",
    coin: "South Coin",
    short: "S",
    role: "Outbound Obligation",
    position: "south",
    read: "Accounts payable, outgoing value, settlement duty, obligations, and pressure owed.",
    water: "The stream reaches South as responsibility. Every transaction carries an obligation to settle."
  },
  {
    key: "West",
    name: "West Garden",
    coin: "West Coin",
    short: "W",
    role: "Growth / Allocation",
    position: "west",
    read: "Growth allocation, marketing flow, GYP value flow, reinvestment, and expansion pressure.",
    water: "The stream reaches West as expansion. Value can grow without leaving the bond frame."
  }
]);

const LAYERS = Object.freeze([
  {
    key: "source",
    label: "Source",
    title: "The water starts in Products.",
    copy:
      "Products is the parent chamber. ARCHCOIN does not create the whole river. It receives the protected-value stream from Products and gives that stream a vault structure.",
    receipt: [
      ["Layer", "Source"],
      ["Origin", "Products Chamber"],
      ["Movement", "Source stream enters the Vault"]
    ]
  },
  {
    key: "vault",
    label: "Vault",
    title: "ARCHCOIN is the receiving room.",
    copy:
      "ARCHCOIN is not a regular coin sitting on a shelf. It is a protected room inside Richie’s Manor where value movement is organized before it travels any farther.",
    receipt: [
      ["Layer", "Vault"],
      ["Public label", "Vault Chamber"],
      ["Product label", "ARCHCOIN"]
    ]
  },
  {
    key: "gardens",
    label: "Gardens",
    title: "The Vault opens into four gardens.",
    copy:
      "Every transaction has four parts: a contract, a receiving side, an obligation side, and an allocation pressure. The gardens make those four parts visible.",
    receipt: [
      ["Layer", "Four Gardens"],
      ["North", "Contract Authority"],
      ["East", "Inbound Value"],
      ["South", "Outbound Obligation"],
      ["West", "Growth / Allocation"]
    ]
  },
  {
    key: "boundary",
    label: "Boundary",
    title: "The map is not the bridge.",
    copy:
      "ARCHCOIN can classify, route, bind, and account for value movement. It does not magically merge every blockchain. Real interoperability still requires adapters, bridges, wrappers, systems, or oracles.",
    receipt: [
      ["Layer", "Boundary"],
      ["Ordinary coin read", "False"],
      ["Automatic chain merger", "False"],
      ["Template read", "True"]
    ]
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

function infoRow(k, v) {
  const row = el("div", "row");
  row.append(el("div", "rk", k), el("div", "rv", v));
  return row;
}

function injectStyles() {
  if (document.getElementById("archcoin-ted-russian-doll-style")) return;

  const style = document.createElement("style");
  style.id = "archcoin-ted-russian-doll-style";
  style.textContent = `
    .vault-shell{
      min-height:calc(100svh - 40px);
      display:grid;
      gap:16px;
    }

    .topbar,
    .ted-stage,
    .route-strip{
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
      background:
        radial-gradient(circle at 50% 50%,rgba(127,255,212,.13),transparent 45%),
        linear-gradient(180deg,rgba(18,36,78,.96),rgba(10,22,48,.88));
      box-shadow:0 12px 28px rgba(0,0,0,.24);
      flex:0 0 auto;
    }

    .brand-title{
      margin:0 0 3px;
      font-size:.96rem;
      font-weight:850;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .brand-subtitle{
      margin:0;
      color:var(--muted);
      font-size:.82rem;
    }

    .action-row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin:0;
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
      font-weight:750;
      letter-spacing:.05em;
      text-transform:uppercase;
      text-decoration:none;
    }

    .action.strong{
      border-color:rgba(127,255,212,.26);
      background:rgba(127,255,212,.10);
    }

    .ted-stage{
      position:relative;
      overflow:hidden;
      min-height:calc(100svh - 158px);
      padding:clamp(18px,3vw,28px);
      display:grid;
      grid-template-columns:minmax(0,.86fr) minmax(360px,1.14fr);
      gap:20px;
      align-items:stretch;
    }

    .ted-stage::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:
        radial-gradient(circle at 68% 48%,rgba(127,255,212,.08),transparent 28rem),
        radial-gradient(circle at 28% 14%,rgba(241,210,141,.06),transparent 22rem),
        linear-gradient(115deg,rgba(255,255,255,.025),transparent 42%,rgba(126,203,255,.035));
    }

    .talk-column,
    .room-column{
      position:relative;
      z-index:1;
    }

    .talk-column{
      display:grid;
      gap:14px;
      align-content:center;
    }

    .eyebrow{
      display:inline-flex;
      width:max-content;
      max-width:100%;
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
    }

    .hero-title{
      margin:0;
      font-size:clamp(42px,6.8vw,86px);
      line-height:.88;
      letter-spacing:-.065em;
      font-family:Georgia,"Times New Roman",serif;
      max-width:11ch;
    }

    .hero-line{
      margin:0;
      color:var(--text);
      font-size:clamp(1.22rem,2.4vw,2rem);
      line-height:1.1;
      font-weight:850;
      letter-spacing:-.04em;
      max-width:17ch;
    }

    .hero-text{
      margin:0;
      max-width:58ch;
      color:var(--muted);
      font-size:16px;
      line-height:1.68;
    }

    .doll-controls{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:8px;
      margin-top:4px;
    }

    .doll-control{
      min-height:58px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      background:
        linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.026));
      color:var(--text);
      font-weight:850;
      cursor:pointer;
      display:grid;
      place-items:center;
      text-align:center;
      font-size:.82rem;
      letter-spacing:.04em;
    }

    .doll-control[data-active="true"]{
      border-color:rgba(127,255,212,.30);
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.12),transparent 70%),
        rgba(127,255,212,.06);
      box-shadow:0 0 24px rgba(127,255,212,.08);
    }

    .talk-card{
      border:1px solid rgba(255,255,255,.10);
      border-radius:24px;
      background:
        radial-gradient(circle at 16% 0%,rgba(241,210,141,.07),transparent 62%),
        rgba(255,255,255,.035);
      padding:18px;
      display:grid;
      gap:10px;
    }

    .talk-card h2{
      margin:0;
      color:var(--gold);
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(1.55rem,3.4vw,2.9rem);
      line-height:.96;
      letter-spacing:-.055em;
    }

    .talk-card p{
      margin:0;
      color:var(--muted);
      line-height:1.62;
      font-size:1rem;
    }

    .receipt{
      border:1px solid rgba(255,255,255,.09);
      border-radius:22px;
      background:rgba(0,0,0,.18);
      padding:14px;
      display:grid;
      gap:10px;
    }

    .receipt-title{
      margin:0;
      color:var(--accent);
      font-size:11px;
      font-weight:850;
      letter-spacing:.13em;
      text-transform:uppercase;
      padding-bottom:8px;
      border-bottom:1px solid var(--line);
    }

    .rows{
      display:grid;
      gap:8px;
    }

    .row{
      display:grid;
      grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);
      gap:12px;
      align-items:start;
    }

    .rk{
      color:var(--muted);
      font-size:12px;
      line-height:1.42;
    }

    .rv{
      color:var(--text);
      font-size:12px;
      line-height:1.42;
      text-align:right;
      word-break:break-word;
    }

    .room-column{
      display:grid;
      align-items:center;
    }

    .vault-stage{
      position:relative;
      min-height:640px;
      border:1px solid rgba(255,255,255,.09);
      border-radius:30px;
      overflow:hidden;
      background:
        radial-gradient(ellipse at 50% 10%,rgba(126,203,255,.08),transparent 22%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.12),rgba(127,255,212,.045) 30%,rgba(0,0,0,0) 58%),
        radial-gradient(circle at 50% 58%,rgba(241,210,141,.055),transparent 72%),
        linear-gradient(180deg,rgba(2,6,14,.58),rgba(2,4,10,.94));
      isolation:isolate;
    }

    .source-inlet{
      position:absolute;
      left:50%;
      top:16px;
      transform:translateX(-50%);
      width:min(88%,420px);
      border:1px solid rgba(127,255,212,.20);
      border-radius:999px;
      padding:9px 13px;
      background:
        radial-gradient(circle at 50% 0%,rgba(127,255,212,.12),transparent 62%),
        rgba(3,9,18,.78);
      color:var(--muted);
      text-align:center;
      z-index:12;
      font-size:.80rem;
      line-height:1.34;
    }

    .source-inlet strong{
      color:var(--text);
      font-weight:900;
    }

    .inlet-fall{
      position:absolute;
      left:50%;
      top:54px;
      width:18px;
      height:116px;
      transform:translateX(-50%);
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.78),
          rgba(126,203,255,.48),
          rgba(127,255,212,.20),
          rgba(126,203,255,.42),
          transparent
        );
      opacity:.82;
      filter:drop-shadow(0 0 18px rgba(126,203,255,.30));
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
          rgba(255,255,255,.50) 16px 22px,
          transparent 22px 38px
        );
      animation:inletDrop 1.8s linear infinite;
    }

    .vault-room{
      position:absolute;
      left:50%;
      top:54%;
      width:min(92%,610px);
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

    .waterfall-core{
      position:absolute;
      left:50%;
      top:50%;
      width:158px;
      height:158px;
      transform:translate(-50%,-50%);
      border-radius:50%;
      border:1px solid rgba(255,255,255,.18);
      background:
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.45),transparent 13%),
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.38),rgba(127,255,212,.14) 48%,rgba(0,0,0,.21) 100%);
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
          rgba(255,255,255,.84),
          rgba(126,203,255,.44) 26%,
          rgba(127,255,212,.21) 50%,
          rgba(126,203,255,.46) 74%,
          rgba(255,255,255,.64)
        );
      opacity:.82;
      filter:blur(.7px);
      animation:waterfallDrop 2.8s linear infinite;
    }

    .waterfall-core::after{
      content:"";
      position:absolute;
      inset:13px;
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
      font-size:13px;
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
      height:8px;
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
      opacity:.74;
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

    .garden-alcove{
      position:absolute;
      width:23%;
      min-height:86px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:22px;
      background:
        radial-gradient(circle at 50% 12%,rgba(127,255,212,.12),transparent 36%),
        linear-gradient(180deg,rgba(5,13,23,.84),rgba(7,11,19,.94));
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.035),
        0 20px 34px rgba(0,0,0,.30);
      display:grid;
      place-items:center;
      text-align:center;
      padding:9px;
      cursor:pointer;
      z-index:6;
    }

    .garden-alcove[data-active="true"]{
      border-color:rgba(241,210,141,.50);
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
      font-size:9px;
      letter-spacing:.11em;
      text-transform:uppercase;
      font-weight:900;
    }

    .garden-plaque strong{
      color:var(--text);
      font-size:.86rem;
      line-height:1.08;
    }

    .garden-plaque span{
      color:var(--muted);
      font-size:.70rem;
      line-height:1.22;
    }

    .vault-caption{
      position:absolute;
      left:50%;
      bottom:14px;
      transform:translateX(-50%);
      width:min(92%,700px);
      color:var(--muted2);
      text-align:center;
      font-size:.82rem;
      line-height:1.42;
      z-index:10;
      pointer-events:none;
    }

    .route-strip{
      padding:12px;
      display:grid;
      grid-template-columns:repeat(5,minmax(0,1fr));
      gap:10px;
    }

    .route-strip a{
      min-height:52px;
      display:grid;
      place-items:center;
      text-align:center;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      background:rgba(255,255,255,.04);
      color:var(--text);
      font-size:.78rem;
      font-weight:850;
      text-decoration:none;
    }

    .route-strip a.strong{
      border-color:rgba(127,255,212,.26);
      background:rgba(127,255,212,.08);
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

    @media(max-width:1080px){
      .ted-stage{
        grid-template-columns:1fr;
        min-height:auto;
      }

      .vault-stage{
        min-height:620px;
      }
    }

    @media(max-width:760px){
      .topbar{
        border-radius:24px;
      }

      .ted-stage{
        border-radius:24px;
        padding:16px;
      }

      .doll-controls{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }

      .row{
        grid-template-columns:1fr;
      }

      .rv{
        text-align:left;
      }

      .vault-stage{
        min-height:auto;
        display:grid;
        gap:14px;
        padding:14px;
      }

      .source-inlet{
        position:relative;
        left:auto;
        top:auto;
        transform:none;
        width:100%;
        order:1;
      }

      .inlet-fall{
        display:none;
      }

      .vault-room{
        position:relative;
        left:auto;
        top:auto;
        transform:none;
        width:min(100%,360px);
        margin:0 auto;
        order:2;
      }

      .garden-alcove{
        display:none;
      }

      .waterfall-core{
        width:126px;
        height:126px;
      }

      .waterfall-label{
        font-size:11px;
      }

      .water-channel{
        width:24%;
      }

      .vault-caption{
        position:relative;
        left:auto;
        bottom:auto;
        transform:none;
        width:100%;
        order:3;
      }

      .route-strip{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
    }

    @media(prefers-reduced-motion:reduce){
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
    el("p", "brand-subtitle", "ARCHCOIN / TED Talk Russian Doll")
  );

  brand.append(mark, copy);

  const actions = el("nav", "action-row");
  actions.append(
    button("Products Source", ROUTES.products, true),
    button("Vault", ROUTES.vault),
    button("Upper Room", ROUTES.upperRoom),
    button("Showroom", ROUTES.showroom)
  );

  topbar.append(brand, actions);
  return topbar;
}

function buildDollControls() {
  const controls = el("div", "doll-controls");

  LAYERS.forEach((layer) => {
    const node = el("button", "doll-control", layer.label);
    node.type = "button";
    node.dataset.layer = layer.key;
    node.dataset.active = layer.key === "source" ? "true" : "false";
    controls.appendChild(node);
  });

  return controls;
}

function buildTalkCard() {
  const card = el("section", "talk-card");
  card.id = "talkCard";

  card.append(
    el("h2", "talkTitle", LAYERS[0].title),
    el("p", "talkCopy", LAYERS[0].copy)
  );

  return card;
}

function buildReceipt() {
  const receipt = el("section", "receipt");
  const title = el("h2", "receipt-title", "Vault Receipt");
  const rows = el("div", "rows");
  rows.id = "receiptRows";

  LAYERS[0].receipt.forEach(([k, v]) => rows.appendChild(infoRow(k, v)));

  receipt.append(title, rows);
  return receipt;
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

function buildVaultRoom() {
  const stage = el("section", "vault-stage");

  const inlet = el("div", "source-inlet");
  inlet.innerHTML = `<strong>Products Source Chamber</strong> feeds the protected-value stream into ARCHCOIN.`;

  const inletFall = el("div", "inlet-fall");

  const room = el("div", "vault-room");

  const floor = el("div", "vault-floor");
  const waterfall = el("div", "waterfall-core");
  waterfall.innerHTML = `<span class="waterfall-label">RECEIVING<br>VAULT<br>CORE</span>`;

  room.append(
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
    "The Russian doll opens inward: Products sends the stream, the Vault receives it, the waterfall circulates it, and the four gardens explain the transaction."
  );

  stage.append(inlet, inletFall, room, caption);
  return stage;
}

function buildTedStage() {
  const stage = el("main", "ted-stage");

  const talk = el("section", "talk-column");
  talk.append(
    el("div", "eyebrow", "ARCHCOIN · TED Talk Chamber"),
    el("h1", "hero-title", "The Vault receives the stream."),
    el("p", "hero-line", "This is not a coin pitch. It is a map for how value moves."),
    el(
      "p",
      "hero-text",
      "Products is the source chamber. ARCHCOIN is the receiving Vault. The four gardens show the four parts of a transaction without turning the page into a dashboard."
    ),
    buildDollControls(),
    buildTalkCard(),
    buildReceipt()
  );

  const room = el("section", "room-column");
  room.appendChild(buildVaultRoom());

  stage.append(talk, room);
  return stage;
}

function buildRouteStrip() {
  const strip = el("nav", "route-strip");
  strip.setAttribute("aria-label", "ARCHCOIN route strip");

  const links = [
    ["Products Source", ROUTES.products, true],
    ["Vault Chamber", ROUTES.vault, false],
    ["Upper Room", ROUTES.upperRoom, false],
    ["Showroom", ROUTES.showroom, false],
    ["Compass", ROUTES.compass, false]
  ];

  links.forEach(([label, href, strong]) => {
    const a = el("a", strong ? "strong" : "", label);
    a.href = href;
    strip.appendChild(a);
  });

  return strip;
}

function buildShell() {
  const shell = el("div", "vault-shell");
  shell.append(buildTopbar(), buildTedStage(), buildRouteStrip());
  return shell;
}

function setReceipt(rows) {
  const receiptRows = document.getElementById("receiptRows");
  if (!receiptRows) return;

  receiptRows.replaceChildren();
  rows.forEach(([k, v]) => receiptRows.appendChild(infoRow(k, v)));
}

function setLayer(key) {
  const layer = LAYERS.find((item) => item.key === key) || LAYERS[0];

  document.querySelectorAll(".doll-control").forEach((node) => {
    node.dataset.active = node.dataset.layer === layer.key ? "true" : "false";
  });

  const title = document.querySelector(".talkTitle");
  const copy = document.querySelector(".talkCopy");

  if (title) title.textContent = layer.title;
  if (copy) copy.textContent = layer.copy;

  setReceipt(layer.receipt);
}

function setGarden(key) {
  const garden = GARDENS.find((item) => item.key === key) || GARDENS[0];

  document.querySelectorAll(".garden-alcove").forEach((node) => {
    node.dataset.active = node.dataset.key === garden.key ? "true" : "false";
  });

  document.querySelectorAll(".doll-control").forEach((node) => {
    node.dataset.active = "false";
  });

  const title = document.querySelector(".talkTitle");
  const copy = document.querySelector(".talkCopy");

  if (title) title.textContent = garden.name + " · " + garden.role;
  if (copy) copy.textContent = garden.read + " " + garden.water;

  setReceipt([
    ["Selected chamber", garden.name],
    ["Coin position", garden.coin],
    ["Transaction role", garden.role],
    ["Water route", garden.water]
  ]);
}

function bindInteractions() {
  document.querySelectorAll(".doll-control").forEach((node) => {
    node.addEventListener("click", () => {
      setLayer(node.dataset.layer || "source");
    });
  });

  document.querySelectorAll(".garden-alcove").forEach((node) => {
    node.addEventListener("click", () => {
      setGarden(node.dataset.key || "North");
    });
  });
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
  const count = Math.min(160, Math.max(90, Math.floor((field.width * field.height) / 16000)));

  field.stars = Array.from({ length: count }, () => ({
    x: Math.random() * field.width,
    y: Math.random() * field.height,
    z: 0.25 + Math.random() * 0.75,
    size: 0.6 + Math.random() * 2.1,
    drift: (Math.random() - 0.5) * 0.08,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawField() {
  if (!CANVAS) return;

  const ctx = CANVAS.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, field.width, field.height);

  const gx = (pointer.x - 0.5) * 32;
  const gy = (pointer.y - 0.5) * 32;

  for (const star of field.stars) {
    star.pulse += 0.01 * star.z;
    star.y += star.drift * star.z;

    if (star.y < -10) star.y = field.height + 10;
    if (star.y > field.height + 10) star.y = -10;

    const px = star.x + gx * star.z;
    const py = star.y + gy * star.z;
    const alpha = 0.18 + (Math.sin(star.pulse) * 0.5 + 0.5) * 0.38 * star.z;

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

function boot() {
  if (!APP) return;

  injectStyles();
  APP.className = "page";
  APP.replaceChildren(buildShell());
  bindInteractions();
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
