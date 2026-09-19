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
  const count=256;
  const data=new Float32Array(count*3);
  const goldenAngle=Math.PI*(3-Math.sqrt(5));
  let seed=0x4d595df4;
  const random=()=>{
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    return seed/4294967296;
  };
  for(let i=0;i<count;i++){
    const t=(i+0.5)/count;
    const radius=Math.sqrt(t)*0.985;
    const angle=i*goldenAngle+(random()-0.5)*0.04;
    let x=Math.cos(angle)*radius*1.18;
    let y=Math.sin(angle)*radius*0.84;
    const deliberateVoid=Math.abs(x)<0.14&&y>0.08&&y<0.42;
    if(deliberateVoid){x*=0.2;y*=0.2}
    data[i*3]=x;
    data[i*3+1]=y;
    data[i*3+2]=1.2+3.6*(1-t)*(0.72+random()*0.28);
  }
  return data;
}

function createState(gl){
  const starProgram=createProgram(gl,`#version 300 es
    in vec2 a_position;
    in float a_size;
    uniform float u_visibility;
    uniform float u_aspect;
    void main(){
      gl_Position=vec4(a_position.x/max(u_aspect,1.0),a_position.y,0.0,1.0);
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
  gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,12,0);
  gl.enableVertexAttribArray(sizeLocation);
  gl.vertexAttribPointer(sizeLocation,1,gl.FLOAT,false,12,8);

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
    uniform vec2 u_center;
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
      vec2 p=(v_uv-u_center)/u_radius;
      p.x*=u_aspect;
      float radius2=dot(p,p);
      if(radius2>1.22)discard;
      float z=sqrt(max(0.0,1.0-radius2));
      vec3 normal=normalize(vec3(p,z));

      if(u_kind==0){
        float surface=noise(p*8.0)+0.45*noise(p*19.0);
        float body=smoothstep(1.0,0.50,radius2);
        float corona=smoothstep(1.22,0.94,radius2)*(1.0-smoothstep(0.94,0.78,radius2));
        vec3 color=mix(
          vec3(1.0,0.30,0.025),
          vec3(1.0,0.93,0.44),
          clamp(surface*0.72+z*0.46,0.0,1.0)
        );
        outColor=vec4(color,max(body,corona*0.52)*u_visibility);
        return;
      }

      if(radius2>1.0)discard;
      float maria=noise(p*3.4);
      float highlands=noise(p*12.0);
      float craterA=abs(sin(length(p-vec2(0.23,-0.11))*34.0))*0.10;
      float craterB=abs(sin(length(p-vec2(-0.31,0.18))*49.0))*0.055;
      float light=max(0.12,dot(normal,normalize(vec3(-0.55,0.38,0.74))));
      vec3 color=mix(
        vec3(0.27,0.29,0.31),
        vec3(0.72,0.74,0.72),
        clamp(highlands*0.72+light,0.0,1.0)
      );
      color*=mix(0.68,1.08,maria);
      color-=(craterA+craterB)*(1.0-light);
      float limb=smoothstep(1.0,0.82,radius2);
      outColor=vec4(color,limb*u_visibility*0.92);
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
    bodyProgram,
    bodyVao,
    center:gl.getUniformLocation(bodyProgram,'u_center'),
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

export function renderAudraliaTabletCelestialLite(gl,{viewScale}={}){
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
    gl.drawArrays(gl.POINTS,0,256);
    draws++;

    gl.useProgram(state.bodyProgram);
    gl.bindVertexArray(state.bodyVao);
    gl.uniform1f(state.visibility,visibility);
    gl.uniform1f(state.aspect,aspect);

    gl.uniform1i(state.kind,0);
    gl.uniform2f(state.center,-0.58,0.52);
    gl.uniform1f(state.radius,0.18);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    draws++;

    gl.uniform1i(state.kind,1);
    gl.uniform2f(state.center,0.56,0.42);
    gl.uniform1f(state.radius,0.115);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    draws++;
  }finally{
    restoreState(gl,prior);
  }
  return {draws,visibility};
}
