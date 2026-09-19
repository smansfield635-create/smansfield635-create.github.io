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
    rights: 'CC_BY_SA_2_0',
    commonsTitle: 'File:Saint-Saens - The Carnival of the Animals - 07 Aquarium.ogg',
    expectedDurationSeconds: 148.006893424036,
    durationToleranceSeconds: 0.05
  }),
  CAMPANELLA: Object.freeze({
    id: 'AUD_02_LA_CAMPANELLA_GREISS_CANONICAL',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg',
    role: 'EMERGENCE_ASCENT_CLIMAX_STRUCTURAL_DROP',
    rights: 'PUBLIC_DOMAIN_RECORDING_VRT_CONFIRMED',
    commonsTitle: 'File:Liszt-La Campanella-Greiss.ogg',
    expectedDurationSeconds: 372,
    durationToleranceSeconds: 1
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
function sha1(bytes) { return crypto.createHash('sha1').update(bytes).digest('hex'); }
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

function chromeParsedValueType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function markerPositions(text, marker, limit = 32) {
  const out = [];
  for (let at = 0; out.length < limit;) {
    const found = text.indexOf(marker, at);
    if (found < 0) break;
    out.push(found);
    at = found + marker.length;
  }
  return out;
}

function chromeDecodeCandidateSummary(candidate) {
  return {
    beginIndex: candidate.beginIndex,
    endIndex: candidate.endIndex,
    parsed: candidate.parsed,
    parsedType: candidate.parsedType,
    ownKeys: candidate.ownKeys,
    stringLength: candidate.stringLength,
    parseError: candidate.parseError
  };
}

function selectChromeDecodedResult(out, markerA, markerZ, sourceId) {
  const beginPositions = markerPositions(out, markerA);
  const endPositions = markerPositions(out, markerZ);
  if (beginPositions.length === 0 || endPositions.length === 0) {
    fail('CHROME_DECODE_RESULT_MISSING', {
      sourceId,
      markerBeginCount: beginPositions.length,
      markerEndCount: endPositions.length,
      stdoutLength: out.length
    });
  }

  const candidates = [];
  for (const beginIndex of beginPositions) {
    const payloadStart = beginIndex + markerA.length;
    const endIndex = out.indexOf(markerZ, payloadStart);
    if (endIndex < 0) continue;
    const raw = out.slice(payloadStart, endIndex);
    let parsedValue = null;
    let parseError = null;
    try {
      parsedValue = JSON.parse(raw);
    } catch (error) {
      parseError = error.message;
    }
    const parsedType = parseError ? 'parse_error' : chromeParsedValueType(parsedValue);
    const ownKeys = !parseError && parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? Object.keys(parsedValue).sort().slice(0, 32)
      : [];
    candidates.push({
      beginIndex,
      endIndex,
      parsedValue,
      parsedType,
      ownKeys,
      parsed: !parseError,
      stringLength: parsedType === 'string' ? parsedValue.length : null,
      parseError
    });
  }

  const objects = candidates.filter((candidate) =>
    candidate.parsed &&
    candidate.parsedValue &&
    typeof candidate.parsedValue === 'object' &&
    !Array.isArray(candidate.parsedValue)
  );
  const sourceMatched = objects.filter((candidate) =>
    candidate.parsedValue?.sourceId === sourceId || typeof candidate.parsedValue?.error === 'string'
  );
  const eligible = sourceMatched.length === 1 ? sourceMatched : objects;

  if (eligible.length !== 1) {
    fail('CHROME_DECODE_RESULT_SHAPE_INVALID', {
      sourceId,
      markerBeginCount: beginPositions.length,
      markerEndCount: endPositions.length,
      candidateCount: candidates.length,
      objectCandidateCount: objects.length,
      sourceMatchedObjectCount: sourceMatched.length,
      candidates: candidates.slice(0, 8).map(chromeDecodeCandidateSummary)
    });
  }

  return {
    decoded: eligible[0].parsedValue,
    diagnostics: {
      markerBeginCount: beginPositions.length,
      markerEndCount: endPositions.length,
      candidateCount: candidates.length,
      objectCandidateCount: objects.length,
      selectedBeginIndex: eligible[0].beginIndex,
      selectedEndIndex: eligible[0].endIndex,
      selectedOwnKeys: eligible[0].ownKeys,
      candidates: candidates.slice(0, 8).map(chromeDecodeCandidateSummary)
    }
  };
}

function validateChromeDecodedShape(sourceId, decoded, selectionDiagnostics) {
  const ownKeys = decoded && typeof decoded === 'object' && !Array.isArray(decoded)
    ? Object.keys(decoded).sort()
    : [];
  const required = ['sourceId', 'durationSeconds', 'sampleRate', 'channels', 'frames', 'windows'];
  const missingKeys = required.filter((key) => !Object.hasOwn(decoded ?? {}, key));
  const evidence = {
    sourceId,
    parsedValueType: chromeParsedValueType(decoded),
    ownKeys: ownKeys.slice(0, 32),
    missingKeys,
    sourceIdMatches: decoded?.sourceId === sourceId,
    durationSecondsFinite: Number.isFinite(decoded?.durationSeconds),
    sampleRateFinite: Number.isFinite(decoded?.sampleRate),
    channelsFinite: Number.isFinite(decoded?.channels),
    framesFinite: Number.isFinite(decoded?.frames),
    windowsIsArray: Array.isArray(decoded?.windows),
    windowCount: Array.isArray(decoded?.windows) ? decoded.windows.length : null,
    markerSelection: selectionDiagnostics
  };
  const valid =
    decoded &&
    typeof decoded === 'object' &&
    !Array.isArray(decoded) &&
    missingKeys.length === 0 &&
    decoded.sourceId === sourceId &&
    Number.isFinite(decoded.durationSeconds) && decoded.durationSeconds > 0 &&
    Number.isFinite(decoded.sampleRate) && decoded.sampleRate > 0 &&
    Number.isInteger(decoded.channels) && decoded.channels > 0 &&
    Number.isInteger(decoded.frames) && decoded.frames > 0 &&
    Array.isArray(decoded.windows);
  if (!valid) fail('CHROME_DECODE_RESULT_SHAPE_INVALID', evidence);
  return evidence;
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
    const selection = selectChromeDecodedResult(out, markerA, markerZ, sourceId);
    const decoded = selection.decoded;
    if (decoded?.error) fail('CHROME_AUDIO_DECODE_FAILED', { sourceId, error: decoded.error, markerSelection: selection.diagnostics });
    validateChromeDecodedShape(sourceId, decoded, selection.diagnostics);
    return { chrome, ...decoded };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function normalizeCommonsAuthorityUrl(rawUrl, source) {
  let authorityUrl, canonicalUrl;
  try {
    authorityUrl = new URL(rawUrl);
    canonicalUrl = new URL(source.url);
  } catch (error) {
    fail('COMMONS_AUTHORITY_URL_INVALID', { sourceId: source.id, detail: error.message });
  }
  if (
    authorityUrl.protocol !== canonicalUrl.protocol ||
    authorityUrl.hostname !== canonicalUrl.hostname ||
    authorityUrl.port !== canonicalUrl.port ||
    authorityUrl.username !== '' ||
    authorityUrl.password !== '' ||
    authorityUrl.pathname !== canonicalUrl.pathname
  ) {
    fail('COMMONS_AUTHORITY_URL_MISMATCH', { sourceId: source.id, expected: source.url, actual: rawUrl });
  }
  if (authorityUrl.hash !== '') fail('COMMONS_AUTHORITY_URL_FRAGMENT_PROHIBITED', { sourceId: source.id, actual: rawUrl });
  const entries = [...authorityUrl.searchParams.entries()];
  if (entries.length > 0) {
    const expected = new Map([
      ['utm_source', 'commons.wikimedia.org'],
      ['utm_campaign', 'imageinfo'],
      ['utm_content', 'original']
    ]);
    const keys = entries.map(([key]) => key);
    if (entries.length !== 3 || new Set(keys).size !== 3) {
      fail('COMMONS_AUTHORITY_QUERY_NOT_AUTHORIZED', { sourceId: source.id, actual: rawUrl });
    }
    for (const [key, value] of entries) {
      if (!expected.has(key) || expected.get(key) !== value) {
        fail('COMMONS_AUTHORITY_QUERY_NOT_AUTHORIZED', { sourceId: source.id, key, value });
      }
    }
  }
  return canonicalUrl.toString();
}

function selfTestRejects(fn, expectedCode) {
  try { fn(); return false; } catch (error) { return error?.code === expectedCode; }
}

async function fetchCommonsAuthority(source) {
  const endpoint = new URL('https://commons.wikimedia.org/w/api.php');
  endpoint.searchParams.set('action', 'query');
  endpoint.searchParams.set('format', 'json');
  endpoint.searchParams.set('prop', 'imageinfo');
  endpoint.searchParams.set('iiprop', 'size|sha1|mime|mediatype|url');
  endpoint.searchParams.set('titles', source.commonsTitle);
  const r = await fetch(endpoint, { redirect: 'error', headers: { 'User-Agent': 'DiamondGateBridge-ThinkAndBlink-AudioCustodyInspector/1.0' } });
  if (!r.ok) fail('COMMONS_AUTHORITY_FETCH_FAILED', { sourceId: source.id, status: r.status });
  let payload;
  try { payload = await r.json(); } catch (e) { fail('COMMONS_AUTHORITY_JSON_INVALID', { sourceId: source.id, detail: e.message }); }
  const pages = Object.values(payload?.query?.pages ?? {});
  const info = pages[0]?.imageinfo?.[0];
  if (!info) fail('COMMONS_AUTHORITY_IMAGEINFO_MISSING', source.id);
  const authority = {
    url: String(info.url ?? ''),
    normalizedUrl: null,
    size: Number(info.size),
    sha1: String(info.sha1 ?? '').toLowerCase(),
    mime: String(info.mime ?? '').toLowerCase(),
    mediatype: String(info.mediatype ?? '').toUpperCase()
  };
  authority.normalizedUrl = normalizeCommonsAuthorityUrl(authority.url, source);
  if (!Number.isSafeInteger(authority.size) || authority.size < 1024) fail('COMMONS_AUTHORITY_SIZE_INVALID', { sourceId: source.id, size: authority.size });
  if (!/^[0-9a-f]{40}$/.test(authority.sha1)) fail('COMMONS_AUTHORITY_SHA1_INVALID', { sourceId: source.id, sha1: authority.sha1 });
  if (authority.mime !== 'application/ogg' || authority.mediatype !== 'AUDIO') fail('COMMONS_AUTHORITY_MEDIA_TYPE_MISMATCH', { sourceId: source.id, mime: authority.mime, mediatype: authority.mediatype });
  return authority;
}

function decodedWindowInventory(decoded) {
  const windows = Array.isArray(decoded?.windows) ? decoded.windows : [];
  return {
    durationSeconds: Number.isFinite(decoded?.durationSeconds) ? decoded.durationSeconds : null,
    sampleRate: Number.isFinite(decoded?.sampleRate) ? decoded.sampleRate : null,
    channels: Number.isFinite(decoded?.channels) ? decoded.channels : null,
    frames: Number.isFinite(decoded?.frames) ? decoded.frames : null,
    windowCount: windows.length,
    windows: windows.map((window) => {
      const bins = Array.isArray(window?.bins) ? window.bins : [];
      const candidates = Array.isArray(window?.candidates) ? window.candidates : [];
      return {
        id: typeof window?.id === 'string' ? window.id : null,
        start: Number.isFinite(window?.start) ? window.start : null,
        end: Number.isFinite(window?.end) ? window.end : null,
        binSeconds: Number.isFinite(window?.binSeconds) ? window.binSeconds : null,
        binCount: Number.isFinite(window?.binCount) ? window.binCount : null,
        binsLength: bins.length,
        candidatesLength: candidates.length,
        firstStart: bins.length > 0 && Number.isFinite(bins[0]?.start) ? bins[0].start : null,
        lastEnd: bins.length > 0 && Number.isFinite(bins[bins.length - 1]?.end) ? bins[bins.length - 1].end : null
      };
    })
  };
}

function validateDecodedIdentity(source, decoded, windows = []) {
  if (!Number.isFinite(decoded?.durationSeconds)) {
    fail('DECODED_DURATION_MISSING_OR_NONFINITE', { sourceId: source.id, actual: decoded?.durationSeconds ?? null, decodedWindowInventory: decodedWindowInventory(decoded) });
  }
  if (Math.abs(decoded.durationSeconds - source.expectedDurationSeconds) > source.durationToleranceSeconds) {
    fail('DECODED_DURATION_MISMATCH', { sourceId: source.id, expected: source.expectedDurationSeconds, tolerance: source.durationToleranceSeconds, actual: decoded.durationSeconds });
  }
  for (const requested of windows) {
    const observed = decoded.windows?.find((x) => x.id === requested.id);
    if (!observed || !(observed.binCount > 0) || !Array.isArray(observed.bins) || observed.bins.length !== observed.binCount) {
      fail('WAVEFORM_WINDOW_EMPTY', { sourceId: source.id, windowId: requested.id, decodedWindowInventory: decodedWindowInventory(decoded) });
    }
    const first = observed.bins[0], last = observed.bins[observed.bins.length - 1];
    if (first.start > requested.start + requested.binSeconds || last.end < requested.end - requested.binSeconds) {
      fail('WAVEFORM_WINDOW_NOT_FULLY_COVERED', { sourceId: source.id, windowId: requested.id, firstStart: first.start, lastEnd: last.end });
    }
    if (!Array.isArray(observed.candidates) || observed.candidates.length < 1) {
      fail('WAVEFORM_CANDIDATE_EVIDENCE_MISSING', { sourceId: source.id, windowId: requested.id });
    }
  }
}

async function fetchCanonical(source, authority) {
  const url = new URL(source.url);
  if (url.protocol !== 'https:' || url.hostname !== 'upload.wikimedia.org') fail('SOURCE_URL_NOT_CANONICAL', source.id);
  const r = await fetch(source.url, { redirect: 'follow', headers: { 'User-Agent': 'DiamondGateBridge-ThinkAndBlink-AudioCustodyInspector/1.0' } });
  if (!r.ok) fail('SOURCE_FETCH_FAILED', { sourceId: source.id, status: r.status });
  if (r.url !== source.url || authority.normalizedUrl !== source.url) fail('SOURCE_FINAL_URL_MISMATCH', { sourceId: source.id, expected: source.url, actual: r.url, authorityRawUrl: authority.url, authorityNormalizedUrl: authority.normalizedUrl });
  const contentType = String(r.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase();
  if (!['application/ogg', 'audio/ogg'].includes(contentType)) fail('SOURCE_CONTENT_TYPE_MISMATCH', { sourceId: source.id, contentType });
  const bytes = Buffer.from(await r.arrayBuffer());
  if (bytes.length !== authority.size) fail('SOURCE_BYTE_COUNT_MISMATCH', { sourceId: source.id, expected: authority.size, actual: bytes.length });
  if (bytes.subarray(0, 4).toString('ascii') !== 'OggS') fail('SOURCE_OGG_SIGNATURE_MISSING', source.id);
  const actualSha1 = sha1(bytes);
  if (actualSha1 !== authority.sha1) fail('SOURCE_SHA1_AUTHORITY_MISMATCH', { sourceId: source.id, expected: authority.sha1, actual: actualSha1 });
  return { bytes, finalUrl: r.url, contentType, authority };
}

async function inspect(executionHolder) {
  const aquariumAuthority = await fetchCommonsAuthority(SOURCES.AQUARIUM);
  const aquariumFetch = await fetchCanonical(SOURCES.AQUARIUM, aquariumAuthority);
  const aquariumDecoded = browserDecode(aquariumFetch.bytes, SOURCES.AQUARIUM.id, []);
  validateDecodedIdentity(SOURCES.AQUARIUM, aquariumDecoded, []);
  const campAuthority = await fetchCommonsAuthority(SOURCES.CAMPANELLA);
  const campFetch = await fetchCanonical(SOURCES.CAMPANELLA, campAuthority);
  const campDecoded = browserDecode(campFetch.bytes, SOURCES.CAMPANELLA.id, CAMPANELLA_WINDOWS);
  validateDecodedIdentity(SOURCES.CAMPANELLA, campDecoded, CAMPANELLA_WINDOWS);
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'PASS_CLOSED',
    executionHolder,
    sources: {
      AQUARIUM: {
        sourceId: SOURCES.AQUARIUM.id, canonicalUrl: SOURCES.AQUARIUM.url, finalUrl: aquariumFetch.finalUrl,
        rights: SOURCES.AQUARIUM.rights, role: SOURCES.AQUARIUM.role, bytes: aquariumFetch.bytes.length,
        sha256: sha256(aquariumFetch.bytes), sha1: sha1(aquariumFetch.bytes), contentType: aquariumFetch.contentType,
        sourceAuthority: aquariumFetch.authority,
        decode: { durationSeconds: aquariumDecoded.durationSeconds, expectedDurationSeconds: SOURCES.AQUARIUM.expectedDurationSeconds, durationToleranceSeconds: SOURCES.AQUARIUM.durationToleranceSeconds, sampleRate: aquariumDecoded.sampleRate, channels: aquariumDecoded.channels, frames: aquariumDecoded.frames, chrome: aquariumDecoded.chrome }
      },
      CAMPANELLA: {
        sourceId: SOURCES.CAMPANELLA.id, canonicalUrl: SOURCES.CAMPANELLA.url, finalUrl: campFetch.finalUrl,
        rights: SOURCES.CAMPANELLA.rights, role: SOURCES.CAMPANELLA.role, bytes: campFetch.bytes.length,
        sha256: sha256(campFetch.bytes), sha1: sha1(campFetch.bytes), contentType: campFetch.contentType,
        sourceAuthority: campFetch.authority,
        decode: { durationSeconds: campDecoded.durationSeconds, expectedDurationSeconds: SOURCES.CAMPANELLA.expectedDurationSeconds, durationToleranceSeconds: SOURCES.CAMPANELLA.durationToleranceSeconds, sampleRate: campDecoded.sampleRate, channels: campDecoded.channels, frames: campDecoded.frames, chrome: campDecoded.chrome },
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
  const diagnosticInventory = decodedWindowInventory({
    durationSeconds: 10,
    sampleRate: sr,
    channels: 2,
    frames: n,
    windows: [{ id: 'SELF_TEST_WINDOW', start: 4, end: 6, binSeconds: 0.05, binCount: window.binCount, bins: window.bins, candidates: window.candidates }]
  });
  const markerA = '__THINK_BLINK_RESULT_BEGIN__';
  const markerZ = '__THINK_BLINK_RESULT_END__';
  const syntheticDecoded = {
    sourceId: 'SELF_TEST_SOURCE',
    durationSeconds: 10,
    sampleRate: sr,
    channels: 2,
    frames: n,
    windows: []
  };
  const falseScriptCandidate = markerA + JSON.stringify('+JSON.stringify(result)+') + markerZ;
  const trueObjectCandidate = markerA + JSON.stringify(syntheticDecoded) + markerZ;
  const selectionFixture = selectChromeDecodedResult(falseScriptCandidate + '\n' + trueObjectCandidate, markerA, markerZ, 'SELF_TEST_SOURCE');
  const selectionShape = validateChromeDecodedShape('SELF_TEST_SOURCE', selectionFixture.decoded, selectionFixture.diagnostics);
  const malformedShapeRejected = selfTestRejects(
    () => validateChromeDecodedShape('SELF_TEST_SOURCE', {
      sourceId: 'SELF_TEST_SOURCE',
      durationSeconds: null,
      sampleRate: null,
      channels: null,
      frames: null,
      windows: []
    }, { synthetic: true }),
    'CHROME_DECODE_RESULT_SHAPE_INVALID'
  );
  const primitiveOnlyRejected = selfTestRejects(
    () => selectChromeDecodedResult(falseScriptCandidate, markerA, markerZ, 'SELF_TEST_SOURCE'),
    'CHROME_DECODE_RESULT_SHAPE_INVALID'
  );
  const missingDurationRejected = selfTestRejects(
    () => validateDecodedIdentity({ id: 'SELF_TEST_SOURCE', expectedDurationSeconds: 10, durationToleranceSeconds: 0.1 }, { durationSeconds: undefined, windows: [] }, []),
    'DECODED_DURATION_MISSING_OR_NONFINITE'
  );
  const checks = [
    sha256(Buffer.from('abc')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    sha1(Buffer.from('abc')) === 'a9993e364706816aba3e25717850c26c9cd0d89d',
    SOURCES.AQUARIUM.url === 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg',
    SOURCES.CAMPANELLA.url === 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg',
    CAMPANELLA_WINDOWS[0].start === 98 && CAMPANELLA_WINDOWS[0].end === 150,
    CAMPANELLA_WINDOWS[1].start === 317 && CAMPANELLA_WINDOWS[1].end === 337,
    SOURCES.AQUARIUM.expectedDurationSeconds === 148.006893424036 && SOURCES.AQUARIUM.durationToleranceSeconds === 0.05,
    SOURCES.CAMPANELLA.expectedDurationSeconds === 372 && SOURCES.CAMPANELLA.durationToleranceSeconds === 1,
    normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url, SOURCES.AQUARIUM) === SOURCES.AQUARIUM.url,
    normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url + '?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original', SOURCES.AQUARIUM) === SOURCES.AQUARIUM.url,
    normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url + '?utm_content=original&utm_source=commons.wikimedia.org&utm_campaign=imageinfo', SOURCES.AQUARIUM) === SOURCES.AQUARIUM.url,
    selfTestRejects(() => normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url + '?utm_source=evil&utm_campaign=imageinfo&utm_content=original', SOURCES.AQUARIUM), 'COMMONS_AUTHORITY_QUERY_NOT_AUTHORIZED'),
    selfTestRejects(() => normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url + '?utm_source=commons.wikimedia.org&utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original', SOURCES.AQUARIUM), 'COMMONS_AUTHORITY_QUERY_NOT_AUTHORIZED'),
    selfTestRejects(() => normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url + '#fragment', SOURCES.AQUARIUM), 'COMMONS_AUTHORITY_URL_FRAGMENT_PROHIBITED'),
    selfTestRejects(() => normalizeCommonsAuthorityUrl(SOURCES.AQUARIUM.url.replace('07_Aquarium.ogg', '08_Aquarium.ogg'), SOURCES.AQUARIUM), 'COMMONS_AUTHORITY_URL_MISMATCH'),
    window.binCount === 40,
    window.candidates.length > 0,
    nearest && Math.abs(nearest.time - 5) <= 0.15 && nearest.rms < 0.03,
    diagnosticInventory.durationSeconds === 10 &&
      diagnosticInventory.sampleRate === sr &&
      diagnosticInventory.channels === 2 &&
      diagnosticInventory.frames === n &&
      diagnosticInventory.windowCount === 1 &&
      diagnosticInventory.windows[0]?.id === 'SELF_TEST_WINDOW' &&
      diagnosticInventory.windows[0]?.binCount === window.binCount &&
      diagnosticInventory.windows[0]?.binsLength === window.bins.length &&
      diagnosticInventory.windows[0]?.candidatesLength === window.candidates.length &&
      diagnosticInventory.windows[0]?.firstStart === 4 &&
      diagnosticInventory.windows[0]?.lastEnd === 6,
    selectionFixture.decoded?.sourceId === 'SELF_TEST_SOURCE' &&
      selectionFixture.diagnostics.markerBeginCount === 2 &&
      selectionFixture.diagnostics.objectCandidateCount === 1 &&
      selectionFixture.diagnostics.candidates.some((candidate) => candidate.parsedType === 'string') &&
      selectionShape.durationSecondsFinite === true &&
      selectionShape.windowsIsArray === true,
    malformedShapeRejected,
    primitiveOnlyRejected,
    missingDurationRejected
  ];
  return stable({
    schema: SELF_TEST_SCHEMA,
    result: checks.every(Boolean) ? 'PASS_CLOSED' : 'FAIL_CLOSED',
    checkCount: checks.length,
    passed: checks.filter(Boolean).length,
    failed: checks.filter((x) => !x).length,
    checks,
    syntheticValleyCandidate: nearest || null,
    decodedWindowInventoryDiagnostic: diagnosticInventory,
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
