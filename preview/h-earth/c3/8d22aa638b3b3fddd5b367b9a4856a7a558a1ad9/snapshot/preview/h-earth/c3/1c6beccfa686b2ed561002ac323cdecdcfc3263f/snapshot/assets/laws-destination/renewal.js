/* LAWS_COMPLETE_RENEWAL_INTERACTION_ENGINE_v3 */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('lr-js');

  const navigationStylesheet = '/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1';
  if (!document.querySelector(`link[href^="${navigationStylesheet.split('?')[0]}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = navigationStylesheet;
    link.dataset.lawsRenewalNavigation = 'true';
    document.head.appendChild(link);
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const setMotionMode = () => {
    root.dataset.lrMotion = motionQuery.matches ? 'reduced' : 'full';
  };
  setMotionMode();
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', setMotionMode);
  }

  const setupCollapsibleNavigation = () => {
    const compactQuery = window.matchMedia('(max-width: 920px)');
    const compactViewport = () => {
      const widths = [
        window.innerWidth,
        document.documentElement.clientWidth,
        window.screen?.width
      ].filter((value) => Number.isFinite(value) && value > 0);
      return compactQuery.matches || widths.some((value) => value <= 920);
    };

    document.querySelectorAll('.lr-topbar').forEach((topbar, index) => {
      const nav = topbar.querySelector('.lr-nav');
      if (!nav || topbar.querySelector('.lr-nav-toggle')) return;

      if (!nav.id) nav.id = `lr-page-navigation-${index + 1}`;

      const toggle = document.createElement('button');
      toggle.className = 'lr-nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-controls', nav.id);
      toggle.innerHTML = '<span class="lr-nav-toggle__label">Page menu</span><span class="lr-nav-toggle__icon" aria-hidden="true">⌄</span>';

      let userOverride = false;
      const setExpanded = (expanded, returnFocus = false) => {
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Collapse page menu' : 'Expand page menu');
        topbar.dataset.lrNavExpanded = String(expanded);
        nav.hidden = !expanded;

        if (!expanded && nav.contains(document.activeElement)) {
          toggle.focus();
        } else if (returnFocus) {
          toggle.focus();
        }
      };

      const applyViewportDefault = () => {
        if (userOverride) return;
        setExpanded(!compactViewport());
      };

      toggle.addEventListener('click', () => {
        userOverride = true;
        setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
      });

      toggle.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' || toggle.getAttribute('aria-expanded') === 'true') return;
        event.preventDefault();
        userOverride = true;
        setExpanded(true);
        const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (firstLink) firstLink.focus();
      });

      topbar.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
        event.preventDefault();
        userOverride = true;
        setExpanded(false, true);
      });

      topbar.insertBefore(toggle, nav);
      applyViewportDefault();

      if (typeof compactQuery.addEventListener === 'function') {
        compactQuery.addEventListener('change', applyViewportDefault);
      }
      window.addEventListener('resize', applyViewportDefault, { passive: true });
    });
  };

  const collapsePanels = (buttons, panels) => {
    buttons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.tabIndex = -1;
    });
  };

  const expandPanel = (buttons, panels, nextIndex) => {
    collapsePanels(buttons, panels);
    const button = buttons[nextIndex];
    const panel = panels[nextIndex];
    if (!button || !panel) return;
    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.tabIndex = 0;
  };

  document.querySelectorAll('[data-lr-tabs]').forEach((group, groupIndex) => {
    const tablist = group.querySelector('[role="tablist"]');
    const buttons = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));
    if (!tablist || buttons.length === 0 || buttons.length !== panels.length) return;

    tablist.setAttribute('role', 'group');

    buttons.forEach((button, index) => {
      const buttonId = button.id || `lr-disclosure-${groupIndex}-${index}`;
      const panelId = panels[index].id || `lr-disclosure-panel-${groupIndex}-${index}`;
      button.id = buttonId;
      panels[index].id = panelId;

      button.removeAttribute('role');
      button.removeAttribute('aria-selected');
      button.removeAttribute('tabindex');
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', 'false');

      panels[index].setAttribute('role', 'region');
      panels[index].setAttribute('aria-labelledby', buttonId);

      button.addEventListener('click', () => {
        const wasOpen = button.getAttribute('aria-expanded') === 'true';
        collapsePanels(buttons, panels);
        if (!wasOpen) expandPanel(buttons, panels, index);
      });

      button.addEventListener('keydown', (event) => {
        let next = index;
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            next = (index + 1) % buttons.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            next = (index - 1 + buttons.length) % buttons.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = buttons.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        buttons[next]?.focus();
      });
    });

    collapsePanels(buttons, panels);
  });

  setupCollapsibleNavigation();

  document.querySelectorAll('.lr-status-grid').forEach((grid) => {
    if (grid.closest('.lr-page-facts')) return;

    const disclosure = document.createElement('details');
    disclosure.className = 'lr-page-facts';
    disclosure.dataset.lrPageFacts = 'true';

    const summary = document.createElement('summary');
    summary.textContent = 'Page facts';

    const body = document.createElement('div');
    body.className = 'lr-page-facts__body';

    grid.parentNode?.insertBefore(disclosure, grid);
    disclosure.append(summary, body);
    body.append(grid);
  });

  const protectedAcronyms = new Set([
    'ACK', 'API', 'AUROC', 'CP6', 'CSS', 'DOM', 'HTML', 'ID', 'JS', 'JSON',
    'PCR', 'SHA', 'SOH', 'TNT', 'URL'
  ]);

  const humanizeMachineValue = (value) => {
    const exact = value.trim();
    if (!exact.includes('_') || !/^[A-Z0-9_./:+-]+$/.test(exact)) return null;

    return exact
      .split('_')
      .filter(Boolean)
      .map((part, index) => {
        if (protectedAcronyms.has(part)) return part;
        const lower = part.toLowerCase();
        return index === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
      })
      .join(' ');
  };

  document.querySelectorAll('.lr-record dd').forEach((value) => {
    const exact = value.textContent || '';
    const readable = humanizeMachineValue(exact);
    if (!readable) return;
    value.dataset.exactValue = exact.trim();
    value.textContent = readable;
    value.title = `Exact custody value: ${exact.trim()}`;
  });

  document.querySelectorAll('.lr-formula code').forEach((code) => {
    if (code.querySelector('.lr-relation-lines')) return;
    const lines = (code.textContent || '').split('\n');
    const group = document.createElement('span');
    group.className = 'lr-relation-lines';
    lines.forEach((line) => {
      const row = document.createElement('span');
      row.className = 'lr-relation-line';
      row.textContent = line;
      group.append(row);
    });
    code.replaceChildren(group);
  });

  document.querySelectorAll('.lr-record .lr-receipt').forEach((receipt) => {
    if (receipt.closest('.lr-source-disclosure')) return;

    const record = receipt.closest('.lr-record');
    const title = record?.querySelector('h3')?.textContent?.trim() || 'custody record';
    const disclosure = document.createElement('details');
    disclosure.className = 'lr-source-disclosure';
    disclosure.dataset.lrSourceDisclosure = 'true';

    const summary = document.createElement('summary');
    summary.textContent = 'Exact source receipt';

    const body = document.createElement('div');
    body.className = 'lr-source-disclosure__body';

    const note = document.createElement('p');
    note.className = 'lr-source-disclosure__note';
    note.textContent = `The complete ${title} source text is preserved here for custody review. It does not control the public explanation above.`;

    receipt.parentNode?.insertBefore(disclosure, receipt);
    disclosure.append(summary, body);
    body.append(note, receipt);
  });

  document.querySelectorAll('.lr-page-facts, .lr-audit, .lr-source-disclosure').forEach((disclosure) => {
    disclosure.removeAttribute('open');
  });

  document.querySelectorAll('.lr-record').forEach((record) => {
    record.dataset.lrAuditTranslated = 'true';
  });

  root.dataset.lrAuditPresentation = 'translated';
  root.dataset.lrEntryDisclosureState = 'collapsed';
  root.classList.add('lr-runtime-ready');

  let errors = 0;
  const updateHealth = () => {
    root.dataset.lrBrowserErrors = String(errors);
    const overflow = Math.max(document.body.scrollWidth, root.scrollWidth) > root.clientWidth + 1;
    root.dataset.lrOverflow = overflow ? '1' : '0';
  };
  window.addEventListener('error', () => { errors += 1; updateHealth(); });
  window.addEventListener('unhandledrejection', () => { errors += 1; updateHealth(); });
  window.addEventListener('load', () => requestAnimationFrame(updateHealth), { once: true });
  window.addEventListener('resize', updateHealth, { passive: true });
})();
