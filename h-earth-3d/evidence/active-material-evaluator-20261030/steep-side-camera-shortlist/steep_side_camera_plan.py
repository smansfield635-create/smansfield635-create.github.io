#!/usr/bin/env python3
"""Source-registered camera shortlist, H-Earth Gen3000 evidence-only.
Original frozen terrain mesh sampling, not new GPU, defect match or product mutation.
"""
import argparse, hashlib, json, math, zipfile
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree

ARCHIVE_SHA='5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c'
POSITIONS_SHA='342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83'
INDICES_SHA='483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c'
CAMERAS=[('west_flank',(110.,-310.),(145.,-240.)),('central_approach',(150.,-318.),(145.,-240.)),('east_oblique',(210.,-310.),(185.,-240.))]
EYE_CLEARANCE=1.65

def sha(b):return hashlib.sha256(b).hexdigest()

class Terrain:
 def __init__(self,path):
  binary=Path(path).read_bytes()
  assert sha(binary)==ARCHIVE_SHA,'ARCHIVE_ID_MISMATCH'
  with zipfile.ZipFile(path) as z:
   assert z.testzip() is None,'ZIP_CRC'
   prefix='evidence-inputs/original-mesh/mesh/'
   pb=z.read(prefix+'upload-positions.bin');ib=z.read(prefix+'upload-indices.bin')
   assert sha(pb)==POSITIONS_SHA and sha(ib)==INDICES_SHA,'MESH_BYTE_ID_MISMATCH'
   self.vertices=np.frombuffer(pb,'<f4').reshape(-1,3).astype(float)
   idx=np.frombuffer(ib,'<u4').reshape(-1,3)
   self.indices=idx[:20736].copy()
   self.normals=np.frombuffer(z.read(prefix+'upload-normals.bin'),'<f4').reshape(-1,3).astype(float)
  pts=self.vertices[self.indices]
  self.search=cKDTree(pts[:,:,[0,2]].mean(axis=1))
 def sample(self,x,z):
  point=np.array([x,z]);_,indices=self.search.query(point,k=50)
  for ix in np.atleast_1d(indices):
   t=self.vertices[self.indices[ix]];a,b,c=t[:,[0,2]]
   mat=np.column_stack((b-a,c-a))
   det=np.linalg.det(mat)
   if abs(det)<1e-10:continue
   u,v=np.linalg.solve(mat,point-a)
   if u< -1e-6 or v< -1e-6 or u+v>1+1e-6:continue
   y=float((1-u-v)*t[0,1]+u*t[1,1]+v*t[2,1]);ids=self.indices[ix]
   normal=(1-u-v)*self.normals[ids[0]]+u*self.normals[ids[1]]+v*self.normals[ids[2]]
   normal/=np.linalg.norm(normal)
   return {'xyz':[float(x),y,float(z)],'normal':normal.tolist(),'slope':float(1-np.clip(normal[1],0,1)),'sourceTriangle':int(ix)}
  raise ValueError(f'NO_ORIGINAL_TERRAIN_SUPPORT: {x},{z}')

def camera(terrain,id,origin,target):
 x,z=origin;tx,tz=target
 # Keep the original-Site-B source geometry/attribute patch disjoint from the scoped camera/target endpoints.
 assert x>100 and tx>100 and z< -220 and tz< -220
 c=terrain.sample(x,z);t=terrain.sample(tx,tz)
 y=c['xyz'][1]+EYE_CLEARANCE;ty=t['xyz'][1]+1.
 h=math.hypot(tx-x,tz-z)
 yaw=math.degrees(math.atan2(tx-x,-(tz-z)))%360
 pitch=math.degrees(math.atan2(ty-y,h))
 assert -42<=pitch<=32,'ORIGINAL_NAVIGATION_PITCH_LIMIT'
 clearances=[]
 for alpha in np.linspace(.025,.975,39):
  hx=x+(tx-x)*alpha;hz=z+(tz-z)*alpha
  gh=terrain.sample(hx,hz)['xyz'][1]
  clearances.append(float(y+(ty-y)*alpha-gh))
 minimum=float(min(clearances))
 assert minimum>.5, 'LOS_FAILED'
 return {'id':id,'historicalNativeTerrainOnly':True,'cameraXZ':[x,z],'sourceCameraY':y,'yawDegrees':yaw,'pitchDegrees':pitch,'verticalFovDegrees':56,'viewport':[529,980],'targetXZ':[tx,tz],'targetSurfaceXYZ':t['xyz'],'targetSourceSlope':t['slope'],'targetSourceTriangle':t['sourceTriangle'],'horizontalTargetDistance':h,'sampledRayMinTerrainClearance':minimum,'raySamples':len(clearances),'eyeHeightAboveSourceSurface':EYE_CLEARANCE,'candidateCurrentSceneRecheckRequired':True,'ownerPhotoMatch':False}

def produce(archive,out):
 ter=Terrain(archive);poses=[camera(ter,*v) for v in CAMERAS]
 obj={'schema':'H_EARTH_GEN3000_STEEP_SIDE_SOURCE_CAMERA_SHORTLIST_v1','sourceReference':'ORIGINAL_NATIVE_MESH_20261029_ARCHIVE_NOT_CURRENT_VISIBLE_GPU','sourceArchiveSha256':ARCHIVE_SHA,'testedProductCandidate':'3ea149e5b56e8cc0d5aac192bce0cdd47da7e626','poses':poses,'protectedPreviouslyPreservedCameras':['protected-meadow','protected-coast'],'originalRidgeExcluded':'x88,z-260,yaw118,pitch-13 was a foreground/background occlusion edge','purpose':'Coverage hypotheses for the undeveloped higher foothills, NOT reproduction of either owner screenshot','ownerDefectsStillUnlocated':['straight 180-degree ground material cutoff','curved tan/olive wedge'], 'limits':['No current candidate GPU visibility','No owner image/world correspondence','Original uploaded mesh: generated patches/current depth owner must be rechecked','LOS uses 39 native mesh centerline height samples, not pixel depth rasterization','No new canonical admission, GPU dispatch, product mutation, merge or publication']}
 Path(out).write_text(json.dumps(obj,indent=2)+'\n')
 print(json.dumps([{'id':p['id'],'yaw':round(p['yawDegrees'],3),'pitch':round(p['pitchDegrees'],3),'terrainClearanceM':round(p['sampledRayMinTerrainClearance'],3),'sourceSlope':round(p['targetSourceSlope'],3)} for p in poses],indent=2))
 return obj

if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--archive',required=True);ap.add_argument('--output',required=True);a=ap.parse_args();produce(a.archive,a.output)