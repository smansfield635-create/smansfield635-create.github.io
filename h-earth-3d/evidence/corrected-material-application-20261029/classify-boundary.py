import runpy,sys,json,numpy as np
checker,mesh,capture,check_output,classification_output=sys.argv[1:]
sys.argv=['check',mesh,capture,check_output]
g=runpy.run_path(checker);P=g['P'];e=g['e'];a=g['a'];d=g['d'];l=g['l'];edges=g['edges'];far=g['far'];near=g['near']
matched={r['vertex'] for r in g['rows']};unmatched=[]
for v in np.unique(edges(far)):
 if int(v) in matched:continue
 q=P[v].astype(float);t=np.clip(((q-a)*d).sum(1)/l,0,1);dist=np.linalg.norm(q-a-t[:,None]*d,axis=1);k=dist.argmin()
 unmatched.append({'vertex':int(v),'position':q.tolist(),'distanceToNearBoundary':float(dist[k]),'nearestEdge':e[k].tolist()})
print('UNMATCHED',json.dumps(unmatched[:10]));U=np.array([x['position'] for x in unmatched]);print('bounds',U.min(0),U.max(0));print('distances',min(x['distanceToNearBoundary'] for x in unmatched),max(x['distanceToNearBoundary'] for x in unmatched));print('near bounds',P[near['vertexStart']:near['vertexStart']+near['vertexCount']].min(0),P[near['vertexStart']:near['vertexStart']+near['vertexCount']].max(0))
from collections import defaultdict
adj=defaultdict(set)
for x,y in edges(far):adj[int(x)].add(int(y));adj[int(y)].add(int(x))
components=[];seen=set()
for v in adj:
 if v in seen:continue
 todo=[v];c=[]
 while todo:
  w=todo.pop()
  if w in seen:continue
  seen.add(w);c.append(w);todo.extend(adj[w]-seen)
 components.append({'vertices':len(c),'matched':len(set(c)&matched),'unmatched':len(set(c)-matched),'bounds':[P[c].min(0).tolist(),P[c].max(0).tolist()],'degreeCounts':{str(k):sum(len(adj[x])==k for x in c) for k in set(map(lambda x:len(adj[x]),c))}})
print('components',json.dumps(components));json.dump({'unmatched':unmatched,'components':components},open(classification_output,'w'),indent=2)

result=json.load(open(classification_output));small=[]
for component in components:
 if component['vertices']!=3:continue
 ids=[x['vertex'] for x in unmatched if all(component['bounds'][0][k]<=x['position'][k]<=component['bounds'][1][k] for k in range(3))]
 assert len(ids)==3
 q=P[ids][:,[0,2]].astype(float);v=q[1]-q[0];w=q[2]-q[0];area=abs(v[0]*w[1]-v[1]*w[0])/2;length=max(np.linalg.norm(q[x]-q[y]) for x,y in [(0,1),(1,2),(2,0)])
 small.append({'vertices':ids,'projectedAreaSquareMeters':area,'longestEdgeMeters':length,'altitudeToLongestEdgeMeters':2*area/length})
excluded={v for s in small for v in s['vertices']};outer=[x for x in unmatched if x['vertex'] not in excluded]
nearP=P[near['vertexStart']:near['vertexStart']+near['vertexCount']];lo=nearP.min(0);hi=nearP.max(0)
assert all(x['position'][0]<lo[0] or x['position'][0]>hi[0] or x['position'][2]<lo[2] or x['position'][2]>hi[2] for x in outer)
result['sliverLoops']=small;result['classification']={'matchedNearJoin':len(matched),'outsideNearFootprint':len(outer),'isolatedLoopVertices':len(excluded),'outerMinimumDistanceToNearBoundaryMeters':min(x['distanceToNearBoundary'] for x in outer)}
json.dump(result,open(classification_output,'w'),indent=2)
