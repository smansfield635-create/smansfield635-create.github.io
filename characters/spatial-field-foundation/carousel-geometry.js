const root = document.querySelector('[data-spatial-foundation]');
const field = root?.querySelector('.field');
const anchorList = root?.querySelector('.anchors');
const anchors = anchorList ? [...anchorList.querySelectorAll('[data-anchor]')] : [];

if (!root || !field || !anchorList || anchors.length !== 8) {
  throw new Error('CHARACTERS_TASK17R_C_EIGHT_ANCHOR_MOUNT_MISSING');
}

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const status = document.createElement('p');
status.className = 'carousel-status';
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
status.setAttribute('aria-atomic', 'true');
field.append(status);

const attachment = document.createElement('div');
attachment.className = 'carousel-attachment';
attachment.setAttribute('aria-hidden', 'true');
attachment.innerHTML = '<span class="carousel-attachment__eyebrow">Placeholder attachment</span><span class="carousel-attachment__label">Reserved position 01</span>';
field.append(attachment);

let selectedIndex = 0;
let pointerId = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let resizeFrame = 0;

function anchorCenter(anchor) {
  return {
    x: anchor.offsetLeft,
    y: anchor.offsetTop
  };
}

function positionAttachment() {
  const anchor = anchors[selectedIndex];
  const center = anchorCenter(anchor);
  attachment.style.setProperty('--anchor-x', `${center.x}px`);
  attachment.style.setProperty('--anchor-y', `${center.y}px`);
  attachment.querySelector('.carousel-attachment__label').textContent = `Reserved position ${anchor.dataset.anchor}`;
}

function select(index, { focus = false, announce = true } = {}) {
  const normalized = (index + anchors.length) % anchors.length;
  selectedIndex = normalized;

  anchors.forEach((anchor, i) => {
    const control = anchor.querySelector('.anchor__control');
    const selected = i === selectedIndex;
    anchor.dataset.selected = String(selected);
    control.tabIndex = selected ? 0 : -1;
    control.setAttribute('aria-current', selected ? 'true' : 'false');
  });

  root.dataset.carouselIndex = String(selectedIndex + 1).padStart(2, '0');
  root.dataset.carouselMotion = prefersReducedMotion.matches ? 'reduced-equivalent' : 'animated-anchor-transition';
  positionAttachment();

  if (focus) anchors[selectedIndex].querySelector('.anchor__control').focus({ preventScroll: true });
  if (announce) status.textContent = `Reserved position ${String(selectedIndex + 1).padStart(2, '0')} selected.`;
}

function move(delta, options) {
  select(selectedIndex + delta, options);
}

anchors.forEach((anchor, index) => {
  anchor.dataset.carouselAnchor = 'true';
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'anchor__control';
  control.setAttribute('aria-label', `Select reserved position ${anchor.dataset.anchor}`);
  control.addEventListener('click', () => select(index, { focus: true }));
  control.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(1, { focus: true });
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1, { focus: true });
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(0, { focus: true });
    } else if (event.key === 'End') {
      event.preventDefault();
      select(anchors.length - 1, { focus: true });
    }
  });
  anchor.append(control);
});

anchorList.dataset.carouselReady = 'true';
anchorList.setAttribute('aria-roledescription', 'carousel');
anchorList.setAttribute('aria-label', 'Eight reserved character anchors');

field.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' || !event.isPrimary) return;
  pointerId = event.pointerId;
  startX = currentX = event.clientX;
  startY = currentY = event.clientY;
  field.dataset.carouselDragging = 'true';
}, { passive: true });

field.addEventListener('pointermove', event => {
  if (event.pointerId !== pointerId) return;
  currentX = event.clientX;
  currentY = event.clientY;
}, { passive: true });

function endPointer(event) {
  if (event.pointerId !== pointerId) return;
  const dx = currentX - startX;
  const dy = currentY - startY;
  const horizontalIntent = Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy) * 1.25;
  delete field.dataset.carouselDragging;
  pointerId = null;
  if (horizontalIntent) move(dx < 0 ? 1 : -1, { focus: false });
}

field.addEventListener('pointerup', endPointer, { passive: true });
field.addEventListener('pointercancel', event => {
  if (event.pointerId === pointerId) {
    delete field.dataset.carouselDragging;
    pointerId = null;
  }
}, { passive: true });

addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(positionAttachment);
}, { passive: true });

prefersReducedMotion.addEventListener?.('change', () => select(selectedIndex, { announce: false }));

root.dataset.carouselReady = 'true';
root.dataset.carouselAnchors = '8';
root.dataset.domAttachmentModel = 'anchor-layout-offset';
root.dataset.keyboardFocus = 'roving-tabindex-arrow-home-end';
root.dataset.touchOwnership = 'horizontal-swipe-only-vertical-scroll-and-pinch-browser-owned';
root.dataset.productionContent = 'absent';
root.dataset.worldNavigationOwnership = 'absent';

select(0, { announce: false });
