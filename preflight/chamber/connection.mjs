export const SERVICE_ORIGIN = 'https://operations-chamber.smansfield635.chatgpt.site';
export const FEEDS = Object.freeze({'/data.json':'controlPlane','/api/study':'study','/api/briefings':'briefings','/api/agent-checkpoints':'agents'});
const SCHEMAS = {controlPlane:'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1',study:'DGB_HOSTED_STUDY_CAPTURE_v1',briefings:'DGB_PROJECT_BRIEFINGS_v1',agents:'DGB_CHAMBER_AGENT_DELIVERIES_v1'};
export function createConnection(view, onStatus=()=>{}) {
 let popup=null, nonce='', ready=false, sequence=0, handshake, timeout;
 const pending=new Map(), loaded=new Set();
 function clearHandshake(){view.clearInterval(handshake);view.clearTimeout(timeout);}
 function disconnect(reason='Disconnected. Connect to load saved Chamber information.') {
  ready=false;loaded.clear();clearHandshake();
  for(const item of pending.values()){view.clearTimeout(item.timer);item.reject(Error(reason));}
  pending.clear();
  if(popup&&!popup.closed)popup.close();popup=null;
  onStatus(reason);view.dispatchEvent(new view.Event('chamber:disconnected'));
 }
 function receive(event){
  const m=event.data;
  if(event.origin!==SERVICE_ORIGIN||event.source!==popup||!m||m.nonce!==nonce)return;
  if(m.type==='CHAMBER_READY'&&!ready){ready=true;clearHandshake();onStatus('Connected. Reading saved feeds…');view.dispatchEvent(new view.Event('chamber:connected'));return;}
  if(m.type==='CHAMBER_DISCONNECTED'){disconnect();return;}
  if(!ready||m.type!=='CHAMBER_DATA')return;
  const item=pending.get(m.id);if(!item||item.feed!==m.feed)return;
  pending.delete(m.id);view.clearTimeout(item.timer);
  if(m.ok&&m.data?.schema===SCHEMAS[item.feed]){loaded.add(item.feed);onStatus(loaded.size===4?'All four saved feeds loaded. Refresh reads the service again.':'Connected. Loaded '+loaded.size+' of 4 saved feeds.');item.resolve({ok:true,status:200,json:async()=>m.data});}
  else {loaded.delete(item.feed);onStatus('Source read failed. Reconnect to check sign-in; retained records keep their original dates.');item.reject(Error(m.error||'INVALID_SOURCE'));}
 }
 view.addEventListener('message',receive);
 return {
  connect(){
   disconnect('Opening secure connection…');
   nonce=Array.from(view.crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
   popup=view.open(SERVICE_ORIGIN+'/website-connection#'+nonce,'chamber-'+nonce,'popup,width=640,height=700');
   if(!popup){onStatus('Connection window blocked. Allow this window and select Connect again.');return;}
   const hello=()=>{if(popup?.closed){disconnect('Connection tab closed. Select Connect to reconnect.');return;}popup?.postMessage({type:'CHAMBER_HELLO',nonce},SERVICE_ORIGIN);};
   handshake=view.setInterval(hello,500);hello();
   timeout=view.setTimeout(()=>disconnect('Connection timed out. Complete sign-in, then select Connect again.'),120000);
  },
  async read(route){
   if(!Object.hasOwn(FEEDS,route))throw Error('UNKNOWN_FEED');const feed=FEEDS[route];
   loaded.delete(feed);
   if(!ready||!popup||popup.closed){if(ready)disconnect();throw Error('NOT_CONNECTED');}
   return new Promise((resolve,reject)=>{
    const id='read_'+(++sequence);
    const timer=view.setTimeout(()=>{pending.delete(id);onStatus('Source timed out. Reconnect to check sign-in.');reject(Error('REQUEST_TIMEOUT'));},20000);
    pending.set(id,{feed,resolve,reject,timer});
    popup.postMessage({type:'CHAMBER_READ',id,feed,nonce},SERVICE_ORIGIN);
   });
  },
  disconnect,
  destroy(){disconnect();view.removeEventListener('message',receive);},
 };
}
export const connection=typeof window==='undefined'?null:createConnection(window,message=>{
 const status=document.getElementById('connection-status');if(status)status.textContent=message;
});
