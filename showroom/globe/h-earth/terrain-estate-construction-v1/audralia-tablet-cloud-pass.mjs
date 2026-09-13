const EPOCH_MS=Date.parse('2026-08-08T03:26:20.000Z');
const TIME_SCALE=24;
const REST_STEPS=8;
const INTERACTION_STEPS=6;
const SUN_DIRECTION=Object.freeze([.42,.78,.46]);

const VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){
  vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));
  vNdc=p;
  gl_Position=vec4(p,0.0,1.0);
}`;

const FS=`#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform vec3 uEye,uForward,uRight,uUp,uSunDir;
uniform float uAspect,uTanHalfFov,uTimeHours,uOpacity,uFullDetail;
uniform int uStepCount;
const float R=6200.0,OUTER=6308.0,OCCLUDER=6227.0;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const vec3 NORTH=vec3(0.0,.5,-.8660254037844386);
const vec3 MERIDIAN=vec3(0.0,.8660254037844386,.5);
const vec3 EAST=vec3(1.0,0.0,0.0);

float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){
  vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  float a=hash31(i),b=hash31(i+vec3(1,0,0)),c=hash31(i+vec3(0,1,0)),d=hash31(i+vec3(1,1,0));
  float e=hash31(i+vec3(0,0,1)),g=hash31(i+vec3(1,0,1)),h=hash31(i+vec3(0,1,1)),j=hash31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);
}
float fbm(vec3 p){float v=noise3(p)*.62;p=p*2.07+vec3(5.3,1.7,9.2);return v+noise3(p)*.298;}
float wrapPi(float a){return atan(sin(a),cos(a));}
vec2 raySphere(vec3 ro,vec3 rd,float radius){vec3 o=ro-CENTER;float b=dot(o,rd),c=dot(o,o)-radius*radius,h=b*b-c;if(h<0.0)return vec2(1e20,-1e20);h=sqrt(h);return vec2(-b-h,-b+h);}
float band(float h,float lo,float hi){return smoothstep(lo,lo+5.0,h)*(1.0-smoothstep(hi-7.0,hi,h));}
vec2 localAt(float lat,float lon,float cLat,float cLon){return vec2(wrapPi(lon-cLon)*cos(cLat),lat-cLat);}
float diskAt(float lat,float lon,float cLat,float cLon,float radius){return 1.0-smoothstep(radius*.62,radius,length(localAt(lat,lon,cLat,cLon)));}
float ellipseAt(vec2 q,vec2 c,vec2 size,float angle){float ca=cos(angle),sa=sin(angle);vec2 d=q-c;vec2 p=vec2(ca*d.x+sa*d.y,-sa*d.x+ca*d.y)/size;return 1.0-smoothstep(.58,1.04,length(p));}
float textureBreak(float broad,float detail,float phase){return smoothstep(.42,.72,broad*.68+detail*.32+.07*sin(phase*2.7+broad*5.0));}

vec3 frontSystem(vec3 radial,float h,float lat,float lon,float cLat,float cLon,float angle,float phase,float strength,float broad,float detail){
  float t=uTimeHours*.0065;
  vec2 q=localAt(lat,lon,cLat,cLon+t*(.006+.002*sin(phase*5.0)));
  float head=ellipseAt(q,vec2(-.12,.00),vec2(.52,.12),angle);
  float tail=ellipseAt(q,vec2(.26,.08),vec2(.34,.10),angle+.18);
  float extension=ellipseAt(q,vec2(.48,.12),vec2(.28,.065),angle+.09);
  float drySlot=ellipseAt(q,vec2(.02,-.025),vec2(.105,.070),angle-.10);
  float shape=max(head,max(tail,extension))*(1.0-.70*drySlot);
  float broken=.20+.80*textureBreak(broad,detail,phase);
  float mid=shape*band(h,42.0,82.0)*broken*.62*strength;
  float ice=max(head,tail)*band(h,72.0,106.0)*(.22+.78*textureBreak(detail,broad,phase+1.7))*.34*strength;
  return vec3(mid+ice,mid*.34+ice*.98,mid*.25);
}
vec3 jetSystem(float h,float lat,float lon,float cLat,float cLon,float angle,float phase,float strength,float broad,float detail){
  float t=uTimeHours*.0065;
  vec2 q=localAt(lat,lon,cLat,cLon+t*(.010+.002*cos(phase*3.0)));
  float envelope=ellipseAt(q,vec2(0.0),vec2(.60,.105),angle);
  float ripple=.5+.5*sin((q.x*cos(angle)+q.y*sin(angle))*34.0+q.y*9.0+t*.44+phase*2.3);
  float texture=.16+.46*smoothstep(.38,.76,ripple*.48+textureBreak(broad,detail,phase)*.52);
  float plume=envelope*band(h,80.0,108.0)*texture*.52*strength;
  return vec3(plume,plume*.995,plume*.01);
}
vec3 cycloneSystem(float h,float lat,float lon,float cLat,float cLon,float phase,float strength,float broad,float detail){
  float t=uTimeHours*.0065;
  vec2 q=localAt(lat,lon,cLat,cLon+t*.010);
  float sr=length(q),sa=atan(q.y,q.x);
  float envelope=1.0-smoothstep(.40,.53,sr);
  float eye=1.0-smoothstep(.032,.060,sr);
  float eyewallRing=exp(-pow((sr-.086)/.025,2.0));
  float eyewall=eyewallRing*(.50+.50*textureBreak(broad,detail,phase))*(.70+.30*(.5+.5*sin(sa*3.0+1.1+phase)));
  float b1=ellipseAt(q,vec2(.145,-.015),vec2(.19,.050),-.22+phase*.05);
  float b2=ellipseAt(q,vec2(.205,.105),vec2(.22,.055),.20+phase*.04);
  float b3=ellipseAt(q,vec2(.095,.235),vec2(.20,.050),.70+phase*.03);
  float b4=ellipseAt(q,vec2(-.105,.275),vec2(.24,.058),1.10+phase*.02);
  float b5=ellipseAt(q,vec2(-.275,.135),vec2(.25,.060),1.50-phase*.02);
  float b6=ellipseAt(q,vec2(-.315,-.095),vec2(.23,.055),-1.25-phase*.03);
  float segmented=max(max(max(b1,b2),max(b3,b4)),max(b5,b6));
  float bands=segmented*(.18+.82*textureBreak(detail,broad,phase+2.0));
  float low=(eyewall*1.12+bands*.74)*envelope*band(h,30.0,86.0)*(1.0-eye*.995)*strength;
  float outflow=ellipseAt(q-vec2(.055,.035),vec2(0.0),vec2(.48,.34),-.18)*band(h,79.0,108.0)*(.28+.72*textureBreak(broad,detail,phase+3.0))*.42*(1.0-eye*.55)*strength;
  return vec3(low+outflow,low*.34+outflow*.97,low*.95);
}

vec3 advancedCloudField(vec3 p){
  vec3 q=p-CENTER;float rr=length(q);if(rr<=0.0)return vec3(0.0);
  float h=rr-R;vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0));
  float lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  float t=uTimeHours*.0065;
  float broad=fbm(radial*14.0+vec3(t*.26,-t*.18,t*.21));
  float detail=broad;if(uFullDetail>.5)detail=fbm(radial*27.0+vec3(-t*.17,t*.23,-t*.12));
  vec3 weather=vec3(0.0);
  weather+=frontSystem(radial,h,lat,lon,.593412,-1.274090,-.34,.10,1.00,broad,detail);
  weather+=frontSystem(radial,h,lat,lon,.488692,.436332,.28,1.20,.88,broad,detail);
  weather+=frontSystem(radial,h,lat,lon,-.558505,.733038,-.12,2.10,.92,broad,detail);
  weather+=frontSystem(radial,h,lat,lon,.802851,2.443461,.40,2.80,.84,broad,detail);
  weather+=frontSystem(radial,h,lat,lon,-.767945,-.261799,-.42,3.60,.86,broad,detail);
  weather+=jetSystem(h,lat,lon,-.820305,-2.495821,.24,.30,1.00,broad,detail);
  weather+=jetSystem(h,lat,lon,1.012291,-2.617994,-.18,1.40,.90,broad,detail);
  weather+=jetSystem(h,lat,lon,.907571,1.308997,.31,2.30,.88,broad,detail);
  weather+=jetSystem(h,lat,lon,-.959931,1.832596,-.27,3.20,.91,broad,detail);
  weather+=cycloneSystem(h,lat,lon,-.628319,-2.199115,0.0,1.00,broad,detail);
  weather+=cycloneSystem(h,lat,lon,.349066,2.705260,2.4,.82,broad,detail);
  float clear=max(diskAt(lat,lon,.453786,-.314159,.30),max(diskAt(lat,lon,-.10,-1.88,.20),diskAt(lat,lon,.18,1.78,.18)));
  weather*=1.0-.88*clear;
  return vec3(clamp(weather.x,0.0,1.45),clamp(weather.y,0.0,1.0),clamp(weather.z,0.0,1.0));
}

void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec2 outerHit=raySphere(uEye,rd,OUTER);
  float t0=max(0.0,outerHit.x),t1=outerHit.y;
  if(t1<=t0){outColor=vec4(0.0);return;}
  vec2 ph=raySphere(uEye,rd,OCCLUDER);if(ph.x>0.0)t1=min(t1,ph.x);
  if(t1<=t0){outColor=vec4(0.0);return;}
  float count=max(float(uStepCount),1.0),stepLen=(t1-t0)/count;
  float jitter=hash31(vec3(gl_FragCoord.xy,uTimeHours*.01));
  float rayT=t0+stepLen*jitter;
  vec3 premul=vec3(0.0);float alpha=0.0;vec3 sun=normalize(uSunDir);
  for(int s=0;s<8;s++){
    if(s>=uStepCount||rayT>t1||alpha>.90)break;
    vec3 p=uEye+rd*rayT;
    vec3 cloud=advancedCloudField(p);float den=cloud.x;
    if(den>.003){
      vec3 radial=normalize(p-CENTER);
      float daylight=.40+.60*clamp(dot(radial,sun)*.5+.5,0.0,1.0);
      float forward=pow(max(dot(rd,sun),0.0),7.0);
      vec3 bright=mix(vec3(.78,.84,.91),vec3(1.05,1.035,.99),cloud.y)*daylight;
      vec3 dark=mix(vec3(.42,.46,.52),vec3(.20,.24,.30),cloud.z);
      float core=clamp(den*.58+cloud.z*.48,0.0,.82);
      vec3 col=mix(bright,dark,core)+vec3(1.0,.96,.86)*forward*.12;
      float a=(1.0-exp(-den*stepLen*.018))*uOpacity;
      premul+=(1.0-alpha)*col*a;alpha+=(1.0-alpha)*a;
    }
    rayT+=stepLen;
  }
  if(alpha<.003){outColor=vec4(0.0);return;}
  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.82));
}`;

function compile(gl,type,source){
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader)||'unknown';gl.deleteShader(shader);throw new Error(`AUDRALIA_TABLET_CLOUD_SHADER_COMPILE_FAILED:${message}`);}return shader;
}
function makeProgram(gl){
  const vertex=compile(gl,gl.VERTEX_SHADER,VS),fragment=compile(gl,gl.FRAGMENT_SHADER,FS),program=gl.createProgram();
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){const message=gl.getProgramInfoLog(program)||'unknown';gl.deleteProgram(program);throw new Error(`AUDRALIA_TABLET_CLOUD_PROGRAM_LINK_FAILED:${message}`);}return program;
}

export function createAudraliaTabletCloudPass({gl,worldCanvas}={}){
  if(!gl||typeof gl.drawArrays!=='function')throw new Error('AUDRALIA_TABLET_CLOUD_PRIMARY_CONTEXT_MISSING');
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_TABLET_CLOUD_CANVAS_MISSING');
  const program=makeProgram(gl),vao=gl.createVertexArray();
  const uniforms=Object.freeze(Object.fromEntries(['uEye','uForward','uRight','uUp','uSunDir','uAspect','uTanHalfFov','uTimeHours','uOpacity','uFullDetail','uStepCount'].map(name=>[name,gl.getUniformLocation(program,name)])));
  let interaction=false,renderedFrames=0;
  function render(camera){
    if(!camera?.eye||!camera?.forward||!camera?.right||!camera?.up)throw new Error('AUDRALIA_TABLET_CLOUD_CAMERA_FRAME_INVALID');
    const stepCount=interaction?INTERACTION_STEPS:REST_STEPS,timeHours=Math.max(0,(Date.now()-EPOCH_MS)/3600000*TIME_SCALE);
    gl.viewport(0,0,worldCanvas.width,worldCanvas.height);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(program);gl.bindVertexArray(vao);
    gl.uniform3fv(uniforms.uEye,camera.eye);gl.uniform3fv(uniforms.uForward,camera.forward);gl.uniform3fv(uniforms.uRight,camera.right);gl.uniform3fv(uniforms.uUp,camera.up);gl.uniform3fv(uniforms.uSunDir,SUN_DIRECTION);
    gl.uniform1f(uniforms.uAspect,worldCanvas.width/Math.max(1,worldCanvas.height));gl.uniform1f(uniforms.uTanHalfFov,Math.tan(55*Math.PI/360));gl.uniform1f(uniforms.uTimeHours,timeHours);gl.uniform1f(uniforms.uOpacity,.80);gl.uniform1f(uniforms.uFullDetail,interaction?0:1);gl.uniform1i(uniforms.uStepCount,stepCount);
    gl.drawArrays(gl.TRIANGLES,0,3);gl.bindVertexArray(null);gl.disable(gl.BLEND);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);renderedFrames++;
    return Object.freeze({renderedFrames,stepCount,interaction});
  }
  const evidence=Object.freeze({
    schema:'AUDRALIA_TABLET_SAME_CONTEXT_ADVANCED_CLOUD_PASS_v2',
    source:'FAP1_PROVEN_DONOR_GRAMMAR_GLOBALIZED',
    primaryContextOnly:true,createsCanvas:false,requestsWebGLContext:false,
    cheapGlobalCloudSupportIncluded:false,advancedOrganizedWeatherOnly:true,
    structuredCycloneDonorPreserved:true,longFrontalDonorPreserved:true,longJetBandDonorPreserved:true,
    frontalSystemCount:5,jetBandSystemCount:4,cycloneSystemCount:2,totalAdvancedSystemInstances:11,
    clearAirWindowsPreserved:true,regionalSystemsIncluded:false,canonicalLocalWeatherIncluded:false,precipitationRuntimeIncluded:false,celestialIncluded:false,
    restStepCount:REST_STEPS,interactionStepCount:INTERACTION_STEPS,rayMarchCeilingsChanged:false
  });
  return Object.freeze({render,beginInteraction:()=>{interaction=true;},endInteraction:()=>{interaction=false;},getEvidence:()=>evidence,getRuntime:()=>Object.freeze({renderedFrames,interaction})});
}

export default createAudraliaTabletCloudPass;
