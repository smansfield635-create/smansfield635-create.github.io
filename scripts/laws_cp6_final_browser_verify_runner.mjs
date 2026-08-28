import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

await import('./laws_cp6_final_browser_verify.mjs');

const verify = spawnSync(
  process.execPath,
  ['laws/room-carousel/verify-contextual-delivery.v2.mjs', '--base-url=http://127.0.0.1:4173'],
  { stdio: 'inherit', env: { ...process.env } }
);
if (verify.status !== 0) process.exit(verify.status ?? 1);

const source = path.resolve('artifacts/laws-family-editorial-architectural-reconstruction');
const dest = path.resolve('artifacts/laws-cp6-final-synchronization/methods-reference-parity');
fs.mkdirSync(dest, { recursive: true });
if (!fs.existsSync(source)) throw new Error('METHODS_REFERENCE_PARITY_ARTIFACT_SOURCE_MISSING');
for (const name of fs.readdirSync(source)) {
  const from = path.join(source, name);
  const to = path.join(dest, name);
  if (fs.statSync(from).isFile()) fs.copyFileSync(from, to);
}
const captures = fs.readdirSync(dest).filter(name => name.endsWith('.png'));
if (captures.length < 8) throw new Error(`METHODS_REFERENCE_PARITY_CAPTURE_COUNT:${captures.length}`);
console.log(JSON.stringify({ result: 'PASS', methodsReferenceParityCaptures: captures.length, destination: dest }));
