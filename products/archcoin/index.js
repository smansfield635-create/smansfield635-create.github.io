/* ==========================================================================
   TNT RENEWAL — /products/archcoin/index.js
   ARCHCOIN · VAULT RUNTIME · B10 VISIBLE-FIRST ENHANCEMENT

   PURPOSE:
   - Enhance the B10 visible-first ARCHCOIN HTML.
   - Keep the page functional even if this runtime is delayed.
   - Bind Source, Vault, Gardens, Boundary controls.
   - Bind four-garden transaction reads.
   - Draw lightweight field motion on canvas.
   - No external dependency.
   - No GraphicBox.
   - No generated image.
========================================================================== */

(() => {
  "use strict";

  const LAYERS = Object.freeze({
    source: {
      title: "The water starts in Products.",
      copy: "Products is the parent source chamber. ARCHCOIN does not create the whole river. It receives the protected-value stream from Products and gives that stream a vault structure.",
      receipt: [
        ["Layer", "Source"],
        ["Origin", "Products Chamber"],
        ["Movement", "Source stream enters the Vault"]
      ]
    },
    vault: {
      title: "ARCHCOIN is the receiving room.",
      copy: "ARCHCOIN is not a regular coin sitting on a shelf. It is a protected room inside Richie’s Manor where value movement is organized before it travels any farther.",
      receipt: [
        ["Layer", "Vault"],
        ["Public label", "Vault Chamber"],
        ["Product label", "ARCHCOIN"]
      ]
    },
    gardens: {
      title: "The Vault opens into four gardens.",
      copy: "Every transaction has four parts: a contract, a receiving side, an obligation side, and an allocation pressure. The gardens make those four parts visible.",
      receipt: [
        ["Layer", "Four Gardens"],
        ["North", "Contract Authority"],
        ["East", "Inbound Value"],
        ["South", "Outbound Obligation"],
        ["West", "Growth / Allocation"]
      ]
    },
    boundary: {
      title: "The map is not the bridge.",
      copy: "ARCHCOIN can classify, route, bind, and account for value movement. It does not automatically merge every blockchain. Real interoperability still requires adapters, bridges, wrappers, systems, or oracles.",
      receipt: [
        ["Layer", "Boundary"],
        ["Ordinary coin read", "False"],
        ["Automatic chain merger", "False"],
        ["Template read", "True"]
      ]
    }
  });

  const GARDENS = Object.freeze({
    North: {
      name: "North Garden",
      coin: "North Coin",
      role: "Contract Authority",
      copy: "Contracts, permissions, signatures, terms, authority, and the binding frame for the transaction. The stream reaches North as agreement. Value cannot move cleanly until the contract is named.",
      receipt: [
        ["Selected chamber", "North Garden"],
        ["Coin position", "North Coin"],
        ["Transaction role", "Contract Authority"],
        ["Water route", "Agreement binds movement"]
      ]
    },
    East: {
      name: "East Garden",
      coin: "East Coin",
      role: "Inbound Value",
      copy: "Accounts receivable, incoming value, receipts, deposits, counterparty inflow, and value received. The stream reaches East as arrival. Value enters the chamber and becomes visible.",
      receipt: [
        ["Selected chamber", "East Garden"],
        ["Coin position", "East Coin"],
        ["Transaction role", "Inbound Value"],
        ["Water route", "Arrival makes value visible"]
      ]
    },
    South: {
      name: "South Garden",
      coin: "South Coin",
      role: "Outbound Obligation",
      copy: "Accounts payable, outgoing value, settlement duty, obligations, and pressure owed. The stream reaches South as responsibility. Every transaction carries an obligation to settle.",
      receipt: [
        ["Selected chamber", "South Garden"],
        ["Coin position", "South Coin"],
        ["Transaction role", "Outbound Obligation"],
        ["Water route", "Responsibility settles movement"]
      ]
    },
    West: {
      name: "West Garden",
      coin: "West Coin",
      role: "Growth / Allocation",
      copy: "Growth allocation, marketing flow, GYP value flow, reinvestment, and expansion pressure. The stream reaches West as expansion. Value can grow without leaving the bond frame.",
      receipt: [
        ["Selected chamber", "West Garden"],
        ["Coin position", "West Coin"],
        ["Transaction role", "Growth / Allocation"],
        ["Water route", "Expansion stays inside the bond"]
      ]
    }
  });

  const canvas = document.getElementById("fieldCanvas");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const field = {
    width: 0,
    height: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    stars: [],
    pointerX: 0.5,
    pointerY: 0.5
  };

  function makeRow(key, value) {
    const row = document.createElement("div");
    row.className = "receiptRow";

    const k = document.createElement("span");
    k.className = "receiptKey";
    k.textContent = key;

    const v = document.createElement("strong");
    v.className = "receiptValue";
    v.textContent = value;

    row.append(k, v);
    return row;
  }

  function setReceipt(items) {
    const rows = document.getElementById("receiptRows");
    if (!rows) return;

    rows.replaceChildren();
    items.forEach(([key, value]) => rows.appendChild(makeRow(key, value)));
  }

  function setTalk(title, copy, receipt) {
    const titleNode = document.getElementById("talkTitle");
    const copyNode = document.getElementById("talkCopy");

    if (titleNode) titleNode.textContent = title;
    if (copyNode) copyNode.textContent = copy;
    setReceipt(receipt);
  }

  function activateLayer(key) {
    const layer = LAYERS[key] || LAYERS.source;

    document.querySelectorAll(".control").forEach((button) => {
      button.dataset.active = button.dataset.layer === key ? "true" : "false";
    });

    document.querySelectorAll(".garden").forEach((button) => {
      button.dataset.active = "false";
    });

    setTalk(layer.title, layer.copy, layer.receipt);
  }

  function activateGarden(key) {
    const garden = GARDENS[key] || GARDENS.North;

    document.querySelectorAll(".garden").forEach((button) => {
      button.dataset.active = button.dataset.garden === key ? "true" : "false";
    });

    document.querySelectorAll(".control").forEach((button) => {
      button.dataset.active = "false";
    });

    setTalk(garden.name + " · " + garden.role, garden.copy, garden.receipt);
  }

  function bindControls() {
    document.querySelectorAll(".control").forEach((button) => {
      button.addEventListener("click", () => activateLayer(button.dataset.layer || "source"));
    });

    document.querySelectorAll(".garden").forEach((button) => {
      button.addEventListener("click", () => activateGarden(button.dataset.garden || "North"));
    });
  }

  function buildStars() {
    const count = Math.min(180, Math.max(90, Math.floor((field.width * field.height) / 15000)));

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
    if (!canvas) return;

    field.width = window.innerWidth;
    field.height = window.innerHeight;

    canvas.width = Math.floor(field.width * field.dpr);
    canvas.height = Math.floor(field.height * field.dpr);
    canvas.style.width = field.width + "px";
    canvas.style.height = field.height + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
    buildStars();
  }

  function drawField() {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, field.width, field.height);

    const gx = (field.pointerX - 0.5) * 32;
    const gy = (field.pointerY - 0.5) * 32;

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

  function bootField() {
    resizeCanvas();

    if (reducedMotion) {
      drawField();
      return;
    }

    const frame = () => {
      drawField();
      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  }

  function boot() {
    bindControls();
    bootField();
    document.documentElement.dataset.archcoinRuntime = "b10-active";
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      field.pointerX = event.clientX / Math.max(window.innerWidth, 1);
      field.pointerY = event.clientY / Math.max(window.innerHeight, 1);
    },
    { passive: true }
  );

  window.addEventListener("resize", resizeCanvas, { passive: true });

  try {
    boot();
  } catch (error) {
    console.error("ARCHCOIN B10 enhancement failed. Visible-first page remains active.", error);
  }
})();
