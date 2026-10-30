"""Execute the current unmodified prototype on an independent synthetic dataset."""
from pathlib import Path
import ast,hashlib,json,subprocess,sys,tempfile
import numpy as np
HERE=Path(__file__).parent;SOURCE=HERE/'margin_prototype.py';s=np.linspace(-12,12,481)
inverse=lambda x:(x/255)**2.2/1.12
cases={
 'constant':(s,np.full((len(s),3),100.)),
 'linear':(s,np.repeat((100+.5*s)[:,None],3,axis=1)),
 'narrow_gray':(s,np.repeat((100+20*(abs(s)<1))[:,None],3,axis=1)),
 'narrow_chroma':(s,np.repeat((100+.1*s)[:,None],3,axis=1)),
 'single_step':(s,np.repeat(np.where(s<0,80.,130.)[:,None],3,axis=1)),
 'reverse_step':(s,np.repeat(np.where(s<0,130.,80.)[:,None],3,axis=1)),
}
cases['narrow_chroma'][1][abs(s)<1]+=np.array([20,-20*.2126/.7152,0])
u=np.sort(np.unique(np.r_[np.linspace(-12,12,81),[-6,6,-.31,.17]]));cases['irregular_step']=(u,np.repeat(np.where(u<0,80.,130.)[:,None],3,axis=1))
root=Path(tempfile.mkdtemp(prefix='hearth-margin-review-'));out=root/'boundary-reconciliation';out.mkdir();inputs=root/'recovered/paired/input/mesh-cpu';inputs.mkdir(parents=True);results=root/'recovered/paired/results';results.mkdir(parents=True)
world=[];case_indices={};runs={}
for side in ['near','far']:
 pose='inland-seam-'+side;pixels=[];offsets=[];colors=[]
 for x,(name,(axis,rgb)) in enumerate(cases.items()):
  start=len(pixels)
  for y,(distance,color) in enumerate(zip(axis,rgb)):
   pixels.append([x,y]);offsets.append(x*3);colors.append(inverse(color));world.append({'pose':pose,'pixel':[x,y],'world':[float(x*100),float(distance),0.],'candidateOffsets':[x*3]})
  case_indices[name]=slice(start,len(pixels))
 n=len(pixels);pixels=np.array(pixels);offsets=np.array(offsets);q=np.array(colors);p=np.zeros_like(q)
 np.savez(results/f'native-{pose}.npz',pixels=pixels,offsets=offsets,P=p,Q=q,TI=p,TG=q,wI=np.zeros(n),wG=np.ones(n))
 np.savez(out/f'current-atlas-{side}.npz',pixels=pixels,offsets=offsets,delta=p)
(inputs/'surface-samples.json').write_text(json.dumps(world))
proc=subprocess.run([sys.executable,str(SOURCE),str(root)],capture_output=True,text=True,check=True)
report=json.loads((out/'margin-prototype.json').read_text());a=np.load(out/'margin-prototype-near.npz');tests={}
for name,index in case_indices.items():
 changed=int(a['changed'][index].sum());tests[name]={'changedMembers':changed};
 if name in ['constant','linear','narrow_gray','narrow_chroma']:assert changed==0,name
 else:assert changed>0,name
 assert np.array_equal(a['candidate'][index][~a['changed'][index]],a['baseline'][index][~a['changed'][index]])
assert all(i['coefficientEnvelopePass'] for p in report['poses'] for i in p['intervals'])
# Extract actual helper functions only, avoiding main-loop execution.
module=ast.parse(SOURCE.read_text());nodes=[n for n in module.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.FunctionDef)) or (isinstance(n,ast.Assign) and all(isinstance(t,ast.Name) and t.id in ['HALF_WIDTH','RIDGE_CODES_PER_M','MAX_SOURCE_GAP'] for t in n.targets))];ns={};exec(compile(ast.Module(body=nodes,type_ignores=[]),'actual-functions-only','exec'),ns)
w=ns['shoulder_weight'];assert w(0)==0 and w(1)==0
h=np.array([1e-2,1e-3,1e-4,1e-5]);slopes=np.array([w(x)/x for x in h]);assert np.all(np.diff(slopes)<0) and slopes[-1]<1e-6
assert np.max(abs(w(h)-w(1-h)))<1e-15
result={'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'actualPrototypeExecuted':True,'syntheticRoot':str(root),'tests':tests,'chromaticRegression':'Original luminance-only counterexample now unchanged and rejected by RGB-direction opposing-transition guard','actualShoulderSlopeTowardBoundary':slopes.tolist(),'coefficientEnvelopeAllPass':True,'existingPrototypeTests':ns['tests'](),'scope':'Independent synthetic archived-transect prototype review only; no world or GPU qualification.'}
(HERE/'independent-margin-review-v2.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
