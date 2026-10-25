import json,pathlib,os,numpy as np
from scipy.optimize import milp,Bounds,LinearConstraint
from scipy.sparse import lil_matrix,vstack,csr_matrix
root=pathlib.Path(__file__).parent
base=pathlib.Path(os.environ['GRASS_BASE_ASSET_DIR'])/'precomputed-grass.v1.json'
m=json.loads(base.read_text());old={(t['minX'],t['minZ']):t for t in m['tiles']}
centers=[(388,-200),(-392,-200),(-392,-192),(388,-196),(-392,-196),(404,-232),(388,-192),(388,-188)]
# Existing occupied tiles only; no new geographic footprint or render tiles.
points=sorted(p for p,t in old.items() if any(max(abs(p[0]-x),abs(p[1]-z))<=16 for x,z in centers))
ids={p:i for i,p in enumerate(points)};edges=set()
for p in points:
 for dx,dz in [(4,0),(-4,0),(0,4),(0,-4)]:edges.add(tuple(sorted([p,(p[0]+dx,p[1]+dz)])))
edges=sorted(edges);n=len(points);E=len(edges);rows=2*E+2*n
A=lil_matrix((rows,n+E+n));b=np.zeros(rows);row=0
for j,(p,q) in enumerate(edges):
 for sign in [1,-1]:
  fixed=0
  for v,s in [(p,sign),(q,-sign)]:
   if v in ids:A[row,ids[v]]=s
   else:fixed+=s*old.get(v,{}).get('count',0)
  A[row,n+j]=-1;b[row]=-fixed;row+=1
for i,p in enumerate(points):
 for sign in [1,-1]:A[row,i]=sign;A[row,n+E+i]=-1;b[row]=sign*old[p]['count'];row+=1
objective=np.r_[np.zeros(n),np.ones(E),np.full(n,.08)]
constraints=np.zeros((1,n+E+n));constraints[0,:n]=1
bounds=[(max(1,old[p]['baselineCount']),min(816,max(old.get((p[0]+dx,p[1]+dz),{}).get('count',0) for dx,dz in [(0,0),(4,0),(-4,0),(0,4),(0,-4)]))) for p in points]+[(0,None)]*(E+n)
witnesses={(w['x'],w['z']):w for w in json.loads((root/'combined-census.json').read_text())['domainWitnesses']}
for i,p in enumerate(points):
 w=witnesses[p]
 if w['eligible']!=16 or w['minimumContour']<.999 or w['expectedDensity']<=1:bounds[i]=(old[p]['count'],old[p]['count'])
for j,(p,q) in enumerate(edges):
 if any(set((p,q))=={c,(c[0]+(4 if c[0]>0 else -4),c[1])} for c in centers):
  bounds[n+j]=(0,abs(old.get(p,{}).get('count',0)-old.get(q,{}).get('count',0))*.4)
lower=np.array([v[0] for v in bounds],float);upper=np.array([np.inf if v[1] is None else v[1] for v in bounds],float)
constraints_all=vstack([A.tocsr(),csr_matrix(constraints)]).tocsc()
mass=sum(old[p]['count'] for p in points)
result=milp(objective,integrality=np.r_[np.ones(n),np.zeros(E+n)],bounds=Bounds(lower,upper),constraints=LinearConstraint(constraints_all,np.r_[np.full(rows,-np.inf),mass],np.r_[b,mass]),options={'time_limit':30,'mip_rel_gap':0})
assert result.success,result.message
values=np.rint(result.x[:n]).astype(int);new={p:int(values[i]) for i,p in enumerate(points)}
assert sum(new.values())==mass
for p in points:assert bounds[ids[p]][0]<=new[p]<=bounds[ids[p]][1]
for c in centers:
 q=(c[0]+(4 if c[0]>0 else -4),c[1]);assert abs(new[c]-new[q])<=abs(old[c]['count']-old[q]['count'])*.4
def metrics(counts):
 diffs=[abs(counts.get(p,old.get(p,{}).get('count',0))-counts.get(q,old.get(q,{}).get('count',0))) for p,q in edges]
 return {'totalVariation':sum(diffs),'maximumJump':max(diffs),'squaredVariation':sum(d*d for d in diffs)}
before=metrics({});after=metrics(new);assert all(after[k]<=before[k] for k in before),(before,after)
plan={'schema':'H_EARTH_BOUNDED_DENSITY_PLAN_v1','inputRawSha256':m['rawSha256'],'method':'Minimize cardinal total variation plus0.08 absolute change penalty, fixed total, existing tiles, immutable prefixes, neighbor maximum upper bounds; selected8 seam differences at most40% of baseline; mixed-integer solution, no rounding relaxation','tiles':[{'x':p[0],'z':p[1],'before':old[p]['count'],'after':new[p],'baselineCount':old[p]['baselineCount']} for p in points if old[p]['count']!=new[p]],'metrics':{'before':before,'after':after},'edgeCount':E,'domainTiles':n,'moved':sum(max(0,old[p]['count']-new[p]) for p in points)}
(root/'density-plan.json').write_text(json.dumps(plan,indent=2)+'\n');print(json.dumps({k:v for k,v in plan.items() if k!='tiles'},indent=2))
