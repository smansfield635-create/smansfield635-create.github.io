import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workflowDir = path.join(root, '.github', 'workflows');
const allowIssueComment = new Set([
  'ai-room-execution-transport.yml',
  'canonical-operation-intake-transport-v1.yml',
  'public-private-successor-execution-v1.yml',
  'public-private-terminal-closure-carrier-v1.yml',
  'remote-operation-terminal-closure-v1.yml',
  'remote-operation-terminal-closure-v2.yml'
]);
const expectedRetained = [...allowIssueComment].sort();
const self = 'issue-comment-fanout-consolidation-v1.yml';

function indentOf(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function hasTopLevelIssueCommentTrigger(lines) {
  const onIndex = lines.findIndex(line => /^on:\s*(?:#.*)?$/.test(line));
  if (onIndex < 0) return false;
  for (let i = onIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = indentOf(line);
    if (indent === 0) break;
    if (/^\s+issue_comment:\s*(?:#.*)?$/.test(line)) return true;
  }
  return false;
}

function stripIssueCommentTrigger(source) {
  const lines = source.split('\n');
  const onIndex = lines.findIndex(line => /^on:\s*(?:#.*)?$/.test(line));
  if (onIndex < 0) return { source, changed: false };

  let issueIndex = -1;
  let issueIndent = -1;
  for (let i = onIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = indentOf(line);
    if (indent === 0) break;
    if (/^\s+issue_comment:\s*(?:#.*)?$/.test(line)) {
      issueIndex = i;
      issueIndent = indent;
      break;
    }
  }
  if (issueIndex < 0) return { source, changed: false };

  let removeEnd = issueIndex + 1;
  for (; removeEnd < lines.length; removeEnd++) {
    const line = lines[removeEnd];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = indentOf(line);
    if (indent <= issueIndent) break;
  }
  lines.splice(issueIndex, removeEnd - issueIndex);

  let hasEvent = false;
  for (let i = onIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = indentOf(line);
    if (indent === 0) break;
    if (indent === 2 && /^\s{2}[A-Za-z0-9_-]+:\s*/.test(line)) {
      hasEvent = true;
      break;
    }
  }
  if (!hasEvent) lines.splice(onIndex + 1, 0, '  workflow_dispatch:');

  return { source: lines.join('\n'), changed: true };
}

const entries = fs.readdirSync(workflowDir)
  .filter(name => /\.ya?ml$/.test(name))
  .sort();

const changed = [];
const retained = [];
const untouched = [];
for (const name of entries) {
  const full = path.join(workflowDir, name);
  const source = fs.readFileSync(full, 'utf8');
  if (!hasTopLevelIssueCommentTrigger(source)) continue;
  if (allowIssueComment.has(name) || name === self) {
    if (allowIssueComment.has(name)) retained.push(name);
    continue;
  }
  const result = stripIssueCommentTrigger(source);
  if (result.changed) {
    fs.writeFileSync(full, result.source);
    changed.push(name);
  } else {
    untouched.push(name);
  }
}

// Retire this repair workflow's own one-shot issue_comment trigger after it has done the migration.
const selfPath = path.join(workflowDir, self);
if (fs.existsSync(selfPath)) {
  const selfSource = fs.readFileSync(selfPath, 'utf8');
  if (hasTopLevelIssueCommentTrigger(selfSource.split('\n'))) {
    const result = stripIssueCommentTrigger(selfSource);
    if (result.changed) {
      fs.writeFileSync(selfPath, result.source);
      changed.push(self);
    }
  }
}

retained.sort();
changed.sort();
const receipt = {
  schema: 'ISSUE_COMMENT_FANOUT_CONSOLIDATION_RECEIPT_v1',
  retainedIssueCommentListeners: retained,
  retiredIssueCommentListeners: changed,
  unmodifiedMatches: untouched,
  retiredCount: changed.length,
  retainedCount: retained.length
};
fs.mkdirSync(path.join(root, 'evidence', 'control-plane'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'evidence', 'control-plane', 'issue-comment-fanout-consolidation.receipt.json'),
  JSON.stringify(receipt, null, 2) + '\n'
);
console.log(JSON.stringify(receipt));

if (changed.length < 20) {
  console.error(`Refusing weak consolidation: only ${changed.length} listeners retired`);
  process.exit(2);
}
if (JSON.stringify(retained) !== JSON.stringify(expectedRetained)) {
  console.error(`Unexpected retained listener set: ${retained.join(',')}`);
  process.exit(3);
}
