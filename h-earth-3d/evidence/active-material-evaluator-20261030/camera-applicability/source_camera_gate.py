#!/usr/bin/env python3
"""H-Earth Gen3000 source spatial applicability and historic camera custody.

Read-only; disjoint correction support is not a product-appearance proof.
To re-evaluate pinned renderer versions, supply a local checkout of both commits
as positional arguments to ``--source`` and optionally archived image ZIPs.
"""
import argparse,hashlib,json,re,zipfile,difflib
from pathlib import Path

ORIGINAL='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
BASE='260c66540b4471bb3d50cbc28cf82d160b732b19'
CANDIDATE='3ea149e5b56e8cc0d5aac192bce0cdd47da7e626'
ROOT='showroom/globe/h-earth/render/'
RENDER=ROOT+'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
ROUTE='showroom/globe/h-earth/vegetation-prototype/route.js'
MARGIN=ROOT+'material-margin-field.v1.js'
ATLAS_HASHES=('b955d44ec908cdc1ea3ca18fc51f6dc513bbad5d5d8823da95a78e9c9bc83da7',
'78a1031c9cdcf9d9649bede330e50f18b192ccba40d49ec5af1f293fc70a8d5f')
BLOBS={
 'base_renderer':'85ee835060d5106a670077a5f4352b7ad202b49b',
 'candidate_renderer':'2367aea63563b33ad7159a1feb7ac26fbc631792',
 'base_route':'8e8df594b8968f6bb17f32dc4ed7025bd2488bd0',
 'candidate_route':'4162d3cdb39ad239a0a9d1e6b00197f9d642ca92',
 'margin':'757a889f26d1dafc42b21f774c3a1dfbfb16c53a'}
ARCHIVES={
 'historic_far':('aee6311ffaf9de2c3191bbd416331e7c59735b6e4ab2316640e24933ae59141c','inland-seam-far'),
 'mountain':('08783a00f26d39a8145c58f5a7b8e35d4967c3f0bdb513e2b4da976436332d38','source-mountain-diagonal-material-edge'),
 'current_3poses':('c1ae9fd42efba75bcda13c49caac13539bbb3aed41f812e05a0d6f59f3eb1756',None)}
WITNESSES={'historic_far_left':(-188.875,-736.0625),'historic_far_right':(-189.0625,-734.5625),
 'high_foothill_ridge_tie':(130.24184641886296,-250.),'high_foothill_camera_origin':(88.,-260.),
 'protected_meadow_camera':(-52.,-208.),'protected_coast_camera':(0.,-110.)}

def fail(msg):raise ValueError(msg)
def gitblob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def checked_file(path,sha):
 b=Path(path).read_bytes()
 if gitblob(b)!=sha:fail('SOURCE_BLOB_DRIFT:'+str(path))
 return b.decode('utf-8')
def manifest(renderer):
 m=re.search(r'^const CORRECTED_MANIFEST=(\{[^\n]+\});',renderer,re.M)
 if not m:fail('ATLAS_MANIFEST_MISSING')
 val=json.loads(m.group(1))
 if (val['stepMeters']!=.25 or len(val['charts'])!=358 or tuple(x['sha256'] for x in val['atlases'])!=ATLAS_HASHES):fail('ATLAS_IDENTITY_DRIFT')
 return val

def atlas_groups(m):
 out={}
 for c in m['charts']:
  g=out.setdefault(c['group'],{'count':0,'x':[float('inf'),-float('inf')],'z':[float('inf'),-float('inf')]})
  x,z=c['originXZ'];step=m['stepMeters'];g['count']+=1
  g['x']=[min(g['x'][0],x),max(g['x'][1],x+(c['width']-1)*step)]
  g['z']=[min(g['z'][0],z),max(g['z'][1],z+(c['height']-1)*step)]
 if set(out)!={'NEAR','FAR'} or out['NEAR']['count']!=314 or out['FAR']['count']!=44:fail('ATLAS_CHART_GROUP_DRIFT')
 return out

def within(pt,box,guard=0):
 x,z=pt
 return box['x'][0]-guard<=x<=box['x'][1]+guard and box['z'][0]-guard<=z<=box['z'][1]+guard

def margin_bounds(source):
 m=re.search(r'vec2 q=\(world-vec2\((-?[\d.]+),(-?[\d.]+)\)\)/vec2\(([\d.]+)\);',source)
 if not m or 'if(any(lessThan(q,vec2(0.0)))||any(greaterThan(q,vec2(1.0))))return vec4(0.0);' not in source:fail('MARGIN_ZERO_OUTSIDE_BOUNDS_NOT_PROVEN')
 x,z,width=map(float,m.groups())
 if [x,z,width]!=[-213.,-759.,48.]:fail('MARGIN_BOUNDS_DRIFT')
 return {'x':[x,x+width],'z':[z,z+width]}

def verify_change_set(baseline,current,base_route,current_route):
 edits=[]
 A=baseline.splitlines();B=current.splitlines()
 for tag,i,j,k,l in difflib.SequenceMatcher(None,A,B,autojunk=False).get_opcodes():
  if tag=='equal':continue
  old='\n'.join(A[i:j]);new='\n'.join(B[k:l]);edits.append(dict(kind=tag,oldLine=i+1,newLine=k+1,old=old[:160],new=new[:160]))
  if 'materialMargin' not in old+new and 'MATERIAL_MARGIN' not in old+new and 'marginDelta' not in old+new:fail('UNEXPECTED_RENDERER_CHANGE:'+str(i+1))
 if not edits or len(edits)!=9:fail('RENDERER_CHANGE_COUNT_DRIFT:'+str(len(edits)))
 if base_route.replace('rev=gen2987-habitat-material-blend-v1','rev=gen2992-full-material-inland-margin')!=current_route:fail('ROUTE_CHANGE_NOT_CACHE_ONLY')
 if current.count('palette+=marginDelta.x*materialMarginSubstrate+marginDelta.yzw')!=1 or 'materialMarginSubstrate=palette' not in current:fail('CURRENT_MARGIN_SEMANTICS_CHANGED')
 return edits

def verify_archive(path,which):
 sha,pose_name=ARCHIVES[which];b=Path(path).read_bytes()
 if hashlib.sha256(b).hexdigest()!=sha:fail('ARCHIVE_HASH:'+which)
 with zipfile.ZipFile(path) as z:
  if z.testzip() is not None:fail('ARCHIVE_CRC:'+which)
  receipt=json.loads(z.read('receipt.json' if which!='current_3poses' else 'candidate/receipt.json'))
  if which=='historic_far':
   v=next((x for x in receipt['views'] if x['label']=='baseline' and x['mode']=='reference-lit' and x['pose']['name']==pose_name),None)
   if v is None or v['imageSha256']!='cbff8d7e3212b6c09594d10d5ddd4a16d32d74f565101a31e3ba2c6faa0e41bc':fail('HISTORIC_VIEW_CHANGED')
   if v['canvas']['width']!=529 or v['canvas']['height']!=980 or v['pose']!={'name':'inland-seam-far','x':-200,'z':-656,'y':18.793665,'yaw':0,'pitch':-2,'diagnosticObserver':True}:fail('HISTORIC_CAMERA_CHANGED')
   return {'name':pose_name,'camera':v['pose'],'verifiedImageSha256':v['imageSha256'],'canvas':[529,980]}
  if which=='mountain':
   v=next((x for x in receipt['views'] if x['mode']=='reference-lit' and x['pose']['name']==pose_name),None)
   if v is None or [v['pose'].get(k) for k in ('x','z','yaw','pitch')]!=[88,-260,118,-13]:fail('MOUNTAIN_POSE_CHANGED')
   return {'name':pose_name,'camera':v['pose'],'verifiedImageSha256':v['imageSha256'],'canvas':[529,980]}
  if which=='current_3poses':
   if receipt['sceneHead']!=CANDIDATE or len(receipt['views'])!=3:fail('CURRENT_SCENE_OR_CAMERA_COUNT_CHANGED')
   return {'cameraNames':[x['pose']['name'] for x in receipt['views']],'witnessInView':False,'notRecomputedHere':True}

def evaluate_groups(groups,bounds):
 out={}
 for name,pt in WITNESSES.items():
  out[name]={'xz':list(pt),'atlasBoundingBoxes':[g for g,box in groups.items() if within(pt,box)],
             'materialMarginSupport':within(pt,bounds),'materialMarginZeroBySourceLaw':not within(pt,bounds),
             'atlasDefinitelyOutsideWithOneMetreGuard':all(not within(pt,b,1.0) for b in groups.values())}
 if out['high_foothill_ridge_tie']['materialMarginSupport'] or not out['high_foothill_ridge_tie']['atlasDefinitelyOutsideWithOneMetreGuard']:fail('MOUNTAIN_GEOGRAPHY_NOT_OUTSIDE_CORRECTION')
 if any(not out[n]['materialMarginSupport'] for n in ('historic_far_left','historic_far_right')):fail('HISTORIC_GEOGRAPHY_NO_LONGER_INSIDE_MARGIN')
 return out

def source_check(base_dir,candidate_dir):
 a=Path(base_dir);b=Path(candidate_dir)
 ra=checked_file(a/RENDER,BLOBS['base_renderer']);rb=checked_file(b/RENDER,BLOBS['candidate_renderer'])
 ar=checked_file(a/ROUTE,BLOBS['base_route']);br=checked_file(b/ROUTE,BLOBS['candidate_route'])
 margin=checked_file(b/MARGIN,BLOBS['margin'])
 m=manifest(rb)
 if manifest(ra)!=m:fail('BASELINE_AND_CANDIDATE_ATLAS_MANIFEST_DIFFER')
 edits=verify_change_set(ra,rb,ar,br)
 groups=atlas_groups(m);bounds=margin_bounds(margin)
 return {'baseRendererGitBlob':BLOBS['base_renderer'],'candidateRendererGitBlob':BLOBS['candidate_renderer'],
 'baseRouteGitBlob':BLOBS['base_route'],'candidateRouteGitBlob':BLOBS['candidate_route'],
 'totalRendererEdits':len(edits),'edits':edits,'atlas':groups,'margin':bounds,'witnesses':evaluate_groups(groups,bounds)}

if __name__=='__main__':
 parser=argparse.ArgumentParser()
 parser.add_argument('--source',nargs=2,metavar=('BASELINE_DIR','CANDIDATE_DIR'))
 parser.add_argument('--historic-far');parser.add_argument('--historic-mountain');parser.add_argument('--current-views');parser.add_argument('--output')
 args=parser.parse_args()
 if not args.source:parser.error('--source requires exact source directories for pinned 260c / 3ea commits')
 report={'schema':'H_EARTH_GEN3000_CURRENT_CAMERA_APPLICABILITY_GATE_v1','sourceBaseline':BASE,'sourceCandidate':CANDIDATE,
 'result':'SOURCE_ONLY_MOUNTAIN_MARGIN_DISJOINT__HISTORIC_FAR_SUPPORTED','source':source_check(*args.source),
 'historicalArtifacts':{},'noGpu':True,'noProductMutation':True,
 'limits':['Chart bounding boxes prove exclusion, not full chart coverage.','Old archived mountain and far captures are historical, not current 3ea GPU comparisons.','Zero new margin at mountain witness does not prove every pixel in the entire mountain camera is unchanged.','The inherited atlas is in both 260c baseline and 3ea candidate.','No visual qualification, depth owner, lighting, or general user photo coordinates established.']}
 for key,path in [('historic_far',args.historic_far),('mountain',args.historic_mountain),('current_3poses',args.current_views)]:
  if path:report['historicalArtifacts'][key]=verify_archive(path,key)
 if args.output:Path(args.output).write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'result':report['result'],'sourceEditCount':report['source']['totalRendererEdits'],'mountain':report['source']['witnesses']['high_foothill_ridge_tie'],'historic':report['source']['witnesses']['historic_far_left']}))
