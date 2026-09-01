name: Shimmer V10A Send Target Rewrite

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  rewrite:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Locate and rewrite active Shimmer source
        shell: bash
        run: |
          node <<'NODE'
          const fs = require("node:fs");
          const path = require("node:path");

          const ROOT = process.cwd();
          const REPORT_DIR = path.join(ROOT, "authority-reports");
          const REPORT_FILE = path.join(REPORT_DIR, "shimmer-v10a-rewrite-report.txt");

          const EXCLUDE_DIRS = new Set([
            ".git",
            "node_modules",
            ".github",
            "tools",
            "authority-reports",
            ".next",
            ".cache",
            ".turbo",
            ".vercel",
            ".netlify"
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
            ".yml",
            ".yaml"
          ]);

          const OLD_ACTIVE = "SHIMMER_LATTICE_G1_V10=ACTIVE";
          const OLD_FAMILY = "SHIMMER_LATTICE_G1_V10";
          const NEW_ACTIVE = "SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE=TRUE";
          const NEW_PROOF = "PUBLIC_PROOF_MARKER=Universal Node · V10A active";

          const report = [];

          function log(line = "") {
            report.push(line);
            console.log(line);
          }

          function ensureDir(dir) {
            fs.mkdirSync(dir, { recursive: true });
          }

          function isExcluded(fullPath) {
            const rel = path.relative(ROOT, fullPath);
            const parts = rel.split(path.sep);
            return parts.some((part) => EXCLUDE_DIRS.has(part));
          }

          function isTextCandidate(fullPath) {
            const ext = path.extname(fullPath).toLowerCase();
            const base = path.basename(fullPath).toLowerCase();

            if (TEXT_EXTENSIONS.has(ext)) return true;
            if (base.includes("shimmer")) return true;
            if (base.includes("frontier")) return true;

            return false;
          }

          function walk(dir, output = []) {
            if (isExcluded(dir)) return output;

            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
              const fullPath = path.join(dir, entry.name);

              if (entry.isDirectory()) {
                walk(fullPath, output);
                continue;
              }

              if (entry.isFile() && isTextCandidate(fullPath)) {
                output.push(fullPath);
              }
            }

            return output;
          }

          function readUtf8(fullPath) {
            const stat = fs.statSync(fullPath);
            if (!stat.isFile()) return null;
            if (stat.size > 8_000_000) return null;

            const buffer = fs.readFileSync(fullPath);
            if (buffer.includes(0)) return null;

            return buffer.toString("utf8");
          }

          function score(text) {
            let score = 0;
            const hits = [];

            const markers = [
              [OLD_ACTIVE, 1000],
              ["Shimmer contract restored to baseline", 500],
              ["BASELINE=THE_WORLD_IS_FLAT", 250],
              ["METHOD=RUSSIAN_DOLL_LABEL_EXPANSION", 250],
              ["Open only the domain needed", 100],
              ["Screen → Highlight → Inspect → Measure → Mitigate → Explain → Repeat", 100],
              ["/explore/frontier/shimmer/", 75],
              ["Shimmer · G1 V10", 75]
            ];

            for (const [marker, weight] of markers) {
              if (text.includes(marker)) {
                score += weight;
                hits.push(marker);
              }
            }

            return { score, hits };
          }

          function rewrite(text) {
            let next = text;

            next = next.replace(/Shimmer · G1 V10(?!A)/g, "Shimmer · G1 V10A");
            next = next.replace(/Diamond Gate Bridge · Frontier · Shimmer\/Lattice · G1 V10(?!A)/g, "Diamond Gate Bridge · Frontier · Shimmer/Lattice · G1 V10A");
            next = next.replace(/Shimmer contract restored to baseline\.?/g, "Universal Node · V10A active.");
            next = next.replace(/SHIMMER_LATTICE_G1_V10=ACTIVE/g, NEW_ACTIVE);
            next = next.replace(/BASELINE=THE_WORLD_IS_FLAT/g, "BASELINE=THE_WORLD_IS_FLAT REVISION=V10A EXPRESSION=UNIVERSAL_NODE");
            next = next.replace(/METHOD=RUSSIAN_DOLL_LABEL_EXPANSION/g, "METHOD=RUSSIAN_DOLL_LABEL_EXPANSION UNIVERSAL_NODE=ACTIVE");
            next = next.replace(/VISIBLE_LENS=PLATFORM_OR_ENGINEERING_URL_ONLY/g, "VISIBLE_LENS=PLATFORM_OR_ENGINEERING_URL_AND_CONTROL");

            if (!next.includes(NEW_PROOF)) {
              if (next.includes(NEW_ACTIVE)) {
                next = next.replace(NEW_ACTIVE, `${NEW_ACTIVE} ${NEW_PROOF}`);
              } else {
                next += `\n${NEW_ACTIVE}\n${NEW_PROOF}\n`;
              }
            }

            if (!next.includes("VISIBLE_TITLE=Shimmer · G1 V10A")) {
              if (next.includes("PUBLIC_PROOF_MARKER=Universal Node · V10A active")) {
                next = next.replace(
                  "PUBLIC_PROOF_MARKER=Universal Node · V10A active",
                  "VISIBLE_TITLE=Shimmer · G1 V10A PUBLIC_PROOF_MARKER=Universal Node · V10A active"
                );
              }
            }

            return next;
          }

          ensureDir(REPORT_DIR);

          log("SHIMMER V10A SEND TARGET REWRITE REPORT");
          log(`Generated: ${new Date().toISOString()}`);
          log(`Repo root: ${ROOT}`);
          log("");

          const files = walk(ROOT);
          const candidates = [];

          for (const file of files) {
            const text = readUtf8(file);
            if (!text) continue;

            const scored = score(text);
            if (scored.score > 0) {
              candidates.push({
                file,
                text,
                score: scored.score,
                hits: scored.hits
              });
            }
          }

          candidates.sort((a, b) => b.score - a.score);

          log("CANDIDATES:");
          if (!candidates.length) {
            log("No Shimmer candidates found.");
          } else {
            for (const candidate of candidates) {
              log("");
              log(`FILE: ${path.relative(ROOT, candidate.file)}`);
              log(`SCORE: ${candidate.score}`);
              log("HITS:");
              for (const hit of candidate.hits) log(`- ${hit}`);
            }
          }

          const exactTargets = candidates.filter((candidate) => candidate.text.includes(OLD_ACTIVE));
          const fallbackTargets = exactTargets.length
            ? exactTargets
            : candidates.filter((candidate) => candidate.text.includes(OLD_FAMILY));

          log("");
          log("SELECTED SEND TARGETS:");

          if (!fallbackTargets.length) {
            log("NONE");
            log("");
            log("RESULT=FAILED_TO_LOCATE_SEND_TARGET");
            log("REQUIRED_SEARCH_STRING=SHIMMER_LATTICE_G1_V10=ACTIVE");
            fs.writeFileSync(REPORT_FILE, report.join("\n"), "utf8");
            process.exit(0);
          }

          for (const target of fallbackTargets) {
            const rel = path.relative(ROOT, target.file);
            const original = target.text;
            const next = rewrite(original);

            log(`- ${rel}`);

            if (next === original) {
              log(`  RESULT=NO_CHANGE`);
              continue;
            }

            const backupPath = `${target.file}.bak-v10a`;
            fs.writeFileSync(backupPath, original, "utf8");
            fs.writeFileSync(target.file, next, "utf8");

            log(`  RESULT=REWRITTEN`);
            log(`  BACKUP=${path.relative(ROOT, backupPath)}`);
            log(`  ACTIVE_CONTRACT=${NEW_ACTIVE}`);
            log(`  PROOF=${NEW_PROOF}`);
          }

          log("");
          log("PUBLIC SUCCESS MARKERS:");
          log("Shimmer · G1 V10A");
          log("SHIMMER_G1_V10A_UNIVERSAL_NODE_ACTIVE");
          log("Universal Node · V10A active");
          log("");
          log("RESULT=COMPLETE");

          fs.writeFileSync(REPORT_FILE, report.join("\n"), "utf8");
          NODE

      - name: Commit authority rewrite
        shell: bash
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"

          git add -A

          if git diff --cached --quiet; then
            echo "No changes to commit."
          else
            git commit -m "Rewrite Shimmer active source to G1 V10A"
            git push
          fi
