#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../../..");
const MANIFEST_REL = "products/on-your-side-ai/native-chat/integrity-index/source-manifest.v1.json";
const INDEX_REL = "products/on-your-side-ai/native-chat/integrity-index/index.v1.json";

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const render = value => JSON.stringify(stable(value), null, 2) + "\n";

function gitHash(relative) {
  const r = spawnSync("git", ["hash-object", relative], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) throw new Error("GIT_HASH_FAILED:" + relative);
  return r.stdout.trim();
}

function requireSourceText(source) {
  const absolute = path.join(ROOT, source.repositoryPath);
  const contents = fs.readFileSync(absolute, "utf8");
  if (!contents.includes(source.canonicalTitle)) throw new Error("SOURCE_TITLE_DRIFT:" + source.sourceId);
  if (!contents.includes(source.canonicalDescription)) throw new Error("SOURCE_DESCRIPTION_DRIFT:" + source.sourceId);
  const observedBlob = gitHash(source.repositoryPath);
  if (observedBlob !== source.sourceBlob) {
    throw new Error("SOURCE_BLOB_DRIFT:" + source.sourceId + ":" + observedBlob);
  }
}

function build() {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, MANIFEST_REL), "utf8"));
  if (manifest.schema !== "DG_INTEGRITY_SOURCE_MANIFEST_v1") throw new Error("MANIFEST_SCHEMA_MISMATCH");
  if (manifest.providerId !== "DG_INTEGRITY_INDEX_V1") throw new Error("MANIFEST_PROVIDER_MISMATCH");
  if (manifest.coverageClass !== "BOOTSTRAP_FIRST_PARTY_ONLY") throw new Error("MANIFEST_COVERAGE_MISMATCH");
  if (!Array.isArray(manifest.sources) || manifest.sources.length === 0) throw new Error("MANIFEST_EMPTY");
  for (const source of manifest.sources) requireSourceText(source);
  const manifestBlob = gitHash(MANIFEST_REL);
  return stable({
    schema: "DG_INTEGRITY_INDEX_v1",
    indexId: "DGB_ON_YOUR_SIDE_AAI_BOOTSTRAP_INDEX_V1",
    providerId: "DG_INTEGRITY_INDEX_V1",
    coverageClass: "BOOTSTRAP_FIRST_PARTY_ONLY",
    sourceManifestBlob: manifestBlob,
    sourceCount: manifest.sources.length,
    generationMode: "DETERMINISTIC_REPOSITORY_SOURCE_BLOBS_NO_CLOCK",
    entries: manifest.sources.map((source, index) => stable({
      evidenceId: "IDX-" + String(index + 1).padStart(3, "0"),
      sourceId: source.sourceId,
      sourceIdentity: source.sourceIdentity,
      url: source.publicUrl,
      title: source.canonicalTitle,
      excerpt: source.canonicalDescription,
      sourcePath: source.repositoryPath,
      sourceBlob: source.sourceBlob,
      sourceClass: source.sourceClass,
      provenanceFamily: source.provenanceFamily,
      searchTerms: source.searchTerms
    }))
  });
}

const generated = render(build());
const check = process.argv.includes("--check");
const target = path.join(ROOT, INDEX_REL);
if (check) {
  const existing = fs.readFileSync(target, "utf8");
  if (existing !== generated) {
    process.stderr.write("INTEGRITY_INDEX_GENERATED_BYTES_MISMATCH\n");
    process.exitCode = 1;
  } else {
    process.stdout.write(JSON.stringify({
      schema: "DG_INTEGRITY_INDEX_BUILD_RECEIPT_v1",
      result: "PASS",
      indexBlob: gitHash(INDEX_REL)
    }, null, 2) + "\n");
  }
} else {
  fs.writeFileSync(target, generated);
  process.stdout.write(generated);
}
