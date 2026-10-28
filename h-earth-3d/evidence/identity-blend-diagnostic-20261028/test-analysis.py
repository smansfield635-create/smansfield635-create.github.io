#!/usr/bin/env python3
import importlib.util
import sys
import tempfile
import json
import hashlib
from PIL import Image
import unittest
from pathlib import Path
import numpy as np
spec=importlib.util.spec_from_file_location('identity_analysis',Path(__file__).with_name('analyze-capture.py'))
a=importlib.util.module_from_spec(spec);sys.modules[spec.name]=a;spec.loader.exec_module(a)

class AnalysisTests(unittest.TestCase):
    def fields(self,rng,n):
        return {k:rng.uniform(0,1,n) for group in a.FIELDS for k in group}
    def test_recursive_attribution_closes_random_source_and_clamp_crossings(self):
        rng=np.random.default_rng(2962);f0=self.fields(rng,1000);f1=self.fields(rng,1000)
        p0=rng.uniform(.1,.7,(1000,3));p1=rng.uniform(.1,.7,(1000,3))
        terms,delta,paths=a.decompose(p0,p1,f0,f1,details=True)
        np.testing.assert_allclose(sum(paths.values()),delta,atol=3e-16,rtol=1e-13)
        np.testing.assert_allclose(sum(terms.values()),delta,atol=3e-16,rtol=1e-13)
        self.assertGreater(np.count_nonzero(a.source_model(f0)['moistInput']>1),0)
    def test_triple_product_requires_actual_meanU(self):
        I0,I1=.2,.8;G0,G1=.1,.7;K0,K1=.49,.65
        U0=I0*(1-G0);U1=I1*(1-G1)
        exact=(K0+K1)/2*((1-(G0+G1)/2)*(I1-I0)-(I0+I1)/2*(G1-G0))+(U0+U1)/2*(K1-K0)
        naive=(K0+K1)/2*((1-(G0+G1)/2)*(I1-I0)-(I0+I1)/2*(G1-G0))+(I0+I1)/2*(1-(G0+G1)/2)*(K1-K0)
        self.assertAlmostEqual(exact,I1*(1-G1)*K1-I0*(1-G0)*K0)
        self.assertGreater(abs(naive-exact),.01)
    def test_intervals_enclose_true_source_terms_after_quantization(self):
        rng=np.random.default_rng(22);f0=self.fields(rng,128);f1=self.fields(rng,128)
        p0=rng.uniform(.05,.7,(128,3));p1=rng.uniform(.05,.7,(128,3))
        q=lambda f:{k:a.raw_interval(np.rint(v*255)) for k,v in f.items()}
        pi=lambda p:a.color_interval(np.rint(np.clip(p*1.12,0,1)**(1/2.2)*255))
        terms,delta=a.decompose(p0,p1,f0,f1);bounds,di=a.decompose(pi(p0),pi(p1),q(f0),q(f1))
        for k,v in terms.items():
            self.assertTrue(np.all(v>=bounds[k].lo-1e-14),k)
            self.assertTrue(np.all(v<=bounds[k].hi+1e-14),k)
        self.assertTrue(np.all(delta>=di.lo-1e-14));self.assertTrue(np.all(delta<=di.hi+1e-14))
    def test_raw_endpoints_and_unbounded_footprint(self):
        i=a.raw_interval(np.array([0,255]));np.testing.assert_allclose(i.lo,[0,254/255]);np.testing.assert_allclose(i.hi,[1/255,1])
        q=a.footprint_interval(np.array([0,128,255]));self.assertTrue(np.isinf(q.hi[-1]));self.assertEqual(q.lo[0],0)
    def test_abs_zero_crossing(self):
        v=a.Interval(np.array([-.2,.1,-.4]),np.array([.3,.4,-.2])).absolute()
        np.testing.assert_allclose(v.lo,[0,.1,.2]);np.testing.assert_allclose(v.hi,[.3,.4,.4])
    def test_outer_terms_exact_before_scalarization(self):
        rng=np.random.default_rng(2);p0,p1,t0,t1=rng.random((4,32,3));w0,w1=rng.random((2,32))
        terms=a.outer(p0,p1,t0,t1,w0,w1)
        expected=(1-w1[:,None])*p1+w1[:,None]*t1-(1-w0[:,None])*p0-w0[:,None]*t0
        np.testing.assert_allclose(sum(terms.values()),expected,atol=3e-16)
    def test_source_reconstruction_matches_encoded_factor_intervals(self):
        rng=np.random.default_rng(5);f=self.fields(rng,100)
        f['fertile']=a.smoothstep(.42,.68,.47*f['macro']+.38*f['meso']+.15*f['detail'])
        model=a.source_model(f);f.update({k:model[k] for k in ['moist','dry','W']})
        p=rng.uniform(.15,.5,(100,3));c=(1-model['W'][:,None])*p+model['W'][:,None]*model['T']
        encode=lambda p:np.rint(np.clip(p*1.12,0,1)**(1/2.2)*255)
        v={'fi':{k:a.raw_interval(np.rint(x*255)) for k,x in f.items()},'Pi':a.color_interval(encode(p)),'Ti':a.color_interval(encode(model['T'])),'Ci':a.color_interval(encode(c)),'eligible':np.ones(100,dtype=bool),'censored':np.zeros(100,dtype=bool)}
        self.assertTrue(all(n==0 for n in a.reconstruction_checks(v).values()))
        v['Ti']=a.Interval(np.ones((100,3))*9)
        self.assertEqual(a.reconstruction_checks(v)['target_from_factors'],100)
    def test_capture_custody_rejects_wrong_mode_pose_and_archive(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);archive=root/'archive';archive.mkdir()
            poses=[dict(name='inland-seam-near',x=-200,z=-728,y=18.361431,yaw=0,pitch=-14,diagnosticObserver=True),dict(name='inland-seam-far',x=-200,z=-656,y=18.793665,yaw=0,pitch=-2,diagnosticObserver=True)]
            canvas=dict(width=529,height=980,cssWidth=540,cssHeight=1000)
            views=[]
            for pose in poses:
                for modeid,mode in enumerate(a.MODES):
                    filename=pose['name']+'-'+mode+'.png';Image.new('RGBA',(529,980),(32+modeid,64,96,255)).save(root/filename)
                    h=hashlib.sha256((root/filename).read_bytes()).hexdigest();cam=dict(x=1,y=2,z=3)
                    views.append(dict(pose=pose,mode=mode,label='candidate',sourceHead=a.SCENE,rendererHash=a.RENDERER,diagnosticApplied=modeid,modeId=modeid,grassHidden=True,imageWidth=529,imageHeight=980,image=filename,imageSha256=h,assetSignature='[]|trees',canvas=canvas,expectedCameraPosition=cam,lastFrame=dict(cameraPosition=cam,navigationSequence=modeid+1),state=dict(position={k:pose[k] for k in ['x','y','z']},yawDegrees=pose['yaw'],pitchDegrees=pose['pitch'],verticalFovDegrees=56,diagnosticObserver=True,sequence=modeid+1),captureMethod='PRESERVED_WEBGL_CANVAS_PNG',cpuSubmitMilliseconds=[1],softwareGpuFinishMilliseconds=[2]))
            refs=[]
            for v in views[:2]:
                (archive/v['image']).write_bytes((root/v['image']).read_bytes());refs.append(dict(image=v['image'],imageSha256=v['imageSha256'],expectedCameraPosition=v['expectedCameraPosition'],canvas=canvas,assetSignature='[]'))
            contract={'poses':poses,'archiveCustody':{'referenceFrames':refs}}
            receipt=dict(result='IDENTITY_CAPTURE_COMPLETE_ANALYSIS_PENDING',profile='IDENTITY_BLEND_DIAGNOSTIC_V1',sourceProductSha256=a.RENDERER,sceneIdentity={'sourceHead':a.SCENE},views=views,errors=[],runs=[{'errors':[]}])
            def write(): (root/'receipt.json').write_text(json.dumps(receipt))
            write();a.verify_capture(root,archive,contract)
            views[0]['modeId']=9;views[0]['diagnosticApplied']=9;write()
            with self.assertRaisesRegex(ValueError,'MODE_NOT_APPLIED'):a.verify_capture(root,archive,contract)
            views[0]['modeId']=0;views[0]['diagnosticApplied']=0;views[0]['state']['pitchDegrees']=7;write()
            with self.assertRaisesRegex(ValueError,'ACTUAL_POSE_MISMATCH'):a.verify_capture(root,archive,contract)
            views[0]['state']['pitchDegrees']=-14;write();refs[0]['assetSignature']='different'
            with self.assertRaisesRegex(ValueError,'ARCHIVE_ASSET_MISMATCH'):a.verify_capture(root,archive,contract)

    def test_shared_fertile_paths_are_one_root(self):
        f0={k:np.array([.4]) for group in a.FIELDS for k in group};f1={k:v.copy() for k,v in f0.items()};f1['fertile']=np.array([.8])
        terms,delta=a.decompose(np.array([[.25,.2,.15]]),np.array([[.25,.2,.15]]),f0,f1)
        np.testing.assert_allclose(terms['fertile'],delta,atol=2e-16)
        self.assertTrue(all(np.max(abs(v))<1e-15 for k,v in terms.items() if k!='fertile'))

if __name__=='__main__':unittest.main()
