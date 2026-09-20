const stateByGl=new WeakMap();

function visibilityForScale(scale){
  switch(String(scale||'').toUpperCase()){
    case 'PLANETARY': return 1;
    case 'CONTINENT': return 0.5;
    case 'REGION':
    case 'LOCAL':
    default: return 0;
  }
}

function compileShader(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const detail=gl.getShaderInfoLog(shader)||'shader compile failed';
    gl.deleteShader(shader);
    throw new Error(detail);
  }
  return shader;
}

function createProgram(gl,vertexSource,fragmentSource){
  const vertex=compileShader(gl,gl.VERTEX_SHADER,vertexSource);
  const fragment=compileShader(gl,gl.FRAGMENT_SHADER,fragmentSource);
  const program=gl.createProgram();
  gl.attachShader(program,vertex);
  gl.attachShader(program,fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    const detail=gl.getProgramInfoLog(program)||'program link failed';
    gl.deleteProgram(program);
    throw new Error(detail);
  }
  return program;
}

function fibonacciStars(){
  const count=256,data=new Float32Array(count*4),goldenAngle=Math.PI*(3-Math.sqrt(5));
  let seed=0x4d595df4; const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<count;i++){const y=1-2*(i+0.5)/count,r=Math.sqrt(Math.max(0,1-y*y)),a=i*goldenAngle+(random()-0.5)*0.065,m=random(),bright=m>0.965?1:(m>0.82?0.58:0.22);data.set([Math.cos(a)*r,y,Math.sin(a)*r,0.85+2.15*(1-(i+0.5)/count)+2.35*bright],i*4);}
  return data;
}

function createState(gl){
  const starProgram=createProgram(gl,`#version 300 es
    in vec3 a_position;
    in float a_size;
    uniform mat3 u_camera;
    uniform float u_visibility;
    uniform float u_aspect;
    void main(){
      vec3 q=u_camera*a_position;
      if(q.z<=0.02){gl_Position=vec4(2.0,2.0,1.0,1.0);gl_PointSize=0.0;return;}
      float f=1.0/tan(radians(55.0)*0.5);
      gl_Position=vec4((q.x*f/max(u_aspect,1.0))/q.z,(q.y*f)/q.z,0.999,1.0);
      gl_PointSize=a_size*(0.45+0.55*u_visibility);
    }`,`#version 300 es
    precision highp float;
    uniform float u_visibility;
    out vec4 outColor;
    void main(){
      vec2 p=gl_PointCoord*2.0-1.0;
      float d=dot(p,p);
      if(d>1.0)discard;
      float core=smoothstep(1.0,0.0,d);
      outColor=vec4(vec3(0.80,0.87,1.0)*core,core*u_visibility*0.80);
    }`);
  const starVao=gl.createVertexArray();
  const starBuffer=gl.createBuffer();
  gl.bindVertexArray(starVao);
  gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,fibonacciStars(),gl.STATIC_DRAW);
  const positionLocation=gl.getAttribLocation(starProgram,'a_position');
  const sizeLocation=gl.getAttribLocation(starProgram,'a_size');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,16,0);
  gl.enableVertexAttribArray(sizeLocation);
  gl.vertexAttribPointer(sizeLocation,1,gl.FLOAT,false,16,12);

  const bodyProgram=createProgram(gl,`#version 300 es
    const vec2 corners[4]=vec2[4](
      vec2(-1.0,-1.0),vec2(1.0,-1.0),vec2(-1.0,1.0),vec2(1.0,1.0)
    );
    out vec2 v_uv;
    void main(){
      v_uv=corners[gl_VertexID];
      gl_Position=vec4(v_uv,0.0,1.0);
    }`,`#version 300 es
    precision highp float;
    in vec2 v_uv;
    uniform vec3 u_direction;
    uniform mat3 u_camera;
    uniform float u_radius;
    uniform float u_visibility;
    uniform float u_aspect;
    uniform int u_kind;
    out vec4 outColor;

    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
    float noise(vec2 p){
      vec2 i=floor(p);
      vec2 f=fract(p);
      f=f*f*(3.0-2.0*f);
      return mix(
        mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
        mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),
        f.y
      );
    }

    void main(){
      vec3 cq=u_camera*normalize(u_direction);
      if(cq.z<=0.02)discard;
      float f=1.0/tan(radians(55.0)*0.5);
      vec2 center=vec2((cq.x*f/max(u_aspect,1.0))/cq.z,(cq.y*f)/cq.z);
      vec2 p=(v_uv-center)/u_radius;
      p.x*=u_aspect;
      float radius2=dot(p,p);
      if(radius2>1.22)discard;
      float z=sqrt(max(0.0,1.0-radius2));
      vec3 normal=normalize(vec3(p,z));

      if(u_kind==0){
        float granule=noise(p*13.0+vec2(1.3,-0.7));
        float convection=noise(p*31.0+vec2(-4.2,2.1));
        float filament=noise(vec2(atan(p.y,p.x)*7.0,length(p)*23.0));
        float surface=0.52*granule+0.30*convection+0.18*filament;
        float disk=smoothstep(1.0,0.965,radius2);
        float limbDark=mix(0.72,1.0,pow(z,0.38));
        float hotCore=smoothstep(0.88,0.08,radius2);
        float coronaOuter=smoothstep(1.22,0.985,radius2)*(1.0-smoothstep(0.985,0.955,radius2));
        float coronaInner=smoothstep(1.08,0.94,radius2)*(1.0-smoothstep(0.94,0.82,radius2));
        vec3 color=mix(
          vec3(1.0,0.25,0.018),
          vec3(1.0,0.94,0.50),
          clamp(surface*0.74+hotCore*0.34,0.0,1.0)
        );
        color*=limbDark;
        color+=vec3(1.0,0.63,0.16)*max(0.0,granule-convection)*0.24;
        float alpha=max(disk,max(coronaInner*0.38,coronaOuter*0.20));
        outColor=vec4(clamp(color,0.0,1.0),alpha*u_visibility);
        return;
      }

      if(radius2>1.0)discard;
      float maria=noise(p*3.1+vec2(1.7,-2.3));
      float continental=noise(p*7.2+vec2(-4.1,0.8));
      float highlands=noise(p*18.0+vec2(3.4,5.7));
      float micro=noise(p*46.0+vec2(-8.2,2.6));

      float dA=length(p-vec2(0.23,-0.11));
      float dB=length(p-vec2(-0.31,0.18));
      float dC=length(p-vec2(0.04,0.37));
      float dD=length(p-vec2(-0.48,-0.24));
      float rimA=exp(-pow((dA-0.115)/0.018,2.0));
      float rimB=exp(-pow((dB-0.082)/0.014,2.0));
      float rimC=exp(-pow((dC-0.058)/0.011,2.0));
      float rimD=exp(-pow((dD-0.045)/0.010,2.0));
      float bowlA=exp(-pow(dA/0.090,2.0));
      float bowlB=exp(-pow(dB/0.062,2.0));
      float bowlC=exp(-pow(dC/0.043,2.0));
      float bowlD=exp(-pow(dD/0.034,2.0));
      float relief=0.15*(rimA+rimB)+0.11*(rimC+rimD)-0.13*(bowlA+bowlB)-0.08*(bowlC+bowlD);

      vec3 lightDir=normalize(vec3(-0.78,0.30,0.55));
      float ndl=dot(normal,lightDir);
      float terminator=smoothstep(-0.10,0.16,ndl);
      float grazing=pow(max(0.0,1.0-z),2.0);
      float illumination=mix(0.055,1.0,terminator);
      illumination*=1.0-0.20*grazing;

      float terrain=0.46*maria+0.25*continental+0.20*highlands+0.09*micro;
      vec3 darkRock=vec3(0.115,0.125,0.135);
      vec3 midRock=vec3(0.43,0.445,0.45);
      vec3 highRock=vec3(0.76,0.77,0.75);
      vec3 color=mix(darkRock,midRock,clamp(terrain*1.18,0.0,1.0));
      color=mix(color,highRock,clamp((highlands-0.58)*1.55,0.0,0.72));
      color*=illumination;
      color+=vec3(0.30,0.305,0.29)*max(relief,0.0)*terminator;
      color+=vec3(0.16,0.17,0.18)*min(relief,0.0)*(0.45+0.55*terminator);

      float limb=smoothstep(1.0,0.86,radius2);
      float edgeShade=mix(0.72,1.0,smoothstep(0.0,0.34,z));
      color*=edgeShade;
      outColor=vec4(clamp(color,0.0,1.0),limb*u_visibility*0.94);
    }`);
  const bodyVao=gl.createVertexArray();

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER,null);

  return {
    starProgram,
    starVao,
    starBuffer,
    starVisibility:gl.getUniformLocation(starProgram,'u_visibility'),
    starAspect:gl.getUniformLocation(starProgram,'u_aspect'),
    starCamera:gl.getUniformLocation(starProgram,'u_camera'),
    bodyProgram,
    bodyVao,
    direction:gl.getUniformLocation(bodyProgram,'u_direction'),
    bodyCamera:gl.getUniformLocation(bodyProgram,'u_camera'),
    radius:gl.getUniformLocation(bodyProgram,'u_radius'),
    visibility:gl.getUniformLocation(bodyProgram,'u_visibility'),
    aspect:gl.getUniformLocation(bodyProgram,'u_aspect'),
    kind:gl.getUniformLocation(bodyProgram,'u_kind')
  };
}

function captureState(gl){
  return {
    program:gl.getParameter(gl.CURRENT_PROGRAM),
    vao:gl.getParameter(gl.VERTEX_ARRAY_BINDING),
    arrayBuffer:gl.getParameter(gl.ARRAY_BUFFER_BINDING),
    blend:gl.isEnabled(gl.BLEND),
    depth:gl.isEnabled(gl.DEPTH_TEST),
    cull:gl.isEnabled(gl.CULL_FACE),
    depthMask:gl.getParameter(gl.DEPTH_WRITEMASK),
    srcRgb:gl.getParameter(gl.BLEND_SRC_RGB),
    dstRgb:gl.getParameter(gl.BLEND_DST_RGB),
    srcAlpha:gl.getParameter(gl.BLEND_SRC_ALPHA),
    dstAlpha:gl.getParameter(gl.BLEND_DST_ALPHA)
  };
}

function restoreState(gl,prior){
  prior.blend?gl.enable(gl.BLEND):gl.disable(gl.BLEND);
  prior.depth?gl.enable(gl.DEPTH_TEST):gl.disable(gl.DEPTH_TEST);
  prior.cull?gl.enable(gl.CULL_FACE):gl.disable(gl.CULL_FACE);
  gl.depthMask(prior.depthMask);
  gl.blendFuncSeparate(prior.srcRgb,prior.dstRgb,prior.srcAlpha,prior.dstAlpha);
  gl.useProgram(prior.program);
  gl.bindVertexArray(prior.vao);
  gl.bindBuffer(gl.ARRAY_BUFFER,prior.arrayBuffer);
}

export const AUDRALIA_CELESTIAL_3D_SPATIAL_AUTHORITY=Object.freeze({schema:'AUDRALIA_CELESTIAL_3D_SPATIAL_AUTHORITY_v1',sunDirection:Object.freeze([0.42,0.78,0.46]),moonDirection:Object.freeze([-0.63,0.28,0.72]),stars:'FIBONACCI_UNIT_SPHERE_256',screenSpacePositionAuthority:false});

export function renderAudraliaTabletCelestialLite(gl,{viewScale,cameraFrame,sunDirection=AUDRALIA_CELESTIAL_3D_SPATIAL_AUTHORITY.sunDirection}={}){
  const visibility=visibilityForScale(viewScale);
  if(!gl||visibility<=0)return {draws:0,visibility};

  let state=stateByGl.get(gl);
  if(!state){
    try{
      state=createState(gl);
      stateByGl.set(gl,state);
    }catch{
      return {draws:0,visibility:0};
    }
  }

  const prior=captureState(gl);
  const aspect=Math.max(1,gl.drawingBufferWidth/Math.max(1,gl.drawingBufferHeight));
  const frame=cameraFrame||{right:[1,0,0],up:[0,1,0],forward:[0,0,1]};
  const cameraMatrix=new Float32Array([...frame.right,...frame.up,...frame.forward]);
  let draws=0;
  try{
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(state.starProgram);
    gl.bindVertexArray(state.starVao);
    gl.uniform1f(state.starVisibility,visibility);
    gl.uniform1f(state.starAspect,aspect);
    gl.uniformMatrix3fv(state.starCamera,false,cameraMatrix);
    gl.drawArrays(gl.POINTS,0,256);
    draws++;

    gl.useProgram(state.bodyProgram);
    gl.bindVertexArray(state.bodyVao);
    gl.uniform1f(state.visibility,visibility);
    gl.uniform1f(state.aspect,aspect);
    gl.uniformMatrix3fv(state.bodyCamera,false,cameraMatrix);

    gl.uniform1i(state.kind,0);
    gl.uniform3fv(state.direction,sunDirection);
    gl.uniform1f(state.radius,0.18);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    draws++;

    gl.uniform1i(state.kind,1);
    gl.uniform3fv(state.direction,AUDRALIA_CELESTIAL_3D_SPATIAL_AUTHORITY.moonDirection);
    gl.uniform1f(state.radius,0.115);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    draws++;
  }finally{
    restoreState(gl,prior);
  }
  return {draws,visibility};
}
