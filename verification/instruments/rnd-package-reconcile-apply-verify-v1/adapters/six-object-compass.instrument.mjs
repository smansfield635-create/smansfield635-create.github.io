import SIX_OBJECT_MODEL_ADAPTER from "./six-object-model.adapter.mjs";

export const SIX_OBJECT_COMPASS_INSTRUMENT = Object.freeze({
  id: "R&D_SIX_OBJECT_COMPASS_INSTRUMENT_v1",
  fixedTopLevelObjectCount: 6,
  acceptsProfileSuppliedObjectCount: false,
  modelAdapterId: SIX_OBJECT_MODEL_ADAPTER.id,
  validateSelection({ instrumentId, snapshot }) {
    const errors = [];
    if (instrumentId !== this.id) errors.push("SIX_OBJECT_INSTRUMENT_ID_MISMATCH");
    const model = SIX_OBJECT_MODEL_ADAPTER.validateSnapshot(snapshot);
    errors.push(...model.errors);
    return Object.freeze({ pass: errors.length === 0, errors: Object.freeze(errors) });
  }
});
export default SIX_OBJECT_COMPASS_INSTRUMENT;
