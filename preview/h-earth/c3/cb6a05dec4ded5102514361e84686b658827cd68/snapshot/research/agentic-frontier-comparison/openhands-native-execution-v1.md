# OpenHands native adversary execution v1

Status: candidate execution contract for neutral adversary qualification. Not a benchmark result.

## Purpose

Run stock OpenHands outside GitHub Actions on a disposable exact-head Linux substrate, prove that it can inspect/edit/test a neutral workspace, and preserve enough evidence to determine whether the adversary lane is operational before comparative reuse.

## Required substrate

- disposable Linux builder or equivalent clean native executor;
- exact checkout of the candidate commit under test;
- Python 3.12;
- Node.js 22;
- git;
- stock `openhands==1.14.0` installed in an isolated environment;
- Ollama 0.32.14 exposing `qwen2.5-coder:7b` with context length 8192, either natively or in a sibling container reachable from the OpenHands process;
- no GitHub Actions agent-execution transport.

## Installation and environment capture

Create an isolated Python environment and install only from the declared top-level OpenHands version, then capture the complete resolution before execution:

```sh
python3.12 -m venv .venv-openhands
. .venv-openhands/bin/activate
python -m pip install --disable-pip-version-check 'openhands==1.14.0'
openhands --version
python -m pip freeze | LC_ALL=C sort > openhands-environment-freeze.txt
sha256sum openhands-environment-freeze.txt
```

The environment freeze and digest are evidence. A later comparative run must reconstruct the same resolution or stop.

## Model runtime

Start Ollama independently of OpenHands and prove both service reachability and actual model response before agent custody. A tags/list response alone is insufficient.

Required preflight:

1. `qwen2.5-coder:7b` is installed;
2. Ollama responds on the configured endpoint;
3. one minimal generation request returns model output within the declared readiness timeout;
4. the model identity in the response matches the declared model.

Recommended environment supplied to OpenHands:

```sh
export LLM_API_KEY='local-placeholder'
export LLM_MODEL='openai/qwen2.5-coder:7b'
export LLM_BASE_URL='http://127.0.0.1:11434/v1'
```

If Ollama is containerized while OpenHands runs on the host, use the host-reachable address appropriate to the builder. Do not assume `127.0.0.1` crosses a container boundary.

## Workspace law

The neutral fixture is created in a fresh temporary git repository. The OpenHands process itself is launched with that fixture as its operating-system current working directory. The qualification does not rely on `WORKSPACE_DIR` to create filesystem authority.

Before launch, record:

- `pwd`/resolved current directory;
- fixture path;
- repository HEAD;
- clean `git status --porcelain`;
- before hashes for `value.mjs` and `test.mjs`;
- successful host-side read and write permission check.

OpenHands then runs from the fixture directory using its documented headless CLI:

```sh
openhands --headless --json --always-approve --override-with-envs \
  -t 'Inspect the workspace. Modify value.mjs only so node test.mjs passes. Run node test.mjs. Do not modify test.mjs. Finish only after verification passes.'
```

Headless JSONL output is captured verbatim.

## PASS gate

`OPENHANDS_ADVERSARY_ADMISSIBLE` requires all of the following:

- stock OpenHands version and full environment resolution captured;
- responsive model preflight passes before agent custody;
- agent starts from the exact neutral fixture directory;
- `value.mjs` changes;
- `test.mjs` does not change;
- changed-file set is exactly `[value.mjs]`;
- independent host-side `node test.mjs` passes after OpenHands exits;
- no inactivity or hard timeout caused termination;
- stdout/stderr/JSONL, before/after hashes, diff, exit code, elapsed time, verifier output, model identity, and environment digest are preserved.

Initialization or textual output without mutation is not a pass.

## Failure classification

Before any benchmark execution, a neutral failure must be assigned to one of:

- `MODEL_RUNTIME_UNREADY`
- `MODEL_ADAPTER`
- `WORKSPACE_BINDING`
- `FILESYSTEM_PERMISSION`
- `TOOL_EXECUTION`
- `EVENT_STREAM_OR_INACTIVITY_MONITOR`
- `PACKAGE_ENVIRONMENT`
- `VERIFICATION_FAILURE`
- `SCOPE_CONTROL`
- `OTHER_EVIDENCED_CAUSE`

Repairs may address only infrastructure/reproducibility mechanisms independent of frozen benchmark content. OpenHands agent semantics, task-specific prompting, graders, and frozen tasks remain unchanged.

## Comparative release condition

A frozen comparative replay remains blocked until the neutral qualification passes reproducibly on the native/disposable substrate. The historical OpenHands 0/24 remains an operationally confounded result until then.
