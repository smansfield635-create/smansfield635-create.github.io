/* TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · TED TALK NESTED VAULT · B8

   RESULT:
   - ARCHCOIN spelling locked.
   - ARCH-COIN read preserved.
   - Converts the page into a compact TED Talk-style nested vault chamber.
   - Products remains the source waterfall.
   - ARCHCOIN remains the receiving Vault Chamber.
   - Four-garden transaction template remains active.
   - Top navigation uses compass jump cards.
   - No external runtime dependency.
   - No graphic box.
   - No generated image.
*/

const ROOT = "/products/archcoin/";

const ROUTES = Object.freeze({
  compass: "/",
  door: "/door/",
  products: "/products/",
  gauges: "/gauges/",
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
      "Products is the parent source chamber. ARCHCOIN does not create the whole river. It receives the protected-value stream from Products and gives that stream a vault structure.",
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

function linkCard(label, href, state = "jump") {
  const a = el("a", "jump-card" + (state === "active" ? " active" : ""));
  a.href = href;
  a.setAttribute("aria-label", label);

  const compass = el("span", "nav-compass");
  compass.setAttribute("aria-hidden", "true");

  const text = el("span", "jump-text");
  text.append(
    el("small", "", state === "active" ? "Active" : "Jump"),
    el("strong", "", label)
  );

  a.append(compass, text);
  return a;
}

function action(label, href, strong = false) {
  const a = el("a", "route-link" + (strong ? " strong" : ""), label);
  a.href = href;
  return a;
}

function infoRow(k, v) {
  const row = el("div", "row");
  row.append(el("div", "rk", k), el("div", "rv", v));
  return row;
}

function injectStyles() {
  if (document.getElementById("archcoin-nested-vault-style")) return;

  const style = document.createElement("style");
  style.id = "archcoin-nested-vault-style";
  style.textContent = `
    :root{
      color-scheme:dark;
      --arch-panel:rgba(18,14,10,.86);
      --arch-panel2:rgba(36,26,16,.92);
      --arch-line:rgba(255,218,150,.26);
      --arch-text:#fff8ea;
      --arch-muted:#d5c7aa;
      --arch-muted2:rgba(213,199,170,.74);
      --arch-gold:#ffd98a;
      --arch-blue:#8ec5ff;
      --arch-mint:#93efbd;
      --arch-shadow:0 24px 80px rgba(0,0,0,.50);
      --arch-max:1180px;
    }

    *{box-sizing:border-box}

    html,
    body{
      margin:0;
      min-height:100%;
      color:var(--arch-text);
      font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      background:
        radial-gradient(circle at 50% 92%,rgba(126,203,255,.18),transparent 24%),
        radial-gradient(circle at 16% 20%,rgba(255,217,138,.16),transparent 26%),
        radial-gradient(circle at 84% 18%,rgba(147,239,189,.10),transparent 26%),
        linear-gradient(180deg,#071225 0%,#14100c 42%,#2c1b10 100%);
      overflow-x:hidden;
    }

    body::before{
      content:"";
      position:fixed;
      inset:0;
      pointer-events:none;
      opacity:.38;
      background:
        linear-gradient(90deg,rgba(255,218,150,.05) 1px,transparent 1px),
        linear-gradient(180deg,rgba(255,218,150,.035) 1px,transparent 1px),
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.15),transparent 30%);
      background-size:56px 56px,56px 56px,100% 100%;
      mask-image:radial-gradient(circle at 50% 35%,black,transparent 82%);
      z-index:0;
    }

    #fieldCanvas{
      position:fixed;
      inset:0;
      width:100%;
      height:100%;
      pointer-events:none;
      z-index:0;
      opacity:.72;
      mix-blend-mode:screen;
    }

    #app.archcoin-page{
      position:relative;
      z-index:1;
      width:min(var(--arch-max),calc(100vw - 20px));
      min-height:100svh;
      margin:0 auto;
      padding:14px 0 24px;
      display:grid;
      grid-template-rows:auto 1fr auto;
      gap:14px;
      color:var(--arch-text);
    }

    a{color:inherit;text-decoration:none}

    .topbar,
    .ted-stage,
    .route-strip{
      border:1px solid var(--arch-line);
      background:
        radial-gradient(circle at 50% 0%,rgba(255,217,138,.10),transparent 42%),
        linear-gradient(180deg,var(--arch-panel2),var(--arch-panel));
      box-shadow:var(--arch-shadow);
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
    }

    .topbar{
      border-radius:28px;
      padding:14px;
      display:grid;
      gap:14px;
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    .brand-mark{
      width:50px;
      height:50px;
      border-radius:17px;
      display:grid;
      place-items:center;
      border:1px solid rgba(255,217,138,.50);
      background:
        radial-gradient(circle at 50% 28%,rgba(255,217,138,.40),transparent 44%),
        linear-gradient(180deg,rgba(58,42,18,.94),rgba(10,18,32,.98));
      color:#fff8ea;
      font-weight:950;
      letter-spacing:.06em;
      flex:0 0 auto;
      box-shadow:0 0 22px rgba(255,217,138,.18);
    }

    .brand-copy{
      display:grid;
      gap:3px;
    }

    .brand-title{
      display:block;
      margin:0;
      color:#ffe0a3;
      font-size:.72rem;
      text-transform:uppercase;
      letter-spacing:.16em;
      font-weight:850;
    }

    .brand-subtitle{
      display:block;
      margin:0;
      color:#fff;
      font-weight:900;
      font-size:1.08rem;
      line-height:1.05;
    }

    .jump-grid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:10px;
    }

    .jump-card{
      min-height:88px;
      border:1px solid rgba(255,255,255,.12);
      border-radius:24px;
      background:
        radial-gradient(circle at 50% 0%,rgba(142,197,255,.08),transparent 70%),
        linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.024));
      display:grid;
      grid-template-columns:auto 1fr;
      gap:12px;
      align-items:center;
      padding:12px;
      transition:transform .18s ease,border-color .18s ease,filter .18s ease;
    }

    .jump-card:hover,
    .jump-card:focus-visible{
      transform:translateY(-3px);
      border-color:rgba(142,197,255,.40);
      filter:brightness(1.12);
      outline:none;
    }

    .jump-card.active{
      border-color:rgba(255,217,138,.56);
      background:
        radial-gradient(circle at 50% 0%,rgba(255,217,138,.18),transparent 70%),
        linear-gradient(180deg,rgba(255,217,138,.08),rgba(255,255,255,.024));
      box-shadow:0 0 24px rgba(255,217,138,.12);
    }

    .nav-compass{
      position:relative;
      width:54px;
      aspect-ratio:1;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.16);
      background:
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.34),transparent 13%),
        radial-gradient(circle at 50% 50%,rgba(142,197,255,.25),rgba(10,20,42,.82) 68%);
      overflow:hidden;
      flex:0 0 auto;
    }

    .jump-card.active .nav-compass{
      background:
        radial-gradient(circle at 50% 18%,rgba(255,255,255,.38),transparent 13%),
        radial-gradient(circle at 50% 50%,rgba(255,217,138,.42),rgba(60,40,16,.84) 68%);
    }

    .nav-compass::before{
      content:"";
      position:absolute;
      inset:16%;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.11);
      background:
        repeating-conic-gradient(from 0deg,transparent 0deg 18deg,rgba(255,255,255,.08) 18deg 21deg,transparent 21deg 36deg);
      animation:compassSpin 14s linear infinite;
    }

    .nav-compass::after{
      content:"";
      position:absolute;
      width:14%;
      height:58%;
      left:43%;
      top:21%;
      clip-path:polygon(50% 0%,100% 48%,58% 48%,58% 100%,42% 100%,42% 48%,0% 48%);
      background:linear-gradient(180deg,rgba(255,255,255,.86),rgba(142,197,255,.60));
      animation:needleSpin 8s linear infinite;
    }

    .jump-card.active .nav-compass::after{
      background:linear-gradient(180deg,rgba(255,255,255,.90),rgba(255,217,138,.74));
    }

    .jump-text{
      display:grid;
      gap:4px;
      min-width:0;
    }

    .jump-text small{
      color:#c8d7ff;
      font-size:.58rem;
      font-weight:950;
      letter-spacing:.12em;
      text-transform:uppercase;
    }

    .jump-text strong{
      color:#fff;
      font-size:1rem;
      line-height:1.02;
      letter-spacing:-.035em;
    }

    .ted-stage{
      border-radius:34px;
      padding:clamp(18px,3vw,30px);
      display:grid;
      grid-template-columns:minmax(0,.88fr) minmax(420px,1.12fr);
      gap:20px;
      overflow:hidden;
      position:relative;
      isolation:isolate;
    }

    .ted-stage::before{
      content:"";
      position:absolute;
      left:50%;
      top:0;
      width:min(720px,92vw);
      height:180px;
      transform:translateX(-50%);
      background:radial-gradient(ellipse at 50% 0%,rgba(255,217,138,.17),transparent 68%);
      z-index:-1;
    }

    .talk-column{
      display:grid;
      gap:14px;
      align-content:center;
      min-width:0;
      position:relative;
      z-index:1;
    }

    .eyebrow{
      display:inline-flex;
      width:fit-content;
      align-items:center;
      gap:10px;
      padding:8px 12px;
      border-radius:999px;
      border:1px solid rgba(255,217,138,.32);
      background:rgba(255,255,255,.04);
      color:#ffe0a3;
      text-transform:uppercase;
      letter-spacing:.14em;
      font-size:.70rem;
      font-weight:850;
    }

    .eyebrow::before{
      content:"";
      width:9px;
      height:9px;
      border-radius:2px;
      transform:rotate(45deg);
      background:var(--arch-gold);
      box-shadow:0 0 18px rgba(255,217,138,.46);
    }

    .hero-title{
      margin:0;
      color:#fff;
      font-size:clamp(3.4rem,9vw,6.8rem);
      line-height:.84;
      letter-spacing:-.065em;
      text-transform:uppercase;
      font-family:Georgia,"Times New Roman",serif;
    }

    .hero-line{
      margin:0;
      color:var(--arch-gold);
      font-size:clamp(1.38rem,4.4vw,2.8rem);
      line-height:1;
      letter-spacing:-.045em;
      font-weight:900;
    }

    .hero-text{
      margin:0;
      color:var(--arch-muted);
      line-height:1.58;
      font-size:1rem;
    }

    .doll-controls{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:8px;
    }

    .doll-control{
      min-height:58px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.026));
      color:var(--arch-text);
      font-weight:850;
      cursor:pointer;
      display:grid;
      place-items:center;
      text-align:center;
      font-size:.82rem;
      letter-spacing:.04em;
    }

    .doll-control[data-active="true"]{
      border-color:rgba(255,217,138,.54);
      background:
        radial-gradient(circle at 50% 0%,rgba(255,217,138,.16),transparent 70%),
        linear-gradient(180deg,rgba(46,34,16,.92),rgba(10,20,42,.94));
      box-shadow:0 0 24px rgba(255,217,138,.10);
    }

    .talk-card,
    .receipt{
      border:1px solid rgba(255,255,255,.10);
      border-radius:24px;
      background:
        radial-gradient(circle at 16% 0%,rgba(255,217,138,.07),transparent 62%),
        rgba(255,255,255,.035);
      padding:18px;
      display:grid;
      gap:10px;
    }

    .talk-card h2{
      margin:0;
      color:var(--arch-gold);
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(1.55rem,3.4vw,2.9rem);
      line-height:.96;
      letter-spacing:-.055em;
    }

    .talk-card p{
      margin:0;
      color:var(--arch-muted);
      line-height:1.62;
      font-size:1rem;
    }

    .receipt-title{
      margin:0;
      color:var(--arch-gold);
      font-size:11px;
      font-weight:850;
      letter-spacing:.13em;
      text-transform:uppercase;
      padding-bottom:8px;
      border-bottom:1px solid rgba(255,218,150,.20);
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
      color:var(--arch-muted);
      font-size:12px;
      line-height:1.42;
    }

    .rv{
      color:var(--arch-text);
      font-size:12px;
      line-height:1.42;
      text-align:right;
      word-break:break-word;
    }

    .room-column{
      display:grid;
      align-items:center;
      position:relative;
      z-index:1;
    }

    .vault-stage{
      position:relative;
      min-height:650px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:32px;
      background:
        radial-gradient(circle at 50% 50%,rgba(255,217,138,.12),rgba(126,203,255,.045) 32%,rgba(0,0,0,0) 62%),
        linear-gradient(180deg,rgba(255,255,255,.034),rgba(255,255,255,.014));
      overflow:hidden;
      display:grid;
      place-items:center;
    }

    .source-inlet{
      position:absolute;
      left:50%;
      top:16px;
      transform:translateX(-50%);
      width:min(88%,420px);
      border:1px solid rgba(147,239,189,.20);
      border-radius:999px;
      padding:9px 13px;
      background:
        radial-gradient(circle at 50% 0%,rgba(147,239,189,.12),transparent 62%),
        rgba(3,9,18,.78);
      color:var(--arch-muted);
      text-align:center;
      z-index:12;
      font-size:.80rem;
      line-height:1.34;
    }

    .source-inlet strong{
      color:var(--arch-text);
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
          rgba(147,239,189,.20),
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
          rgba(147,239,189,.09),
          rgba(126,203,255,.04),
          rgba(255,217,138,.08),
          rgba(126,203,255,.04),
          rgba(147,239,189,.09)
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
        0 0 80px rgba(147,239,189,.07);
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
        radial-gradient(circle at 50% 50%,rgba(147,239,189,.06),transparent 28%),
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
        radial-gradient(circle at 50% 50%,rgba(126,203,255,.38),rgba(147,239,189,.14) 48%,rgba(0,0,0,.21) 100%);
      box-shadow:
        0 24px 42px rgba(0,0,0,.34),
        inset 0 0 44px rgba(126,203,255,.18),
        0 0 96px rgba(147,239,189,.18);
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
          rgba(147,239,189,.21) 50%,
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
      color:var(--arch-text);
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
          rgba(147,239,189,.15),
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
        radial-gradient(circle at 50% 12%,rgba(147,239,189,.12),transparent 36%),
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
      border-color:rgba(255,217,138,.50);
      background:
        radial-gradient(circle at 50% 12%,rgba(255,217,138,.18),transparent 36%),
        linear-gradient(180deg,rgba(12,17,25,.90),rgba(7,11,19,.96));
      box-shadow:
        inset 0 0 26px rgba(255,255,255,.04),
        0 20px 34px rgba(0,0,0,.30),
        0 0 38px rgba(255,217,138,.13);
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
      color:var(--arch-gold);
      font-size:9px;
      letter-spacing:.11em;
      text-transform:uppercase;
      font-weight:900;
    }

    .garden-plaque strong{
      color:var(--arch-text);
      font-size:.86rem;
      line-height:1.08;
    }

    .garden-plaque span{
      color:var(--arch-muted);
      font-size:.70rem;
      line-height:1.22;
    }

    .vault-caption{
      position:absolute;
      left:50%;
      bottom:14px;
      transform:translateX(-50%);
      width:min(92%,700px);
      color:var(--arch-muted2);
      text-align:center;
      font-size:.82rem;
      line-height:1.42;
      z-index:10;
      pointer-events:none;
    }

    .route-strip{
      border-radius:24px;
      padding:10px;
      display:grid;
      grid-template-columns:repeat(5,minmax(0,1fr));
      gap:8px;
    }

    .route-link{
      min-height:48px;
      border-radius:18px;
      border:1px solid rgba(255,218,150,.20);
      background:rgba(255,255,255,.04);
      color:#fff4dd;
      font-size:.66rem;
      font-weight:900;
      letter-spacing:.08em;
      text-transform:uppercase;
      display:grid;
      place-items:center;
      text-align:center;
    }

    .route-link.strong{
      border-color:rgba(255,217,138,.48);
      background:rgba(255,217,138,.10);
      color:#fff8ea;
    }

    @keyframes compassSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes needleSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes inletDrop{from{transform:translateY(-38px)}to{transform:translateY(38px)}}
    @keyframes waterfallDrop{0%{transform:translateX(-50%) translateY(-22%)}100%{transform:translateX(-50%) translateY(22%)}}
    @keyframes waterCircle{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes waterRun{from{transform:translateX(-42px)}to{transform:translateX(42px)}}

    @media(max-width:1080px){
      .ted-stage{
        grid-template-columns:1fr;
      }

      .vault-stage{
        min-height:620px;
      }

      .route-strip{
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
    }

    @media(max-width:760px){
      #app.archcoin-page{
        width:min(100vw - 12px,var(--arch-max));
        padding-top:10px;
      }

      .topbar,
      .ted-stage,
      .route-strip{
        border-radius:24px;
      }

      .topbar{
        padding:12px;
      }

      .brand{
        gap:10px;
      }

      .brand-mark{
        width:44px;
        height:44px;
        border-radius:14px;
      }

      .jump-grid,
      .doll-controls,
      .route-strip{
        grid-template-columns:1fr;
      }

      .jump-card{
        min-height:76px;
      }

      .ted-stage{
        padding:18px;
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
    }

    @media(prefers-reduced-motion:reduce){
      *,
      *::before,
      *::after{
        animation:none!important;
        transition:none!important;
        scroll-behavior:auto!important;
      }
    }
  `;

  document.head.appendChild(style);
}

function buildTopbar() {
  const topbar = el("header", "topbar");

  const brand = el("a", "brand");
  brand.href = ROOT;
  brand.setAttribute("aria-label", "ARCHCOIN");

  const mark = el("span", "brand-mark", "AC");
  mark.setAttribute("aria-hidden", "true");

  const copy = el("span", "brand-copy");
  copy.append(
    el("span", "brand-title", "Richie’s Manor · Vault Chamber"),
    el("strong", "brand-subtitle", "ARCHCOIN · Four-Coin Transaction Template")
  );

  brand.append(mark, copy);

  const jumps = el("nav", "jump-grid");
  jumps.setAttribute("aria-label", "Primary compass jumps");
  jumps.append(
    linkCard("Compass", ROUTES.compass),
    linkCard("Door", ROUTES.door),
    linkCard("Products", ROUTES.products, "active"),
    linkCard("Gauges", ROUTES.gauges)
  );

  topbar.append(brand, jumps);
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
  card.append(el("h2", "talk-title", LAYERS[0].title), el("p", "talk-copy", LAYERS[0].copy));
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
    "The chamber opens inward: Products sends the stream, the Vault receives it, the waterfall circulates it, and the four gardens explain the transaction."
  );

  stage.append(inlet, inletFall, room, caption);
  return stage;
}

function buildTedStage() {
  const stage = el("main", "ted-stage");

  const talk = el("section", "talk-column");
  talk.append(
    el("div", "eyebrow", "ARCHCOIN · Vault Chamber"),
    el("h1", "hero-title", "ARCHCOIN"),
    el("p", "hero-line", "Not a regular coin. A transaction template."),
    el(
      "p",
      "hero-text",
      "Products is the source chamber. ARCHCOIN is the receiving Vault. The four gardens show the four parts of a transaction without turning the page into a long scroll."
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

  strip.append(
    action("Products", ROUTES.products, true),
    action("Vault", ROUTES.vault),
    action("Upper Room", ROUTES.upperRoom),
    action("Showroom", ROUTES.showroom),
    action("Compass", ROUTES.compass)
  );

  return strip;
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

  document.querySelectorAll(".garden-alcove").forEach((node) => {
    node.dataset.active = node.dataset.key === "North" && layer.key === "source" ? "true" : "false";
  });

  const title = document.querySelector(".talk-title");
  const copy = document.querySelector(".talk-copy");

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

  const title = document.querySelector(".talk-title");
  const copy = document.querySelector(".talk-copy");

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
  if (!CANVAS || REDUCED_MOTION) return;

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

  grad.addColorStop(0, "rgba(147,239,189,0.05)");
  grad.addColorStop(0.45, "rgba(126,203,255,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, field.width, field.height);
}

function buildShell() {
  APP.className = "archcoin-page";
  APP.dataset.page = "archcoin";
  APP.dataset.roomLocation = "richie-manor-vault-chamber";
  APP.dataset.nameLock = "ARCHCOIN";
  APP.dataset.selfPath = ROOT;
  APP.dataset.productsBacklink = ROUTES.products;

  APP.replaceChildren(buildTopbar(), buildTedStage(), buildRouteStrip());
}

function boot() {
  if (!APP) {
    console.warn("ARCHCOIN boot stopped: missing #app mount.");
    return;
  }

  injectStyles();
  buildShell();
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
