(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  function el(tag, className, parent, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }

  function css(node, styles) {
    Object.assign(node.style, styles);
  }

  function money(value) {
    return `$${Number(value).toLocaleString()}`;
  }

  class ProductsPlanetRuntime {
    constructor(options) {
      this.stage = options.stage || options.mount || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.contract = options.contract || "PRODUCTS_HOST_CONTRACT_V1";
      this.receipts = options.receipts || null;
      this.reducedMotion = !!options.reducedMotion;
      this.cleanup = [];
      this.activeKey = "archcoin";
      this.nodes = {};
      this.products = {
        archcoin: {
          eyebrow: "Primary product",
          title: "ARCHCOIN",
          subtitle: "Value-bearing coin surface",
          body:
            "ARCHCOIN is the coin-layer product expression. It is the visible financial object, the brand anchor, and the value-facing surface that people can recognize immediately.",
          price: "Core asset",
          signal: "Public-facing",
          bullets: [
            "Coin-first presentation",
            "Value and identity surface",
            "Brand-recognition anchor"
          ],
          accent: "#f1d28d"
        },
        aai: {
          eyebrow: "Primary product",
          title: "AAI",
          subtitle: "Artificial Agent Intelligence",
          body:
            "AAI is the intelligence-layer product expression. It should read as a real product, not an abstract theory object. It is the system mind, behavior layer, and operational intelligence surface.",
          price: "Intelligence layer",
          signal: "System-facing",
          bullets: [
            "Agent intelligence surface",
            "Operational behavior layer",
            "Deployable intelligence identity"
          ],
          accent: "#8ff0c5"
        },
        runtime: {
          eyebrow: "Supporting product",
          title: "Runtime Systems",
          subtitle: "Live product delivery surfaces",
          body:
            "Runtime Systems convert structure into live public-facing experiences. This is the delivery layer that turns stable code into working pages and usable product presence.",
          price: money(24000),
          signal: "Delivery layer",
          bullets: [
            "Mounted live surfaces",
            "Interactive runtime delivery",
            "Page-state continuity"
          ],
          accent: "#9fc6ff"
        },
        instrumentation: {
          eyebrow: "Supporting product",
          title: "Instrumentation",
          subtitle: "Audit and proof surfaces",
          body:
            "Instrumentation remains useful, but it is now subordinate. It supports product truth under the hood and no longer gets to dominate the public products page.",
          price: money(15000),
          signal: "Support layer",
          bullets: [
            "Break isolation",
            "Truth verification",
            "Under-the-hood support"
          ],
          accent: "#ffca80"
        }
      };
    }

    write(level, text) {
      if (this.receipts && typeof this.receipts.write === "function") {
        this.receipts.write(level, text);
      }
    }

    destroy() {
      this.cleanup.forEach((fn) => {
        try {
          fn();
        } catch (_) {}
      });
      this.cleanup = [];
      if (this.mount) {
        this.mount.innerHTML = "";
        this.mount.removeAttribute("data-runtime");
      }
    }

    mountRuntime() {
      if (!this.mount) {
        throw new Error("mount target missing");
      }

      this.mount.innerHTML = "";
      this.mount.setAttribute("data-runtime", "products-runtime-expression-v1");

      css(this.mount, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        pointerEvents: "auto"
      });

      const root = el("div", "products-expression-root", this.mount);
      css(root, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        padding: "24px",
        color: "#edf5ff",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: [
          "radial-gradient(circle at 20% 18%, rgba(58,103,188,0.20), transparent 22%)",
          "radial-gradient(circle at 82% 18%, rgba(241,210,141,0.10), transparent 18%)",
          "radial-gradient(circle at 50% 88%, rgba(9,64,110,0.18), transparent 24%)",
          "linear-gradient(180deg, rgba(4,13,32,0.26), rgba(4,13,32,0.06))"
        ].join(",")
      });

      const stars = el("div", "", root);
      css(stars, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        opacity: "0.9",
        backgroundImage: [
          "radial-gradient(2px 2px at 10% 20%, rgba(255,255,255,0.95) 40%, transparent 55%)",
          "radial-gradient(1.5px 1.5px at 24% 72%, rgba(255,255,255,0.82) 40%, transparent 55%)",
          "radial-gradient(2px 2px at 51% 32%, rgba(255,255,255,0.78) 40%, transparent 55%)",
          "radial-gradient(2px 2px at 70% 24%, rgba(255,255,255,0.88) 40%, transparent 55%)",
          "radial-gradient(1.5px 1.5px at 84% 66%, rgba(255,255,255,0.84) 40%, transparent 55%)"
        ].join(",")
      });

      const shell = el("div", "", root);
      css(shell, {
        position: "relative",
        zIndex: "1",
        maxWidth: "1120px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 960 ? "1fr" : "1.1fr 0.9fr",
        gap: "18px"
      });

      const handleResize = () => {
        shell.style.gridTemplateColumns =
          window.innerWidth <= 960 ? "1fr" : "1.1fr 0.9fr";
      };
      window.addEventListener("resize", handleResize);
      this.cleanup.push(() => window.removeEventListener("resize", handleResize));

      const hero = el("section", "", shell);
      css(hero, {
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
        borderRadius: "30px",
        border: "1px solid rgba(173,212,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.68), rgba(10,20,46,0.34))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.34)"
      });

      const heroOverlay = el("div", "", hero);
      css(heroOverlay, {
        position: "absolute",
        inset: "0",
        background:
          "linear-gradient(90deg, rgba(4,13,32,0.05), rgba(4,13,32,0.28) 35%, rgba(4,13,32,0.74) 72%, rgba(4,13,32,0.88))",
        pointerEvents: "none"
      });

      const visualField = el("div", "", hero);
      css(visualField, {
        position: "absolute",
        left: window.innerWidth <= 960 ? "50%" : "25%",
        top: window.innerWidth <= 960 ? "28%" : "50%",
        transform: "translate(-50%, -50%)",
        width: window.innerWidth <= 960 ? "240px" : "360px",
        height: window.innerWidth <= 960 ? "240px" : "360px",
        pointerEvents: "none"
      });

      const orbitRing = el("div", "", visualField);
      css(orbitRing, {
        position: "absolute",
        inset: "0",
        borderRadius: "999px",
        border: "1px solid rgba(173,212,255,0.10)",
        boxShadow:
          "0 0 0 24px rgba(173,212,255,0.02), 0 0 0 48px rgba(173,212,255,0.012)"
      });

      const coin = el("div", "", visualField);
      css(coin, {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: window.innerWidth <= 960 ? "132px" : "176px",
        height: window.innerWidth <= 960 ? "132px" : "176px",
        transform: "translate(-50%, -50%)",
        borderRadius: "999px",
        background: [
          "radial-gradient(circle at 30% 28%, rgba(255,245,214,0.92), transparent 18%)",
          "linear-gradient(145deg, #f7e3a8, #d5a84f 55%, #9e6f1d)"
        ].join(","),
        border: "1px solid rgba(255,232,170,0.40)",
        boxShadow:
          "0 18px 48px rgba(0,0,0,0.42), inset 0 0 30px rgba(255,255,255,0.18)"
      });

      const coinInner = el("div", "", coin);
      css(coinInner, {
        position: "absolute",
        inset: "14px",
        borderRadius: "999px",
        border: "1px solid rgba(255,247,220,0.34)",
        display: "grid",
        placeItems: "center",
        color: "#1e1505",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: "700",
        fontSize: window.innerWidth <= 960 ? "1.1rem" : "1.35rem",
        letterSpacing: ".04em",
        textAlign: "center",
        lineHeight: "1"
      });
      coinInner.innerHTML = "ARCH<br>COIN";

      const aaiBadge = el("div", "", visualField);
      css(aaiBadge, {
        position: "absolute",
        right: window.innerWidth <= 960 ? "16px" : "24px",
        bottom: window.innerWidth <= 960 ? "18px" : "34px",
        width: window.innerWidth <= 960 ? "96px" : "118px",
        height: window.innerWidth <= 960 ? "96px" : "118px",
        transform: "rotate(45deg)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(18,54,66,0.96), rgba(10,28,34,0.90))",
        border: "1px solid rgba(143,240,197,0.28)",
        boxShadow:
          "0 18px 44px rgba(0,0,0,0.36), inset 0 0 26px rgba(255,255,255,0.04)"
      });

      const aaiBadgeInner = el("div", "", aaiBadge);
      css(aaiBadgeInner, {
        position: "absolute",
        inset: "14px",
        borderRadius: "18px",
        border: "1px solid rgba(143,240,197,0.20)",
        transform: "rotate(-45deg)",
        display: "grid",
        placeItems: "center",
        color: "#8ff0c5",
        fontWeight: "800",
        fontSize: window.innerWidth <= 960 ? "1rem" : "1.1rem",
        letterSpacing: ".10em"
      });
      aaiBadgeInner.textContent = "AAI";

      const panel = el("div", "", hero);
      css(panel, {
        position: "relative",
        zIndex: "1",
        minHeight: "560px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch"
      });

      const card = el("div", "", panel);
      css(card, {
        width: "min(520px,100%)",
        margin: "22px",
        padding: "24px",
        borderRadius: "28px",
        border: "1px solid rgba(173,212,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.90), rgba(10,20,46,0.74))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
        backdropFilter: "blur(8px)"
      });

      const eyebrow = el("div", "", card);
      css(eyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".78rem",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        marginBottom: "12px"
      });

      const title = el("h2", "", card);
      css(title, {
        margin: "0 0 10px",
        color: "#edf5ff",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "clamp(2rem,4.6vw,3.8rem)",
        lineHeight: ".95"
      });

      const subtitle = el("div", "", card);
      css(subtitle, {
        marginBottom: "14px",
        color: "#9fc6ff",
        fontWeight: "700",
        fontSize: "1rem",
        letterSpacing: ".04em"
      });

      const body = el("p", "", card);
      css(body, {
        margin: "0 0 18px",
        color: "#9fb2d2",
        fontSize: "1rem",
        lineHeight: "1.72"
      });

      const metaGrid = el("div", "", card);
      css(metaGrid, {
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 560 ? "1fr" : "repeat(3,minmax(0,1fr))",
        gap: "12px",
        marginBottom: "18px"
      });

      const resizeMeta = () => {
        metaGrid.style.gridTemplateColumns =
          window.innerWidth <= 560 ? "1fr" : "repeat(3,minmax(0,1fr))";
        visualField.style.left = window.innerWidth <= 960 ? "50%" : "25%";
        visualField.style.top = window.innerWidth <= 960 ? "28%" : "50%";
        visualField.style.width = window.innerWidth <= 960 ? "240px" : "360px";
        visualField.style.height = window.innerWidth <= 960 ? "240px" : "360px";
        coin.style.width = window.innerWidth <= 960 ? "132px" : "176px";
        coin.style.height = window.innerWidth <= 960 ? "132px" : "176px";
        coinInner.style.fontSize = window.innerWidth <= 960 ? "1.1rem" : "1.35rem";
        aaiBadge.style.width = window.innerWidth <= 960 ? "96px" : "118px";
        aaiBadge.style.height = window.innerWidth <= 960 ? "96px" : "118px";
        aaiBadgeInner.style.fontSize = window.innerWidth <= 960 ? "1rem" : "1.1rem";
      };
      window.addEventListener("resize", resizeMeta);
      this.cleanup.push(() => window.removeEventListener("resize", resizeMeta));

      const metaCard = (label) => {
        const wrap = el("div", "", metaGrid);
        css(wrap, {
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "18px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          padding: "14px"
        });
        const k = el("div", "", wrap, label);
        css(k, {
          marginBottom: "8px",
          color: "#9fb2d2",
          fontWeight: "700",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase"
        });
        const v = el("div", "", wrap);
        css(v, {
          color: "#8ff0c5",
          fontWeight: "800",
          fontSize: "1rem",
          lineHeight: "1.4"
        });
        return v;
      };

      const signalValue = metaCard("Signal");
      const priceValue = metaCard("Value");
      const classValue = metaCard("Class");

      const bulletsTitle = el("div", "", card, "Included lanes");
      css(bulletsTitle, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".76rem",
        letterSpacing: ".12em",
        textTransform: "uppercase",
        marginBottom: "12px"
      });

      const bullets = el("div", "", card);
      css(bullets, { display: "grid", gap: "10px" });

      const side = el("section", "", shell);
      css(side, {
        display: "grid",
        gap: "14px",
        alignContent: "start"
      });

      const sideHeader = el("div", "", side);
      css(sideHeader, {
        border: "1px solid rgba(173,212,255,0.14)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.82), rgba(10,20,46,0.62))",
        padding: "18px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.28)"
      });

      const sideEyebrow = el("div", "", sideHeader, "Products");
      css(sideEyebrow, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".76rem",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        marginBottom: "8px"
      });

      const sideTitle = el("div", "", sideHeader, "Real product surfaces");
      css(sideTitle, {
        color: "#edf5ff",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "1.65rem",
        lineHeight: "1.1",
        marginBottom: "8px"
      });

      const sideCopy = el(
        "div",
        "",
        sideHeader,
        "ARCHCOIN and AAI are now treated as the actual product objects. Supporting systems remain available, but they no longer own the page."
      );
      css(sideCopy, {
        color: "#9fb2d2",
        fontSize: ".96rem",
        lineHeight: "1.65"
      });

      const rail = el("div", "", side);
      css(rail, {
        display: "grid",
        gap: "12px"
      });

      const buttons = Object.keys(this.products).map((key) => {
        const item = this.products[key];
        const button = el("button", "", rail);
        button.type = "button";
        css(button, {
          width: "100%",
          textAlign: "left",
          border: "1px solid rgba(173,212,255,0.12)",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03))",
          padding: "16px",
          color: "#edf5ff",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(0,0,0,0.22)"
        });

        const onClick = () => this.activate(key);
        button.addEventListener("click", onClick);
        this.cleanup.push(() => button.removeEventListener("click", onClick));

        const b1 = el("div", "", button, item.eyebrow);
        css(b1, {
          color: item.accent,
          fontWeight: "800",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          marginBottom: "8px"
        });

        const b2 = el("div", "", button, item.title);
        css(b2, {
          fontSize: "1.18rem",
          fontWeight: "800",
          lineHeight: "1.2",
          marginBottom: "8px"
        });

        const b3 = el("div", "", button, item.subtitle);
        css(b3, {
          color: "#9fb2d2",
          fontSize: ".92rem",
          lineHeight: "1.5",
          marginBottom: "12px"
        });

        const meta = el("div", "", button);
        css(meta, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap"
        });

        const m1 = el("div", "", meta, item.signal);
        css(m1, {
          color: "#8ff0c5",
          fontWeight: "700",
          fontSize: ".9rem"
        });

        const m2 = el("div", "", meta, item.price);
        css(m2, {
          color: "#edf5ff",
          fontWeight: "800",
          fontSize: ".94rem"
        });

        return { key, button };
      });

      const footer = el("div", "", root);
      css(footer, {
        position: "relative",
        zIndex: "1",
        maxWidth: "1120px",
        margin: "18px auto 0",
        border: "1px solid rgba(173,212,255,0.12)",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg, rgba(9,18,40,0.78), rgba(10,20,46,0.58))",
        padding: "18px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.22)"
      });

      const footerTop = el("div", "", footer);
      css(footerTop, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "10px"
      });

      const footerA = el("div", "", footerTop, "Runtime status: product expression active");
      css(footerA, {
        color: "#f1d28d",
        fontWeight: "800",
        fontSize: ".78rem",
        letterSpacing: ".10em",
        textTransform: "uppercase"
      });

      const footerB = el("div", "", footerTop, this.contract);
      css(footerB, {
        color: "#8ff0c5",
        fontWeight: "800",
        fontSize: ".84rem"
      });

      const footerCopy = el(
        "div",
        "",
        footer,
        "The under-the-hood phase is complete. This stage now exists to express products, not to prove that the page can boot."
      );
      css(footerCopy, {
        color: "#9fb2d2",
        fontSize: ".95rem",
        lineHeight: "1.65"
      });

      this.nodes = {
        eyebrow,
        title,
        subtitle,
        body,
        signalValue,
        priceValue,
        classValue,
        bullets,
        buttons,
        coin,
        coinInner,
        aaiBadge,
        aaiBadgeInner
      };

      this.activate("archcoin");

      if (!this.reducedMotion) {
        let raf = 0;
        const tick = (time) => {
          const t = (time || 0) * 0.001;
          const coinSpin = Math.sin(t * 0.95) * 6;
          const badgeSpin = Math.sin(t * 0.72 + 0.8) * 8;

          this.nodes.coin.style.transform =
            `translate(-50%, -50%) rotate(${coinSpin}deg)`;
          this.nodes.aaiBadge.style.transform =
            `rotate(${45 + badgeSpin}deg)`;

          raf = window.requestAnimationFrame(tick);
        };
        raf = window.requestAnimationFrame(tick);
        this.cleanup.push(() => window.cancelAnimationFrame(raf));
      }

      this.write("good", "Products expression runtime entered.");
      this.write("good", "ARCHCOIN and AAI surface rendered.");
      this.write("good", "Product-first stage active.");
    }

    activate(key) {
      this.activeKey = this.products[key] ? key : "archcoin";
      const item = this.products[this.activeKey];

      this.nodes.eyebrow.textContent = item.eyebrow;
      this.nodes.title.textContent = item.title;
      this.nodes.subtitle.textContent = item.subtitle;
      this.nodes.body.textContent = item.body;
      this.nodes.signalValue.textContent = item.signal;
      this.nodes.priceValue.textContent = item.price;
      this.nodes.classValue.textContent = item.title;

      this.nodes.bullets.innerHTML = "";
      item.bullets.forEach((bullet) => {
        const row = el("div", "", this.nodes.bullets);
        css(row, {
          display: "grid",
          gridTemplateColumns: "12px minmax(0,1fr)",
          gap: "12px",
          alignItems: "start",
          padding: "12px 14px",
          borderRadius: "16px",
          border: "1px solid rgba(173,212,255,0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))"
        });

        const dot = el("span", "", row);
        css(dot, {
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          marginTop: "6px",
          background: item.accent,
          boxShadow: `0 0 0 4px ${item.accent}22`
        });

        const text = el("div", "", row, bullet);
        css(text, {
          color: "#edf5ff",
          lineHeight: "1.55",
          fontSize: ".95rem"
        });
      });

      this.nodes.buttons.forEach(({ key: buttonKey, button }) => {
        const active = buttonKey === this.activeKey;
        button.style.transform = active ? "translateY(-2px)" : "translateY(0)";
        button.style.borderColor = active
          ? "rgba(241,210,141,0.28)"
          : "rgba(173,212,255,0.12)";
        button.style.boxShadow = active
          ? "0 18px 42px rgba(0,0,0,0.30)"
          : "0 12px 30px rgba(0,0,0,0.22)";
      });

      if (this.activeKey === "archcoin") {
        this.nodes.coin.style.opacity = "1";
        this.nodes.coin.style.filter = "saturate(1.08)";
        this.nodes.aaiBadge.style.opacity = "0.62";
      } else if (this.activeKey === "aai") {
        this.nodes.coin.style.opacity = "0.72";
        this.nodes.coin.style.filter = "saturate(0.82)";
        this.nodes.aaiBadge.style.opacity = "1";
      } else {
        this.nodes.coin.style.opacity = "0.86";
        this.nodes.coin.style.filter = "saturate(0.92)";
        this.nodes.aaiBadge.style.opacity = "0.86";
      }
    }
  }

  window[GLOBAL_KEY] = {
    create(options) {
      const runtime = new ProductsPlanetRuntime(options || {});
      runtime.mountRuntime();
      return runtime;
    }
  };
})();
