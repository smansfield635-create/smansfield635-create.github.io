#!/usr/bin/env node

/**
 * SHIMMER_G1_V10A_AUTHORITY_REWRITE
 *
 * Purpose:
 * Find the real source file currently generating the public Shimmer page by
 * searching for the live old marker:
 *
 *   SHIMMER_LATTICE_G1_V10=ACTIVE
 *
 * Then rewrite that actual source to V10A proof markers.
 *
 * Usage from repo root:
 *
 *   node tools/shimmer-v10a-authority-rewrite.mjs --dry-run
 *   node tools/shimmer-v10a-authority-rewrite.mjs --apply
 *
 * If more than one file is found:
 *
 *   node tools/shimmer-v10a-authority-rewrite.mjs --apply --only path/to/file
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || !args.has("--apply");
const apply = args.has("--apply");

const onlyIndex = process.argv.indexOf("--only");
const onlyPath =
  onlyIndex >= 0 && process.argv[onlyIndex + 1]
    ? path.resolve(ROOT, process.argv[onlyIndex + 1])
    : null;

const EXCLUDED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next/cache",
  ".cache",
  ".turbo",
  ".vercel",
  ".netlify",
]);

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".txt",
  ".php",
  ".liquid",
  ".astro",
  ".vue",
  ".svelte",
]);

const REQUIRED_MARKERS = [
  "SHIMMER_LATTICE_G1_V10=ACTIVE",
  "Shimmer contract restored to baseline",
];

const SUPPORT_MARKERS = [
  "Shimmer · G1 V10",
  "Diamond Gate Bridge · Frontier",
  "/explore/frontier/shimmer/",
  "BASELINE=THE_WORLD_IS_FLAT",
  "METHOD=RUSSIAN_DOLL_LABEL_EXPANSION",
  "Open only the domain needed",
];

const REPLACEMENTS = [
  [
    /Shimmer · G1 V10(?!A)/g,
    "Shimmer · G1 V10A",
  ],
  [
    /Diamond Gate Bridge · Frontier · Shimmer\/Lattice · G1 V10(?!A)/g,
    "Diamond Gate Bridge · Frontier · Shimmer/Lattice · G1 V10A",
  ],
  [
    /Shimmer contract restored to baseline\./g,
    "Universal Node · V10A active.",
  ],
  [
    /SHIMMER_LATTICE_G1_V10=ACTIVE/g,
    "SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE=TRUE",
  ],
  [
    /BASELINE=THE_WORLD_IS_FLAT/g,
    "BASELINE=THE_WORLD_IS_FLAT REVISION=V10A EXPRESSION=UNIVERSAL_NODE",
  ],
  [
    /METHOD=RUSSIAN_DOLL_LABEL_EXPANSION/g,
    "METHOD=RUSSIAN_DOLL_LABEL_EXPANSION UNIVERSAL_NODE=ACTIVE",
  ],
  [
    /VISIBLE_LENS=PLATFORM_OR_ENGINEERING_URL_ONLY/g,
    "VISIBLE_LENS=PLATFORM_OR_ENGINEERING_URL_AND_CONTROL",
  ],
  [
    /CONTEXT_PRESERVED=TRUE/g,
    "CONTEXT_PRESERVED=TRUE V10A_PROOF=TRUE",
  ],
];

function isExcluded(fullPath) {
  const relative = path.relative(ROOT, fullPath);
  const parts = relative.split(path.sep);

  for (const part of parts) {
    if (EXCLUDED_DIRS.has(part)) return true;
  }

  return false;
}

function isTextCandidate(fullPath) {
  const ext = path.extname(fullPath).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;

  const base = path.basename(fullPath);
  return base.includes("shimmer") || base.includes("frontier");
}

function readText(fullPath) {
  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) return null;
  if (stat.size > 8_000_000) return null;

  const buffer = fs.readFileSync(fullPath);
  if (buffer.includes(0)) return null;

  return buffer.toString("utf8");
}

function walk(dir, files = []) {
  if (isExcluded(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (entry.isFile() && isTextCandidate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function scoreContent(text) {
  let score = 0;
  const hits = [];

  for (const marker of REQUIRED_MARKERS) {
    if (text.includes(marker)) {
      score += 100;
      hits.push(marker);
    }
  }

  for (const marker of SUPPORT_MARKERS) {
    if (text.includes(marker)) {
      score += 10;
      hits.push(marker);
    }
  }

  return { score, hits };
}

function ensureProofMarker(text) {
  const proofLine = "PUBLIC_PROOF_MARKER=Universal Node · V10A active";

  if (text.includes(proofLine)) return text;

  const contractLine = "SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE=TRUE";

  if (text.includes(contractLine)) {
    return text.replace(contractLine, `${contractLine}\n${proofLine}`);
  }

  return text;
}

function rewriteText(original) {
  let next = original;

  for (const [pattern, replacement] of REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }

  next = ensureProofMarker(next);

  return next;
}

function main() {
  const files = onlyPath ? [onlyPath] : walk(ROOT);

  const candidates = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const text = readText(file);
    if (!text) continue;

    const result = scoreContent(text);

    if (result.score > 0) {
      candidates.push({
        file,
        score: result.score,
        hits: result.hits,
        text,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  console.log("");
  console.log("SHIMMER V10A AUTHORITY SEARCH");
  console.log("Root:", ROOT);
  console.log("Mode:", dryRun ? "DRY RUN" : "APPLY");
  console.log("");

  if (!candidates.length) {
    console.log("No candidate files found.");
    console.log("");
    console.log("Search manually for:");
    console.log("  SHIMMER_LATTICE_G1_V10=ACTIVE");
    console.log("  Shimmer contract restored to baseline");
    process.exit(1);
  }

  console.log("Candidate files:");
  for (const candidate of candidates) {
    console.log("");
    console.log("-", path.relative(ROOT, candidate.file));
    console.log("  score:", candidate.score);
    console.log("  hits:");
    for (const hit of candidate.hits) {
      console.log("   •", hit);
    }
  }

  const exact = candidates.filter((candidate) =>
    candidate.text.includes("SHIMMER_LATTICE_G1_V10=ACTIVE")
  );

  const targets = onlyPath ? candidates : exact;

  if (!targets.length) {
    console.log("");
    console.log("No exact active-contract file found.");
    console.log("Not applying broad changes.");
    process.exit(1);
  }

  if (dryRun) {
    console.log("");
    console.log("Dry run complete. No files changed.");
    console.log("");
    console.log("To apply:");
    console.log("  node tools/shimmer-v10a-authority-rewrite.mjs --apply");
    console.log("");
    console.log("To target one file:");
    console.log("  node tools/shimmer-v10a-authority-rewrite.mjs --apply --only path/to/file");
    return;
  }

  if (!apply) {
    console.log("");
    console.log("Apply flag missing. No files changed.");
    return;
  }

  console.log("");
  console.log("Applying V10A rewrite to active source file(s):");

  for (const target of targets) {
    const original = target.text;
    const next = rewriteText(original);

    if (next === original) {
      console.log("-", path.relative(ROOT, target.file), "unchanged");
      continue;
    }

    const backup = `${target.file}.bak-v10a`;
    fs.writeFileSync(backup, original, "utf8");
    fs.writeFileSync(target.file, next, "utf8");

    console.log("-", path.relative(ROOT, target.file));
    console.log("  backup:", path.relative(ROOT, backup));
    console.log("  wrote: SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE");
  }

  console.log("");
  console.log("Done.");
  console.log("");
  console.log("Public page should now show:");
  console.log("  Shimmer · G1 V10A");
  console.log("  SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE");
  console.log("  Universal Node · V10A active");
}

main();
