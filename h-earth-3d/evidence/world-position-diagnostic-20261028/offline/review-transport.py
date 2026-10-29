"""Independent synthetic boundary/invariance screen; not scene qualification."""
import importlib.util,numpy as np,json,hashlib
spec=importlib.util.spec_from_file_location('blend','/tmp/world-offline/conservative-blend.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
rng=np.random.default_rng(7991);cases=[]
for mode in ['boundary','all-protected','zero-conductance','duplicate-edges','self-edges']:
 for trial in range(50):
  n=12;Q=rng.choice([0.,1.,.5],(n,3));P=np.zeros_like(Q);L=rng.integers(-5,6,(n,3)).astype(float);R=Q-L
  area=rng.uniform(.1,10,n);edges=np.array([[i,(i+1)%n] for i in range(n)]);s=rng.uniform(0,2,n);protected=np.zeros(n,dtype=bool)
  if mode=='all-protected':protected[:]=True
  if mode=='zero-conductance':s[:]=0
  if mode=='duplicate-edges':edges=np.r_[edges,edges];s=np.r_[s,s]
  if mode=='self-edges':edges=np.c_[np.arange(n),np.arange(n)]
  Qn,Ln,st=m.transport(P,L,R,area,edges,s,protected)
  perm=rng.permutation(len(edges));Qp,_,_=m.transport(P,L,R,area,edges[perm,::-1],s[perm],protected)
  errors={'RGBIntegral':float(np.max(abs(np.sum(area[:,None]*(Qn-Q),axis=0)))),'gamut':float(max(0.,-Qn.min(),Qn.max()-1)),'protected':float(np.max(abs(Qn[protected]-Q[protected]),initial=0)),'residual':float(np.max(abs((Qn-P-Ln)-R))),'edgeOrientationPermutation':float(np.max(abs(Qp-Qn)))}
  cases.append({'mode':mode,'trial':trial,'errors':errors,'pass':max(errors.values())<1e-12})
result={'sourceSha256':hashlib.sha256(open('/tmp/world-offline/conservative-blend.py','rb').read()).hexdigest(),'independentCases':len(cases),'failedCases':sum(not c['pass'] for c in cases),'maximumErrors':{k:max(c['errors'][k] for c in cases) for k in cases[0]['errors']},'firstFailure':next((c for c in cases if not c['pass']),None),'cases':cases,'sceneQualified':False}
json.dump(result,open('/tmp/offline-review-transport-result.json','w'),indent=2);print(json.dumps({k:v for k,v in result.items() if k!='cases'},indent=2))
