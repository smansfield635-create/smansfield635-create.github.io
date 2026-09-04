export const CINEMATIC_MEDIA_MANIFEST = Object.freeze({
  schema: 'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version: 'shell-20260904-001',
  sourceMain: '46c56e0519fc875eac877b4bc921e3151b019a2f',
  specificationCommit: '88473442959299d6f6af82396917f0578074cab2',
  status: 'SHELL_ONLY_NO_MEDIA_ACQUIRED',
  persistentField: 'REPOSITORY_NATIVE_PAGE_NIGHT_PENDING_BINDING',
  shots: Object.freeze([
    Object.freeze({ id: 'S01', beat: 'Arrival', startMs: 0, endMs: 4500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S02', beat: 'Orientation', startMs: 4500, endMs: 9500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S03', beat: 'Chapter One', startMs: 9500, endMs: 14500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S04', beat: 'Choice / Readiness', startMs: 14500, endMs: 19500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S05', beat: 'Threshold', startMs: 19500, endMs: 25500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S06', beat: 'Elsewhere', startMs: 25500, endMs: 30500, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S07', beat: 'Breadth / Engagement', startMs: 30500, endMs: 34000, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' }),
    Object.freeze({ id: 'S08', beat: 'Return / Handoff', startMs: 34000, endMs: 38000, status: 'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED' })
  ])
});

export function assertCinematicMediaManifest(manifest = CINEMATIC_MEDIA_MANIFEST) {
  if (manifest?.schema !== 'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1') throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if (manifest?.sourceMain !== '46c56e0519fc875eac877b4bc921e3151b019a2f') throw new Error('CINEMATIC_MEDIA_BASE_MISMATCH');
  if (manifest?.specificationCommit !== '88473442959299d6f6af82396917f0578074cab2') throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if (!Array.isArray(manifest?.shots) || manifest.shots.length !== 8) throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  if (manifest.shots[0]?.startMs !== 0 || manifest.shots.at(-1)?.endMs !== 38000) throw new Error('CINEMATIC_MEDIA_TIMELINE_MISMATCH');
  return true;
}
