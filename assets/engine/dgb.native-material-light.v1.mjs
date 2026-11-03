/** Diamond Gate Graphics Engine E4-A: world-independent material bindings.
 * Uses accepted E1 device for GPU ownership and E2's beforeDraw hook; no scene,
 * frame scheduler, consumer shaders, asset loader or color-management claim.
 * RGB math is linear numeric; straight alpha; canvas transfer conversion not provided.
 */
const KINDS = new Set(['UNLIT','TEXTURED','LIT','LIT_SPECULAR']);
const finite = x => typeof x === 'number' && Number.isFinite(x);
const vec = (a,n,label,lower=-Infinity,upper=Infinity) => {
  if (!Array.isArray(a) || a.length !== n || !a.every(x=>finite(x) && x>=lower && x<=upper))
    throw new TypeError(label+'_INVALID');
  return [...a];
};
const matrix = (a,label) => {
  if ((!Array.isArray(a) && !(a instanceof Float32Array) && !(a instanceof Float64Array)) || a.length!==16 || !Array.from(a).every(finite))
    throw new TypeError(label+'_INVALID');
  return new Float32Array(a);
};
function normalMatrix(model) {
  // Column-major inverse transpose of the upper-left 3x3, valid for nonuniform scale.
  const a=model[0],b=model[4],c=model[8],d=model[1],e=model[5],f=model[9],g=model[2],h=model[6],i=model[10];
  const A=e*i-f*h,B=f*g-d*i,C=d*h-e*g;
  const determinant=a*A+b*B+c*C;
  if (!finite(determinant)||Math.abs(determinant)<1e-12) throw new TypeError('NORMAL_MATRIX_SINGULAR');
  // adjugate of row-major 3x3 transposed, written as column-major normal matrix
  const inv=[A,(c*h-b*i),(b*f-c*e),B,(a*i-c*g),(c*d-a*f),C,(b*g-a*h),(a*e-b*d)].map(x=>x/determinant);
  // inv is row-major inverse, and column-major representation of inverse-transpose
  return new Float32Array(inv);
}
const shader = (kind,backend) => {
  const two=backend==='WEBGL2';
  const head=two?'#version 300 es\n':'';
  const vIn=two?'in':'attribute', vOut=two?'out':'varying', fIn=two?'in':'varying';
  const fragOut=two?'out vec4 outColor;\n':'', write=two?'outColor':'gl_FragColor';
  const tex=two?'texture':'texture2D';
  const lit=kind==='LIT'||kind==='LIT_SPECULAR',specular=kind==='LIT_SPECULAR';
  const vertexSource = head+
    `${vIn} vec3 aPosition;\nuniform mat4 uMVP;\n`+
    (kind==='TEXTURED'?`${vIn} vec2 aUV;\n${vOut} vec2 vUV;\n`:'')+
    (lit?`${vIn} vec3 aNormal;\n${vOut} vec3 vNormal;\nuniform mat3 uNormalMatrix;\n`:'')+
    (specular?`${vOut} vec3 vWorldPosition;\nuniform mat4 uModel;\n`:'')+
    `void main(){gl_Position=uMVP*vec4(aPosition,1.0);`+
    (kind==='TEXTURED'?'vUV=aUV;':'')+
    (lit?'vNormal=normalize(uNormalMatrix*aNormal);':'')+
    (specular?'vWorldPosition=(uModel*vec4(aPosition,1.0)).xyz;':'')+'}\n';
  const fragmentSource = head+'precision highp float;\n'+
    (kind==='TEXTURED'?`${fIn} vec2 vUV;\nuniform sampler2D uTexture;\n`:'')+
    (lit?`${fIn} vec3 vNormal;\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nuniform float uLightIntensity;\nuniform float uAmbient;\n`:'')+
    (specular?`${fIn} vec3 vWorldPosition;\nuniform vec3 uCameraPosition;\nuniform vec3 uSkyColor;\nuniform vec3 uGroundColor;\nuniform float uFillIntensity;\nuniform float uSpecularStrength;\nuniform float uShininess;\n`:'')+
    'uniform vec4 uBaseColor;\n'+fragOut+
    `void main(){vec4 c=uBaseColor;`+
    (kind==='TEXTURED'?`c*=${tex}(uTexture,vUV);`:'')+
    (kind==='LIT'?'float lambert=max(dot(normalize(vNormal),uLightDirection),0.0);c.rgb*=clamp(vec3(uAmbient)+uLightColor*(uLightIntensity*lambert),0.0,1.0);':'')+
    (specular?'vec3 n=normalize(vNormal);vec3 l=normalize(uLightDirection);float ndl=max(dot(n,l),0.0);'+
      'float sky=clamp(n.y*0.5+0.5,0.0,1.0);vec3 fill=mix(uGroundColor,uSkyColor,sky)*uFillIntensity;'+
      'vec3 v=normalize(uCameraPosition-vWorldPosition);vec3 h=normalize(l+v);'+
      'float highlight=ndl>0.0?pow(max(dot(n,h),0.0),uShininess)*uSpecularStrength:0.0;'+
      'c.rgb=c.rgb*clamp(vec3(uAmbient)+fill+uLightColor*(uLightIntensity*ndl),0.0,1.0)'+
      '+uLightColor*(uLightIntensity*highlight);':'')+
    `${write}=clamp(c,0.0,1.0);}\n`;
  return {vertexSource,fragmentSource};
};
export function createNativeMaterialLibrary(device) {
  if (!device || !['WEBGL1','WEBGL2'].includes(device.backend) || !device.gl ||
      typeof device.createProgram!=='function' || typeof device.createTexture2D!=='function' ||
      typeof device.status!=='function') throw new TypeError('E1_DEVICE_REQUIRED');
  const gl=device.gl, programs=new Map(), materials=new WeakSet(), ownedTextures=new WeakSet();
  let disposed=false;
  function ready(){
    if(disposed)throw new Error('MATERIAL_LIBRARY_DISPOSED');
    const s=device.status();
    if(s.disposed)throw new Error('DEVICE_DISPOSED');
    if(s.lost || s.restorationError || gl.isContextLost?.())throw new Error('GRAPHICS_CONTEXT_NOT_READY');
  }
  function createTexture2D(spec){ready();const record=device.createTexture2D(spec);ownedTextures.add(record);return record;}
  function createMaterial({kind='UNLIT',baseColor=[1,1,1,1],texture=null,textureEncoding='LINEAR_RGBA8',light=null}={}){
    ready();if(!KINDS.has(kind))throw new TypeError('MATERIAL_KIND_INVALID');
    const color=vec(baseColor,4,'BASE_COLOR',0,1);
    if(textureEncoding!=='LINEAR_RGBA8')throw new TypeError('TEXTURE_ENCODING_UNSUPPORTED');
    if(kind==='TEXTURED'){
      if(!texture || !ownedTextures.has(texture) || !texture.gpu)throw new TypeError('LIBRARY_OWNED_TEXTURE_REQUIRED');
    }else if(texture!==null)throw new TypeError('TEXTURE_NOT_ALLOWED');
    let lighting=null;
    if(kind==='LIT'||kind==='LIT_SPECULAR'){
      const l=light??{};
      const direction=vec(l.direction??[0,0,1],3,'LIGHT_DIRECTION');
      const norm=Math.hypot(...direction);
      if(norm<1e-12)throw new TypeError('LIGHT_DIRECTION_ZERO');
      const ambient=l.ambient??0.15,intensity=l.intensity??0.85;
      if(!finite(ambient)||ambient<0||ambient>1)throw new TypeError('AMBIENT_INVALID');
      if(!finite(intensity)||intensity<0||intensity>1)throw new TypeError('LIGHT_INTENSITY_INVALID');
      const extra={};
      if(kind==='LIT_SPECULAR'){
        const fillIntensity=l.fillIntensity??0.45,specularStrength=l.specularStrength??0.55,shininess=l.shininess??48;
        if(!finite(fillIntensity)||fillIntensity<0||fillIntensity>1)throw new TypeError('FILL_INTENSITY_INVALID');
        if(!finite(specularStrength)||specularStrength<0||specularStrength>1)throw new TypeError('SPECULAR_STRENGTH_INVALID');
        if(!finite(shininess)||shininess<1||shininess>256)throw new TypeError('SHININESS_INVALID');
        extra.skyColor=Object.freeze(vec(l.skyColor??[0.24,0.36,0.55],3,'SKY_COLOR',0,1));
        extra.groundColor=Object.freeze(vec(l.groundColor??[0.16,0.10,0.07],3,'GROUND_COLOR',0,1));
        extra.fillIntensity=fillIntensity;extra.specularStrength=specularStrength;extra.shininess=shininess;
      }
      lighting=Object.freeze({direction:Object.freeze(direction.map(x=>x/norm)),color:Object.freeze(vec(l.color??[1,1,1],3,'LIGHT_COLOR',0,1)),ambient,intensity,...extra});
    }else if(light!==null)throw new TypeError('LIGHT_NOT_ALLOWED');
    const material=Object.freeze({kind,baseColor:Object.freeze(color),texture,textureEncoding,light:lighting});
    materials.add(material);return material;
  }
  function makeDrawBinding(material,{modelMatrix,modelViewProjection,cameraPosition}={}){
    ready();if(!material || !materials.has(material))throw new TypeError('FOREIGN_MATERIAL');
    const mvp=matrix(modelViewProjection,'MVP_MATRIX');
    const lit=material.kind==='LIT'||material.kind==='LIT_SPECULAR';
    const model=lit?matrix(modelMatrix,'MODEL_MATRIX'):null;
    const normal=lit?normalMatrix(model):null;
    // In world space, cameraPosition is required for correct view-dependent highlights.
    const camera=material.kind==='LIT_SPECULAR'?vec(cameraPosition,3,'CAMERA_POSITION'):null;
    let program=programs.get(material.kind);
    if(!program){program=device.createProgram(shader(material.kind,device.backend));programs.set(material.kind,program);}
    const glTexture=material.texture;
    let priorTextureState = null;
    return Object.freeze({program,beforeDraw(context,programHandle){
      ready();if(context!==gl || programHandle!==program.gpu)throw new TypeError('MATERIAL_PROGRAM_CONTEXT_MISMATCH');
      // Resolve and validate every required uniform BEFORE any GL-state mutation.
      // A missing later uniform must not leave partially-applied E4 material state.
      if(material.kind==='TEXTURED' && !glTexture.gpu)throw new Error('MATERIAL_TEXTURE_UNAVAILABLE');
      const uniformNames=['uMVP','uBaseColor',
        ...(material.kind==='TEXTURED'?['uTexture']:[]),
        ...(lit?['uNormalMatrix','uLightDirection','uLightColor','uLightIntensity','uAmbient']:[]),
        ...(material.kind==='LIT_SPECULAR'?['uModel','uCameraPosition','uSkyColor','uGroundColor','uFillIntensity','uSpecularStrength','uShininess']:[])];
      const uniformLocations=new Map();
      for(const name of uniformNames){
        const location=context.getUniformLocation(programHandle,name);
        if(location===null)throw new Error('MATERIAL_UNIFORM_MISSING:'+name);
        uniformLocations.set(name,location);
      }
      context.uniformMatrix4fv(uniformLocations.get('uMVP'),false,mvp);
      context.uniform4fv(uniformLocations.get('uBaseColor'),material.baseColor);
      if(material.kind==='TEXTURED'){
        const active=context.getParameter?.(context.ACTIVE_TEXTURE) ?? context.TEXTURE0;
        context.activeTexture(context.TEXTURE0);
        const previous=context.getParameter?.(context.TEXTURE_BINDING_2D) ?? null;
        priorTextureState={active,previous};
        context.bindTexture(context.TEXTURE_2D,glTexture.gpu);
        context.uniform1i(uniformLocations.get('uTexture'),0);
      }
      if(lit){
        const values=[['uNormalMatrix',normal,'uniformMatrix3fv'],['uLightDirection',material.light.direction,'uniform3fv'],
          ['uLightColor',material.light.color,'uniform3fv'],['uLightIntensity',material.light.intensity,'uniform1f'],
          ['uAmbient',material.light.ambient,'uniform1f']];
        if(material.kind==='LIT_SPECULAR')values.push(
          ['uModel',model,'uniformMatrix4fv'],['uCameraPosition',camera,'uniform3fv'],
          ['uSkyColor',material.light.skyColor,'uniform3fv'],['uGroundColor',material.light.groundColor,'uniform3fv'],
          ['uFillIntensity',material.light.fillIntensity,'uniform1f'],
          ['uSpecularStrength',material.light.specularStrength,'uniform1f'],
          ['uShininess',material.light.shininess,'uniform1f']);
        for(const [name,value,method] of values){
          if(method==='uniformMatrix3fv'||method==='uniformMatrix4fv')context[method](uniformLocations.get(name),false,value);
          else context[method](uniformLocations.get(name),value);
        }
      }
    },afterDraw(context,programHandle){
      if(material.kind!=='TEXTURED'||priorTextureState===null)return;
      if(context!==gl||programHandle!==program.gpu)throw new TypeError('MATERIAL_PROGRAM_CONTEXT_MISMATCH');
      if(context.isContextLost?.()){priorTextureState=null;return;}
      const snapshot=priorTextureState;priorTextureState=null;
      context.activeTexture(context.TEXTURE0);
      try { context.bindTexture(context.TEXTURE_2D,snapshot.previous); }
      finally { context.activeTexture(snapshot.active); }
    }});
  }
  return Object.freeze({createTexture2D,createMaterial,makeDrawBinding,
    status(){return Object.freeze({backend:device.backend,materialKinds:[...KINDS],compiledPrograms:programs.size,disposed,deviceLost:Boolean(device.status().lost)});},
    dispose(){disposed=true;programs.clear();} // E1 owns underlying GPU objects.
  });
}
