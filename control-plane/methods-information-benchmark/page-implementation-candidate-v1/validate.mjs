import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";
if (!globalThis.crypto) globalThis.crypto = webcrypto;
import { MODEL } from "./candidate/candidate-data.mjs";
import { REQUIRED_FIELDS, sealSnapshot, verifySnapshot } from "./candidate/state.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = relative => fs.readFileSync(path.join(here, relative), "utf8");
const checks = [];
const check = (name, condition, detail = "") => { checks.push({ name, status: condition ? "PASS" : "FAIL", detail }); if (!condition) process.exitCode = 1; };
const ids = new Set(MODEL.records.map(record => record.id));
check("record-count", MODEL.records.length === 25, String(MODEL.records.length));
check("unique-record-identities", ids.size === 25, String(ids.size));
check("family-count", MODEL.families.length === 4, String(MODEL.families.length));
check("lens-count", MODEL.lenses.length === 3, String(MODEL.lenses.length));
check("intent-route-count", MODEL.questionIntentRoutes.length === 16, String(MODEL.questionIntentRoutes.length));
check("dependency-edge-count", MODEL.edges.length === 15, String(MODEL.edges.length));
check("explicit-nonedge-count", MODEL.explicitNonedges.length === 4, String(MODEL.explicitNonedges.length));
check("open-hold-class-count", MODEL.holds.length === 6, String(MODEL.holds.length));
check("source-state-counts", MODEL.records.filter(r => r.sourceState === "confirmed").length === 22 && MODEL.records.filter(r => r.sourceState === "hold").length === 3);
check("family-membership-complete", MODEL.families.flatMap(f => f.recordIds).length === 25 && MODEL.families.every(f => f.recordIds.every(id => ids.has(id))));
check("all-relations-resolve", [...MODEL.edges, ...MODEL.explicitNonedges].every(edge => ids.has(edge.from) && ids.has(edge.to)));
check("all-intent-routes-resolve", MODEL.questionIntentRoutes.every(route => route.recordIds.length && route.recordIds.every(id => ids.has(id))));
check("all-holds-resolve", MODEL.holds.every(hold => hold.recordIds.length && hold.recordIds.every(id => ids.has(id))));
check("record-contract-fields", MODEL.records.every(r => ["id","title","family","equationOrProcedure","sourceState","formalType","computationalBoundary","invocationCondition","causalStatus"].every(k => k in r)));
check("source-binding-head", MODEL.sourceBinding.finalMaterializedCandidateHead === "d84e2a2c0e73ff443993e134f6695d2ab08e4b41");
check("source-package-fingerprint", MODEL.sourceBinding.sourcePackageFingerprint === "4fc8e2280057b426e1573ab5ac4f710e0b0d1881264d443a56fb25b9f560f79e");
check("repository-fingerprint", MODEL.contentVersionFingerprint === "0d5bb1f3b916f3f702dbb77c9b329d721395aedf1a179f680186b2691e35e329");
const html = read("candidate/index.html"), css = read("candidate/styles.css"), app = read("candidate/app.mjs");
check("semantic-main", /<main[^>]+id="corpus"/.test(html));
check("semantic-dialog", /<dialog/.test(html) && /aria-labelledby="inspection-title"/.test(html));
check("live-regions", (html.match(/aria-live=/g) ?? []).length >= 2);
check("keyboard-navigation", /ArrowLeft/.test(app) && /ArrowRight/.test(app) && /Home/.test(app) && /End/.test(app));
check("focus-restoration", /restoreFocus/.test(app) && /focus\(\{ preventScroll: true \}\)/.test(app));
check("reduced-motion", /prefers-reduced-motion/.test(css));
check("responsive-breakpoints", (css.match(/@media \(max-width:/g) ?? []).length >= 2);
check("deep-linking", /searchParams/.test(app) && /record/.test(app) && /intent/.test(app));
check("no-publication-language", /no publication authority/i.test(html));
check("exact-state-field-contract", REQUIRED_FIELDS.length === 13 && REQUIRED_FIELDS.every(field => read("state-schema.v1.json").includes(field)));
const sample = await sealSnapshot({
  contentVersionFingerprint: MODEL.contentVersionFingerprint, entryRoute: "TEST", activeFamily: "pressure", activeLens: "engineering",
  searchAndFilterState: { search: "PCR", intent: "HOW_DO_PRESSURE_AND_CAPACITY_COMPARE" }, orderedSelectionHistory: ["pcr"],
  focusedRecordOrSet: ["pcr"], dependencyNeighborhood: ["pressure-field","capacity-field"], expandedContextPanels: ["holds"],
  scrollAnchor: { x: 0, y: 320 }, viewportOrCameraStateIfSpatial: { mode: "NONSPATIAL_CANDIDATE", x: 0, y: 0, z: 0 },
  deviceInteractionMode: "TEST", returnToken: ""
});
const verified = await verifySnapshot(sample, MODEL.contentVersionFingerprint);
check("exact-return-token-verification", verified.ok, verified.reason);
const stale = await verifySnapshot(sample, "different-version");
check("stale-version-rejected", !stale.ok && stale.reason === "CONTENT_VERSION_MISMATCH", stale.reason);
const invalid = { ...sample, activeFamily: "closure" };
const invalidResult = await verifySnapshot(invalid, MODEL.contentVersionFingerprint);
check("mutated-snapshot-rejected", !invalidResult.ok && invalidResult.reason === "INVALID_RETURN_TOKEN", invalidResult.reason);
console.log(JSON.stringify({ schema: "METHODS_AND_MODELS_CANDIDATE_STATIC_VALIDATION_v1", result: checks.every(c => c.status === "PASS") ? "PASS" : "FAIL", checks }, null, 2));
