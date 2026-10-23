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

  // Rule-based first-use baseline. Never claim semantic AI inference or provider validation.
  function inferTask(textValue){
    const s=plain(textValue).toLowerCase();
    const groups=[
      ["video",/\b(video|commercial|film|clip|reel|animation|trailer|advertisement)\b/],
      ["app",/\b(app|website|dashboard|software|webpage|saas)\b/],
      ["world",/\b(3d|3 d|three d|three-dimensional|three dimensional|virtual world|terrain|landscape|environment|walkable|cavern|oasis|game environment)\b/],
      ["audio",/\b(audio|voice|podcast|narration|music|soundtrack)\b/],
      ["image",/\b(image|photo|illustration|poster|logo|graphic|picture)\b/],
      ["writing",/\b(article|essay|report|email|letter|script|blog|document)\b/],
      ["agent",/\b(agent|workflow|automation|automate|bot)\b/]
    ];
    return groups.find(x=>x[1].test(s))?.[0]||"general";
  }
  const q=(id,title,why,options)=>({id,title,why,options});
  const library={
    video:[
      q("destination","Where will people see it?","The destination affects framing and pacing.",["Social media","Website","Presentation or event","Not sure"]),
      q("footage","What visuals should it use?","Real references and generated imagery need different preparation.",["My photos or footage","AI-generated visuals","A mixture","Not sure"]),
      q("brand","Are there brand details to preserve?","Exact logos and wording should be supplied as references.",["Existing logo or signage","No fixed brand assets","Not sure"])],
    app:[
      q("users","Who will use it?","Primary users shape the interface.",["Customers","My team","Just me","Not sure"]),
      q("data","Does existing data need protection?","Do not assume a new build may overwrite data.",["Yes, preserve it","Starting fresh","Not sure"]),
      q("devices","Where must it work?","Mobile and desktop need different interaction patterns.",["Mobile and desktop","Mobile first","Desktop first","Not sure"])],
    world:[
      q("interactivity","Will people explore it?","Walkable worlds have different needs from visual renders.",["Walkable and interactive","Visual scene only","Both","Not sure"]),
      q("existing","Is there an existing environment?","Do not silently replace approved geography and assets.",["Yes, preserve existing work","No, new environment","Not sure"]),
      q("runtime","Where will it run?","Engine choice affects constraints.",["Browser","Game engine","Rendered video","Not sure"])],
    image:[
      q("placement","Where will the image be used?","Purpose affects composition.",["Social or web","Print","Personal project","Not sure"]),
      q("reference","Should any visual identity be retained?","Exact brands should use provided references.",["I have references","Create something new","Not sure"]),
      q("shape","What image shape is needed?","Aspect ratio affects framing.",["Portrait","Landscape","Square","Not sure"])],
    writing:[
      q("reader","Who is the reader?","Audience determines style and depth.",["General public","Professional audience","One person","Not sure"]),
      q("tone","What tone is appropriate?","Tone changes how the message lands.",["Friendly","Professional","Direct","Not sure"]),
      q("facts","Should factual claims be checked?","Do not invent sources or research.",["Verify factual claims","Creative only","Not sure"])],
    audio:[
      q("format","What audio do you need?","Speech and music are different workflows.",["Spoken voice","Music","Sound effects","Not sure"]),
      q("identity","Does it involve a real person's voice?","Mimicking a person requires appropriate permission.",["No real-person voice","I have permission","Not sure"]),
      q("length","How long should it be?","Length affects production.",["Under 30 seconds","30–120 seconds","Longer","Not sure"])],
    agent:[
      q("authority","May it perform external actions?","Irreversible actions need explicit permission.",["Advice only","Draft for review","Ask before executing","Not sure"]),
      q("systems","Which systems may it access?","Access should be intentionally limited.",["Email or calendar","Files","Business platform","Not sure"]),
      q("success","How do you know it succeeded?","A clear result prevents vague automation.",["Finished deliverable","Verified notification","Recurring summary","Not sure"])],
    general:[
      q("output","What should AI make?","An output type makes the request actionable.",["Image or video","Text or document","App or interactive result","Not sure"]),
      q("audience","Who is it for?","Audience affects the result.",["Just me","Other people","My business","Not sure"]),
      q("priority","What is most important?","This clarifies tradeoffs.",["Accuracy","Speed","Quality","Not sure"])]
  };
  function assessFirstUse(raw){
    const idea=plain(raw).slice(0,3000);
    if(idea.length<12)return {ok:false,error:"Describe what you want AI to accomplish in a little more detail."};
    const kind=inferTask(idea),s=idea.toLowerCase();
    const already={
      destination:/\b(instagram|tiktok|youtube|website|social media|television)\b/,
      footage:/\b(my photos|my footage|existing images|stock footage)\b/,
      brand:/\b(logo|brand assets|signage|brand guide)\b/,
      users:/\b(customers|my team|staff|just me|employees)\b/,
      data:/\b(existing data|preserve data|from scratch|no data)\b/,
      devices:/\b(mobile|desktop|phone|tablet|ios|android)\b/,
      interactivity:/\b(walkable|interactive|still image|static render)\b/,
      existing:/\b(preserve|keep existing|already built|do not change)\b/,
      runtime:/\b(browser|webgl|unity|unreal|game engine)\b/,
      shape:/\b(portrait|landscape|square|16:9|9:16)\b/,
      tone:/\b(formal|casual|friendly|professional|concise)\b/
    };
    const questions=library[kind].filter(x=>!already[x.id]?.test(s)).slice(0,3);
    const flags=[];
    if(kind==="video"&&/\b\d+\s*[- ]?(seconds?|secs?|minutes?|mins?)\b/.test(s))flags.push("Duration specified; check the chosen model's current limits before generating.");
    return {ok:true,idea,kind,questions,flags,method:"This first check uses transparent rules, not AI reasoning or verified model compatibility."};
  }
  function firstUseIdentity(report,answers={}){
    if(!report?.ok)return "";
    return JSON.stringify({idea:report.idea,decisions:report.questions.map(x=>[x.id,x.options.includes(plain(answers[x.id]))?plain(answers[x.id]):""])});
  }
  function makeFirstRequest(report,answers={}){
    if(!report?.ok)return {ok:false,error:"Check your idea first."};
    const confirmed=[],open=[];
    for(const x of report.questions){
      const a=plain(answers[x.id]);
      if(a&&a!=="Not sure"&&x.options.includes(a))confirmed.push("- "+x.title+" "+a);
      else open.push("- "+x.title);
    }
    const lines=["MY AI REQUEST",report.idea,"","CONFIRMED DETAILS:",...(confirmed.length?confirmed:["- None yet; ask rather than guess."])];
    if(open.length)lines.push("","QUESTIONS STILL OPEN:",...open);
    if(report.flags.length)lines.push("","CHECK BEFORE EXECUTION:",...report.flags.map(x=>"- "+x));
    lines.push("","Keep my original goal intact. Do not invent answers to open questions. Ask before making consequential assumptions. Verify specific AI model limits separately before executing.","","Prepared with deterministic DiamondGate Preflight guidance, not model execution or verified compatibility.");
    return {ok:true,text:lines.join("\n"),confirmed:confirmed.length,unresolved:open.length};
  }

  return Object.freeze({SCHEMA,STATE_SCHEMA,NOT_VERIFIED,snapshot,key,compare,validateApproval,compatibility,suggestions,prepare,safeStored,distinct,plain,inferTask,assessFirstUse,firstUseIdentity,makeFirstRequest});
});
