#!/usr/bin/env python3
"""Independent geometric inequalities for H-Earth historical far source pair.

Does not import primary proof, does not modify product or use a GPU.
"""
import json, math, hashlib, pathlib
ROOT=pathlib.Path(__file__).parent
r=json.loads((ROOT/'contact-replay.json').read_text())
p=json.loads((ROOT/'historic-far-post-margin-gates.json').read_text())
assert r['source']=='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
assert r['stats']['saturationMeters']==64
assert r['stats']['terrainTriangles']==20736 and r['stats']['oceanTriangles']==17696
assert set(x['offset'] for x in r['samples'])=={144,73902}
for t in r['samples']:
    assert t['contact']==[64,64,64]
assert len(p['witnesses'])==2
checks=[]
for i,v in enumerate(p['witnesses']):
    x,y,z=v['world'];c=v['contact']
    # Separate elementary source-domain exclusion inequalities.
    manor=math.hypot(x-80,z+172)
    assert manor>40
    assert min(x+120,96-x,z+376,-224-z)<0
    assert x<-52 and z-(-208)<-48
    assert c>38
    assert x<-18 and z<-204
    assert x<-180 and z<-380
    bounds=[[-213,-298,-69,-154],[-298,-570,88,-154],[-448,-283,448,-93]]
    assert all(z<b[1] or z>b[3] or x<b[0] or x>b[2] for b in bounds)
    assert x<-22 and z<-208
    assert v['allPostMarginStagesInactive']
    assert len(v['stageInactivity'])==8 and all(v['stageInactivity'].values())
    checks.append({'witness':i,'exactWorld':[x,y,z],'manorDistanceMeters':manor,'contactDistanceMeters':c,'siteBminEdgeMeters':min(x+120,96-x,z+376,-224-z), 'hillsideDeltaMeters':z+208,'allLaterStagesSourceInactive':True})
for c in p['cases']:
    assert c['sourceOffsets'] in ([144,144],[73902,144])
    assert c['postMaterialRGB']==c['preLaterRGB']
    assert 0.61<c['redContrastReductionFraction']<0.63
out={'schema':'H_EARTH_GEN3000_HISTORIC_STAGE_GUARDS_INDEPENDENT_v1', 'result':'INDEPENDENT_SOURCE_INEQUALITIES_PASS', 'checked':checks,'retainedCases':len(p['cases']),'cameraDepthVisibility':'UNQUALIFIED','nodeOrGpuEquivalence':False, 'newGpu':False,'productModified':False}
(ROOT/'independent-review.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'result':out['result'],'witnesses':len(checks),'cases':len(p['cases'])}))