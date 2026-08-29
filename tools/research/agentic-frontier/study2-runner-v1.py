#!/usr/bin/env python3
import pathlib

BASE = pathlib.Path(__file__).with_name('full-study-v1.py')
src = BASE.read_text()

required = [
    "ROOT = pathlib.Path('/tmp/agentic-frontier-full24')",
    "MODEL = os.environ.get('OLLAMA_MODEL','qwen2.5-coder:7b')",
    "def model_generate(prompt):",
    "def extract_files(text,modifiable):",
    "env=os.environ.copy(); env.update({'LLM_API_KEY':'local-placeholder','LLM_MODEL':'openai/'+MODEL,'LLM_BASE_URL':OLLAMA+'/v1','WORKSPACE_DIR':str(path),'OPENHANDS_SUPPRESS_BANNER':'1','PYTHONUNBUFFERED':'1'})",
    "tasks=[tid for tid,s in SPECS.items() if s['stratum']==STRATUM]",
]
for marker in required:
    if src.count(marker) != 1:
        raise SystemExit(f'STUDY2_SOURCE_REBIND_FAILURE: {marker!r} count={src.count(marker)}')

src = src.replace(
    "ROOT = pathlib.Path('/tmp/agentic-frontier-full24')",
    "ROOT = pathlib.Path('/tmp/agentic-frontier-study2')",
)
src = src.replace(
    "MODEL = os.environ.get('OLLAMA_MODEL','qwen2.5-coder:7b')\nOLLAMA = os.environ.get('OLLAMA_HOST_URL','http://127.0.0.1:11434')",
    "MODEL = os.environ.get('STUDY2_MODEL','gpt-5-2025-08-07')\n"
    "OPENAI_API_KEY = os.environ['OPENAI_API_KEY']\n"
    "OPENAI_API_URL = os.environ.get('OPENAI_API_URL','https://api.openai.com/v1/chat/completions')",
)
src = src.replace(
    "OUT = pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-full24'/STRATUM",
    "OUT = pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-study2'/STRATUM",
)

start = src.index('def model_generate(prompt):')
end = src.index('def extract_files(text,modifiable):', start)
cloud_model_generate = '''def model_generate(prompt):
    state={'done':False,'error':None,'text':None}
    def worker():
        try:
            payload=json.dumps({
                'model':MODEL,
                'messages':[{'role':'user','content':prompt}],
            }).encode()
            req=urllib.request.Request(
                OPENAI_API_URL,
                data=payload,
                headers={
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+OPENAI_API_KEY,
                },
            )
            with urllib.request.urlopen(req,timeout=MODEL_HARD_TIMEOUT_S) as r:
                body=json.loads(r.read().decode())
            state['text']=body['choices'][0]['message']['content'] or ''
        except Exception as e:
            state['error']=repr(e)
        finally:
            state['done']=True
    threading.Thread(target=worker,daemon=True).start()
    started=time.monotonic(); last=started
    while not state['done']:
        now=time.monotonic()
        if now-started > MODEL_HARD_TIMEOUT_S:
            raise TimeoutError(f'cloud model hard timeout after {MODEL_HARD_TIMEOUT_S}s')
        if now-last >= HEARTBEAT_S:
            log(f'cloud model waiting elapsed={int(now-started)}s model={MODEL}')
            last=now
        time.sleep(1)
    if state['error']:
        raise RuntimeError(state['error'])
    return state['text']

'''
src = src[:start] + cloud_model_generate + src[end:]

old_env = "env=os.environ.copy(); env.update({'LLM_API_KEY':'local-placeholder','LLM_MODEL':'openai/'+MODEL,'LLM_BASE_URL':OLLAMA+'/v1','WORKSPACE_DIR':str(path),'OPENHANDS_SUPPRESS_BANNER':'1','PYTHONUNBUFFERED':'1'})"
new_env = "env=os.environ.copy(); env.update({'LLM_API_KEY':OPENAI_API_KEY,'OPENAI_API_KEY':OPENAI_API_KEY,'LLM_MODEL':'openai/'+MODEL,'WORKSPACE_DIR':str(path),'OPENHANDS_SUPPRESS_BANNER':'1','PYTHONUNBUFFERED':'1'})"
src = src.replace(old_env, new_env)

ir01 = '''
SPECS['AF-IR-01']={
  'stratum':'IMPLEMENTATION_REPAIR',
  'files':{'slug.mjs':"export function slugify(input) {\\n  return String(input).trim().toLowerCase().replace(/\\\\s+/g, '-');\\n}\\n"},
  'test':"import assert from 'node:assert/strict';\\nimport { slugify } from './slug.mjs';\\nassert.equal(slugify('Hello, World!'),'hello-world');\\nassert.equal(slugify('  Alpha   Beta  '),'alpha-beta');\\nassert.equal(slugify('a___b---c'),'a-b-c');\\nassert.equal(slugify('---'),'');\\nassert.equal(slugify(''),'');\\nconsole.log('PASS AF-IR-01');\\n",
  'modifiable':['slug.mjs'],
  'disruption':None,
  'roles':None,
}
'''
marker = "tasks=[tid for tid,s in SPECS.items() if s['stratum']==STRATUM]"
src = src.replace(marker, ir01 + "\n" + marker)

src = src.replace(
    "'schema':'AGENTIC_FRONTIER_PAIRED_TASK_RECEIPT_v1'",
    "'schema':'AGENTIC_FRONTIER_PAIRED_TASK_RECEIPT_v2','study':'STRONG_MODEL_REPLICATION'",
)
src = src.replace(
    "Starting stratum {STRATUM} tasks={tasks} model={MODEL}",
    "Starting STUDY2 stratum {STRATUM} tasks={tasks} model={MODEL}",
)

compile(src, 'study2-generated.py', 'exec')
exec(compile(src, 'study2-generated.py', 'exec'), {'__name__':'__main__'})
