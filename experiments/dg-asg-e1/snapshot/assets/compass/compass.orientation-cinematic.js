// DG-ASG E1 disposable cinematic workload scaffold.
// This file is experiment-only and is not a production cinematic asset.
export const E1_CINEMATIC_ASSIGNMENT = Object.freeze({
  operationId: 'DG-ASG_E1_LIVE_AGENT_CINEMATIC_TRIAL',
  sourceOperation: 'COMPASS_MAIN_ORIENTATION_CINEMATIC_DEFINITIVE_SUCCESSOR_20260903_001',
  referenceSha: 'be6234fd0768095f10227a4adf0fbb36e5f7800f',
  durationMs: 38000,
  scenes: Object.freeze([
    Object.freeze({ id: 'ARRIVAL', startMs: 0, endMs: 4500 }),
    Object.freeze({ id: 'ORIENTATION', startMs: 4500, endMs: 9500 }),
    Object.freeze({ id: 'CHAPTER_ONE', startMs: 9500, endMs: 14500 }),
    Object.freeze({ id: 'CHOICE_READINESS', startMs: 14500, endMs: 19500 }),
    Object.freeze({ id: 'THRESHOLD', startMs: 19500, endMs: 27000 }),
    Object.freeze({ id: 'ELSEWHERE', startMs: 27000, endMs: 33000 }),
    Object.freeze({ id: 'RETURN_HANDOFF', startMs: 33000, endMs: 38000 })
  ]),
  continuityLaw: 'NO_SCENE_BEGINS_FROM_ZERO',
  handoffLaw: 'FINAL_CINEMATIC_COMPASS_BECOMES_LIVE_COMPASS_WITHOUT_SCROLL_OR_VISIBLE_SNAP',
  stateMachine: Object.freeze(['ARMED', 'PLAYING', 'RESTORE', 'SETTLED']),
  productionAuthority: false
});

export function sceneAt(timeMs) {
  const t = Math.max(0, Math.min(E1_CINEMATIC_ASSIGNMENT.durationMs, Number(timeMs) || 0));
  return E1_CINEMATIC_ASSIGNMENT.scenes.find((scene, index, scenes) =>
    t >= scene.startMs && (t < scene.endMs || (index === scenes.length - 1 && t === scene.endMs))
  ) ?? E1_CINEMATIC_ASSIGNMENT.scenes.at(-1);
}
