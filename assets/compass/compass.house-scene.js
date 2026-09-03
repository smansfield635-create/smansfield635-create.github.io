(()=>{
'use strict';
const CONTINUITY='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const VERSION='mirror-manor-gothic-phase3-carousel-v3-principal-estate-r2';
const scenes=new WeakMap();let primary=null;
const LEGACY_CONTINUITY='projected-architectural-geometry-v8-coherent-manor DGB_COMPASS_MANOR_EXHIBIT_DEPTH_v8 coherent-two-story-window-grid no-pavilion-windows no-side-stacked-windows roof-occlusion-pass paint(roofFaces)';
const CAROUSEL_DISTANCE=68;
const CAROUSEL_TARGET=Object.freeze([0,7,1]);
const omittedFromCarousel=id=>id==='FG'||id==='GHSE'||/(^|-)GATE($|-)/.test(id||'');
function mount(canvas,{foreground=()=>true}={}){
 if(!canvas||scenes.has(canvas))return scenes.get(canvas);
 let disposed=false,ready=false,drawQueued=false,gl=null,drawImpl=()=>{};
 canvas.hidden=false;canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.filter='brightness(1.08) saturate(.92) contrast(1.10) drop-shadow(0 22px 24px rgba(0,0,0,.38))';
 Object.assign(canvas.dataset,{houseRenderer:VERSION,houseContract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1',houseGeometry:'canonical-phase3-principal-estate-mesh,carousel-gatehouse-omitted,carousel-formal-garden-plinth-omitted,true-facade-openings,open-pointed-portals,true-dormer-apertures,tower-crowns,owned-gothic-enrichment',houseMotion:'static-exhibit',houseRoofWindows:'none',houseWindowFloors:'two',houseCarouselDistance:String(CAROUSEL_DISTANCE),housePrincipalSpan:'27',houseCarouselComposition:'principal-estate-only',objectContinuity:CONTINUITY,legacyContinuity:LEGACY_CONTINUITY,houseCullPolicy:'two-sided-mixed-winding'});
 const api={fallback:false,setForeground:on=>{canvas.dataset.manorForeground=on?'true':'false';if(on)drawImpl()},draw:()=>drawImpl(),inspect:()=>({fallback:false,renderer:VERSION,contract:canvas.dataset.houseContract,foreground:foreground(),geometry:canvas.dataset.houseGeometry,carouselDistance:CAROUSEL_DISTANCE,principalSpan:27,motion:'static-exhibit',continuity:CONTINUITY,ready,cullPolicy:canvas.dataset.houseCullPolicy,auditPass:canvas.dataset.houseAuditPass,composition:'principal-estate-only'})};
 scenes.set(canvas,api);primary=api;
 (async()=>{
  try{
   const [neutral,p1,p1b,p2,p3]=await Promise.all([
    import('/assets/manor-blueprint/manor.estate.neutral-blockout.mjs'),
    import('/assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs'),
    import('/assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs'),
    import('/assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs'),
    import('/assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs')
   ]);
   if(disposed)return;
   const audit=p3.auditPhase3();
   canvas.dataset.houseAuditPass=audit.passStatic?'true':'false';
   canvas.dataset.houseAuditPolicy='nonblocking-render-diagnostic';
   if(!audit.passStatic)canvas.dataset.houseAuditWarning='MIRROR_MANOR_PHASE3_AUDIT_REQUIRES_RECONCILIATION';
   gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true});if(!gl)throw new Error('WEBGL_UNAVAILABLE');
   const vs=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uMVP;varying float vLight;varying vec3 vColor;void main(){vec3 L=normalize(vec3(-.48,.82,.52));vLight=.34+.66*max(0.0,dot(normalize(aNormal),L));vColor=aColor;gl_Position=uMVP*vec4(aPosition,1.0);}`;
   const fs=`precision mediump float;varying float vLight;varying vec3 vColor;void main(){gl_FragColor=vec4(vColor*vLight,1.0);}`;
   const shader=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x};
   const pr=gl.createProgram();gl.attachShader(pr,shader(gl.VERTEX_SHADER,vs));gl.attachShader(pr,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr));gl.useProgram(pr);
   const pos=[],norm=[],col=[];const add=(m,c)=>{for(let i=0;i<m.triangles.length;i+=3){const a=m.triangles[i],b=m.triangles[i+1],d=m.triangles[i+2],ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;for(const q of[a,b,d]){pos.push(...q);norm.push(nx,ny,nz);col.push(...c)}}};
   const build=p3.buildPhase3DetailMesh();for(const m of neutral.buildNeutralMesh({omitFaceMap:p1b.OMIT_FACE_MAP}).meshes.filter(m=>m.id!==build.suppressedNeutralRoofId&&!omittedFromCarousel(m.id)))add(m,[.39,.40,.42]);for(const m of build.replacementRoof.filter(m=>!omittedFromCarousel(m.id)))add(m,p2.PHASE2_MATERIALS.DORMER_SLATE.rgb);for(const m of build.meshes.filter(m=>!omittedFromCarousel(m.id))){const z=p3.PHASE3_MATERIALS[m.material]||p2.PHASE2_MATERIALS[m.material]||p1.MATERIAL_ZONES[m.material]||p1.MATERIAL_ZONES.GRAND_STONE;add(m,z.rgb)}
   canvas.dataset.houseVertexCount=String(pos.length/3);
   const buffer=(name,data)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const l=gl.getAttribLocation(pr,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,0,0)};buffer('aPosition',pos);buffer('aNormal',norm);buffer('aColor',col);const u=gl.getUniformLocation(pr,'uMVP');
   const rad=d=>d*Math.PI/180,mul=(a,b)=>{const o=new Float32Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o},perspective=(f,asp,n,fa)=>{const t=1/Math.tan(f/2),o=new Float32Array(16);o[0]=t/asp;o[5]=t;o[10]=(fa+n)/(n-fa);o[11]=-1;o[14]=2*fa*n/(n-fa);return o},lookAt=(e,t)=>{let zx=e[0]-t[0],zy=e[1]-t[1],zz=e[2]-t[2],zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;let xx=zz,xy=0,xz=-zx,xl=Math.hypot(xx,xz);xx/=xl;xz/=xl;const yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx,o=new Float32Array(16);o[0]=xx;o[1]=yx;o[2]=zx;o[4]=xy;o[5]=yy;o[6]=zy;o[8]=xz;o[9]=yz;o[10]=zz;o[12]=-(xx*e[0]+xz*e[2]);o[13]=-(yx*e[0]+yy*e[1]+yz*e[2]);o[14]=-(zx*e[0]+zy*e[1]+zz*e[2]);o[15]=1;return o};
   drawImpl=()=>{if(disposed||!gl||!foreground())return;const d=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect(),w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);const C=neutral.CAMERA,a=rad(C.azimuthDeg),e=rad(C.elevationDeg),t=CAROUSEL_TARGET,eye=[Math.sin(a)*Math.cos(e)*CAROUSEL_DISTANCE,t[1]+Math.sin(e)*CAROUSEL_DISTANCE,t[2]+Math.cos(a)*Math.cos(e)*CAROUSEL_DISTANCE];gl.uniformMatrix4fv(u,false,mul(perspective(rad(C.fieldOfViewDegrees),w/h,.1,260),lookAt(eye,t)));gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,pos.length/3);canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)};
   ready=true;canvas.dataset.houseAssetReady='true';delete canvas.dataset.houseError;drawImpl();new ResizeObserver(()=>{if(!drawQueued){drawQueued=true;requestAnimationFrame(()=>{drawQueued=false;drawImpl()})}}).observe(canvas);
  }catch(error){canvas.dataset.houseAssetReady='false';canvas.dataset.houseError=String(error?.message||error);api.fallback=true;}
 })();
 return api;
}
window.CompassHouseScene=Object.freeze({version:VERSION,continuity:CONTINUITY,mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();