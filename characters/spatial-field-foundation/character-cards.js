const root = document.querySelector('[data-spatial-foundation]');
const attachment = root?.querySelector('.carousel-attachment');
const anchors = root ? [...root.querySelectorAll('[data-anchor]')] : [];
const status = root?.querySelector('.carousel-status');

if (!root || !attachment || anchors.length !== 8) {
  throw new Error('CHARACTERS_TASK17R_D_CARD_MOUNT_MISSING');
}

const response = await fetch('./character-cards.v1.json', { cache: 'no-store' });
if (!response.ok) throw new Error(`CHARACTERS_TASK17R_D_CARD_DATA_UNAVAILABLE:${response.status}`);
const data = await response.json();

if (data?.schema !== 'CHARACTERS_TASK17R_D_PRODUCTION_CHARACTER_CARDS_v1' || !Array.isArray(data.slots) || data.slots.length !== 8) {
  throw new Error('CHARACTERS_TASK17R_D_CARD_DATA_INVALID');
}

const sourceBound = data.slots.filter(slot => slot.state === 'SOURCE_BOUND_CARDINAL_CARD');
const holds = data.slots.filter(slot => slot.state === 'UNASSIGNED_SOURCE_HOLD');
const expectedIds = ['ALARIC_AXION', 'ELARA_SYLENE', 'SOREN_SEVRIN', 'TARIAN_MERROW'];
const observedIds = sourceBound.map(slot => slot.characterId).sort();

if (sourceBound.length !== 4 || holds.length !== 4 || JSON.stringify(observedIds) !== JSON.stringify(expectedIds)) {
  throw new Error('CHARACTERS_TASK17R_D_CARDINAL_SET_INVALID');
}
if (holds.some(slot => slot.characterId !== null)) throw new Error('CHARACTERS_TASK17R_D_UNASSIGNED_HOLD_IDENTITY_INFERENCE');

const slotByAnchor = new Map(data.slots.map(slot => [slot.anchor, slot]));
for (const anchor of anchors) {
  const slot = slotByAnchor.get(anchor.dataset.anchor);
  if (!slot) throw new Error(`CHARACTERS_TASK17R_D_SLOT_MISSING:${anchor.dataset.anchor}`);
  anchor.dataset.characterLabel = slot.displayName;
  anchor.dataset.characterState = slot.state;
  anchor.querySelector('.anchor__label').textContent = slot.displayName;
  const control = anchor.querySelector('.anchor__control');
  if (control) control.setAttribute('aria-label', `Select ${slot.displayName}; activate to inspect`);
}

attachment.removeAttribute('aria-hidden');
attachment.setAttribute('role', 'group');
attachment.setAttribute('aria-label', 'Selected character card');

const detail = document.createElement('article');
detail.className = 'character-card';
detail.hidden = true;
attachment.append(detail);

const humanize = value => String(value).toLowerCase().replaceAll('_', ' ');

function render() {
  const index = Math.max(0, Math.min(7, Number.parseInt(root.dataset.carouselIndex || '01', 10) - 1));
  const slot = data.slots[index];
  const inspectionActive = root.dataset.characterInspection === 'active';
  const eyebrow = attachment.querySelector('.carousel-attachment__eyebrow');
  const label = attachment.querySelector('.carousel-attachment__label');

  label.textContent = slot.displayName;
  attachment.dataset.characterState = slot.state;
  attachment.dataset.characterId = slot.characterId || '';
  detail.hidden = !inspectionActive;

  if (!inspectionActive) {
    eyebrow.textContent = slot.state === 'UNASSIGNED_SOURCE_HOLD' ? 'Open position · activate to inspect' : 'Character · activate to inspect';
    detail.replaceChildren();
    return;
  }

  if (slot.state === 'UNASSIGNED_SOURCE_HOLD') {
    eyebrow.textContent = 'Open position';
    detail.innerHTML = '<p class="character-card__hold">No character has been revealed for this position yet.</p>';
  } else {
    eyebrow.textContent = `${slot.seat} · ${slot.season}`;
    detail.replaceChildren();

    const roles = document.createElement('p');
    roles.className = 'character-card__roles';
    roles.textContent = slot.roleLabels.map(humanize).join(' · ');

    const fn = document.createElement('p');
    fn.className = 'character-card__function';
    fn.textContent = humanize(slot.fixedFunction);

    const provenance = document.createElement('p');
    provenance.className = 'character-card__provenance';
    provenance.textContent = 'Cardinal character record';

    detail.append(roles, fn, provenance);
  }
}

new MutationObserver(records => {
  if (records.some(record => record.attributeName === 'data-carousel-index')) render();
}).observe(root, { attributes: true, attributeFilter: ['data-carousel-index'] });

root.addEventListener('characters:inspection-change', render);

root.dataset.productionContent = 'four-source-bound-cardinal-cards-four-unassigned-source-holds';
root.dataset.characterCardsReady = 'true';
root.dataset.characterSourceAuthority = 'issue-2378-owner-originating-only';
root.dataset.characterInference = 'forbidden';
root.dataset.characterInspectionContent = 'full-details-only-on-explicit-activation';

render();