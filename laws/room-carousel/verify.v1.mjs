#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

const root = new URL("../..", import.meta.url).pathname;
const run = spawnSync("python3", ["scripts/verify-laws-cp6-final-synchronization.py"], {
  cwd: root,
  encoding: "utf8"
});
if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);
if (run.status !== 0) process.exit(run.status || 1);

console.log(JSON.stringify({
  contract: "LAWS_LAYERED_INFORMATION_GRID_VERIFIER_ENTRY_v3",
  status: "PASS",
  routes: 29,
  cards: 134,
  cells: 1653,
  browserCommand: "node laws/room-carousel/verify-contextual-delivery.v2.mjs --base-url=http://127.0.0.1:4173"
}));
