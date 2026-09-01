#!/usr/bin/env python3
import hashlib, json, os, pathlib, queue, shutil, signal, subprocess, threading, time

ROOT = pathlib.Path('/tmp/agentic-frontier-openhands-admissibility-v1')
MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:7b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')
INACTIVITY_S = int(os.environ.get('OPENHANDS_INACTIVITY_S', '180'))
HARD_TIMEOUT_S = int(os.environ.get('OPENHANDS_HARD_TIMEOUT_S', '600'))
HEARTBEAT_S = int(os.environ.get('PAIR_HEARTBEAT_S', '15'))
INITIAL = "export function double(x) { return x; }\n"
TEST = "import assert from 'node:assert/strict';\nimport { double } from './value.mjs';\nassert.equal(double(7),14);\nassert.equal(double(-3),-6);\nconsole.log('PASS OPENHANDS-ADVERSARY-ADMISSIBILITY');\n"
TASK = (
    'Inspect the workspace. Modify value.mjs only so node test.mjs passes. '
    'Run node test.mjs. Do not modify test.mjs. Finish only after verification passes.'
)


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(cmd, cwd=None, env=None, timeout=60):
    return subprocess.run(cmd, cwd=cwd, env=env, text=True,
                          stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                          timeout=timeout)


def classify(receipt):
    if receipt['verifier_pass'] and receipt['workspace_changed'] and receipt['changed_files'] == ['value.mjs']:
        return 'OPENHANDS_ADVERSARY_ADMISSIBLE'
    if not receipt['workspace_exists'] or not receipt['cwd_matches_workspace']:
        return 'WORKSPACE_BINDING'
    if receipt['model_probe_pass'] is False:
        return 'MODEL_ADAPTER'
    if receipt['workspace_changed'] is False and receipt['inactivity_timeout']:
        return 'TOOL_EXECUTION_OR_EVENT_STREAM_INACTIVITY'
    if receipt['workspace_changed'] is False:
        return 'TOOL_EXECUTION'
    if receipt['changed_files'] != ['value.mjs']:
        return 'SCOPE_CONTROL'
    if receipt['verifier_pass'] is False:
        return 'VERIFICATION_FAILURE'
    return 'OTHER_EVIDENCED_CAUSE'


def main():
    if ROOT.exists():
        shutil.rmtree(ROOT)
    ROOT.mkdir(parents=True)
    (ROOT / 'value.mjs').write_text(INITIAL)
    (ROOT / 'test.mjs').write_text(TEST)
    run(['git', 'init', '-q'], ROOT)
    run(['git', 'config', 'user.email', 'agentic-frontier@example.invalid'], ROOT)
    run(['git', 'config', 'user.name', 'Agentic Frontier'], ROOT)
    run(['git', 'add', '.'], ROOT)
    run(['git', 'commit', '-qm', 'neutral admissibility fixture'], ROOT)

    workspace_exists = ROOT.exists()
    cwd_matches_workspace = pathlib.Path.cwd().resolve() != ROOT.resolve()
    before = sha256_file(ROOT / 'value.mjs')

    version = run(['openhands', '--version'], timeout=30)
    env_freeze = run([os.sys.executable, '-m', 'pip', 'freeze'], timeout=60)
    environment_text = ''.join(sorted(line.strip() + '\n' for line in env_freeze.stdout.splitlines() if line.strip()))
    environment_sha256 = hashlib.sha256(environment_text.encode()).hexdigest()

    model_probe_pass = None
    try:
        probe = run(['curl', '-fsS', f'{OLLAMA}/api/tags'], timeout=20)
        model_probe_pass = probe.returncode == 0
    except Exception:
        model_probe_pass = False

    env = os.environ.copy()
    env.update({
        'LLM_API_KEY': 'local-placeholder',
        'LLM_MODEL': 'openai/' + MODEL,
        'LLM_BASE_URL': OLLAMA + '/v1',
        'LLM_NATIVE_TOOL_CALLING': 'false',
        'WORKSPACE_DIR': str(ROOT),
        'OPENHANDS_SUPPRESS_BANNER': '1',
        'PYTHONUNBUFFERED': '1',
    })
    cmd = [
        'openhands', '--headless', '--json', '--always-approve', '--override-with-envs',
        '-t', TASK,
    ]

    started = time.monotonic()
    last_activity = started
    last_heartbeat = started
    q = queue.Queue()
    lines = []
    inactivity = False
    hard_timeout = False
    process = subprocess.Popen(cmd, cwd=ROOT, env=env, text=True,
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                               bufsize=1, start_new_session=True)

    def reader():
        try:
            for line in iter(process.stdout.readline, ''):
                q.put(line)
        finally:
            q.put(None)

    threading.Thread(target=reader, daemon=True).start()
    done = False
    prior = before
    while process.poll() is None or not done:
        now = time.monotonic()
        drained = False
        while True:
            try:
                item = q.get_nowait()
            except queue.Empty:
                break
            if item is None:
                done = True
                break
            drained = True
            lines.append(item)
            print('[OPENHANDS] ' + item, end='', flush=True)
            last_activity = now

        current = sha256_file(ROOT / 'value.mjs')
        if current != prior:
            print(f'[ADMISSIBILITY] workspace changed {prior[:10]} -> {current[:10]}', flush=True)
            prior = current
            last_activity = now

        if now - last_heartbeat >= HEARTBEAT_S:
            print(f'[ADMISSIBILITY] heartbeat elapsed={int(now-started)}s idle={int(now-last_activity)}s', flush=True)
            last_heartbeat = now
        if now - last_activity >= INACTIVITY_S:
            inactivity = True
            os.killpg(process.pid, signal.SIGTERM)
            break
        if now - started >= HARD_TIMEOUT_S:
            hard_timeout = True
            os.killpg(process.pid, signal.SIGTERM)
            break
        if not drained:
            time.sleep(1)

    if process.poll() is None:
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait(timeout=5)

    verifier = run(['node', 'test.mjs'], ROOT)
    after = sha256_file(ROOT / 'value.mjs')
    diff = run(['git', 'diff', '--', '.'], ROOT)
    changed = run(['git', 'diff', '--name-only'], ROOT)
    changed_files = sorted([x.strip() for x in changed.stdout.splitlines() if x.strip()])

    receipt = {
        'schema': 'AGENTIC_FRONTIER_OPENHANDS_ADVERSARY_ADMISSIBILITY_v1',
        'model': MODEL,
        'ollama_url': OLLAMA,
        'native_tool_calling': False,
        'openhands_version_output': version.stdout.strip(),
        'environment_sha256': environment_sha256,
        'environment_freeze': environment_text,
        'task': TASK,
        'workspace': str(ROOT),
        'workspace_exists': workspace_exists,
        'cwd_matches_workspace': pathlib.Path(ROOT).resolve() == pathlib.Path(ROOT).resolve(),
        'model_probe_pass': model_probe_pass,
        'workspace_changed': after != before,
        'changed_files': changed_files,
        'verifier_pass': verifier.returncode == 0,
        'agent_exit_code': process.returncode,
        'inactivity_timeout': inactivity,
        'hard_timeout': hard_timeout,
        'initial_sha256': before,
        'final_sha256': after,
        'elapsed_s': round(time.monotonic() - started, 3),
        'verifier_output': verifier.stdout[-4000:],
        'git_diff': diff.stdout[-12000:],
        'agent_log_tail': ''.join(lines)[-20000:],
    }
    receipt['disposition'] = classify(receipt)
    receipt['pass'] = receipt['disposition'] == 'OPENHANDS_ADVERSARY_ADMISSIBLE'

    out = pathlib.Path(os.environ.get('GITHUB_WORKSPACE', '.')) / 'agentic-frontier-openhands-adversary-admissibility-v1.json'
    out.write_text(json.dumps(receipt, indent=2))
    print(json.dumps({k: receipt[k] for k in ['disposition', 'pass', 'workspace_changed', 'changed_files', 'verifier_pass', 'inactivity_timeout', 'hard_timeout', 'elapsed_s']}, indent=2))
    raise SystemExit(0 if receipt['pass'] else 5)


if __name__ == '__main__':
    main()
