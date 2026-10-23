/* DiamondGate Preflight | intentionally unsigned, local-only intent continuity.
 * Reconstruction under admitted scope; original lost source checksum NOT claimed.
 * Compatibility is NOT_VERIFIED without a documented, tested adapter. */
(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.PreflightCore=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="DGB_PREFLIGHT_USER_APPROVED_SNAPSHOT_v0_1";
  const STATE_SCHEMA="DGB_PREFLIGHT_LOCAL_DRAFT_v0_1";
  const NOT_VERIFIED="NOT_VERIFIED";
  const CATEGORIES=["3d","video","app","image","audio","writing","agent"];
  function plain(value){return String(value??"").replace(/\s+/g," ").trim();}
  function distinct(items){const out=[],seen=new Set();for(const raw of Array.isArray(items)?items:[]){const value=plain(raw);if(!value)continue;const key=value.toLocaleLowerCase("en");if(!seen.has(key)){seen.add(key);out.push(value);}}return out;}
  function snapshot(input={}){
    const category=CATEGORIES.includes(input.category)?input.category:"3d";
    const platform=plain(input.model)||"Unspecified / Other";
    const rawDuration=plain(input.duration);
    const duration=rawDuration!==""&&Number.isInteger(Number(rawDuration))&&Number(rawDuration)>0&&Number(rawDuration)<=120?String(Number(rawDuration)):"";
    return {schema:SCHEMA,projectName:plain(input.projectName),category,goal:plain(input.goal),
      protected:distinct(input.protected),allowed:distinct(input.allowed),model:platform,
      customModel:plain(input.customModel),duration:category==="video"?duration:""};
  }
  function key(snapshotValue){const x=snapshot(snapshotValue);return JSON.stringify(x);}
  function compare(approved,current){
    if(!approved)return {approved:false,changed:true,protectedChanged:false,changes:["No approved baseline yet."],material:true};
    const a=snapshot(approved),b=snapshot(current),changes=[];
    const labels={projectName:"Project name",category:"Type of work",goal:"Project goal",protected:"Protected requirements",allowed:"Permitted changes",model:"Selected platform",customModel:"Model version",duration:"Duration"};
    for(const k of Object.keys(labels))if(JSON.stringify(a[k])!==JSON.stringify(b[k]))changes.push(labels[k]+" changed");
    return {approved:true,changed:changes.length>0,protectedChanged:changes.some(x=>x==="Protected requirements changed"),changes,material:changes.length>0};
  }
  function validateApproval(input){
    const x=snapshot(input);
    if(!x.goal)return {ok:false,reason:"Describe the result you want before approving."};
    if(x.protected.length===0)return {ok:false,reason:"Add at least one protected requirement before approving."};
    const both=x.protected.map(y=>y.toLocaleLowerCase("en")).filter(y=>x.allowed.some(z=>z.toLocaleLowerCase("en")===y));
    if(both.length)return {ok:false,reason:"A requirement cannot be both protected and an allowed change: "+both[0]};
    return {ok:true,reason:"Local user approval recorded for this exact intent snapshot."};
  }
  function compatibility(input){
    const x=snapshot(input);
    return {status:NOT_VERIFIED,provider:x.model,explanation:"No documented, independently qualified adapter is connected for this exact platform and version. This request has not been validated for provider limits or executed."};
  }
  function suggestions(goal){
    const s=plain(goal).toLowerCase(),out=[];
    if(/app|site|web|software|dashboard|data|customer/.test(s))out.push("Existing user data must not be deleted.");
    if(/3d|world|scene|landscape|tree|terrain|environment|ocean/.test(s))out.push("Preserve the existing world and its established geography.");
    if(/video|film|animation|shot|cinematic/.test(s))out.push("Preserve continuity of approved subjects and framing.");
    if(/voice|audio|sound|speech/.test(s))out.push("Keep previously approved spoken content unchanged.");
    if(/image|illustrat|design|brand/.test(s))out.push("Preserve approved text, logos, and brand details.");
    if(/writing|document|report|article/.test(s))out.push("Preserve verified facts and explicitly approved claims.");
    if(/agent|workflow|automation/.test(s))out.push("Require explicit approval before irreversible external actions.");
    return distinct([...out,"Do not silently change an approved requirement."]);
  }
  function prepare(input,approved){
    const x=snapshot(input);
    const valid=validateApproval(x);
    if(!valid.ok)return {ok:false,reason:valid.reason};
    if(!approved||key(approved)!==key(x))return {ok:false,reason:"The current intent differs from the approved snapshot. Review changes and approve again."};
    const lines=[
      "DIAMONDGATE PREFLIGHT — USER-APPROVED REQUEST",
      "Approval: local snapshot only; not a signed DiamondGate kernel receipt.",
      "Project: "+(x.projectName||"Untitled"),
      "Work type: "+x.category,
      "Desired result: "+x.goal,
      "",
      "PROTECTED REQUIREMENTS — preserve these explicitly:",
      ...x.protected.map((v,i)=>"P"+String(i+1).padStart(2,"0")+": "+v),
      "",
      "PERMITTED CHANGES — only within protected boundaries:",
      ...(x.allowed.length?x.allowed.map((v,i)=>"A"+String(i+1).padStart(2,"0")+": "+v):["None explicitly listed."]),
      "",
      "Target platform: "+x.model+(x.customModel?" | custom version: "+x.customModel:""),
      ...(x.duration?["Requested duration (seconds): "+x.duration]:[]),
      "Platform compatibility: "+NOT_VERIFIED,
      "Provider-specific limits and execution: NOT VERIFIED; check documentation and real model constraints before using.",
      "",
      "CONTINUITY INSTRUCTION:",
      "Before each revision, compare the proposed result to the approved baseline. State exactly which protected or permitted requirements change. Seek renewed user approval for a materially changed goal, requirement, platform, or setting. Do not inherit approval silently.",
      "This is a transferable instruction, not proof of model compliance or cryptographic enforcement."
    ];
    return {ok:true,text:lines.join("\n"),reason:"Prepared from the exact locally approved intent."};
  }
  function safeStored(raw){
    if(!raw||typeof raw!=="object")return null;
    const current=snapshot(raw);
    const approved=raw.approvedSnapshot?snapshot(raw.approvedSnapshot):null;
    return {schema:STATE_SCHEMA,...current,approvedSnapshot:approved,approvedAt:approved?plain(raw.approvedAt):""};
  }
  return Object.freeze({SCHEMA,STATE_SCHEMA,NOT_VERIFIED,snapshot,key,compare,validateApproval,compatibility,suggestions,prepare,safeStored,distinct,plain});
});
