#!/usr/bin/env bash
set -euo pipefail

: "${EXPECTED_COMMIT:?Set EXPECTED_COMMIT to the exact candidate commit SHA}"
: "${OLLAMA_MODEL:=qwen2.5-coder:7b}"
: "${OLLAMA_HOST_URL:=http://127.0.0.1:11434}"
: "${OLLAMA_IMAGE:=ollama/ollama:0.32.14}"
: "${OLLAMA_CONTEXT_LENGTH:=32768}"
: "${OPENHANDS_VERSION:=1.14.0}"
: "${PYTHON_BIN:=python3.12}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

ACTUAL_COMMIT="$(git rev-parse HEAD)"
if [[ "$ACTUAL_COMMIT" != "$EXPECTED_COMMIT" ]]; then
  echo "EXACT_HEAD_MISMATCH expected=$EXPECTED_COMMIT actual=$ACTUAL_COMMIT" >&2
  exit 20
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "WORKTREE_NOT_CLEAN" >&2
  git status --porcelain >&2
  exit 21
fi

for cmd in "$PYTHON_BIN" node git curl sha256sum docker; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "MISSING_COMMAND $cmd" >&2; exit 22; }
done

OUT_ROOT="${OPENHANDS_NATIVE_OUT_DIR:-$(mktemp -d -t openhands-native-admissibility-XXXXXX)}"
mkdir -p "$OUT_ROOT"
VENV="$OUT_ROOT/venv-openhands"

cleanup() {
  docker rm -f agentic-frontier-ollama >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker rm -f agentic-frontier-ollama >/dev/null 2>&1 || true
docker pull "$OLLAMA_IMAGE"
docker run -d --name agentic-frontier-ollama \
  -e OLLAMA_CONTEXT_LENGTH="$OLLAMA_CONTEXT_LENGTH" \
  -p 11434:11434 \
  "$OLLAMA_IMAGE"

for i in $(seq 1 60); do
  if curl -fsS "${OLLAMA_HOST_URL%/}/api/tags" >/dev/null 2>&1; then
    break
  fi
  if [[ "$i" == "60" ]]; then
    echo "MODEL_RUNTIME_UNREADY ollama_start_timeout" >&2
    exit 25
  fi
  sleep 2
done

docker exec agentic-frontier-ollama ollama pull "$OLLAMA_MODEL"

"$PYTHON_BIN" -m venv "$VENV"
"$VENV/bin/python" -m pip install --disable-pip-version-check "openhands==$OPENHANDS_VERSION"
"$VENV/bin/openhands" --version | tee "$OUT_ROOT/openhands-version.txt"
"$VENV/bin/python" -m pip freeze | LC_ALL=C sort > "$OUT_ROOT/openhands-environment-freeze.txt"
sha256sum "$OUT_ROOT/openhands-environment-freeze.txt" | tee "$OUT_ROOT/openhands-environment-freeze.sha256"
printf '%s\n' "$OLLAMA_CONTEXT_LENGTH" > "$OUT_ROOT/ollama-context-length.txt"

export PATH="$VENV/bin:$PATH"
export OLLAMA_MODEL OLLAMA_HOST_URL OLLAMA_CONTEXT_LENGTH
export OPENHANDS_PREFLIGHT_RECEIPT="$OUT_ROOT/openhands-native-preflight-v1.json"

python tools/research/agentic-frontier/openhands-native-preflight-v1.py

export LLM_API_KEY='local-placeholder'
export LLM_MODEL="openai/$OLLAMA_MODEL"
export LLM_BASE_URL="${OLLAMA_HOST_URL%/}/v1"
export OPENHANDS_SUPPRESS_BANNER='1'
export PYTHONUNBUFFERED='1'
export OPENHANDS_INACTIVITY_S="${OPENHANDS_INACTIVITY_S:-180}"
export OPENHANDS_HARD_TIMEOUT_S="${OPENHANDS_HARD_TIMEOUT_S:-600}"
export PAIR_HEARTBEAT_S="${PAIR_HEARTBEAT_S:-15}"
export GITHUB_WORKSPACE="$OUT_ROOT"

python tools/research/agentic-frontier/openhands-adversary-admissibility-v1.py

RECEIPT="$OUT_ROOT/agentic-frontier-openhands-adversary-admissibility-v1.json"
if [[ ! -s "$RECEIPT" ]]; then
  echo "MISSING_ADMISSIBILITY_RECEIPT $RECEIPT" >&2
  exit 23
fi

"$VENV/bin/python" - "$RECEIPT" "$ACTUAL_COMMIT" <<'PY'
import json, pathlib, sys
p=pathlib.Path(sys.argv[1])
data=json.loads(p.read_text())
summary={
  'exact_commit': sys.argv[2],
  'disposition': data.get('disposition'),
  'pass': data.get('pass'),
  'workspace_changed': data.get('workspace_changed'),
  'changed_files': data.get('changed_files'),
  'verifier_pass': data.get('verifier_pass'),
  'inactivity_timeout': data.get('inactivity_timeout'),
  'hard_timeout': data.get('hard_timeout'),
  'environment_sha256': data.get('environment_sha256'),
  'openhands_version_output': data.get('openhands_version_output'),
  'model': data.get('model'),
}
print(json.dumps(summary, indent=2))
if data.get('disposition') != 'OPENHANDS_ADVERSARY_ADMISSIBLE' or data.get('pass') is not True:
    raise SystemExit(24)
PY

echo "OPENHANDS_NATIVE_ADMISSIBILITY_PASS out=$OUT_ROOT commit=$ACTUAL_COMMIT"
