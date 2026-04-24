(() => {
  const DOOR_RUNTIME_ID = "root-door-detail-runtime-v1";
  const STYLE_ID = "root-door-detail-runtime-style";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-shell {
        cursor: pointer;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-shell.is-awake {
        box-shadow:
          inset 0 0 56px rgba(126,164,255,.16),
          inset 0 -28px 70px rgba(0,0,0,.34),
          0 0 46px rgba(92,184,255,.14);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-aura {
        position: absolute;
        inset: 8%;
        border-radius: 50% 50% 8% 8% / 34% 34% 8% 8%;
        pointer-events: none;
        z-index: 1;
        background:
          radial-gradient(circle at 50% 18%, rgba(116,190,255,.24), transparent 18%),
          radial-gradient(circle at 50% 44%, rgba(92,184,255,.18), transparent 32%),
          linear-gradient(180deg, transparent, rgba(92,184,255,.05), transparent);
        filter: blur(2px);
        opacity: .64;
        animation: doorAuraBreath 6.8s ease-in-out infinite;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-starfield {
        position: absolute;
        inset: 7% 9% 13%;
        border-radius: 50% 50% 10% 10% / 28% 28% 10% 10%;
        pointer-events: none;
        z-index: 3;
        opacity: .42;
        background:
          radial-gradient(circle at 18% 22%, rgba(255,255,255,.68) 0 1px, transparent 1.5px),
          radial-gradient(circle at 72% 18%, rgba(255,255,255,.42) 0 1px, transparent 1.5px),
          radial-gradient(circle at 62% 72%, rgba(255,255,255,.32) 0 1px, transparent 1.5px),
          radial-gradient(circle at 28% 78%, rgba(255,255,255,.40) 0 1px, transparent 1.5px);
        background-size: 130px 130px, 170px 170px, 220px 220px, 260px 260px;
        animation: doorStarsDrift 18s linear infinite;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-energy-ring {
        position: absolute;
        left: 50%;
        top: 42%;
        width: 230px;
        height: 230px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 6;
        border: 1px solid rgba(92,184,255,.22);
        box-shadow:
          0 0 22px rgba(92,184,255,.12),
          inset 0 0 30px rgba(92,184,255,.08);
        opacity: .72;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-energy-ring::before,
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-energy-ring::after {
        content: "";
        position: absolute;
        inset: 18%;
        border-radius: 50%;
        border: 1px solid rgba(239,210,154,.22);
        transform: rotate(18deg);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-energy-ring::after {
        inset: 34%;
        border-color: rgba(92,184,255,.28);
        transform: rotate(-28deg);
        box-shadow: 0 0 20px rgba(92,184,255,.14);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil {
        position: absolute;
        left: 50%;
        top: 42%;
        width: 280px;
        height: 280px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 6;
        opacity: .72;
        animation: doorSigilRotate 36s linear infinite;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 48%;
        height: 1px;
        transform-origin: 0 50%;
        background: linear-gradient(90deg, rgba(239,210,154,.42), transparent);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(1) { transform: rotate(0deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(2) { transform: rotate(45deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(3) { transform: rotate(90deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(4) { transform: rotate(135deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(5) { transform: rotate(180deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(6) { transform: rotate(225deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(7) { transform: rotate(270deg); }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil span:nth-child(8) { transform: rotate(315deg); }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-blue-rim {
        position: absolute;
        left: 50%;
        top: 7%;
        width: 82%;
        height: 87%;
        transform: translateX(-50%);
        border-radius: 50% 50% 8% 8% / 34% 34% 8% 8%;
        pointer-events: none;
        z-index: 4;
        border: 1px solid rgba(92,184,255,.28);
        box-shadow:
          inset 0 0 18px rgba(92,184,255,.12),
          0 0 18px rgba(92,184,255,.10);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-gold-rim {
        position: absolute;
        left: 50%;
        top: 12%;
        width: 70%;
        height: 78%;
        transform: translateX(-50%);
        border-radius: 50% 50% 10% 10% / 30% 30% 10% 10%;
        pointer-events: none;
        z-index: 4;
        border: 1px solid rgba(239,210,154,.32);
        box-shadow:
          inset 0 0 16px rgba(239,210,154,.08),
          0 0 14px rgba(239,210,154,.08);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-lights {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 11;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light {
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(239,210,154,.92);
        box-shadow:
          0 0 8px rgba(239,210,154,.55),
          0 0 22px rgba(92,184,255,.22);
        opacity: .72;
        animation: doorLightPulse 4.2s ease-in-out infinite;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(1) { left: 18%; bottom: 13%; animation-delay: .1s; }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(2) { left: 34%; bottom: 9%; animation-delay: .5s; }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(3) { right: 34%; bottom: 9%; animation-delay: .9s; }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(4) { right: 18%; bottom: 13%; animation-delay: 1.3s; }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(5) { left: 13%; top: 52%; animation-delay: 1.7s; }
      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light:nth-child(6) { right: 13%; top: 52%; animation-delay: 2.1s; }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-seam-glow {
        position: absolute;
        left: 50%;
        top: 22%;
        bottom: 15%;
        width: 2px;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 12;
        background: linear-gradient(180deg, transparent, rgba(174,214,255,.76), rgba(239,210,154,.24), transparent);
        box-shadow: 0 0 18px rgba(92,184,255,.36);
        opacity: .64;
        animation: doorSeamPulse 5.4s ease-in-out infinite;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-open-glow {
        position: absolute;
        left: 50%;
        top: 42%;
        width: 150px;
        height: 150px;
        transform: translate(-50%, -50%) scale(.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 13;
        background: radial-gradient(circle, rgba(255,255,255,.88), rgba(92,184,255,.22) 30%, transparent 68%);
        opacity: 0;
        transition: opacity .5s ease, transform .5s ease;
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-shell.is-open .door-open-glow {
        opacity: .82;
        transform: translate(-50%, -50%) scale(1.18);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-shell.is-open .door-panel {
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.035),
          inset 0 0 58px rgba(76,132,230,.18),
          0 0 46px rgba(92,184,255,.20);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-shell.is-open .door-label {
        box-shadow:
          0 0 44px rgba(97,154,255,.34),
          0 0 82px rgba(239,210,154,.12);
      }

      [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-detail-chip {
        position: absolute;
        left: 50%;
        top: 15%;
        transform: translateX(-50%);
        min-width: 180px;
        max-width: calc(100% - 48px);
        padding: 10px 16px;
        border-radius: 999px;
        border: 1px solid rgba(239,210,154,.24);
        background: rgba(6,14,28,.72);
        color: #dbe5ff;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: .13em;
        font-size: .66rem;
        line-height: 1.35;
        pointer-events: none;
        z-index: 14;
        box-shadow: 0 12px 30px rgba(0,0,0,.26);
      }

      @keyframes doorAuraBreath {
        0%,100% { opacity: .46; transform: scale(.985); }
        50% { opacity: .82; transform: scale(1.015); }
      }

      @keyframes doorStarsDrift {
        0% { background-position: 0 0, 0 0, 0 0, 0 0; }
        100% { background-position: 130px 130px, -170px 170px, 220px -220px, -260px -260px; }
      }

      @keyframes doorSigilRotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes doorLightPulse {
        0%,100% { opacity: .42; transform: scale(.84); }
        50% { opacity: 1; transform: scale(1.15); }
      }

      @keyframes doorSeamPulse {
        0%,100% { opacity: .38; }
        50% { opacity: .88; }
      }

      @media (max-width: 720px) {
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-energy-ring {
          width: 176px;
          height: 176px;
        }

        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil {
          width: 218px;
          height: 218px;
        }

        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-detail-chip {
          top: 14%;
          font-size: .56rem;
          padding: 9px 12px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-aura,
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-starfield,
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-sigil,
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-light,
        [data-door-runtime="${DOOR_RUNTIME_ID}"] .door-seam-glow {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createElement(className, children = []) {
    const node = document.createElement("div");
    node.className = className;

    children.forEach((child) => {
      if (typeof child === "string") {
        const span = document.createElement("span");
        span.textContent = child;
        node.appendChild(span);
      } else {
        node.appendChild(child);
      }
    });

    return node;
  }

  function createSigil() {
    const sigil = createElement("door-sigil");
    for (let i = 0; i < 8; i += 1) {
      sigil.appendChild(document.createElement("span"));
    }
    return sigil;
  }

  function createLights() {
    const lights = createElement("door-lights");
    for (let i = 0; i < 6; i += 1) {
      lights.appendChild(createElement("door-light"));
    }
    return lights;
  }

  function enhanceDoor() {
    const doorShell = document.querySelector(".door-shell");
    if (!doorShell || doorShell.dataset.detailRuntime === DOOR_RUNTIME_ID) return;

    doorShell.dataset.detailRuntime = DOOR_RUNTIME_ID;
    doorShell.classList.add("is-awake");

    const root = document.querySelector(".page") || document.body;
    root.setAttribute("data-door-runtime", DOOR_RUNTIME_ID);

    doorShell.prepend(createElement("door-aura"));
    doorShell.appendChild(createElement("door-starfield"));
    doorShell.appendChild(createElement("door-blue-rim"));
    doorShell.appendChild(createElement("door-gold-rim"));
    doorShell.appendChild(createElement("door-energy-ring"));
    doorShell.appendChild(createSigil());
    doorShell.appendChild(createLights());
    doorShell.appendChild(createElement("door-seam-glow"));
    doorShell.appendChild(createElement("door-open-glow"));

    const chip = createElement("door-detail-chip");
    chip.textContent = "Extravagant root gate · live detail layer";
    doorShell.appendChild(chip);

    doorShell.addEventListener("click", () => {
      doorShell.classList.toggle("is-open");
    });

    doorShell.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      doorShell.classList.toggle("is-open");
    });

    doorShell.setAttribute("tabindex", "0");
    doorShell.setAttribute("role", "button");
    doorShell.setAttribute("aria-label", "Activate the Diamond Gate Bridge door detail layer");
  }

  function bindGateButton() {
    const gateButton = document.querySelector('a[href="#door"]');
    const doorShell = document.querySelector(".door-shell");

    if (!gateButton || !doorShell) return;

    gateButton.addEventListener("click", (event) => {
      event.preventDefault();

      const target = document.getElementById("door") || doorShell;
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });

      window.setTimeout(() => {
        doorShell.classList.add("is-open");
        doorShell.focus({ preventScroll: true });
      }, 420);
    });
  }

  function boot() {
    injectStyle();
    enhanceDoor();
    bindGateButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
