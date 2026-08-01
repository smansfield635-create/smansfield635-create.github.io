#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,re,sys
root=Path('.')
exact=Path(sys.argv[1])
base='f1ba63b088f89c6539d92d5293ba1eb651644480'
ev=root/'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence'
proj=ev/'r1-7b-engineering-captures'; proj.mkdir(parents=True,exist_ok=True)
receipt_text=(exact/'h-earth.c2-r1.r1-7b-verification.json').read_text(); receipt=json.loads(receipt_text)
(ev/'h-earth.c2-r1.r1-7b-verification.json').write_text(receipt_text)
def blob(data): return hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
def project(src,dst):
 text=src.read_text(); labels=re.findall(r'<text[^>]*>(.*?)</text>',text)
 rects=re.findall(r'<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)" fill="([^"]+)"',text)
 m={(float(x),float(y)):fill for x,y,w,h,fill in rects}; xs=sorted({x for x,y in m}); ys=sorted({y for x,y in m})
 panels=(xs[:17],xs[17:]); xi=(0,4,8,12,16); yi=(0,6,12,17,23,29,35,40,46,52)
 cell=28; gap=18; margin=18; th=62; lh=28; pw=5*cell; width=margin*2+pw*2+gap; height=th+lh+10*cell+44
 source=hashlib.sha256(text.encode()).hexdigest()
 out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">','<rect width="100%" height="100%" fill="#11151b"/>',f'<text x="{margin}" y="24" fill="#f0f3f7" font-family="monospace" font-size="14">{labels[0]} — bounded 5×10 projection</text>',f'<text x="{margin}" y="44" fill="#9ca7b5" font-family="monospace" font-size="10">Source SHA-256: {source}</text>']
 for pi,(px,label) in enumerate(zip(panels,labels[1:3])):
  x0=margin+pi*(pw+gap); out.append(f'<text x="{x0}" y="{th+16}" fill="#dce3ea" font-family="monospace" font-size="11">{label}</text>')
  for ry,y in enumerate(yi):
   for cx,x in enumerate(xi): out.append(f'<rect x="{x0+cx*cell}" y="{th+lh+ry*cell}" width="{cell-1}" height="{cell-1}" fill="{m[(px[x],ys[y])]}"/>')
 out += [f'<text x="{margin}" y="{th+lh+10*cell+20}" fill="#9ca7b5" font-family="monospace" font-size="10">Documented downsampled projection of exact workflow capture; engineering evidence only.</text>','</svg>']
 data=(''.join(out)+'\n').encode(); dst.write_bytes(data)
 return {'sourceSha256':source,'sha256':hashlib.sha256(data).hexdigest(),'gitBlobSha':blob(data)}
projections={p.name:project(p,proj/p.name) for p in sorted((exact/'r1-7b-engineering-captures').glob('*.svg'))}
workflow='''name: H-Earth C2-R1 R1.7B Baked Macro Control Field

on:
  workflow_dispatch:

concurrency:
  group: h-earth-c2-r1-r1-7b-${{ github.ref }}
  cancel-in-progress: true
permissions:
  contents: read
jobs:
  verify-r1-7b:
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.sha }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Verify deterministic bounded baked macro control field
        env:
          C2_R1_HEAD: ${{ github.sha }}
        run: |
          node h-earth-3d/control-plane/coastal-morphology/c2-r1/tools/h-earth.c2-r1.r1-7b-bake-macro-control-field.mjs --check
          node h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.r1-7b-baked-macro-control-field.mjs
      - name: Upload R1.7B receipt and engineering captures
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: h-earth-c2-r1-r1-7b-engineering-evidence
          path: |
            h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/h-earth.c2-r1.r1-7b-verification.json
            h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/r1-7b-engineering-captures/*.svg
          if-no-files-found: error
          retention-days: 30
'''
(root/'.github/workflows/h-earth-c2-r1-r1-7b-baked-macro-control-field.yml').write_text(workflow)
pp=root/'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.r1-7-subcheckpoint-program.json'; lp=root/'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.r1-7-subcheckpoint-ledger.json'
p=json.loads(pp.read_text()); l=json.loads(lp.read_text()); b=p['subcheckpoints']['R1.7B']
b.update({'status':'PASS_CLOSED_DO_NOT_REOPEN','passingExecutionHead':base,'durableClosureHead':'COMMIT_CONTAINING_THIS_RECORD','closedRollbackBranch':'rollback/h-earth-c2-r1-r1-7b-closed-001','workflowRun':30679342931,'workflowJob':91313062274,'artifactId':8811649872,'artifactDigest':'sha256:6516110abe68a14160b64b4dbc0ed5dd3996128260806d4c21f773edb82b9ae4','registryPreflight':'PASS','fieldValuesSha256':'4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866','uniqueControlRatio':0.9445061043285239,'bakedMacroControlFieldCreated':True,'rendererSamplingIntegrationCreated':False,'wholeWorldBakeCreated':False,'upstreamAuthoritiesUnchanged':True,'representativeEngineeringCaptureCount':3,'firstBlocker':None,'workflowDisposition':'MANUAL_ONLY_AFTER_DURABLE_CLOSURE'})
p['currentSubcheckpoint']=p['nextAuthorizedSubcheckpoint']='R1.7C_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION'
e=next(x for x in l['entries'] if x['subcheckpoint']=='R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD')
e.update({'status':'PASS_CLOSED_DO_NOT_REOPEN','passingExecutionHead':base,'durableClosureHead':'COMMIT_CONTAINING_THIS_RECORD','closedRollbackBranch':'rollback/h-earth-c2-r1-r1-7b-closed-001','workflow':{'run':30679342931,'job':91313062274,'artifactId':8811649872,'artifactDigest':'sha256:6516110abe68a14160b64b4dbc0ed5dd3996128260806d4c21f773edb82b9ae4','result':'PASS','dispositionAfterClosure':'MANUAL_ONLY'},'registryPreflight':'PASS','representativeEngineeringCaptureCount':3,'firstBlocker':None})
l['currentSubcheckpoint']=l['nextAuthorizedSubcheckpoint']='R1.7C_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION'
pp.write_text(json.dumps(p,indent=2)+'\n'); lp.write_text(json.dumps(l,indent=2)+'\n')
exact_files={'h-earth.c2-r1.r1-7b-verification.json':{'sha256':hashlib.sha256(receipt_text.encode()).hexdigest()}}
for n,x in projections.items(): exact_files[f'r1-7b-engineering-captures/{n}']={'sha256':x['sourceSha256']}
manifest={'manifestType':'H_EARTH_C2_R1_R1_7B_EVIDENCE_MANIFEST_v1','operation':'R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD','status':'PASS_ENGINEERING_DURABLE_CLOSURE_COMMITTED','startingHead':'0498da0f3f4fe522659830499bd55ef8f018f776','passingExecutionHead':base,'durableClosureHead':'COMMIT_CONTAINING_THIS_RECORD','startRollbackBranch':'rollback/h-earth-c2-r1-r1-7b-start-001','closedRollbackBranch':'rollback/h-earth-c2-r1-r1-7b-closed-001','workflow':{'runId':30679342931,'jobId':91313062274,'result':'PASS','artifactId':8811649872,'artifactName':'h-earth-c2-r1-r1-7b-engineering-evidence','artifactDigest':'sha256:6516110abe68a14160b64b4dbc0ed5dd3996128260806d4c21f773edb82b9ae4','artifactSizeBytes':32980},'exactWorkflowArtifactFiles':exact_files,'durableRepositoryProjections':{n:{'projection':'DOCUMENTED_DOWNSAMPLED_5_BY_10_PROJECTION_OF_EXACT_WORKFLOW_CAPTURE',**x} for n,x in projections.items()},'implementationBlobs':{'.github/workflows/h-earth-c2-r1-r1-7b-baked-macro-control-field.yml':blob(workflow.encode()),'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.baked-macro-control-field.js':'a97b3df57ae01626a2ff5cbedf510e2afdf06912','h-earth-3d/control-plane/coastal-morphology/c2-r1/tests/h-earth.c2-r1.r1-7b-baked-macro-control-field.mjs':'74b6c1b4b9f69a7ff56cc58467c99168fbc5f959','h-earth-3d/control-plane/coastal-morphology/c2-r1/tools/h-earth.c2-r1.r1-7b-bake-macro-control-field.mjs':'d9dac1e6e14e956432d8d9122a4c9b498cb0a3dc'},'immutableUpstreamBlobs':receipt['metrics']['immutableUpstreamBlobs'],'fieldValuesSha256':'4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866','representativeEngineeringCaptureCount':3,'capturePurpose':'ENGINEERING_BAKED_FIELD_CORRESPONDENCE_CONTINUITY_AND_COASTAL_PRESERVATION_ONLY','bakedMacroControlFieldCreated':True,'rendererSamplingIntegrationCreated':False,'wholeWorldBakeCreated':False,'upstreamAuthoritiesUnchanged':True,'productDefaultMutated':False,'publicRouteMutated':False,'visualSuccessorStatus':'NOT_ESTABLISHED','userDifferentialReady':False}
(ev/'h-earth.c2-r1.r1-7b-evidence-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
