/* ==========================================================================
   TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · VAULT RUNTIME · B9 STABLE CONTRACT

   PURPOSE:
   - Replace malformed/minified ARCHCOIN runtime with clean executable JS.
   - Preserve ARCHCOIN spelling and ARCH-COIN read.
   - Keep Products as the source chamber and ARCHCOIN as the receiving Vault.
   - Keep the four-garden transaction template.
   - Keep runtime visual enhancement separate from the HTML fallback shell.
   - No external dependency.
   - No GraphicBox.
   - No generated image.
========================================================================== */

(() => {
  "use strict";

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

  function link(label, href, className = "arch-action") {
    const a = document.createElement("a");
    a.href = href;
    a.className = className;
    a.textContent = label;
    return a;
  }

  function row(key, value) {
    const item = el("div", "arch-receipt-row");
    item.append(el("span", "arch-receipt-key", key), el("strong", "arch-receipt-value", value));
    return item;
  }

  function injectStyles() {
    if (document.getElementById("archcoin-runtime-b9-style")) return;

    const style = document.createElement("style");
    style.id = "archcoin-runtime-b9-style";
    style.textContent = `
      .arch-shell{
        min-height:calc(100svh - 44px);
        display:grid;
        grid-template-rows:auto minmax(0,1fr) auto;
        gap:14px;
      }

      .arch-topbar,
      .arch-stage,
      .arch-route-strip{
        border:1px solid var(--line);
        background:
          radial-gradient(circle at 50% 0%,rgba(127,255,212,.10),transparent 44%),
          linear-gradient(180deg,var(--panel),var(--panel2));
        box-shadow:var(--shadow2);
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
      }

      .arch-topbar{
        border-radius:999px;
        padding:14px 18px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:14px;
        flex-wrap:wrap;
      }

      .arch-brand{
        display:flex;
        align-items:center;
        gap:12px;
        min-width:0;
      }

      .arch-mark{
        width:42px;
        height:42px;
        border-radius:14px;
        transform:rotate(45deg);
        border:1px solid rgba(241,210,141,.26);
        background:
          radial-gradient(circle at 50% 50%,rgba(127,255,212,.14),transparent 45%),
          linear-gradient(180deg,rgba(18,36,78,.96),rgba(10,22,48,.88));
        box-shadow:0 12px 28px rgba(0,0,0,.24);
        flex:0 0 auto;
      }

      .arch-brand-title{
        margin:0 0 3px;
        font-size:.95rem;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .arch-brand-subtitle{
        margin:0;
        color:var(--muted);
        font-size:.82rem;
        line-height:1.32;
      }

      .arch-actions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
      }

      .arch-action,
      .arch-route-card{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:40px;
        padding:10px 14px;
        border:1px solid rgba(255,255,255,.11);
        border-radius:999px;
        background:rgba(255,255,255,.05);
        color:var(--text);
        font-size:12px;
        font-weight:800;
        letter-spacing:.05em;
        text-transform:uppercase;
        text-align:center;
      }

      .arch-action.primary,
      .arch-route-card.primary{
        border-color:rgba(127,255,212,.28);
        background:rgba(127,255,212,.10);
      }

      .arch-stage{
        border-radius:30px;
        padding:clamp(18px,3vw,30px);
        display:grid;
        grid-template-columns:minmax(0,.90fr) minmax(340px,1.10fr);
        gap:18px;
        align-items:stretch;
        overflow:hidden;
        position:relative;
      }

      .arch-stage::before{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          radial-gradient(circle at 72% 50%,rgba(127,255,212,.09),transparent 30rem),
          radial-gradient(circle at 26% 14%,rgba(241,210,141,.07),transparent 22rem),
          linear-gradient(115deg,rgba(255,255,255,.026),transparent 42%,rgba(126,203,255,.036));
      }

      .arch-copy,
      .arch-room{
        position:relative;
        z-index:1;
      }

      .arch-copy{
        display:grid;
        gap:14px;
        align-content:center;
      }

      .arch-eyebrow{
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
        font-weight:850;
      }

      .arch-h1{
        margin:0;
        font-size:clamp(42px,7vw,86px);
        line-height:.88;
        letter-spacing:-.065em;
        font-family:Georgia,"Times New Roman",serif;
        max-width:11ch;
      }

      .arch-lede{
        margin:0;
        color:var(--text);
        font-size:clamp(1.18rem,2.4vw,2rem);
        line-height:1.1;
        font-weight:850;
        letter-spacing:-.04em;
        max-width:18ch;
      }

      .arch-body{
        margin:0;
        color:var(--muted);
        max-width:62ch;
        font-size:16px;
        line-height:1.65;
      }

      .arch-control-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:8px;
      }

      .arch-control{
        min-height:54px;
        border:1px solid rgba(255,255,255,.11);
        border-radius:18px;
        background:rgba(255,255,255,.05);
        color:var(--text);
        font-weight:900;
        letter-spacing:.04em;
        cursor:pointer;
      }

      .arch-control[data-active="true"]{
        border-color:rgba(127,255,212,.34);
        background:
          radial-gradient(circle at 50% 0%,rgba(127,255,212,.13),transparent 70%),
          rgba(127,255,212,.06);
      }

      .arch-talk-card,
      .arch-receipt{
        border:1px solid rgba(255,255,255,.10);
        border-radius:22px;
        background:rgba(0,0,0,.18);
        padding:14px;
        display:grid;
        gap:10px;
      }

      .arch-talk-card h2{
        margin:0;
        color:var(--gold);
        font-family:Georgia,"Times New Roman",serif;
        font-size:clamp(1.45rem,3.2vw,2.7rem);
        line-height:.96;
        letter-spacing:-.055em;
      }

      .arch-talk-card p{
        margin:0;
        color:var(--muted);
        line-height:1.62;
      }

      .arch-receipt-title{
        margin:0;
        color:var(--accent);
        font-size:.70rem;
        letter-spacing:.13em;
        text-transform:uppercase;
        font-weight:900;
      }

      .arch-receipt-row{
        display:grid;
        grid-template-columns:minmax(0,.80fr) minmax(0,1.20fr);
        gap:10px;
        align-items:start;
      }

      .arch-receipt-key{
        color:var(--muted);
        font-size:.76rem;
        line-height:1.35;
      }

      .arch-receipt-value{
        color:var(--text);
        font-size:.76rem;
        line-height:1.35;
        text-align:right;
      }

      .arch-room{
        min-height:620px;
        border:1px solid rgba(255,255,255,.09);
        border-radius:30px;
        overflow:hidden;
        display:grid;
        place-items:center;
        background:
          radial-gradient(ellipse at 50% 10%,rgba(126,203,255,.08),transparent 22%),
          radial-gradient(circle at 50% 50%,rgba(126,203,255,.12),rgba(127,255,212,.045) 30%,rgba(0,0,0,0) 58%),
          radial-gradient(circle at 50% 58%,rgba(241,210,141,.055),transparent 72%),
          linear-gradient(180deg,rgba(2,6,14,.58),rgba(2,4,10,.94));
      }

      .arch-vault{
        width:min(78vw,520px);
        aspect-ratio:1;
        border-radius:50%;
        border:18px solid rgba(145,173,205,.13);
        background:
          radial-gradient(circle at 50% 50%,rgba(127,255,212,.10),transparent 27%),
          repeating-conic-gradient(from 0deg,rgba(255,255,255,.052) 0deg 4deg,transparent 4deg 16deg),
          conic-gradient(from 45deg,rgba(127,255,212,.09),rgba(126,203,255,.04),rgba(241,210,141,.08),rgba(126,203,255,.04),rgba(127,255,212,.09));
        box-shadow:
          inset 0 0 48px rgba(0,0,0,.36),
          inset 0 0 96px rgba(255,255,255,.045),
          0 30px 70px rgba(0,0,0,.44),
          0 0 80px rgba(127,255,212,.08);
        display:grid;
        place-items:center;
        position:relative;
      }

      .arch-vault::before{
        content:"";
        position:absolute;
        width:142px;
        height:142px;
        border-radius:50%;
        background:
          radial-gradient(circle at 50% 18%,rgba(255,255,255,.45),transparent 13%),
          radial-gradient(circle at 50% 50%,rgba(126,203,255,.38),rgba(127,255,212,.14) 48%,rgba(0,0,0,.21) 100%);
        box-shadow:
          0 24px 42px rgba(0,0,0,.34),
          inset 0 0 44px rgba(126,203,255,.18),
          0 0 96px rgba(127,255,212,.18);
      }

      .arch-vault-label{
        position:relative;
        z-index:2;
        color:#fff;
        font-size:12px;
        line-height:1.18;
        letter-spacing:.08em;
        text-transform:uppercase;
        font-weight:950;
        text-align:center;
        text-shadow:0 2px 12px rgba(0,0,0,.68);
      }

      .arch-gardens{
        position:absolute;
        inset:9%;
      }

      .arch-garden{
        position:absolute;
        width:126px;
        min-height:58px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:18px;
        background:rgba(3,9,18,.70);
        display:grid;
        place-items:center;
        text-align:center;
        padding:8px;
        color:var(--muted);
        font-size:.70rem;
        line-height:1.14;
        font-weight:850;
        text-transform:uppercase;
        letter-spacing:.05em;
        cursor:pointer;
      }

      .arch-garden[data-active="true"]{
        border-color:rgba(241,210,141,.48);
        background:
          radial-gradient(circle at 50% 0%,rgba(241,210,141,.17),transparent 70%),
          rgba(3,9,18,.78);
      }

      .arch-garden strong{
        color:var(--text);
        display:block;
        margin-bottom:2px;
      }

      .arch-garden.north{left:50%;top:0;transform:translateX(-50%)}
      .arch-garden.east{right:0;top:50%;transform:translateY(-50%)}
      .arch-garden.south{left:50%;bottom:0;transform:translateX(-50%)}
      .arch-garden.west{left:0;top:50%;transform:translateY(-50%)}

      .arch-route-strip{
        border-radius:24px;
        padding:12px;
        display:grid;
        grid-template-columns:repeat(5,minmax(0,1fr));
        gap:10px;
      }

      @media(max-width:980px){
        .arch-stage{grid-template-columns:1fr}
        .arch-room{min-height:540px}
        .arch-route-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
      }

      @media(max-width:640px){
        .arch-topbar{border-radius:24px}
        .arch-stage{border-radius:24px;padding:16px}
        .arch-actions{width:100%}
        .arch-action{flex:1 1 140px}
        .arch-control-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .arch-room{min-height:430px}
        .arch-vault{width:min(84vw,330px);border-width:13px}
        .arch-garden{width:92px;min-height:46px;border-radius:14px;font-size:.58rem}
        .arch-receipt-row{grid-template-columns:1fr}
        .arch-receipt-value{text-align:left}
      }
    `;
    document.head.appendChild(style);
  }

  function buildTopbar() {
    const topbar = el("header", "arch-topbar");

    const brand = el("a", "arch-brand");
    brand.href = ROOT;
    brand.setAttribute("aria-label", "ARCHCOIN Vault Chamber");

    const mark = el("span", "arch-mark");
    mark.setAttribute("aria-hidden", "true");

    const text = el("span");
    text.append(
      el("p", "arch-brand-title", "Richie’s Manor · Vault Chamber"),
      el("p", "arch-brand-subtitle", "ARCHCOIN · Four-part transaction template")
    );

    brand.append(mark, text);

    const actions = el("nav", "arch-actions");
    actions.setAttribute("aria-label", "ARCHCOIN primary routes");
    actions.append(
      link("Products Source", ROUTES.products, "arch-action primary"),
      link("Vault", ROUTES.vault),
      link("Gauges", ROUTES.gauges),
      link("Compass", ROUTES.compass)
    );

    topbar.append(brand, actions);
    return topbar;
  }

  function buildControls() {
    const controls = el("div", "arch-control-grid");

    LAYERS.forEach((layer) => {
      const button = el("button", "arch-control", layer.label);
      button.type = "button";
      button.dataset.layer = layer.key;
      button.dataset.active = layer.key === "source" ? "true" : "false";
      controls.appendChild(button);
    });

    return controls;
  }

  function buildTalkCard() {
    const card = el("section", "arch-talk-card");
    card.id = "archTalkCard";
    card.append(el("h2", "arch-talk-title", LAYERS[0].title), el("p", "arch-talk-copy", LAYERS[0].copy));
    return card;
  }

  function buildReceipt() {
    const receipt = el("section", "arch-receipt");
    receipt.appendChild(el("h2", "arch-receipt-title", "Vault Receipt"));

    const rows = el("div", "arch-receipt-rows");
    rows.id = "archReceiptRows";
    LAYERS[0].receipt.forEach(([key, value]) => rows.appendChild(row(key, value)));

    receipt.appendChild(rows);
    return receipt;
  }

  function buildGarden(garden) {
    const button = el("button", "arch-garden " + garden.position);
    button.type = "button";
    button.dataset.garden = garden.key;
    button.dataset.active = garden.key === "North" ? "true" : "false";
    button.innerHTML =
      "<span><strong>" +
      garden.short +
      " · " +
      garden.coin +
      "</strong>" +
      garden.role +
      "</span>";
    return button;
  }

  function buildVault() {
    const room = el("aside", "arch-room");
    room.setAttribute("aria-label", "ARCHCOIN four-garden vault model");

    const vault = el("div", "arch-vault");

    const gardens = el("div", "arch-gardens");
    GARDENS.forEach((garden) => gardens.appendChild(buildGarden(garden)));

    const label = el("div", "arch-vault-label");
    label.innerHTML = "Receiving<br>Vault<br>Core";

    vault.append(gardens, label);
    room.appendChild(vault);
    return room;
  }

  function buildStage() {
    const stage = el("section", "arch-stage");

    const copy = el("div", "arch-copy");
    copy.append(
      el("span", "arch-eyebrow", "ARCHCOIN · Vault Runtime"),
      el("h1", "arch-h1", "The Vault receives the stream."),
      el("p", "arch-lede", "This is not a coin pitch. It is a map for how value moves."),
      el(
        "p",
        "arch-body",
        "Products is the source chamber. ARCHCOIN is the receiving Vault. The four gardens show the four parts of a transaction without turning the page into a dashboard."
      ),
      buildControls(),
      buildTalkCard(),
      buildReceipt()
    );

    stage.append(copy, buildVault());
    return stage;
  }

  function buildRouteStrip() {
    const strip = el("nav", "arch-route-strip");
    strip.setAttribute("aria-label", "ARCHCOIN route strip");
    strip.append(
      link("Products Source", ROUTES.products, "arch-route-card primary"),
      link("Vault Chamber", ROUTES.vault, "arch-route-card"),
      link("Upper Room", ROUTES.upperRoom, "arch-route-card"),
      link("Showroom", ROUTES.showroom, "arch-route-card"),
      link("Compass", ROUTES.compass, "arch-route-card")
    );
    return strip;
  }

  function buildShell() {
    const shell = el("section", "arch-shell");
    shell.append(buildTopbar(), buildStage(), buildRouteStrip());
    return shell;
  }

  function setReceipt(receiptRows) {
    const rows = document.getElementById("archReceiptRows");
    if (!rows) return;
    rows.replaceChildren();
    receiptRows.forEach(([key, value]) => rows.appendChild(row(key, value)));
  }

  function setLayer(key) {
    const layer = LAYERS.find((item) => item.key === key) || LAYERS[0];

    document.querySelectorAll(".arch-control").forEach((button) => {
      button.dataset.active = button.dataset.layer === layer.key ? "true" : "false";
    });

    document.querySelectorAll(".arch-garden").forEach((button) => {
      button.dataset.active = "false";
    });

    const title = document.querySelector(".arch-talk-title");
    const copy = document.querySelector(".arch-talk-copy");

    if (title) title.textContent = layer.title;
    if (copy) copy.textContent = layer.copy;

    setReceipt(layer.receipt);
  }

  function setGarden(key) {
    const garden = GARDENS.find((item) => item.key === key) || GARDENS[0];

    document.querySelectorAll(".arch-garden").forEach((button) => {
      button.dataset.active = button.dataset.garden === garden.key ? "true" : "false";
    });

    document.querySelectorAll(".arch-control").forEach((button) => {
      button.dataset.active = "false";
    });

    const title = document.querySelector(".arch-talk-title");
    const copy = document.querySelector(".arch-talk-copy");

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
    document.querySelectorAll(".arch-control").forEach((button) => {
      button.addEventListener("click", () => setLayer(button.dataset.layer || "source"));
    });

    document.querySelectorAll(".arch-garden").forEach((button) => {
      button.addEventListener("click", () => setGarden(button.dataset.garden || "North"));
    });
  }

  function buildStars() {
    const count = Math.min(170, Math.max(80, Math.floor((field.width * field.height) / 15500)));

    field.stars = Array.from({ length: count }, () => ({
      x: Math.random() * field.width,
      y: Math.random() * field.height,
      z: 0.25 + Math.random() * 0.75,
      size: 0.55 + Math.random() * 1.9,
      drift: (Math.random() - 0.5) * 0.08,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function resizeCanvas() {
    if (!CANVAS) return;

    field.width = window.innerWidth;
    field.height = window.innerHeight;

    CANVAS.width = Math.floor(field.width * field.dpr);
    CANVAS.height = Math.floor(field.height * field.dpr);
    CANVAS.style.width = field.width + "px";
    CANVAS.style.height = field.height + "px";

    const ctx = CANVAS.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
    buildStars();
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
      ctx.fillStyle = "rgba(190,225,255," + alpha.toFixed(3) + ")";
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

    grad.addColorStop(0, "rgba(127,255,212,0.052)");
    grad.addColorStop(0.45, "rgba(126,203,255,0.032)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, field.width, field.height);
  }

  function boot() {
    if (!APP) return;

    injectStyles();
    APP.className = "page";
    APP.dataset.product = "archcoin";
    APP.dataset.runtime = "archcoin-b9-stable-contract";
    APP.replaceChildren(buildShell());

    bindInteractions();
    resizeCanvas();

    if (!REDUCED_MOTION) {
      const frame = () => {
        drawField();
        window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    } else {
      drawField();
    }
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX / Math.max(window.innerWidth, 1);
      pointer.y = event.clientY / Math.max(window.innerHeight, 1);
    },
    { passive: true }
  );

  window.addEventListener("resize", resizeCanvas, { passive: true });

  try {
    boot();
  } catch (error) {
    console.error("ARCHCOIN runtime failed. Fallback shell remains active.", error);
  }
})();
