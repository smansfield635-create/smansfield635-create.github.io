#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { StateBoundAdmissibilityKernel } from './kernel.mjs';

class FileReplayStore {
  constructor(root) { this.root = path.resolve(root); fs.mkdirSync(this.root, { recursive: true }); }
  file(id) { return path.join(this.root, `${id}.consumed`); }
  isConsumed(id) { return fs.existsSync(this.file(id)); }
  consume(id) {
    try {
      const fd = fs.openSync(this.file(id), 'wx', 0o600);
      fs.writeFileSync(fd, `${new Date().toISOString()}\n`);
      fs.closeSync(fd);
      return true;
    } catch (error) {
      if (error?.code === 'EEXIST') return false;
      throw error;
    }
  }
}

function parse(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]; const value = argv[i + 1];
    if (!['--input', '--output', '--replay-store', '--trusted-key'].includes(key) || value === undefined) throw new Error(`Unknown or incomplete argument: ${key}`);
    out[key.slice(2)] = value;
  }
  if (!out.input || !out['replay-store'] || !out['trusted-key']) throw new Error('Required: --input <json> --trusted-key <public.pem> --replay-store <dir> [--output <json>]');
  return out;
}

const args = parse(process.argv.slice(2));
const input = JSON.parse(fs.readFileSync(args.input, 'utf8'));
const publicKey = crypto.createPublicKey(fs.readFileSync(args['trusted-key'], 'utf8'));
const kernel = new StateBoundAdmissibilityKernel({ replayStore: new FileReplayStore(args['replay-store']), trustedPublicKeys: [publicKey] });
const decision = kernel.enforce(input.capability, input.currentContext);
const text = JSON.stringify(decision, null, 2) + '\n';
if (args.output) { fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true }); fs.writeFileSync(args.output, text); }
else process.stdout.write(text);
process.exitCode = decision.result === 'EXECUTE' ? 0 : 3;
