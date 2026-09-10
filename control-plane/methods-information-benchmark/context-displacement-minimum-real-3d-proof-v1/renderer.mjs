import { cameraEye, lookAt4, multiply4, perspective4, project, vec3 } from './math.mjs';

const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 a_position;
layout(location=1) in vec3 a_color;
layout(location=2) in float a_size;
uniform mat4 u_viewProjection;
uniform float u_pixelRatio;
out vec3 v_color;
void main(){
  gl_Position=u_viewProjection*vec4(a_position,1.0);
  gl_PointSize=a_size*u_pixelRatio/max(0.35,gl_Position.w*0.11);
  v_color=a_color;
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec3 v_color;
out vec4 outColor;
void main(){
  vec2 p=gl_PointCoord*2.0-1.0;
  float r=dot(p,p);
  if(r>1.0) discard;
  float rim=smoothstep(1.0,.25,r);
  float core=smoothstep(.42,0.0,r);
  vec3 color=v_color*(.64+.62*rim)+vec3(core*.7);
  float alpha=smoothstep(1.0,.72,r)*.95;
  outColor=vec4(color,alpha);
}`;

const LINE_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 a_position;
uniform mat4 u_viewProjection;
void main(){gl_Position=u_viewProjection*vec4(a_position,1.0);}`;

const LINE_FRAGMENT = `#version 300 es
precision highp float;
uniform vec4 u_color;
out vec4 outColor;
void main(){outColor=u_color;}`;

function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}

export class MethodsRenderer {
  constructor(canvas, corpus) {
    this.canvas=canvas;
    this.corpus=corpus;
    this.gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'high-performance'});
    if(!this.gl) throw new Error('WEBGL2_REQUIRED');
    this.pointProgram=program(this.gl,VERTEX,FRAGMENT);
    this.lineProgram=program(this.gl,LINE_VERTEX,LINE_FRAGMENT);
    this.pointBuffer=this.gl.createBuffer();
    this.lineBuffer=this.gl.createBuffer();
    this.resourceIdentity={pointProgram:this.pointProgram,lineProgram:this.lineProgram,pointBuffer:this.pointBuffer,lineBuffer:this.lineBuffer};
    this.frame=0;
    this.lastProjected=[];
    this.resize();
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(canvas);
  }
  resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.max(1,Math.floor(this.canvas.clientWidth*dpr));
    const h=Math.max(1,Math.floor(this.canvas.clientHeight*dpr));
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    this.width=w;this.height=h;this.dpr=dpr;
  }
  scenePoints(state){
    const stage=this.corpus.stages[state.currentStage];
    return stage.models.map((model,index)=>{
      const position=[stage.origin[0]+model.position[0],stage.origin[1]+model.position[1],stage.origin[2]+model.position[2]];
      const active=index===state.activeModelByStage[state.currentStage];
      const focused=state.focusedModel===model.id;
      return {model,index,position,color:active?[1,0.88,0.62]:stage.accent,size:focused?240:active?170:105};
    });
  }
  matrices(state){
    const c=state.cameraOrViewTransform;
    const target=vec3(...c.target);
    const eye=cameraEye(target,c.yaw,c.pitch,c.distance);
    const view=lookAt4(eye,target,vec3(0,1,0));
    const projection=perspective4(Math.PI/3,this.width/this.height,.1,80);
    return {viewProjection:multiply4(projection,view),eye};
  }
  render(state){
    this.resize();
    const gl=this.gl;
    const {viewProjection}=this.matrices(state);
    gl.viewport(0,0,this.width,this.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(.012,.027,.07,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const points=this.scenePoints(state);
    const lines=[];
    for(let i=0;i<points.length-1;i++) lines.push(...points[i].position,...points[i+1].position);
    if(lines.length){
      gl.useProgram(this.lineProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER,this.lineBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.lineProgram,'u_viewProjection'),false,viewProjection);
      gl.uniform4f(gl.getUniformLocation(this.lineProgram,'u_color'),.45,.66,1,.22);
      gl.drawArrays(gl.LINES,0,lines.length/3);
    }
    const packed=[];
    for(const point of points) packed.push(...point.position,...point.color,point.size);
    gl.useProgram(this.pointProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(packed),gl.DYNAMIC_DRAW);
    const stride=7*4;
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,stride,3*4);
    gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,stride,6*4);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.pointProgram,'u_viewProjection'),false,viewProjection);
    gl.uniform1f(gl.getUniformLocation(this.pointProgram,'u_pixelRatio'),this.dpr);
    gl.drawArrays(gl.POINTS,0,points.length);
    this.lastProjected=points.map(point=>({...point,screen:project(point.position,viewProjection,this.width/this.dpr,this.height/this.dpr)}));
    this.frame++;
  }
  pick(x,y){
    let best=null;
    for(const point of this.lastProjected){
      if(!point.screen?.visible) continue;
      const distance=Math.hypot(x-point.screen.x,y-point.screen.y);
      if(distance<(point.size*.34)&&(!best||distance<best.distance)) best={...point,distance};
    }
    return best;
  }
  destroy(){
    this.resizeObserver.disconnect();
    const gl=this.gl;
    gl.deleteProgram(this.pointProgram);
    gl.deleteProgram(this.lineProgram);
    gl.deleteBuffer(this.pointBuffer);
    gl.deleteBuffer(this.lineBuffer);
  }
}
