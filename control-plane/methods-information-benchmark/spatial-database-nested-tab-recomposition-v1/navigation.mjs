function nextIndex(current, key, length) {
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "ArrowRight" || key === "ArrowDown") return (current + 1) % length;
  if (key === "ArrowLeft" || key === "ArrowUp") return (current - 1 + length) % length;
  return current;
}

export function bindRovingTablist(container, onActivate) {
  container.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const tabs = [...container.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const target = tabs[nextIndex(current, event.key, tabs.length)];
    tabs.forEach((tab) => tab.tabIndex = tab === target ? 0 : -1);
    target.focus();
    onActivate(target);
  });

  container.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !container.contains(tab)) return;
    onActivate(tab);
  });
}

export function restoreFocusAndScroll(state) {
  const target = state.priorFocusTarget ? document.getElementById(state.priorFocusTarget) : null;
  if (target) target.focus({ preventScroll: true });
  window.scrollTo({ top: state.recordScrollPosition, behavior: state.reducedMotion ? "auto" : "smooth" });
}

export function focusReadingSurface(reducedMotion) {
  document.querySelector("#record-reading-surface").scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start"
  });
}

export function installEscapeHandler(onReturn) {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    onReturn();
  });
}
