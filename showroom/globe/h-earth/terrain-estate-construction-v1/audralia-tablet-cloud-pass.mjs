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

float hash31(vec3 p){
  p=fract(p*.1031);
  p+=dot(p,p.yzx+33.33);
  return fract((p.x+p.y)*p.z);
}
float noise3(vec3 p){
  vec3 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  float a=hash31(i),b=hash31(i+vec3(1,0,0)),c=hash31(i+vec3(0,1,0)),d=hash31(i+vec3(1,1,0));
  float e=hash31(i+vec3(0,0,1)),g=hash31(i+vec3(1,0,1)),h=hash31(i+vec3(0,1,0)+vec3(0,0,1)),j=hash31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);
}
float fbm(vec3 p){
  float v=0.0,a=.62;
  v+=noise3(p)*a;
  p=p*2.07+vec3(5.3,1.7,9.2);
  a*=.48;
  v+=noise3(p)*a;
  return v;
}
vec2 raySphere(vec3 ro,vec3 rd,float radius){
  vec3 o=ro-CENTER;
  float b=dot(o,rd),c=dot(o,o)-radius*radius,h=b*b-c;
  if(h<0.0)return vec2(1e20,-1e20);
  h=sqrt(h);
  return vec2(-b-h,-b+h);
}
float climateBand(float lat,float center,float halfWidth){
  return 1.0-smoothstep(halfWidth*.58,halfWidth,abs(lat-center));
}
float globalCloudSupport(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;
  float eqc=.045*sin(lon*2.0+t)+.018*sin(lon*5.0-t*.7);
  float eq=climateBand(lat,eqc,.23);
  float sub=climateBand(lat,.43+.026*sin(lon*1.5-t*.45),.18)+climateBand(lat,-.43+.024*sin(lon*1.7+t*.38),.18);
  float mid=climateBand(lat,.76+.042*sin(lon*2.1+t*.24),.22)+climateBand(lat,-.75+.040*sin(lon*2.0-t*.22),.22);
  float hi=climateBand(lat,1.05+.028*sin(lon*2.7+t*.18),.24)+climateBand(lat,-1.04+.026*sin(lon*2.5-t*.17),.24);
  float low=smoothstep(30.0,35.0,h)*(1.0-smoothstep(54.0,65.0,h));
  float middle=smoothstep(44.0,51.0,h)*(1.0-smoothstep(75.0,86.0,h));
  float high=smoothstep(67.0,76.0,h)*(1.0-smoothstep(99.0,108.0,h));
  vec3 advect=radial*8.2+vec3(t*.72,-t*.21,t*.36);
  float broad=fbm(advect),detail=broad;
  if(uFullDetail>.5)detail=fbm(radial*18.0+vec3(-t*.34,t*.19,t*.51));
  float lonWave=.5+.5*sin(lon*3.2+sin(lat*5.1)*1.25+t*.46);
  float broken=smoothstep(.50,.70,broad*.72+detail*.28+.075*lonWave);
  float clearWave=.5+.5*sin(lon*1.12-lat*2.35+t*.20);
  float clearSlot=.64+.36*(1.0-smoothstep(.72,.93,clearWave));
  float climate=eq*(low*.58+middle*.34)+sub*low*.42+mid*(middle*.60+high*.18)+hi*high*.28;
  return clamp(climate*broken*clearSlot*.38,0.0,.34);
}
float densityAt(vec3 p){
  vec3 q=p-CENTER;
  float rr=length(q);
  if(rr<=0.0)return 0.0;
  float h=rr-R;
  vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0));
  float lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  return globalCloudSupport(radial,h,lat,lon);
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  vec2 outerHit=raySphere(uEye,rd,OUTER);
  float t0=max(0.0,outerHit.x),t1=outerHit.y;
  if(t1<=t0){outColor=vec4(0.0);return;}
  vec2 ph=raySphere(uEye,rd,OCCLUDER);
  if(ph.x>0.0)t1=min(t1,ph.x);
  if(t1<=t0){outColor=vec4(0.0);return;}
  float count=max(float(uStepCount),1.0);
  float stepLen=(t1-t0)/count;
  float jitter=hash31(vec3(gl_FragCoord.xy,uTimeHours*.01));
  float t=t0+stepLen*jitter;
  vec3 premul=vec3(0.0);
  float alpha=0.0;
  vec3 sun=normalize(uSunDir);
  for(int s=0;s<8;s++){
    if(s>=uStepCount||t>t1||alpha>.88)break;
    vec3 p=uEye+rd*t;
    float den=densityAt(p);
    if(den>.003){
      vec3 radial=normalize(p-CENTER);
      float daylight=.42+.58*clamp(dot(radial,sun)*.5+.5,0.0,1.0);
      float forward=pow(max(dot(rd,sun),0.0),7.0);
      float core=clamp(den*.78,0.0,.66);
      vec3 bright=mix(vec3(.82,.86,.90),vec3(1.03,1.01,.96),daylight);
      vec3 dark=vec3(.44,.47,.52);
      vec3 col=mix(bright,dark,core)+vec3(1.0,.94,.82)*forward*.06;
      float a=(1.0-exp(-den*stepLen*.021))*uOpacity;
      premul+=(1.0-alpha)*col*a;
      alpha+=(1.0-alpha)*a;
    }
    t+=stepLen;
  }
  if(alpha<.003){outColor=vec4(0.0);return;}
  outColor=vec4(premul/max(alpha,.0001),clamp(alpha,0.0,.78));
}`;

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const message=gl.getShaderInfoLog(shader)||'unknown';
    gl.deleteShader(shader);
    throw new Error(`AUDRALIA_TABLET_CLOUD_SHADER_COMPILE_FAILED:${message}`);
  }
  return shader;
}
function makeProgram(gl){
  const vertex=compile(gl,gl.VERTEX_SHADER,VS);
  const fragment=compile(gl,gl.FRAGMENT_SHADER,FS);
  const program=gl.createProgram();
  gl.attachShader(program,vertex);
  gl.attachShader(program,fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    const message=gl.getProgramInfoLog(program)||'unknown';
    gl.deleteProgram(program);
    throw new Error(`AUDRALIA_TABLET_CLOUD_PROGRAM_LINK_FAILED:${message}`);
  }
  return program;
}

export function createAudraliaTabletCloudPass({gl,worldCanvas}={}){
  if(!gl||typeof gl.drawArrays!=='function')throw new Error('AUDRALIA_TABLET_CLOUD_PRIMARY_CONTEXT_MISSING');
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_TABLET_CLOUD_CANVAS_MISSING');
  const program=makeProgram(gl);
  const vao=gl.createVertexArray();
  const uniforms=Object.freeze(Object.fromEntries(
    ['uEye','uForward','uRight','uUp','uSunDir','uAspect','uTanHalfFov','uTimeHours','uOpacity','uFullDetail','uStepCount']
      .map(name=>[name,gl.getUniformLocation(program,name)])
  ));
  let interaction=false;
  let renderedFrames=0;

  function render(camera){
    if(!camera?.eye||!camera?.forward||!camera?.right||!camera?.up)throw new Error('AUDRALIA_TABLET_CLOUD_CAMERA_FRAME_INVALID');
    const stepCount=interaction?INTERACTION_STEPS:REST_STEPS;
    const timeHours=Math.max(0,(Date.now()-EPOCH_MS)/3600000*TIME_SCALE);
    gl.viewport(0,0,worldCanvas.width,worldCanvas.height);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform3fv(uniforms.uEye,camera.eye);
    gl.uniform3fv(uniforms.uForward,camera.forward);
    gl.uniform3fv(uniforms.uRight,camera.right);
    gl.uniform3fv(uniforms.uUp,camera.up);
    gl.uniform3fv(uniforms.uSunDir,SUN_DIRECTION);
    gl.uniform1f(uniforms.uAspect,worldCanvas.width/Math.max(1,worldCanvas.height));
    gl.uniform1f(uniforms.uTanHalfFov,Math.tan(55*Math.PI/360));
    gl.uniform1f(uniforms.uTimeHours,timeHours);
    gl.uniform1f(uniforms.uOpacity,.78);
    gl.uniform1f(uniforms.uFullDetail,interaction?0:1);
    gl.uniform1i(uniforms.uStepCount,stepCount);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    renderedFrames++;
    return Object.freeze({renderedFrames,stepCount,interaction});
  }

  const evidence=Object.freeze({
    schema:'AUDRALIA_TABLET_SAME_CONTEXT_CLOUD_PASS_v1',
    source:'EXACT_24057_EXTERIOR_GLOBAL_CLOUD_SUPPORT_TRANSPLANT',
    primaryContextOnly:true,
    createsCanvas:false,
    requestsWebGLContext:false,
    regionalSystemsIncluded:false,
    canonicalLocalWeatherIncluded:false,
    precipitationIncluded:false,
    celestialIncluded:false,
    restStepCount:REST_STEPS,
    interactionStepCount:INTERACTION_STEPS
  });

  return Object.freeze({
    render,
    beginInteraction:()=>{interaction=true;},
    endInteraction:()=>{interaction=false;},
    getEvidence:()=>evidence,
    getRuntime:()=>Object.freeze({renderedFrames,interaction})
  });
}

export default createAudraliaTabletCloudPass;
