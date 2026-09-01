#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "WORKTREE_NOT_CLEAN" >&2
  git status --porcelain >&2
  exit 30
fi

EXACT_HEAD="$(git rev-parse HEAD)"
: "${OLLAMA_MODEL:=qwen2.5-coder:7b}"
: "${OLLAMA_IMAGE:=ollama/ollama:0.32.14}"

command -v docker >/dev/null 2>&1 || { echo "DOCKER_UNAVAILABLE" >&2; exit 31; }

docker rm -f agentic-frontier-ollama >/dev/null 2>&1 || true
docker pull "$OLLAMA_IMAGE"
docker run -d --name agentic-frontier-ollama \
  -e OLLAMA_CONTEXT_LENGTH=8192 \
  -p 11434:11434 \
  "$OLLAMA_IMAGE"

for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    break
  fi
  sleep 2
  if [[ "$i" == "60" ]]; then
    echo "OLLAMA_START_TIMEOUT" >&2
    exit 32
  fi
done

docker exec agentic-frontier-ollama ollama pull "$OLLAMA_MODEL"

export EXPECTED_COMMIT="$EXACT_HEAD"
export OLLAMA_MODEL
export OLLAMA_HOST_URL="http://127.0.0.1:11434"

bash tools/research/agentic-frontier/run-openhands-native-admissibility-v1.sh
