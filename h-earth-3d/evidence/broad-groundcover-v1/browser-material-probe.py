import pathlib,re,json,subprocess,sys
root=pathlib.Path(__file__).resolve().parents[3]
output=pathlib.Path(sys.argv[1]);output.mkdir(parents=True,exist_ok=True)
p='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
a=subprocess.check_output(['git','show','68e3a38eb51f43c50fadd019eac9103b69dbe102:'+p],cwd=root,text=True); b=(root/p).read_text()
def shader(src,n):
 s=re.search(r'const '+n+r' = `([\s\S]*?)`;',src).group(1)
 for k,f in [('RENDERED_BEACH_GLSL','rendered-beach-signal.v1.js'),('HILLSIDE_SHORELINE_GLSL','hillside-shoreline-field.v1.js'),('FOOTHILL_MEADOW_GLSL','foothill-meadow-field.v1.js')]:
  v=subprocess.check_output(['node','--input-type=module','-e',f'import {{ {k} }} from '+json.dumps(str(root/'showroom/globe/h-earth/render'/f))+f'; process.stdout.write({k});'],text=True);s=s.replace('${'+k+'}',v)
 return s
sources=[{'vs':shader(s,'VS'),'fs':shader(s,'FS')} for s in [a,b]]
js=r'''
const sources=SOURCES;
let report={scope:'Exact source shader on controlled flat terrain; not full scene or physical device acceptance',cases:[]};
for(let row=0;row<3;row++)for(let col=0;col<2;col++){
const span=[120,600,2400][row],box=document.createElement('div');box.innerHTML='<b>'+['Baseline','Candidate'][col]+' — '+span+' m controlled field</b>';
const canvas=document.createElement('canvas');canvas.width=560;canvas.height=300;box.append(canvas);document.getElementById('grid').append(box);
try{
const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true});if(!gl)throw Error('No WebGL2');
function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(x));return x;}
const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,sources[col].vs));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,sources[col].fs));gl.linkProgram(pg);if(!gl.getProgramParameter(pg,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(pg));gl.useProgram(pg);
const center=-800, h=span*300/560, verts=new Float32Array([-span/2,0,center-h/2,span/2,0,center-h/2,-span/2,0,center+h/2,-span/2,0,center+h/2,span/2,0,center-h/2,span/2,0,center+h/2]);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
gl.vertexAttrib3f(1,0,1,0);gl.vertexAttrib4f(2,.32,.23,.13,1);gl.vertexAttrib4f(3,0,0,0,0);for(let i=4;i<=7;i++)gl.vertexAttribI4ui(i,i==7?(row==2?0:1):(i==6&&row==2?62000:0),0,0,0);gl.vertexAttrib1f(8,200);gl.vertexAttrib1f(9,64);
function u(n,fn,...v){const l=gl.getUniformLocation(pg,n);if(l!==null)gl[fn](l,...v);}
u('uViewProjection','uniformMatrix4fv',false,new Float32Array([2/span,0,0,0,0,0,0,0,0,2/h,0,0,0,-2*center/h,0,1]));
u('uCameraPosition','uniform3f',0,Math.max(80,span),center);u('uSunDirection','uniform3f',.4,.8,.3);u('uSunIntensity','uniform1f',1);u('uSunColor','uniform3f',1,.96,.9);u('uSkyZenithColor','uniform3f',.35,.55,.7);u('uSkyHorizonColor','uniform3f',.6,.7,.75);u('uGroundHazeColor','uniform3f',.5,.45,.35);u('uFogStartDistance','uniform1f',1e6);u('uPlanetRadius','uniform1f',420000);u('uGlobalCoverFarPrimitiveIndex','uniform1i',row==2?62000:-1);
const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,128,128,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,1,1,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,new Uint32Array([4294967295]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);u('uClearingShadow','uniform1i',1);u('uCavernShadow','uniform1i',1);
gl.viewport(0,0,560,300);gl.drawArrays(gl.TRIANGLES,0,6);const error=gl.getError();if(error)throw Error('GL '+error);const pixels=new Uint8Array(560*300*4);gl.readPixels(0,0,560,300,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let sum=[0,0,0],min=255,max=0;for(let i=0;i<pixels.length;i+=4){for(let j=0;j<3;j++)sum[j]+=pixels[i+j];min=Math.min(min,pixels[i]);max=Math.max(max,pixels[i]);}report.cases.push({candidate:col===1,span,role:row==2?'far continuation':'near terrain',compileLink:'PASS',draw:'PASS',meanRGB:sum.map(v=>v/(560*300)),redRange:[min,max]});
}catch(e){report.cases.push({candidate:col===1,span,error:String(e)});box.append(String(e));}
}
document.getElementById('result').textContent=JSON.stringify(report);
'''.replace('SOURCES',json.dumps(sources))
html='<!doctype html><style>body{font:16px sans-serif;margin:12px;background:#eee}#grid{display:grid;grid-template-columns:560px 560px;gap:12px}canvas{display:block}pre{font-size:10px;white-space:pre-wrap}</style><h3>Exact fragment shader — controlled material comparison (not full scene)</h3><div id="grid"></div><pre id="result"></pre><script>'+js+'</script>'
(output/'browser-probe.html').write_text(html)
