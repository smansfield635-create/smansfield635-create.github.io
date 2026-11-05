/** Diamond Gate Graphics Engine E10 — bounded deterministic character clips.
 * World-independent CPU hinge-keyframe sampling over the adopted E10 skeleton.
 * No GPU ownership, IK, contact, animation blending, asset loading or world adoption.
 */
const finite = value => typeof value === 'number' && Number.isFinite(value);
const ease = t => t * t * (3 - 2 * t);

export function createHingeClip(skeleton, {duration, frames, loop = false} = {}) {
  if (!skeleton || typeof skeleton.samplePose !== 'function' || !Array.isArray(skeleton.joints))
    throw new TypeError('SKELETON_REQUIRED');
  if (!finite(duration) || duration <= 0 || !Array.isArray(frames) || frames.length < 2 || frames.length > 1024 || typeof loop !== 'boolean')
    throw new TypeError('CLIP_SCHEMA_INVALID');

  const joints = new Map(skeleton.joints.map(joint => [joint.id, joint]));
  const keys = new Set();
  const ordered = frames.map((frame, index) => {
    if (!frame || !finite(frame.time) || frame.time < 0 || frame.time > duration)
      throw new TypeError(`KEY_TIME_INVALID_${index}`);
    if (!frame.controls || typeof frame.controls !== 'object' || Array.isArray(frame.controls))
      throw new TypeError(`KEY_CONTROLS_INVALID_${index}`);
    const controls = {};
    for (const [id, angle] of Object.entries(frame.controls)) {
      if (joints.get(id)?.constraint?.kind !== 'HINGE' || !finite(angle))
        throw new TypeError(`HINGE_TRACK_INVALID_${index}_${id}`);
      keys.add(id);
      controls[id] = angle;
    }
    const translation = frame.rootTranslation ?? [0, 0, 0];
    if (!Array.isArray(translation) || translation.length !== 3 || !translation.every(finite))
      throw new TypeError(`ROOT_TRANSLATION_INVALID_${index}`);
    return Object.freeze({time: frame.time, controls: Object.freeze(controls), rootTranslation: Object.freeze([...translation])});
  });
  if (ordered[0].time !== 0 || ordered[ordered.length - 1].time !== duration ||
      ordered.some((frame, index) => index > 0 && frame.time <= ordered[index - 1].time))
    throw new RangeError('KEY_TIMES_NOT_STRICTLY_ORDERED');

  const tracks = [...keys];
  const defaults = Object.fromEntries(tracks.map(id => [id, 0]));
  // Missing track values are explicitly zero at every key; validate those implicit values too.
  for (const frame of ordered)
    skeleton.samplePose({controls: {...defaults, ...frame.controls}, rootTranslation: frame.rootTranslation});
  if (loop) {
    const first = ordered[0], last = ordered[ordered.length - 1];
    if (!tracks.every(id => Math.abs((first.controls[id] ?? 0) - (last.controls[id] ?? 0)) <= 1e-9) ||
        !first.rootTranslation.every((value, axis) => Math.abs(value - last.rootTranslation[axis]) <= 1e-9))
      throw new RangeError('LOOP_SEAM_MISMATCH');
  }

  function sample(time) {
    if (!finite(time)) throw new TypeError('SAMPLE_TIME_INVALID');
    const t = loop ? ((time % duration) + duration) % duration : Math.max(0, Math.min(duration, time));
    let index = 0;
    while (index < ordered.length - 2 && t > ordered[index + 1].time) index++;
    const left = ordered[index], right = ordered[index + 1];
    const weight = ease((t - left.time) / (right.time - left.time));
    const controls = {};
    for (const id of tracks) {
      const a = left.controls[id] ?? 0, b = right.controls[id] ?? 0;
      controls[id] = a * (1 - weight) + b * weight;
    }
    const rootTranslation = left.rootTranslation.map((value, axis) =>
      value * (1 - weight) + right.rootTranslation[axis] * weight);
    return skeleton.samplePose({controls, rootTranslation});
  }
  return Object.freeze({duration, loop, trackCount: tracks.length, sample});
}
