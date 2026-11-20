/** Shared presentation-only palette. Never used for root or terrain admission. */
export const LANDSCAPE_COHERENCE_GLSL=`
float coherenceNoise(vec2 p){vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=fract(sin(dot(c,vec2(127.1,311.7)))*43758.5453),b=fract(sin(dot(c+vec2(1.,0.),vec2(127.1,311.7)))*43758.5453),d=fract(sin(dot(c+vec2(0.,1.),vec2(127.1,311.7)))*43758.5453),e=fract(sin(dot(c+vec2(1.,1.),vec2(127.1,311.7)))*43758.5453);return mix(mix(a,b,f.x),mix(d,e,f.x),f.y);}
// Shared world-space patch signal: density variation never authorizes root placement.
float meadowGrowthCoherence(vec2 position,float foothillDry){
 vec2 p=mat2(.8,.6,-.6,.8)*position;
 float growth=smoothstep(.18,.88,coherenceNoise(p/13.));
 // Dry uplands keep their relief visible; sheltered meadow retains taller stands.
 return mix(.76,1.24,growth)*(1.-.20*clamp(foothillDry,0.,1.));
}
vec3 landscapeCoverPalette(vec2 position,float foothillDry){
 vec2 p=mat2(.8,.6,-.6,.8)*position;
 float patchWeight=coherenceNoise(p/13.),dry=coherenceNoise(p/29.+vec2(7.,-11.));
 vec3 forest=mix(vec3(.055,.105,.028),vec3(.125,.185,.048),patchWeight);
 vec3 olive=mix(vec3(.12,.15,.035),vec3(.24,.225,.075),patchWeight);
 vec3 palette=mix(forest,olive,smoothstep(.35,.8,dry));
 // The exact same 13m patch field is used by the existing rooted grass blades.
 palette*=mix(.88,1.12,smoothstep(.18,.88,patchWeight));
 // Same elevation/foothill dry signal as rooted blade presentation; positions unchanged.
 float dryBlend=smoothstep(.08,.70,clamp(foothillDry,0.,1.));
 vec3 dryPalette=mix(vec3(.24,.225,.075),vec3(.34,.26,.15),smoothstep(.35,.95,foothillDry));
 return mix(palette,dryPalette,dryBlend*.96);
}
// Existing 13m and 29m patch coordinates are identical to grass color.
// This is a photographic soil multiplier, not a vegetation-color replacement.
// It never participates in root admission, geometry or allocation.
vec3 landscapeSubstrateTone(vec2 position,float foothillDry){
 vec2 p=mat2(.8,.6,-.6,.8)*position;
 float patch=smoothstep(.18,.88,coherenceNoise(p/13.));
 float dryVariation=coherenceNoise(p/29.+vec2(7.,-11.));
 float dryBlend=smoothstep(.08,.70,clamp(foothillDry,0.,1.));
 vec3 moistSoil=mix(vec3(.80,.82,.72),vec3(.98,.93,.80),patch);
 vec3 aridSoil=mix(vec3(1.16,1.06,.86),vec3(1.36,1.16,.88),dryVariation);
 return mix(moistSoil,aridSoil,dryBlend);
}
`;
