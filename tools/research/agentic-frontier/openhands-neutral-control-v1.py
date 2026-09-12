#!/usr/bin/env python3
import hashlib, json, os, pathlib, shutil, signal, subprocess, threading, time, queue

ROOT = pathlib.Path('/tmp/agentic-frontier-openhands-neutral-control')
MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:7b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')
INACTIVITY = int(os.environ.get('OPENHANDS_INACTIVITY_S', '180'))
HARD = int(os.environ.get('OPENHANDS_HARD_TIMEOUT_S', '600'))
HEARTBEAT = int(os.environ.get('PAIR_HEARTBEAT_S', '15'))
INITIAL = "export const value = 1;\n"
TEST = "import assert from 'node:assert/strict';\nimport { value } from './value.mjs';\nassert.equal(value, 2);\nconsole.log('PASS OPENHANDS-NEUTRAL-CONTROL');\n"
TASK = 'Modify value.mjs only so node test.mjs passes. Inspect the workspace, edit value.mjs, run node test.mjs, and finish only when it passes.'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(cmd, cwd=None, env=None, timeout=60):
    return subprocess.run(cmd, cwd=cwd, env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)


def main():
    if ROOT.exists(): shutil.rmtree(ROOT)
    ROOT.mkdir(parents=True)
    (ROOT/'value.mjs').write_text(INITIAL)
    (ROOT/'test.mjs').write_text(TEST)
    run(['git','init','-q'], ROOT)
    run(['git','config','user.email','agentic-frontier@example.invalid'], ROOT)
    run(['git','config','user.name','Agentic Frontier'], ROOT)
    run(['git','add','.'], ROOT); run(['git','commit','-qm','neutral control fixture'], ROOT)
    before = sha(ROOT/'value.mjs')
    env=os.environ.copy(); env.update({
        'LLM_API_KEY':'local-placeholder',
        'LLM_MODEL':'openai/'+MODEL,
        'LLM_BASE_URL':OLLAMA+'/v1',
        'WORKSPACE_DIR':str(ROOT),
        'OPENHANDS_SUPPRESS_BANNER':'1',
        'PYTHONUNBUFFERED':'1'
    })
    cmd=['openhands','--headless','--json','--always-approve','--override-with-envs','-t',TASK]
    started=time.monotonic(); last_activity=started; last_hb=started; q=queue.Queue(); lines=[]; inactive=False; hard=False
    p=subprocess.Popen(cmd,cwd=ROOT,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=1,start_new_session=True)
    def reader():
        try:
            for line in iter(p.stdout.readline,''): q.put(line)
        finally: q.put(None)
    threading.Thread(target=reader,daemon=True).start(); done=False; prior=before
    while p.poll() is None or not done:
        now=time.monotonic(); drained=False
        while True:
            try: item=q.get_nowait()
            except queue.Empty: break
            if item is None: done=True; break
            drained=True; lines.append(item); print('[OPENHANDS] '+item,end='',flush=True); last_activity=now
        cur=sha(ROOT/'value.mjs')
        if cur != prior:
            print(f'[NEUTRAL] workspace changed {prior[:10]} -> {cur[:10]}', flush=True); prior=cur; last_activity=now
        if now-last_hb >= HEARTBEAT:
            print(f'[NEUTRAL] heartbeat elapsed={int(now-started)}s idle={int(now-last_activity)}s file={prior[:10]}', flush=True); last_hb=now
        if now-last_activity >= INACTIVITY:
            inactive=True; os.killpg(p.pid,signal.SIGTERM); break
        if now-started >= HARD:
            hard=True; os.killpg(p.pid,signal.SIGTERM); break
        if not drained: time.sleep(1)
    if p.poll() is None:
        try: p.wait(timeout=10)
        except subprocess.TimeoutExpired: os.killpg(p.pid,signal.SIGKILL); p.wait(timeout=5)
    verifier=run(['node','test.mjs'],ROOT)
    after=sha(ROOT/'value.mjs')
    receipt={
        'schema':'AGENTIC_FRONTIER_OPENHANDS_NEUTRAL_CAPABILITY_CONTROL_v1',
        'model':MODEL,
        'openhands_version':'1.14.0',
        'task':TASK,
        'workspace_changed':after != before,
        'verifier_pass':verifier.returncode == 0,
        'agent_exit_code':p.returncode,
        'inactivity_timeout':inactive,
        'hard_timeout':hard,
        'initial_sha256':before,
        'final_sha256':after,
        'elapsed_s':round(time.monotonic()-started,3),
        'verifier_tail':verifier.stdout[-1600:],
        'agent_log_tail':''.join(lines)[-12000:],
        'result':'PASS' if verifier.returncode == 0 else 'FAIL'
    }
    out=pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-openhands-neutral-control-v1.json'
    out.write_text(json.dumps(receipt,indent=2))
    print(json.dumps({k:receipt[k] for k in ['result','workspace_changed','verifier_pass','inactivity_timeout','hard_timeout','elapsed_s']},indent=2))
    raise SystemExit(0 if receipt['result']=='PASS' else 5)

if __name__ == '__main__': main()
