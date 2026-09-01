#!/usr/bin/env python3
import hashlib, json, os, pathlib, queue, re, shutil, signal, subprocess, threading, time, urllib.request

ROOT = pathlib.Path('/tmp/agentic-frontier-full24')
MODEL = os.environ.get('OLLAMA_MODEL','qwen2.5-coder:7b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL','http://127.0.0.1:11434')
STRATUM = os.environ['AF_STRATUM']
HEARTBEAT_S = int(os.environ.get('PAIR_HEARTBEAT_S','15'))
MODEL_FIRST_TOKEN_TIMEOUT_S = int(os.environ.get('MODEL_FIRST_TOKEN_TIMEOUT_S','90'))
MODEL_HARD_TIMEOUT_S = int(os.environ.get('MODEL_HARD_TIMEOUT_S','240'))
OPENHANDS_INACTIVITY_S = int(os.environ.get('OPENHANDS_INACTIVITY_S','180'))
OPENHANDS_HARD_TIMEOUT_S = int(os.environ.get('OPENHANDS_HARD_TIMEOUT_S','600'))
MANIFEST = pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'research/agentic-frontier-comparison/task-manifest-v1.jsonl'
OUT = pathlib.Path(os.environ.get('GITHUB_WORKSPACE','.'))/'agentic-frontier-full24'/STRATUM
OUT.mkdir(parents=True,exist_ok=True)

SPECS = json.loads(r'''{"AF-IR-02":{"stratum":"IMPLEMENTATION_REPAIR","files":{"retry.mjs":"export async function retry(fn, maxAttempts) {\n  let last;\n  for (let i = 0; i <= maxAttempts; i++) {\n    try { return await fn(); } catch (e) { last = e; }\n  }\n  return last;\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { retry } from './retry.mjs';\nlet calls=0;\nconst v=await retry(async()=>{ calls++; if(calls<3) throw new Error('x'); return 42; },3);\nassert.equal(v,42); assert.equal(calls,3);\ncalls=0; const e=new Error('final');\nawait assert.rejects(()=>retry(async()=>{calls++; throw e;},2), e); assert.equal(calls,2);\ncalls=0; await assert.rejects(()=>retry(async()=>{calls++;},0)); assert.equal(calls,0);\nconsole.log('PASS AF-IR-02');\n","modifiable":["retry.mjs"],"disruption":null,"roles":null},"AF-IR-03":{"stratum":"IMPLEMENTATION_REPAIR","files":{"merge.mjs":"export function mergeConfig(base, override) {\n  return { ...base, ...override };\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { mergeConfig } from './merge.mjs';\nconst base={a:{b:1,c:2}, arr:[1,2], keep:7, prim:1};\nconst over={a:{b:9}, arr:[3], keep:undefined, prim:'x'};\nconst b=structuredClone(base), o=structuredClone(over);\nconst r=mergeConfig(base,over);\nassert.deepEqual(r,{a:{b:9,c:2},arr:[3],keep:7,prim:'x'});\nassert.deepEqual(base,b); assert.deepEqual(over,o);\nconsole.log('PASS AF-IR-03');\n","modifiable":["merge.mjs"],"disruption":null,"roles":null},"AF-IR-04":{"stratum":"IMPLEMENTATION_REPAIR","files":{"cache.mjs":"export class ExpiringMap {\n  constructor(now=()=>Date.now()){ this.now=now; this.map=new Map(); }\n  set(k,v,ttl){ this.map.set(k,{v, insertedAt:this.now(), ttl}); }\n  get(k){ const x=this.map.get(k); if(!x) return undefined; if(this.now() <= x.insertedAt+x.ttl) return x.v; return undefined; }\n  has(k){ return this.get(k)!==undefined; }\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { ExpiringMap } from './cache.mjs';\nlet now=100; const m=new ExpiringMap(()=>now);\nm.set('a',1,5); assert.equal(m.get('a'),1);\nnow=104; assert.equal(m.get('a'),1);\nnow=105; assert.equal(m.get('a'),undefined); assert.equal(m.map.has('a'),false);\nm.set('z',9,0); assert.equal(m.get('z'),undefined); assert.equal(m.map.has('z'),false);\nconsole.log('PASS AF-IR-04');\n","modifiable":["cache.mjs"],"disruption":null,"roles":null},"AF-IR-05":{"stratum":"IMPLEMENTATION_REPAIR","files":{"graph.mjs":"export function topoSort(nodes, edges) {\n  return [...nodes].sort();\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { topoSort } from './graph.mjs';\nassert.deepEqual(topoSort(['c','a','b'],[['a','c'],['b','c']]),['a','b','c']);\nassert.deepEqual(topoSort(['b','a','d','c'],[['a','d'],['b','d']]),['a','b','c','d']);\nassert.throws(()=>topoSort(['a','b'],[['a','b'],['b','a']]));\nassert.throws(()=>topoSort(['a'],[['a','x']]));\nconsole.log('PASS AF-IR-05');\n","modifiable":["graph.mjs"],"disruption":null,"roles":null},"AF-IR-06":{"stratum":"IMPLEMENTATION_REPAIR","files":{"csv.mjs":"export function parseRecord(line) { return line.split(','); }\n"},"test":"import assert from 'node:assert/strict';\nimport { parseRecord } from './csv.mjs';\nassert.deepEqual(parseRecord('a,b,c'),['a','b','c']);\nassert.deepEqual(parseRecord('a,\"b,c\",d'),['a','b,c','d']);\nassert.deepEqual(parseRecord('\"a\"\"b\",c'),['a\"b','c']);\nassert.throws(()=>parseRecord('a,\"b,c'));\nconsole.log('PASS AF-IR-06');\n","modifiable":["csv.mjs"],"disruption":null,"roles":null},"AF-LH-01":{"stratum":"LONG_HORIZON","files":{"inventory.mjs":"export class Inventory {\n  constructor(stock={}) { this.stock={...stock}; }\n  reserve(sku, qty){ this.stock[sku]=(this.stock[sku]??0)-qty; return true; }\n}\n","service.mjs":"export function createService(inventory){\n  const ledger=[];\n  return { ledger, reserve(req){ inventory.reserve(req.sku,req.qty); ledger.push(req); return {id:ledger.length}; } };\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { Inventory } from './inventory.mjs';\nimport { createService } from './service.mjs';\nconst inv=new Inventory({A:5}); const s=createService(inv);\nconst r1=s.reserve({requestId:'x',sku:'A',qty:2});\nconst r2=s.reserve({requestId:'x',sku:'A',qty:2});\nassert.deepEqual(r2,r1); assert.equal(inv.stock.A,3); assert.equal(s.ledger.length,1);\nassert.throws(()=>s.reserve({requestId:'z',sku:'A',qty:0}));\nassert.throws(()=>s.reserve({requestId:'y',sku:'A',qty:4}));\nassert.equal(inv.stock.A,3); assert.equal(s.ledger.length,1);\nconsole.log('PASS AF-LH-01');\n","modifiable":["inventory.mjs","service.mjs"],"disruption":null,"roles":null},"AF-LH-02":{"stratum":"LONG_HORIZON","files":{"defaults.mjs":"export const defaults={port:3000,retries:3};\n","env.mjs":"export function fromEnv(env){ return {port:Number(env.PORT), retries:Number(env.RETRIES)}; }\n","config.mjs":"import {defaults} from './defaults.mjs'; import {fromEnv} from './env.mjs';\nexport function resolveConfig(explicit={},env={}){ return {...defaults,...fromEnv(env),...explicit}; }\n"},"test":"import assert from 'node:assert/strict';\nimport { resolveConfig } from './config.mjs';\nassert.deepEqual(resolveConfig({},{}),{port:3000,retries:3});\nassert.deepEqual(resolveConfig({}, {PORT:'4000',RETRIES:''}),{port:4000,retries:3});\nassert.deepEqual(resolveConfig({port:5000},{PORT:'4000'}),{port:5000,retries:3});\nassert.throws(()=>resolveConfig({unknown:1},{}));\nassert.throws(()=>resolveConfig({}, {PORT:'2.5'}));\nassert.throws(()=>resolveConfig({}, {PORT:'0'}));\nconsole.log('PASS AF-LH-02');\n","modifiable":["defaults.mjs","env.mjs","config.mjs"],"disruption":null,"roles":null},"AF-LH-03":{"stratum":"LONG_HORIZON","files":{"machine.mjs":"export class Machine {\n  constructor(){ this.state='CREATED'; this.history=[]; }\n  transition(next){ this.state=next; this.history.push(next); return true; }\n}\n"},"test":"import assert from 'node:assert/strict';\nimport { Machine } from './machine.mjs';\nconst m=new Machine(); assert.equal(m.state,'CREATED'); assert.deepEqual(m.history,['CREATED']);\nassert.equal(m.transition('RUNNING'),false); assert.equal(m.state,'CREATED');\nassert.equal(m.transition('READY'),true); assert.equal(m.transition('RUNNING'),true); assert.equal(m.transition('FAILED'),true);\nconst h=[...m.history]; assert.equal(m.transition('DONE'),false); assert.deepEqual(m.history,h);\nassert.equal(m.transition('READY'),true); assert.equal(m.transition('RUNNING'),true); assert.equal(m.transition('DONE'),true);\nconsole.log('PASS AF-LH-03');\n","modifiable":["machine.mjs"],"disruption":null,"roles":null},"AF-LH-04":{"stratum":"LONG_HORIZON","files":{"planner.mjs":"export function planBatches(nodes, edges){ return [[...nodes].sort()]; }\n"},"test":"import assert from 'node:assert/strict';\nimport { planBatches } from './planner.mjs';\nassert.deepEqual(planBatches(['a','b','c','d'],[['a','c'],['b','c'],['c','d']]),[['a','b'],['c'],['d']]);\nassert.deepEqual(planBatches(['b','a','c'],[]),[['a','b','c']]);\nassert.throws(()=>planBatches(['a','b'],[['a','b'],['b','a']]));\nconsole.log('PASS AF-LH-04');\n","modifiable":["planner.mjs"],"disruption":null,"roles":null},"AF-LH-05":{"stratum":"LONG_HORIZON","files":{"reducer.mjs":"export function applyEvent(state,e){ state.total += e.delta; return state; }\n","snapshot.mjs":"import {applyEvent} from './reducer.mjs';\nexport function replay(snapshot,events){ const s=snapshot; for(const e of events) if(e.seq>snapshot.seq) applyEvent(s,e); return s; }\n"},"test":"import assert from 'node:assert/strict';\nimport { replay } from './snapshot.mjs';\nconst snap={seq:2,total:10}; const ev=[{seq:4,delta:3},{seq:1,delta:99},{seq:3,delta:2}];\nconst s0=structuredClone(snap), e0=structuredClone(ev);\nassert.deepEqual(replay(snap,ev),{seq:4,total:15});\nassert.deepEqual(snap,s0); assert.deepEqual(ev,e0);\nassert.throws(()=>replay(snap,[{seq:3,delta:1},{seq:3,delta:2}]));\nconsole.log('PASS AF-LH-05');\n","modifiable":["reducer.mjs","snapshot.mjs"],"disruption":null,"roles":null},"AF-LH-06":{"stratum":"LONG_HORIZON","files":{"codec.mjs":"export function encode(x){ return JSON.stringify(x); }\nexport function decode(s){ return JSON.parse(s); }\n"},"test":"import assert from 'node:assert/strict';\nimport { encode, decode } from './codec.mjs';\nconst v2={version:2,name:'n',tags:['a']}; assert.deepEqual(decode(encode(v2)),v2);\nassert.deepEqual(decode(JSON.stringify({version:1,label:'old'})),{version:2,name:'old',tags:[]});\nassert.throws(()=>decode(JSON.stringify({version:9,name:'x'})));\nassert.equal(JSON.parse(encode({name:'x',tags:[]})).version,2);\nconsole.log('PASS AF-LH-06');\n","modifiable":["codec.mjs"],"disruption":null,"roles":null},"AF-CH-01":{"stratum":"COLLABORATIVE_HANDOFF","files":{"router.mjs":"export function resolve(routes,path){ return routes.find(r=>path.startsWith(r.path))?.name; }\n"},"test":"import assert from 'node:assert/strict'; import {resolve} from './router.mjs';\nconst r=[{path:'/*',name:'wild'},{path:'/:id',name:'param'},{path:'/users',name:'static'}];\nassert.equal(resolve(r,'/users'),'static'); assert.equal(resolve(r,'/abc'),'param'); assert.equal(resolve(r,'/a/b'),'wild');\nconst t=[{path:'/:x',name:'first'},{path:'/:y',name:'second'}]; assert.equal(resolve(t,'/z'),'first');\nconsole.log('PASS AF-CH-01');\n","modifiable":["router.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-CH-02":{"stratum":"COLLABORATIVE_HANDOFF","files":{"scope.mjs":"export function allowed(grant,scope){ return scope.startsWith(grant.replace('*','')); }\n"},"test":"import assert from 'node:assert/strict'; import {allowed} from './scope.mjs';\nassert.equal(allowed('repo:a','repo:a'),true); assert.equal(allowed('repo:a','repo:ab'),false);\nassert.equal(allowed('repo:*','repo:a'),true); assert.equal(allowed('repo:*','org:a'),false);\nassert.equal(allowed('*','anything'),true); assert.equal(allowed('repo:a','repo:a/x'),false);\nconsole.log('PASS AF-CH-02');\n","modifiable":["scope.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-CH-03":{"stratum":"COLLABORATIVE_HANDOFF","files":{"stable.mjs":"export function stableStringify(x){ return JSON.stringify(x); }\n"},"test":"import assert from 'node:assert/strict'; import {stableStringify} from './stable.mjs';\nassert.equal(stableStringify({b:1,a:{d:2,c:3}}),'{\"a\":{\"c\":3,\"d\":2},\"b\":1}');\nassert.equal(stableStringify([3,{b:2,a:1}]),'[3,{\"a\":1,\"b\":2}]');\nconst x={}; x.self=x; assert.throws(()=>stableStringify(x));\nassert.equal(stableStringify(null),'null'); assert.equal(stableStringify(true),'true');\nconsole.log('PASS AF-CH-03');\n","modifiable":["stable.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-CH-04":{"stratum":"COLLABORATIVE_HANDOFF","files":{"registry.mjs":"export class Registry{\n  constructor(){this.items=new Map();}\n  register(name,deps,init){this.items.set(name,{deps,init,value:undefined});}\n  initAll(){ for(const [n,x] of this.items) x.value=x.init(...x.deps.map(d=>this.items.get(d)?.value)); return Object.fromEntries([...this.items].map(([n,x])=>[n,x.value]));}\n}\n"},"test":"import assert from 'node:assert/strict'; import {Registry} from './registry.mjs';\nconst r=new Registry(); let ac=0,bc=0;\nr.register('b',['a'],a=>{bc++; return a+1}); r.register('a',[],()=>{ac++; return 2});\nassert.deepEqual(r.initAll(),{b:3,a:2}); assert.deepEqual(r.initAll(),{b:3,a:2}); assert.equal(ac,1); assert.equal(bc,1);\nconst c=new Registry(); c.register('a',['b'],()=>1); c.register('b',['a'],()=>2); assert.throws(()=>c.initAll());\nconsole.log('PASS AF-CH-04');\n","modifiable":["registry.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-CH-05":{"stratum":"COLLABORATIVE_HANDOFF","files":{"queue.mjs":"export class Queue{ constructor(){this.items=[];} enqueue(key,payload){ const id=this.items.length+1; this.items.push({id,key,payload}); return id; } }\n"},"test":"import assert from 'node:assert/strict'; import {Queue} from './queue.mjs';\nconst q=new Queue(); assert.equal(q.enqueue('a',1),1); assert.equal(q.enqueue('b',2),2); assert.equal(q.enqueue('a',9),1);\nassert.deepEqual(q.items.map(x=>x.key),['a','b']); assert.deepEqual(q.items.map(x=>x.id),[1,2]);\nconsole.log('PASS AF-CH-05');\n","modifiable":["queue.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-CH-06":{"stratum":"COLLABORATIVE_HANDOFF","files":{"ranges.mjs":"export class RangeSet{ constructor(){this.ranges=[];} add(start,end){ this.ranges.push([start,end]); this.ranges.sort((a,b)=>a[0]-b[0]); } }\n"},"test":"import assert from 'node:assert/strict'; import {RangeSet} from './ranges.mjs';\nconst r=new RangeSet(); assert.throws(()=>r.add(3,2)); r.add(5,6); r.add(1,2); r.add(3,4); assert.deepEqual(r.ranges,[[1,6]]);\nconst s=new RangeSet(); s.add(1,2); s.add(4,5); assert.deepEqual(s.ranges,[[1,2],[4,5]]);\nconsole.log('PASS AF-CH-06');\n","modifiable":["ranges.mjs"],"disruption":null,"roles":["diagnoser","implementer","independent_verifier"]},"AF-FR-01":{"stratum":"FAILURE_RECOVERY","files":{"counter.mjs":"export function applyCounter(state,op){ state.value += op.delta; return state; }\n"},"test":"import assert from 'node:assert/strict'; import {applyCounter} from './counter.mjs';\nconst s={value:0,seen:new Set()}; applyCounter(s,{id:'a',delta:2}); applyCounter(s,{id:'a',delta:2}); assert.equal(s.value,2);\napplyCounter(s,{id:'b',delta:-1}); assert.equal(s.value,1); console.log('PASS AF-FR-01');\n","modifiable":["counter.mjs"],"disruption":{"type":"STALE_HEAD_AFTER_FIRST_CANDIDATE"},"roles":null},"AF-FR-02":{"stratum":"FAILURE_RECOVERY","files":{"math.mjs":"export function clamp(x,min,max){ return Math.min(max,Math.max(min,x)); }\n"},"test":"import assert from 'node:assert/strict'; import {clamp} from './math.mjs';\nassert.equal(clamp(5,0,10),5); assert.equal(clamp(-1,0,10),0); assert.equal(clamp(11,0,10),10);\nassert.throws(()=>clamp(1,5,4)); assert.ok(Number.isNaN(clamp(NaN,0,10))); console.log('PASS AF-FR-02');\n","modifiable":["math.mjs"],"disruption":{"type":"INCOMPLETE_EARLY_VERIFIER"},"roles":null},"AF-FR-03":{"stratum":"FAILURE_RECOVERY","files":{"port.mjs":"export function parsePort(x){ return parseInt(x,0); }\n"},"test":"import assert from 'node:assert/strict'; import {parsePort} from './port.mjs';\nassert.equal(parsePort('1'),1); assert.equal(parsePort('65535'),65535);\nfor(const x of ['0','65536','1.5','0x10','', '  ']) assert.throws(()=>parsePort(x));\nconsole.log('PASS AF-FR-03');\n","modifiable":["port.mjs"],"disruption":{"type":"CONFLICTING_NONAUTHORITATIVE_ASSUMPTION"},"roles":null},"AF-FR-04":{"stratum":"FAILURE_RECOVERY","files":{"once.mjs":"export function once(fn){ let done=false,v; return function(...a){ if(!done){done=true;v=fn(...a)} return v; } }\n"},"test":"import assert from 'node:assert/strict'; import {once} from './once.mjs';\nlet n=0; const o=once(function(x){n++; if(n===1) throw new Error('x'); return this.k+x});\nassert.throws(()=>o.call({k:1},2)); assert.equal(o.call({k:5},3),8); assert.equal(o.call({k:9},9),8); assert.equal(n,2);\nconsole.log('PASS AF-FR-04');\n","modifiable":["once.mjs"],"disruption":{"type":"FIRST_CANDIDATE_REVERTED"},"roles":null},"AF-FR-05":{"stratum":"FAILURE_RECOVERY","files":{"unique.mjs":"export function uniqueBy(items,keyFn){ return [...new Set(items.map(keyFn))]; }\n"},"test":"import assert from 'node:assert/strict'; import {uniqueBy} from './unique.mjs';\nconst a=[{id:1,v:'a'},{id:2,v:'b'},{id:1,v:'c'}]; assert.deepEqual(uniqueBy(a,x=>x.id),[a[0],a[1]]);\nconst k={}; const b=[{k,v:1},{k,v:2}]; assert.deepEqual(uniqueBy(b,x=>x.k),[b[0]]);\nconsole.log('PASS AF-FR-05');\n","modifiable":["unique.mjs"],"disruption":{"type":"HEAD_ADVANCE_UNRELATED_COMMIT"},"roles":null},"AF-FR-06":{"stratum":"FAILURE_RECOVERY","files":{"median.mjs":"export function median(xs){ const a=[...xs].sort(); return a[Math.floor(a.length/2)]; }\n"},"test":"import assert from 'node:assert/strict'; import {median} from './median.mjs';\nconst a=[10,2,3]; assert.equal(median(a),3); assert.deepEqual(a,[10,2,3]);\nassert.equal(median([1,2,3,4]),2.5); assert.equal(median([100,2,30]),30); assert.throws(()=>median([]));\nconsole.log('PASS AF-FR-06');\n","modifiable":["median.mjs"],"disruption":{"type":"INCOMPLETE_FIRST_SOLUTION"},"roles":null}}''')

# The rest of this runner is intentionally compact: it materializes one identical neutral fixture per lane,
# runs the Diamond Gate verifier-driven loop and stock OpenHands, applies preregistered disruptions, and
# writes one receipt per frozen task plus a stratum JSONL ledger.

def log(msg): print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)
def run(cmd,cwd=None,env=None,timeout=120): return subprocess.run(cmd,cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=timeout)
def sha_file(path):
    try:return hashlib.sha256(path.read_bytes()).hexdigest()
    except FileNotFoundError:return 'MISSING'
def git_tree(path):
    p=run(['git','write-tree'],cwd=path); return p.stdout.strip() if p.returncode==0 else ''
def load_manifest():
    rows=[json.loads(x) for x in MANIFEST.read_text().splitlines() if x.strip()]; assert len(rows)==24 and all(r.get('frozen') is True for r in rows); return {r['task_id']:r for r in rows}
MAN=load_manifest()
def fixture(task_id,lane):
    spec=SPECS[task_id]; p=ROOT/task_id/lane
    if p.exists(): shutil.rmtree(p)
    p.mkdir(parents=True)
    for name,content in spec['files'].items(): (p/name).write_text(content)
    (p/'test.mjs').write_text(spec['test']); run(['git','init','-q'],cwd=p); run(['git','config','user.email','agentic-frontier@example.invalid'],cwd=p); run(['git','config','user.name','Agentic Frontier'],cwd=p); run(['git','add','.'],cwd=p); run(['git','commit','-qm',f'frozen {task_id} fixture'],cwd=p); return p
def acceptance(path):
    p=run(['node','test.mjs'],cwd=path,timeout=60); return p.returncode==0,p.stdout
def scope_ok(path,allowed):
    p=run(['git','status','--porcelain'],cwd=path); changed=[line[3:].strip() for line in p.stdout.splitlines() if line.strip()]; bad=[x for x in changed if x not in allowed]; return not bad,changed,bad
def model_generate(prompt):
    state={'first':None,'done':False,'error':None,'chars':0,'pieces':[]}
    def worker():
        try:
            payload=json.dumps({'model':MODEL,'prompt':prompt,'stream':True,'options':{'temperature':0}}).encode(); req=urllib.request.Request(OLLAMA+'/api/generate',data=payload,headers={'Content-Type':'application/json'})
            with urllib.request.urlopen(req,timeout=MODEL_HARD_TIMEOUT_S) as r:
                for raw in r:
                    if not raw.strip(): continue
                    body=json.loads(raw); piece=body.get('response','')
                    if piece and state['first'] is None: state['first']=time.monotonic()
                    state['pieces'].append(piece); state['chars']+=len(piece)
                    if body.get('done'): break
        except Exception as e: state['error']=repr(e)
        finally: state['done']=True
    start=time.monotonic(); threading.Thread(target=worker,daemon=True).start(); last=0
    while not state['done']:
        now=time.monotonic()
        if state['first'] is None and now-start>MODEL_FIRST_TOKEN_TIMEOUT_S: raise TimeoutError('MODEL_FIRST_TOKEN_TIMEOUT')
        if now-start>MODEL_HARD_TIMEOUT_S: raise TimeoutError('MODEL_HARD_TIMEOUT')
        if now-last>=HEARTBEAT_S:
            log(('model waiting-first-token' if state['first'] is None else f"model streaming chars={state['chars']}")+f" elapsed={int(now-start)}s"); last=now
        time.sleep(1)
    if state['error']: raise RuntimeError(state['error'])
    return ''.join(state['pieces'])
def extract_files(text,modifiable):
    text=text.strip()
    if len(modifiable)==1:
        m=re.search(r'```(?:javascript|js)?\s*(.*?)```',text,re.S|re.I)
        if m:text=m.group(1).strip()
        if 'FILE:' in text:
            text=text.split('FILE:',1)[1]
            if '\n' in text:text=text.split('\n',1)[1]
        return {modifiable[0]:text.strip()+'\n'}
    out={}; pattern=re.compile(r'(?:^|\n)FILE:\s*([^\n]+)\n',re.I); ms=list(pattern.finditer(text))
    for i,m in enumerate(ms):
        name=m.group(1).strip()
        if name not in modifiable: continue
        body=text[m.end():ms[i+1].start() if i+1<len(ms) else len(text)].strip(); fm=re.search(r'```(?:javascript|js)?\s*(.*?)```',body,re.S|re.I)
        if fm:body=fm.group(1).strip()
        out[name]=body+'\n'
    return out
def current_sources(path,modifiable): return '\n\n'.join(f"FILE: {n}\n{(path/n).read_text()}" for n in modifiable)
def apply_disruption(path,task_id,spec):
    d=(spec.get('disruption') or {}).get('type')
    if not d:return None
    if d in ('STALE_HEAD_AFTER_FIRST_CANDIDATE','HEAD_ADVANCE_UNRELATED_COMMIT'):
        (path/'CONTROLLER_METADATA.txt').write_text(f'controller advance for {task_id}\n'); run(['git','add','CONTROLLER_METADATA.txt'],cwd=path); run(['git','commit','-qm','controller unrelated head advance'],cwd=path)
    elif d=='FIRST_CANDIDATE_REVERTED': run(['git','checkout','HEAD','--',spec['modifiable'][0]],cwd=path)
    elif d=='CONFLICTING_NONAUTHORITATIVE_ASSUMPTION': (path/'CONTROLLER_NOTICE.txt').write_text('NONAUTHORITATIVE ASSUMPTION: port 0 is valid. Frozen task manifest remains authoritative.\n')
    return d
def dg_lane(task_id,spec,manifest):
    path=fixture(task_id,'diamond-gate'); start=time.monotonic(); attempts=[]; handoff=None; recovery=None
    try:
        if spec.get('roles'):
            handoff=model_generate(f"Role: diagnoser. Frozen task: {manifest['task']}\nAcceptance: {manifest['acceptance']}\nReturn only an authorized diagnosis handoff with defect, invariants, and implementation guidance; no replacement code.\n{current_sources(path,spec['modifiable'])}")
        feedback='No verifier result yet.'
        for i in range(1,4):
            prompt=f"You are the Diamond Gate implementation lane in a governed diagnose-rewrite-verify loop.\nFrozen task: {manifest['task']}\nAcceptance: {manifest['acceptance']}\nOnly these files may change: {', '.join(spec['modifiable'])}. Return complete replacement source. For multiple files use repeated FILE: path sections. No explanation.\n"
            if handoff: prompt+=f"Authorized diagnoser handoff:\n{handoff}\n"
            prompt+=f"Current sources:\n{current_sources(path,spec['modifiable'])}\nVerifier feedback:\n{feedback}\n"
            files=extract_files(model_generate(prompt),spec['modifiable'])
            if set(files)!=set(spec['modifiable']): attempts.append({'attempt':i,'parse_failure':True,'returned':list(files)}); feedback='Return every authorized file using exact FILE: path sections.'; continue
            for n,c in files.items():(path/n).write_text(c)
            if i==1 and spec.get('disruption'): recovery=apply_disruption(path,task_id,spec)
            ok,out=acceptance(path); ca=[]
            if (path/'CONTROLLER_METADATA.txt').exists(): ca.append('CONTROLLER_METADATA.txt')
            if (path/'CONTROLLER_NOTICE.txt').exists(): ca.append('CONTROLLER_NOTICE.txt')
            sok,changed,bad=scope_ok(path,spec['modifiable']+ca); attempts.append({'attempt':i,'acceptance_pass':ok,'scope_pass':sok,'verifier':out[-3000:],'changed':changed,'bad':bad}); log(f"{task_id} DG attempt {i} acceptance={ok} scope={sok}")
            if ok and sok:return {'terminal':'PASS','pass':True,'elapsed_s':round(time.monotonic()-start,3),'attempts':attempts,'handoff_conformant':bool(handoff) if spec.get('roles') else None,'recovery_applied':recovery,'recovery_success':True if spec.get('disruption') else None,'tree':git_tree(path)}
            feedback=out
        return {'terminal':'FAIL_TESTS' if not attempts[-1].get('acceptance_pass') else 'FAIL_SCOPE','pass':False,'elapsed_s':round(time.monotonic()-start,3),'attempts':attempts,'handoff_conformant':bool(handoff) if spec.get('roles') else None,'recovery_applied':recovery,'recovery_success':False if spec.get('disruption') else None,'tree':git_tree(path)}
    except TimeoutError as e:return {'terminal':'FAIL_TIMEOUT','pass':False,'elapsed_s':round(time.monotonic()-start,3),'error':str(e),'attempts':attempts,'tree':git_tree(path)}
    except Exception as e:return {'terminal':'INFRA_EXCLUDED','pass':False,'elapsed_s':round(time.monotonic()-start,3),'error':repr(e),'attempts':attempts,'tree':git_tree(path)}
def oh_lane(task_id,spec,manifest):
    path=fixture(task_id,'openhands'); start=time.monotonic(); loglines=[]; first_change=False; disruption_applied=None; env=os.environ.copy(); env.update({'LLM_API_KEY':'local-placeholder','LLM_MODEL':'openai/'+MODEL,'LLM_BASE_URL':OLLAMA+'/v1','WORKSPACE_DIR':str(path),'OPENHANDS_SUPPRESS_BANNER':'1','PYTHONUNBUFFERED':'1'})
    role=''
    if spec.get('roles'): role=' Honor the collaborative boundary and mark DIAGNOSIS_HANDOFF, IMPLEMENTATION_COMPLETE, and INDEPENDENT_VERIFICATION in output.'
    disruption=' A controller may apply the preregistered disruption after your first material file change; continue from resulting state.' if spec.get('disruption') else ''
    task=manifest['task']+f" Only modify {', '.join(spec['modifiable'])}. Run node test.mjs until it passes."+role+disruption; cmd=['openhands','--headless','--json','--always-approve','--override-with-envs','-t',task]; q=queue.Queue(); p=subprocess.Popen(cmd,cwd=path,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=1,start_new_session=True)
    def reader():
        try:
            for line in iter(p.stdout.readline,''):q.put(line)
        finally:q.put(None)
    threading.Thread(target=reader,daemon=True).start(); last_activity=time.monotonic(); last_hb=last_activity; prior={n:sha_file(path/n) for n in spec['modifiable']}; done=False; timeout_kind=None
    while p.poll() is None or not done:
        now=time.monotonic()
        while True:
            try:item=q.get_nowait()
            except queue.Empty:break
            if item is None:done=True;break
            loglines.append(item); print(f"[{task_id} OPENHANDS] {item}",end='',flush=True); last_activity=now
        changed_now=False
        for n in spec['modifiable']:
            cur=sha_file(path/n)
            if cur!=prior[n]: log(f"{task_id} OpenHands workspace changed {n} {prior[n][:8]} -> {cur[:8]}"); prior[n]=cur; last_activity=now; changed_now=True
        if changed_now and not first_change:
            first_change=True
            if spec.get('disruption'): disruption_applied=apply_disruption(path,task_id,spec); prior={n:sha_file(path/n) for n in spec['modifiable']}; last_activity=time.monotonic()
        if now-last_hb>=HEARTBEAT_S: log(f"{task_id} OpenHands heartbeat elapsed={int(now-start)} idle={int(now-last_activity)} first_change={first_change}"); last_hb=now
        if now-last_activity>=OPENHANDS_INACTIVITY_S: timeout_kind='inactivity'; os.killpg(p.pid,signal.SIGTERM); break
        if now-start>=OPENHANDS_HARD_TIMEOUT_S: timeout_kind='hard'; os.killpg(p.pid,signal.SIGTERM); break
        time.sleep(1)
    if p.poll() is None:
        try:p.wait(timeout=10)
        except subprocess.TimeoutExpired: os.killpg(p.pid,signal.SIGKILL); p.wait()
    ok,out=acceptance(path); ca=[]
    if (path/'CONTROLLER_METADATA.txt').exists():ca.append('CONTROLLER_METADATA.txt')
    if (path/'CONTROLLER_NOTICE.txt').exists():ca.append('CONTROLLER_NOTICE.txt')
    sok,changed,bad=scope_ok(path,spec['modifiable']+ca); transcript=''.join(loglines); handoff_ok=None
    if spec.get('roles'):handoff_ok=all(x in transcript for x in ['DIAGNOSIS_HANDOFF','IMPLEMENTATION_COMPLETE','INDEPENDENT_VERIFICATION'])
    terminal='FAIL_TIMEOUT' if timeout_kind else 'FAIL_SCOPE' if not sok else 'FAIL_COORDINATION' if spec.get('roles') and not handoff_ok else 'FAIL_RECOVERY' if spec.get('disruption') and disruption_applied and not ok else 'FAIL_TESTS' if not ok else 'PASS'
    return {'terminal':terminal,'pass':terminal=='PASS','elapsed_s':round(time.monotonic()-start,3),'exit_code':p.returncode,'timeout':timeout_kind,'agent_log_tail':transcript[-16000:],'verifier':out[-3000:],'changed':changed,'bad':bad,'handoff_conformant':handoff_ok,'recovery_applied':disruption_applied,'recovery_success':ok if spec.get('disruption') else None,'tree':git_tree(path)}
tasks=[tid for tid,s in SPECS.items() if s['stratum']==STRATUM]; log(f"Starting stratum {STRATUM} tasks={tasks} model={MODEL}"); rows=[]
for tid in tasks:
    log(f"PAIR START {tid}"); manifest=MAN[tid]; spec=SPECS[tid]; dg=dg_lane(tid,spec,manifest); oh=oh_lane(tid,spec,manifest); paired='BOTH_PASS' if dg['pass'] and oh['pass'] else 'DG_ONLY' if dg['pass'] else 'OH_ONLY' if oh['pass'] else 'NEITHER'; row={'schema':'AGENTIC_FRONTIER_PAIRED_TASK_RECEIPT_v1','task_id':tid,'stratum':STRATUM,'manifest':manifest,'model':MODEL,'openhands_version':'1.14.0','diamond_gate':dg,'openhands':oh,'paired_result':paired}; rows.append(row); (OUT/f"{tid}.json").write_text(json.dumps(row,indent=2)); log(f"PAIR END {tid} result={paired}")
(OUT/'results.jsonl').write_text(''.join(json.dumps(r,separators=(',',':'))+'\n' for r in rows)); log(f"Completed stratum {STRATUM} count={len(rows)}")
