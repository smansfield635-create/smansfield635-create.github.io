// Owner-private construction284 adapter. No source animation modification.
// Native E1 mesh updates, E2 submission, E3 nodes and E4 texture/material.
export function createArticulated284({device,library,scene,source,ground,shadowShaders,directPrograms,ID,placement}) {
  if(source.schema!=='PRIVATE_AUTHENTIC_ARTICULATED_SOURCE_HOP'||source.authored.frames.length!==169||source.authored.fps!==120||source.sourceEvidence.vertices!==1597||source.sourceEvidence.triangles!==2578||source.sourceEvidence.joints!==48) throw Error('CONSTRUCTION284_SOURCE_MISMATCH');
  const scale=source.authored.scale, start=source.sampleHop(0), N=1597, initialBounds=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
  for(let i=0;i<N;i++)for(let j=0;j<3;j++){const v=start.positions[i*3+j];initialBounds[j]=Math.min(initialBounds[j],v);initialBounds[j+3]=Math.max(initialBounds[j+3],v);}
  // The terrain mesh uses the fixed diagonal a->c in each near-field cell.
  function inheritedTerrain(x,z){const dx=51/86,dz=37/63,u=(x+25)/dx,v=(z+21)/dz,i=Math.floor(u),j=Math.floor(v);if(i<0||i>=86||j<0||j>=63)throw Error('TRAJECTORY_OUTSIDE_TERRAIN');const X=-25+i*dx,Z=-21+j*dz,f=u-i,g=v-j,a=ground(X,Z),b=ground(X,Z+dz),c=ground(X+dx,Z+dz),e=ground(X+dx,Z);return g>=f?a*(1-g)+b*(g-f)+c*f:a*(1-f)+c*g+e*(f-g);}
  const centerX=(initialBounds[0]+initialBounds[3])/2,centerZ=(initialBounds[2]+initialBounds[5])/2;
  const startX=placement.x,startZ=placement.z,offsetX=startX-centerX*scale,offsetZ=startZ-centerZ*scale;
  const root0=source.authored.frames[0].translation, atlas=source.coatAtlas;
  // Artwork has no depth map. A fixed locally planar stone-path proxy preserves the exact source motion.
  const pathY=inheritedTerrain(startX,startZ);function terrain(x,z){return pathY-0.00026039+0.00024282*(x-startX)+0.00042810*(z-startZ);}
  const sourceClearanceOffset=placement.clearanceOffset;
  const texture=library.createTexture2D({width:atlas.width,height:atlas.height,pixels:atlas.pixels,filter:'LINEAR'});
  const material=library.createMaterial({kind:'TEXTURED',texture,baseColor:[.96,.94,.91,1]});
  const mesh=device.createMesh({vertexCount:N,indices:source.indices,attributes:[{name:'aPosition',size:3,data:start.positions,dynamic:true},{name:'aNormal',size:3,data:start.normals,dynamic:true},{name:'aUV',size:2,data:source.uvs}]});
  const node=scene.createNode({scale:[scale,scale,scale]});
  const light=library.createMaterial({kind:'LIT',light:{direction:[-.82,.94,-.20],ambient:.68,intensity:.53,color:[1,.91,.75]}}).light;
  const two=device.backend==='WEBGL2',head=two?'#version 300 es\n':'',a=two?'in':'attribute',v=two?'out':'varying',f=two?'in':'varying',out=two?'out vec4 outColor;':'',write=two?'outColor':'gl_FragColor',tex=two?'texture':'texture2D';
  // Existing E4 texture/light resources; private combined Lambert draw binding.
  const program=device.createProgram({vertexSource:head+`${a} vec3 aPosition;${a} vec3 aNormal;${a} vec2 aUV;uniform mat4 uMVP;${v} vec3 n;${v} vec2 uv;void main(){n=aNormal;uv=aUV;gl_Position=uMVP*vec4(aPosition,1.);}`,fragmentSource:head+`precision highp float;${f} vec3 n;${f} vec2 uv;uniform sampler2D uTexture;uniform vec3 uLightDirection;uniform vec3 uLightColor;uniform float uAmbient;uniform float uIntensity;${out}void main(){vec4 c=${tex}(uTexture,uv);float lambert=max(dot(normalize(n),uLightDirection),0.);vec3 light=clamp(vec3(uAmbient)+uLightColor*(uIntensity*lambert),0.,1.12);${write}=vec4(clamp(c.rgb*light,0.,1.),c.a);}`});
  let prior=null;
  directPrograms.set(mesh,{program,beforeDraw(gl,h){const u=n=>{const loc=gl.getUniformLocation(h,n);if(loc===null)throw Error('HARVEST_LIT_UNIFORM_'+n);return loc};const locs=['uTexture','uLightDirection','uLightColor','uAmbient','uIntensity'].map(u);const active=gl.getParameter(gl.ACTIVE_TEXTURE);gl.activeTexture(gl.TEXTURE0);prior={active,binding:gl.getParameter(gl.TEXTURE_BINDING_2D)};gl.bindTexture(gl.TEXTURE_2D,texture.gpu);gl.uniform1i(locs[0],0);gl.uniform3fv(locs[1],light.direction);gl.uniform3fv(locs[2],light.color);gl.uniform1f(locs[3],light.ambient);gl.uniform1f(locs[4],light.intensity);},afterDraw(gl){if(prior){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,prior.binding);gl.activeTexture(prior.active);prior=null;}}});
  const draw={program};
  scene.setRenderable(node,{mesh,program:draw.program,cull:'NONE',bounds:{center:[centerX,0,centerZ],radius:100}});
  const paws=['HR','HL','FR','FL'];const segments=24, per=1+2*segments, count=per*4;
  const shadowP=new Float32Array(count*3),opacity=new Float32Array(count),indices=[];
  for(let p=0;p<4;p++){let a=p*per;for(let k=0;k<segments;k++){const j=(k+1)%segments,b=a+1+k,c=a+1+j,d=a+1+segments+k,e=a+1+segments+j;indices.push(a,b,c,b,d,e,b,e,c);}}
  const shadowProgram=device.createProgram({...shadowShaders(device.backend),fragmentSource:shadowShaders(device.backend).fragmentSource.replace(".13,.115,.085,clamp(vOpacity,0.0,.22)",".10,.075,.052,clamp(vOpacity,0.0,.42)")});
  const castN=48, castCount=1+2*castN, castP=new Float32Array(3*castCount),castA=new Float32Array(castCount),castI=[];
  for(let j=0;j<castN;j++){let k=(j+1)%castN,a=1+j,b=1+k,c=1+castN+j,d=1+castN+k;castI.push(0,a,b,a,c,d,a,d,b);}
  const castMesh=device.createMesh({vertexCount:castCount,indices:new Uint16Array(castI),attributes:[{name:'aPosition',size:3,data:castP,dynamic:true},{name:'aOpacity',size:1,data:castA,dynamic:true}]});
  const castNode=scene.createNode();scene.setRenderable(castNode,{mesh:castMesh,program:shadowProgram,pass:'TRANSPARENT',cull:'NONE',bounds:{center:[startX,0,startZ],radius:12}});directPrograms.set(castMesh,shadowProgram);
  const shadowMesh=device.createMesh({vertexCount:count,indices:new Uint16Array(indices),attributes:[{name:'aPosition',size:3,data:shadowP,dynamic:true},{name:'aOpacity',size:1,data:opacity,dynamic:true}]});
  const shadowNode=scene.createNode();scene.setRenderable(shadowNode,{mesh:shadowMesh,program:shadowProgram,pass:'TRANSPARENT',cull:'NONE',bounds:{center:[startX,0,startZ],radius:12}});directPrograms.set(shadowMesh,shadowProgram);
  let last=null;
  function frame(index){
    let k=Math.max(0,Math.min(168,index));const nearest=Math.round(k);if(Math.abs(k-nearest)<1e-9)k=nearest;const sample=source.sampleHop(k),p=sample.positions;
    // Rigid vertical scene transform follows a terrain-height field at authored root displacement;
    // never snap individual paws, change source trajectory, or flatten airborne height.
    const rootX=startX+(sample.translation[2]-root0[2])*scale,rootZ=startZ-(sample.translation[0]-root0[0])*scale;
    const offsetY=pathY+sourceClearanceOffset;
    scene.setTransform(node,{position:[offsetX,offsetY,offsetZ]});device.updateMeshAttribute(mesh,'aPosition',p);device.updateMeshAttribute(mesh,'aNormal',sample.normals);
    let minBody=Infinity, pawReports={},projected=[];
    for(let i=0;i<N;i++){const x=offsetX+p[3*i]*scale,y=offsetY+p[3*i+1]*scale,z=offsetZ+p[3*i+2]*scale;minBody=Math.min(minBody,y-terrain(x,z));const h=Math.max(0,y-terrain(x,z));projected.push([x+h*.82,z+h*.20]);}
    // A soft, directional convex support envelope; not a physically solved shadow map.
    let cx=0,cz=0;for(const q of projected){cx+=q[0];cz+=q[1];}cx/=N;cz/=N;castP.set([cx,terrain(cx,cz)+.001,cz],0);castA[0]=.32;
    for(let j=0;j<castN;j++){let a=j*2*Math.PI/castN,dx=Math.cos(a),dz=Math.sin(a),radius=0;for(const q of projected)radius=Math.max(radius,(q[0]-cx)*dx+(q[1]-cz)*dz);for(let ring=0;ring<2;ring++){let r=radius*(ring?1.00:.72)+(ring?.055:0),i=1+ring*castN+j;castP.set([cx+r*dx,terrain(cx+r*dx,cz+r*dz)+.001,cz+r*dz],i*3);castA[i]=ring?0:.24;}}
    device.updateMeshAttribute(castMesh,'aPosition',castP);device.updateMeshAttribute(castMesh,'aOpacity',castA);
    for(let pi=0;pi<4;pi++){
      const name=paws[pi],ids=source.authored.solePatches[name];let x=0,z=0,loX=Infinity,hiX=-Infinity,loZ=Infinity,hiZ=-Infinity,min=Infinity,max=-Infinity;
      for(const i of ids){const X=offsetX+p[3*i]*scale,Y=offsetY+p[3*i+1]*scale,Z=offsetZ+p[3*i+2]*scale,c=Y-terrain(X,Z);x+=X;z+=Z;loX=Math.min(loX,X);hiX=Math.max(hiX,X);loZ=Math.min(loZ,Z);hiZ=Math.max(hiZ,Z);min=Math.min(min,c);max=Math.max(max,c);}
      x/=ids.length;z/=ids.length;const contact=Boolean(sample.stance[name]),height=Math.max(0,min),rx=Math.max(.065,(hiX-loX)*.65)+height*.10,rz=Math.max(.06,(hiZ-loZ)*.65)+height*.10,alpha=contact?.36:Math.max(.006,.052*Math.exp(-height*8.0));
      const base=pi*per;shadowP.set([x,terrain(x,z)+.003,z],base*3);opacity[base]=alpha;
      for(let ring=0;ring<2;ring++)for(let j=0;j<segments;j++){const a=j*Math.PI*2/segments,s=ring?1:.58,X=x+rx*s*Math.cos(a),Z=z+rz*s*Math.sin(a),i=base+1+ring*segments+j;shadowP.set([X,terrain(X,Z)+.003,Z],i*3);opacity[i]=ring?0:alpha*.65;}
      pawReports[name]={contact,min,max,x,z};
    }
    device.updateMeshAttribute(shadowMesh,'aPosition',shadowP);device.updateMeshAttribute(shadowMesh,'aOpacity',opacity);
    last={index:k,time:k/120,root:[rootX,offsetY,rootZ],minBody,paws:pawReports};return last;
  }
  frame(0);
  return {mesh,material,node,shadowNode,shadowMesh,castMesh,castNode,frame,frameCount:169,articulated284:true,scale,initialBounds,inspect:()=>last};
}
