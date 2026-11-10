/**
 * Exact-SHA owner-private first-party Sculpt Lab integration. No R63 mesh,
 * approved artwork, editor HTML, animation poses, or generated HTML is tracked.
 * Inserting a new-face dispatch leaves the original r63CheckCandidateGeometry
 * implementation byte-for-byte intact for legacy/source-derived submissions.
 */
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {
  R63_ACCEPTED_SHA256,
  R63_PRIVATE_SCULPT_LAB_SHA256,
  validateTwoClassCandidate
} from './r63-authored-face-contract.v1.mjs';

const h256 = value => createHash('sha256').update(value).digest('hex');
const ORIGINAL_DISPATCH = 'qa=r63CheckCandidateGeometry(candidate,base,repl)';
const ORIGINAL_COMMIT = 'provenance:c.provenance});redo=[]';
const ORIGINAL_REJECTED_PROOF = 'orderedChangedOriginalR63Faces:repl.provenance.slice(),';
const ORIGINAL_BIND = 'window.__LARGE_REGION__.bindCurrentR63=r63Bind;';

function exactOnce(source, phrase) {
  const first = source.indexOf(phrase);
  if (first < 0 || source.indexOf(phrase, first + phrase.length) >= 0) {
    throw new Error('GH_R63_INTEGRATION_ANCHOR_MISSING_OR_AMBIGUOUS:' + phrase.slice(0, 64));
  }
}

export function attachAuthenticatedFaceLineage(proposal, faceLineage) {
  if (!proposal || !Array.isArray(proposal.faces) || !Array.isArray(faceLineage) || proposal.faces.length !== faceLineage.length) {
    throw new Error('GH_R63_LINEAGE_FACE_ALIGNMENT');
  }
  return {
    ...proposal,
    faceLineage: faceLineage.map(x => JSON.parse(JSON.stringify(x))),
    provenance: faceLineage.map(x => x?.class === 'NEW_AUTHORED_FACE' ? null : x?.sourceParent)
  };
}

export function integratePrivateSculptLab(privateHtml) {
  if (typeof privateHtml !== 'string') throw new TypeError('Private Sculpt Lab must be UTF-8 text');
  const sourceDigest = h256(Buffer.from(privateHtml, 'utf8'));
  if (sourceDigest !== R63_PRIVATE_SCULPT_LAB_SHA256) {
    throw new Error('GH_R63_PRIVATE_EDITOR_SHA256_MISMATCH:' + sourceDigest);
  }
  for (const anchor of [ORIGINAL_DISPATCH, ORIGINAL_COMMIT, ORIGINAL_REJECTED_PROOF, ORIGINAL_BIND]) exactOnce(privateHtml, anchor);
  // Pure self-contained function; no script-src, module resolution, fetch, or
  // external asset loads in the private, file-backed Chromium/WebGL2 editor.
  const twoClass = validateTwoClassCandidate.toString();
  const ctx = `{
    exactAcceptedSourceSHA256:EXACT_R63_PARENT_SHA,
    expectedRegionId:'R63_EXACT_408_FACES_54_BOUNDARY',
    expectedKeptFaces:2100,expectedSelectedFaces:408,expectedBoundaryLength:54,
    expectedOriginalSourceStitches:89,originalSourceProtectionFaceCount:1467,
    originalPositions:accepted,originalIndices:faces,originalUV:uvSource,
    originalSources:sourceOfCandidate,patchAuditMesh,inspectSurfaceIntersections
  }`;
  const replacement = `qa=(repl.faceLineage?.some(x=>x?.class==='NEW_AUTHORED_FACE')) ?
    (${twoClass})(candidate,base,repl,${ctx}) :
    r63CheckCandidateGeometry(candidate,base,repl)`;
  let html = privateHtml.replace(ORIGINAL_DISPATCH, replacement);
  // The original-parent validator's definition is not patched or rewritten.
  // Preserve authored identities on a future authorized undo/redo operation.
  // This is not an authorization to KEEP or save an R64 candidate.
  html = html.replace(ORIGINAL_COMMIT, `provenance:c.provenance,...(repl.faceLineage?.some(x=>x?.class==='NEW_AUTHORED_FACE')?{newAuthoredFaceLineage:JSON.parse(JSON.stringify(repl.faceLineage))}:{})});redo=[]`);
  html = html.replace(ORIGINAL_REJECTED_PROOF, `orderedChangedOriginalR63Faces:repl.provenance.slice(),rejectedFaceLineage:repl.faceLineage?JSON.parse(JSON.stringify(repl.faceLineage)):null,`);
  html = html.replace(ORIGINAL_BIND, `window.__GH_R63_TWO_CLASS_GATE__={schema:'GH_R63_TWO_CLASS_NATIVE_GATE_V1',parent:'${R63_ACCEPTED_SHA256}',privateSourceSHA256:'${R63_PRIVATE_SCULPT_LAB_SHA256}',newFaceGateInstalled:true,originalSourceValidatorUnchanged:true,automaticR64Save:false};\n${ORIGINAL_BIND}`);
  const originalValidatorStart = privateHtml.indexOf('function r63CheckCandidateGeometry(');
  const originalValidatorEnd = privateHtml.indexOf('async function r63BuildExplicit(', originalValidatorStart);
  const originalValidator = privateHtml.slice(originalValidatorStart, originalValidatorEnd);
  if (!html.includes(originalValidator)) throw new Error('GH_R63_ORIGINAL_VALIDATOR_BYTE_SPAN_ALTERED');
  return Object.freeze({
    html,
    sourceSHA256: sourceDigest,
    derivedSHA256: h256(Buffer.from(html, 'utf8')),
    sourceValidatorSpanSHA256: h256(Buffer.from(originalValidator, 'utf8')),
    sourceBytesPreserved: true,
    scope: 'DISPOSABLE_PRIVATE_HTML_ONLY_NO_REPOSITORY_OR_R64_SAVE'
  });
}

function cli() {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== '--private-html' || args[2] !== '--output') throw new Error('Expected --private-html PATH --output PATH');
  const source = path.resolve(args[1]), destination = path.resolve(args[3]);
  if (destination === source || destination.includes('/characters/generosity-harvest/engineering/')) throw new Error('GH_R63_PRIVATE_OUTPUT_MUST_STAY_OUTSIDE_SOURCE_REPOSITORY');
  const derivation = integratePrivateSculptLab(fs.readFileSync(source, 'utf8'));
  fs.mkdirSync(path.dirname(destination), {recursive: true}); fs.writeFileSync(destination, derivation.html, 'utf8');
  process.stdout.write(JSON.stringify({schema:'GH_R63_EXACT_PRIVATE_BINDING_RECEIPT_V1',result:'BOUND_PRIVATE_DISPOSABLE',sourceSHA256:derivation.sourceSHA256,derivedSHA256:derivation.derivedSHA256,sourceValidatorSpanSHA256:derivation.sourceValidatorSpanSHA256,scope:derivation.scope},null,2) + '\n');
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) cli();
