const POLICY_ID='AUDRALIA_FINAL_FRAME_CLOUD_READBACK_PROBE_v1';
const originalDrawArrays=WebGL2RenderingContext.prototype.drawArrays;

function measure(gl){
  const canvas=gl.canvas;
  const width=canvas.width,height=canvas.height;
  if(!(width>0&&height>0))return null;
  const pixels=new Uint8Array(width*height*4);
  gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let nonzero=0,visible=0,alphaSum=0;
  const count=width*height;
  for(let i=3;i<pixels.length;i+=4){
    const a=pixels[i];
    alphaSum+=a;
    if(a>=8)nonzero++;
    if(a>=32)visible++;
  }
  return Object.freeze({
    width,height,count,
    nonzeroFraction:nonzero/count,
    visibleFraction:visible/count,
    meanAlpha:alphaSum/(count*255),
    capturedAt:performance.now()
  });
}

WebGL2RenderingContext.prototype.drawArrays=function(...args){
  const result=originalDrawArrays.apply(this,args);
  const canvas=this.canvas;
  if(globalThis.__AUDRALIA_COVERAGE_AUDIT_ACTIVE__===true&&canvas?.dataset?.audraliaExteriorWeather==='true'){
    const coverage=measure(this);
    if(coverage){
      canvas.__AUDRALIA_LAST_DRAW_COVERAGE__=coverage;
      canvas.dataset.cloudReadbackNonzero=coverage.nonzeroFraction.toFixed(4);
      canvas.dataset.cloudReadbackVisible=coverage.visibleFraction.toFixed(4);
      canvas.dataset.cloudReadbackMeanAlpha=coverage.meanAlpha.toFixed(4);
    }
  }
  return result;
};

Object.defineProperty(globalThis,'__AUDRALIA_FINAL_FRAME_CLOUD_READBACK_PROBE__',{value:Object.freeze({policyId:POLICY_ID,immediateAfterDraw:true,renderMutation:false}),writable:false,configurable:false});
