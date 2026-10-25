// A stale-snapshot guard around the existing browser-local workspace, not a ledger.
// This detects intervening writes; it is not a cross-process transaction/lock.
export class WorkspaceChangedError extends Error {
 constructor(){super('Another tab changed this workspace. Download your current project and draft before reloading.');this.name='WorkspaceChangedError';}
}
export function workspaceStorage(getStorage,key){
 let baseline,loaded=false;
 return {
  read(){baseline=getStorage().getItem(key);loaded=true;return baseline;},
  write(value){
   if(!loaded)throw Error('Read the saved workspace before writing.');
   const serialized=JSON.stringify(value),storage=getStorage();
   if(storage.getItem(key)!==baseline)throw new WorkspaceChangedError();
   storage.setItem(key,serialized);baseline=serialized;
  }
 };
}
