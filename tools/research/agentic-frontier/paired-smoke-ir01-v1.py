#!/usr/bin/env python3
import hashlib, json, os, pathlib, queue, re, shutil, signal, subprocess, threading, time, urllib.request

ROOT = pathlib.Path('/tmp/agentic-frontier-ir01')
DG = ROOT / 'diamond-gate'
OH = ROOT / 'openhands'
MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:7b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')
OPENHANDS_INACTIVITY_S = int(os.environ.get('OPENHANDS_INACTIVITY_S', '180'))
OPENHANDS_HARD_TIMEOUT_S = int(os.environ.get('OPENHANDS_HARD_TIMEOUT_S', '600'))
MODEL_FIRST_TOKEN_TIMEOUT_S = int(os.environ.get('MODEL_FIRST_TOKEN_TIMEOUT_S', '90'))
MODEL_HARD_TIMEOUT_S = int(os.environ.get('MODEL_HARD_TIMEOUT_S', '240'))
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
    try: return hashlib.sha256(path.read_bytes()).hexdigest()
    except FileNotFoundError: return 'MISSING'

def fixture(path):
    path.mkdir(parents=True, exist_ok=True)
    (path/'slug.mjs').write_text(INITIAL); (path/'test.mjs').write_text(TEST)
    run(['git','init','-q'], cwd=path, check=True)
    run(['git','config','user.email','agentic-frontier@example.invalid'], cwd=path, check=True)
    run(['git','config','user.name','Agentic Frontier'], cwd=path, check=True)
    run(['git','add','.'], cwd=path, check=True); run(['git','commit','-qm','frozen AF-IR-01 fixture'], cwd=path, check=True)

def test(path):
    p = run(['node','test.mjs'], cwd=path, timeout=60); return p.returncode == 0, p.stdout

def ollama_ps():
    try:
        with urllib.request.urlopen(OLLAMA + '/api/ps', timeout=3) as r:
            data = json.load(r)
        models = data.get('models') or []
        if not models: return 'no-loaded-model'
        m = models[0]
        return f"loaded={m.get('name','?')} size_vram={m.get('size_vram','?')}"
    except Exception as e:
        return f'ps-unavailable:{type(e).__name__}'

def generate(prompt):
    q = queue.Queue(); stop = threading.Event(); started = time.monotonic()
    payload = json.dumps({'model': MODEL, 'prompt': prompt, 'stream': True, 'options': {'temperature': 0}}).encode()
    req = urllib.request.Request(OLLAMA + '/api/generate', data=payload, headers={'Content-Type':'application/json'})
    def worker():
        try:
            with urllib.request.urlopen(req, timeout=MODEL_HARD_TIMEOUT_S) as r:
                for raw in r:
                    if raw.strip(): q.put(('chunk', raw))
                    if stop.is_set(): break
            q.put(('done', None))
        except Exception as e:
            q.put(('error', repr(e)))
    threading.Thread(target=worker, daemon=True).start()
    pieces=[]; first_token=False; last_hb=started
    log(f'Diamond Gate model request started ({MODEL})')
    while True:
        now=time.monotonic()
        try: kind, value=q.get(timeout=1)
        except queue.Empty: kind=value=None
        if kind=='chunk':
            body=json.loads(value); text=body.get('response',''); pieces.append(text)
            if text and not first_token:
                first_token=True; log(f'Diamond Gate first token received after {round(now-started,1)}s')
            if body.get('done'): break
        elif kind=='done': break
        elif kind=='error': raise RuntimeError(f'model request failed: {value}')
        if now-last_hb >= HEARTBEAT_S:
            phase='streaming' if first_token else 'waiting-first-token'
            log(f'Diamond Gate model heartbeat: phase={phase} elapsed={int(now-started)}s chars={sum(map(len,pieces))} {ollama_ps()}')
            last_hb=now
        if not first_token and now-started >= MODEL_FIRST_TOKEN_TIMEOUT_S:
            stop.set(); raise TimeoutError(f'no first token within {MODEL_FIRST_TOKEN_TIMEOUT_S}s; {ollama_ps()}')
        if now-started >= MODEL_HARD_TIMEOUT_S:
            stop.set(); raise TimeoutError(f'model generation exceeded {MODEL_HARD_TIMEOUT_S}s')
    log(f'Diamond Gate model request completed; received {sum(map(len,pieces))} chars')
    return ''.join(pieces)

def clean_code(text):
    text=text.strip(); m=re.search(r'```(?:javascript|js)?\s*(.*?)```',text,re.S|re.I)
    if m: text=m.group(1).strip()
    if 'export function slugify' in text: text=text[text.index('export function slugify'):]
    return text.strip()+'\n'

def diamond_gate_lane():
    start=time.monotonic(); attempts=[]; feedback='No verifier result yet.'; prior=None
    log('Diamond Gate lane started')
    for i in range(1,4):
        log(f'Diamond Gate attempt {i}/3'); current=(DG/'slug.mjs').read_text()
        retry='' if i==1 else '\nVerifier-driven retry: materially revise the implementation. Collapse every run of non-alphanumeric ASCII to one hyphen, then remove edge hyphens.\n'
        prompt=f'''You are the implementation lane in a governed diagnose -> rewrite -> verify loop.\nFrozen task: {TASK}\nOnly slug.mjs may change. Return ONLY the complete replacement slug.mjs source.\nCurrent slug.mjs:\n{current}\nVerifier feedback:\n{feedback}\n{retry}'''
        try: candidate=clean_code(generate(prompt))
        except Exception as e:
            elapsed=round(time.monotonic()-start,3); log(f'Diamond Gate model unavailable: {e}')
            return {'pass':False,'attempts':attempts,'elapsed_s':elapsed,'output':(DG/'slug.mjs').read_text(),'runtime_error':str(e)}
        if prior is not None and candidate==prior:
            attempts.append({'attempt':i,'pass':False,'verifier':'repeated candidate','repeated_candidate':True}); feedback='Repeated candidate is forbidden.'; continue
        (DG/'slug.mjs').write_text(candidate); passed,out=test(DG)
        attempts.append({'attempt':i,'pass':passed,'verifier':out[-1600:],'repeated_candidate':False}); prior=candidate
        log(f'Diamond Gate verifier attempt {i}: {"PASS" if passed else "FAIL"}')
        if passed:
            elapsed=round(time.monotonic()-start,3); return {'pass':True,'attempts':attempts,'elapsed_s':elapsed,'output':candidate}
        feedback=out
    return {'pass':False,'attempts':attempts,'elapsed_s':round(time.monotonic()-start,3),'output':(DG/'slug.mjs').read_text()}

def monitored_process(cmd,cwd,env):
    start=time.monotonic(); last_activity=start; last_hb=start; watched=cwd/'slug.mjs'; prior_sha=file_sha(watched); lines=[]; q=queue.Queue()
    log('OpenHands process launching')
    p=subprocess.Popen(cmd,cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=1,start_new_session=True)
    def reader():
        try:
            for line in iter(p.stdout.readline,''): q.put(line)
        finally: q.put(None)
    threading.Thread(target=reader,daemon=True).start(); done=False; inactivity=False; hard=False
    while p.poll() is None or not done:
        now=time.monotonic(); drained=False
        while True:
            try: item=q.get_nowait()
            except queue.Empty: break
            if item is None: done=True; break
            drained=True; lines.append(item); print(f'[OPENHANDS] {item}',end='',flush=True); last_activity=now
        cur=file_sha(watched)
        if cur!=prior_sha: log(f'OpenHands workspace changed: {prior_sha[:10]} -> {cur[:10]}'); prior_sha=cur; last_activity=now
        if now-last_hb>=HEARTBEAT_S: log(f'OpenHands heartbeat: elapsed={int(now-start)}s idle={int(now-last_activity)}s file={prior_sha[:10]}'); last_hb=now
        if now-last_activity>=OPENHANDS_INACTIVITY_S: inactivity=True; log('OpenHands inactivity cutoff reached'); os.killpg(p.pid,signal.SIGTERM); break
        if now-start>=OPENHANDS_HARD_TIMEOUT_S: hard=True; log('OpenHands hard timeout reached'); os.killpg(p.pid,signal.SIGTERM); break
        if not drained: time.sleep(1)
    if p.poll() is None:
        try: p.wait(timeout=10)
        except subprocess.TimeoutExpired: os.killpg(p.pid,signal.SIGKILL); p.wait(timeout=5)
    return p.returncode,''.join(lines),round(time.monotonic()-start,3),inactivity,hard

def openhands_lane():
    env=os.environ.copy(); env.update({'LLM_API_KEY':'local-placeholder','LLM_MODEL':'openai/'+MODEL,'LLM_BASE_URL':OLLAMA+'/v1','WORKSPACE_DIR':str(OH),'OPENHANDS_SUPPRESS_BANNER':'1','PYTHONUNBUFFERED':'1'})
    task=TASK+' Work directly in the current workspace. Inspect files, edit slug.mjs, run node test.mjs, and continue until tests pass.'
    code,agent_log,elapsed,inactivity,hard=monitored_process(['openhands','--headless','--json','--always-approve','--override-with-envs','-t',task],OH,env)
    passed,out=test(OH); log(f'OpenHands verifier: {"PASS" if passed else "FAIL"}')
    return {'pass':passed,'exit_code':code,'elapsed_s':elapsed,'inactivity_timeout':inactivity,'hard_timeout':hard,'agent_log_tail':agent_log[-12000:],'verifier':out[-1600:],'output':(OH/'slug.mjs').read_text()}

def sha(text): return hashlib.sha256(text.encode()).hexdigest()

def write_receipt(dg,oh,result):
    receipt={'schema':'AGENTIC_FRONTIER_PAIRED_SMOKE_AF_IR_01_STOCK_OPENHANDS_ADMISSIBILITY_v3','task_id':'AF-IR-01','task':TASK,'model':MODEL,'ollama':OLLAMA,'openhands_version':'1.14.0','openhands_mode':'stock_documented_headless_cli','diamond_gate':dg,'openhands':oh,'initial_sha256':sha(INITIAL),'diamond_gate_output_sha256':sha(dg['output']),'openhands_output_sha256':sha(oh['output']) if oh else None,'result':result}
    pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'),'agentic-frontier-ir01-paired-receipt.json').write_text(json.dumps(receipt,indent=2)); return receipt

if ROOT.exists(): shutil.rmtree(ROOT)
fixture(DG); fixture(OH)
log(f'AF-IR-01 paired execution starting; model={MODEL}; first-token cutoff={MODEL_FIRST_TOKEN_TIMEOUT_S}s')
dg=diamond_gate_lane()
if not dg['pass'] and dg.get('runtime_error'):
    receipt=write_receipt(dg,None,'COMMON_MODEL_RUNTIME_UNAVAILABLE')
    log('Common model runtime unavailable; OpenHands launch skipped to avoid wasted heavy execution')
    raise SystemExit(4)
oh=openhands_lane(); result='PAIR_PASS' if dg['pass'] and oh['pass'] else 'PAIR_INCOMPLETE'; receipt=write_receipt(dg,oh,result)
log(f'Paired receipt written: result={result} DG={dg["pass"]} OH={oh["pass"]}')
raise SystemExit(0 if result=='PAIR_PASS' else 3)
