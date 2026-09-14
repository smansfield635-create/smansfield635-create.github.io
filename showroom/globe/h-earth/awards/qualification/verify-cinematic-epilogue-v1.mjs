#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const rel = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(rel(p), 'utf8');
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const exists = (p) => fs.existsSync(rel(p));
const pass = [];
const failures = [];
const check = (id, condition, detail = null) => {
  const ok = condition === true;
  (ok ? pass : failures).push({ id, ...(detail == null ? {} : { detail }) });
  return ok;
};

const paths = Object.freeze({
  render: 'showroom/globe/h-earth/awards/cinematic/epilogue/render.html',
  renderer: 'showroom/globe/h-earth/awards/cinematic/epilogue/renderer.mjs',
  conform: 'showroom/globe/h-earth/awards/cinematic/epilogue/conform.v1.json',
  bindings: 'showroom/globe/h-earth/awards/cinematic/epilogue/source-bindings.v1.json',
  media: 'showroom/globe/h-earth/awards/media/awards-cinematic-epilogue-first-picture-v1.mp4',
  qualification: 'showroom/globe/h-earth/awards/qualification/cinematic-epilogue-first-picture-qualification.v1.json',
  awardsIndex: 'showroom/globe/h-earth/awards/index.html',
  registry: 'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.awards-cinematic-epilogue-path-recognition.js'
});

for (const key of ['render', 'renderer', 'conform', 'bindings', 'qualification', 'awardsIndex', 'registry']) {
  check(`FILE_PRESENT:${key}`, exists(paths[key]), paths[key]);
}

let conform = null;
let bindings = null;
let qualification = null;
try { conform = JSON.parse(read(paths.conform)); } catch (error) { failures.push({ id: 'CONFORM_JSON_INVALID', detail: error.message }); }
try { bindings = JSON.parse(read(paths.bindings)); } catch (error) { failures.push({ id: 'BINDINGS_JSON_INVALID', detail: error.message }); }
try { qualification = JSON.parse(read(paths.qualification)); } catch (error) { failures.push({ id: 'QUALIFICATION_JSON_INVALID', detail: error.message }); }

if (conform) {
  check('CONFORM_SCHEMA', conform.schema === 'AWARDS_CINEMATIC_EPILOGUE_CONFORM_v1');
  check('CONFORM_RUNTIME', Math.abs(conform.runtimeSeconds - 58.774) < 1e-9, conform.runtimeSeconds);
  check('CONFORM_MUSIC_START', Math.abs(conform.music.carrierStartSeconds - 88.77) < 1e-9);
  check('CONFORM_MUSIC_END', Math.abs(conform.music.carrierEndSeconds - 147.544) < 1e-9);
  check('CONFORM_PHASE_COUNT', Array.isArray(conform.phases) && conform.phases.length === 8);
  check('CONFORM_PHASE_IDS', JSON.stringify(conform.phases?.map((p) => p.id)) === JSON.stringify(['T0','T1','T2','T3','T4','T5','T6','T7']));
  check('CONFORM_CONTIGUOUS', conform.phases?.every((p, i, a) => i === 0 || Math.abs(a[i - 1].out - p.in) < 1e-9) === true);
  check('CONFORM_TERMINAL', Math.abs(conform.phases?.at(-1)?.out - 58.774) < 1e-9);
  check('CONFORM_FRAME_POLICY', conform.video?.decodedFrameCount === 1763 && conform.video?.terminalPolicy === 'HOLD_LAST_DECODED_CONTINUING_WORLD_FRAME_THROUGH_RESIDUAL_AUDIO_TO_EXACT_CONTAINER_END');
  check('NO_GENERATED_IMAGERY_CONFORM', conform.globalLaws?.generatedImagery === false);
  check('NO_RAW_VIDEO_FINAL_CONFORM', conform.globalLaws?.rawScreenRecordingFinalPicture === false);
  check('MOTION_GATE_CONFORM', conform.globalLaws?.motionContinuityHardGate === true && conform.globalLaws?.unplannedFreezeAllowed === false);
}

const expectedBlobs = Object.freeze({
  'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs': '872d20b17bb0cd89d9613ca0262b25350890a617',
  'characters/cardinal-scene-geometry.mjs': '698dc392edd0b74547d76fb09a05bb3bb2437c15',
  'characters/cardinal-scene-state.mjs': 'a7a60734529cfd6ebeea08e40f4722436689f5f3',
  'characters/cardinal-scenes.data.mjs': 'cef3edc7beb5fc39037e00d5ead360ef9db9cdd5',
  'assets/compass/upstream-compass.geometry.js': 'fe35d8d844859a6af810684ace53d2c65258522f',
  'assets/compass/upstream-compass.renderer.js': '965376dd8a92686bc7008d1fea4846b5f8300872',
  'assets/shared/mirrorland-window.geometry.js': 'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595'
});

if (bindings) {
  check('BINDINGS_SCHEMA', bindings.schema === 'AWARDS_CINEMATIC_EPILOGUE_SOURCE_BINDINGS_v1');
  check('BINDINGS_GENERATION', bindings.lockGeneration === 2128);
  check('BINDINGS_GOVERNING_HEAD', bindings.governingHead === 'ec39bc5ac6529e015f147433d9a39df05757fe65');
  check('BINDINGS_NO_GENERATED', bindings.generatedImagery === 'FORBIDDEN');
  check('BINDINGS_NO_RAW_FINAL', bindings.rawScreenRecordingAsFinalPicture === 'FORBIDDEN');
  check('BINDINGS_CLIP_COUNT', bindings.donorClips?.length === 4);
  const clipHash = Object.fromEntries((bindings.donorClips ?? []).map((x) => [x.id, x.sha256]));
  check('CLIP001_HASH', clipHash['EPILOGUE-CLIP-001'] === '942a374aec8842c49a4895f7eb3964b4f4095281426dbf7d75cc0d6e6b45ef43');
  check('CLIP002_HASH', clipHash['EPILOGUE-CLIP-002'] === '15960d2efd251589d4d5560026ee0a287e4211e64caef504a99d1d0c79f88df5');
  check('CLIP003_HASH', clipHash['EPILOGUE-CLIP-003'] === '6e1c3b0b5d1f01a34ffce86660deac72c0601c3cb8da2aba4207e7ab40c6ba9c');
  check('CLIP004_HASH', clipHash['EPILOGUE-CLIP-004'] === '8653f6c56d58884d28f9330b39b64660e67331e3bf61b033b200df2b270f0c43');
  const sourceMap = Object.fromEntries((bindings.canonicalSources ?? []).map((x) => [x.path, x.gitBlobSha]));
  for (const [sourcePath, expectedBlob] of Object.entries(expectedBlobs)) {
    check(`SOURCE_IDENTITY:${sourcePath}`, sourceMap[sourcePath] === expectedBlob, { expectedBlob, observed: sourceMap[sourcePath] ?? null });
  }
  check('LIVE_AWARDS_INDEX_BOUND', bindings.liveBoundary?.governingHeadGitBlobSha === 'c889e6c414d4b94807623481d1d0154fed66e557');
  check('REGISTRY_GEN2127_PASS_BOUND', bindings.registryProjection?.generation === 2127 && bindings.registryProjection?.terminalDisposition === 'PASS_CLOSED' && bindings.registryProjection?.exactRecognizedPathCount === 7);
}

const renderHtml = exists(paths.render) ? read(paths.render) : '';
const renderer = exists(paths.renderer) ? read(paths.renderer) : '';
check('RENDER_NO_VIDEO_TAG', !/<video\b/i.test(renderHtml));
check('RENDER_NO_IMAGE_TAG', !/<img\b/i.test(renderHtml));
check('RENDER_LOADS_MIRRORLAND_CANONICAL', renderHtml.includes('/assets/shared/mirrorland-window.geometry.js'));
check('RENDER_LOADS_COMPASS_CANONICAL', renderHtml.includes('/assets/compass/upstream-compass.geometry.js'));
check('RENDER_IMPORTS_H_EARTH_CANONICAL', renderer.includes("from '../../../terrain-estate-construction-v1/renderer.mjs'"));
check('RENDER_IMPORTS_CHARACTERS_CANONICAL', renderer.includes("from '../../../../../../characters/cardinal-scene-geometry.mjs'"));
check('RENDER_NO_RANDOM', !/Math\.random\s*\(/.test(renderer));
check('RENDER_EXPOSES_DETERMINISTIC_API', renderer.includes("DGB_AWARDS_EPILOGUE_RENDER") && renderer.includes('renderAt'));
check('RENDER_GENERATED_IMAGERY_FALSE', renderer.includes('generatedImagery: false'));
check('RENDER_RAW_VIDEO_FINAL_FALSE', renderer.includes('rawScreenRecordingFinalPicture: false'));
check('RENDER_T0_T7_BOUNDARIES', ['3.13','13.19','19.43','29.58','36.73','47.63','52.330','58.774'].every((token) => renderer.includes(token) || read(paths.conform).includes(token)));

try {
  const blob = execFileSync('git', ['hash-object', paths.awardsIndex], { cwd: ROOT, encoding: 'utf8' }).trim();
  check('LIVE_AWARDS_INDEX_BYTE_UNCHANGED', blob === 'c889e6c414d4b94807623481d1d0154fed66e557', { observed: blob });
} catch (error) {
  failures.push({ id: 'LIVE_AWARDS_INDEX_HASH_UNAVAILABLE', detail: error.message });
}

try {
  const registryModule = await import(pathToFileUrl(rel(paths.registry)));
  const result = registryModule.verifyHEarthAwardsCinematicEpiloguePathRecognition();
  check('H_EARTH_SEVEN_PATH_REGISTRY_VERIFIED', result?.eligible === true && result?.targetPaths?.length === 7, result?.status ?? null);
} catch (error) {
  failures.push({ id: 'H_EARTH_REGISTRY_RUNTIME_VERIFY_FAILED', detail: error.message });
}

let media = null;
if (exists(paths.media)) {
  try {
    const probe = JSON.parse(execFileSync('ffprobe', [
      '-v','error','-count_frames','-show_entries',
      'format=duration:stream=index,codec_type,codec_name,profile,width,height,pix_fmt,color_space,color_transfer,color_primaries,avg_frame_rate,r_frame_rate,nb_read_frames,duration,sample_rate,channels',
      '-of','json', rel(paths.media)
    ], { encoding: 'utf8' }));
    const video = probe.streams.find((s) => s.codec_type === 'video');
    const audio = probe.streams.find((s) => s.codec_type === 'audio');
    media = { probe, sha256: sha256(fs.readFileSync(rel(paths.media))) };
    check('MEDIA_CONTAINER_DURATION', Math.abs(Number(probe.format.duration) - 58.774) <= .002, probe.format.duration);
    check('MEDIA_VIDEO_H264', video?.codec_name === 'h264');
    check('MEDIA_VIDEO_PROFILE', String(video?.profile || '').toLowerCase().includes('high'), video?.profile ?? null);
    check('MEDIA_RASTER', video?.width === 1280 && video?.height === 720, { width: video?.width, height: video?.height });
    check('MEDIA_YUV420P', video?.pix_fmt === 'yuv420p', video?.pix_fmt ?? null);
    check('MEDIA_FRAME_RATE', video?.avg_frame_rate === '30/1', video?.avg_frame_rate ?? null);
    check('MEDIA_FRAME_COUNT', Number(video?.nb_read_frames) === 1763, video?.nb_read_frames ?? null);
    check('MEDIA_AUDIO_48K_STEREO', audio?.sample_rate === '48000' && audio?.channels === 2, { sampleRate: audio?.sample_rate, channels: audio?.channels });
    check('MEDIA_AUDIO_DURATION', Math.abs(Number(audio?.duration) - 58.774) <= .002, audio?.duration ?? null);
  } catch (error) {
    failures.push({ id: 'MEDIA_PROFILE_OR_DECODE_FAILURE', detail: error.message });
  }
} else {
  failures.push({ id: 'MEDIA_REVIEW_MASTER_ABSENT', detail: paths.media });
}

if (qualification) {
  check('QUALIFICATION_SCHEMA', qualification.schema === 'AWARDS_CINEMATIC_EPILOGUE_FIRST_PICTURE_QUALIFICATION_v1');
  check('QUALIFICATION_GENERATION', qualification.lockGeneration === 2128);
  check('QUALIFICATION_NO_PUBLICATION', qualification.publicationAuthorized === false && qualification.deploymentAuthorized === false && qualification.liveIntegrationAuthorized === false);
}

const staticFailures = failures.filter((entry) => entry.id !== 'MEDIA_REVIEW_MASTER_ABSENT');
const result = failures.length === 0
  ? 'PASS_CLOSED_FIRST_PICTURE_REVIEW_MASTER'
  : staticFailures.length === 0 && failures.some((entry) => entry.id === 'MEDIA_REVIEW_MASTER_ABSENT')
    ? 'FAIL_CLOSED_MEDIA_RENDER_ENVIRONMENT_BLOCKED'
    : 'FAIL_CLOSED_CONSTRUCTION_OR_MEDIA_QUALIFICATION';

const receipt = {
  schema: 'AWARDS_CINEMATIC_EPILOGUE_FIRST_PICTURE_VERIFICATION_RECEIPT_v1',
  result,
  operationId: 'AWARDS_CINEMATIC_EPILOGUE_FIRST_PICTURE_CONSTRUCTION_20260911_002',
  lockGeneration: 2128,
  governingHead: 'ec39bc5ac6529e015f147433d9a39df05757fe65',
  testedHead: (() => { try { return execFileSync('git', ['rev-parse','HEAD^{commit}'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return null; } })(),
  staticConstructionPass: staticFailures.length === 0,
  mediaPresent: exists(paths.media),
  media,
  passChecks: pass,
  failures,
  publicationAuthorized: false,
  deploymentAuthorized: false,
  liveIntegrationAuthorized: false
};
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result === 'PASS_CLOSED_FIRST_PICTURE_REVIEW_MASTER' ? 0 : 1;

function pathToFileUrl(file) {
  const normalized = path.resolve(file).replaceAll(path.sep, '/');
  return new URL(`file://${normalized.startsWith('/') ? '' : '/'}${normalized}`).href;
}
