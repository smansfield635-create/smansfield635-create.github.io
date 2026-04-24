(() => {
  'use strict';

  const STYLE_ID = 'dgb-root-door-generation-3-styles';

  const SELECTORS = {
    doorCard: [
      '[data-root-door]',
      '.root-door',
      '.door-root',
      '.root-entry-door',
      '.canonical-root-door',
      '.canonical-door',
      '.entry-door',
      '.door-panel',
      '.door-shell'
    ],
    doorCore: [
      '[data-door-core]',
      '.door-core',
      '.door-button',
      '.door-label',
      '.door-center',
      '.door-trigger',
      '.door-hit',
      '.door-plate'
    ],
    topGem: [
      '[data-door-gem="top"]',
      '.door-gem-top',
      '.door-top-gem',
      '.door-diamond-top'
    ],
    bottomGem: [
      '[data-door-gem="bottom"]',
      '.door-gem-bottom',
      '.door-bottom-gem',
      '.door-diamond-bottom'
    ]
  };

  function first(root, selectors) {
    for (const selector of selectors) {
      const node = root.querySelector(selector);
      if (node) return node;
    }
    return null;
  }

  function findDoorCard() {
    for (const selector of SELECTORS.doorCard) {
      const node = document.querySelector(selector);
      if (node) return node;
    }

    const fallback = Array.from(document.querySelectorAll('section, div, article')).find((node) => {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      return text.includes('DOOR') && text.includes('ENTRY');
    });

    return fallback || null;
  }

  function findDoorCore(doorCard) {
    let node = first(doorCard, SELECTORS.doorCore);
    if (node) return node;

    const exactDoorText = Array.from(doorCard.querySelectorAll('button, a, div, span')).find((candidate) => {
      const text = (candidate.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      return text === 'DOOR';
    });

    return exactDoorText || null;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .dgb-door-ready {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        --dgb-touch-x: 50%;
        --dgb-touch-y: 38%;
        --dgb-press-scale: 1;
        --dgb-core-glow: 0.38;
        --dgb-card-glow: 0.18;
        --dgb-ring-opacity: 0.14;
        --dgb-beam-opacity: 0.16;
        --dgb-spark-opacity: 0.18;
      }

      .dgb-door-layer,
      .dgb-door-energy,
      .dgb-door-aura,
      .dgb-door-orbit,
      .dgb-door-beams,
      .dgb-door-sparks,
      .dgb-door-hit {
        pointer-events: none;
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .dgb-door-energy {
        background:
          radial-gradient(circle at var(--dgb-touch-x) var(--dgb-touch-y),
            rgba(175, 220, 255, calc(0.34 + var(--dgb-card-glow))) 0%,
            rgba(125, 188, 255, calc(0.20 + var(--dgb-card-glow))) 10%,
            rgba(56, 112, 225, calc(0.10 + var(--dgb-card-glow))) 24%,
            rgba(10, 32, 82, 0) 58%
          );
        opacity: 0.95;
        mix-blend-mode: screen;
        transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease;
        transform: scale(1);
        filter: blur(0px);
      }

      .dgb-door-aura {
        background:
          radial-gradient(circle at 50% 50%,
            rgba(153, 214, 255, var(--dgb-ring-opacity)) 0%,
            rgba(103, 172, 255, calc(var(--dgb-ring-opacity) * 0.85)) 22%,
            rgba(62, 109, 212, calc(var(--dgb-ring-opacity) * 0.5)) 40%,
            rgba(0, 0, 0, 0) 72%
          );
        animation: dgb-door-breathe 5s ease-in-out infinite;
        opacity: 1;
      }

      .dgb-door-orbit::before,
      .dgb-door-orbit::after {
        content: '';
        position: absolute;
        inset: 12% 16%;
        border-radius: 999px;
        border: 1px solid rgba(182, 223, 255, 0.12);
        transform-origin: center;
        mix-blend-mode: screen;
      }

      .dgb-door-orbit::before {
        animation: dgb-door-orbit-1 16s linear infinite;
      }

      .dgb-door-orbit::after {
        inset: 19% 24%;
        animation: dgb-door-orbit-2 12s linear infinite reverse;
      }

      .dgb-door-beams {
        background:
          linear-gradient(180deg,
            rgba(175, 225, 255, 0) 0%,
            rgba(175, 225, 255, var(--dgb-beam-opacity)) 28%,
            rgba(175, 225, 255, calc(var(--dgb-beam-opacity) * 1.15)) 48%,
            rgba(175, 225, 255, var(--dgb-beam-opacity)) 58%,
            rgba(175, 225, 255, 0) 100%
          );
        mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%);
        -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%);
        opacity: 0.7;
        transition: opacity 220ms ease;
      }

      .dgb-door-sparks::before,
      .dgb-door-sparks::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 42%;
        width: 52%;
        height: 52%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background:
          conic-gradient(
            from 0deg,
            rgba(180, 225, 255, 0) 0deg,
            rgba(180, 225, 255, var(--dgb-spark-opacity)) 28deg,
            rgba(180, 225, 255, 0) 58deg,
            rgba(180, 225, 255, 0) 118deg,
            rgba(180, 225, 255, calc(var(--dgb-spark-opacity) * 0.85)) 152deg,
            rgba(180, 225, 255, 0) 182deg,
            rgba(180, 225, 255, 0) 240deg,
            rgba(180, 225, 255, calc(var(--dgb-spark-opacity) * 0.8)) 270deg,
            rgba(180, 225, 255, 0) 300deg,
            rgba(180, 225, 255, 0) 360deg
          );
        mix-blend-mode: screen;
        opacity: 0.9;
      }

      .dgb-door-sparks::before {
        animation: dgb-door-spin 10s linear infinite;
      }

      .dgb-door-sparks::after {
        width: 72%;
        height: 72%;
        animation: dgb-door-spin 16s linear infinite reverse;
      }

      .dgb-door-hit {
        background:
          radial-gradient(circle at var(--dgb-touch-x) var(--dgb-touch-y),
            rgba(245, 251, 255, 0.72) 0%,
            rgba(212, 238, 255, 0.42) 6%,
            rgba(119, 185, 255, 0.18) 12%,
            rgba(0, 0, 0, 0) 26%
          );
        opacity: 0;
        transform: scale(0.8);
      }

      .dgb-door-core {
        position: relative;
        z-index: 2;
        cursor: pointer;
        touch-action: manipulation;
        transform: translateZ(0) scale(var(--dgb-press-scale));
        transition:
          transform 140ms ease,
          filter 180ms ease,
          box-shadow 180ms ease,
          background 180ms ease,
          color 180ms ease;
        box-shadow:
          0 0 0 1px rgba(180, 220, 255, 0.12),
          0 0 16px rgba(35, 105, 215, 0.18),
          0 0 48px rgba(40, 95, 200, calc(0.18 + var(--dgb-core-glow)));
        filter:
          brightness(calc(1 + var(--dgb-core-glow) * 0.24))
          saturate(calc(1 + var(--dgb-core-glow) * 0.38));
      }

      .dgb-door-core::before {
        content: '';
        position: absolute;
        inset: -14%;
        border-radius: inherit;
        background:
          radial-gradient(circle at center,
            rgba(220, 241, 255, calc(0.16 + var(--dgb-core-glow))) 0%,
            rgba(120, 187, 255, calc(0.12 + var(--dgb-core-glow))) 34%,
            rgba(15, 42, 112, 0) 76%
          );
        z-index: -1;
        opacity: 0.95;
        transition: opacity 180ms ease, transform 180ms ease;
      }

      .dgb-door-core .dgb-door-core-label,
      .dgb-door-core-label {
        position: relative;
        z-index: 2;
        letter-spacing: 0.22em;
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.22),
          0 0 24px rgba(165, 219, 255, 0.20);
        transition: text-shadow 180ms ease, color 180ms ease;
      }

      .dgb-door-gem {
        position: relative;
        z-index: 2;
        transition:
          transform 180ms ease,
          filter 180ms ease,
          opacity 180ms ease,
          box-shadow 180ms ease;
        filter:
          brightness(1.05)
          saturate(1.05);
        box-shadow:
          0 0 14px rgba(95, 180, 255, 0.14),
          0 0 42px rgba(95, 180, 255, 0.08);
      }

      .dgb-door-ready.is-primed {
        --dgb-core-glow: 0.62;
        --dgb-card-glow: 0.24;
        --dgb-ring-opacity: 0.18;
        --dgb-beam-opacity: 0.22;
        --dgb-spark-opacity: 0.24;
      }

      .dgb-door-ready.is-pressed {
        --dgb-press-scale: 0.965;
        --dgb-core-glow: 0.88;
        --dgb-card-glow: 0.34;
        --dgb-ring-opacity: 0.24;
        --dgb-beam-opacity: 0.28;
        --dgb-spark-opacity: 0.34;
      }

      .dgb-door-ready.is-pressed .dgb-door-hit {
        opacity: 1;
        transform: scale(1.08);
        transition: opacity 90ms linear, transform 140ms ease;
      }

      .dgb-door-ready.is-energized {
        --dgb-core-glow: 1.18;
        --dgb-card-glow: 0.52;
        --dgb-ring-opacity: 0.32;
        --dgb-beam-opacity: 0.34;
        --dgb-spark-opacity: 0.42;
      }

      .dgb-door-ready.is-energized .dgb-door-energy {
        transform: scale(1.05);
        filter: saturate(1.2) brightness(1.08);
      }

      .dgb-door-ready.is-energized .dgb-door-hit {
        opacity: 1;
        transform: scale(1.24);
        transition:
          opacity 220ms ease,
          transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .dgb-door-ready.is-energized .dgb-door-core {
        box-shadow:
          0 0 0 1px rgba(218, 240, 255, 0.28),
          0 0 24px rgba(115, 200, 255, 0.42),
          0 0 64px rgba(45, 122, 255, 0.52),
          0 0 120px rgba(45, 122, 255, 0.28);
        filter: brightness(1.18) saturate(1.18);
      }

      .dgb-door-ready.is-energized .dgb-door-core::before {
        transform: scale(1.12);
      }

      .dgb-door-ready.is-energized .dgb-door-core .dgb-door-core-label,
      .dgb-door-ready.is-energized .dgb-door-core-label {
        text-shadow:
          0 0 10px rgba(255, 255, 255, 0.34),
          0 0 32px rgba(195, 232, 255, 0.34),
          0 0 66px rgba(120, 200, 255, 0.28);
      }

      .dgb-door-ready.is-energized .dgb-door-gem {
        filter: brightness(1.28) saturate(1.16);
        box-shadow:
          0 0 24px rgba(120, 200, 255, 0.32),
          0 0 64px rgba(120, 200, 255, 0.18);
        transform: translateZ(0) scale(1.04);
      }

      .dgb-door-ready.is-energized::after {
        content: '';
        position: absolute;
        inset: 16%;
        border-radius: 999px;
        border: 1px solid rgba(188, 226, 255, 0.22);
        box-shadow:
          0 0 0 1px rgba(160, 210, 255, 0.08) inset,
          0 0 24px rgba(85, 162, 255, 0.18);
        animation: dgb-door-shock 700ms ease-out 1;
        pointer-events: none;
        z-index: 1;
      }

      @keyframes dgb-door-breathe {
        0%, 100% {
          transform: scale(0.985);
          opacity: 0.92;
        }
        50% {
          transform: scale(1.02);
          opacity: 1;
        }
      }

      @keyframes dgb-door-orbit-1 {
        from { transform: rotate(0deg) scaleX(1); }
        to { transform: rotate(360deg) scaleX(1); }
      }

      @keyframes dgb-door-orbit-2 {
        from { transform: rotate(0deg) scaleX(0.78); }
        to { transform: rotate(360deg) scaleX(0.78); }
      }

      @keyframes dgb-door-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes dgb-door-shock {
        0% {
          opacity: 0.54;
          transform: scale(0.72);
        }
        100% {
          opacity: 0;
          transform: scale(1.3);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dgb-door-aura,
        .dgb-door-orbit::before,
        .dgb-door-orbit::after,
        .dgb-door-sparks::before,
        .dgb-door-sparks::after {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureLayer(doorCard, className) {
    let node = doorCard.querySelector(`:scope > .${className}`);
    if (!node) {
      node = document.createElement('div');
      node.className = className;
      doorCard.insertBefore(node, doorCard.firstChild);
    }
    return node;
  }

  function enhanceDoorMarkup(doorCard, doorCore) {
    doorCard.classList.add('dgb-door-ready');

    ensureLayer(doorCard, 'dgb-door-layer');
    ensureLayer(doorCard, 'dgb-door-energy');
    ensureLayer(doorCard, 'dgb-door-aura');
    ensureLayer(doorCard, 'dgb-door-orbit');
    ensureLayer(doorCard, 'dgb-door-beams');
    ensureLayer(doorCard, 'dgb-door-sparks');
    ensureLayer(doorCard, 'dgb-door-hit');

    doorCore.classList.add('dgb-door-core');

    const label = Array.from(doorCore.querySelectorAll('span, strong, div')).find((node) => {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      return text === 'DOOR';
    });

    if (label) {
      label.classList.add('dgb-door-core-label');
    } else {
      const text = (doorCore.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.toUpperCase() === 'DOOR') {
        const span = document.createElement('span');
        span.className = 'dgb-door-core-label';
        span.textContent = text;
        doorCore.textContent = '';
        doorCore.appendChild(span);
      }
    }

    const topGem = first(doorCard, SELECTORS.topGem);
    const bottomGem = first(doorCard, SELECTORS.bottomGem);

    if (topGem) topGem.classList.add('dgb-door-gem');
    if (bottomGem) bottomGem.classList.add('dgb-door-gem');
  }

  function setTouchPoint(doorCard, clientX, clientY) {
    const rect = doorCard.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    doorCard.style.setProperty('--dgb-touch-x', `${x}%`);
    doorCard.style.setProperty('--dgb-touch-y', `${y}%`);
  }

  function arm(doorCard) {
    doorCard.classList.add('is-primed');
  }

  function disarm(doorCard) {
    if (!doorCard.classList.contains('is-pressed') && !doorCard.classList.contains('is-energized')) {
      doorCard.classList.remove('is-primed');
    }
  }

  function press(doorCard) {
    doorCard.classList.add('is-pressed');
    doorCard.classList.add('is-primed');
  }

  function release(doorCard) {
    doorCard.classList.remove('is-pressed');
  }

  function energize(doorCard) {
    doorCard.classList.remove('is-pressed');
    doorCard.classList.add('is-energized');
    doorCard.classList.add('is-primed');

    window.clearTimeout(doorCard.__dgbEnergizeTimer);
    doorCard.__dgbEnergizeTimer = window.setTimeout(() => {
      doorCard.classList.remove('is-energized');
      doorCard.classList.remove('is-primed');
    }, 1300);
  }

  function wireDoor(doorCard, doorCore) {
    const updateFromEvent = (event) => {
      if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        setTouchPoint(doorCard, event.clientX, event.clientY);
      }
    };

    doorCard.addEventListener('pointerenter', (event) => {
      updateFromEvent(event);
      arm(doorCard);
    });

    doorCard.addEventListener('pointermove', updateFromEvent);

    doorCard.addEventListener('pointerleave', () => {
      if (!doorCard.classList.contains('is-pressed')) {
        disarm(doorCard);
      }
    });

    doorCore.addEventListener('pointerdown', (event) => {
      updateFromEvent(event);
      press(doorCard);
    });

    const finishPointer = (event) => {
      updateFromEvent(event);
      release(doorCard);
      energize(doorCard);
    };

    doorCore.addEventListener('pointerup', finishPointer);
    doorCore.addEventListener('click', (event) => {
      updateFromEvent(event);
      energize(doorCard);
    });

    doorCore.addEventListener('focus', () => arm(doorCard));
    doorCore.addEventListener('blur', () => {
      release(doorCard);
      disarm(doorCard);
    });

    doorCore.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        press(doorCard);
      }
    });

    doorCore.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        release(doorCard);
        energize(doorCard);
      }
    });

    doorCore.setAttribute('tabindex', doorCore.getAttribute('tabindex') || '0');
    doorCore.setAttribute('aria-label', doorCore.getAttribute('aria-label') || 'Open the door');
    doorCore.setAttribute('role', doorCore.getAttribute('role') || 'button');
  }

  function initRootDoorUpgrade() {
    ensureStyle();

    const doorCard = findDoorCard();
    if (!doorCard) {
      console.warn('[DGB] Root door card not found.');
      return;
    }

    const doorCore = findDoorCore(doorCard);
    if (!doorCore) {
      console.warn('[DGB] Door core not found.');
      return;
    }

    enhanceDoorMarkup(doorCard, doorCore);
    wireDoor(doorCard, doorCore);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRootDoorUpgrade, { once: true });
  } else {
    initRootDoorUpgrade();
  }
})();
