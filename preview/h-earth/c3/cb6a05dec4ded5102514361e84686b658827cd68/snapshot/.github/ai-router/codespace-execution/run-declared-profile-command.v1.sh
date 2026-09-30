#!/usr/bin/env bash
set -euo pipefail

PROFILE="${1:?usage: run-declared-profile-command.v1.sh <project-profile.json>}"
[[ -f "$PROFILE" ]] || { echo "PROFILE_NOT_FOUND $PROFILE" >&2; exit 40; }

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "WORKTREE_NOT_CLEAN_BEFORE_PROFILE_EXECUTION" >&2
  git status --porcelain >&2
  exit 41
fi

readarray -t PROFILE_FIELDS < <(node - "$PROFILE" <<'NODE'
const fs=require('fs');
const p=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for (const k of ['schema','projectId','substrateId','declaredFixedCommand']) {
  if (typeof p[k] !== 'string' || !p[k]) throw new Error(`PROFILE_FIELD_INVALID:${k}`);
}
if (p.schema !== 'THREE_TIER_CODESPACE_PROJECT_EXECUTION_PROFILE_v1') throw new Error('PROFILE_SCHEMA_INVALID');
if (p.substrateId !== 'THREE_TIER_CODESPACE_EXECUTION_SUBSTRATE_v1') throw new Error('PROFILE_SUBSTRATE_INVALID');
if (p.commandRule !== 'PROJECT_DECLARED_FIXED_COMMAND_ONLY') throw new Error('PROFILE_COMMAND_RULE_INVALID');
console.log(p.projectId);
console.log(p.declaredFixedCommand);
NODE
)

PROJECT_ID="${PROFILE_FIELDS[0]}"
DECLARED_COMMAND="${PROFILE_FIELDS[1]}"
EXACT_HEAD="$(git rev-parse HEAD)"

export EXPECTED_COMMIT="$EXACT_HEAD"
export THREE_TIER_PROJECT_ID="$PROJECT_ID"
export THREE_TIER_EXACT_TARGET_COMMIT="$EXACT_HEAD"

printf 'THREE_TIER_PROFILE_EXECUTION_START project=%s commit=%s\n' "$PROJECT_ID" "$EXACT_HEAD"
printf 'THREE_TIER_DECLARED_COMMAND %s\n' "$DECLARED_COMMAND"

bash -lc "$DECLARED_COMMAND"

printf 'THREE_TIER_PROFILE_EXECUTION_COMPLETE project=%s commit=%s\n' "$PROJECT_ID" "$EXACT_HEAD"
