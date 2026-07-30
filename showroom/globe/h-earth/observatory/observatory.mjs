export const H_EARTH_OBSERVATORY_ROUTE_ID = 'THE_H_EARTH_OBSERVATORY';
export const H_EARTH_OBSERVATORY_SECTION_IDS = Object.freeze([
  'H_EARTH_WITHIN_MIRRORLAND',
  'SHADOWS_NEVER_SHATTER_IN_MIRRORLAND',
  'THE_LIVE_ENVIRONMENT',
  'HOW_THE_WORLD_IS_PRESERVED',
  'ONE_REAL_ENGINEERING_SESSION',
  'OPTIONAL_TECHNICAL_EVIDENCE',
  'RETURN_TO_H_EARTH'
]);

const presentSections = [...document.querySelectorAll('[data-observatory-section]')]
  .map((node) => node.dataset.observatorySection);

if (JSON.stringify(presentSections) !== JSON.stringify(H_EARTH_OBSERVATORY_SECTION_IDS)) {
  document.documentElement.dataset.observatoryContract = 'FAIL';
  throw new Error('H_EARTH_OBSERVATORY_SEVEN_SECTION_CONTRACT_MISMATCH');
}

document.documentElement.dataset.observatoryContract = 'PASS';
document.body.dataset.jsState = 'ready';
