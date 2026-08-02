/* LAWS_COMPLETE_RENEWAL_INTERACTION_ENGINE_v2 */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('lr-js');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const setMotionMode = () => {
    root.dataset.lrMotion = motionQuery.matches ? 'reduced' : 'full';
  };
  setMotionMode();
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', setMotionMode);
  }

  const activate = (tabs, panels, nextIndex, focus = false) => {
    tabs.forEach((tab, index) => {
      const selected = index === nextIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[index];
      if (panel) {
        panel.hidden = !selected;
        panel.tabIndex = selected ? 0 : -1;
      }
    });
    if (focus && tabs[nextIndex]) tabs[nextIndex].focus();
  };

  document.querySelectorAll('[data-lr-tabs]').forEach((group, groupIndex) => {
    const tablist = group.querySelector('[role="tablist"]');
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));
    if (!tablist || tabs.length === 0 || tabs.length !== panels.length) return;

    tabs.forEach((tab, index) => {
      const tabId = tab.id || `lr-tab-${groupIndex}-${index}`;
      const panelId = panels[index].id || `lr-panel-${groupIndex}-${index}`;
      tab.id = tabId;
      panels[index].id = panelId;
      tab.setAttribute('aria-controls', panelId);
      panels[index].setAttribute('aria-labelledby', tabId);
      tab.addEventListener('click', () => activate(tabs, panels, index));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            next = (index + 1) % tabs.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            next = (index - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = tabs.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        activate(tabs, panels, next, true);
      });
    });

    const requested = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    activate(tabs, panels, requested >= 0 ? requested : 0);
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

  document.querySelectorAll('.lr-record').forEach((record) => {
    record.dataset.lrAuditTranslated = 'true';
  });
  root.dataset.lrAuditPresentation = 'translated';

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
