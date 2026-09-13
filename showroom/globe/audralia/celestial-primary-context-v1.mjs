const POLICY_ID='AUDRALIA_TABLET_PRIMARY_CONTEXT_CELESTIAL_PARITY_3265_v1';
const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const runtime=window.__AUDRALIA_TABLET_SINGLE_CONTEXT__;
if(!(canvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_PARITY_CELESTIAL_CANVAS_MISSING');
if(!runtime?.renderer||typeof runtime.getCameraFrame!=='function')throw new Error('AUDRALIA_PARITY_CELESTIAL_RUNTIME_MISSING');
const gl=canvas.getContext('webgl2');
if(!gl)throw new Error('AUDRALIA_PARITY_CELESTIAL_PRIMARY_CONTEXT_UNAVAILABLE');

const SUN=Object.freeze([.42,.78,.46]);
const MOON_A=Object.freeze([.15,.66,-.74]);
const MOON_B=Object.freeze([-.58,.48,-.66]);

const VS=`#version 300 es
precision highp float;
out vec2 vNdc;
void main(){vec2 p=gl_VerID==0?vec2(-1.0,-1.0):(gl_VerID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));vNdc=p;gl_Position=vec4(p,0.0,1.0);}`.replaceAll('gl_VerID','gl_VertexID');
const FS=`#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform vec3 uEye,uForward,uRight,uUp,uSunDir,uMoonA,uMoonB;
uniform float uAspect,uTanHalfFov;
const float PI=3.141592653589793;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const float RADIUS=6200.0,ATMOSPHERE_RADIUS=6320.0;
float sphereNear(vec3 ro,vec3 rd,float radius){vec3 oc=ro-CENTER;float b=dot(oc,rd),c=dot(oc,oc)-radius*radius,h=b*b-c;if(h<0.0)return -1.0;float root=sqrt(h),a=-b-root,z=-b+root;return a>0.0?a:(z>0.0?z:-1.0);}
float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}
vec3 stars(vec3 rd,float visibility){float lon=atan(rd.z,rd.x)/(2.0*PI)+.5,lat=asin(clamp(rd.y,-1.0,1.0))/PI+.5;vec2 uv=vec2(lon,lat),g=uv*vec2(300.0,150.0),id=floor(g),f=fract(g)-.5,j=vec2(hash21(id+vec2(1.7,9.2)),hash21(id+vec2(7.3,2.1)))-.5;float seed=hash21(id+11.7),d=length(f-j*.76),s=(1.0-smoothstep(.018,.075,d))*step(.986,seed),b=mix(.45,1.35,hash21(id+31.2));return s*b*mix(vec3(.72,.84,1.0),vec3(1.0,.92,.72),hash21(id+18.4))*visibility;}
vec3 basisSeed(vec3 d){return abs(d.y)<.86?vec3(0,1,0):vec3(1,0,0);}
vec4 moon(vec3 rd,vec3 dir,float ar,vec3 sun,vec3 base){vec3 t=normalize(cross(basisSeed(dir),dir)),b=normalize(cross(dir,t));float rs=sin(ar),x=dot(rd,t)/rs,y=dot(rd,b)/rs,r2=x*x+y*y;if(r2>1.14)return vec4(0);float disk=1.0-smoothstep(.94,1.02,r2),halo=(1.0-smoothstep(1.0,1.14,r2))*.12;if(disk<=0.0&&halo<=0.0)return vec4(0);float z=sqrt(max(0.0,1.0-min(r2,1.0)));vec3 n=normalize(t*x+b*y-dir*z);float lam=max(dot(n,normalize(sun)),0.0),earth=.07+.05*(1.0-lam),limb=mix(.72,1.0,z);vec3 lit=base*(earth+lam*.98)*limb,hc=base*(.28+.35*lam);return vec4(lit*disk+hc*halo,clamp(disk+halo,0.0,1.0));}
vec4 sunDisc(vec3 rd,vec3 sun){float a=clamp(dot(rd,normalize(sun)),0.0,1.0),disc=smoothstep(cos(.020),cos(.010),a),inner=smoothstep(cos(.060),cos(.020),a),outer=smoothstep(cos(.145),cos(.040),a);return vec4(vec3(1.0,.965,.78)*disc*1.35+vec3(1.0,.71,.34)*(inner*.30+outer*.07),clamp(disc+inner*.44+outer*.12,0.0,.98));}
void main(){
  vec3 rd=normalize(uForward+vNdc.x*uAspect*uTanHalfFov*uRight+vNdc.y*uTanHalfFov*uUp),sun=normalize(uSunDir);
  float planet=sphereNear(uEye,rd,RADIUS);
  if(planet>0.0){vec3 p=uEye+rd*planet,n=normalize(p-CENTER);float solar=dot(n,sun),night=smoothstep(.10,-.30,solar),twilight=exp(-abs(solar)*12.0);vec3 c=mix(vec3(.004,.010,.024),vec3(.16,.055,.030),twilight*.34);float a=night*.62+twilight*.055;if(a<.002)discard;outColor=vec4(c,a);return;}
  float altitude=max(0.0,length(uEye-CENTER)-RADIUS),observerDay=dot(normalize(uEye-CENTER),sun),atmo=1.0-smoothstep(180.0,1350.0,altitude),day=smoothstep(-.16,.24,observerDay),solarProx=smoothstep(.90,.9996,dot(rd,sun));
  float starVis=clamp(1.0-atmo*day,0.0,1.0)*(1.0-solarProx*.96);vec3 color=stars(rd,starVis);float alpha=clamp(max(max(color.r,color.g),color.b),0.0,.90);
  vec4 ma=moon(rd,normalize(uMoonA),.030,sun,vec3(.78,.87,.98)),mb=moon(rd,normalize(uMoonB),.019,sun,vec3(.96,.79,.61)),sd=sunDisc(rd,sun);
  color=mix(color,ma.rgb,ma.a);alpha=max(alpha,ma.a);color=mix(color,mb.rgb,mb.a);alpha=max(alpha,mb.a);color=mix(color,sd.rgb,sd.a);alpha=max(alpha,sd.a);
  float shell=sphereNear(uEye,rd,ATMOSPHERE_RADIUS);if(shell>0.0){vec3 p=uEye+rd*shell,n=normalize(p-CENTER);float solar=dot(n,sun),tangent=pow(1.0-abs(dot(n,-rd)),4.6),twilight=exp(-abs(solar)*10.0),night=smoothstep(.04,-.24,solar);vec3 ac=mix(vec3(.88,.28,.10),vec3(.12,.32,.64),night*.82);float aa=tangent*(.018+.19*twilight+.025*night);color=mix(color,ac,aa);alpha=max(alpha,aa);}
  if(alpha<.002)discard;outColor=vec4(color,alpha);
}`;
function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(`AUDRALIA_PARITY_CELESTIAL_SHADER:${gl.getShaderInfoLog(s)}`);return s;}
const program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,VS),fs=compile(gl.FRAGMENT_SHADER,FS);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`AUDRALIA_PARITY_CELESTIAL_LINK:${gl.getProgramInfoLog(program)}`);
const vao=gl.createVertexArray();const U=Object.freeze(Object.fromEntries(['uEye','uForward','uRight','uUp','uSunDir','uMoonA','uMoonB','uAspect','uTanHalfFov'].map(n=>[n,gl.getUniformLocation(program,n)])));
let queued=false,renderedFrames=0;
function render(){queued=false;const frame=runtime.getCameraFrame();gl.viewport(0,0,canvas.width,canvas.height);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniform3fv(U.uEye,frame.eye);gl.uniform3fv(U.uForward,frame.forward);gl.uniform3fv(U.uRight,frame.right);gl.uniform3fv(U.uUp,frame.up);gl.uniform3fv(U.uSunDir,SUN);gl.uniform3fv(U.uMoonA,MOON_A);gl.uniform3fv(U.uMoonB,MOON_B);gl.uniform1f(U.uAspect,canvas.width/Math.max(1,canvas.height));gl.uniform1f(U.uTanHalfFov,Math.tan(55*Math.PI/360));gl.drawArrays(gl.TRIANGLES,0,3);gl.bindVertexArray(null);gl.disable(gl.BLEND);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);renderedFrames++;}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>requestAnimationFrame(render));}
for(const type of ['pointerdown','pointermove','pointerup','pointercancel','wheel','dblclick'])canvas.addEventListener(type,schedule,{passive:true});
window.addEventListener('keydown',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});document.querySelector('[data-fit-world]')?.addEventListener('click',schedule,{passive:true});
render();
const evidence=Object.freeze({policyId:POLICY_ID,usesPrimaryWorldCanvas:true,newCanvasCreated:false,uniqueWebGLContextExpected:1,stars:true,sun:true,moons:2,atmosphere:true,getRuntimeEvidence:()=>Object.freeze({renderedFrames})});
Object.defineProperty(window,'__AUDRALIA_TABLET_PRIMARY_CONTEXT_CELESTIAL__',{value:evidence,writable:false,configurable:false});
