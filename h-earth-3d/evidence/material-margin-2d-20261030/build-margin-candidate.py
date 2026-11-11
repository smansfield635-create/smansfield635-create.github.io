from pathlib import Path
import numpy as np,base64,json,hashlib
r=Path('/workspace/scratch/a96b8ab32ba2');source=r/'repo/showroom/globe/h-earth/render';out=r/'margin-renderer-candidate';e=r/'boundary-reconciliation/region-core';p=np.load(e/'adaptive-habitat.npz');a=np.load(e/'overlay-gradient-margin.npz');xs=np.flatnonzero((p['x']>=144)&(p['x']<=188));zs=np.flatnonzero((p['z']>=-282)&(p['z']<=-250));rg=a['rg8'][zs[:,None],xs[None,:]];assert not rg[0].any() and not rg[-1].any() and not rg[:,0].any() and not rg[:,-1].any()
encode=lambda b:base64.b64encode(b).decode()
coast=lambda name:np.fromfile(r/'boundary-reconciliation/habitat-core-input'/name,dtype='u1').reshape(192,576)[:,384:].copy().tobytes()
native=coast('native-atlas.bin');baseline=coast('sigma2-atlas.bin');payload=rg.tobytes()
module='''/** Source-bound comparison candidate. Numeric qualification only; not visual acceptance.
 * Incoming material/texture, roots, roughness and current presentation are retained.
 * Never enable mipmaps: the qualified core-support proof requires linear level0.
 */
const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const NATIVE=decode('__NATIVE__');
const BASELINE=decode('__BASELINE__');
const CORRECTION=decode('__CORRECTION__');
export function buildMaterialMarginField(habitat,presentation){
 const bounds=[-448,-283,448,-93];
 let match=habitat?.size===192&&habitat?.width===576&&habitat?.height===192&&habitat?.pixels instanceof Uint8Array&&habitat.pixels.length===110592&&presentation?.pixels instanceof Uint8Array&&presentation.pixels.length===110592&&Array.isArray(habitat?.coastal?.bounds)&&habitat.coastal.bounds.every((v,i)=>v===bounds[i])&&habitat.coastal.bounds.length===4;
 if(match)for(let z=0;z<192&&match;z++)for(let x=0;x<192;x++){const local=z*192+x,index=z*576+384+x;if(habitat.pixels[index]!==NATIVE[local]||presentation.pixels[index]!==BASELINE[local]){match=false;break;}}
 return {pixels:match?new Uint8Array(CORRECTION):new Uint8Array(2),width:match?89:1,height:match?65:1,receipt:{schema:'H_EARTH_MATERIAL_MARGIN_FIELD_v1',status:match?'SOURCE_MATCHED_COMPARISON_CANDIDATE':'INACTIVE_SOURCE_MISMATCH',sourceNativeSha256:'__NSHA__',sourceBaselineSha256:'__BSHA__',correctionSha256:'__CSHA__',worldBounds:[144,-282,188,-250],stepMeters:.5,encoding:'RG8_SIGNED_MAGNITUDE_SCALE1024',filter:'LINEAR_LEVEL_ZERO_NO_MIPMAPS',protectedCoreDefinition:'PREDECLARED_BILINEAR_SOURCE_WIDTH_FIELDS',rootAdmissionChanged:false,nativeRoughnessChanged:false,visualAcceptance:false,scope:'ONE_VERIFIED_COASTAL_WINDOW_NOT_GLOBAL_REPAIR',uploadedBytes:match?CORRECTION.byteLength:2,textureUploadCount:1,perFrameUploadBytes:0}};
}
export const MATERIAL_MARGIN_GLSL=`
uniform sampler2D uMaterialMarginCorrection;
float materialMarginCorrection(vec2 world){
 vec2 q=(world-vec2(144.0,-282.0))/vec2(44.0,32.0);
 if(any(lessThan(q,vec2(0.0)))||any(greaterThan(q,vec2(1.0))))return 0.0;
 vec2 uv=(q*vec2(88.0,64.0)+.5)/vec2(89.0,65.0);
 vec2 encoded=texture(uMaterialMarginCorrection,uv).rg;
 return (encoded.r-encoded.g)*(255.0/1024.0);
}
`;
'''
for key,value in [('NATIVE',encode(native)),('BASELINE',encode(baseline)),('CORRECTION',encode(payload)),('NSHA',hashlib.sha256(native).hexdigest()),('BSHA',hashlib.sha256(baseline).hexdigest()),('CSHA',hashlib.sha256(payload).hexdigest())]:module=module.replace('__'+key+'__',value)
(out/'material-margin-field.v1.js').write_text(module)
s=(source/'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').read_text()
def replace(a,b):
 global s
 assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
needle="import {buildHabitatMaterialPresentation,HABITAT_MATERIAL_PROTECTION_GLSL} from './habitat-material-presentation.v1.js';"
replace(needle,needle+"\nimport {buildMaterialMarginField,MATERIAL_MARGIN_GLSL} from './material-margin-field.v1.js';")
replace('${HABITAT_MATERIAL_PROTECTION_GLSL}','${HABITAT_MATERIAL_PROTECTION_GLSL}\n${MATERIAL_MARGIN_GLSL}')
replace('texture(uHabitatMaterialPresentation,coastalUv).r*habitatEdgeWeight','(texture(uHabitatMaterialPresentation,coastalUv).r+materialMarginCorrection(vWorldPosition.xz))*habitatEdgeWeight')
needle="      gl.uniform1i(gl.getUniformLocation(resources.geometryProgram,'uHabitatMaterialPresentation'),12);"
replace(needle,needle+'''
      const marginField=buildMaterialMarginField(installedHabitat,materialHabitat);
      const marginTexture=createTexture();gl.activeTexture(gl.TEXTURE0+15);gl.bindTexture(gl.TEXTURE_2D,marginTexture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RG8,marginField.width,marginField.height,0,gl.RG,gl.UNSIGNED_BYTE,marginField.pixels);gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      resources.materialMarginCorrection={texture:marginTexture,receipt:marginField.receipt};
      gl.uniform1i(gl.getUniformLocation(resources.geometryProgram,'uMaterialMarginCorrection'),15);
''')
needle='    if(resources.habitatMaterialPresentation){gl.activeTexture(gl.TEXTURE0+12);gl.bindTexture(gl.TEXTURE_2D,resources.habitatMaterialPresentation.texture);gl.activeTexture(gl.TEXTURE0);}'
replace(needle,needle+'\n    if(resources.materialMarginCorrection){gl.activeTexture(gl.TEXTURE0+15);gl.bindTexture(gl.TEXTURE_2D,resources.materialMarginCorrection.texture);gl.activeTexture(gl.TEXTURE0);}')
needle='      terrainSeamPresentation:resources.terrainSeamPresentation??null,'
replace(needle,'      materialMarginCorrection:resources.materialMarginCorrection?.receipt??null,\n'+needle)
needle='finally{if(resources.habitatMaterialPresentation)'
replace(needle,'finally{if(resources.materialMarginCorrection){gl.deleteTexture(resources.materialMarginCorrection.texture);resources.materialMarginCorrection=null;}if(resources.habitatMaterialPresentation)')
(out/'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').write_text(s)
route=(source.parent/'vegetation-prototype/route.js').read_text();assert 'gen2987-habitat-material-blend-v1' in route
(out/'route.js').write_text(route.replace('gen2987-habitat-material-blend-v1','gen2992-material-margin-local-candidate'))
(out/'metadata.json').write_text(json.dumps({'sourceProofSha256':hashlib.sha256((e/'overlay-gradient-margin.npz').read_bytes()).hexdigest(),'correctionBytes':len(payload),'sourceMismatchFallback':'ZERO_CORRECTION','files':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in out.glob('*.js')}},indent=2)+'\n')
print('Prepared full-file candidate; correction bytes',len(payload))
