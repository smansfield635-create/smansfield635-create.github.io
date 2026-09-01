export const FOUR_OBJECT_COMPASS_INSTRUMENT = Object.freeze({
  id: "R&D_FOUR_OBJECT_COMPASS_INSTRUMENT_v1",
  fixedTopLevelObjectCount: 4,
  acceptsProfileSuppliedObjectCount: false,
  validateSelection({ instrumentId, outerAuthorities }) {
    const errors = [];
    if (instrumentId !== this.id) errors.push("FOUR_OBJECT_INSTRUMENT_ID_MISMATCH");
    if (!Array.isArray(outerAuthorities) || outerAuthorities.length !== 4) errors.push("FOUR_OBJECT_COUNT_MISMATCH");
    return Object.freeze({ pass: errors.length === 0, errors: Object.freeze(errors) });
  }
});
export default FOUR_OBJECT_COMPASS_INSTRUMENT;
