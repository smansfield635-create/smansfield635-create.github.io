"""One nominal CPU source replay of incoming soil P; no tolerance fitting.
Uses source-matched mesh normals and measured shader XYZ; CPU mip/quad models
are explicit approximations, so success/failure is screening evidence only.
"""
import importlib.util,json,hashlib,numpy as np
from pathlib import Path
from PIL import Image
s=importlib.util.spec_from_file_location('field',Path(__file__).with_name('source-fields.py'));f=importlib.util.module_from_spec(s);s.loader.exec_module(f)
F=np.float32
clamp=lambda x,a=0,b=1:np.clip(x,a,b)
def sm(a,b,x):
 t=clamp((x-F(a))/F(b-a));return t*t*(F(3)-F(2)*t)
def mix(a,b,t):return a*(1-t)+b*t
def norm(v):return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),F(1e-30))
def dx(a):
 x=np.arange(a.shape[1]);i=np.minimum(x//2*2,a.shape[1]-2);return a[:,i+1]-a[:,i]
def dy(a):
 y=np.arange(a.shape[0]);i=np.minimum(y//2*2,a.shape[0]-2);return a[i+1]-a[i]
def perturb(n,p,h):
 px,py=dx(p),dy(p);hx,hy=dx(h),dy(h);c=np.cross(py,n);grad=hx[...,None]*c+hy[...,None]*np.cross(n,px);det=np.sum(px*c,axis=-1);return norm(abs(det)[...,None]*n-np.where(det<0,-1,1)[...,None]*grad)
def limit(n,c):
 co=clamp(np.sum(n*c,axis=-1),-1,1);tan=c-n*co[...,None];le=np.linalg.norm(tan,axis=-1)
 b=norm(n*F(.9271838545667874)+tan/np.maximum(le[...,None],F(1e-30))*F(.3746065934159120));return np.where((co>=F(.9271838545667874))[...,None],c,np.where((le<F(.00001))[...,None],n,b))
def noise(xz,scale,off=(0,0)):return f.noise32(xz*F(scale)+np.array(off,dtype=F))
def mipmaps():
 a=np.asarray(Image.open('/tmp/material-cpu/soil.png').convert('RGBA'));out=[a[:,:,:3].astype(F)/255]
 while a.shape[0]>1:
  h,w=a.shape[:2];a=np.floor(a.astype(float).reshape(h//2,2,w//2,2,4).mean((1,3))+.5).astype(np.uint8);out.append(a[:,:,:3].astype(F)/255)
 return out
MIPS=mipmaps()
def texlevel(uv,a):
 h,w=a.shape[:2];xy=uv*np.array([w,h],dtype=F)-F(.5);base=np.floor(xy).astype(np.int64);frac=xy-base
 x=base[...,0]%w;y=base[...,1]%h;u=frac[...,0,None];v=frac[...,1,None]
 return mix(mix(a[y,x],a[y,(x+1)%w],u),mix(a[(y+1)%h,x],a[(y+1)%h,(x+1)%w],u),v).astype(F)
def texture(uv):
 rho=np.maximum(np.linalg.norm(dx(uv),axis=-1),np.linalg.norm(dy(uv),axis=-1))*F(256)
 lod=clamp(np.log2(np.maximum(rho,F(1e-30))),0,8);lo=np.floor(lod).astype(int);hi=np.minimum(lo+1,8);frac=lod-lo
 A=np.zeros(uv.shape[:-1]+(3,),dtype=F);B=np.zeros_like(A)
 for k,a in enumerate(MIPS):
  t=texlevel(uv,a);A=np.where((lo==k)[...,None],t,A);B=np.where((hi==k)[...,None],t,B)
 return mix(A,B,frac[...,None]).astype(F),lod
r,w=f.capture(Path('/tmp/diagnostic'));ir,old=f.capture(Path('/tmp/old-diagnostic'));groups=[]
for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 ds=[]
 for mode in ['world-x','world-y','world-z']:
  rgb=w[pose,mode][:,:,:3].astype(np.int64);code=rgb[:,:,0]*65536+rgb[:,:,1]*256+rgb[:,:,2];ds.append(((-128 if mode=='world-y' else -32768)+(code-1)*(1/4096 if mode=='world-y' else 1/16)).astype(F))
 p=np.stack(ds,-1);world=p[...,[0,2]];n=np.load('/tmp/mesh-cpu/'+pose+'-nominal-normals.npy').astype(F);n=np.where(np.isnan(n),np.array([0,1,0],dtype=F),n)
 v=next(v for v in r['views'] if v['pose']['name']==pose);cam=np.array([v['lastFrame']['cameraPosition'][k] for k in ['x','y','z']],dtype=F);dist=np.linalg.norm(p-cam,axis=-1);slope=1-clamp(n[...,1]);slopeR=sm(.025,.58,slope)
 broad=noise(world,.035);medium=noise(world,.13,(17,-9));grain=noise(world,.55,(-31,23));macro=noise(world,.018,(5,-11));meso=noise(world,.082,(-13,7));detail=noise(world,.29,(29,-17));elev=sm(-1,34,p[...,1]);nearDetail=1-sm(72,250,dist)
 hc=noise(world,.19,(11.7,-7.3));hm=noise(world,.47,(-23.1,31.9));hf=noise(world,1.13,(47.2,-19.6));height=(hc-.5)*.42+(hm-.5)*.21+(hf-.5)*.085+(noise(world,2.35,(91.7,-64.2))-.5)*.032*nearDetail
 fw=lambda a:abs(dx(a))+abs(dy(a))
 footprint=np.maximum.reduce([np.linalg.norm(fw(world*F(z)),axis=-1) for z in [.19,.47,1.13]])
 env=(1-sm(.72,1.45,footprint))*(1-sm(105,285,dist))*mix(F(.72),F(1),sm(.04,.58,slope))
 sn=norm(mix(n,limit(n,perturb(n,p,height)),env[...,None]))
 low=(1-sm(5,24,p[...,1]))*(1-sm(.10,.42,slope));rise=sm(3,30,p[...,1])*(1-sm(.34,.66,slope));ex=clamp(sm(.18,.62,slope)*.82);tot=np.maximum(low+rise+ex,F(.00001));low/=tot;rise/=tot;ex/=tot
 lowc=np.array([.27,.30,.18],dtype=F);risec=np.array([.34,.32,.20],dtype=F);exc=np.array([.29,.28,.25],dtype=F);pal=low[...,None]*lowc+rise[...,None]*risec+ex[...,None]*exc
 tw=abs(sn)**4;tw/=np.maximum(tw.sum(-1,keepdims=True),F(1e-30));tx=p[...,[2,1]]*F(.115);ty=p[...,[0,2]]*F(.115);tz=p[...,[0,1]]*F(.115)
 tc=f.noise32(tx+np.array([13.1,-7.7],dtype=F))*tw[...,0]+f.noise32(ty+np.array([-19.3,11.9],dtype=F))*tw[...,1]+f.noise32(tz+np.array([31.7,23.5],dtype=F))*tw[...,2]
 tf=f.noise32(tx*F(3.35)+np.array([-41.2,17.4],dtype=F))*tw[...,0]+f.noise32(ty*F(3.35)+np.array([29.6,-37.1],dtype=F))*tw[...,1]+f.noise32(tz*F(3.35)+np.array([7.8,43.6],dtype=F))*tw[...,2]
 tm=f.noise32(tx*F(9.7)+np.array([73.4,-51.2],dtype=F))*tw[...,0]+f.noise32(ty*F(9.7)+np.array([-67.8,89.1],dtype=F))*tw[...,1]+f.noise32(tz*F(9.7)+np.array([101.3,37.6],dtype=F))*tw[...,2]
 near=1-sm(55,220,dist);tri=clamp(tc*.56+tf*.31+tm*.13*near);variation=clamp(broad*.24+medium*.16+grain*.04+macro*.08+tri*.48);rock=clamp(sm(.16,.68,slope)*.72+elev*.10);shelter=clamp((1-rock)*(.58+.42*(1-slopeR))*(.78+.22*variation));soil=mix(lowc,risec,elev[...,None]);weather=clamp(noise(world,.061,(57,-83))*.52+tc*.30+tf*.18);frac=clamp(abs(tf-tc)*1.75+abs(tm-.5)*.38*near)
 er=mix(np.array([.175,.185,.178],dtype=F),np.array([.355,.335,.285],dtype=F),weather[...,None])*mix(F(.82),F(1.13),frac[...,None]);gs=mix(soil,np.array([.285,.255,.165],dtype=F),(tc*.30)[...,None]);gs=mix(gs,np.array([.205,.235,.135],dtype=F),(shelter*(1-weather)*.22)[...,None]);pal=mix(pal,gs,(shelter*.46)[...,None]);pal=mix(pal,er,(rock*(.62+.20*frac))[...,None]);pal*=mix(F(.89),F(1.11),variation[...,None]);pal*=mix(F(.94),F(1.06),(tm*near)[...,None])
 wet=clamp((1-elev)*.12+macro*.06,0,.18);region=clamp(macro*.48+meso*.34+medium*.18);coverage=(1-sm(.16,.59,slope))*(1-sm(.22,.66,rock))*mix(F(.88),F(1),sm(.10,.92,region))*mix(F(.94),F(1),shelter)
 # All selected coast scalars exceed595m; coast factors are exactly saturated to1.
 horizontal=np.linalg.norm(world,axis=-1);radial=F(420000)*np.arctan2(horizontal,p[...,1]+F(420000));uv=world*(radial/np.maximum(horizontal,F(.0001)))[...,None]*F(.28);tex,lod=texture(uv)
 reference=tex**F(2.2)*F(.75);moist=clamp(wet*.70+(1-elev)*.18+(macro-.5)*.12);tint=mix(np.array([1.14,1.06,.90],dtype=F),np.array([.85,.92,1.08],dtype=F),moist[...,None]);tint=mix(tint,np.array([1.10,1.12,1.08],dtype=F),(elev*.33)[...,None]);actual=reference*tint*mix(F(.91),F(1.09),region[...,None]);P=mix(pal,mix(pal,actual,F(.98)),coverage[...,None])
 yy=np.repeat(np.arange(y0,y1+1),27);xx=np.tile(np.r_[128:137,260:269,392:401],y1-y0+1)
 code=clamp(P[yy,xx]*F(1.12))**F(1/2.2)*F(255);obs=old[pose,'identity-incoming-color'][yy,xx,:3].astype(float);error=abs(code-obs)
 factors={}
 for name,pred,mode,ch in [('variation',variation,'identity-brightness-factors-raw',0),('triFine',tf,'identity-brightness-factors-raw',1),('near',near,'identity-brightness-factors-raw',2),('slopeResponse',slopeR,'identity-landform-factors-raw',1),('rock',rock,'identity-landform-factors-raw',2)]:
  o=old[pose,mode][yy,xx,ch].astype(float);err=abs(pred[yy,xx]*255-o);factors[name]={'nominalCodeErrorMedianMax':[float(np.median(err)),float(err.max())],'outsideOneCodeCount':int((err>1).sum())}
 groups.append({'pose':pose,'samples':len(xx),'incomingNominalDisplayCodeErrorMedianMaxByChannel':np.stack([np.median(error,axis=0),error.max(axis=0)]).tolist(),'incomingAnyChannelBeyondOneCodeCount':int(np.any(error>1,axis=1).sum()),'mipLevelRange':[float(lod[yy,xx].min()),float(lod[yy,xx].max())],'factorChecks':factors})
 np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',pixels=np.stack([xx,yy],-1),P=P[yy,xx],observedP=(obs/255)**2.2/1.12,variation=variation[yy,xx],triFine=tf[yy,xx],triCoarse=tc[yy,xx],triMicro=tm[yy,xx],texture=tex[yy,xx],lod=lod[yy,xx])
out={'schema':'H_EARTH_NOMINAL_FULL_INCOMING_SOIL_CPU_SCREEN_v1','result':'NOMINAL_REPLAY_NOT_QUALIFIED' if any(x['incomingAnyChannelBeyondOneCodeCount'] for x in groups) else 'NOMINAL_REPLAY_COMPATIBLE_NOT_CERTIFIED','groups':groups,'textureSha256':hashlib.sha256(Path('/tmp/material-cpu/soil.png').read_bytes()).hexdigest(),'implementation':'Source Float32 procedural fields; exact-source nominal barycentric normals supplied by parent; captured XYZ centers and visible 2x2 neighbor derivatives; RGBA8 box-average rounded mip generation; repeat bilinear/trilinear sampler with max-gradient LOD.','limits':['One nominal model; no parameter or mip-offset tuning.','Quantized XYZ centers alone produce higher-frequency noise error; source field coordinate intervals are handled separately in source-fields.py.','Visible neighboring values may differ from GPU helper-lane values at triangle boundaries.','Nominal plane-selected normals retain ambiguous geometry uncertainty and are not certified exact per-fragment normals.','Browser mip rounding, implicit LOD, image upload orientation/color conversion and shader operation contraction are not independently reproduced.','No inference that this mismatch invalidates the source or capture. It rejects this nominal emulator as sufficient appearance evidence.','P(c,f0) and transported blend are not evaluated until baseline replay is qualified.','No GPU or product mutation.']}
Path('/tmp/material-cpu/full-p-result.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
