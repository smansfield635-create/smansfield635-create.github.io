#!/usr/bin/env python3
"""Reproduce East's source-field calculation; no render, repository mutation or acceptance.

Formula translation is manual NumPy float64, NOT source-extracted executable GLSL.
Exact source clauses are checked before evaluation. GPU float/hash precision differs.
"""
import argparse
import hashlib
import json
import subprocess
import numpy as np

HEAD = '3754eca67a9162fd4b8fc93d2f0d05111e8d236b'
PATH = 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
BLOB = 'ac3c1edab6fd1b2468fbe0925fc2ec32277ba05a'

def calculate(repo):
    source = subprocess.check_output(['git', '-C', repo, 'show', HEAD+':'+PATH]).decode()
    blob = subprocess.check_output(['git', '-C', repo, 'rev-parse', HEAD+':'+PATH]).decode().strip()
    assert blob == BLOB
    clauses = [
        'p=fract(p*vec2(123.34,456.21));',
        'p+=dot(p,p+45.32);',
        'return fract(p.x*p.y);',
        'f=f*f*(3.0-2.0*f);',
        'float broad=noise2(world*0.035);',
        'float macroField=noise2(world*0.018+vec2(5.0,-11.0));',
        'float mesoField=noise2(world*0.082+vec2(-13.0,7.0));',
        'float detailField=noise2(world*0.29+vec2(29.0,-17.0));',
        'float groundcoverDomainX=(0.8*world.x-0.6*world.y)*0.018+5.0+0.65*(broad-0.5);',
        'float groundcoverDomainZ=(0.6*world.x+0.8*world.y)*0.018-11.0+0.65*(macroField-0.5);',
        'float groundcoverOrganic=noise2(vec2(groundcoverDomainX,groundcoverDomainZ));',
        '0.20,0.66,groundcoverOrganic*0.78+mesoField*0.22',
        'float groundcoverPatchContinuity=smoothstep(0.30,0.85,groundcoverPatch);',
        'float groundcoverWeight=0.88*groundcoverPatch*',
        '(1.0-0.25*groundcoverPatchContinuity)*',
        'groundcoverSuitability*groundcoverProtection;'
    ]
    for clause in clauses:
        assert clause in source, 'source clause changed: '+clause
    x,z=np.meshgrid(np.arange(-500,12,dtype=float),np.arange(-800,-288,dtype=float))
    def frac(v): return v-np.floor(v)
    def h(x,z):
        x=frac(x*123.34);z=frac(z*456.21)
        d=x*(x+45.32)+z*(z+45.32);x+=d;z+=d
        return frac(x*z)
    def n(x,z):
        i=np.floor(x);j=np.floor(z);u=frac(x);v=frac(z)
        u=u*u*(3-2*u);v=v*v*(3-2*v)
        return ((1-u)*h(i,j)+u*h(i+1,j))*(1-v)+((1-u)*h(i,j+1)+u*h(i+1,j+1))*v
    def ss(a,b,v):
        t=np.clip((v-a)/(b-a),0,1)
        return t*t*(3-2*t)
    b=n(x*.035,z*.035);ma=n(x*.018+5,z*.018-11)
    me=n(x*.082-13,z*.082+7);de=n(x*.29+29,z*.29-17)
    o=n((.8*x-.6*z)*.018+5+.65*(b-.5),(.6*x+.8*z)*.018-11+.65*(ma-.5))
    def w(f):
        p=ss(.2,.66,f)
        return .88*p*(1-.25*ss(.3,.85,p))
    fields=[]
    for name,f in [('original',o*.78+me*.22),('resident_meso_detail',me*.78+de*.22)]:
        q=w(f);cor={}
        for k in (5,10,20,40):
            cor[str(k)]=float((np.corrcoef(q[:-k,:].flatten(),q[k:,:].flatten())[0,1]+np.corrcoef(q[:,:-k].flatten(),q[:,k:].flatten())[0,1])/2)
        fields.append(dict(field=name,meanWeight=float(q.mean()),stdWeight=float(q.std()),lowWeightFraction=float((q<.05).mean()),highWeightFraction=float((q>.6).mean()),meanXZCorrelationAtMetres=cor))
    return dict(source=dict(repository='smansfield635-create/smansfield635-create.github.io',head=HEAD,path=PATH,blob=BLOB,sha256=hashlib.sha256(source.encode()).hexdigest()),method=dict(execution='MANUAL_NUMPY_FLOAT64_TRANSLATION_WITH_SOURCE_CLAUSE_ASSERTIONS',sourceExtractedExecutableGLSL=False,gridShape=[512,512],xInclusive=[-500,11],zInclusive=[-800,-289],stepMetres=1,suitability=1,protection=1,correlation='Mean of Pearson X and Z lag correlations across all valid overlapping grid cells',standardDeviation='population'),results=fields,limits=['Synthetic scalar field, not actual visible geometry or pixel sampling','No GPU or GLSL precision equivalence','No source-stage reattribution','No visual, healthy-control, map-wide, performance or owner acceptance','No endpoint/tone, slope, rock, coast or subsequent layer evaluation'])

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--repo', required=True)
    args=parser.parse_args()
    print(json.dumps(calculate(args.repo),indent=2))
