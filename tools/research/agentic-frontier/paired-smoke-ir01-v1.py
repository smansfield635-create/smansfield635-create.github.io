#!/usr/bin/env python3
import hashlib, json, os, pathlib, re, shutil, subprocess, time, urllib.request

ROOT = pathlib.Path('/tmp/agentic-frontier-ir01')
DG = ROOT / 'diamond-gate'
OH = ROOT / 'openhands'
MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:1.5b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')
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

def run(cmd, cwd=None, env=None, check=False, timeout=900):
    p = subprocess.run(cmd, cwd=cwd, env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)
    if check and p.returncode != 0:
        raise RuntimeError(p.stdout)
    return p

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
    payload = json.dumps({'model': MODEL, 'prompt': prompt, 'stream': False, 'options': {'temperature': 0}}).encode()
    req = urllib.request.Request(OLLAMA + '/api/generate', data=payload, headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=600) as r:
        body = json.load(r)
    return body.get('response','')

def clean_code(text):
    text = text.strip()
    m = re.search(r'```(?:javascript|js)?\s*(.*?)```', text, re.S|re.I)
    if m: text = m.group(1).strip()
    if 'export function slugify' in text:
        text = text[text.index('export function slugify'):]
    return text.strip() + '\n'

def diamond_gate_lane():
    start = time.monotonic()
    attempts=[]
    feedback='No verifier result yet.'
    for i in range(1,4):
        current=(DG/'slug.mjs').read_text()
        prompt=f'''You are the implementation lane in a governed repair loop.\nFrozen task: {TASK}\nOnly slug.mjs may change. Return ONLY the complete replacement slug.mjs source, no markdown or explanation.\nCurrent slug.mjs:\n{current}\nVerifier feedback from prior attempt:\n{feedback}\n'''
        raw=generate(prompt)
        candidate=clean_code(raw)
        (DG/'slug.mjs').write_text(candidate)
        passed,out=test(DG)
        attempts.append({'attempt':i,'pass':passed,'verifier':out[-1200:]})
        if passed:
            return {'pass':True,'attempts':attempts,'elapsed_s':round(time.monotonic()-start,3),'output':candidate}
        feedback=out
    return {'pass':False,'attempts':attempts,'elapsed_s':round(time.monotonic()-start,3),'output':(DG/'slug.mjs').read_text()}

def openhands_lane():
    start=time.monotonic()
    env=os.environ.copy()
    env.update({'LLM_API_KEY':'local-placeholder','LLM_MODEL':'openai/'+MODEL,'LLM_BASE_URL':OLLAMA+'/v1'})
    cmd=['openhands','--headless','--json','--always-approve','--override-with-envs','-t',TASK]
    p=run(cmd,cwd=OH,env=env,timeout=1200)
    passed,out=test(OH)
    return {'pass':passed,'exit_code':p.returncode,'elapsed_s':round(time.monotonic()-start,3),'agent_log_tail':p.stdout[-5000:],'verifier':out[-1200:],'output':(OH/'slug.mjs').read_text()}

def sha(text): return hashlib.sha256(text.encode()).hexdigest()

if ROOT.exists(): shutil.rmtree(ROOT)
fixture(DG); fixture(OH)
dg=diamond_gate_lane()
oh=openhands_lane()
receipt={'schema':'AGENTIC_FRONTIER_PAIRED_SMOKE_AF_IR_01_v1','task_id':'AF-IR-01','task':TASK,'model':MODEL,'ollama':OLLAMA,'diamond_gate':dg,'openhands':oh,'initial_sha256':sha(INITIAL),'diamond_gate_output_sha256':sha(dg['output']),'openhands_output_sha256':sha(oh['output']),'result':'PAIR_PASS' if dg['pass'] and oh['pass'] else 'PAIR_INCOMPLETE'}
path=pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-ir01-paired-receipt.json'
path.write_text(json.dumps(receipt,indent=2))
print(json.dumps({'result':receipt['result'],'diamond_gate_pass':dg['pass'],'openhands_pass':oh['pass'],'diamond_gate_elapsed_s':dg['elapsed_s'],'openhands_elapsed_s':oh['elapsed_s']},indent=2))
raise SystemExit(0 if receipt['result']=='PAIR_PASS' else 3)
