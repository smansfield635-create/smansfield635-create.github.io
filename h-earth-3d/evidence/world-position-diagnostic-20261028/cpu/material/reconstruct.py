"""CPU material reconstruction conditioned on archived factors and calibrated XYZ.
Not an autonomous shader emulator or a counterfactual fine-reference evaluator.
"""
from pathlib import Path
import argparse,json,hashlib,importlib.util,numpy as np
from PIL import Image
sp=importlib.util.spec_from_file_location('m',Path(__file__).with_name('identity-model.py'));m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
SCENE='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';SOURCE='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def capture(root):
 r=json.loads((root/'receipt.json').read_text());out={}
 for v in r['views']:
  p=root/v['image'];assert sha(p)==v['imageSha256'];out[v['pose']['name'],v['mode']]=np.array(Image.open(p).convert('RGBA'))
 return r,out

def tone(f,y):
 elevation=m.smoothstep(-1,34,y);wet=m.clamp((1-elevation)*.12+f['macro']*.06,0,.18)
 moist=m.clamp(.20+.55*f['moist']+.25*wet)
 dry=m.clamp((1-moist)*(.18+.28*f['meso'])+.20*f['slopeResponse'],0,.65)
 A=np.array([.110,.118,.075]);B=np.array([.075,.090,.055]);D=np.array([.175,.150,.095])
 t=A+(B-A)*m.rgb(moist)
 t=t+(D-t)*m.rgb(dry)
 return t*m.rgb(.88+.24*f['variation'])
def errors(pred,obs):
 d=pred-obs;return {'linearRGBMaxAbs':np.max(abs(d),axis=0).tolist(),'linearRGBMeanAbs':np.mean(abs(d),axis=0).tolist(),'displayCodeMaxAbs':np.max(abs(np.maximum(pred*1.12,0)**(1/2.2)*255-np.maximum(obs*1.12,0)**(1/2.2)*255),axis=0).tolist()}

def run(args):
 assert sha(args.renderer)==SOURCE
 r,ims=capture(args.identity);w,world=capture(args.world);g,grounds=capture(args.ledger)
 assert r['sourceProductSha256']==SOURCE and w['sourceProductSha256']==SOURCE
 # Verify reuse is source-equivalent for every byte except documented resident patch block.
 resident=args.resident.read_text();approved=args.renderer.read_text()
 after='      float groundcoverSuitability='
 beforeA='      // Rotate and softly warp one material sample with resident fields.'
 beforeB='      // H_EARTH_GROUNDCOVER_RESIDENT_FIELD_BEGIN'
 assert approved[:approved.index(beforeA)]==resident[:resident.index(beforeB)]
 assert approved[approved.index(after):]==resident[resident.index(after):]
 target=lambda s:s[s.index('      float groundcoverMoisture='):s.index('      // H_EARTH_BROAD_GROUNDCOVER_V1_END')]
 assert target(resident)==target(approved)
 assert sha(args.resident)==g['sourceProductSha256']
 groups=[]
 for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
  yy=np.repeat(np.arange(y0,y1+1),27);xx=np.tile(np.r_[128:137,260:269,392:401],y1-y0+1)
  vv=[v for v in r['views'] if v['pose']['name']==pose];ww=[v for v in w['views'] if v['pose']['name']==pose];gg=[v for v in g['views'] if v['pose']['name']==pose]
  for v in vv+ww+gg:
   assert v['pose']==vv[0]['pose'] and v['canvas']==vv[0]['canvas'] and v['lastFrame']['cameraPosition']==vv[0]['lastFrame']['cameraPosition']
   assert v['assetSignature']==vv[0]['assetSignature']
  assert np.array_equal(ims[pose,'identity-result-color'],grounds[pose,'before-groundcover-unlit'])
  v=m.values_at(ims,pose,xx,yy);assert np.all(v['eligible']&~v['censored'])
  xyz=[]
  for name in ['world-x','world-y','world-z']:
   a=world[pose,name][yy,xx].astype(int);code=a[:,0]*65536+a[:,1]*256+a[:,2];assert np.all((code>0)&(code<16777215));xyz.append((-128 if name=='world-y' else -32768)+(code-1)*(1/4096 if name=='world-y' else 1/16))
  y=xyz[1];yi=m.Interval(y-.625/4096,y+.625/4096)
  fi=dict(v['fi']);fi['heightDry']=m.smoothstep(8,30,yi)
  f=dict(v['f']);f['heightDry']=m.smoothstep(8,30,y)
  model=m.source_model(f);modeli=m.source_model(fi)
  ci=(1-m.rgb(modeli['W']))*v['Pi']+m.rgb(modeli['W'])*modeli['T'];c=(1-m.rgb(model['W']))*v['P']+m.rgb(model['W'])*model['T']
  gt=tone(f,y);gti=tone(fi,yi);cap=grounds[pose,'groundcover-tone-color'][yy,xx,:3];obs=m.decode_color(cap);obsi=m.color_interval(cap)
  groups.append({'pose':pose,'samples':len(xx),'sourceReconstructionIntervalFailures':m.reconstruction_checks(v),'preciseHeightDryIntervalFailures':int(np.count_nonzero(m.consistency(fi['heightDry'],v['fi']['heightDry']))),'preciseIdentityTargetIntervalFailures':int(np.count_nonzero(m.consistency(modeli['T'],v['Ti']))),'preciseIdentityResultIntervalFailures':int(np.count_nonzero(m.consistency(ci,v['Ci']))),'preciseGroundcoverToneIntervalFailures':int(np.count_nonzero(m.consistency(gti,obsi))),'identityTargetNominalErrors':errors(model['T'],v['T']),'identityResultNominalErrors':errors(c,v['C']),'groundcoverToneNominalErrors':errors(gt,obs),'groundcoverToneIntervalMaximumWidth':np.max(gti.hi-gti.lo,axis=0).tolist()})
 report={'schema':'H_EARTH_CPU_CAPTURE_CONDITIONED_MATERIAL_RECONSTRUCTION_v1','result':'CAPTURE_CONDITIONED_RECONSTRUCTION_PASS' if all(not any(g[k].values()) if isinstance(g[k],dict) else g[k]==0 for g in groups for k in ['sourceReconstructionIntervalFailures','preciseHeightDryIntervalFailures','preciseIdentityTargetIntervalFailures','preciseIdentityResultIntervalFailures','preciseGroundcoverToneIntervalFailures']) else 'RECONSTRUCTION_FAILURE','sceneHead':SCENE,'rendererSha256':SOURCE,'groups':groups,'inputHashes':{str(p):sha(p) for p in [args.renderer,args.resident,args.identity/'receipt.json',args.world/'receipt.json',args.ledger/'receipt.json',Path(__file__).with_name('identity-model.py')]},'sourceTargetBlockExactMatch':True,'ledgerIncomingEqualsBaselineIdentityResultFullFrame':True,'fullCounterfactualEvaluatorComplete':False,'missingForFullPAndFineReference':['Approved soil texture bytes, source texture upload/mipmap/filter/repeat and derivative-driven LOD policy','Microrelief-derived shading normal and therefore triplanar weights; geometry normal alone is insufficient','Source triCoarse, triMicro, broad/medium/grain and per-fragment derivative state not exposed by the 20 archived identity factors','Fully enumerated fine-source substitution contract, including P and camera-dependent nearMaterial and relief envelopes','Actual source mesh topology, interpolation and post-overlay branches'], 'limits':['All interval agreement uses the inherited +/-1RGB8-code convention and .625-bin precise shader-scalar intervals. These are conditional arithmetic bounds, not new empirical GPU error certification.','This calculator consumes archived intermediate factors; it does not reconstruct those factors independently from mesh/texture source.','Resident groundcover weight/final image is not baseline weight/final evidence. Only exact common target block plus matched input-factor capture is reused.','Nominal errors reflect quantized inputs and outputs; zero nominal error is not required for conditional interval consistency.','No fine-neutral reference, transported correction, render comparison or visual acceptance established.','No new GPU run or product mutation.']}
 args.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--identity',type=Path,default=Path('/tmp/old-diagnostic'));ap.add_argument('--world',type=Path,default=Path('/tmp/diagnostic'));ap.add_argument('--ledger',type=Path,default=Path('/tmp/hearth-ledger/capture'));ap.add_argument('--renderer',type=Path,default=Path('/tmp/hearth-identity-diagnostic/cb57c275b95d0d48883bc4da4dcfcf17cbec5060.renderer.js'));ap.add_argument('--resident',type=Path,default=Path('/workspace/scratch/9baa27da97f1/resident-renderer.js'));ap.add_argument('--output',type=Path,default=Path('/tmp/material-cpu/result.json'));run(ap.parse_args())
