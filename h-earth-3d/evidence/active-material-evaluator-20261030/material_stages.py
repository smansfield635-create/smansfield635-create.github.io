"""Frozen H-Earth material algebra, CPU binary64 parent-plane derivative model.

Coefficients are relative to P=materialMarginSubstrate immediately BEFORE identity.
P includes the unknown GPU-filtered soil sample. This module never supplies P,
lighting, raster ownership, or a hardware-equivalence claim. No runtime mutation.
All active texture/uniform inputs are explicit; inactive branches have exact zero
influence. Unsupported roles must be rejected by the source-bound caller.
"""
import math
import numpy as np

class Unresolved(ValueError): pass

def vec(value, n, name):
    a=np.asarray(value,dtype=float)
    if a.shape!=(n,) or not np.isfinite(a).all(): raise Unresolved('INVALID_'+name)
    return a

def clamp(x,a=0.,b=1.): return np.clip(x,a,b)
def smooth(a,b,x):
    t=clamp((np.asarray(x)-a)/(b-a));return t*t*(3-2*t)
def mix(a,b,t):return np.asarray(a)*(1-t)+np.asarray(b)*t
def norm(v):
    length=np.linalg.norm(v)
    if not np.isfinite(length) or length<1e-20:raise Unresolved('ZERO_NORMAL')
    return np.asarray(v)/length

def hash21(p):
    p=np.mod(np.asarray(p)*[123.34,456.21],1.);p=p+np.dot(p,p+45.32)
    return float(np.mod(p[0]*p[1],1.))
def noise2(p):
    p=np.asarray(p);i=np.floor(p);f=p-i;f=f*f*(3-2*f)
    return float(mix(mix(hash21(i),hash21(i+[1,0]),f[0]),mix(hash21(i+[0,1]),hash21(i+[1,1]),f[0]),f[1]))
def derivative(values,lane):
    a=np.asarray(values);ix=lane%2;iy=lane//2
    return a[iy*2+1]-a[iy*2],a[2+ix]-a[ix]
def fwidth(values,lane):
    dx,dy=derivative(values,lane);return np.abs(dx)+np.abs(dy)
def stable_wave(phase,quad_phase,lane):
    retained=1-smooth(.72,1.65,max(float(fwidth(quad_phase,lane)),.00001))
    return float(mix(.5,.5+.5*math.sin(phase),retained))
def ring(point,center,inner,outer,feather):
    r=np.linalg.norm(point-center)
    return float(clamp(smooth(inner-feather,inner+feather,r)*(1-smooth(outer-feather,outer+feather,r))))
def protection(world):
    x,z=world;grove=1-smooth(22,42,np.linalg.norm(world-[-139.40268,-210.74617]))
    oasis=[max(-18-x,0,x-34),max(-204-z,0,z+131)]
    estate=[max(18-x,0,x-132),max(-210-z,0,z+125)]
    t=clamp((z-x+192)/96);route=np.linalg.norm(world-[48-48*t,-144+48*t])
    return float(smooth(0,12,np.linalg.norm(oasis))*smooth(0,10,np.linalg.norm(estate))*smooth(4,9,route)*(1-grove))
def hillside_weight(world):
    x,z=world
    divide=-208 if x<=-52 else mix(-208,-226,(x+52)/70) if x<=18 else mix(-226,-235,(x-18)/68) if x<=86 else mix(-235,-224,(x-86)/62) if x<=148 else -224
    return float(smooth(-48,-24,z-divide))
def foothill_hash(x,z):
    mask=0xffffffff
    h=(((int(x)&mask)^0x51ed270b)*1597334677)^(((int(z)&mask)^0x68bc21eb)*3812015801)^(118*747796405);h&=mask
    h=((h^(h>>16))*2246822519)&mask;h=((h^(h>>13))*3266489917)&mask
    return (h^(h>>16))&mask

def foothill_noise(p):
    p=np.asarray(p)/23;i=np.floor(p);f=p-i;f=f*f*(3-2*f)
    at=lambda dx,dz:foothill_hash(i[0]+dx,i[1]+dz)
    return float(mix(mix(at(0,0),at(1,0),f[0]),mix(at(0,1),at(1,1),f[0]),f[1])/4294967296.)
def foothill_dry(position,radius):
    x,y,z=position
    if x < -114 or x>56 or z < -269 or z > -158:return 0.
    horizontal=np.linalg.norm([x,z]);radial=math.atan2(horizontal,y+radius)*radius
    p=np.array([x,z])*(radial/horizontal if horizontal>.00001 else 1)
    a,b=p
    if a<=-110 or a>=52 or b<=-265 or b>=-162:return 0.
    elevation=(x*x+z*z+y*(2*radius+y))/(np.linalg.norm([x,y+radius,z])+radius)
    edge=smooth(0,4,min(a+110,52-a,b+265,-162-b))*(1-smooth(47,52,a))
    exclusion=np.maximum(np.maximum([18-a,-210-b],0),p-[132,-125])
    boundary=edge*smooth(0,5,np.linalg.norm(exclusion));warp=.08*(foothill_noise(p)-.5)*2
    candidates=[]
    for h in [[-52,-208,58,46,5.21807928243652,27.152534103835933],[18,-226,42,39,9.29552880168194,32.988509872346185]]:
        r=np.linalg.norm((p-h[:2])/h[2:4]);w=(1-smooth(.65,1,r+warp))*boundary;t=clamp((elevation-h[4])/(h[5]-h[4]));mid=smooth(.55,.85,t);top=smooth(.85,1,t)
        candidates.append([w*(24*(1-mid)+8*mid*(1-top)+1.5*top),w*smooth(.5,.94,t)])
    return float(sum(a*b for a,b in candidates)/max(sum(a for a,b in candidates),.00001))
def coherence_noise(p):
    p=np.asarray(p);c=np.floor(p);f=p-c;f=f*f*(3-2*f)
    at=lambda d:float(np.mod(math.sin(np.dot(c+d,[127.1,311.7]))*43758.5453,1))
    return float(mix(mix(at([0,0]),at([1,0]),f[0]),mix(at([0,1]),at([1,1]),f[0]),f[1]))
def cover_palette(position,dry):
    x,z=position;p=np.array([.8*x-.6*z,.6*x+.8*z])
    patch=coherence_noise(p/13);d=coherence_noise(p/29+[7,-11])
    forest=mix([.055,.105,.028],[.125,.185,.048],patch);olive=mix([.12,.15,.035],[.24,.225,.075],patch)
    palette=mix(forest,olive,smooth(.35,.8,d));dry_palette=mix([.24,.225,.075],[.29,.235,.12],smooth(.35,.95,dry))
    return mix(palette,dry_palette,dry*.88)

def common_fields(point,normal,eye,quad,lane):
    world=point[[0,2]];geometric=norm(normal);slope=1-clamp(geometric[1]);distance=np.linalg.norm(point-eye)
    near_detail=1-smooth(72,250,distance)
    def relief(p):
        w=p[[0,2]];near=1-smooth(72,250,np.linalg.norm(p-eye))
        return (noise2(w*.19+[11.7,-7.3])-.5)*.42+(noise2(w*.47+[-23.1,31.9])-.5)*.21+(noise2(w*1.13+[47.2,-19.6])-.5)*.085+(noise2(w*2.35+[91.7,-64.2])-.5)*.032*near
    dx,dy=derivative(quad,lane);rx,ry=derivative([relief(p) for p in quad],lane)
    gradient=rx*np.cross(dy,geometric)+ry*np.cross(geometric,dx);det=np.dot(dx,np.cross(dy,geometric))
    raw=norm(abs(det)*geometric-(-1 if det<0 else 1)*gradient)
    correspondence=clamp(np.dot(geometric,raw),-1,1)
    if correspondence>=.9271838545667874:bounded=raw
    else:
        tangent=raw-geometric*correspondence;length=np.linalg.norm(tangent)
        bounded=geometric if length<.00001 else norm(geometric*.9271838545667874+tangent/length*.3746065934159120)
    footprint=max(np.linalg.norm(fwidth(quad[:,[0,2]]*k,lane)) for k in [.19,.47,1.13])
    envelope=clamp((1-smooth(105,285,distance))*mix(.72,1,smooth(.04,.58,slope))*(1-smooth(.72,1.45,footprint)))
    shading=norm(mix(geometric,bounded,envelope));tw=abs(shading)**4;tw/=max(sum(tw),.00001)
    tx=point[[2,1]]*.115;ty=world*.115;tz=point[[0,1]]*.115
    tri_coarse=sum(noise2(v+o)*w for v,o,w in zip([tx,ty,tz],[[13.1,-7.7],[-19.3,11.9],[31.7,23.5]],tw))
    tri_fine=sum(noise2(v*3.35+o)*w for v,o,w in zip([tx,ty,tz],[[-41.2,17.4],[29.6,-37.1],[7.8,43.6]],tw))
    tri_micro=sum(noise2(v*9.7+o)*w for v,o,w in zip([tx,ty,tz],[[73.4,-51.2],[-67.8,89.1],[101.3,37.6]],tw))
    near_material=1-smooth(55,220,distance)
    broad=noise2(world*.035);medium=noise2(world*.13+[17,-9]);grain=noise2(world*.55+[-31,23]);macro=noise2(world*.018+[5,-11]);meso=noise2(world*.082+[-13,7]);detail=noise2(world*.29+[29,-17])
    tri_material=clamp(tri_coarse*.56+tri_fine*.31+tri_micro*.13*near_material)
    variation=clamp(broad*.24+medium*.16+grain*.04+macro*.08+tri_material*.48)
    elevation=smooth(-1,34,point[1]);slope_response=smooth(.025,.58,slope);rock=clamp(smooth(.16,.68,slope)*.72+elevation*.10)
    wetness=clamp((1-elevation)*.12+macro*.06,0,.18)
    return dict(slope=float(slope),slopeResponse=float(slope_response),distance=float(distance),nearMaterial=float(near_material),triFine=float(tri_fine),materialVariation=float(variation),rockExposure=float(rock),elevationMix=float(elevation),terrainWetness=float(wetness),broad=broad,medium=medium,grain=grain,macroField=macro,mesoField=meso,detailField=detail,shadingNormalBeforeSoil=shading.tolist(),microEnvelope=float(envelope))


def evaluate_material(inputs,sample_texture):
    """Return ordered RGB affine coefficients plus per-stage trace.

    Required inputs listed in module README; texture callback supplies normalized
    resident texels. Exact captured CPU model, not GPU float/derivative equality.
    Raises Unresolved for absent/invalid inputs; no missing stage becomes identity.
    """
    required=['world','normal','eye','quadWorld','pixelBottomLeft','coastDistance','contactDistance','farNormalFlip','atlasDeltaRGB','marginDelta','habitatEnabled','floorFootprints','planetRadius']
    missing=[k for k in required if k not in inputs]
    if missing:raise Unresolved('MISSING_INPUT:'+','.join(missing))
    p=vec(inputs['world'],3,'WORLD');n=vec(inputs['normal'],3,'NORMAL');eye=vec(inputs['eye'],3,'EYE');quad=np.asarray(inputs['quadWorld'],dtype=float)
    if quad.shape!=(4,3) or not np.isfinite(quad).all():raise Unresolved('INVALID_QUAD')
    pixel=vec(inputs['pixelBottomLeft'],2,'PIXEL')
    if not np.equal(pixel,np.floor(pixel)).all():raise Unresolved('INVALID_PIXEL')
    lane=int(pixel[0]%2+2*(pixel[1]%2))
    if not np.array_equal(p,quad[lane]):raise Unresolved('PIXEL_LANE_WORLD_MISMATCH')
    world=p[[0,2]];x,z=world
    if type(inputs['farNormalFlip']) is not bool or type(inputs['habitatEnabled']) is not bool:raise Unresolved('BOOLEAN_UNIFORM_REQUIRED')
    if inputs['farNormalFlip'] and n[1]<0:n=-n
    coast=float(inputs['coastDistance']);contact=float(inputs['contactDistance']);radius=float(inputs['planetRadius'])
    if not np.isfinite([coast,contact,radius]).all() or radius<=0:raise Unresolved('INVALID_GEOMETRY_UNIFORM')
    atlas=vec(inputs['atlasDeltaRGB'],3,'ATLAS');margin=vec(inputs['marginDelta'],4,'MARGIN')
    fields=common_fields(p,n,eye,quad,lane);slope=fields['slope'];sr=fields['slopeResponse'];broad=fields['broad'];grain=fields['grain'];macro=fields['macroField'];meso=fields['mesoField'];detail=fields['detailField'];rock=fields['rockExposure'];variation=fields['materialVariation'];wet=fields['terrainWetness'];tri=fields['triFine'];near=fields['nearMaterial']
    A=np.ones(3);B=np.zeros(3);trace=[]
    def stage(name,gain,bias,**extra):
        nonlocal A,B
        gain=np.broadcast_to(gain,(3,)).astype(float);bias=np.broadcast_to(bias,(3,)).astype(float)
        if not np.isfinite([gain,bias]).all():raise Unresolved('NONFINITE_STAGE:'+name)
        A=A*gain;B=B*gain+bias;trace.append(dict(id=name,gain=gain.tolist(),bias=bias.tolist(),A=A.tolist(),B=B.tolist(),**extra))
    def blend(name,target,weight,**extra):
        if not np.isfinite(weight) or weight < -1e-12 or weight >1+1e-12:raise Unresolved('INVALID_MASK:'+name)
        stage(name,1-weight,np.asarray(target)*weight,weight=float(weight),**extra)
    def tex(name,uv):
        if not callable(sample_texture):raise Unresolved('TEXTURE_SAMPLER_REQUIRED:'+name)
        value=np.asarray(sample_texture(name,np.asarray(uv)),dtype=float).reshape(-1)
        if not len(value) or not np.isfinite(value).all() or value.min()<0 or value.max()>1:raise Unresolved('INVALID_TEXEL:'+name)
        return float(value[0])
    # Identity preserves P while its procedural target remains independent of P.
    inland=smooth(28,66,max(0,coast));identity_noise=noise2(world*.023+[41,-26]);basin=np.linalg.norm((world-[2,-179])/[80,72])
    sheltered=1-smooth(.58,1.36,basin+(identity_noise-.5)*.34);fertile=smooth(.42,.68,macro*.47+meso*.38+detail*.15)
    moist=clamp(sheltered*.70+(1-sr)*fertile*.43);upper=smooth(8,30,p[1])*(1-moist*.74);mineral=clamp(rock*.78+smooth(.25,.58,slope)*.45);coastal=1-smooth(48,112,max(0,coast))
    target=mix([.390,.248,.148],[.520,.440,.270],coastal*.74);target=mix(target,[.300,.235,.155],fertile*.83);target=mix(target,[.235,.188,.130],moist*.88);target=mix(target,[.480,.315,.140],upper*.82);target=mix(target,[.355,.333,.305],mineral*.92);target*=.86+.22*variation+.06*tri*near
    grove=1-smooth(22,42,np.linalg.norm(world-[-139.40268,-210.74617]));contrast=clamp(.48+.10*abs(fertile-.5)*2+.08*mineral,0,.66);identity_weight=inland*(1-grove)*contrast
    blend('environmental-identity',target,identity_weight)
    gx=(.8*x-.6*z)*.018+5+.65*(broad-.5);gz=(.6*x+.8*z)*.018-11+.65*(macro-.5)
    patch=smooth(.20,.66,noise2([gx,gz])*.78+meso*.22);suit=smooth(28,72,max(0,coast))*(1-smooth(.12,.42,slope))*(1-smooth(.18,.58,rock));weight=.88*patch*(1-.25*smooth(.30,.85,patch))*suit*protection(world)
    moisture=clamp(.20+.55*moist+.25*wet);dry=clamp((1-moisture)*(.18+.28*meso)+sr*.20,0,.65)
    tone=mix([.110,.118,.075],[.075,.090,.055],moisture);tone=mix(tone,[.175,.150,.095],dry)*(.88+.24*variation)
    blend('groundcover',tone,weight)
    stage('corrected-atlas',1,atlas)
    # Margin is additive relative to the ORIGINAL saved substrate, not current A*P+B.
    A=A+margin[0];B=B+margin[1:];trace.append(dict(id='material-margin',addA=[float(margin[0])]*3,addB=margin[1:].tolist(),A=A.tolist(),B=B.tolist()))
    # Manor derivatives use the same declared parent-plane 2x2 convention.
    def manor_phases(q):
        w=q[[0,2]];r=np.linalg.norm(w-[80,-172]);g=noise2(w*.34+[41,-23]);return [r*.83+q[1]*.46+noise2(w*.19)*4,r*.44+q[1]*.72+g*2.2,r*.29+w[0]*.12-w[1]*.09+q[1]*.37+g*1.4]
    phases=np.array([manor_phases(q) for q in quad]);center=manor_phases(p)
    pattern=stable_wave(center[0],phases[:,0],lane);terrace=stable_wave(center[1],phases[:,1],lane);chromatic=stable_wave(center[2],phases[:,2],lane)
    terrace_quad=[stable_wave(phases[j,1],phases[:,1],j) for j in range(4)]
    env=1-smooth(7,30,np.linalg.norm(world-[80,-172]));edge=ring(world,np.array([80,-172]),10.5,21,2.2);outer=ring(world,np.array([80,-172]),21.5,31.5,2.4);inner=ring(world,np.array([80,-172]),4.5,13.5,1.8)
    aa=max(float(fwidth(terrace_quad,lane))*1.5,.012);terrace_contact=(1-smooth(.080-aa,.080+aa,abs(terrace-.5)))*env;manor_contact=max(edge,outer*.90,inner*.75,terrace_contact*.70);gran=noise2(world*.34+[41,-23])
    stone=mix([.35,.21,.055],[.72,.51,.17],pattern*.72+gran*.28)
    blend('manor-stone',stone,env*(.42+.22*pattern));stage('manor-contact',mix(1,.54,manor_contact*(.36+.42*pattern)),0);stage('manor-terrace',mix(1,mix(.88,1.12,terrace*.34),env),0);stage('manor-additive',1,np.array([.205,.125,.020])*manor_contact*(.42+.58*gran)+np.array([.062,.016,-.022])*(chromatic-.5)*env)
    ravine=math.exp(-((x-40)/18)**2)*(1-smooth(-292,-210,z))*smooth(.10,.58,slope)*smooth(0,12,min(x+120,96-x,z+376,-224-z));earth=noise2(world*.12+[8,-19])
    stage('site-b',mix(np.ones(3),mix([.93,.91,.88],[1.04,1.02,.98],earth),ravine*.38),0)
    hillside=hillside_weight(world);steep=hillside*smooth(.012,.065,slope)*(1-smooth(10,38,contact))*smooth(-1,0,contact)
    blend('steep-bank',mix([.20,.17,.115],[.28,.255,.215],smooth(.08,.35,slope))*(.90+.18*grain),steep*.78)
    suitability=clamp((1-smooth(.035,.16,slope))*.72+(1-smooth(2,10,p[1]))*.28)
    sand_coverage=smooth(-1,0,contact)*(1-smooth(10,38,contact))*mix(1,suitability,smooth(4,28,coast))*(1-hillside*smooth(.012,.065,slope))
    sand=mix(mix([.42326766,.32777810,.19120169],[.49693298,.39675522,.23455058],smooth(2,14,contact)),[.57758045,.47353148,.28314874],smooth(10,24,contact))*(.965+.07*grain)
    blend('sand',sand,sand_coverage)
    uv=(world-[-18,-204])/[52,73];soil_weight=0.;soil=np.zeros(3)
    if (uv>=0).all() and (uv<=1).all():
        coverage=tex('shoreline',uv);soil_moist=1-smooth(.5,6,max(0,contact));bs=noise2(world*.37+[7.3,13.8]);broken=noise2(world*1.1+[19.7,3.2]);soil=mix([.31,.255,.17],[.20,.155,.095],soil_moist*.82)*(.88+.19*bs+.07*broken);soil_weight=coverage*(.56+.22*bs)
    blend('shoreline-root-soil',soil,soil_weight)
    litter=0.;litter_color=np.zeros(3)
    if -180<x<-24 and -380<z<-190:
        footprints=np.asarray(inputs['floorFootprints'],dtype=float)
        if footprints.size==0:footprints=np.empty((0,4))
        if footprints.ndim!=2 or footprints.shape[1]!=4 or len(footprints)>15 or not np.isfinite(footprints).all() or (footprints[:,2]<=0).any():raise Unresolved('INVALID_FLOOR_FOOTPRINTS')
        b=np.linalg.norm((world-[-125,-285])/[29,25]);c=np.linalg.norm((world-[-65,-315])/[24,22]);existing=1-smooth(.67,1.10,min(b,c)+(noise2(world*.23)-.5)*.22);canopy=0.;trunk=0.;broken=(noise2(world*.71+[17.3,-9.7])-.5)*.18
        for tree in footprints:
            r=np.linalg.norm(world-tree[:2]);canopy=max(canopy,1-smooth(.48,1.08,r/tree[2]+broken));trunk=max(trunk,1-smooth(tree[3],tree[3]+.80,r))
        litter=max(existing*.70,canopy*.50+trunk*.15);litter_color=np.array([.16,.119,.066])*(.88+.21*noise2(world*.71))
    blend('woodland-litter',litter_color,litter)
    habitat_weight=0.;habitat_color=np.zeros(3);bank_weight=0.;bank=np.zeros(3);native_coverage=0.;filtered_coverage=0.
    if inputs['habitatEnabled']:
        for key in ['habitatBounds','habitatAtlasScale','habitatHalfTexel']:
            if key not in inputs:raise Unresolved('MISSING_INPUT:'+key)
        bounds=np.asarray(inputs['habitatBounds'],dtype=float);scale=vec(inputs['habitatAtlasScale'],2,'HABITAT_SCALE');half=float(inputs['habitatHalfTexel'])
        if bounds.shape!=(3,4) or not np.isfinite(bounds).all() or (bounds[:,2:]<=bounds[:,:2]).any() or not 0<half<.5 or (scale<=0).any():raise Unresolved('INVALID_HABITAT_LAYOUT')
        for panel,b in enumerate(bounds):
            uv=(world-b[:2])/(b[2:]-b[:2])
            if (uv>0).all() and (uv<1).all():
                atlas_uv=clamp(uv,half,1-half)*scale+[panel*scale[0],0];width=6 if panel==0 else 4+3*noise2(world*.07);edge=smooth(0,width,min(x-b[0],b[2]-x,z-b[1],b[3]-z))
                native_coverage=max(native_coverage,tex('habitat',atlas_uv)*edge);filtered_coverage=max(filtered_coverage,tex('habitatMaterial',atlas_uv)*edge)
        dry=max(foothill_dry(p,radius),hillside*smooth(18,42,p[1]));habitat_color=cover_palette(world,dry)*.72;habitat_weight=clamp(native_coverage+protection(world)*(filtered_coverage-native_coverage))*.68
        window=smooth(-22,-14,x)*(1-smooth(30,38,x))*smooth(-208,-200,z)*(1-smooth(-135,-127,z));bank_weight=(1-smooth(1,6,contact))*smooth(0,.8,contact)*window*.26;bank=mix([.17,.145,.105],[.24,.215,.17],noise2(world*.84))
    blend('habitat',habitat_color,habitat_weight,nativeCoverage=float(native_coverage),filteredCoverage=float(filtered_coverage))
    blend('bank-gravel',bank,bank_weight)
    return {'status':'CPU_PARENT_PLANE_AFFINE_MODEL','substrate':'PRE_IDENTITY_MATERIAL_MARGIN_SUBSTRATE','coefficients':{'A':A.tolist(),'B':B.tolist()},'fields':fields,'stages':trace,'uncertainties':(['MANOR_NESTED_DERIVATIVE_MODEL_ONLY'] if env>0 else []),'limits':['Binary64 procedural arithmetic is not certified GPU highp noise equivalence.','Parent-plane 2x2 derivatives assume the declared lane and do not certify hardware helper ownership or derivative mode.','Substrate P includes GPU soil filtering/mips and remains symbolic; final RGB and lighting are unresolved.']}
