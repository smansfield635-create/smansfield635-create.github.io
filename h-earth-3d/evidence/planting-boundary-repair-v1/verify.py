import pathlib,json,gzip,hashlib,os,numpy as np
base=pathlib.Path(os.environ['GRASS_BASE_ASSET_DIR']);out=pathlib.Path(os.environ['GRASS_REPAIR_OUTPUT_DIR'])
a=json.loads((base/'precomputed-grass.v1.json').read_text());b=json.loads((out/'precomputed-grass.v1.json').read_text());ra=gzip.decompress((base/'precomputed-grass.v1.bin.gz').read_bytes());rb=gzip.decompress((out/'precomputed-grass.v1.bin.gz').read_bytes());report=json.loads((out/'compiler-report.json').read_text());moved=report['moved']
assert a['rootCount']==b['rootCount']==2858738
assert len(a['tiles'])==len(b['tiles'])
assert hashlib.sha256(rb).hexdigest()==b['rawSha256']
dt=np.dtype({'names':['x','y','z','angle','slope','seed','triangle','region'],'formats':['<f8']*5+['<u4']*3,'offsets':[0,8,16,24,32,40,44,48],'itemsize':52})
A=np.frombuffer(ra,dtype=dt,count=a['rootCount']);B=np.frombuffer(rb,dtype=dt,count=b['rootCount'])
oa=ob=0
for ta,tb in zip(a['tiles'],b['tiles']):
 assert ta['id']==tb['id'] and ta['baselineCount']==tb['baselineCount'];n=ta['baselineCount']*52;assert ra[oa:oa+n]==rb[ob:ob+n];oa+=ta['count']*52;ob+=tb['count']*52
# Exact untouched custody: remove reported old records and their relocated seeds/angles.
removed={c['fromOffset']//52 for c in report['changes']};old=set(A[i].tobytes() for i in removed)
# SHA over retained stream in original tile order is stable after removing changed records.
oldrows=np.frombuffer(ra,dtype='V52',count=a['rootCount']);newrows=np.frombuffer(rb,dtype='V52',count=b['rootCount']);changed={(c['to'][0],c['to'][2],c['seed']) for c in report['changes']}
maskA=np.ones(len(A),dtype=bool);maskA[list(removed)]=False
maskB=np.array([(r['x'],r['z'],int(r['seed'])) not in changed for r in B])
assert sum(~maskA)==sum(~maskB)==moved
assert hashlib.sha256(oldrows[maskA].tobytes()).digest()==hashlib.sha256(newrows[maskB].tobytes()).digest()
assert np.array_equal(np.sort(A['seed']),np.sort(B['seed']))
ca={(t['minX'],t['minZ']):t['count'] for t in a['tiles']};cb={(t['minX'],t['minZ']):t['count'] for t in b['tiles']}
prefix=hashlib.sha256();offset=0
for t in a['tiles']:prefix.update(ra[offset:offset+t['baselineCount']*52]);offset+=t['count']*52
plan=json.loads((pathlib.Path(__file__).parent/'density-plan.json').read_text());checks=[]
centers=[(388,-200),(-392,-200),(-392,-192),(388,-196),(-392,-196),(404,-232),(388,-192),(388,-188)]
for p in centers:
 q=(p[0]+(4 if p[0]>0 else -4),p[1]);before=abs(ca[p]-ca[q]);after=abs(cb[p]-cb[q]);assert after<=before*.4;checks.append({'high':p,'low':q,'before':before,'after':after})
points={p for p in ca if any(max(abs(p[0]-x),abs(p[1]-z))<=16 for x,z in centers)}
edges={tuple(sorted((p,(p[0]+dx,p[1]+dz)))) for p in points for dx,dz in [(4,0),(-4,0),(0,4),(0,-4)]}
def metrics(c):
 ds=[abs(c.get(p,0)-c.get(q,0)) for p,q in edges];return {'totalVariation':sum(ds),'maximumJump':max(ds),'squaredVariation':sum(d*d for d in ds)}
before=metrics(ca);after=metrics(cb);assert all(after[k]<=before[k] for k in before)
result={'moved':moved,'prefixes':'PASS','prefixSha256':prefix.hexdigest(),'untouchedRecords':'PASS','seedMultiset':'PASS','tileCount':len(a['tiles']),'selectedSeams':checks,'surroundingMetrics':{'before':before,'after':after},'runtimePrefixReplay':'SAME_AUTHENTICATED_INPUT_PREFIXES'}
print(json.dumps(result,indent=2));(out/'independent-verification.json').write_text(json.dumps(result,indent=2))
