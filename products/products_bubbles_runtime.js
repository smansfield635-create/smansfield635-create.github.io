(() => {
  const GLOBAL_KEY = "ProductsBubblesRuntime";

  const LANE_DATA = [
    { title: "Platform", kicker: "Core", href: "/platform/", status: "Live", purpose: "Core platform lane tying host law, structure, and runtime into an actionable surface." },
    { title: "Software", kicker: "Runtime", href: "/software/", status: "Route", purpose: "Software-facing surface for runtime, implementation, and controlled productized tools." },
    { title: "On Your Side AI", kicker: "Intelligence", href: "/ai/", status: "Route", purpose: "Intelligence product line anchored in clarity, safety, and user-side structure." },
    { title: "Syntax", kicker: "Language", href: "/ssg/", status: "Route", purpose: "Behavioral syntax and execution-language surface for governed systems." },
    { title: "ArchCoin", kicker: "Value", href: "/archcoin/", status: "Route", purpose: "Coin-facing lane for governed value architecture and later vault alignment." },
    { title: "Nutrition", kicker: "Baseline", href: "/nutrition/", status: "Route", purpose: "Baseline system lane for nourishment, correction, and applied human support." },
    { title: "Energy", kicker: "Output", href: "/energy/", status: "Route", purpose: "System-output lane for measurable movement, recovery, and usable capacity." },
    { title: "Education", kicker: "Learning", href: "/education/", status: "Route", purpose: "Language systems and learning surfaces under coherent explanatory structure." },
    { title: "Games", kicker: "Playable", href: "/games/", status: "Route", purpose: "Five Flags and related playable systems under bounded public expression." },
    { title: "Agriculture", kicker: "Applied", href: "/agriculture/", status: "Route", purpose: "Applied growth lane for cultivation, yield, continuity, and material support." },
    { title: "Domains", kicker: "Identity", href: "/domains/", status: "Route", purpose: "Identity and routing lane for naming, structure, continuity, and surface ownership." },
    { title: "Diagnostics", kicker: "Measurement", href: "/diagnostics/", status: "Route", purpose: "Coherence measurement lane for thresholds, tracking, receipt, and system readback." }
  ];

  function setStyles(node, styles) {
    Object.assign(node.style, styles);
  }

  function createElement(tag, className, parent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (parent) parent.appendChild(el);
    return el;
  }

  class ProductsBubblesRuntime {
    constructor(options) {
      this.mount = options.mount;
      this.reducedMotion = !!options.reducedMotion;
      this.mobileQuery = options.mobileQuery;
      this.cards = [];
      this.openPrimary = null;
      this.openDeep = null;
      this.destroyed = false;
      this.handleResize = this.handleResize.bind(this);
    }

    mountRuntime() {
      this.mount.innerHTML = "";
      this.buildShell();
      this.buildCards();
      this.applyMode();
      window.addEventListener("resize", this.handleResize, { passive: true });
    }

    buildShell() {
      this.root = createElement("div", "products-bubbles-root", this.mount);
      setStyles(this.root, {
        position: "relative",
        minHeight: "inherit",
        padding: this.isMobile() ? "18px" : "26px",
        display: "grid",
        gridTemplateColumns: this.isMobile() ? "1fr" : "repeat(4, minmax(0, 1fr))",
        gap: this.isMobile() ? "14px" : "16px",
        alignItems: "start"
      });
    }

    buildCards() {
      LANE_DATA.forEach((lane, index) => {
        const card = createElement("section", "products-bubble-card", this.root);
        card.setAttribute("data-index", String(index));
        card.setAttribute("data-open", "false");
        card.setAttribute("data-deep-open", "false");

        setStyles(card, {
          position: "relative",
          minHeight: "108px",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: [
            "radial-gradient(circle at 30% 20%, rgba(124,166,255,0.18), transparent 36%)",
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))"
          ].join(","),
          boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
          overflow: "hidden",
          transition: this.reducedMotion ? "none" : "height 220ms ease, border-color 180ms ease, transform 180ms ease"
        });

        const primary = createElement("button", "products-bubble-primary", card);
        primary.type = "button";
        primary.setAttribute("aria-expanded", "false");

        setStyles(primary, {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "18px 18px 16px",
          background: "transparent",
          border: "0",
          color: "#f5f7ff",
          cursor: "pointer",
          textAlign: "left"
        });

        const primaryText = createElement("div", "products-bubble-primary-text", primary);

        const kicker = createElement("div", "products-bubble-kicker", primaryText);
        kicker.textContent = lane.kicker;
        setStyles(kicker, {
          fontSize: "0.66rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(245,247,255,0.58)",
          marginBottom: "6px"
        });

        const title = createElement("strong", "products-bubble-title", primaryText);
        title.textContent = lane.title;
        setStyles(title, {
          display: "block",
          fontSize: this.isMobile() ? "1rem" : "1.04rem",
          lineHeight: "1.15",
          letterSpacing: "-0.02em"
        });

        const status = createElement("span", "products-bubble-status", primary);
        status.textContent = lane.status;
        setStyles(status, {
          flex: "0 0 auto",
          padding: "8px 10px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(245,247,255,0.76)",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase"
        });

        const content = createElement("div", "products-bubble-content", card);
        setStyles(content, {
          padding: "0 18px 18px",
          display: "none"
        });

        const purpose = createElement("p", "products-bubble-purpose", content);
        purpose.textContent = lane.purpose;
        setStyles(purpose, {
          margin: "0 0 14px",
          color: "rgba(245,247,255,0.78)",
          lineHeight: "1.6",
          fontSize: "0.92rem"
        });

        const actions = createElement("div", "products-bubble-actions", content);
        setStyles(actions, {
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "12px"
        });

        const deepButton = createElement("button", "products-bubble-deep-button", actions);
        deepButton.type = "button";
        deepButton.textContent = "Open deeper";
        setStyles(deepButton, {
          minHeight: "40px",
          padding: "0 14px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          color: "#f5f7ff",
          cursor: "pointer"
        });

        const openLink = createElement("a", "products-bubble-link", actions);
        openLink.href = lane.href;
        openLink.textContent = "Open lane";
        setStyles(openLink, {
          display: "inline-flex",
          alignItems: "center",
          minHeight: "40px",
          padding: "0 14px",
          borderRadius: "999px",
          border: "1px solid rgba(124,166,255,0.3)",
          background: "linear-gradient(135deg, rgba(124,166,255,0.22), rgba(111,255,219,0.12))",
          color: "#f5f7ff",
          fontWeight: "600"
        });

        const deep = createElement("div", "products-bubble-deep", content);
        setStyles(deep, {
          display: "none",
          gap: "10px",
          flexWrap: "wrap"
        });

        [
          { label: "Category", value: lane.kicker },
          { label: "Status", value: lane.status },
          { label: "Route", value: lane.href }
        ].forEach((item) => {
          const pill = createElement("span", "products-bubble-pill", deep);
          pill.textContent = `${item.label}: ${item.value}`;
          setStyles(pill, {
            display: "inline-flex",
            alignItems: "center",
            minHeight: "34px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(245,247,255,0.78)",
            fontSize: "0.78rem",
            overflowWrap: "anywhere",
            maxWidth: "100%"
          });
        });

        primary.addEventListener("click", () => this.togglePrimary(index));
        deepButton.addEventListener("click", () => this.toggleDeep(index));

        if (!this.reducedMotion) {
          card.addEventListener("mouseenter", () => {
            if (!this.isMobile()) {
              card.style.transform = "translateY(-2px)";
              card.style.borderColor = "rgba(124,166,255,0.28)";
            }
          });

          card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
            if (card.getAttribute("data-open") !== "true") {
              card.style.borderColor = "rgba(255,255,255,0.12)";
            }
          });
        }

        this.cards.push({ index, card, primary, content, deep, deepButton });
      });
    }

    isMobile() {
      return this.mobileQuery ? this.mobileQuery.matches : window.innerWidth <= 760;
    }

    closePrimary(index) {
      const card = this.cards[index];
      if (!card) return;
      card.card.setAttribute("data-open", "false");
      card.primary.setAttribute("aria-expanded", "false");
      card.content.style.display = "none";
      card.card.style.borderColor = "rgba(255,255,255,0.12)";
      if (this.openDeep === index) this.closeDeep(index);
      if (this.openPrimary === index) this.openPrimary = null;
    }

    openPrimaryCard(index) {
      const card = this.cards[index];
      if (!card) return;

      if (this.isMobile() || this.openPrimary !== null) {
        this.cards.forEach((_, i) => {
          if (i !== index) this.closePrimary(i);
        });
      }

      card.card.setAttribute("data-open", "true");
      card.primary.setAttribute("aria-expanded", "true");
      card.content.style.display = "block";
      card.card.style.borderColor = "rgba(124,166,255,0.28)";
      this.openPrimary = index;
    }

    togglePrimary(index) {
      const card = this.cards[index];
      if (!card) return;
      if (card.card.getAttribute("data-open") === "true") {
        this.closePrimary(index);
      } else {
        this.openPrimaryCard(index);
      }
    }

    closeDeep(index) {
      const card = this.cards[index];
      if (!card) return;
      card.card.setAttribute("data-deep-open", "false");
      card.deep.style.display = "none";
      card.deepButton.textContent = "Open deeper";
      if (this.openDeep === index) this.openDeep = null;
    }

    openDeepCard(index) {
      const card = this.cards[index];
      if (!card) return;

      if (this.isMobile() || this.openDeep !== null) {
        this.cards.forEach((_, i) => {
          if (i !== index) this.closeDeep(i);
        });
      }

      if (card.card.getAttribute("data-open") !== "true") {
        this.openPrimaryCard(index);
      }

      card.card.setAttribute("data-deep-open", "true");
      card.deep.style.display = "flex";
      card.deepButton.textContent = "Close deeper";
      this.openDeep = index;
    }

    toggleDeep(index) {
      const card = this.cards[index];
      if (!card) return;
      if (card.card.getAttribute("data-deep-open") === "true") {
        this.closeDeep(index);
      } else {
        this.openDeepCard(index);
      }
    }

    applyMode() {
      setStyles(this.root, {
        gridTemplateColumns: this.isMobile() ? "1fr" : "repeat(4, minmax(0, 1fr))",
        padding: this.isMobile() ? "18px" : "26px",
        gap: this.isMobile() ? "14px" : "16px"
      });

      this.cards.forEach((card) => {
        setStyles(card.card, {
          minHeight: this.isMobile() ? "100px" : "108px"
        });
      });

      if (this.isMobile()) {
        let seenOpen = false;
        this.cards.forEach((card, index) => {
          if (card.card.getAttribute("data-open") === "true") {
            if (seenOpen) {
              this.closePrimary(index);
            } else {
              seenOpen = true;
            }
          }
        });
      }
    }

    handleResize() {
      if (this.destroyed) return;
      this.applyMode();
    }

    destroy() {
      this.destroyed = true;
      window.removeEventListener("resize", this.handleResize);
      if (this.mount) this.mount.innerHTML = "";
      this.cards = [];
    }
  }

  window[GLOBAL_KEY] = {
    create(options) {
      const runtime = new ProductsBubblesRuntime(options);
      runtime.mountRuntime();
      return runtime;
    }
  };
})();
