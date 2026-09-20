#!/usr/bin/env bash
set -uo pipefail
stage="$1"; shift
mkdir -p qualification
log="qualification/${stage}.log"
status="qualification/${stage}.status"
printf 'RUNNING\n' > "$status"
set +e
"$@" > >(tee "$log") 2>&1
rc=$?
set -e
if [ "$rc" -eq 0 ]; then printf 'PASS\n' > "$status"; else printf 'FAIL:%s\n' "$rc" > "$status"; fi
exit "$rc"
