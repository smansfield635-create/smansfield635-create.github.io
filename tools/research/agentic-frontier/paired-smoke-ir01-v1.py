#!/usr/bin/env python3
import hashlib, json, os, pathlib, queue, re, shutil, signal, subprocess, threading, time, urllib.request

ROOT = pathlib.Path('/tmp/agentic-frontier-ir01')
DG = ROOT / 'diamond-gate'
OH = ROOT / 'openhands'
MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:14b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')
OPENHANDS_INACTIVITY_S = int(os.environ.get('OPENHANDS_INACTIVITY_S', '240'))
OPENHANDS_HARD_TIMEOUT_S = int(os.environ.get('OPENHANDS_HARD_TIMEOUT_S', '900'))
HEARTBEAT_S = int(os.environ.get('PAIR_HEARTBEAT_S', '15'))
TASK = 'Repair slugify: lowercase ASCII, trim, collapse non-alphanumeric runs to one hyphen, no edge hyphens. Modify slug.mjs only. Run node test.mjs and finish only when it passes.'
INITIAL = "export function slugify(input) {\n  return String(input).toLowerCase().replace(/\\s+/g, '-');\n}\n"
TEST = r'''import assert from 'node:assert/strict';
import { slugify } from './slug.mjs';
assert.equal(slugify(' Hello, World! '), 'hello-world');
assert.equal(slugify('A---B___C'), 'a-b-c');
assert.equal(slugify('  multiple   spaces  '), 'multiple-spaces');
assert.equal(slugify('***'), '');
assert.equal(slugify(''), '');
assert.equal(slugify('Already-Clean'), 'already-clean');
console.log('PASS AF-IR-01');
'''

def log(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}", flush=True)

def run(cmd, cwd=None, env=None, check=False, timeout=900):
    p = subprocess.run(cmd, cwd=cwd, env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)
    if check and p.returncode != 0:
        raise RuntimeError(p.stdout)
    return p

def file_sha(path):
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except FileNotFoundError:
        return 'MISSING'

def fixture(path):
    path.mkdir(parents=True, exist_ok=True)
    (path / 'slug.mjs').write_text(INITIAL)
    (path / 'test.mjs').write_text(TEST)
    run(['git','init','-q'], cwd=path, check=True)
    run(['git','config','user.email','agentic-frontier@example.invalid'], cwd=path, check=True)
    run(['git','config','user.name','Agentic Frontier'], cwd=path, check=True)
    run(['git','add','.'], cwd=path, check=True)
    run(['git','commit','-qm','frozen AF-IR-01 fixture'], cwd=path, check=True)

def test(path):
    p = run(['node','test.mjs'], cwd=path, timeout=60)
    return p.returncode == 0, p.stdout

def generate(prompt):
    payload = json.dumps({'model': MODEL, 'prompt': prompt, 'stream': True, 'options': {'temperature': 0}}).encode()
    req = urllib.request.Request(OLLAMA + '/api/generate', data=payload, headers={'Content-Type':'application/json'})
    pieces = []
    last_progress = time.monotonic()
    log(f'Diamond Gate model request started ({MODEL})')
    with urllib.request.urlopen(req, timeout=300) as r:
        for raw in r:
            if not raw.strip():
                continue
            body = json.loads(raw)
            pieces.append(body.get('response',''))
            now = time.monotonic()
            if now - last_progress >= HEARTBEAT_S:
                log(f'Diamond Gate model stream active; received {sum(len(x) for x in pieces)} chars')
                last_progress = now
            if body.get('done'):
                break
    log(f'Diamond Gate model request completed; received {sum(len(x) for x in pieces)} chars')
    return ''.join(pieces)

def clean_code(text):
    text = text.strip()
    m = re.search(r'```(?:javascript|js)?\s*(.*?)```', text, re.S|re.I)
    if m:
        text = m.group(1).strip()
    if 'export function slugify' in text:
        text = text[text.index('export function slugify'):]
    return text.strip() + '\n'

def diamond_gate_lane():
    start = time.monotonic()
    attempts = []
    feedback = 'No verifier result yet.'
    prior_candidate = None
    log('Diamond Gate lane started')
    for i in range(1, 4):
        log(f'Diamond Gate attempt {i}/3')
        current = (DG/'slug.mjs').read_text()
        retry_rule = ''
        if i > 1:
            retry_rule = '\nThis is a verifier-driven repair retry. Diagnose the exact failed behavior and materially revise the implementation. Repeating the prior candidate is forbidden. Every run of one-or-more non-alphanumeric ASCII characters must collapse to exactly one hyphen, then edge hyphens must be removed.\n'
        prompt = f'''You are the implementation lane in a governed diagnose -> rewrite -> verify loop.\nFrozen task: {TASK}\nOnly slug.mjs may change. Return ONLY the complete replacement slug.mjs source, no markdown or explanation.\nCurrent slug.mjs:\n{current}\nVerifier feedback from prior attempt:\n{feedback}\n{retry_rule}\n'''
        candidate = clean_code(generate(prompt))
        if prior_candidate is not None and candidate == prior_candidate:
            feedback += '\nCONTROLLER: Candidate repeated byte-for-byte after failure. Replace the defective strategy.'
            attempts.append({'attempt': i, 'pass': False, 'verifier': feedback[-1600:], 'repeated_candidate': True})
            log(f'Diamond Gate attempt {i} repeated prior candidate; retrying')
            continue
        (DG/'slug.mjs').write_text(candidate)
        passed, out = test(DG)
        attempts.append({'attempt': i, 'pass': passed, 'verifier': out[-1600:], 'repeated_candidate': False})
        prior_candidate = candidate
        log(f'Diamond Gate verifier attempt {i}: {"PASS" if passed else "FAIL"}')
        if passed:
            elapsed = round(time.monotonic()-start,3)
            log(f'Diamond Gate lane completed PASS in {elapsed}s')
            return {'pass': True, 'attempts': attempts, 'elapsed_s': elapsed, 'output': candidate}
        feedback = out
    elapsed = round(time.monotonic()-start,3)
    log(f'Diamond Gate lane completed FAIL in {elapsed}s')
    return {'pass': False, 'attempts': attempts, 'elapsed_s': elapsed, 'output': (DG/'slug.mjs').read_text()}

def monitored_process(cmd, cwd, env):
    start = time.monotonic()
    last_activity = start
    last_heartbeat = start
    watched = cwd / 'slug.mjs'
    prior_sha = file_sha(watched)
    lines = []
    q = queue.Queue()
    log(f'OpenHands process launching: {" ".join(cmd[:5])} ...')
    p = subprocess.Popen(
        cmd, cwd=cwd, env=env, text=True,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        bufsize=1, start_new_session=True,
    )

    def reader():
        try:
            for line in iter(p.stdout.readline, ''):
                q.put(line)
        finally:
            q.put(None)

    threading.Thread(target=reader, daemon=True).start()
    reader_done = False
    inactivity_timeout = False
    hard_timeout = False

    while p.poll() is None or not reader_done:
        now = time.monotonic()
        drained = False
        while True:
            try:
                item = q.get_nowait()
            except queue.Empty:
                break
            if item is None:
                reader_done = True
                break
            drained = True
            lines.append(item)
            print(f'[OPENHANDS] {item}', end='', flush=True)
            last_activity = now

        current_sha = file_sha(watched)
        if current_sha != prior_sha:
            log(f'OpenHands workspace changed: slug.mjs {prior_sha[:10]} -> {current_sha[:10]}')
            prior_sha = current_sha
            last_activity = now

        if now - last_heartbeat >= HEARTBEAT_S:
            log(f'OpenHands heartbeat: elapsed={int(now-start)}s idle={int(now-last_activity)}s file={prior_sha[:10]}')
            last_heartbeat = now

        if now - last_activity >= OPENHANDS_INACTIVITY_S:
            inactivity_timeout = True
            log(f'OpenHands inactivity cutoff reached after {OPENHANDS_INACTIVITY_S}s without output or workspace change; terminating')
            try:
                os.killpg(p.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            break

        if now - start >= OPENHANDS_HARD_TIMEOUT_S:
            hard_timeout = True
            log(f'OpenHands hard timeout reached after {OPENHANDS_HARD_TIMEOUT_S}s; terminating')
            try:
                os.killpg(p.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            break

        if not drained:
            time.sleep(1)

    if p.poll() is None:
        try:
            p.wait(timeout=10)
        except subprocess.TimeoutExpired:
            try:
                os.killpg(p.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            p.wait(timeout=5)

    while True:
        try:
            item = q.get_nowait()
        except queue.Empty:
            break
        if item is not None:
            lines.append(item)
            print(f'[OPENHANDS] {item}', end='', flush=True)

    elapsed = round(time.monotonic()-start,3)
    log(f'OpenHands process ended exit={p.returncode} elapsed={elapsed}s inactivity_timeout={inactivity_timeout} hard_timeout={hard_timeout}')
    return p.returncode, ''.join(lines), elapsed, inactivity_timeout, hard_timeout

def openhands_lane():
    env = os.environ.copy()
    env.update({
        'LLM_API_KEY': 'local-placeholder',
        'LLM_MODEL': 'openai/' + MODEL,
        'LLM_BASE_URL': OLLAMA + '/v1',
        'WORKSPACE_DIR': str(OH),
        'OPENHANDS_SUPPRESS_BANNER': '1',
        'PYTHONUNBUFFERED': '1',
    })
    task = TASK + ' Work directly in the current workspace. Inspect the existing files, edit slug.mjs, run node test.mjs, and continue until the tests pass.'
    cmd = ['openhands','--headless','--json','--always-approve','--override-with-envs','-t',task]
    code, agent_log, elapsed, inactivity_timeout, hard_timeout = monitored_process(cmd, OH, env)
    passed, out = test(OH)
    log(f'OpenHands verifier: {"PASS" if passed else "FAIL"}')
    return {
        'pass': passed,
        'exit_code': code,
        'elapsed_s': elapsed,
        'inactivity_timeout': inactivity_timeout,
        'hard_timeout': hard_timeout,
        'agent_log_tail': agent_log[-12000:],
        'verifier': out[-1600:],
        'output': (OH/'slug.mjs').read_text(),
    }

def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()

if ROOT.exists():
    shutil.rmtree(ROOT)
fixture(DG)
fixture(OH)
log(f'AF-IR-01 paired execution starting; model={MODEL}; OpenHands inactivity cutoff={OPENHANDS_INACTIVITY_S}s; hard timeout={OPENHANDS_HARD_TIMEOUT_S}s')
dg = diamond_gate_lane()
oh = openhands_lane()
receipt = {
    'schema': 'AGENTIC_FRONTIER_PAIRED_SMOKE_AF_IR_01_STOCK_OPENHANDS_ADMISSIBILITY_v2',
    'task_id': 'AF-IR-01',
    'task': TASK,
    'model': MODEL,
    'ollama': OLLAMA,
    'openhands_version': '1.14.0',
    'openhands_mode': 'stock_documented_headless_cli',
    'observability': {
        'heartbeat_s': HEARTBEAT_S,
        'inactivity_cutoff_s': OPENHANDS_INACTIVITY_S,
        'hard_timeout_s': OPENHANDS_HARD_TIMEOUT_S,
        'workspace_sha_watch': 'slug.mjs',
    },
    'diamond_gate': dg,
    'openhands': oh,
    'initial_sha256': sha(INITIAL),
    'diamond_gate_output_sha256': sha(dg['output']),
    'openhands_output_sha256': sha(oh['output']),
    'result': 'PAIR_PASS' if dg['pass'] and oh['pass'] else 'PAIR_INCOMPLETE',
}
path = pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-ir01-paired-receipt.json'
path.write_text(json.dumps(receipt, indent=2))
log(f'Paired receipt written: result={receipt["result"]} DG={dg["pass"]} OH={oh["pass"]}')
print(json.dumps({
    'result': receipt['result'],
    'diamond_gate_pass': dg['pass'],
    'openhands_pass': oh['pass'],
    'diamond_gate_elapsed_s': dg['elapsed_s'],
    'openhands_elapsed_s': oh['elapsed_s'],
    'openhands_inactivity_timeout': oh['inactivity_timeout'],
}, indent=2), flush=True)
raise SystemExit(0 if receipt['result'] == 'PAIR_PASS' else 3)
