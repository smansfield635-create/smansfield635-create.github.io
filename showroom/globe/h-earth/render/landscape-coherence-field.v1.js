/** Shared presentation-only palette. Never used for root or terrain admission. */
export const LANDSCAPE_COHERENCE_GLSL=`
float coherenceNoise(vec2 p){vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=fract(sin(dot(c,vec2(127.1,311.7)))*43758.5453),b=fract(sin(dot(c+vec2(1.,0.),vec2(127.1,311.7)))*43758.5453),d=fract(sin(dot(c+vec2(0.,1.),vec2(127.1,311.7)))*43758.5453),e=fract(sin(dot(c+vec2(1.,1.),vec2(127.1,311.7)))*43758.5453);return mix(mix(a,b,f.x),mix(d,e,f.x),f.y);}
vec3 landscapeCoverPalette(vec2 position,float foothillDry){
 vec2 p=mat2(.8,.6,-.6,.8)*position;
 float patchWeight=coherenceNoise(p/13.),dry=coherenceNoise(p/29.+vec2(7.,-11.));
 vec3 forest=mix(vec3(.055,.105,.028),vec3(.125,.185,.048),patchWeight);
 vec3 olive=mix(vec3(.12,.15,.035),vec3(.24,.225,.075),patchWeight);
 vec3 palette=mix(forest,olive,smoothstep(.35,.8,dry));
 vec3 dryPalette=mix(vec3(.24,.225,.075),vec3(.29,.235,.12),smoothstep(.35,.95,foothillDry));
 return mix(palette,dryPalette,foothillDry*.88);
}
`;
