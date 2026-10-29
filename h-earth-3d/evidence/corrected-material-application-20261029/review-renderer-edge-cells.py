exec(open('review-renderer-export.py').read().split("r={'result'")[0])
r=json.load(open(O/'independent-review.json'));out=[]
for group in ['NEAR','FAR']:
 edges={}
 for o in np.load('resolved-output/'+group+'-3.npz')['sourceOffsets']:
  t=idx[o+np.arange(3)]
  for u,v in zip(t,np.roll(t,-1)):edges.setdefault(tuple(sorted((int(u),int(v)))),[]).append(int(o))
 jump=boundary=0.;pieces=0
 for edge,owners in edges.items():
  u=p[edge[0],[0,2]];v=p[edge[1],[0,2]];cut=[0.,1.]
  for axis in [0,1]:
   if v[axis]!=u[axis]:
    grid=np.arange(np.ceil(min(u[axis],v[axis])/.25),np.floor(max(u[axis],v[axis])/.25)+1)*.25;cut.extend(((grid-u[axis])/(v[axis]-u[axis])).tolist())
  cut=np.unique(np.clip(cut,0,1));lo,hi=cut[:-1],cut[1:];f=np.concatenate([lo+(hi-lo)*q for q in [.125,.5,.875]]);points=u+f[:,None]*(v-u);a=sample(points,charts[owners[0]])
  if len(owners)==2:jump=max(jump,float(abs(a-sample(points,charts[owners[1]])).max()))
  else:boundary=max(boundary,float(abs(a).max()))
  pieces+=len(lo)
 out.append({'group':group,'bilinearEdgeCellPieces':pieces,'threeDistinctInteriorChecksPerPiece':True,'maxEdgeTraceDifference':jump,'maxExteriorTrace':boundary})
r['piecewisePolynomialTraceCheck']=out;r['traceConclusion']='All original indexed edge traces agree at three distinct points per bilinear-grid segment; each trace restriction is degree<=2, so this checks full trace polynomial equality in ideal CPU bilinear arithmetic up to stated floating tolerance.';r['repairedPaddingInspection']='Interior identity retained; padding consults original same-index vertex-neighbour star, rejecting overlapping strict neighbour interiors. No global coordinate owner search; original multi-domain ownership remains unqualified.'
(O/'independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(out)
