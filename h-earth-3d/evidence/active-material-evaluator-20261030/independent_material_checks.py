"""West independent numerical checks; source-only binary64, not GPU equivalence.

Usage: python3 independent_material_checks.py SOURCE_DIR [OUTPUT_JSON]
Run alongside material_stages.py. Native modules are authenticated by the
source-bound loader; this check additionally records imported helper digests.
"""
from pathlib import Path
import hashlib,json,subprocess,sys
import numpy as np
import material_stages as m

source=Path(sys.argv[1]).resolve()
rng=np.random.default_rng(73000)
points=[[float(rng.uniform(-114,56)),float(rng.uniform(0,42)),float(rng.uniform(-269,-158))] for _ in range(1000)]
helper_paths=[source/'showroom/globe/h-earth/render'/name for name in ['foothill-meadow-field.v1.js','hillside-shoreline-field.v1.js']]
js="""import fs from 'node:fs';const [f,h]=await Promise.all(process.argv.slice(1).map(p=>import(p)));const p=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(p.map(([x,y,z])=>[f.sampleFoothillMeadowField(x,y,z).dry,h.hillsideWeight(x,z)])));"""
native=json.loads(subprocess.check_output(['node','--input-type=module','-e',js,*[p.as_uri() for p in helper_paths]],input=json.dumps(points).encode()))
diffs=np.array([[abs(m.foothill_dry(np.array(p),420000)-n[0]),abs(m.hillside_weight(np.array(p)[[0,2]])-n[1])] for p,n in zip(points,native)])
assert diffs.max()<1e-10
max_affine_error=0.
for p0 in points[::20]:
    p=np.array(p0);q=np.array([p,p+[.07,.005,0],p+[0,.003,.08],p+[.07,.008,.08]])
    i=dict(world=p.tolist(),normal=[.1,1,.1],eye=(p+[1,2,3]).tolist(),quadWorld=q.tolist(),pixelBottomLeft=[0,0],coastDistance=40,contactDistance=5,farNormalFlip=False,atlasDeltaRGB=[.01,-.02,.03],marginDelta=[.1,.01,.02,-.01],habitatEnabled=False,floorFootprints=[],planetRadius=420000)
    r=m.evaluate_material(i,lambda name,uv:[.25]);A=np.array(r['coefficients']['A']);B=np.array(r['coefficients']['B'])
    for P in rng.random((20,3)):
        color=P.copy()
        for stage in r['stages']:
            if stage['id']=='material-margin':color+=np.array(stage['addA'])*P+np.array(stage['addB'])
            else:color=color*np.array(stage['gain'])+np.array(stage['bias'])
        error=float(np.max(abs(color-(A*P+B))));max_affine_error=max(max_affine_error,error)
        assert error<1e-12
report={'schema':'H_EARTH_INDEPENDENT_MATERIAL_ALGEBRA_CHECK_v1','seed':73000,'nativeHelperCases':1000,'foothillMaxDifference':float(diffs[:,0].max()),'hillsideMaxDifference':float(diffs[:,1].max()),'randomSubstrateCompositions':1000,'maxAffineDifference':max_affine_error,'helperHashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in helper_paths},'modelSha256':hashlib.sha256(Path(m.__file__).read_bytes()).hexdigest(),'scope':'NATIVE_HELPER_COMPARISON_AND_ORDERED_TRACE_COMPOSITION_ONLY','limits':['Trace composition independently checks algebra, not each procedural operand.','Native helper binary64 agreement does not prove GLSL highp equality.','Full equations separately reviewed against frozen renderer and helper GLSL.']}
text=json.dumps(report,indent=2)+'\n';print(text)
if len(sys.argv)>2:Path(sys.argv[2]).write_text(text)
