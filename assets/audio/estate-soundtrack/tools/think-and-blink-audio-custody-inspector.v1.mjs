#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const RECEIPT_SCHEMA = 'THINK_AND_BLINK_AUDIO_CUSTODY_INSPECTION_RECEIPT_v1';
const SELF_TEST_SCHEMA = 'THINK_AND_BLINK_AUDIO_CUSTODY_INSPECTOR_SELF_TEST_RECEIPT_v1';
const SOURCES = Object.freeze({
  AQUARIUM: Object.freeze({
    id: 'AUD_01_AQUARIUM_CANONICAL',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg',
    role: 'OPENING_AND_FINAL_RETURN',
    rights: 'CC_BY_SA_2_0'
  }),
  CAMPANELLA: Object.freeze({
    id: 'AUD_02_LA_CAMPANELLA_GREISS_CANONICAL',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg',
    role: 'EMERGENCE_ASCENT_CLIMAX_STRUCTURAL_DROP',
    rights: 'PUBLIC_DOMAIN_RECORDING_VRT_CONFIRMED'
  })
});
const CAMPANELLA_WINDOWS = Object.freeze([
  Object.freeze({ id: 'DEVELOPMENT_98_150', start: 98, end: 150, binSeconds: 0.05 }),
  Object.freeze({ id: 'LATE_CLIMAX_317_337', start: 317, end: 337, binSeconds: 0.01 })
]);

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}
function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
function fail(code, detail = null) { const e = new Error(code); e.code = code; e.detail = detail; throw e; }
function round(value, digits = 9) { const p = 10 ** digits; return Math.round(value * p) / p; }
function writeJson(file, value) {
  if (!file) return process.stdout.write(`${JSON.stringify(stable(value), null, 2)}\n`);
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(path.resolve(file), `${JSON.stringify(stable(value), null, 2)}\n`, 'utf8');
}
function parseArgs(argv) {
  const out = { selfTest: false, inspect: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--self-test') { out.selfTest = true; continue; }
    if (token === '--inspect') { out.inspect = true; continue; }
    if (!token.startsWith('--')) fail('ARGUMENT_INVALID', token);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) fail('ARGUMENT_VALUE_MISSING', token);
    out[token.slice(2)] = value;
    i += 1;
  }
  if (out.selfTest === out.inspect) fail('MODE_REQUIRED_EXACTLY_ONE_OF_SELF_TEST_OR_INSPECT');
  if (out.inspect && !out.output) fail('OUTPUT_REQUIRED');
  if (out.inspect && !/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(out['execution-holder'] ?? '')) fail('EXECUTION_HOLDER_INVALID');
  return out;
}

function pcmWindowSummary(channels, sampleRate, start, end, binSeconds) {
  if (!Array.isArray(channels) || channels.length < 1 || !channels.every((x) => x instanceof Float32Array)) fail('PCM_CHANNELS_INVALID');
  if (!(sampleRate > 0) || !(end > start) || !(binSeconds > 0)) fail('PCM_WINDOW_INVALID');
  const length = Math.min(...channels.map((x) => x.length));
  const first = Math.max(0, Math.floor(start * sampleRate));
  const last = Math.min(length, Math.ceil(end * sampleRate));
  const framesPerBin = Math.max(1, Math.round(binSeconds * sampleRate));
  const bins = [];
  for (let a = first; a < last; a += framesPerBin) {
    const z = Math.min(last, a + framesPerBin);
    let sumSq = 0, peak = 0, count = 0;
    for (let i = a; i < z; i += 1) {
      let mono = 0;
      for (const channel of channels) mono += channel[i];
      mono /= channels.length;
      const abs = Math.abs(mono);
      if (abs > peak) peak = abs;
      sumSq += mono * mono;
      count += 1;
    }
    bins.push({
      start: round(a / sampleRate, 6),
      end: round(z / sampleRate, 6),
      rms: round(Math.sqrt(sumSq / Math.max(1, count)), 9),
      peak: round(peak, 9)
    });
  }
  const candidates = localValleyCandidates(bins, 12);
  return { start, end, binSeconds, binCount: bins.length, bins, candidates };
}

function localValleyCandidates(bins, limit = 12) {
  const out = [];
  for (let i = 2; i < bins.length - 2; i += 1) {
    const rms = bins[i].rms;
    if (rms > bins[i - 1].rms || rms > bins[i + 1].rms) continue;
    const before = (bins[i - 2].rms + bins[i - 1].rms) / 2;
    const after = (bins[i + 1].rms + bins[i + 2].rms) / 2;
    const shoulder = (before + after) / 2;
    const prominence = shoulder - rms;
    if (!(prominence > 0)) continue;
    out.push({
      time: round((bins[i].start + bins[i].end) / 2, 6),
      rms,
      peak: bins[i].peak,
      beforeRms: round(before, 9),
      afterRms: round(after, 9),
      prominence: round(prominence, 9),
      symmetryPenalty: round(Math.abs(before - after), 9),
      score: round(prominence - (Math.abs(before - after) * 0.15), 9)
    });
  }
  return out.sort((a, b) => b.score - a.score || a.time - b.time).slice(0, limit);
}

function findChrome() {
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const r = spawnSync(name, ['--version'], { encoding: 'utf8', timeout: 5000 });
    if (r.status === 0) return { executable: name, version: String(r.stdout || r.stderr || '').trim() };
  }
  fail('CHROME_NOT_AVAILABLE');
}

function browserDecode(bytes, sourceId, windows = []) {
  const chrome = findChrome();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'think-blink-audio-decode-'));
  const htmlPath = path.join(tmp, 'decode.html');
  const markerA = '__THINK_BLINK_RESULT_BEGIN__';
  const markerZ = '__THINK_BLINK_RESULT_END__';
  const base64 = Buffer.from(bytes).toString('base64');
  const html = `<!doctype html><meta charset="utf-8"><pre id="result">PENDING</pre><script>\n` +
`const SOURCE_ID=${JSON.stringify(sourceId)};const BASE64=${JSON.stringify(base64)};const WINDOWS=${JSON.stringify(windows)};\n` +
`const round=(v,d=9)=>{const p=10**d;return Math.round(v*p)/p};\n` +
`function valleys(bins,limit=16){const out=[];for(let i=2;i<bins.length-2;i++){const rms=bins[i].rms;if(rms>bins[i-1].rms||rms>bins[i+1].rms)continue;const before=(bins[i-2].rms+bins[i-1].rms)/2;const after=(bins[i+1].rms+bins[i+2].rms)/2;const shoulder=(before+after)/2;const prominence=shoulder-rms;if(!(prominence>0))continue;out.push({time:round((bins[i].start+bins[i].end)/2,6),rms,peak:bins[i].peak,beforeRms:round(before),afterRms:round(after),prominence:round(prominence),symmetryPenalty:round(Math.abs(before-after)),score:round(prominence-Math.abs(before-after)*.15)});}return out.sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,limit)}\n` +
`function analyze(buf,w){const first=Math.max(0,Math.floor(w.start*buf.sampleRate));const last=Math.min(buf.length,Math.ceil(w.end*buf.sampleRate));const fpb=Math.max(1,Math.round(w.binSeconds*buf.sampleRate));const data=[];for(let a=first;a<last;a+=fpb){const z=Math.min(last,a+fpb);let sq=0,peak=0,count=0;for(let i=a;i<z;i++){let mono=0;for(let c=0;c<buf.numberOfChannels;c++)mono+=buf.getChannelData(c)[i];mono/=buf.numberOfChannels;const av=Math.abs(mono);if(av>peak)peak=av;sq+=mono*mono;count++;}data.push({start:round(a/buf.sampleRate,6),end:round(z/buf.sampleRate,6),rms:round(Math.sqrt(sq/Math.max(1,count))),peak:round(peak)});}return{id:w.id,start:w.start,end:w.end,binSeconds:w.binSeconds,binCount:data.length,bins:data,candidates:valleys(data)}}\n` +
`(async()=>{try{const raw=atob(BASE64);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const Ctx=window.AudioContext||window.webkitAudioContext;const ctx=new Ctx({sampleRate:48000});const buf=await ctx.decodeAudioData(bytes.buffer);const result={sourceId:SOURCE_ID,durationSeconds:round(buf.duration,9),sampleRate:buf.sampleRate,channels:buf.numberOfChannels,frames:buf.length,windows:WINDOWS.map(w=>analyze(buf,w))};await ctx.close();document.getElementById('result').textContent=${JSON.stringify(markerA)}+JSON.stringify(result)+${JSON.stringify(markerZ)};}catch(e){document.getElementById('result').textContent=${JSON.stringify(markerA)}+JSON.stringify({error:String(e&&e.stack||e)})+${JSON.stringify(markerZ)};}})();\n` +
`</script>`;
  fs.writeFileSync(htmlPath, html, 'utf8');
  try {
    const r = spawnSync(chrome.executable, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required', '--virtual-time-budget=30000', '--dump-dom', `file://${htmlPath}`
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 });
    if (r.status !== 0) fail('CHROME_DECODE_PROCESS_FAILED', { status: r.status, stderr: String(r.stderr || '').slice(-4000) });
    const out = String(r.stdout || '');
    const a = out.indexOf(markerA), z = out.indexOf(markerZ, a + markerA.length);
    if (a < 0 || z < 0) fail('CHROME_DECODE_RESULT_MISSING', { stdoutTail: out.slice(-4000), stderrTail: String(r.stderr || '').slice(-4000) });
    let decoded;
    try { decoded = JSON.parse(out.slice(a + markerA.length, z)); } catch (e) { fail('CHROME_DECODE_JSON_INVALID', e.message); }
    if (decoded?.error) fail('CHROME_AUDIO_DECODE_FAILED', decoded.error);
    return { chrome, ...decoded };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function fetchCanonical(source) {
  const url = new URL(source.url);
  if (url.protocol !== 'https:' || url.hostname !== 'upload.wikimedia.org') fail('SOURCE_URL_NOT_CANONICAL', source.id);
  const r = await fetch(source.url, { redirect: 'follow', headers: { 'User-Agent': 'DiamondGateBridge-ThinkAndBlink-AudioCustodyInspector/1.0' } });
  if (!r.ok) fail('SOURCE_FETCH_FAILED', { sourceId: source.id, status: r.status });
  const bytes = Buffer.from(await r.arrayBuffer());
  if (bytes.length < 1024) fail('SOURCE_BYTES_IMPLAUSIBLY_SMALL', { sourceId: source.id, bytes: bytes.length });
  return { bytes, finalUrl: r.url, contentType: r.headers.get('content-type') || null };
}

async function inspect(executionHolder) {
  const aquariumFetch = await fetchCanonical(SOURCES.AQUARIUM);
  const aquariumDecoded = browserDecode(aquariumFetch.bytes, SOURCES.AQUARIUM.id, []);
  const campFetch = await fetchCanonical(SOURCES.CAMPANELLA);
  const campDecoded = browserDecode(campFetch.bytes, SOURCES.CAMPANELLA.id, CAMPANELLA_WINDOWS);
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'PASS_CLOSED',
    executionHolder,
    sources: {
      AQUARIUM: {
        sourceId: SOURCES.AQUARIUM.id, canonicalUrl: SOURCES.AQUARIUM.url, finalUrl: aquariumFetch.finalUrl,
        rights: SOURCES.AQUARIUM.rights, role: SOURCES.AQUARIUM.role, bytes: aquariumFetch.bytes.length,
        sha256: sha256(aquariumFetch.bytes), contentType: aquariumFetch.contentType,
        decode: { durationSeconds: aquariumDecoded.durationSeconds, sampleRate: aquariumDecoded.sampleRate, channels: aquariumDecoded.channels, frames: aquariumDecoded.frames, chrome: aquariumDecoded.chrome }
      },
      CAMPANELLA: {
        sourceId: SOURCES.CAMPANELLA.id, canonicalUrl: SOURCES.CAMPANELLA.url, finalUrl: campFetch.finalUrl,
        rights: SOURCES.CAMPANELLA.rights, role: SOURCES.CAMPANELLA.role, bytes: campFetch.bytes.length,
        sha256: sha256(campFetch.bytes), contentType: campFetch.contentType,
        decode: { durationSeconds: campDecoded.durationSeconds, sampleRate: campDecoded.sampleRate, channels: campDecoded.channels, frames: campDecoded.frames, chrome: campDecoded.chrome },
        waveformInspection: { windows: campDecoded.windows }
      }
    },
    custody: {
      sourceBytesFetchedToTemporaryRunnerStorageOnly: true,
      repositoryAudioBytesWritten: false,
      localMasterPersistencePerformed: false,
      thirdPartyEditingApplicationUsed: false,
      sourceSubstitutionPerformed: false
    },
    repositoryMutationPerformed: false,
    productMutationPerformed: false,
    soundtrackAssemblyPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    publicationPerformed: false
  });
}

function selfTest() {
  const sr = 1000, seconds = 10, n = sr * seconds;
  const a = new Float32Array(n), b = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    const t = i / sr;
    const amp = t >= 4.9 && t < 5.1 ? 0.02 : 0.5;
    a[i] = amp * Math.sin(2 * Math.PI * 7 * t);
    b[i] = amp * Math.sin(2 * Math.PI * 7 * t + 0.1);
  }
  const window = pcmWindowSummary([a, b], sr, 4, 6, 0.05);
  const nearest = [...window.candidates].sort((x, y) => Math.abs(x.time - 5) - Math.abs(y.time - 5))[0];
  const checks = [
    sha256(Buffer.from('abc')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    SOURCES.AQUARIUM.url === 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg',
    SOURCES.CAMPANELLA.url === 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg',
    CAMPANELLA_WINDOWS[0].start === 98 && CAMPANELLA_WINDOWS[0].end === 150,
    CAMPANELLA_WINDOWS[1].start === 317 && CAMPANELLA_WINDOWS[1].end === 337,
    window.binCount === 40,
    window.candidates.length > 0,
    nearest && Math.abs(nearest.time - 5) <= 0.15 && nearest.rms < 0.03
  ];
  return stable({
    schema: SELF_TEST_SCHEMA,
    result: checks.every(Boolean) ? 'PASS_CLOSED' : 'FAIL_CLOSED',
    checkCount: checks.length,
    passed: checks.filter(Boolean).length,
    failed: checks.filter((x) => !x).length,
    checks,
    syntheticValleyCandidate: nearest || null,
    networkFetchPerformed: false,
    chromeInvoked: false,
    repositoryWritePerformed: false,
    sourceUrlsHardBound: true,
    campanellaWindowsHardBound: CAMPANELLA_WINDOWS
  });
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
    if (args.selfTest) {
      const receipt = selfTest();
      writeJson(args.output || null, receipt);
      if (receipt.result !== 'PASS_CLOSED') process.exitCode = 1;
      return;
    }
    const receipt = await inspect(args['execution-holder']);
    writeJson(args.output, receipt);
  } catch (error) {
    const receipt = stable({
      schema: RECEIPT_SCHEMA, result: 'FAIL_CLOSED', errorCode: error.code || 'UNEXPECTED_ERROR', detail: error.detail ?? error.message,
      repositoryMutationPerformed: false, productMutationPerformed: false, soundtrackAssemblyPerformed: false,
      mergePerformed: false, deploymentPerformed: false, publicationPerformed: false
    });
    writeJson(args?.output || null, receipt);
    process.exitCode = 1;
  }
}

await main();
