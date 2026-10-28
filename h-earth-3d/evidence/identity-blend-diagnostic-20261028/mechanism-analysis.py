#!/usr/bin/env python3
"""Secondary mechanism analysis of already-qualified capture; one fixed counterfactual."""
import argparse, importlib.util, json, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
spec=importlib.util.spec_from_file_location('identity_analysis',Path(__file__).with_name('analyze-capture.py'))
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)

def describe(v):
    return np.asarray(v).mean(axis=0).tolist()
def bounds(i):return {'lo':describe(i.lo),'hi':describe(i.hi)}
def signal(f):return .47*f['macro']+.38*f['meso']+.15*f['detail']
def source_result(p,f,low,high):
    f=dict(f,fertile=a.smoothstep(low,high,signal(f)));m=a.source_model(f)
    return (1-a.rgb(m['W']))*p+a.rgb(m['W'])*m['T'],f,m

def main(capture,analysis,output):
    verified=json.loads(analysis.read_text())
    assert verified['result']=='CAPTURE_AND_NUMERIC_GATES_PASSED_ATTRIBUTION_RECORDED'
    assert verified['archiveBoundaryParity']=='EXACT_RGBA_MATCH'
    assert verified['receiptSha256']==hashlib.sha256((capture/'receipt.json').read_bytes()).hexdigest()
    receipt=json.loads((capture/'receipt.json').read_text());imgs={}
    for v in receipt['views']:
        b=(capture/v['image']).read_bytes();assert hashlib.sha256(b).hexdigest()==v['imageSha256']
        imgs[v['pose']['name'],v['mode']]=np.array(Image.open(capture/v['image']).convert('RGBA'))
    witnesses=[]
    for x,y in [(132,260),(264,268),(396,273)]:
        xx=np.arange(x-4,x+5);v0=a.values_at(imgs,'inland-seam-near',xx,np.full(9,y));v1=a.values_at(imgs,'inland-seam-near',xx,np.full(9,y+1))
        assert np.all(v0['eligible']&v1['eligible']&~v0['censored']&~v1['censored'])
        f0,f1=v0['f'],v1['f'];fi0,fi1=v0['fi'],v1['fi'];s0,s1=signal(f0),signal(f1);si0,si1=signal(fi0),signal(fi1)
        fields={k:{'beforeMean':describe(f0[k]),'afterMean':describe(f1[k]),'deltaMean':describe(f1[k]-f0[k]),'deltaMeanInterval':bounds(fi1[k]-fi0[k])} for k in ['macro','meso','detail','fertile','moist','dry','W','variation','tri','near','inland','grove','mineral']}
        old0,rf0,_=source_result(v0['P'],f0,.42,.68);old1,rf1,_=source_result(v1['P'],f1,.42,.68)
        new0,nf0,_=source_result(v0['P'],f0,.29,.81);new1,nf1,_=source_result(v1['P'],f1,.29,.81)
        newi0,_,_=source_result(v0['Pi'],fi0,.29,.81);newi1,_,_=source_result(v1['Pi'],fi1,.29,.81)
        terms,delta=a.decompose(v0['P'],v1['P'],rf0,rf1)
        assert np.max(abs(sum(terms.values())-delta))<1e-12
        ds=s1-s0;df=rf1['fertile']-rf0['fertile'];gain=df/ds
        # All chosen witnesses have nonzero negative deltaS and deltaF; no division
        # through zero or arbitrary zero-gradient assignment is used here.
        assert np.all(ds<0)&np.all(df<0)
        q=terms['fertile']/df[:,None]
        noise_color={name:describe(q*(gain*w*(f1[name]-f0[name]))[:,None]) for name,w in [('macro',.47),('meso',.38),('detail',.15)]}
        noise_color_sum=sum(q*(gain*w*(f1[name]-f0[name]))[:,None] for name,w in [('macro',.47),('meso',.38),('detail',.15)])
        assert np.max(abs(noise_color_sum-terms['fertile']))<1e-12
        q0=a.footprint_interval(v0['footprint'][:,0]);q1=a.footprint_interval(v1['footprint'][:,0])
        original_group=next(g for g in verified['groups'] if g['label']==f'known-witness-x{x}')
        witnesses.append({'xCenter':x,'rows':[y,y+1],'pixels':9,'measuredFields':fields,'weightedSignal':{'beforeMean':describe(s0),'afterMean':describe(s1),'deltaMean':describe(ds),'deltaMeanInterval':bounds(si1-si0)},'weightedNoiseDelta':{name:{'point':describe(w*(f1[name]-f0[name])),'interval':bounds(w*(fi1[name]-fi0[name]))} for name,w in [('macro',.47),('meso',.38),('detail',.15)]},'sourceSmoothstepSecantGain':{'min':float(gain.min()),'mean':float(gain.mean()),'max':float(gain.max())},'noiseViaFertileColorPointDecomposition':noise_color,'noiseDecompositionLimit':'Secondary point decomposition through the exact reconstructed source; no independent unique-dominance confidence claim. Signed changes can cancel. Captured raw factor intervals and original root intervals are retained separately.','measuredObservedDeltaRGB':original_group['observedDelta'],'qualifiedFertileRootContribution':original_group['sourceRootTerms']['fertile'],'worldFootprintUnitsPerPixel':{'minimumLower':float(min(q0.lo.min(),q1.lo.min())),'maximumUpper':float(max(q0.hi.max(),q1.hi.max()))},'singleDoubleWidthCounterfactual':{'oldModelDeltaMeanRGB':describe(old1-old0),'newModelDeltaMeanRGB':describe(new1-new0),'newModelDeltaMeanRGBInterval':bounds(newi1-newi0),'newFertileBeforeMean':describe(nf0['fertile']),'newFertileAfterMean':describe(nf1['fertile']),'newFertileDeltaMean':describe(nf1['fertile']-nf0['fertile']),'newMinusOldEndpointMeanRGB':{'before':describe(new0-old0),'after':describe(new1-old1)},'claim':'Predicted unlit identity-stage response to one fixed formula change, not rendered candidate evidence or downstream groundcover/lighting/protected-view validation.'}})
    result={'schema':'H_EARTH_IDENTITY_BLEND_MECHANISM_EVIDENCE_v1','result':'SOURCE_EXPRESSION_AMPLIFICATION_IDENTIFIED_BOUNDED_REPAIR_HYPOTHESIS','operationId':'H_EARTH_IDENTITY_BLEND_DIAGNOSTIC_20261028_001','sourceHead':a.SCENE,'rendererSha256':a.RENDERER,'contractSha256':a.CONTRACT,'qualifiedAnalysisSha256':hashlib.sha256(analysis.read_bytes()).hexdigest(),'captureReceiptSha256':verified['receiptSha256'],'analysisStatus':'SECONDARY_SOURCE_DRIVEN_READ_ONLY_ANALYSIS_NO_NEW_CAPTURE_NO_GATE_CHANGE','mechanism':{'responsibleExpression':'fertilePatch=smoothstep(0.42,0.68,macroField*0.47+mesoField*0.38+detailField*0.15)','location':'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js:948','effect':'A narrow0.26-wide transition turns adjacent-pixel weighted noise changes into much larger fertility changes. Shared fertile pathways then alter direct fertile palette, moist shelter, dry foothill and identity blend weight together.','upstreamSamples':{'macroField':'noise2(world*0.018+vec2(5,-11))','mesoField':'noise2(world*0.082+vec2(-13,7))','detailField':'noise2(world*0.29+vec2(29,-17))'},'maxDerivativeOld':1.5/(.68-.42),'conclusionLimit':'Established amplification at three declared near-view witnesses; not sole cause of every band, no aliasing proof and no map-wide visual closure. Original MIXED_OR_INCONCLUSIVE output remains unchanged because opposing terms/cancellation exist.'},'recommendedSingleCorrection':{'expression':'fertilePatch=smoothstep(0.29,0.81,macroField*0.47+mesoField*0.38+detailField*0.15)','fixedMidpoint':.55,'oldWidth':.26,'newWidth':.52,'maxDerivativeNew':1.5/.52,'maximumDerivativeRatio':.5,'choiceBasis':'Smallest one-expression source-directed candidate with a predeclared factor-of-two reduction of maximum transition gain and unchanged midpoint/noise fields/palette families; no parameter sweep. The factor2 is an explicit engineering choice, not a measured perceptual success threshold.','alternativesNotAsserted':'Do not adopt footprint filtering from a proxy alone; it adds derivative/filter semantics without current proof of aliasing.','requiredQualification':['Source inverse reconstruction confirms only endpoints changed','Near and far lit plus albedo images compared with frozen approved baseline','Protected meadow and coast controls with exact-source scene and assets','Visual review before owner KEEP/ONE_REPAIR/REJECT'],'authority':'Recommendation only. Diagnostic admission does not authorize shader correction or extra capture.','risk':'Reducing gain does not guarantee eliminating visible bands and may alter ecological palette distribution. Protected character and perceptual quality require actual candidate validation.'},'witnesses':witnesses}
    output.write_text(json.dumps(result,indent=2,allow_nan=False)+'\n')
    print(json.dumps({'result':result['result'],'output':str(output),'witnesses':len(witnesses)}))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--capture-dir',required=True,type=Path);p.add_argument('--analysis',required=True,type=Path);p.add_argument('--output',required=True,type=Path);v=p.parse_args();main(v.capture_dir,v.analysis,v.output)
