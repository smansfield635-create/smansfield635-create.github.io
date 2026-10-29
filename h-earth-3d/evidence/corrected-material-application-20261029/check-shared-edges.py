import runpy,sys,numpy as np,json
checker,mesh,capture,prior_output,contact_path,result_path=sys.argv[1:]
sys.argv=['check',mesh,capture,prior_output];g=runpy.run_path(checker);P=g['P'].astype(float);N=g['N'].astype(float);C=g['C'].astype(float);K=np.fromfile(contact_path,np.float32).astype(float);nearEdges=g['e'];farEdges=g['edges'](g['far']);links=[]
for na,nb in nearEdges:
 A=P[na];D=P[nb]-A;L=np.linalg.norm(D);U=D/L
 for fa,fb in farEdges:
  F=P[fa];G=P[fb];s=np.dot(F-A,U);t=np.dot(G-A,U);low=max(0,min(s,t));high=min(L,max(s,t))
  if high-low<=1e-6 or abs(t-s)<1e-9:continue
  r=max(np.linalg.norm(F-A-s*U),np.linalg.norm(G-A-t*U));tol=max(1e-6,2*max(np.max(abs(A)),np.max(abs(P[nb])),np.max(abs(F)),np.max(abs(G)))*2**-23)
  if r>tol:continue
  errors=[]
  for distance in [low,(low+high)/2,high]:
   n=distance/L;f=(distance-s)/(t-s);normal=(1-n)*N[na]+n*N[nb]+(1-f)*N[fa]+f*N[fb];coast=(1-n)*C[na]+n*C[nb]-((1-f)*C[fa]+f*C[fb]);contact=(1-n)*K[na]+n*K[nb]-((1-f)*K[fa]+f*K[fb]);errors.append([max(abs(normal)),abs(coast),abs(contact)])
  links.append({'near':[int(na),int(nb)],'far':[int(fa),int(fb)],'length':high-low,'maxErrors':np.max(errors,axis=0).tolist(),'nearContactRange':[float(K[na]),float(K[nb])]})
r={'schema':'H_EARTH_SHARED_EDGE_INPUTS_v1','links':len(links),'totalLinkedMeters':sum(x['length'] for x in links),'maxErrorsNormalCoastContact':np.max([x['maxErrors'] for x in links],axis=0).tolist(),'comparison':'overlap endpoints and midpoint; attributes are linear along each paired segment, so endpoint difference bounds apply to whole segment','worstWitnesses':[max(links,key=lambda x:x['maxErrors'][k]) for k in range(3)]};json.dump(r,open(result_path,'w'),indent=2);print({k:v for k,v in r.items() if k!='records'})
