#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const candidate = 'showroom/globe/h-earth/awards/media/candidates/chapter01-compass-v29-final-corrective-65s.mp4';
const live = 'showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4';
const expectedLive = '42a0ee342a00179fff8f94d09f02ae58b660856cc8b9e6613be1f9990d1cfa62';
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const probe = JSON.parse(execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-show_entries','stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,color_space,color_transfer,color_primaries','-of','json',candidate], {encoding:'utf8'}));
const video = probe.streams.find(s => s.codec_type === 'video');
const audio = probe.streams.find(s => s.codec_type === 'audio');
const checks = {
  exactDuration: Math.abs(Number(probe.format.duration) - 65) < 0.001,
  video: video?.codec_name === 'h264' && video?.width === 1920 && video?.height === 1080 && video?.r_frame_rate === '24/1',
  color: video?.color_space === 'bt709' && video?.color_transfer === 'bt709' && video?.color_primaries === 'bt709',
  audio: audio?.codec_name === 'aac' && audio?.sample_rate === '48000' && audio?.channels === 2,
  liveV28Unchanged: sha(live) === expectedLive,
};
if (Object.values(checks).some(v => !v)) {
  console.error(JSON.stringify({schema:'H_EARTH_AWARDS_COMPASS_V29_VERIFIER_v1',result:'FAIL_CLOSED',checks}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({schema:'H_EARTH_AWARDS_COMPASS_V29_VERIFIER_v1',result:'PASS_CLOSED',candidateSha256:sha(candidate),checks}, null, 2));
