/* LAWS_COMPLETE_RENEWAL_INTERACTION_ENGINE_v2 */
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
        setExpanded(!compactQuery.matches);
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

      nav.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        userOverride = true;
        setExpanded(false, true);
      });

      topbar.insertBefore(toggle, nav);
      applyViewportDefault();

      if (typeof compactQuery.addEventListener === 'function') {
        compactQuery.addEventListener('change', applyViewportDefault);
      }
    });
  };

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

  setupCollapsibleNavigation();

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
