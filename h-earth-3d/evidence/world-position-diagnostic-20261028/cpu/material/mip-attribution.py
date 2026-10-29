"""Fixed mip-generation models, diagnostic attribution only; never a fitted repair."""
from pathlib import Path
import hashlib,json,numpy as np
root=Path(__file__).resolve().parent
source=(root/'full-p-screen.py').read_text()
start=source.index('def mipmaps():');end=source.index('MIPS=mipmaps()',start)
models={
 'recursive_round_half_up': 'a=np.floor(mean+.5)',
 'recursive_round_half_even': 'a=np.rint(mean)',
 'recursive_unquantized': 'a=mean',
 'direct_box_round_half_even': 'a=np.rint(original.reshape(h,256//h,w,256//w,4).mean((1,3)))',
}
results=[]
for name,rounding in models.items():
 fn='''def mipmaps():
 a=np.asarray(Image.open('/tmp/material-cpu/soil.png').convert('RGBA')).astype(float);original=a.copy();out=[a[:,:,:3].astype(F)/255]
 while a.shape[0]>1:
  h,w=a.shape[0]//2,a.shape[1]//2;mean=a.reshape(h,2,w,2,4).mean((1,3));ROUND;out.append(a[:,:,:3].astype(F)/255)
 return out
'''.replace('ROUND',rounding)
 code=source[:start]+fn+source[end:]
 code=code.replace(" np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',", " if False: np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',")
 code=code[:code.index("Path('/tmp/material-cpu/full-p-result.json').write_text")]
 needle=" factors={}"
 code=code.replace(needle," groups_signed=locals().get('groups_signed',[]);groups_signed.append({'pose':pose,'signedMedian':np.median(code-obs,axis=0).tolist(),'signedMin':(code-obs).min(0).tolist(),'signedMax':(code-obs).max(0).tolist()})\n"+needle)
 scope={'__file__':str(root/'full-p-screen.py')};exec(compile(code,str(root/'full-p-screen.py'),'exec'),scope)
 result={'model':name,'groups':scope['out']['groups'],'signedErrors':scope['groups_signed'],'lastMipCode':(scope['MIPS'][-1][0,0]*255).tolist()};results.append(result)
 print(name,[(g['pose'],g['incomingAnyChannelBeyondOneCodeCount']) for g in result['groups']],result['lastMipCode'],flush=True)
out={'schema':'H_EARTH_FIXED_MIP_MODEL_ATTRIBUTION_v1','result':'ATTRIBUTION_ONLY_NOT_GPU_QUALIFICATION','baselineScriptSha256':hashlib.sha256(source.encode()).hexdigest(),'models':results,'method':'Four predetermined standard box-average/rounding arithmetic models; same shader, coordinates, normals, LOD and one-code descriptive screen. No fitted bias, tolerance or shader parameter.','limits':['Original source invokes generateMipmap; captured mip bytes are unavailable. These alternatives do not establish the hardware generation algorithm.','Unquantized levels are a diagnostic reference, not RGBA8 hardware storage.','Agreement would qualify neither GPU equivalence nor the fine-reference split.','No new GPU run or product mutation.']}
(root/'mip-attribution-result.json').write_text(json.dumps(out,indent=2)+'\n')
