"""Fixed archived-factor substitutions; attribution only, no source or tolerance tuning."""
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parent
source=(root/'full-p-screen.py').read_text()
variants={'triFine':['triFine'],'variation':['variation'],'triFine_variation':['triFine','variation'],'triFine_variation_macro_meso':['triFine','variation','macro','meso']}
results=[]
for name,fields in variants.items():
 code=source
 if 'triFine' in fields:
  needle=' tm=f.noise32('
  assert code.count(needle)==1
  code=code.replace(needle," tf=old[pose,'identity-brightness-factors-raw'][:,:,1].astype(F)/F(255)\n"+needle)
 if 'variation' in fields:
  needle=';rock=clamp('
  assert code.count(needle)==1
  code=code.replace(needle,";variation=old[pose,'identity-brightness-factors-raw'][:,:,0].astype(F)/F(255)"+needle)
 if 'macro' in fields:
  needle=';elev=sm('
  assert code.count(needle)==1
  code=code.replace(needle,";macro=old[pose,'identity-noise-factors-raw'][:,:,0].astype(F)/F(255);meso=old[pose,'identity-noise-factors-raw'][:,:,1].astype(F)/F(255)"+needle)
 code=code.replace(" np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',", " if False: np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',")
 code=code[:code.index("Path('/tmp/material-cpu/full-p-result.json').write_text")]
 scope={'__file__':str(root/'full-p-screen.py')};exec(compile(code,str(root/'full-p-screen.py'),'exec'),scope)
 results.append({'variant':name,'substitutedFields':fields,'groups':scope['out']['groups']})
baseline=json.load(open(root/'full-p-result.json'))
for variant in results:
 for g,b in zip(variant['groups'],baseline['groups']):
  g['deltaAnyChannelBeyondOneCodeCount']=g['incomingAnyChannelBeyondOneCodeCount']-b['incomingAnyChannelBeyondOneCodeCount']
out={'schema':'H_EARTH_NOMINAL_P_FIXED_SUBSTITUTION_ATTRIBUTION_v1','result':'ATTRIBUTION_ONLY_NOT_SOURCE_QUALIFICATION','baselineScriptSha256':hashlib.sha256(source.encode()).hexdigest(),'baseline':baseline['groups'],'variants':results,'method':'Unchanged baseline P expression with individually declared intermediate replacements from archived raw RGB8 channel centers byte/255. No fitted parameter, tolerance, mip or coordinate offset. Full expression and dependent fields recomputed.','limits':['Captured factors are quantized measurements, not exact floating-point values. Bin-center substitutions do not propagate measurement intervals.','Substitution breaks independent source replay and cannot qualify baseline P or fine-reference P(c,f0).','Metrics are descriptive nominal errors, not evidence that source or capture is wrong.','Multiple nonlinear inputs can correlate; improvements or degradation are not unique causal decomposition.','Microrelief, normals, fine triplanar fields, derivatives and texture sampler uncertainty remain.','No GPU/product mutation.']}
(root/'attribution-result.json').write_text(json.dumps(out,indent=2)+'\n')
for v in [{'variant':'baseline','groups':baseline['groups']}]+results:
 print(v['variant'],[(g['pose'],g['incomingAnyChannelBeyondOneCodeCount'],g['incomingNominalDisplayCodeErrorMedianMaxByChannel']) for g in v['groups']])
