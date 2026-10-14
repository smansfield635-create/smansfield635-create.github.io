#!/usr/bin/env node
// Existing registered Gen2 visual qualifier. The Gen2638 branch must draw
// the four approved trees; a loading-screen canvas cannot qualify as a render.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawn,spawnSync,execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const productHeads=new Set([
  '783c6347f768565e794418ff02a0201e69e0730d',
  '192404eda2fae556c452083309061c82901a933f'
]);
const approvedIds=['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11'];
const approvedFourTreeGeometryBlob='c26247dcb69cb52c968fcd3ef6c2626eaa577d03';
const isApprovedFourTreeGeometryBlob=blob=>blob===approvedFourTreeGeometryBlob;
const out='/tmp/gen2-evidence';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const gen2674QualificationHeads=new Set(['9a63c4571d95abf925ba22f2fcd7aaaa8c578cac','b23839dc8a473b52dbac080f71bde38dd99cda0f','870a995a7012312ac25569c0dc6673822a126ae2','158d72eecedf9197df194d997cb3b10250197265','e9b86b1af4a5c1ec66a5f39c3e7e1baa91757dce']);
const woodlandQualificationHead='4abd1016336482373caf1c5bfb90245fc188e806';
const sceneQualificationHead='be9dfbf9798ccf0b54813a1664f7d42f80925f0b';
const woodlandQualificationHeads=new Set([woodlandQualificationHead,sceneQualificationHead]);
const woodlandRocksReady=s=>Boolean(s?.rocks?.rockCount===14&&s.rocks.vertices===868&&s.rocks.triangles===1680&&s.rocks.suppressedTriangles===224&&s.rocks.preservedOriginalRockTriangles===336&&s.rocks.originalWorldChanged===false&&s.rocks.gpuByteLength===80052&&s.rocks.combinedSceneGpuBytes===8211732&&s.rocks.combinedSceneGpuBytes<=8388608&&s.rocks.mainDrawCount>0&&s.rocks.shadowDrawCount===1&&s.rocks.drawsPerFrame===1);
const woodlandViews=[['north',-139.403,-194.5],['south',-139.403,-236],['east',-119,-216],['west',-164,-216],['interior',-141,-214]].map(([id,x,z])=>({id,x,z,yawDegrees:id==='interior'?0:Math.atan2(-141-x,z+216)*180/Math.PI,pitchDegrees:-8}));
const woodlandReady=s=>Boolean(s?.gpuResidency?.woodlandFineGrassReady===true&&s?.woodland?.ready===true&&s.woodland.visibleContacts>0&&s.woodland.visibleInstanceCount>0&&s.woodland.drawCallCount===3&&/0:[1-9]\d*,1:[1-9]\d*,2:[1-9]\d*$/.test(s.woodland.selectionSignature??'')&&s.woodland.submittedTriangles>0&&s.woodland.combinedGrassGpuBytes>0&&s.woodland.combinedGrassGpuBytes<=8388608&&(s.globalCover?.visibleInstanceCount??Infinity)+s.woodland.visibleInstanceCount<=4096&&(s.globalCover?.drawCallCount??Infinity)+s.woodland.drawCallCount<=64);
const woodlandFixturesMatch=fixtures=>Array.isArray(fixtures)&&fixtures.length>=1&&fixtures.length<=4&&fixtures.every(f=>f.beforeSha256==='6b57b514fbeeea633b6f8c9006b58b34bbd87b6a6420c2f32202cf1262cfb9cf'&&f.afterSha256==='e78adffbb354de9173e2c2de343d3aea4b25d46dc57ee0d546da45dc1236a08c'&&f.waypointCount===5&&f.canonicalGotoImplementationUnchanged===true);
const woodlandCameraMatches=(s,t)=>Boolean(s?.navigation?.accepted===true&&s.navigation.action==='GOTO_WAYPOINT'&&s.navigation.terrainSupported===true&&[s.position?.x,s.position?.y,s.position?.z,s.navigation.visibleTerrainElevation,s.navigation.minimumCameraY,s.navigation.targetCameraY,s.navigation.clearance].every(Number.isFinite)&&s.navigation.clearance>0&&s.position.y>=s.navigation.minimumCameraY&&Math.abs(s.position.y-s.navigation.targetCameraY)<.001&&Math.hypot(s.position.x-t.x,s.position.z-t.z)<.03&&Math.abs(wrappedMeadowYaw(s.navigation.yawDegrees-t.yawDegrees))<.02&&Math.abs(s.navigation.pitchDegrees-t.pitchDegrees)<.02&&Math.abs(s.navigation.verticalFovDegrees-56)<.02);
async function captureWoodlandViews(page,observe,entry){
 await fs.mkdir(out+'/four-tree-views',{recursive:true});
 entry.woodlandViews=[];
 for(const target of woodlandViews){
  const before=await observe();
  await page.evaluate(id=>{globalThis.__hEarthQualifierWaypoint='QUALIFIER_'+id;},target.id);
  const canvas=page.locator('#h-earth-functional-landscape-canvas');await canvas.hover();await page.mouse.wheel(0,1);
  let actual;const started=Date.now();
  while(Date.now()-started<30000){if(entry.errors.length||entry.failedRequests.length)throw Error('WOODLAND_BROWSER_ERROR');actual=await observe();if(actual.navigation?.sequence>before.navigation.sequence&&Math.hypot(actual.position.x-target.x,actual.position.z-target.z)<.03&&woodlandReady(actual)&&actual.gpuPresentations>before.gpuPresentations&&actual.lastFrame?.navigationSequence===actual.navigation.sequence&&Number.isFinite(actual.lastFrame?.responseMs))break;await sleep(200);}
  await canvas.screenshot({path:out+'/four-tree-views/'+target.id+'-arrival-diagnostic.png'});
  if(actual.gpuPresentations<=before.gpuPresentations||actual.lastFrame?.navigationSequence!==actual.navigation.sequence||!Number.isFinite(actual.lastFrame?.responseMs)||actual.lastFrame.responseMs<0||!woodlandCameraMatches(actual,target)||!readiness(actual)||!residencyReady(actual.residency)||!woodlandReady(actual)||actual.navigation?.sequence<=before.navigation.sequence||Math.hypot(actual.position.x-target.x,actual.position.z-target.z)>.03||Math.abs(wrappedMeadowYaw(actual.navigation.yawDegrees-target.yawDegrees))>.02||Math.abs(actual.navigation.pitchDegrees-target.pitchDegrees)>.02||Math.abs(actual.navigation.verticalFovDegrees-56)>.02||actual.navigation.terrainSupported!==true||!Number.isFinite(actual.navigation.visibleTerrainElevation)||actual.position.y<actual.navigation.minimumCameraY||actual.gpuFourTreeFloorCount!==4||actual.clearingGpuReady!==true)throw Error('WOODLAND_ACTUAL_VIEW_INVALID:'+target.id+':'+JSON.stringify(actual));
  if(entry.sceneRefinement&&!woodlandRocksReady(actual))throw Error('WOODLAND_ROCK_ARRIVAL_INVALID:'+target.id+':'+JSON.stringify(actual.rocks));
  const arrival=actual;
  await page.evaluate(id=>{globalThis.__hEarthQualifierWaypoint='QUALIFIER_'+id;},target.id);await page.mouse.wheel(0,1);
  const redrawStarted=Date.now();let redraw;
  while(Date.now()-redrawStarted<30000){if(entry.errors.length||entry.failedRequests.length)throw Error('WOODLAND_REDRAW_BROWSER_ERROR');redraw=await observe();if(redraw.navigation?.sequence>arrival.navigation.sequence&&redraw.gpuPresentations>arrival.gpuPresentations)break;await sleep(100);}
  if(!woodlandCameraMatches(redraw,target)||!readiness(redraw)||!residencyReady(redraw.residency)||!woodlandReady(redraw)||redraw.navigation.sequence<=arrival.navigation.sequence||redraw.gpuPresentations<=arrival.gpuPresentations||redraw.woodland.totalUploadedBytes!==arrival.woodland.totalUploadedBytes||redraw.woodland.perFrameUploadBytes!==0||redraw.woodland.selectionSignature!==arrival.woodland.selectionSignature||['x','y','z'].some(k=>redraw.position[k]!==arrival.position[k])||redraw.lastFrame?.navigationSequence!==redraw.navigation.sequence||!Number.isFinite(redraw.lastFrame?.responseMs)||redraw.lastFrame.responseMs<0)throw Error('WOODLAND_EXPLICIT_STATIONARY_REDRAW_INVALID:'+target.id+':'+JSON.stringify({arrival,redraw}));
  if(entry.sceneRefinement&&(!woodlandRocksReady(redraw)||redraw.rocks.mainDrawCount<=arrival.rocks.mainDrawCount||redraw.rocks.shadowDrawCount!==arrival.rocks.shadowDrawCount))throw Error('WOODLAND_ROCK_REDRAW_INVALID:'+target.id+':'+JSON.stringify({arrival:arrival.rocks,redraw:redraw.rocks}));
  actual=redraw;
  const samples=await page.evaluate(()=>new Promise((resolve,reject)=>{const intervals=[];let last=null;const timer=setTimeout(()=>reject(Error('WOODLAND_FRAME_TIMING_TIMEOUT')),30000);function tick(now){if(last!==null)intervals.push(now-last);last=now;if(intervals.length===60){clearTimeout(timer);resolve({intervalsMs:intervals,jsHeap:performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize,jsHeapSizeLimit:performance.memory.jsHeapSizeLimit}:null});}else requestAnimationFrame(tick);}requestAnimationFrame(tick);}));
  const after=await observe();if(entry.errors.length||entry.failedRequests.length||!woodlandCameraMatches(after,target)||!readiness(after)||!residencyReady(after.residency)||!woodlandReady(after)||after.woodland.perFrameUploadBytes!==0||after.woodland.totalUploadedBytes!==actual.woodland.totalUploadedBytes||after.woodland.selectionSignature!==actual.woodland.selectionSignature||after.gpuPresentations<actual.gpuPresentations)throw Error('WOODLAND_STATIONARY_RENDER_INVALID:'+target.id);
  if(entry.sceneRefinement&&!woodlandRocksReady(after))throw Error('WOODLAND_ROCK_FINAL_INVALID:'+target.id);
  const filename='four-tree-views/'+target.id+'-post-residency-canvas.png',bytes=await canvas.screenshot({path:out+'/'+filename});if(bytes.length<1024)throw Error('WOODLAND_CANVAS_EMPTY');
  const sorted=[...samples.intervalsMs].sort((a,b)=>a-b);
  entry.woodlandViews.push({target,actualCamera:after.navigation,filename,canvasBytes:bytes.length,canvasSha256:crypto.createHash('sha256').update(bytes).digest('hex'),woodland:after.woodland,rocks:after.rocks,globalCover:after.globalCover,vegetationResidency:after.gpuResidency,stationaryRedraw:{arrivalPresentationCount:arrival.gpuPresentations,redrawPresentationCount:redraw.gpuPresentations,arrivalNavigationSequence:arrival.navigation.sequence,redrawNavigationSequence:redraw.navigation.sequence,cumulativeUploadDeltaBytes:redraw.woodland.totalUploadedBytes-arrival.woodland.totalUploadedBytes,actualFrame:redraw.lastFrame},timing:{actualArrivalFrame:arrival.lastFrame,actualStationaryRedrawFrame:redraw.lastFrame,idleCadence:{...samples,medianMs:sorted[30],p95Ms:sorted[57],measurement:'Idle requestAnimationFrame cadence; not renderer frame time or GPU timer queries'},idlePresentationDelta:after.gpuPresentations-redraw.gpuPresentations,idleUploadDeltaBytes:after.woodland.totalUploadedBytes-redraw.woodland.totalUploadedBytes},navigationElapsedMs:Date.now()-started,canonicalTerrainSupportedCamera:true,cameraHeightNote:'CPU diagnostic used 1.7m; browser preserves canonical terrain-supported camera, without height override',measuredHeightAboveVisibleTerrain:after.position.y-after.navigation.visibleTerrainElevation,productionNavigationUnchanged:true,testOnlyWaypointFixture:true});
 }
 if(entry.woodlandViews.length!==5)throw Error('WOODLAND_FIVE_VIEWS_MISSING');
 await fs.writeFile(out+'/four-tree-views/receipt.json',JSON.stringify(entry.woodlandViews,null,2)+'\n');
}
const gen2674MeadowTarget=Object.freeze({x:-45,z:-326,yawDegrees:0,pitchDegrees:-8,verticalFovDegrees:56});
const woodlandCheckpointBase64='ewogICJzY2hlbWEiOiAiSF9FQVJUSF9HRU4yNjc0X0lOREVQRU5ERU5UX1dPUkxEX1JPT1RfUVVBTElGSUNBVElPTl92MSIsCiAgImNhbmRpZGF0ZUhlYWQiOiAiNGFiZDEwMTYzMzY0ODIzNzNjYWYxYzViZmI5MDI0NWZjMTg4ZTgwNiIsCiAgImFjdHVhbE5vZGUyMkV4ZWN1dGlvbiI6IHRydWUsCiAgIm5vZGVWZXJzaW9uIjogInYyMi4yMy4zIiwKICAid29ybGRCaW5hcnlNdXN0UmVtYWluVW5jaGFuZ2VkIjogdHJ1ZSwKICAic3RlcHMiOiBbCiAgICB7CiAgICAgICJpZCI6ICJTT1VSQ0VfUEFSSVRZIiwKICAgICAgInNjcmlwdCI6ICJoLWVhcnRoLTNkL3ZhbGlkYXRpb24vaC1lYXJ0aC5jYW5vbmljYWwtYmFzZS13b3JsZC1wcmVjb21wdXRlLnYxLm1qcyIsCiAgICAgICJhcmd1bWVudCI6ICItLXZlcmlmeS1zb3VyY2UiLAogICAgICAiZXhpdENvZGUiOiAwLAogICAgICAic2lnbmFsIjogbnVsbCwKICAgICAgInN0ZG91dFNoYTI1NiI6ICJmZGI1M2U2YWVlNTEwNmNiMzljMDJkNDU5ZGVlZTYwNWQwYjdiZTNjOGQwMWI0NmVkYThhMDg3N2Y5NDZmNzg2IiwKICAgICAgInN0ZG91dFRhaWwiOiAie1xuICBcInNjaGVtYVwiOiBcIkhfRUFSVEhfR0VOMjY2Nl9QUkVDT01QVVRFX1BBUklUWV9SRUNFSVBUX3YxXCIsXG4gIFwicmVzdWx0XCI6IFwiUEFTU1wiLFxuICBcImV4YWN0U291cmNlQm91bmRcIjogdHJ1ZSxcbiAgXCJmdWxsUmF3QW5kQ2Fub25pY2FsUmVjb3Jkc1wiOiB0cnVlLFxuICBcIm5pbmVDYW5vbmljYWxBbmRSYXdCdWZmZXJzXCI6IHRydWUsXG4gIFwib3JpZ2luYWxQYWNrYWdlSWRlbnRpdHlcIjogXCJIX0VBUlRIX1JVTl84RV9SMl9MSVZFX1JFTkRFUl9QQUNLQUdFXzJGM0QwRUIyXCIsXG4gIFwidHJhbnNwb3J0U2hhMjU2XCI6IFwiNDhmNzU0Y2ExYjExYjhmZTdlZWIwZThkNDU3M2Y2YjZjYjU0NGNmNDM4MzIyYTExNWViNTJjNDRkM2IyOWQ1YVwiLFxuICBcInRyYW5zcG9ydEJ5dGVzXCI6IDExNzM2MjM1LFxuICBcImh5ZHJhdGlvbk1pbGxpc2Vjb25kc1wiOiAyODksXG4gIFwiZnJlc2hTb3VyY2VDb21wYXJlZFwiOiB0cnVlLFxuICBcImVudmlyb25tZW50YWxJZGVudGl0eVByZXNlcnZlZFwiOiB0cnVlLFxuICBcInBoeXNpY2FsQW5kcm9pZFF1YWxpZmllZFwiOiBmYWxzZSxcbiAgXCJyZWxlYXNlQXV0aG9yaXplZFwiOiBmYWxzZVxufVxuXG4iLAogICAgICAic3RkZXJyVGFpbCI6ICIiLAogICAgICAicmVzdWx0IjogIlBBU1MiCiAgICB9LAogICAgewogICAgICAiaWQiOiAiSU1NVVRBQkxFX1dPUkxEX1JPT1QiLAogICAgICAic2NyaXB0IjogImgtZWFydGgtM2QvdmFsaWRhdGlvbi9oLWVhcnRoLmdsb2JhbC1ncm91bmRjb3Zlci52MS5tanMiLAogICAgICAiYXJndW1lbnQiOiAiLS1zaW5nbGUtb3JkZXIiLAogICAgICAiZXhpdENvZGUiOiAwLAogICAgICAic2lnbmFsIjogbnVsbCwKICAgICAgInN0ZG91dFNoYTI1NiI6ICI0YzQyODIxYjc2NDNlN2QxM2IyNWNjZWJmNmMwYTFkMDE2NzEzYmYzM2RiOTUyYjk2ZjI3YmQyNzMxMWQ3NmYwIiwKICAgICAgInN0ZG91dFRhaWwiOiAie1xuICBcInNjaGVtYVwiOiBcIkhfRUFSVEhfR0xPQkFMX0dST1VORF9DT1ZFUl9JTkRFUEVOREVOVF9RVUFMSUZJQ0FUSU9OX3YxXCIsXG4gIFwicmVzdWx0XCI6IFwiUEFTU1wiLFxuICBcImNhbWVyYUZpcnN0UHJvb2ZcIjoge1xuICAgIFwiY2FtZXJhXCI6IHtcbiAgICAgIFwieFwiOiAtMTM5LjQwMjY3OTg3MDUwNjE1LFxuICAgICAgXCJ6XCI6IC0xOTQuNVxuICAgIH0sXG4gICAgXCJmaXJzdFByaW9yaXR5VGlsZVwiOiB7XG4gICAgICBcIml4XCI6IDcsXG4gICAgICBcIml6XCI6IDE2LFxuICAgICAgXCJpbnN0YW5jZUNvdW50XCI6IDAsXG4gICAgICBcInJlY29yZEJ5dGVzXCI6IDBcbiAgICB9LFxuICAgIFwic3RyZWFtZWRUaWxlQ291bnRcIjogNjQ4LFxuICAgIFwiZmluYWxEaWdlc3RcIjogXCJjNjRlZTBlMDU5OTRmYTUwYWEwOGM3Yjg5YzZhN2NhZGI1YzQ4MDNkZjA0NzMwMjI1MTVmODU2MjFmZmMzZGU2XCIsXG4gICAgXCJmaW5hbEZsb2F0MzJSZWNvcmRTaGEyNTZcIjogXCIwNDVjNzc1YWVkZjM5MDg2ZGFlYzIxOTgwMzY1NDc0ZTQzY2JkNDcyZDgwM2MxNjA5N2I0YjgzOTJkZTMwN2E2XCIsXG4gICAgXCJmdWxsV29ybGRQb3B1bGF0aW9uc01hdGNoXCI6IHRydWUsXG4gICAgXCJ0aWxlRGF0YUF2YWlsYWJsZUJlZm9yZUZ1bGxXb3JsZFwiOiB0cnVlLFxuICAgIFwiZWFybHlHcHVUaWxlUHJlc2VudGF0aW9uQ2xhaW1lZFwiOiBmYWxzZVxuICB9LFxuICBcInN0YWJsZVdvcmxkU2hhMjU2XCI6IFwiYzY0ZWUwZTA1OTk0ZmE1MGFhMDhjN2I4OWM2YTdjYWRiNWM0ODAzZGYwNDczMDIyNTE1Zjg1NjIxZmZjM2RlNlwiLFxuICBcInJlY29yZHNTaGEyNTZcIjogXCIwNDVjNzc1YWVkZjM5MDg2ZGFlYzIxOTgwMzY1NDc0ZTQzY2JkNDcyZDgwM2MxNjA5N2I0YjgzOTJkZTMwN2E2XCIsXG4gIFwic3RvcmVkSW5zdGFuY2VzXCI6IDYxNzU5LFxuICBcInByaW1hcnlGYW5zXCI6IDQ5NjAwLFxuICBcInNlY29uZGFyeUZhbnNcIjogMTE2MzUsXG4gIFwibG93RmFuc1wiOiAzNjEsXG4gIFwibWlkRmFuc1wiOiAxNjAsXG4gIFwiZHVuZUZhbnNcIjogMyxcbiAgXCJzaXRlQ2Vuc3VzXCI6IHtcbiAgICBcIk1FQURPV1wiOiB7XG4gICAgICBcImxvd1wiOiAyMjYsXG4gICAgICBcIm1pZFwiOiAxMDQsXG4gICAgICBcImR1bmVcIjogMFxuICAgIH0sXG4gICAgXCJXT09ETEFORF9FREdFXCI6IHtcbiAgICAgIFwibG93XCI6IDEyNCxcbiAgICAgIFwibWlkXCI6IDUwLFxuICAgICAgXCJkdW5lXCI6IDBcbiAgICB9LFxuICAgIFwiQ09BU1RcIjoge1xuICAgICAgXCJsb3dcIjogMTEsXG4gICAgICBcIm1pZFwiOiA2LFxuICAgICAgXCJkdW5lXCI6IDNcbiAgICB9XG4gIH0sXG4gIFwicHVibGlzaGVkVGFsbFNoYTI1NlwiOiBcImM2MTBhNWRmZTM0ODc3NzhhNjdkMmJjYWNjNmNlZjVlZWRkMzNkNWEyYzEwY2E3ZDJhMTZkODIyYjM0YmNjZjRcIixcbiAgXCJtYXhpbXVtU2Vjb25kYXJ5Q2VudGVyT2Zmc2V0XCI6IDAuMjk5OTk2Njg2NjUwMzAzNzcsXG4gIFwicmVjb3JkU3RyaWRlQnl0ZXNcIjogODAsXG4gIFwidGVtcGxhdGVWZXJ0aWNlc1wiOiAyOCxcbiAgXCJ0ZW1wbGF0ZVRyaWFuZ2xlc1wiOiAyNCxcbiAgXCJ0b3RhbEdwdUJ5dGVzXCI6IDQ5NDI1NzYsXG4gIFwicGFkZGVkUmdiYTMyZlRleHR1cmVHcHVCeXRlc1wiOiA0OTQ5ODI0LFxuICBcInJvb3RzXCI6IDc0MTEwOCxcbiAgXCJtYXhHcm91bmRFcnJvclwiOiAwLjAwMDAwMTg0NjI1NTExNjc4ODU5NzcsXG4gIFwibWF4QWN0dWFsU2xvcGVcIjogMC4zNDgyNjYyMzY4Mjg0Nzk0NixcbiAgXCJ3YXRlckNoZWNrZWRcIjogNzQxMTA4LFxuICBcIm1vdW50YWluUm9vdHNcIjogMjg0NSxcbiAgXCJyZWZpbmVtZW50Um9vdHNcIjogMCxcbiAgXCJjbGFzc2VzXCI6IHtcbiAgICBcIkNPQVNUQUxfU09JTFwiOiA0Mzc0MzMsXG4gICAgXCJMT1dMQU5EX1NPSUxcIjogMzAwNzk0LFxuICAgIFwiU1RPTkVfQU5EX1NQQVJTRV9TT0lMXCI6IDI4NDUsXG4gICAgXCJEUllfU0FORFwiOiAzNlxuICB9LFxuICBcInpvbmVzXCI6IHtcbiAgICBcIklOTEFORFwiOiAzMzk1NSxcbiAgICBcIldPT0RMQU5EX0FORF9GT09USElMTFwiOiAyMDY1NixcbiAgICBcIkNPQVNUQUxcIjogNzE0OFxuICB9LFxuICBcImNvdmVyYWdlXCI6IHtcbiAgICBcImVsaWdpYmxlQmxvY2tzXCI6IDQxNSxcbiAgICBcIm9jY3VwaWVkRWxpZ2libGVCbG9ja3NcIjogNDE0LFxuICAgIFwiZXhjbHVkZWRCbG9ja3NcIjogMjMzLFxuICAgIFwiem9uZXNcIjoge1xuICAgICAgXCJJTkxBTkRcIjoge1xuICAgICAgICBcImVsaWdpYmxlQmxvY2tzXCI6IDI0MCxcbiAgICAgICAgXCJvY2N1cGllZEJsb2Nrc1wiOiAyNDAsXG4gICAgICAgIFwiaW5zdGFuY2VzXCI6IDMzOTU1XG4gICAgICB9LFxuICAgICAgXCJXT09ETEFORF9BTkRfRk9PVEhJTExcIjoge1xuICAgICAgICBcImVsaWdpYmxlQmxvY2tzXCI6IDEyNixcbiAgICAgICAgXCJvY2N1cGllZEJsb2Nrc1wiOiAxMjYsXG4gICAgICAgIFwiaW5zdGFuY2VzXCI6IDIwNjU2XG4gICAgICB9LFxuICAgICAgXCJDT0FTVEFMXCI6IHtcbiAgICAgICAgXCJlbGlnaWJsZUJsb2Nrc1wiOiA0OSxcbiAgICAgICAgXCJvY2N1cGllZEJsb2Nrc1wiOiA0OCxcbiAgICAgICAgXCJpbnN0YW5jZXNcIjogNzE0OFxuICAgICAgfVxuICAgIH0sXG4gICAgXCJvY2N1cGF0aW9uUmF0aW9cIjogMC45OTc1OTAzNjE0NDU3ODMyXG4gIH0sXG4gIFwidmlzaWJpbGl0eVwiOiBbXG4gICAge1xuICAgICAgXCJjYW1lcmFcIjoge1xuICAgICAgICBcInhcIjogMCxcbiAgICAgICAgXCJ5XCI6IDEwLFxuICAgICAgICBcInpcIjogLTk2XG4gICAgICB9LFxuICAgICAgXCJ2aXNpYmxlSW5zdGFuY2VDb3VudFwiOiAzOTcsXG4gICAgICBcImRyYXdDYWxsQ291bnRcIjogMjIsXG4gICAgICBcInZpc2libGVQaWxvdENvdW50XCI6IDIwXG4gICAgfSxcbiAgICB7XG4gICAgICBcImNhbWVyYVwiOiB7XG4gICAgICAgIFwieFwiOiAtMTQxLFxuICAgICAgICBcInlcIjogMTUsXG4gICAgICAgIFwielwiOiAtMjI2XG4gICAgICB9LFxuICAgICAgXCJ2aXNpYmxlSW5zdGFuY2VDb3VudFwiOiAzMDMwLFxuICAgICAgXCJkcmF3Q2FsbENvdW50XCI6IDYyLFxuICAgICAgXCJ2aXNpYmxlUGlsb3RDb3VudFwiOiAxODRcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiY2FtZXJhXCI6IHtcbiAgICAgICAgXCJ4XCI6IC00NSxcbiAgICAgICAgXCJ5XCI6IDEwLFxuICAgICAgICBcInpcIjogLTMyNlxuICAgICAgfSxcbiAgICAgIFwidmlzaWJsZUluc3RhbmNlQ291bnRcIjogMzk3OCxcbiAgICAgIFwiZHJhd0NhbGxDb3VudFwiOiA2NCxcbiAgICAgIFwidmlzaWJsZVBpbG90Q291bnRcIjogMzQ1XG4gICAgfSxcbiAgICB7XG4gICAgICBcImNhbWVyYVwiOiB7XG4gICAgICAgIFwieFwiOiAxNTAsXG4gICAgICAgIFwieVwiOiA0NSxcbiAgICAgICAgXCJ6XCI6IC01MDBcbiAgICAgIH0sXG4gICAgICBcInZpc2libGVJbnN0YW5jZUNvdW50XCI6IDM2MjgsXG4gICAgICBcImRyYXdDYWxsQ291bnRcIjogNjQsXG4gICAgICBcInZpc2libGVQaWxvdENvdW50XCI6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiY2FtZXJhXCI6IHtcbiAgICAgICAgXCJ4XCI6IDM3MCxcbiAgICAgICAgXCJ5XCI6IDIwLFxuICAgICAgICBcInpcIjogLTcwMFxuICAgICAgfSxcbiAgICAgIFwidmlzaWJsZUluc3RhbmNlQ291bnRcIjogMTY0NyxcbiAgICAgIFwiZHJhd0NhbGxDb3VudFwiOiAyNixcbiAgICAgIFwidmlzaWJsZVBpbG90Q291bnRcIjogMFxuICAgIH0sXG4gICAge1xuICAgICAgXCJjYW1lcmFcIjoge1xuICAgICAgICBcInhcIjogMTAwMDAsXG4gICAgICAgIFwieVwiOiAwLFxuICAgICAgICBcInpcIjogMTAwMDBcbiAgICAgIH0sXG4gICAgICBcInZpc2libGVJbnN0YW5jZUNvdW50XCI6IDAsXG4gICAgICBcImRyYXdDYWxsQ291bnRcIjogMCxcbiAgICAgIFwidmlzaWJsZVBpbG90Q291bnRcIjogMFxuICAgIH1cbiAgXSxcbiAgXCJnZW5lcmF0aW9uT3JkZXJzXCI6IDEsXG4gIFwiY2Fub25pY2FsV29ybGRUcnV0aFwiOiB7XG4gICAgXCJpbnN0YW5jZUNvdW50XCI6IDI3NTg1LFxuICAgIFwiYmF0Y2hDb3VudFwiOiAxMDgsXG4gICAgXCJkcm9wcGVkUGxhY2VtZW50Q291bnRcIjogMFxuICB9LFxuICBcInByZXBhcmF0aW9uUmVjZWlwdFwiOiB7XG4gICAgXCJzY2hlbWFcIjogXCJIX0VBUlRIX0dMT0JBTF9HUk9VTkRfQ09WRVJfdjFcIixcbiAgICBcImluc3RhbmNlQ291bnRcIjogNjE3NTksXG4gICAgXCJwcmltYXJ5RmFuQ291bnRcIjogNDk2MDAsXG4gICAgXCJzZWNvbmRhcnlGYW5Db3VudFwiOiAxMTYzNSxcbiAgICBcImJ1c2h5Q2x1bXBDb3VudFwiOiAxMTYzNSxcbiAgICBcImVjb2xvZ2ljYWxMb3dDb3VudFwiOiAzNjEsXG4gICAgXCJlY29sb2dpY2FsTWlkQ291bnRcIjogMTYwLFxuICAgIFwiZWNvbG9naWNhbER1bmVDb3VudFwiOiAzLFxuICAgIFwiZWNvbG9naWNhbFBpbG90Q291bnRcIjogNTI0LFxuICAgIFwiZWNvbG9naWNhbENhbmRpZGF0ZUNvdW50XCI6IDU3NDIsXG4gICAgXCJtb3VudGFpbkluc3RhbmNlQ291bnRcIjogMjMxLFxuICAgIFwiY2FuZGlkYXRlQ291bnRcIjogMTA2NTY4LFxuICAgIFwicm9vdFNhbXBsZUNvdW50XCI6IDYxNzY4NSxcbiAgICBcIm1hdGVyaWFsU2FtcGxlQ291bnRcIjogNzA4MTQ1LFxuICAgIFwicmVjb3JkQnl0ZXNcIjogNDk0MDcyMCxcbiAgICBcInRlbXBsYXRlR3B1Qnl0ZXNcIjogMTg1NixcbiAgICBcInRvdGFsR3B1Qnl0ZXNcIjogNDk0MjU3NixcbiAgICBcIm1heGltdW1JbnN0YW5jZXNcIjogNjU1MzYsXG4gICAgXCJiYXNlVGVycmFpblRyaWFuZ2xlQ291bnRcIjogMjA3MzYsXG4gICAgXCJyZWZpbmVtZW50VHJpYW5nbGVDb3VudFwiOiAwLFxuICAgIFwiZWxhcHNlZE1pbGxpc2Vjb25kc1wiOiAzNzI1Ni4zMzM1MzMsXG4gICAgXCJ5aWVsZENvdW50XCI6IDM4MjIsXG4gICAgXCJyZWplY3Rpb25zXCI6IHtcbiAgICAgIFwiQk9VTkRBUllfQ09MTEFSXCI6IDEzMDQsXG4gICAgICBcIkJVU0hfSEFCSVRBVFwiOiAxLFxuICAgICAgXCJCVVNIX1JPT1RfQ09MTEFSXCI6IDMsXG4gICAgICBcIkRFTlNJVFlcIjogMTg1NTUsXG4gICAgICBcIkhBQklUQVRcIjogODE1NixcbiAgICAgIFwiUFJFU0VSVkVEX09SX1JFU0VSVkVEXCI6IDE3NTYsXG4gICAgICBcIlJFTkRFUkVEX1dBVEVSXCI6IDI3MTQ3LFxuICAgICAgXCJST09UX0NPTExBUlwiOiA1MFxuICAgIH0sXG4gICAgXCJjYW5vbmljYWxQb3B1bGF0aW9uQ2hhbmdlZFwiOiBmYWxzZSxcbiAgICBcImNhbWVyYUluZGVwZW5kZW50XCI6IHRydWUsXG4gICAgXCJyb290RW5jb2RpbmdcIjogXCJUV0VMVkVfQUNUVUFMX0ZMT0FUMzJfUkVOREVSRURfVFJJQU5HTEVfUk9PVF9IRUlHSFRTXCIsXG4gICAgXCJzcGFyc2VTb2lsUHJlc2VudGF0aW9uUnVsZVwiOiBcIlNPVVJDRV9DTEFTU19VTkNIQU5HRURfU09JTF9HVEVfMC4wMzVfQUNUVUFMX1NMT1BFX0xURV8wLjM1XCIsXG4gICAgXCJidXNoeVBvY2tldFJ1bGVcIjogXCJCUk9BRF9HVF8wLjU0X0xPQ0FMX0dUXzAuNDBfSEFTSF9MVF8wLjcwX1NFQ09ORF9BQ0NFUFRFRF9GQU5fU0VQQVJBVEVMWV9RVUFMSUZJRURcIlxuICB9LFxuICBcImVsYXBzZWRNaWxsaXNlY29uZHNcIjogMTU3MDkzLjAxOTMyMyxcbiAgXCJxdWFsaWZpY2F0aW9uQm91bmRhcmllc1wiOiB7XG4gICAgXCJhY3R1YWxCcm93c2VySW5zdGFuY2luZ1wiOiBcIlNFUEFSQVRFX1JFUVVJUkVEXCIsXG4gICAgXCJzaGFkZXJDb21waWxhdGlvblwiOiBcIlNFUEFSQVRFX1JFUVVJUkVEXCIsXG4gICAgXCJwaHlzaWNhbERldmljZVBlcmZvcm1hbmNlXCI6IFwiTk9UX0VTVEFCTElTSEVEXCJcbiAgfSxcbiAgXCJwcm9kdWN0TXV0YXRpb25QZXJmb3JtZWRcIjogZmFsc2UsXG4gIFwibWVyZ2VQZXJmb3JtZWRcIjogZmFsc2UsXG4gIFwiZGVwbG95bWVudFBlcmZvcm1lZFwiOiBmYWxzZSxcbiAgXCJleGVjdXRlZEhlYWRcIjogbnVsbCxcbiAgXCJiYXNlbGluZVwiOiBudWxsLFxuICBcInNvdXJjZURpZ2VzdHNcIjoge1xuICAgIFwic2hvd3Jvb20vZ2xvYmUvaC1lYXJ0aC9yZW5kZXIvbGFuZHNjYXBlLWdyb3VuZGNvdmVyLmdsb2JhbC12MS5qc1wiOiBcImM1ODcyNmVjNjgzYmRkYzkyNzhhMjgxYjA5OTU2ZDRmYjZjMDdlM2FlZTA1Y2VkMTgwN2M4NTk2NGNmNDRjZWRcIixcbiAgICBcInNob3dyb29tL2dsb2JlL2gtZWFydGgvcmVuZGVyL3BlcnNpc3RlbnQtbGl2ZS1yZW5kZXJlci5ydW44ZS1yM2MuY3AyLWFkZGl0aXZlLWJhbmRsaW1pdGVkLXJlbGllZi12Mi5qc1wiOiBcImI5ODdhYTIyMzhmNmY4ODRlN2FiZGMxMmI5MTUwMzU0OWVkYjYwYjgwYzAyNjIwZDI0YzRkYWI4OWM2Mjc4YjZcIixcbiAgICBcImgtZWFydGgtM2QvdmFsaWRhdGlvbi9oLWVhcnRoLmdsb2JhbC1ncm91bmRjb3Zlci52MS5tanNcIjogXCI5M2VmZTRhZWEwNjEwYzg0YmVjMzIzMzUxYjFmZGQ5ZDk0YzdjZTkzMWQ3YTRhMGQ2ZDU1ODRmYmRlMWRhNmMxXCJcbiAgfSxcbiAgXCJyYXdQYWNrYWdlTWlsbGlzZWNvbmRzXCI6IDE2MDAxLjcxODQ4NTk5OTk5OCxcbiAgXCJhY2NlcHRlZE92ZXJsYXlTb3VyY2VzVW5jaGFuZ2VkXCI6IGZhbHNlXG59XG4iLAogICAgICAic3RkZXJyVGFpbCI6ICJ7XCJwaGFzZVwiOlwiR0xPQkFMX0NPVkVSX0NPTVBMRVRFXCIsXCJpbnN0YW5jZUNvdW50XCI6NjE3NTksXCJ0b3RhbEdwdUJ5dGVzXCI6NDk0MjU3Nn1cbntcInBoYXNlXCI6XCJJTkRFUEVOREVOVF9ST09UX1ZFUklGSUNBVElPTlwiLFwiY29tcGxldGVkXCI6MCxcInRvdGFsXCI6NjE3NTl9XG57XCJwaGFzZVwiOlwiSU5ERVBFTkRFTlRfUk9PVF9WRVJJRklDQVRJT05cIixcImNvbXBsZXRlZFwiOjgxOTIsXCJ0b3RhbFwiOjYxNzU5fVxue1wicGhhc2VcIjpcIklOREVQRU5ERU5UX1JPT1RfVkVSSUZJQ0FUSU9OXCIsXCJjb21wbGV0ZWRcIjoxNjM4NCxcInRvdGFsXCI6NjE3NTl9XG57XCJwaGFzZVwiOlwiSU5ERVBFTkRFTlRfUk9PVF9WRVJJRklDQVRJT05cIixcImNvbXBsZXRlZFwiOjI0NTc2LFwidG90YWxcIjo2MTc1OX1cbntcInBoYXNlXCI6XCJJTkRFUEVOREVOVF9ST09UX1ZFUklGSUNBVElPTlwiLFwiY29tcGxldGVkXCI6MzI3NjgsXCJ0b3RhbFwiOjYxNzU5fVxue1wicGhhc2VcIjpcIklOREVQRU5ERU5UX1JPT1RfVkVSSUZJQ0FUSU9OXCIsXCJjb21wbGV0ZWRcIjo0MDk2MCxcInRvdGFsXCI6NjE3NTl9XG57XCJwaGFzZVwiOlwiSU5ERVBFTkRFTlRfUk9PVF9WRVJJRklDQVRJT05cIixcImNvbXBsZXRlZFwiOjQ5MTUyLFwidG90YWxcIjo2MTc1OX1cbntcInBoYXNlXCI6XCJJTkRFUEVOREVOVF9ST09UX1ZFUklGSUNBVElPTlwiLFwiY29tcGxldGVkXCI6NTczNDQsXCJ0b3RhbFwiOjYxNzU5fVxue1wicGhhc2VcIjpcIkdMT0JBTF9DT1ZFUl9DT01QTEVURVwiLFwiaW5zdGFuY2VDb3VudFwiOjYxNzU5LFwidG90YWxHcHVCeXRlc1wiOjQ5NDI1NzZ9XG4iLAogICAgICAicmVzdWx0IjogIlBBU1MiCiAgICB9LAogICAgewogICAgICAiaWQiOiAiRk9VUl9UUkVFX1JPT1QiLAogICAgICAic2NyaXB0IjogImgtZWFydGgtM2QvdmFsaWRhdGlvbi9oLWVhcnRoLmZvdXItdHJlZS1maW5lLWdyYXNzLnYxLm1qcyIsCiAgICAgICJhcmd1bWVudCI6ICItLXZlcmlmeSIsCiAgICAgICJleGl0Q29kZSI6IDAsCiAgICAgICJzaWduYWwiOiBudWxsLAogICAgICAic3Rkb3V0U2hhMjU2IjogIjJhYWIyMmQzN2YwZTc5ZmIyMTg5OTcyMjc4NDEzYjYwYmRkMjI0NWJkNTQzODQwNWFiYjcyZTJmY2ZkZWEzODMiLAogICAgICAic3Rkb3V0VGFpbCI6ICJ7XG4gIFwic2NoZW1hXCI6IFwiSF9FQVJUSF9GT1VSX1RSRUVfRklORV9HUkFTU19JTkRFUEVOREVOVF92MVwiLFxuICBcInJlc3VsdFwiOiBcIlBBU1NcIixcbiAgXCJjb25zdHJ1Y3Rpb25FeGVjdXRlZFwiOiB0cnVlLFxuICBcImNvbnRhY3RzXCI6IDQwNDk3MSxcbiAgXCJtYXhHcm91bmRFcnJvclwiOiA0Ljc2ODM1MTE4OTQ1NDczMzdlLTcsXG4gIFwiY29tYmluZWRHcmFzc0dwdUJ5dGVzXCI6IDgxMzE2ODAsXG4gIFwiZWxpZ2libGVDb3ZlcmFnZVByb2Jlc1wiOiAyNzUsXG4gIFwiY292ZXJlZFByb2Jlc1wiOiAyNzUsXG4gIFwib2NjdXBpZWRGb3VyTWV0cmVDZWxsc1wiOiAzNjAsXG4gIFwiY2xhc3Nlc1wiOiB7XG4gICAgXCJMT1dMQU5EX1NPSUxcIjogMzMzNTQ1LFxuICAgIFwiQ09BU1RBTF9TT0lMXCI6IDcxNDI2XG4gIH0sXG4gIFwic3VwcHJlc3NlZFwiOiAzODk3NixcbiAgXCJwcmVzZXJ2ZWRcIjogNjQ4NDYsXG4gIFwicHJlc2VydmVkVHlwZXNcIjoge1xuICAgIFwiMVwiOiAxOTIsXG4gICAgXCIyXCI6IDI1MjRcbiAgfSxcbiAgXCJ2aWV3c1wiOiBbXG4gICAge1xuICAgICAgXCJjYW1lcmFcIjoge1xuICAgICAgICBcInhcIjogLTEzOS40MDMsXG4gICAgICAgIFwieVwiOiA2LjA1OTIxNTc5NTIyODc4MSxcbiAgICAgICAgXCJ6XCI6IC0xOTQuNVxuICAgICAgfSxcbiAgICAgIFwicGFyZW50Q291bnRcIjogNzUzLFxuICAgICAgXCJjb250YWN0Q291bnRcIjogNDgwNDQsXG4gICAgICBcInZlcnRpY2VzXCI6IDkwMDg2NCxcbiAgICAgIFwidHJpYW5nbGVzXCI6IDYwMDU3NixcbiAgICAgIFwiZHJhd3NcIjogMyxcbiAgICAgIFwicGFja2VkUm9vdEJ5dGVzXCI6IDc3MTA3MixcbiAgICAgIFwic2VsZWN0aW9uVXBsb2FkQnl0ZXNcIjogNzg2NDMyXG4gICAgfSxcbiAgICB7XG4gICAgICBcImNhbWVyYVwiOiB7XG4gICAgICAgIFwieFwiOiAtMTM5LjQwMyxcbiAgICAgICAgXCJ5XCI6IDcuNDkzMTY1MjMyODM1NjI3NSxcbiAgICAgICAgXCJ6XCI6IC0yMzZcbiAgICAgIH0sXG4gICAgICBcInBhcmVudENvdW50XCI6IDkwMCxcbiAgICAgIFwiY29udGFjdENvdW50XCI6IDU3NTY3LFxuICAgICAgXCJ2ZXJ0aWNlc1wiOiAxMDk2NzA0LFxuICAgICAgXCJ0cmlhbmdsZXNcIjogNzMxMTM2LFxuICAgICAgXCJkcmF3c1wiOiAzLFxuICAgICAgXCJwYWNrZWRSb290Qnl0ZXNcIjogOTIxNjAwLFxuICAgICAgXCJzZWxlY3Rpb25VcGxvYWRCeXRlc1wiOiA5MzM4ODhcbiAgICB9LFxuICAgIHtcbiAgICAgIFwiY2FtZXJhXCI6IHtcbiAgICAgICAgXCJ4XCI6IC0xMTksXG4gICAgICAgIFwieVwiOiAxMS4xNzQ1Mzk3MjE0MTIwMTYsXG4gICAgICAgIFwielwiOiAtMjE2XG4gICAgICB9LFxuICAgICAgXCJwYXJlbnRDb3VudFwiOiA4NzgsXG4gICAgICBcImNvbnRhY3RDb3VudFwiOiA1NjEzMyxcbiAgICAgIFwidmVydGljZXNcIjogMTA3NTU4NCxcbiAgICAgIFwidHJpYW5nbGVzXCI6IDcxNzA1NixcbiAgICAgIFwiZHJhd3NcIjogMyxcbiAgICAgIFwicGFja2VkUm9vdEJ5dGVzXCI6IDg5OTA3MixcbiAgICAgIFwic2VsZWN0aW9uVXBsb2FkQnl0ZXNcIjogOTAxMTIwXG4gICAgfSxcbiAgICB7XG4gICAgICBcImNhbWVyYVwiOiB7XG4gICAgICAgIFwieFwiOiAtMTY0LFxuICAgICAgICBcInlcIjogNS4zMjMzOTE1MzMxODIxOTQsXG4gICAgICAgIFwielwiOiAtMjE2XG4gICAgICB9LFxuICAgICAgXCJwYXJlbnRDb3VudFwiOiA4ODQsXG4gICAgICBcImNvbnRhY3RDb3VudFwiOiA1NjUwMSxcbiAgICAgIFwidmVydGljZXNcIjogMTA3OTA0MCxcbiAgICAgIFwidHJpYW5nbGVzXCI6IDcxOTM2MCxcbiAgICAgIFwiZHJhd3NcIjogMyxcbiAgICAgIFwicGFja2VkUm9vdEJ5dGVzXCI6IDkwNTIxNixcbiAgICAgIFwic2VsZWN0aW9uVXBsb2FkQnl0ZXNcIjogOTE3NTA0XG4gICAgfSxcbiAgICB7XG4gICAgICBcImNhbWVyYVwiOiB7XG4gICAgICAgIFwieFwiOiAtMTQxLFxuICAgICAgICBcInlcIjogNy4zNDQ3NjcwMTY3NTAyOTgsXG4gICAgICAgIFwielwiOiAtMjE0XG4gICAgICB9LFxuICAgICAgXCJwYXJlbnRDb3VudFwiOiA4MjEsXG4gICAgICBcImNvbnRhY3RDb3VudFwiOiA1MjQzMCxcbiAgICAgIFwidmVydGljZXNcIjogOTcxMTM2LFxuICAgICAgXCJ0cmlhbmdsZXNcIjogNjQ3NDI0LFxuICAgICAgXCJkcmF3c1wiOiAzLFxuICAgICAgXCJwYWNrZWRSb290Qnl0ZXNcIjogODQwNzA0LFxuICAgICAgXCJzZWxlY3Rpb25VcGxvYWRCeXRlc1wiOiA4NTE5NjhcbiAgICB9XG4gIF0sXG4gIFwicXVhbGlmaWNhdGlvbkJvdW5kYXJpZXNcIjoge1xuICAgIFwiY2hlYXBUcmVlVGVycmFpblZpZXdzXCI6IFwiU0VQQVJBVEVfUkVRVUlSRURcIixcbiAgICBcInNoYXJlZFJlbmRlcmVyQnVkZ2V0c1wiOiBcIkFMTE9DQVRJT05fQU5EX1JFU0VSVkFUSU9OX0FVRElURURfQlJPV1NFUl9QRU5ESU5HXCIsXG4gICAgXCJhY3R1YWxCcm93c2VyXCI6IFwiU0VQQVJBVEVfUkVRVUlSRURcIixcbiAgICBcIm93bmVyQWNjZXB0YW5jZVwiOiBcIlBFTkRJTkdcIlxuICB9LFxuICBcIm1vZHVsZVNoYTI1NlwiOiBcIjdkYmViOGEzZjNjMWE3OGMyZWU1YmFmOGNkMWJjOTkwZTgxNzk3MzBhMjA4M2U0NDlhMzJiMGI3ZTgxMDFhODRcIixcbiAgXCJ3b3JsZFNoYTI1NlwiOiBcIjQ4Zjc1NGNhMWIxMWI4ZmU3ZWViMGU4ZDQ1NzNmNmI2Y2I1NDRjZjQzODMyMmExMTVlYjUyYzQ0ZDNiMjlkNWFcIlxufVxuIiwKICAgICAgInN0ZGVyclRhaWwiOiAiIiwKICAgICAgInJlc3VsdCI6ICJQQVNTIgogICAgfQogIF0sCiAgInJlc3VsdCI6ICJQQVNTIgp9Cg==';
function verifyWoodlandCheckpoint(bytes,head){
 if(head!==woodlandQualificationHead||crypto.createHash('sha256').update(bytes).digest('hex')!=='22e5be8d88fb3153be41c22e0e6efcbd0704d1f86b04579070699f7359a5659c')throw Error('WOODLAND_CHECKPOINT_IDENTITY_MISMATCH');
 const proof=JSON.parse(bytes.toString('utf8'));
 const expected=[['SOURCE_PARITY','h-earth-3d/validation/h-earth.canonical-base-world-precompute.v1.mjs','--verify-source'],['IMMUTABLE_WORLD_ROOT','h-earth-3d/validation/h-earth.global-groundcover.v1.mjs','--single-order'],['FOUR_TREE_ROOT','h-earth-3d/validation/h-earth.four-tree-fine-grass.v1.mjs','--verify']];
 if(proof.schema!=='H_EARTH_GEN2674_INDEPENDENT_WORLD_ROOT_QUALIFICATION_v1'||proof.candidateHead!==head||proof.result!=='PASS'||proof.actualNode22Execution!==true||proof.nodeVersion!=='v22.23.3'||proof.worldBinaryMustRemainUnchanged!==true||proof.steps?.length!==3||expected.some(([id,script,argument],i)=>{const step=proof.steps[i];return step.id!==id||step.script!==script||step.argument!==argument||step.exitCode!==0||step.signal!==null||step.result!=='PASS';}))throw Error('WOODLAND_CHECKPOINT_CONTENT_INVALID');
 return proof;
}
async function reuseWoodlandCheckpoint(head){
 const bytes=Buffer.from(woodlandCheckpointBase64,'base64'),proof=verifyWoodlandCheckpoint(bytes,head);
 if(Number(process.versions.node.split('.')[0])!==22)throw Error('WOODLAND_CHECKPOINT_RUNTIME_NOT_NODE22');
 if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==head)throw Error('WOODLAND_CHECKPOINT_HEAD_CHANGED');
 const changed=execFileSync('git',['diff','--name-only','HEAD','--','.',':(exclude)tools/h-earth-gen2-visual-qualify.mjs'],{encoding:'utf8'}).trim();if(changed)throw Error('WOODLAND_CHECKPOINT_TRACKED_PRODUCT_DIRTY:'+changed);
 const world=await fs.readFile('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz');if(crypto.createHash('sha256').update(world).digest('hex')!=='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a')throw Error('WOODLAND_CHECKPOINT_WORLD_CHANGED');
 await fs.writeFile(out+'/gen2674-independent-root-receipt.json',bytes);
 await fs.writeFile(out+'/four-tree-independent-root-receipt.json',JSON.stringify(proof.steps[2],null,2)+'\n');
 const wrapper={schema:'H_EARTH_EXACT_CANDIDATE_COMPLETED_CHECKPOINT_REUSE_v1',candidateHead:head,result:'PASS',reusedCompletedCheckpoint:true,freshValidatorExecution:false,currentNodeVersion:process.version,originalNodeVersion:proof.nodeVersion,originalReceiptSha256:'22e5be8d88fb3153be41c22e0e6efcbd0704d1f86b04579070699f7359a5659c',provenance:{runId:38482045351,artifactId:11858687226,artifactZipSha256:'938e5cd17b74627f76b5126d5bb15b0e34968ce9c3a207d994a34550184da806'},verifiedCurrentHead:true,trackedProductWorktreeClean:true,currentWorldBytesVerified:true,originalReceipt:proof};
 await fs.writeFile(out+'/completed-checkpoint-reuse.json',JSON.stringify(wrapper,null,2)+'\n');return wrapper;
}
async function runGen2674IndependentRootQualification(exactCandidateHead){
 if(exactCandidateHead===woodlandQualificationHead)return reuseWoodlandCheckpoint(exactCandidateHead);
 if(woodlandQualificationHeads.has(exactCandidateHead)&&Number(process.versions.node.split('.')[0])!==22)throw Error('WOODLAND_REQUIRES_ACTUAL_NODE22:'+process.version);
 const receipt={schema:'H_EARTH_GEN2674_INDEPENDENT_WORLD_ROOT_QUALIFICATION_v1',candidateHead:exactCandidateHead,
  actualNode22Execution:true,nodeVersion:process.version,worldBinaryMustRemainUnchanged:true,steps:[],result:'PENDING'};
 const plans=[['SOURCE_PARITY','h-earth-3d/validation/h-earth.canonical-base-world-precompute.v1.mjs','--verify-source'],
  ['IMMUTABLE_WORLD_ROOT','h-earth-3d/validation/h-earth.global-groundcover.v1.mjs','--single-order']];
 if(woodlandQualificationHeads.has(exactCandidateHead))plans.push(['FOUR_TREE_ROOT','h-earth-3d/validation/h-earth.four-tree-fine-grass.v1.mjs','--verify']);
 if(exactCandidateHead===sceneQualificationHead)plans.push(['FOUR_TREE_ROCK','h-earth-3d/validation/h-earth.four-tree-rock-presentation.v1.mjs','--verify']);
 try{
  for(const [id,script,arg] of plans){
   const completed=spawnSync(process.execPath,[script,arg],{encoding:'utf8',timeout:11*60*1000,maxBuffer:16*1024*1024});
   const stdout=completed.stdout||'',stderr=completed.stderr||'';
   const evidence={id,script,argument:arg,exitCode:completed.status,signal:completed.signal||null,
    stdoutSha256:crypto.createHash('sha256').update(stdout).digest('hex'),
    stdoutTail:stdout.slice(-12000),stderrTail:stderr.slice(-5000),
    result:completed.status===0&&!completed.error?'PASS':'FAIL'};
   receipt.steps.push(evidence);
   if(id==='FOUR_TREE_ROCK')await fs.writeFile(out+'/four-tree-independent-rock-receipt.json',JSON.stringify(evidence,null,2)+'\n');
   if(id==='FOUR_TREE_ROOT')await fs.writeFile(out+'/four-tree-independent-root-receipt.json',JSON.stringify(evidence,null,2)+'\n');
   if(evidence.result!=='PASS')throw Error('GEN2674_INDEPENDENT_'+id+'_FAILED:'+String(completed.error||stderr.slice(-1400)));
  }
  receipt.result='PASS';
 }catch(error){receipt.result='FAIL';receipt.error=String(error?.stack||error);throw error;}
 finally{await fs.writeFile(out+'/gen2674-independent-root-receipt.json',JSON.stringify(receipt,null,2)+'\n');}
 return receipt;
}

const gen2671MeadowHeads=Object.freeze({
 candidate:'9ef767ec30adce9004efe44b903cb68c426d4344',
 published:'37f9e9206a9a199b4ea11c4b06c6727704652114'
});
const gen2671MeadowHead=head=>Object.values(gen2671MeadowHeads).includes(head);
const gen2671MeadowTarget=Object.freeze({x:-45,z:-326,pitchDegrees:-8,verticalFovDegrees:56,yawTargetDegrees:0});
const wrappedMeadowYaw=x=>((x+180)%360+360)%360-180;
async function captureGen2671Meadow(page,observe,entry,head){
 const canvas=page.locator('#h-earth-functional-landscape-canvas'),box=await canvas.boundingBox();
 if(!box||box.width<250||box.height<300)throw Error('GEN2671_MEADOW_CANVAS_INVALID');
 const cx=box.x+box.width/2,cy=box.y+box.height/2;
 const read=async()=>{const r=await observe();if(!r.navigation||!r.position)throw Error('GEN2671_MEADOW_NAVIGATION_MISSING');return r;};
 const rotations=[],wheels=[];
 const origin=await read();
 if(Math.hypot(origin.position.x,origin.position.z+96)>.05)throw Error('GEN2671_MEADOW_WRONG_NATIVE_ORIGIN');
 // Turn rate is applied per animation frame. Stop based on actual heading,
 // never on a guessed wall-clock mouse hold duration.
 const setHeading=async(target,tolerance)=>{
  for(let attempt=0;attempt<8;attempt++){
   const before=await read(),err=wrappedMeadowYaw(target-before.navigation.yawDegrees);
   if(Math.abs(err)<=tolerance)return before.navigation.yawDegrees;
   const direction=Math.sign(err),fraction=Math.abs(err)<2?.022:.08;
   await page.mouse.move(cx,cy);await page.mouse.down();
   await page.mouse.move(cx+direction*box.width*fraction,cy,{steps:2});
   let sample=before;
   for(let tick=0;tick<125;tick++){
    await sleep(Math.abs(err)<2?15:25);
    sample=await read();
    const remaining=wrappedMeadowYaw(target-sample.navigation.yawDegrees);
    if(Math.abs(remaining)<=tolerance||remaining*direction<=0)break;
   }
   await page.mouse.up();await sleep(110);
   const after=await read(),change=wrappedMeadowYaw(after.navigation.yawDegrees-before.navigation.yawDegrees);
   rotations.push({target,attempt,from:before.navigation.yawDegrees,to:after.navigation.yawDegrees,change,sequence:after.navigation.sequence});
   if(after.navigation.sequence<=before.navigation.sequence||change*direction<=.04)
    throw Error('GEN2671_MEADOW_NATIVE_TURN_NO_ACCEPTED_PROGRESS:'+JSON.stringify(rotations.at(-1)));
  }
  const after=await read();
  if(Math.abs(wrappedMeadowYaw(target-after.navigation.yawDegrees))>tolerance)
   throw Error('GEN2671_MEADOW_MEASURED_HEADING_UNREACHED:'+JSON.stringify({target,actual:after.navigation.yawDegrees,rotations}));
  return after.navigation.yawDegrees;
 };
 const heading=await setHeading(-21,1.25);
 if(!(heading<=-14&&heading>=-34))throw Error('GEN2671_MEADOW_HEADING_OUT_OF_BOUNDS:'+heading);
 const rad=heading*Math.PI/180;
 const diagonalDistance=gen2671MeadowTarget.x/Math.sin(rad);
 if(!(diagonalDistance>=75&&diagonalDistance<=190))throw Error('GEN2671_MEADOW_DIAGONAL_DISTANCE_INVALID:'+diagonalDistance);
 const advance=async(label,remainingFn,componentFn)=>{
  let gainPerCommand=.5,completed=false;
  for(let step=0;step<180;step++){
   const before=await read(),remaining=remainingFn(before);
   if(remaining<=.32){completed=true;break;}
   const request=Math.min(10,Math.max(1,remaining/gainPerCommand));
   await page.mouse.move(cx,cy);await page.mouse.wheel(0,-request*70);
   let after=await read();
   for(let wait=0;wait<28&&after.navigation.sequence<=before.navigation.sequence;wait++){
    await sleep(85);after=await read();
   }
   const forward=componentFn(before,after),measured=Math.hypot(after.position.x-before.position.x,after.position.z-before.position.z);
   if(after.navigation.sequence<=before.navigation.sequence||forward<=.001||measured<.001)
    throw Error('GEN2671_MEADOW_NATIVE_WHEEL_STALLED:'+JSON.stringify({label,step,request,before:before.position,after:after.position}));
   gainPerCommand=Math.min(2,Math.max(.2,forward/request));
   if(!readiness(after)||!residencyReady(after.residency)||after.gpuFourTreeFloorCount!==4)
    throw Error('GEN2671_MEADOW_ACTUAL_GPU_RESIDENCY_REGRESSION');
   wheels.push({label,step,request,measured,forward,after:after.position});
   if(remainingFn(after)<-.85)throw Error('GEN2671_MEADOW_NATIVE_WHEEL_OVERSHOOT:'+JSON.stringify(wheels.at(-1)));
  }
  if(!completed&&remainingFn(await read())>.90)throw Error('GEN2671_MEADOW_NATIVE_WHEEL_INCOMPLETE:'+label);
 };
 // Heading is measured first; drive diagonally until exact X support,
 // then return to zero yaw and proceed inland to the requested Z.
 await advance('X_DIAGONAL',s=>s.position.x-gen2671MeadowTarget.x,(a,b)=>a.position.x-b.position.x);
 await setHeading(0,.18);
 await advance('Z_INLAND',s=>s.position.z-gen2671MeadowTarget.z,(a,b)=>a.position.z-b.position.z);
 const last=await read(),nav=await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getIntakeReceipt().currentNavigationState);
 const positionError=Math.hypot(last.position.x-gen2671MeadowTarget.x,last.position.z-gen2671MeadowTarget.z);
 if(positionError>1.25||Math.abs(wrappedMeadowYaw(nav.yawDegrees))>.20||
    Math.abs(nav.pitchDegrees-gen2671MeadowTarget.pitchDegrees)>.05||
    Math.abs(nav.verticalFovDegrees-gen2671MeadowTarget.verticalFovDegrees)>.01)
  throw Error('GEN2671_MEADOW_MATCHED_CAMERA_NOT_REACHED:'+JSON.stringify({positionError,nav,target:gen2671MeadowTarget}));
 if(!readiness(last)||!residencyReady(last.residency)||last.gpuFourTreeFloorCount!==4)
  throw Error('GEN2671_MEADOW_FINAL_GPU_INVALID');
 await sleep(500);
 const filename='gen2671-meadow-'+(head===gen2671MeadowHeads.candidate?'candidate':'published')+'-post-residency-canvas.png';
 const bytes=await canvas.screenshot({path:out+'/'+filename});
 if(bytes.length<1024)throw Error('GEN2671_MEADOW_PNG_EMPTY');
 entry.gen2671Meadow={schema:'H_EARTH_GEN2671_MEADOW_CAMERA_OBSERVATION_v1',head,filename,
  sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,
  target:gen2671MeadowTarget,position:nav.position,camera:nav,positionError,
  viewport:{width:412,height:915,deviceScaleFactor:2},
  residentBatchCount:last.residency.residentBatchCount,residentInstanceCount:last.residency.residentInstanceCount,
  droppedPlacementCount:last.residency.droppedPlacementCount,worldRebuildCount:last.residency.worldRebuildCount,
  rotations,wheels,ownerPerceptualDisposition:'PENDING'};
 await fs.writeFile(out+'/'+filename.replace('.png','.json'),JSON.stringify(entry.gen2671Meadow,null,2)+'\n');
}
// Gen2652 scoped read-only observation of already qualified product bytes.
// With no source-bound observer receipt, the registered legacy verifier is unchanged.
const walkingObserverReceiptPath='h-earth-3d/experience-anchor/receipts/h-earth-soil-expansion-walking-view-observer-20261011.receipt.json';
const walkingObserverReceipt=await fs.readFile(walkingObserverReceiptPath,'utf8').then(JSON.parse).catch(error=>{
 if(error?.code==='ENOENT')return null;
 throw error;
});
const walkingObserverActive=walkingObserverReceipt?.schema==='H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_v1'&&
 walkingObserverReceipt?.operationId==='H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_20261011_001'&&
 walkingObserverReceipt?.releaseEligible===false;
if(walkingObserverReceipt&&!walkingObserverActive)throw Error('INVALID_SOIL_WALKING_OBSERVER_RECEIPT');
const performanceCapture=walkingObserverReceipt?.performanceCapture??null;
const performanceCaptureActive=Boolean(walkingObserverActive&&performanceCapture?.schema==='H_EARTH_SOURCE_BOUND_DUAL_VEGETATION_PERFORMANCE_v1'&&performanceCapture?.enabled===true);
if(performanceCapture&&!performanceCaptureActive)throw Error('PERFORMANCE_CAPTURE_RECEIPT_INVALID');

const readiness=s=>Boolean(
  s?.routeReady&&s?.hasPublicRoute&&!s?.loadingScreen&&s?.canvas?.present&&
  s.canvas.visible&&s.canvas.width>=100&&s.canvas.height>=100&&
  s.webgl2Alive&&s.gpuPresentations>0&&!s.firstFailureStage
);
const residencyReady=r=>Boolean(
  r?.preparationComplete===true&&r?.validationStatus==='VALIDATED'&&
  r?.totalBatchCount===108&&r?.residentBatchCount===108&&
  r?.totalInstanceCount===27585&&r?.residentInstanceCount===27585&&
  r?.complete===true&&r?.droppedPlacementCount===0&&r?.worldRebuildCount===0
);
if(process.argv.includes('--self-test')){
  const example={routeReady:true,hasPublicRoute:true,loadingScreen:false,canvas:{present:true,visible:true,width:320,height:180},webgl2Alive:true,gpuPresentations:2,firstFailureStage:null};
  const complete={preparationComplete:true,validationStatus:'VALIDATED',totalBatchCount:108,residentBatchCount:108,totalInstanceCount:27585,residentInstanceCount:27585,complete:true,droppedPlacementCount:0,worldRebuildCount:0};
  if(!readiness(example)||readiness({...example,loadingScreen:true})||readiness({...example,canvas:{present:false}})||readiness({...example,gpuPresentations:0})||!residencyReady(complete)||residencyReady({...complete,residentBatchCount:2})||!isApprovedFourTreeGeometryBlob('c26247dcb69cb52c968fcd3ef6c2626eaa577d03')||isApprovedFourTreeGeometryBlob('02a2568e8a478fb9153ec29910266671ba349b01'))throw Error('GEN2638_QUALIFIER_SELF_TEST_FAILED');
  const checkpoint=Buffer.from(woodlandCheckpointBase64,'base64');verifyWoodlandCheckpoint(checkpoint,woodlandQualificationHead);
  for(const [bytes,head] of [[Buffer.concat([checkpoint,Buffer.from(' ')]),woodlandQualificationHead],[checkpoint,'wrong-head']]){let rejected=false;try{verifyWoodlandCheckpoint(bytes,head);}catch{rejected=true;}if(!rejected)throw Error('WOODLAND_CHECKPOINT_NEGATIVE_TEST_FAILED');}
  const fixture={beforeSha256:'6b57b514fbeeea633b6f8c9006b58b34bbd87b6a6420c2f32202cf1262cfb9cf',afterSha256:'e78adffbb354de9173e2c2de343d3aea4b25d46dc57ee0d546da45dc1236a08c',waypointCount:5,canonicalGotoImplementationUnchanged:true};
  if(!woodlandFixturesMatch([fixture])||!woodlandFixturesMatch([fixture,fixture])||!woodlandFixturesMatch(Array(4).fill(fixture))||woodlandFixturesMatch([])||woodlandFixturesMatch(Array(5).fill(fixture))||woodlandFixturesMatch([fixture,{...fixture,afterSha256:'mismatch'}]))throw Error('WOODLAND_MULTI_REQUEST_FIXTURE_SELF_TEST_FAILED');
  const w={gpuResidency:{woodlandFineGrassReady:true},woodland:{ready:true,visibleContacts:1,visibleInstanceCount:1,drawCallCount:3,selectionSignature:'0:0:1024:0:500,1:200,2:100',submittedTriangles:4,combinedGrassGpuBytes:8131680},globalCover:{visibleInstanceCount:3072,drawCallCount:3}};
  if(!woodlandReady(w)||woodlandReady({...w,gpuResidency:{woodlandFineGrassReady:false}})||woodlandReady({...w,woodland:{...w.woodland,visibleContacts:0}})||woodlandReady({...w,woodland:{...w.woodland,combinedGrassGpuBytes:8388609}})||new Set(woodlandViews.map(v=>v.id)).size!==5)throw Error('WOODLAND_SELF_TEST_FAILED');
  const rockExample={rocks:{rockCount:14,vertices:868,triangles:1680,suppressedTriangles:224,preservedOriginalRockTriangles:336,originalWorldChanged:false,gpuByteLength:80052,combinedSceneGpuBytes:8211732,mainDrawCount:2,shadowDrawCount:1,drawsPerFrame:1}};
  if(!woodlandRocksReady(rockExample)||woodlandRocksReady({})||[...['rockCount','vertices','triangles','suppressedTriangles','preservedOriginalRockTriangles','gpuByteLength','combinedSceneGpuBytes','mainDrawCount','shadowDrawCount','drawsPerFrame'].map(k=>({...rockExample,rocks:{...rockExample.rocks,[k]:0}})),{rocks:{...rockExample.rocks,originalWorldChanged:true}}].some(woodlandRocksReady))throw Error('WOODLAND_ROCK_RECEIPT_SELF_TEST_FAILED');
  console.log(JSON.stringify({schema:'H_EARTH_GEN2_VISUAL_QUALIFIER_SELF_TEST_v1',result:'PASS',loadingOverlayRejected:true,missingGpuRejected:true,incompleteResidencyRejected:true}));
}else{
 const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const woodlandQualificationActive=woodlandQualificationHeads.has(sha);
 const gen2674QualificationActive=gen2674QualificationHeads.has(sha)||woodlandQualificationActive;
 if(performanceCaptureActive){
  const executingBlob=execFileSync('git',['hash-object',process.argv[1]],{encoding:'utf8'}).trim();
  const targetToolBlob=execFileSync('git',['rev-parse','HEAD:tools/h-earth-gen2-visual-qualify.mjs'],{encoding:'utf8'}).trim();
  if(executingBlob!==walkingObserverReceipt.sourceBoundVerifier?.gitBlob||targetToolBlob!==executingBlob)
   throw Error('PERFORMANCE_CAPTURE_VERIFIER_SOURCE_IDENTITY_MISMATCH');
 }
 const geometryBlob=execFileSync('git',['rev-parse','HEAD:showroom/globe/h-earth/render/geometry-landscape-sector.p2.js'],{encoding:'utf8'}).trim();
 const fourOnly=productHeads.has(sha)||isApprovedFourTreeGeometryBlob(geometryBlob);
 if(walkingObserverActive){
  if(!fourOnly)throw Error('WALKING_OBSERVER_REQUIRES_APPROVED_FOUR_TREE_PRODUCT');
  for(const [path,expectedBlob] of Object.entries(walkingObserverReceipt.exactProtectedBlobs||{})){
   const actualBlob=execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim();
   if(actualBlob!==expectedBlob)throw Error('WALKING_OBSERVER_PROTECTED_SOURCE_MISMATCH:'+path);
  }
 }

 const receipt={schema:'H_EARTH_GEN2_VISUAL_QUALIFICATION_v1',candidateHead:sha,actualBrowserExecution:false,productMode:fourOnly?'GEN2638_FOUR_TREES':'GEN2',views:[],result:'PENDING',physicalAndroidQualified:false};
 let server=null,browser=null;
 await fs.mkdir(out,{recursive:true});
 try{
  if(gen2674QualificationActive)receipt.independentRoot=await runGen2674IndependentRootQualification(sha);
  if(fourOnly){
   // The registered workflow checks out the candidate with fetch-depth:1.
   // The established independent tree verifier compares against an immutable
   // production baseline, so materialize only that exact commit when absent.
   // This changes local git object availability, not the candidate worktree.
   const baseline='23eb1bb79c13b2d79e7006e2d9bf664ecf31aed2';
   const baselineObject=baseline+'^{commit}';
   try{execFileSync('git',['cat-file','-e',baselineObject],{stdio:'ignore'});}
   catch{execFileSync('git',['fetch','--no-tags','--depth=1','origin',baseline],{stdio:'ignore',timeout:120000});}
   execFileSync('git',['cat-file','-e',baselineObject],{stdio:'ignore'});
   const proof=JSON.parse(execFileSync(process.execPath,['showroom/globe/h-earth/validation/four-tree-only.verify.mjs'],{encoding:'utf8',timeout:180000,maxBuffer:2*1024*1024}));
   if(proof.result!=='PASS'||proof.approvedCount!==4||proof.oldVisibleTreeCount!==0||proof.approvedGeometryUnchanged!==true||proof.deferredConiferGpuDrawExcluded!==true||approvedIds.some(id=>!proof.approvedTreeIds.includes(id)))throw Error('FOUR_TREE_SOURCE_CENSUS_FAILED');
   receipt.sourceTreeCensus={approvedIds:proof.approvedTreeIds,approvedCount:4,oldVisibleTreeCount:0,approvedGeometryUnchanged:true,legacyConiferDrawFilterPresent:true};
  }
  server=spawn('python3',['-m','http.server','4173','--bind','127.0.0.1','--directory','.'],{stdio:'ignore'});
  let serving=false;
  for(let i=0;i<80;i++){try{serving=(await fetch('http://127.0.0.1:4173/showroom/globe/h-earth/')).ok;if(serving)break;}catch{}await sleep(250);}
  if(!serving)throw Error('GEN2638_STAGE_NOT_SERVING');
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  receipt.actualBrowserExecution=true;
  const views=gen2674QualificationActive?[{id:'gen2674-meadow',query:'',x:-45,z:-326}]:fourOnly?[
   {id:'approved-four-tree-clearing',query:'?arrival=approved-four-trees',x:-139.40267987050615,z:-194.5},
   {id:'coast',query:'',x:0,z:-96}
  ]:[{id:'coast',query:'',x:null,z:null}];
  for(const v of views){
   const context=await browser.newContext({viewport:{width:412,height:915},deviceScaleFactor:2,isMobile:true,hasTouch:true});
   const page=await context.newPage();
   const entry={id:v.id,result:'PENDING',progress:[],errors:[],failedRequests:[]};
   receipt.views.push(entry);
   page.on('pageerror',error=>entry.errors.push(String(error?.message||error)));
   page.on('console',msg=>{if(msg.type()==='error')entry.errors.push('console:'+msg.text())});
   page.on('requestfailed',req=>entry.failedRequests.push({url:req.url(),failure:req.failure()}));
   try{
    let gen2674TestCameraOverrides=0;
    if(gen2674QualificationActive){
     await page.route('**/functional-landscape/navigation.js*',async route=>{
      const response=await route.fetch();
      const source=await response.text();
      const original="COAST:{waypointId:'COAST',label:'Coastal entry',position:{x:0,z:-96},yawDegrees:0,pitchDegrees:-8}";
      const meadow="COAST:{waypointId:'COAST',label:'Coastal entry',position:{x:-45,z:-326},yawDegrees:0,pitchDegrees:-8}";
      if(source.split(original).length!==2)throw Error('GEN2674_TEST_CAMERA_SOURCE_BINDING_MISSING');
      gen2674TestCameraOverrides++;
      let body=source.replace(original,meadow);
      if(woodlandQualificationActive){
       const marker='export function proposeHEarthFunctionalLandscapeNavigation(current,intent={}){';
       if(body.split(marker).length!==2)throw Error('WOODLAND_NAVIGATION_FIXTURE_BINDING_MISSING');
       const waypoints=woodlandViews.map(v=>`QUALIFIER_${v.id}:{waypointId:'QUALIFIER_${v.id}',position:{x:${v.x},z:${v.z}},yawDegrees:${v.yawDegrees},pitchDegrees:${v.pitchDegrees}}`).join(',');
       body=body.replace(meadow,meadow+','+waypoints).replace(marker,marker+"if(globalThis.__hEarthQualifierWaypoint){intent={action:'GOTO_WAYPOINT',waypointId:globalThis.__hEarthQualifierWaypoint};delete globalThis.__hEarthQualifierWaypoint;}");
      }
      if(woodlandQualificationActive){entry.navigationFixtures??=[];entry.navigationFixtures.push({url:route.request().url(),beforeSha256:crypto.createHash('sha256').update(source).digest('hex'),afterSha256:crypto.createHash('sha256').update(body).digest('hex'),waypointCount:5,canonicalGotoImplementationUnchanged:true});}
      await route.fulfill({response,body});
     });
    }
    const profilingQuery=performanceCaptureActive?(v.query?v.query+'&performance=1':'?performance=1'):v.query;
    await page.goto('http://127.0.0.1:4173/showroom/globe/h-earth/'+profilingQuery,{waitUntil:'domcontentloaded',timeout:90000});
    const observePerformance=()=>page.evaluate(()=>{
     const report=window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getPerformanceReport?.()??null;
     const resources=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.resources??null;
     return {report,globalGroundCover:resources?.globalGroundCover??null,vegetationResidency:resources?.vegetationResidency??null};
    });
    const observe=()=>page.evaluate((profiled)=>{
     const root=document.getElementById('h-earth-functional-landscape-route');
     const canvas=document.getElementById('h-earth-functional-landscape-canvas');
     const loader=document.querySelector('.h-earth-experience-loader');
     const route=window.H_EARTH_RUN8E_PUBLIC_ROUTE;
     const gpu=route?.getLiveGpuReceipt?.()||null;
     const rect=canvas?.getBoundingClientRect();
     const style=canvas?getComputedStyle(canvas):null;
     // Existing WebGL observer rewraps GL methods on each getContext call.
     // Never call it repeatedly while measuring those same methods.
     let gl=null;
     if(!profiled){try{gl=canvas?.getContext('webgl2')}catch{}}
     const rendererContext=gpu?.resources?.context??null;
     const startup=window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()||null;
     return {
      routeReady:root?.dataset.run8eReady==='true',
      routeError:root?.dataset.run8eError==='true',
      loadingScreen:Boolean(loader&&loader.isConnected&&loader.dataset.ready!=='true'&&getComputedStyle(loader).visibility!=='hidden'),
      loaderProgress:loader?.querySelector('.h-earth-experience-loader__percent')?.textContent||null,
      hasPublicRoute:Boolean(route?.getLiveGpuReceipt&&route?.getIntakeReceipt),
      canvas:{present:canvas instanceof HTMLCanvasElement,width:canvas?.width||0,height:canvas?.height||0,visible:Boolean(rect&&rect.width>0&&rect.height>0&&style?.visibility!=='hidden'&&style?.display!=='none')},
      webgl2Alive:profiled?Boolean(rendererContext?.created===true&&rendererContext?.lost===false):Boolean(gl&&!gl.isContextLost()),
      gpuPresentations:gpu?.counters?.gpuFramebufferPresentationCount??0,lastFrame:gpu?.frameRecords?.at(-1)??null,
      gpuFourTreeFloorCount:gpu?.resources?.landscapeFloor?.treeCount??null,
      clearingGpuReady:gpu?.resources?.woodlandClearing?.ready===true,
      clearingCasterIndexCount:gpu?.resources?.woodlandClearing?.casterIndexCount??null,
      firstFailureStage:startup?.firstFailureStage||null,
      position:route?.getIntakeReceipt?.()?.currentNavigationState?.position||null,
      navigation:(()=>{const n=route?.getIntakeReceipt?.()?.currentNavigationState;return n?{yawDegrees:n.yawDegrees,pitchDegrees:n.pitchDegrees,verticalFovDegrees:n.verticalFovDegrees,position:n.position,sequence:n.sequence,accepted:n.accepted,action:n.action,targetCameraY:n.targetCameraY,terrainSupported:n.terrainSupported,visibleTerrainElevation:n.visibleTerrainElevation,minimumCameraY:n.minimumCameraY,clearance:n.clearance}:null})(),
      navigationProposals:(route?.getIntakeReceipt?.()?.proposals||[]).slice(-16).map(p=>({sequence:p.sequence,inputClass:p.inputClass,action:p.intent?.action,accepted:p.accepted})),
      woodland:gpu?.resources?.woodlandFineGrass??null,rocks:gpu?.resources?.woodlandRocks??null,globalCover:gpu?.resources?.globalGroundCover??null,gpuResidency:gpu?.resources?.vegetationResidency??null,
      residencyStatus:root?.dataset.vegetationResidency||null,
      residency:route?.getVegetationResidency?.()||null
     };
    },performanceCaptureActive);
    let snap,ready=false;
    const startupBegin=Date.now();
    for(let k=0;k<90;k++){
     snap=await observe();
     if(k%5===0)entry.progress.push({phase:'STARTUP',elapsedMs:Date.now()-startupBegin,loader:snap.loaderProgress,ready:snap.routeReady,frames:snap.gpuPresentations});
     if(readiness(snap)){ready=true;break}
     if(snap.routeError||snap.firstFailureStage)break;
     await sleep(2000);
    }
    entry.readiness={pass:ready,snapshot:snap};
    if(!ready){await page.screenshot({path:out+'/'+v.id+'-loading-or-error.png',fullPage:true});throw Error('ACTUAL_WORLD_NOT_RENDERED_LOADING_SCREEN_REJECTED')}
    if(performanceCaptureActive){
     entry.performanceAtReady=await observePerformance();
     if(entry.performanceAtReady?.report?.schema!=='H_EARTH_DEVICE_PERFORMANCE_REPORT_v1'||
        entry.performanceAtReady.report.performanceEnabled!==true||
        entry.performanceAtReady.report.startup?.firstFailureStage)
       throw Error('PERFORMANCE_CAPTURE_READY_DIAGNOSTIC_MISSING_OR_FAILED');
    }
    if(v.x!==null&&(!snap.position||Math.abs(snap.position.x-v.x)>0.03||Math.abs(snap.position.z-v.z)>0.03))throw Error('GEN2638_ARRIVAL_POSITION_MISMATCH:'+JSON.stringify(snap.position));
    if(gen2674QualificationActive){
     const nav=snap.navigation;
     if(gen2674TestCameraOverrides<1||gen2674TestCameraOverrides>4||!nav||
        !Number.isFinite(nav.yawDegrees)||!Number.isFinite(nav.pitchDegrees)||!Number.isFinite(nav.verticalFovDegrees)||
        Math.abs(nav.yawDegrees-gen2674MeadowTarget.yawDegrees)>.02||
        Math.abs(nav.pitchDegrees-gen2674MeadowTarget.pitchDegrees)>.02||
        Math.abs(nav.verticalFovDegrees-gen2674MeadowTarget.verticalFovDegrees)>.02)
      throw Error('GEN2674_BOUNDED_TEST_CAMERA_NOT_ACTUAL:'+JSON.stringify({gen2674TestCameraOverrides,nav}));
    }
    if(fourOnly){
     entry.gpuTreeCensus={treeCount:snap.gpuFourTreeFloorCount,clearingReady:snap.clearingGpuReady,casterIndexCount:snap.clearingCasterIndexCount};
     if(snap.gpuFourTreeFloorCount!==4||snap.clearingGpuReady!==true||!(snap.clearingCasterIndexCount>0))throw Error('GEN2638_ACTUAL_GPU_FLOOR_OR_CLEARING_CENSUS_FAILED');
    }
    entry.position=snap.position;
    const image=await page.locator('#h-earth-functional-landscape-canvas').screenshot({path:out+'/'+v.id+'-ready-canvas.png'});
    if(image.length<1024)throw Error('ACTUAL_GPU_CANVAS_IMAGE_EMPTY');
    await page.screenshot({path:out+'/'+v.id+'-ready-page.png',fullPage:true});
    if(fourOnly){
     const started=Date.now();let previous=-1;
     while(Date.now()-started<9*60*1000){
      snap=await observe();
      const n=snap.residency?.residentBatchCount??0;
      if(n!==previous){entry.progress.push({phase:'RESIDENCY',elapsedMs:Date.now()-started,completedBatches:n,totalBatches:snap.residency?.totalBatchCount||null,instances:snap.residency?.residentInstanceCount||0});previous=n;}
      if(snap.residencyStatus==='failed'||snap.firstFailureStage)throw Error('GEN2638_VEGETATION_FAILED');
      if(residencyReady(snap.residency)&&(!woodlandQualificationActive||snap.gpuResidency?.woodlandFineGrassReady===true))break;
      await sleep(2000);
     }
     entry.residency=snap.residency;
     if(performanceCaptureActive&&residencyReady(snap.residency)){
      entry.performanceAtFullResidency=await observePerformance();
      const p=entry.performanceAtFullResidency;
      if(p?.report?.schema!=='H_EARTH_DEVICE_PERFORMANCE_REPORT_v1'||p.report.performanceEnabled!==true||
         p.report.startup?.firstFailureStage||p.vegetationResidency?.residentBatchCount!==108||
         p.vegetationResidency?.residentInstanceCount!==27585||p.globalGroundCover?.prepared!==true||
         p.vegetationResidency?.canonicalPreparationTiming?.status!=='READY')
        throw Error('PERFORMANCE_CAPTURE_FULL_RESIDENCY_DIAGNOSTIC_MISSING_OR_FAILED');
      entry.performanceContract={schema:'H_EARTH_SOURCE_BOUND_DUAL_VEGETATION_PERFORMANCE_v1',sourceBound:true,deviceClass:'HEADLESS_CHROMIUM_NOT_PHYSICAL_ANDROID',capturedAtReady:true,capturedAfterFullResidency:true,canonicalWorkerTimings:true,oasisPreparationMilestones:true,globalGroundCoverTimings:true,strictUnchangedFourTreeAndVegetationAssertions:true};
     }
     if(!residencyReady(snap.residency)||(woodlandQualificationActive&&snap.gpuResidency?.woodlandFineGrassReady!==true)){
      if(performanceCaptureActive)entry.performanceAtIncompleteResidency=await observePerformance();
      await page.screenshot({path:out+'/'+v.id+'-incomplete-residency.png',fullPage:true});
      throw Error('GEN2638_DEFERRED_RESIDENCY_INCOMPLETE');
     }
     if(!readiness(snap))throw Error('GEN2638_POST_RESIDENCY_RENDERER_NOT_READY');
     if(snap.gpuFourTreeFloorCount!==4||snap.clearingGpuReady!==true||!(snap.clearingCasterIndexCount>0))throw Error('GEN2638_POST_RESIDENCY_GPU_TREE_CENSUS_FAILED');
     const post=await page.locator('#h-earth-functional-landscape-canvas').screenshot({path:out+'/'+v.id+'-post-residency-canvas.png'});
     if(post.length<1024)throw Error('POST_RESIDENCY_GPU_IMAGE_EMPTY');
     await page.screenshot({path:out+'/'+v.id+'-post-residency-page.png',fullPage:true});
     if(gen2674QualificationActive){
      const actual=await observe();
      if(!readiness(actual)||!residencyReady(actual.residency)||
         actual.residency?.residentBatchCount!==108||actual.residency?.residentInstanceCount!==27585)
       throw Error('GEN2674_MEADOW_POST_RESIDENCY_OR_WEBGL2_INCOMPLETE');
      entry.gen2674Meadow={schema:'H_EARTH_GEN2674_MEADOW_CAMERA_OBSERVATION_v1',candidateHead:sha,
       target:gen2674MeadowTarget,actualPosition:actual.position,actualCamera:actual.navigation,
       viewport:{width:412,height:915,deviceScaleFactor:2},
       canvasFilename:'gen2674-meadow-post-residency-canvas.png',
       canvasSha256:crypto.createHash('sha256').update(post).digest('hex'),canvasBytes:post.length,
       postResidencyBatchCount:actual.residency.residentBatchCount,
       postResidencyInstanceCount:actual.residency.residentInstanceCount,
       testOnlyNavigationModuleResponseIntercepted:true,productionNavigationUnchanged:true,
       ownerPerceptualDisposition:'PENDING'};
      await fs.writeFile(out+'/gen2674-meadow-camera-receipt.json',JSON.stringify(entry.gen2674Meadow,null,2)+'\n');
      if(woodlandQualificationActive){if(!woodlandFixturesMatch(entry.navigationFixtures))throw Error('WOODLAND_FIXTURE_SOURCE_BINDING:'+JSON.stringify(entry.navigationFixtures));entry.sceneRefinement=sha===sceneQualificationHead;await captureWoodlandViews(page,observe,entry);}
     }
     if(v.id==='coast'&&gen2671MeadowHead(sha))await captureGen2671Meadow(page,observe,entry,sha);
     // The owner-requested question is soil quality OUTSIDE the reference,
     // not whether the 32m border is merely concealed. The existing
     // canonical wheel/navigation APIs supply true WebGL2 positions.
     if(v.id==='approved-four-tree-clearing'&&walkingObserverActive){
       entry.walkingExpansion={schema:'H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_v1',receiptSource:walkingObserverReceiptPath,referencePosition:snap.position,views:[]};
       const canvas=page.locator('#h-earth-functional-landscape-canvas');
       const box=await canvas.boundingBox();
       if(!box||box.width<150||box.height<150)throw Error('WALKING_OBSERVER_CANVAS_GEOMETRY_MISSING');
       const midX=box.x+box.width*0.53,midY=box.y+box.height*0.53;
       await page.mouse.move(midX,midY);
       const initialZ=v.z;
       entry.walkingExpansion.nativeWheelPulses=[];
       for(let step=1;step<=7;step++){
         const expectedZ=initialZ+10*step;
         let current=await observe();
         let lastAdvanceAt700=null;
         for(let pulse=0;pulse<4;pulse++){
           if(!current?.position||!current?.navigation)throw Error('WALKING_OBSERVER_NAVIGATION_RECEIPT_MISSING:'+step);
           const remaining=expectedZ-current.position.z;
           if(Math.abs(remaining)<0.08)break;
           if(remaining<0)throw Error('WALKING_OBSERVER_WHEEL_OVERSHOT:'+JSON.stringify({step,expectedZ,current:current.position}));
           const requestedWheelDeltaY=pulse===0?700:Math.max(70,Math.min(700,Math.round(700*remaining/lastAdvanceAt700)));
           const before=current;
           await page.mouse.wheel(0,requestedWheelDeltaY);
           for(let attempt=0;attempt<36;attempt++){
             current=await observe();
             if(current?.position?.z>before.position.z+0.001&&
                current?.navigation?.sequence>before.navigation.sequence)break;
             await sleep(250);
           }
           const advance=(current?.position?.z??-Infinity)-before.position.z;
           if(!(advance>0.001)||current?.navigation?.sequence<=before.navigation.sequence)
             throw Error('WALKING_OBSERVER_NATIVE_WHEEL_NO_ACCEPTED_PROGRESS:'+JSON.stringify({step,pulse,requestedWheelDeltaY,before:before.position,after:current?.position}));
           if(current.position.z>expectedZ+0.08)
             throw Error('WALKING_OBSERVER_NATIVE_WHEEL_OVERSHOOT:'+JSON.stringify({step,pulse,expectedZ,actual:current.position}));
           lastAdvanceAt700=advance*700/requestedWheelDeltaY;
           entry.walkingExpansion.nativeWheelPulses.push({step,pulse:pulse+1,requestedWheelDeltaY,actualAdvanceMeters:advance,actualPosition:current.position,actualNavigationSequence:current.navigation.sequence});
           if(!readiness(current)||!residencyReady(current.residency)||current.gpuFourTreeFloorCount!==4)
             throw Error('WALKING_OBSERVER_GPU_OR_VEGETATION_RESIDENCY_REGRESSION:'+step);
         }
         if(!current?.position||Math.abs(current.position.z-expectedZ)>=0.08)
           throw Error('WALKING_OBSERVER_NAVIGATION_REJECTED_OR_DRIFT:'+JSON.stringify({step,expectedZ,actual:current?.position}));
         if(!readiness(current)||!residencyReady(current.residency)||current.gpuFourTreeFloorCount!==4)
           throw Error('WALKING_OBSERVER_GPU_OR_VEGETATION_RESIDENCY_REGRESSION:'+step);
         // Native one-finger PITCH_DOWN is judged by accepted movement,
         // not by an unrelated requirement to pass through absolute zero.
         if(step===2){
           const beforePitch=current.navigation?.pitchDegrees;
           if(!Number.isFinite(beforePitch))throw Error('WALKING_OBSERVER_PITCH_SOURCE_MISSING');
           await page.mouse.move(midX,midY-110);
           await page.mouse.down();
           await page.mouse.move(midX,midY+100,{steps:10});
           await sleep(650);
           await page.mouse.up();
           await page.mouse.move(midX,midY);
           current=await observe();
           const downAccepted=current.navigationProposals?.some(p=>p.inputClass==='ONE_FINGER_LOOK'&&p.action==='PITCH_DOWN'&&p.accepted===true);
           if(!downAccepted||!Number.isFinite(current?.navigation?.pitchDegrees)||current.navigation.pitchDegrees>=beforePitch-0.1)
             throw Error('WALKING_OBSERVER_REAL_PITCH_DOWN_NOT_APPLIED:'+JSON.stringify({beforePitch,after:current?.navigation,pitchProposals:current?.navigationProposals}));
         }
         if([1,2,4,7].includes(step)){
           await sleep(750);
           const after=await observe();
           if(!readiness(after)||!residencyReady(after.residency))throw Error('WALKING_OBSERVER_POST_NAV_RENDERER_NOT_READY:'+step);
           const filename='approved-four-tree-clearing-outside-north-'+(step*10)+'m-canvas.png';
           const bytes=await canvas.screenshot({path:out+'/'+filename});
           entry.walkingExpansion.views.push({
             id:'NORTH_'+(step*10)+'M',distanceFromReferenceMeters:step*10,filename,
             sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
             actualCameraPosition:after.position,actualCameraOrientation:after.navigation,
             gpuPresentations:after.gpuPresentations,
             residentBatchCount:after.residency?.residentBatchCount,
             residentInstanceCount:after.residency?.residentInstanceCount,
             approvedTreeCount:after.gpuFourTreeFloorCount
           });
         }
       }
       if(entry.walkingExpansion.views.length!==4)throw Error('WALKING_OBSERVER_MISSING_FOUR_ACTUAL_VIEWS');
     }

    }
    if(entry.errors.length||entry.failedRequests.length)throw Error('GEN2638_BROWSER_ERRORS_OR_REQUEST_FAILURES');
    entry.result='PASS';
   }catch(error){entry.result='FAIL';entry.error=String(error?.stack||error);throw error;}
   finally{await context.close()}
  }
  receipt.result='PASS';
  receipt.limitations=['Actual screenshots require perceptual inspection for individual tree silhouettes','Headless Chromium is not physical Android performance'];
 }catch(error){receipt.result='FAIL';receipt.error=String(error?.stack||error);process.exitCode=1;}
 finally{
  try{await browser?.close()}catch{}
  server?.kill('SIGTERM');
  await fs.writeFile(out+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
  console.log('H_EARTH_GEN2_VISUAL_QUALIFICATION_EVIDENCE '+JSON.stringify(receipt));
  if(receipt.result!=='PASS')process.exitCode=1;
 }
}
