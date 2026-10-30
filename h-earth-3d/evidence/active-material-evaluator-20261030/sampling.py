"""Explicit CPU texture filtering and captured parent-plane derivative inputs.
No inference of hardware mip pixels, visibility, helper ownership or full shader output.
"""
from pathlib import Path
import hashlib,json,sys
import numpy as np
from PIL import Image

def bilinear(pixels,uv,wrap='clamp'):
    a=np.asarray(pixels,dtype=float)
    if a.ndim==2:a=a[:,:,None]
    uv=np.asarray(uv,dtype=float)
    if uv.shape[-1]!=2 or not np.isfinite(uv).all():raise ValueError('UV_INVALID')
    h,w=a.shape[:2];p=uv*np.array([w,h])-.5;ij=np.floor(p).astype(np.int64);f=p-ij;x,y=ij[...,0],ij[...,1]
    if wrap not in ['clamp','repeat']:raise ValueError('WRAP_INVALID')
    ix=lambda v,n:np.mod(v,n) if wrap=='repeat' else np.clip(v,0,n-1)
    get=lambda x,y:a[ix(y,h),ix(x,w)]
    return ((get(x,y)*(1-f[...,0,None])+get(x+1,y)*f[...,0,None])*(1-f[...,1,None])+(get(x,y+1)*(1-f[...,0,None])+get(x+1,y+1)*f[...,0,None])*f[...,1,None])

def barycentric3(points,tri):
    e=tri[1:]-tri[0];gram=e@e.T
    if abs(np.linalg.det(gram))<1e-20:raise ValueError('TRIANGLE_DEGENERATE')
    uv=(np.asarray(points)-tri[0])@e.T@np.linalg.inv(gram)
    return np.column_stack([1-uv.sum(axis=-1),uv])

def camera_quad(tri,point,matrix,width,height):
    # WebGL upload converts the recorded matrix to Float32. Keep arithmetic model explicit.
    M=np.asarray(matrix,dtype=np.float32).astype(float).reshape(4,4).T
    if not np.isfinite(M).all() or width<=0 or height<=0:raise ValueError('CAMERA_INPUT_INVALID')
    inv=np.linalg.inv(M)
    clip=M@np.r_[point,1.];ndc=clip[:3]/clip[3]
    if clip[3]<=0 or np.any(abs(ndc)>1):return {'status':'OUTSIDE_CLIP'}
    pixel=np.floor((ndc[:2]+1)*np.array([width,height])/2).astype(int)
    if np.any(pixel<0) or np.any(pixel>=np.array([width,height])):return {'status':'OUTSIDE_VIEWPORT'}
    xy=(pixel//2*2)+np.array([[0,0],[1,0],[0,1],[1,1]])
    rays=[]
    for depth in [-1,1]:
        q=np.c_[2*(xy+.5)/[width,height]-1,np.full(4,depth),np.ones(4)]@inv.T;rays.append(q[:,:3]/q[:,3,None])
    origin,finish=rays;direction=finish-origin;n=np.cross(tri[1]-tri[0],tri[2]-tri[0]);den=direction@n
    if np.any(abs(den)<1e-12):return {'status':'PARALLEL_HELPER_RAY'}
    q=origin+direction*(((tri[0]-origin)@n)/den)[:,None];weights=barycentric3(q,tri)
    ix,iy=pixel%2;dx=q[iy*2+1]-q[iy*2];dy=q[2+ix]-q[ix]
    return {'status':'PARENT_PLANE_CPU_INPUTS','pixelBottomLeft':pixel.tolist(),'quadWorld':q.tolist(),'quadBarycentrics':weights.tolist(),'dWorldDx':dx.tolist(),'dWorldDy':dy.tolist(),'helpersOutsideParent':int((weights.min(axis=1)<-1e-8).sum())}

def checked(path,expected):
    b=Path(path).read_bytes()
    if hashlib.sha256(b).hexdigest()!=expected:raise ValueError('INPUT_HASH:'+str(path))
    return b

def main(source,geometry,mesh,receipt,textureout):
    import shapely
    from shapely.strtree import STRtree
    here=Path(__file__).parent;source,geometry,mesh,textureout=map(Path,[source,geometry,mesh,textureout]);m=json.loads((here/'texture-manifest.json').read_text());binding=json.loads((here/'source-manifest.json').read_text());review=json.loads((here/'independent-review.json').read_text())
    views=json.loads(checked(receipt,m['candidateReceiptSha256']))['views'];g=json.loads(checked(geometry/'geometry.json',review['reviewedHashes']['geometry.json']));atlas=json.loads(checked(textureout/'atlas-inputs.json',hashlib.sha256((here/'atlas-inputs.json').read_bytes()).hexdigest()));decoded={};texture_meta={};base='showroom/globe/h-earth/render/'
    for rel,name,mode in [('corrected-material-v1/near-atlas.png','near','RGB'),('corrected-material-v1/far-atlas.png','far','RGB'),('assets/woodland-clearing-soil.png','soil','RGBA')]:
        p=base+rel;checked(source/p,m['assetHashes'][p]);im=Image.open(source/p);a=np.asarray(im.convert(mode),dtype=np.uint8);decoded[name]=a;file=name+'-level0.bin';(textureout/file).write_bytes(a.tobytes());texture_meta[name]={'file':file,'width':im.width,'height':im.height,'channels':a.shape[2],'sha256':hashlib.sha256(a.tobytes()).hexdigest(),'pngColorMetadata':{k:str(v) for k,v in im.info.items() if k in ['gamma','srgb','icc_profile']},'mipStatus':'BASE_LEVEL_ONLY_GPU_GENERATED_MIPS_UNRESOLVED' if name=='soil' else 'NO_MIPMAPS_LINEAR_CLAMP'}
    # Base vertex provenance is retained through native duplication.
    b=checked(mesh/'upload-indices.bin',binding['meshHashes']['upload-indices.bin']);canonical=np.frombuffer(b,'<u4');offsets={tuple(canonical[i:i+3]):i for i in range(0,len(canonical),3)}
    arrays={}
    for k,info in atlas['buffers'].items():arrays[k]=np.frombuffer(checked(textureout/info['file'],info['sha256']),{'Float32Array':'<f4','Uint8Array':'u1','Uint32Array':'<u4','Uint16Array':'<u2'}[info['type']])
    atlas_uv=arrays['uv'].reshape(-1,2);mapped=arrays['indices'];alltri=[];owners=[]
    for surface in g['surfaces']:
        if not surface['correctionHook']:continue
        values={}
        for key in ['upload','indices']:
            f=surface['files'][key];values[key]=np.frombuffer(checked(geometry/f['file'],f['sha256']),'<f4' if key=='upload' else '<u4')
        pos=values['upload'].reshape(-1,3);ids=values['indices'].reshape(-1,3)
        for j,t in enumerate(pos[ids]):alltri.append(t.astype(float));owners.append((surface['name'],offsets.get(tuple(ids[j])) if surface['name'].startswith('original-') else None))
    alltri=np.asarray(alltri);polys=shapely.polygons(alltri[:,:,[0,2]]);tree=STRtree(polys);records=[]
    for view in views:
        w,h=view['canvas']['width'],view['canvas']['height'];matrix=view['worldPacket']['camera']['viewProjectionMatrix']
        for x,z in view['pose']['sourceCentersXZ']:
            hits=tree.query(shapely.Point(x,z),predicate='covered_by');r={'pose':view['pose']['name'],'sourceXZ':[x,z],'canvas':[w,h],'supportHits':len(hits)}
            if len(hits)!=1:r['status']='UNRESOLVED_MULTIPLE_OR_MISSING_SUPPORT';records.append(r);continue
            k=hits[0];tri=alltri[k];name,offset=owners[k];xz=tri[:,[0,2]];uv=np.linalg.solve((xz[1:]-xz[0]).T,np.array([x,z])-xz[0]);weights=np.r_[1-uv.sum(),uv];point=weights@tri;r.update(surface=name,sourceOffset=offset,world=point.tolist());r.update(camera_quad(tri,point,matrix,w,h))
            if offset is not None:
                ids=mapped[offset:offset+3];aids=arrays['atlasIds'][ids]
                if len(set(aids))!=1:raise ValueError('FLAT_ATLAS_ID_MISMATCH')
                aid=int(aids[0]);r['atlasId']=aid
                if aid:
                    tex=decoded['near' if aid==1 else 'far'];u=weights@atlas_uv[ids];r['atlasUV']=u.tolist();r['atlasDeltaRGB']=((bilinear(tex,u)-128)/1024).tolist()
                else:r['atlasDeltaRGB']=[0.,0.,0.]
            else:r.update(atlasId=0,atlasDeltaRGB=[0.,0.,0.])
            records.append(r)
    result={'schema':'H_EARTH_TEXTURE_CAMERA_INPUTS_v1','sourceHead':m['sourceHead'],'decodedTextures':texture_meta,'witnessCount':len(records),'resolvedParentPlaneInputs':sum(r['status']=='PARENT_PLANE_CPU_INPUTS' for r in records),'witnesses':records,'limits':['Captured actual canvas and Float32 matrix used; no stale529x980 viewport or top-left dFdy convention.','Parent-plane helper extrapolation is recorded; raster ownership, fine/coarse derivative choice and GPU arithmetic are not certified.','RGB atlas interpolation is CPU LINEAR/CLAMP using native Float32 UVs; no GPU readback equivalence claim.','Soil base-level pixels recovered; GPU-generated mip levels and their exact sampling remain unresolved.','Complete material coefficients and visible improvement remain unresolved.']};(textureout/'sampling-inputs.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'witnesses':len(records),'resolved':result['resolvedParentPlaneInputs'],'textures':{k:[v['width'],v['height']] for k,v in texture_meta.items()}}))
if __name__=='__main__':main(*sys.argv[1:])
