/** Presentation scheduling only: navigation proposals are processed by the unchanged intake. */
export function createFramePresenter({present,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,onPresented=()=>{}}){
 let latest=null,pending=null,requests=0,presentations=0;
 function flush(){
  if(pending!==null){cancelFrame(pending);pending=null;}
  if(latest===null)return null;
  const state=latest;latest=null;
  const frame=present(state);presentations++;onPresented(state,frame);return frame;
 }
 function request(state){latest=state;requests++;if(pending===null)pending=requestFrame(()=>{pending=null;flush();});}
 function cancel(){if(pending!==null)cancelFrame(pending);pending=null;latest=null;}
 return Object.freeze({request,flush,cancel,getReceipt:()=>({requests,presentations,pending:pending!==null})});
}

/** CPU submission budget; a single GL call cannot be preempted. Byte cap is strict. */
export async function uploadInSlices(items,{upload,yieldControl,now=()=>performance.now(),maxMilliseconds=4,maxBytes=262144,onProgress=()=>{}}){
 if(!(Number.isFinite(maxMilliseconds)&&maxMilliseconds>0&&Number.isSafeInteger(maxBytes)&&maxBytes>0))throw Error('UPLOAD_BUDGET_INVALID');
 const totalBytes=items.reduce((n,item)=>n+item.packed.byteLength,0);
 // Validate before uploading any tile; no oversized atomic submission is permitted.
 for(const item of items)if(item.packed.byteLength>maxBytes)throw Error('UPLOAD_ITEM_EXCEEDS_BYTE_BUDGET');
 let index=0,uploadedBytes=0,sliceCount=0,yieldCount=0,maxSliceBytes=0,maxSliceMilliseconds=0,maxAtomicMilliseconds=0;
 while(index<items.length){
  const start=now();let bytes=0,count=0;
  while(index<items.length){
   const item=items[index],length=item.packed.byteLength;
   if(count&&(bytes+length>maxBytes||now()-start>=maxMilliseconds))break;
   const atomicStart=now();upload(item);maxAtomicMilliseconds=Math.max(maxAtomicMilliseconds,now()-atomicStart);
   bytes+=length;uploadedBytes+=length;index++;count++;
  }
  sliceCount++;maxSliceBytes=Math.max(maxSliceBytes,bytes);maxSliceMilliseconds=Math.max(maxSliceMilliseconds,now()-start);
  onProgress({phase:'VEGETATION_UPLOAD',completed:index,total:items.length,uploadedBytes,totalBytes});
  if(index<items.length){yieldCount++;await yieldControl();}
 }
 return Object.freeze({sliceCount,yieldCount,maxSliceBytes,maxSliceMilliseconds,maxAtomicMilliseconds,maxBytes,maxMilliseconds,uploadedBytes,totalBytes,timeScope:'CPU_SUBMISSION_NOT_GPU_EXECUTION',atomicOverrunPossible:true});
}

/** Startup-only uploads: bounded CPU/byte slices, no mandatory frame per chunk. */
export async function uploadStartupBuffer(data,{upload,yieldControl,now=()=>performance.now(),maxMilliseconds=4,maxBytes=1048576,onProgress=()=>{}}){
 if(!(ArrayBuffer.isView(data)&&data.BYTES_PER_ELEMENT>0&&Number.isFinite(maxMilliseconds)&&maxMilliseconds>0&&Number.isSafeInteger(maxBytes)&&maxBytes>=data.BYTES_PER_ELEMENT))throw Error('STARTUP_UPLOAD_BUDGET_INVALID');
 const stride=Math.max(1,Math.floor(Math.min(262144,maxBytes)/data.BYTES_PER_ELEMENT));
 let sliceStarted=now(),sliceBytes=0,yieldCount=0,uploadedBytes=0,submissionMilliseconds=0,waitMilliseconds=0,maxAtomicMilliseconds=0;
 for(let start=0;start<data.length;start+=stride){
   const chunk=data.subarray(start,Math.min(data.length,start+stride));
   if(sliceBytes&&(sliceBytes+chunk.byteLength>maxBytes||now()-sliceStarted>=maxMilliseconds)){
     const waitStarted=now();await yieldControl();waitMilliseconds+=now()-waitStarted;yieldCount++;sliceStarted=now();sliceBytes=0;
   }
   const atomicStarted=now();upload(start*data.BYTES_PER_ELEMENT,chunk);const duration=now()-atomicStarted;
   submissionMilliseconds+=duration;maxAtomicMilliseconds=Math.max(maxAtomicMilliseconds,duration);
   sliceBytes+=chunk.byteLength;uploadedBytes+=chunk.byteLength;onProgress(uploadedBytes);
 }
 return {uploadedBytes,yieldCount,submissionMilliseconds,waitMilliseconds,maxAtomicMilliseconds,maxBytes,maxMilliseconds,timeScope:'CPU_SUBMISSION_NOT_GPU_EXECUTION',atomicOverrunPossible:true};
}
