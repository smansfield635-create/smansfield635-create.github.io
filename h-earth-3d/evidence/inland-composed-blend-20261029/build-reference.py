from pathlib import Path
import re,hashlib
p=Path('recovery/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js')
s=p.read_text();s=re.sub(r'    // H_EARTH_NATURAL_DRY_SAND_BLEND_V1_BEGIN.*?    // H_EARTH_NATURAL_DRY_SAND_BLEND_V1_END\n','',s,flags=re.S)
assert hashlib.sha256(s.encode()).hexdigest()=='a2ab977a3ea620f7bf87b3bdfb4e6a720cf7801f2ecbb670b4ac2dfccacf917d'
Path('inland/baseline.js').write_text(s)
a=s.index('    vec2 world=vWorldPosition.xz;',s.index('const FS ='));b=s.index('    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_END',a)
h=s[a:b]
h=re.sub(r'    float nearDetail=.*?    // Continuous landform regimes\.', '    // Continuous landform regimes.',h,flags=re.S)
h=re.sub(r'    float triFine=.*?    float triMaterial=', '    float triFine=0.5;\n    float triMicro=0.5;\n    float nearMaterial=0.0;\n    float triMaterial=',h,flags=re.S)
h=re.sub(r'    float terrainRoughness=.*?    float terrainWetness=', '    float terrainWetness=',h,flags=re.S)
h=re.sub(r'    terrainWetnessForLighting=.*?    if\(uClearingEnabled==1\)', '    if(uClearingEnabled==1)',h,flags=re.S)
h=re.sub(r'        vec2 worldSoilXZ=.*?        // Gen2646:', '        vec3 worldSoilReference=vec3(0.10645195702908333,0.07287885330703674,0.03416460327775737);\n        // Gen2646:',h,flags=re.S)
a=h.index('        // The existing clearing directly lights');b=h.index('    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN',a)
h=h[:a]+'      }\n    }\n'+h[b:]
h=re.sub(r'    float grain=.*?;', '    float grain=0.5;',h)
h=re.sub(r'    float detailField=.*?;', '    float detailField=0.5;',h)
h=re.sub(r'^.*if\(geologicalEarthRock\).*\n','',h,flags=re.M)
h=h.replace('if(!geologicalEarthRock){','{').replace('geologicalEarthRock?1.0:','').replace('geologicalEarthRock?0.06:\n      ','')
h=re.sub(r'//[^\n]*','',h);h=h.replace('vWorldPosition','referencePosition').replace('vCoastDistanceMeters','referenceCoast').replace('shadingNormal','referenceNormal')
h='// H_EARTH_INLAND_REFERENCE_V1_BEGIN\nvec3 inlandBroadReference(vec3 referencePosition,vec3 referenceNormal,float referenceCoast){\n  float slope=1.0-clamp(referenceNormal.y,0.0,1.0);\n'+h+'  return palette;\n}\n// H_EARTH_INLAND_REFERENCE_V1_END\n'
assert not any(x in h for x in ['texture(','fwidth(','distanceToCamera','base','geologicalEarthRock','terrainRelief'])
fs=s.index('const FS =');m=s.index('void main(){',fs);s=s[:m]+h+s[m:]
c='''      // H_EARTH_INLAND_COMPOSED_BLEND_V1_BEGIN
      // Filter the complete broad reference; carry native Q-Q0 detail unchanged.
      // Neighbor heights use the center tangent plane, not new geometry.
      float inlandBlendEnvelope=groundcoverProtection*
        smoothstep(112.0,144.0,vCoastDistanceMeters)*
        (1.0-smoothstep(0.12,0.42,slope))*
        (1.0-smoothstep(0.18,0.58,rockExposure));
      if(inlandBlendEnvelope>0.0){
        vec3 inlandQ0=inlandBroadReference(vWorldPosition,geometricNormal,vCoastDistanceMeters);
        float inlandNy=max(geometricNormal.y,0.1);
        vec3 inlandDx=vec3(12.0,-12.0*geometricNormal.x/inlandNy,0.0);
        vec3 inlandDz=vec3(0.0,-12.0*geometricNormal.z/inlandNy,12.0);
        vec3 inlandFiltered=0.5*inlandQ0+0.125*(
          inlandBroadReference(vWorldPosition-inlandDx,geometricNormal,vCoastDistanceMeters)+
          inlandBroadReference(vWorldPosition+inlandDx,geometricNormal,vCoastDistanceMeters)+
          inlandBroadReference(vWorldPosition-inlandDz,geometricNormal,vCoastDistanceMeters)+
          inlandBroadReference(vWorldPosition+inlandDz,geometricNormal,vCoastDistanceMeters));
        palette+=inlandBlendEnvelope*(inlandFiltered-inlandQ0);
      }
      // H_EARTH_INLAND_COMPOSED_BLEND_V1_END
'''
needle='      // H_EARTH_BROAD_GROUNDCOVER_V1_END\n';assert s.count(needle)==1;s=s.replace(needle,c+needle)
Path('inland/render.js').write_text(s);Path('inland/helper.glsl').write_text(h)
print('renderer',len(s),hashlib.sha256(s.encode()).hexdigest())
