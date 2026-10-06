/* Meet Sean speaking requests. No success until the provider explicitly accepts.
   Release gate: data-delivery-status="verified" only after mailbox activation and
   an end-to-end delivery test. A provider response is not proof of inbox arrival. */
(function () {
  'use strict';
  const ENDPOINT = 'https://formsubmit.co/ajax/hello@diamondgatebridge.com';
  const TOPICS = ['Rise Above Bullying', 'Fear and Love', 'The Inner Underdog', 'Finding Your Voice', 'Help me choose'];
  const FORMATS = ['Interactive session', 'Traditional talk', 'Help me decide'];
  const AUDIENCES = ['Professional & adult', 'Schools & youth', 'Help me decide'];
  const GOALS = ['Help me decide','Belonging and respect','Responding with care','Confidence through setbacks','Communication and public speaking'];
  const FIELDS = ['goal', 'topic', 'audience', 'ageRange', 'format', 'date', 'venue', 'name', 'email', 'phone', 'message', 'website'];
  const LIMITS = {ageRange:120,venue:180,name:100,email:254,phone:40,message:2000};
  function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function normalize(raw) { const data=Object.fromEntries(FIELDS.map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : (['format','audience','goal'].includes(key) ? 'Help me decide' : '')])); if(data.audience!=='Schools & youth')data.ageRange=''; return data; }
  function validDate(value) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d=new Date(value+'T12:00:00'); return !Number.isNaN(d.getTime()) && localDate(d)===value; }
  function validate(raw, today=localDate()) {
    const data=normalize(raw), errors={};
    if(!GOALS.includes(data.goal)) errors.goal='Choose a hoped-for takeaway, or select “Help me decide.”';
    if(!TOPICS.includes(data.topic)) errors.topic='Choose a topic, or select “Help me choose.”';
    if(!AUDIENCES.includes(data.audience)) errors.audience='Choose an audience, or select “Help me decide.”';
    if(data.audience==='Schools & youth'&&!data.ageRange) errors.ageRange='Add the group’s age range or grade level.';
    if(!FORMATS.includes(data.format)) errors.format='Choose a session format, or select “Help me decide.”';
    if(!validDate(data.date)) errors.date='Choose a valid preferred date.';
    else if(data.date<today) errors.date='Choose today or a future date.';
    if(!data.venue) errors.venue='Add a venue and city, or enter “Virtual.”';
    if(!data.name) errors.name='Please add your name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email='Please enter an email address we can reply to.';
    for(const [key,max] of Object.entries(LIMITS)) if(data[key].length>max) errors[key]=`Please keep this to ${max} characters or fewer.`;
    return {data,errors,valid:Object.keys(errors).length===0 && !data.website};
  }
  function payload(data) { return {name:data.name,email:data.email,topic:data.topic,'Event goal':data.goal,Audience:data.audience,'Age range / grade level':data.ageRange||'Not applicable','Session format':data.format,'Requested date':data.date,'Venue / city':data.venue,phone:data.phone||'Not provided',message:data.message||'Not provided',_subject:'Speaking request — '+data.topic,_template:'table',_honey:data.website}; }
  function accepted(response, result) {
    return Boolean(response.ok && result && (result.success===true || result.success==='true') && !/activat|confirm.{0,30}(email|address)|verif/i.test(String(result.message||'')));
  }
  async function sendRequest(raw, {fetcher=globalThis.fetch, today=localDate(), timeout=15000, verified=false}={}) {
    const result=validate(raw,today);
    if(!result.valid) return {kind:'invalid',errors:result.errors};
    if(!verified) return {kind:'held',message:'Online requests are awaiting activation. Please email hello@diamondgatebridge.com with your event details.'};
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
    try {
      const response=await fetcher(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload(result.data)),signal:controller.signal,credentials:'omit',referrerPolicy:'strict-origin-when-cross-origin'});
      let body;try{body=await response.json();}catch{return {kind:'error',message:'We couldn’t confirm that your request was sent. Your details are still here. Please try again or email hello@diamondgatebridge.com.'};}
      if(!accepted(response,body)) return {kind:'error',message:'We couldn’t confirm that your request was sent. Your details are still here. Please try again or email hello@diamondgatebridge.com.'};
      return {kind:'success',message:'Your speaking request has been sent to the team. We’ll follow up within 24–48 hours. Your requested date is pending confirmation.'};
    } catch {return {kind:'error',message:'We couldn’t confirm delivery. Your request may have reached us, so please check before sending it again. Your details are still here; you can also email hello@diamondgatebridge.com.'};}
    finally {clearTimeout(timer);}
  }
  // Spatial shell follows Compass: persistent viewer-facing objects in one orbit.
  // The unchanged shared Compass quaternion math owns rotation; one unwrapped p
  // drives every transform. Selection commits only at a canonical landing.
  function initTalkCarousel(){
    const carousel=document.querySelector('.talk-carousel'),dialog=document.getElementById('agenda-inspector'),physics=globalThis.DGB_COMPASS_ORBIT_PHYSICS;
    if(!carousel||!dialog||typeof dialog.showModal!=='function'||!physics)return;
    const stage=carousel.querySelector('.talk-stage'),cards=[...carousel.querySelectorAll('.topic-slide')],status=carousel.querySelector('.talk-status'),content=dialog.querySelector('.inspector-content'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const count=cards.length,step=2*Math.PI/count,mod=n=>((n%count)+count)%count;
    const anchors=cards.map((_,i)=>physics.quaternionRotateVector(physics.quaternionFromAxisAngle([0,1,0],i*step),[0,0,1]));
    let p=0,index=0,phase='resting',pointer=null,suppressClickUntil=0,returnFocus=null,moved=null,savedOverflow='',target=0;
    function render(){
      const width=stage.clientWidth,radius=width*.42;
      // The same pointer-to-quaternion mapping as Compass, evaluated from p.
      const q=physics.dragQuaternionFromPointer({startX:0,startY:0,startQuaternion:[0,0,0,1]},-p*step*width/physics.GESTURE.radiansPerViewport,0,width,stage.clientHeight);
      cards.forEach((card,i)=>{
        const v=physics.quaternionRotateVector(q,anchors[i]).map(n=>Math.abs(n)<1e-10?0:Math.abs(n-1)<1e-10?1:Math.abs(n+1)<1e-10?-1:n),depth=(v[2]+1)/2;
        card.style.transform=`translate3d(${v[0]*radius}px,${(1-depth)*-30}px,${(v[2]-1)*radius}px)`;
        card.style.opacity=String(.24+.76*depth);card.style.zIndex=String(Math.round(depth*100));
      });
      stage.dataset.orbitPosition=String(p);stage.dataset.phase=phase;stage.dataset.settlementTarget=String(target);
    }
    function semantics(){
      cards.forEach((card,i)=>{const active=i===index;card.dataset.active=String(active);card.inert=!active;card.setAttribute('aria-hidden',String(!active));card.setAttribute('aria-current',String(active));card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',`${i+1} of ${count}: ${card.querySelector('h3').textContent}`);});
      status.textContent=`${index+1} / ${count} · ${cards[index].querySelector('h3').textContent}`;
    }
    function settle(q){
      const from=p;target=q;phase='settling';render();const start=performance.now(),duration=reduce.matches?0:320;
      function frame(now){
        const t=duration?Math.min(1,(now-start)/duration):1;p=from+(q-from)*(1-Math.pow(1-t,3));
        if(t===1){p=q;index=mod(q);phase='resting';render();semantics();}else{render();requestAnimationFrame(frame);}
      }
      requestAnimationFrame(frame);
    }
    function restore(){if(moved){moved.home.append(moved.node);moved.home.open=false;moved=null;}}
    function open(trigger){
      if(phase!=='resting')return;
      returnFocus=trigger;savedOverflow=document.body.style.overflow;
      const home=cards[index].querySelector('.agenda-disclosure'),node=home.querySelector('.agenda-card');moved={home,node};content.append(node);
      dialog.querySelector('#inspector-title').textContent=cards[index].querySelector('h3').textContent;dialog.scrollTop=0;dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.inspector-close').focus();
    }
    function finishClose(){if(!moved)return;restore();document.body.style.overflow=savedOverflow;returnFocus?.focus({preventScroll:true});}
    dialog.addEventListener('close',finishClose);
    dialog.querySelector('.inspector-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('click',event=>{if(event.target.closest('[data-topic]')){dialog.close();finishClose();requestAnimationFrame(()=>(document.querySelector('#event-guide:not([hidden]) h3')||document.getElementById('topic')).focus({preventScroll:true}));}},true);
    cards.forEach(card=>card.querySelector('summary').addEventListener('click',event=>{event.preventDefault();open(event.currentTarget);}));
    stage.addEventListener('keydown',event=>{if(event.target!==stage||phase!=='resting'||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();settle(event.key==='Home'?p-index:event.key==='End'?p-index+count-1:p+(event.key==='ArrowRight'?1:-1));});
    stage.addEventListener('pointerdown',event=>{
      if(!event.isPrimary||event.button!==0||phase!=='resting'||event.target.closest('button,a,input,select,textarea,summary'))return;
      pointer={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,direction:0,origin:p,width:stage.clientWidth};phase='pending';stage.setPointerCapture(event.pointerId);render();
    });
    stage.addEventListener('pointermove',event=>{
      if(!pointer||pointer.id!==event.pointerId)return;
      const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
      if(phase==='pending'){
        if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
        if(Math.abs(dy)>Math.abs(dx)*1.12){pointer=null;phase='resting';render();return;}
        if(Math.abs(dx)<=Math.abs(dy)*1.12)return;
        phase='dragging';stage.setPointerCapture(event.pointerId);
      }
      if(phase!=='dragging')return;
      pointer.direction=Math.sign(pointer.lastX-event.clientX)||pointer.direction;pointer.lastX=event.clientX;
      p=pointer.origin-dx/pointer.width*physics.GESTURE.radiansPerViewport/step;render();
    });
    function release(event,cancelled=false){
      if(!pointer||pointer.id!==event.pointerId)return;
      const drag=pointer;pointer=null;
      if(phase==='dragging'){
        suppressClickUntil=performance.now()+physics.GESTURE.suppressClickMs;
        const lower=Math.floor(p),fraction=p-lower;
        const nearest=Math.abs(fraction-.5)<1e-8?(drag.direction>0?lower+1:lower):Math.round(p);
        settle(cancelled?drag.origin:nearest);
      }else{phase='resting';render();}
      if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
    }
    stage.addEventListener('pointerup',event=>release(event));stage.addEventListener('pointercancel',event=>release(event,true));stage.addEventListener('lostpointercapture',event=>release(event,true));
    stage.addEventListener('click',event=>{if(phase!=='resting'||performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
    carousel.classList.add('is-enhanced');carousel.querySelectorAll('.talk-status,.talk-guidance').forEach(el=>el.hidden=false);
    new ResizeObserver(()=>render()).observe(stage);render();semantics();
  }
  function initAgendas(){
    document.querySelectorAll('[data-agenda]').forEach(card=>{
      const buttons=[...card.querySelectorAll('[data-agenda-side]')],faces=[...card.querySelectorAll('[data-face]')],stage=card.querySelector('.agenda-stage'),status=card.querySelector('.agenda-status'),action=card.querySelector('[data-topic]');
      const labels={adult:'Professional & adult',youth:'Schools & youth'};
      const select=(side)=>{if(!labels[side])return;card.dataset.agenda=side;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agendaSide===side)));faces.forEach(f=>{const inactive=f.dataset.face!==side;f.setAttribute('aria-hidden',String(inactive));f.inert=inactive;});status.textContent=labels[side]+' agenda';action.dataset.audience=labels[side];};
      buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.agendaSide)));
      card.querySelector('.agenda-controls').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const side=['ArrowLeft','Home'].includes(event.key)?'adult':'youth';select(side);buttons.find(b=>b.dataset.agendaSide===side).focus();});
      let start=null;
      stage.addEventListener('pointerdown',event=>{if(!event.isPrimary||!['touch','pen'].includes(event.pointerType)||event.target.closest('button,a,input,select,textarea,summary'))return;start={id:event.pointerId,x:event.clientX,y:event.clientY,time:performance.now()};stage.setPointerCapture(event.pointerId);});
      stage.addEventListener('pointerup',event=>{if(!start||event.pointerId!==start.id)return;const dx=event.clientX-start.x,dy=event.clientY-start.y,elapsed=performance.now()-start.time;start=null;if(Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.3&&elapsed<1200)select(dx<0?'youth':'adult');});
      stage.addEventListener('pointercancel',()=>{start=null;});
      stage.addEventListener('lostpointercapture',()=>{start=null;});
      card.classList.add('agenda-enhanced');card.querySelectorAll('.agenda-controls,.agenda-hint,.agenda-status').forEach(el=>el.hidden=false);select('adult');
    });
  }
  /* Adapted from Habaneros v16 / public/app.js (717694a00516206d9876c848ff827bdfeb8cefac):
     bubble/reply/buttons -> nextQuestion/ask/advance/setField -> contactStep/meaningfulReply.
     Speaking delta: existing controls/validation, agenda prefill, email draft; no donor backend.
     Sequence cancellation and reduced-motion handling follow Elara/Jeeves runtime contracts. */
  function initEventGuide(form,controls,{raw,showErrors,syncAudience,fields,review}){
    const root=document.getElementById('event-guide');if(!root)return null;
    const chat=root.querySelector('[data-chat-log]'),choices=root.querySelector('[data-chat-choices]'),saving=root.querySelector('[data-chat-saving]'),composer=root.querySelector('[data-chat-composer]'),note=root.querySelector('[data-chat-note]'),toggle=root.querySelector('[data-chat-toggle]'),summary=document.getElementById('event-summary'),summaryList=summary.querySelector('dl'),location=document.getElementById('locationMode');
    const key='dgb-speaking-companion-v2',reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const labels={name:'Name',email:'Email',audience:'Audience',ageRange:'Age / grade',goal:'Hoped-for takeaway',topic:'Talk',format:'Experience',date:'Preferred date',locationMode:'Gathering',venue:'Venue / city',phone:'Phone',message:'Notes and questions'};
    const options={audience:AUDIENCES,goal:GOALS,topic:TOPICS,format:FORMATS,locationMode:['In person','Virtual'],message:['Nothing else for now','Discuss fees and availability','Discuss accessibility needs','Help tailor the session']};
    const schoolGrades={'Elementary school':['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5'],'Middle school':['Grade 6','Grade 7','Grade 8'],'High school':['Grade 9','Grade 10','Grade 11','Grade 12']};
    const recommend={'Belonging and respect':'Rise Above Bullying','Responding with care':'Fear and Love','Confidence through setbacks':'The Inner Underdog','Communication and public speaking':'Finding Your Voice'};
    const talkInfo={'Rise Above Bullying':'Rise Above Bullying explores belonging, respect and ways to support someone being targeted. Participation is optional.','Fear and Love':'Fear and Love explores how fear and love influence our choices, and how we can respond with greater care.','The Inner Underdog':'The Inner Underdog explores setbacks, self-belief and the next step when you have been counted out.','Finding Your Voice':'Finding Your Voice focuses on listening, communication and public speaking, with optional supportive practice.'};
    let state={history:[],questions:[],schoolLevel:null,grades:[],answered:[],deferred:[],pending:'name',promptShown:null},epoch=0,busy=false,editing=null,returnToReview=false,reviewAllowed=false,storageOK=true;
    const field=k=>k==='locationMode'?location:controls[k];
    function save(){try{sessionStorage.setItem(key,JSON.stringify({...state,values:Object.fromEntries(Object.keys(labels).map(k=>[k,field(k).value]))}));}catch{storageOK=false;}saving.textContent=storageOK?'Your conversation stays in this tab.':'Your conversation stays here while this page is open.';}
    try{const d=JSON.parse(sessionStorage.getItem(key)||'null');if(d&&Array.isArray(d.history)&&d.values&&typeof d.values==='object'){
      for(const k of Object.keys(labels)){const v=d.values[k];if(typeof v==='string'&&(k==='message'||!options[k]||options[k].includes(v)))field(k).value=v.slice(0,LIMITS[k]||180);}
      state.history=d.history.filter(x=>x&&['host','user'].includes(x.role)&&typeof x.text==='string').slice(-120).map(x=>({role:x.role,text:x.text.slice(0,4000)}));
      state.schoolLevel=Object.hasOwn(schoolGrades,d.schoolLevel)?d.schoolLevel:null;state.grades=Array.isArray(d.grades)?d.grades.filter(g=>schoolGrades[state.schoolLevel]?.includes(g)):[];
      state.questions=Array.isArray(d.questions)?d.questions.filter(x=>typeof x==='string').slice(-20).map(x=>x.slice(0,500)):[];
      state.answered=Array.isArray(d.answered)?d.answered.filter(k=>Object.hasOwn(labels,k)):[];state.deferred=Array.isArray(d.deferred)?d.deferred.filter(k=>Object.hasOwn(labels,k)):[];
      state.pending=Object.hasOwn(labels,d.pending)?d.pending:null;state.promptShown=d.promptShown===state.pending?d.promptShown:null;
    }}catch{storageOK=false;}
    function followBottom(){return chat.scrollHeight-chat.scrollTop-chat.clientHeight<90;}
    function bubble(text,role='host',record=true){const follow=followBottom(),el=document.createElement('div');el.className='event-bubble '+role;const who=document.createElement('span');who.className='visually-hidden';who.textContent=role==='user'?'You: ':'Event companion: ';el.append(who,document.createTextNode(text));chat.append(el);if(record){state.history.push({text,role});state.history=state.history.slice(-120);save();}if(follow)chat.scrollTop=chat.scrollHeight;return el;}
    function cancel(){epoch++;busy=false;choices.removeAttribute('aria-busy');chat.querySelectorAll('.pending').forEach(n=>n.remove());}
    const pause=()=>new Promise(r=>setTimeout(r,reduced()?0:350));
    async function reply(messages,done){cancel();const token=epoch;busy=true;choices.replaceChildren();choices.setAttribute('aria-busy','true');composer.hidden=true;toggle.setAttribute('aria-expanded','false');
      for(const text of messages.filter(Boolean)){if(token!==epoch)return;const follow=followBottom(),pending=document.createElement('div');pending.className='event-bubble pending';pending.setAttribute('aria-label','Preparing a reply');pending.innerHTML='<span aria-hidden="true">•••</span>';chat.append(pending);if(follow)chat.scrollTop=chat.scrollHeight;await pause();pending.remove();if(token!==epoch)return;bubble(text);}
      if(token!==epoch)return;busy=false;choices.removeAttribute('aria-busy');done?.();save();
    }
    function order(){return ['name','email','audience',...(controls.audience.value==='Schools & youth'?['ageRange']:[]),'goal','topic','format','date','locationMode',...(location.value==='Virtual'?[]:['venue']),'phone','message'];}
    function nextQuestion(){return order().find(k=>!state.answered.includes(k)&&!state.deferred.includes(k))||null;}
    function promptFor(k){const prompts={name:'First, may I have your name?',email:'What email should Sean use to follow up with you?',audience:'Who will be in the room?',ageRange:state.schoolLevel?'Which grades will be joining us? You can choose more than one.':'Which school level will be joining us?',goal:'What would you like your audience to leave with?',topic:recommend[controls.goal.value]?`“${recommend[controls.goal.value]}” could fit that goal. Which talk would you like to explore?`:'Which talk catches your interest? It’s fine to leave that open.',format:'Would you like an interactive session, a traditional talk, or help deciding?',date:'Do you have a preferred date? Sean will confirm availability personally.',locationMode:'Will you gather in person or online?',venue:'Which venue and city do you have in mind?',phone:'Would you like to leave a phone number as well? This is optional.',message:'Is there anything you would like to discuss with Sean?'};return prompts[k];}
    function summarize(){summaryList.replaceChildren();for(const [k,label]of Object.entries(labels)){if(k==='ageRange'&&controls.audience.value!=='Schools & youth')continue;if(k==='venue'&&location.value==='Virtual')continue;if(!state.answered.includes(k)&&!state.deferred.includes(k))continue;const dt=document.createElement('dt'),dd=document.createElement('dd'),b=document.createElement('button');dt.textContent=label;b.type='button';b.textContent=field(k).value||'Still open';b.setAttribute('aria-label','Change '+label);b.onclick=()=>{if(busy)return;editing={resume:state.pending};returnToReview=false;review.hidden=true;fields.hidden=true;root.hidden=false;summary.open=false;ask(k,'Of course. Let’s change that detail.');};dd.append(b);summaryList.append(dt,dd);}if(!summaryList.children.length){const dd=document.createElement('dd');dd.textContent='Your event details will appear here as we talk.';summaryList.append(dd);}}
    function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{if(!busy)fn();};choices.append(b);return b;}
    function acknowledge(k,v){if(!v)return 'We can leave that open for now.';const replies={name:`Lovely to meet you, ${v.split(/\s+/)[0]}.`,email:'Thank you. We’ll keep that email with your event details.',audience:v==='Schools & youth'?'A school or youth gathering—let’s make sure the examples fit their age.':v==='Professional & adult'?'An adult audience—there’s room for stories, practical ideas and a shared laugh.':'That’s fine. We can keep the audience open as we explore.',ageRange:`${v}—we’ll keep that group in mind when shaping the session.`,goal:v==='Belonging and respect'?'Helping people feel included and respected gives us a clear place to begin.':v==='Responding with care'?'Making room for more thoughtful responses fits the conversation about fear and love.':v==='Confidence through setbacks'?'Finding a way forward after setbacks is at the heart of the underdog story.':v==='Communication and public speaking'?'Helping people express themselves and listen to one another is a useful focus.':'We can explore the talks before settling on a takeaway.',topic:talkInfo[v]||'We can leave the topic open for Sean to help you choose.',format:v==='Interactive session'?'An interactive session gives the audience room to shape the conversation. Listening is welcome, too.':v==='Traditional talk'?'A traditional talk—Sean can keep the stories and message at the center.':'We’ll leave the format open for you to discuss with Sean.',date:`${new Date(v+'T12:00:00').toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}—we’ll include that as your requested date.`,locationMode:v==='Virtual'?'An online gathering—there’s no physical venue to add.':'In person—let’s add the place you have in mind.',venue:`${v}—we’ll include that location for Sean.`,phone:'Thanks. We’ll keep that number with your event details.',message:'Thank you for sharing that. It will stay with your event details.'};return replies[k];}
    function accept(k,value){if(busy)return;const v=value.trim();if(options[k]&&!options[k].includes(v))return;field(k).value=k==='message'?[v,...state.questions.map(q=>'Question: '+q).filter(q=>!v.includes(q))].filter(Boolean).join('\n').slice(0,LIMITS.message):v;syncAudience();const error=validate(raw()).errors[k];if(error){const e=choices.querySelector('[data-response-error]');if(e)e.textContent=error;choices.querySelector('input,textarea,select')?.setAttribute('aria-invalid','true');return;}
      bubble(v||'I’ll leave this open','user');state.answered=[...new Set([...state.answered,k])];state.deferred=state.deferred.filter(x=>x!==k);
      if(k==='audience'&&v!=='Schools & youth'){state.schoolLevel=null;state.grades=[];controls.ageRange.value='';state.answered=state.answered.filter(x=>x!=='ageRange');state.deferred=state.deferred.filter(x=>x!=='ageRange');}
      if(k==='locationMode'){controls.venue.value=v==='Virtual'?'Virtual':'';state.answered=state.answered.filter(x=>x!=='venue');state.deferred=state.deferred.filter(x=>x!=='venue');if(v==='Virtual')state.answered.push('venue');}
      summarize();save();advance(acknowledge(k,v));
    }
    function defer(k){bubble(['name','email'].includes(k)?'I’d like to explore first.':'I haven’t decided yet.','user');const keys=['name','email'].includes(k)?['name','email'].filter(id=>id===k||!state.answered.includes(id)):[k];for(const id of keys){field(id).value=({audience:'Help me decide',goal:'Help me decide',topic:'Help me choose',format:'Help me decide'})[id]||'';}state.answered=state.answered.filter(x=>!keys.includes(x));state.deferred=[...new Set([...state.deferred,...keys])];if(k==='audience'){state.schoolLevel=null;state.grades=[];controls.ageRange.value='';state.answered=state.answered.filter(x=>x!=='ageRange');}if(k==='locationMode'){controls.venue.value='';state.answered=state.answered.filter(x=>x!=='venue');}if(k==='ageRange'){state.schoolLevel=null;state.grades=[];}if(k==='message'&&state.questions.length)controls.message.value=state.questions.map(q=>'Question: '+q).join('\n').slice(0,LIMITS.message);syncAudience();summarize();advance('Of course. You can add that when you’re ready.');}
    function renderSchool(){choices.replaceChildren();if(!state.schoolLevel){for(const level of Object.keys(schoolGrades))button(level,()=>{state.schoolLevel=level;state.grades=[];controls.ageRange.value='';state.answered=state.answered.filter(x=>x!=='ageRange');summarize();bubble(level,'user');ask('ageRange',level+'—let’s choose the grades.');});if(!returnToReview)button('Not sure yet',()=>defer('ageRange'));return;}const group=document.createElement('div');group.className='companion-grades';group.setAttribute('role','group');group.setAttribute('aria-label','Choose grades');for(const grade of schoolGrades[state.schoolLevel]){const b=document.createElement('button');b.type='button';b.textContent=grade;b.setAttribute('aria-pressed',String(state.grades.includes(grade)));b.onclick=()=>{if(busy)return;state.grades=state.grades.includes(grade)?state.grades.filter(x=>x!==grade):[...state.grades,grade];b.setAttribute('aria-pressed',String(state.grades.includes(grade)));done.disabled=!state.grades.length;save();};group.append(b);}choices.append(group);button('All grades at this level',()=>{state.grades=[...schoolGrades[state.schoolLevel]];for(const b of group.children)b.setAttribute('aria-pressed','true');done.disabled=false;save();});const done=button('Use selected grades',()=>accept('ageRange',state.schoolLevel+': '+schoolGrades[state.schoolLevel].filter(g=>state.grades.includes(g)).join(', ')));done.disabled=!state.grades.length;button('Change school level',()=>{state.schoolLevel=null;state.grades=[];controls.ageRange.value='';state.answered=state.answered.filter(x=>x!=='ageRange');summarize();ask('ageRange');});}
    function renderChoices(k){choices.replaceChildren();if(k==='ageRange'){renderSchool();return;}if(!k){button('Prepare email draft',prepare);return;}const label=document.createElement('label');label.className='visually-hidden';label.htmlFor='companion-response';label.textContent=labels[k];choices.append(label);
      if(options[k]){const select=document.createElement('select');select.id='companion-response';select.setAttribute('aria-label',labels[k]);const empty=document.createElement('option');empty.value='';empty.textContent='Choose your response';select.append(empty);for(const text of options[k]){const o=document.createElement('option');o.value=text;o.textContent=text;select.append(o);}select.onchange=()=>accept(k,select.value);choices.append(select);}
      else{const input=document.createElement(k==='message'?'textarea':'input');input.id='companion-response';if(k!=='message')input.type=k==='email'?'email':k==='date'?'date':k==='phone'?'tel':'text';input.value=field(k).value;input.maxLength=LIMITS[k]||2000;input.autocomplete=['name','email'].includes(k)?k:k==='phone'?'tel':'off';if(k==='date')input.min=localDate();input.placeholder=k==='name'?'Your name':k==='email'?'you@example.com':k==='ageRange'?'For example, grades 6–8':k==='venue'?'Venue and city':k==='message'?'A little about your gathering…':'';input.setAttribute('aria-label',labels[k]);input.onkeydown=e=>{if(e.key==='Enter'&&k!=='message'){e.preventDefault();e.stopPropagation();accept(k,input.value);}};choices.append(input);button(k==='date'?'Use this date':'Send',()=>accept(k,input.value));}
      const error=document.createElement('p');error.dataset.responseError='';error.className='companion-error';error.setAttribute('role','status');choices.append(error);
      if(!returnToReview)button(['name','email'].includes(k)?'Explore first':k==='date'?'No date yet':k==='phone'||k==='message'?'Skip for now':'Still deciding',()=>defer(k));
    }
    function ask(k,intro=''){state.pending=k;state.promptShown=null;save();reply([intro,k?promptFor(k):'Your event is taking shape. You can review the details, change anything, or prepare an email to Sean.'],()=>{state.promptShown=k;renderChoices(k);save();});}
    function advance(intro){if(returnToReview){reply([intro],prepare);return;}if(editing){const old=editing.resume;editing=null;ask(old&&order().includes(old)&&!state.answered.includes(old)?old:nextQuestion(),intro);return;}ask(nextQuestion(),intro);}
    function prepare(){if(busy)return;const errors=validate(raw()).errors,missing=Object.keys(errors)[0];if(missing){returnToReview=true;ask(missing,errors[missing]+' Let’s add that before preparing your email.');return;}returnToReview=false;reviewAllowed=true;form.requestSubmit(document.getElementById('review-button'));reviewAllowed=false;}
    function reviewSummary(){if(busy)return;summary.open=!summary.open;if(summary.open)summary.querySelector('summary').focus({preventScroll:true});}
    function answerQuestion(text){if(busy)return;const clean=text.trim().slice(0,500);if(!clean)return;bubble(clean,'user');const normalized=clean.toLowerCase().replace(/[?!.]+$/,'');let answer,keep=false;
      if(['how does the interactive session work','do people have to participate','is participation required'].includes(normalized))answer='The interactive session combines stories, humor and conversation. Questions, quick votes and willing volunteers help shape it. Nobody has to share a personal experience, and nobody becomes the punchline.';
      else if(['can this work for schools','is this suitable for schools'].includes(normalized))answer='Each talk has a schools and youth agenda. Sean can adapt the examples and participation to the age range or grade level you share.';
      else if(/\b(price|pricing|cost|fee|fees|availability|available|booking)\b/.test(normalized)){answer='Sean will need to confirm the fee and availability personally. We’ll keep your question with your event details for your email.';keep=true;}
      else{const topic=TOPICS.find(t=>t!=='Help me choose'&&normalized===t.toLowerCase());answer=topic?talkInfo[topic]:'That’s a question for Sean. We’ll keep it with your event details for your email.';keep=!topic;}
      if(keep&&!state.questions.includes(clean)){state.questions.push(clean);state.questions=state.questions.slice(-20);const extra='Question: '+clean;controls.message.value=[controls.message.value,extra].filter(Boolean).join('\n').slice(0,LIMITS.message);state.answered=[...new Set([...state.answered,'message'])];summarize();save();}
      reply([answer],()=>{button('Back to my event',()=>ask(state.pending));});
    }
    toggle.hidden=true;toggle.onclick=()=>{if(busy)return;composer.hidden=!composer.hidden;toggle.setAttribute('aria-expanded',String(!composer.hidden));if(!composer.hidden)note.focus();};root.querySelector('[data-chat-send-note]').onclick=()=>{const text=note.value;note.value='';answerQuestion(text);};note.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();root.querySelector('[data-chat-send-note]').click();}};
    root.querySelector('[data-chat-questions]').onclick=()=>{if(busy)return;reply(['What would you like to know?'],()=>{for(const text of ['How does the interactive session work?','Can this work for schools?','How are fees and availability confirmed?',...TOPICS.filter(t=>t!=='Help me choose')])button(text,()=>answerQuestion(text));button('Back to my event',()=>ask(state.pending));});};
    root.querySelector('[data-chat-review]').onclick=reviewSummary;
    root.querySelector('[data-chat-restart]').onclick=()=>{cancel();form.reset();syncAudience();state={history:[],questions:[],schoolLevel:null,grades:[],answered:[],deferred:[],pending:'name',promptShown:null};editing=null;returnToReview=false;reviewAllowed=false;review.hidden=true;summary.open=false;chat.replaceChildren();summarize();ask('name','Welcome. Let’s find a speaking experience that fits your gathering.');};
    form.classList.add('guided-event','companion-event');document.getElementById('invite').classList.add('companion-invite');root.hidden=false;fields.hidden=true;document.getElementById('guide-actions').hidden=true;summary.hidden=false;syncAudience();summarize();
    for(const item of state.history)bubble(item.text,item.role,false);
    if(state.history.length){if(!state.pending||!order().includes(state.pending))state.pending=nextQuestion();if(state.promptShown===state.pending)renderChoices(state.pending);else ask(state.pending);save();}else ask('name','Welcome. Let’s find a speaking experience that fits your gathering.');
    return {advance(){const el=choices.querySelector('input,textarea,select');if(el&&state.pending)accept(state.pending,el.value);},canReview(){return reviewAllowed;},reveal(k){if(Object.hasOwn(labels,k)){root.hidden=false;fields.hidden=true;review.hidden=true;ask(k,validate(raw()).errors[k]||'Let’s check that detail.');}},completed(){cancel();try{sessionStorage.removeItem(key);}catch{}},reviewed(data){cancel();root.hidden=true;fields.hidden=true;summary.hidden=false;summary.open=false;const body='Hello Sean,\n\nI would like to discuss a speaking event.\n\n'+Object.entries(labels).filter(([k])=>data[k]).map(([k,label])=>`${label}: ${data[k]}`).join('\n')+'\n\nI understand the date is subject to confirmation.';document.getElementById('event-email-draft').href='mailto:hello@diamondgatebridge.com?subject='+encodeURIComponent('Speaking inquiry — '+data.topic)+'&body='+encodeURIComponent(body);document.getElementById('event-copy-text').value=body;},edit(){review.hidden=true;root.hidden=false;fields.hidden=true;summary.open=true;renderChoices(state.pending);},fromTopic(){cancel();editing=null;returnToReview=false;state.answered=[...new Set([...state.answered,'topic',...(controls.audience.value!=='Help me decide'?['audience']:[])])];state.deferred=state.deferred.filter(k=>k!=='topic'&&k!=='audience');root.hidden=false;fields.hidden=true;review.hidden=true;summary.open=false;syncAudience();summarize();ask(nextQuestion(),`You’re exploring “${controls.topic.value}”${controls.audience.value==='Schools & youth'?' for a school or youth audience':''}. Let’s keep that with your event.`);}};
  }

  function initStoryCompass(){
    const compass=document.querySelector('.story-compass');
    if(!compass||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in globalThis))return;
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.45)){compass.dataset.arrived='true';observer.disconnect();}
    },{threshold:.45});
    observer.observe(compass);
  }
  function boot() {
    initStoryCompass();
    initAgendas();
    initTalkCarousel();
    const form=document.getElementById('speaking-form');if(!form)return;
    const controls=Object.fromEntries(FIELDS.map(k=>[k,form.elements.namedItem(k)]));
    const fields=document.getElementById('form-fields'),review=document.getElementById('request-review'),details=document.getElementById('review-details'),status=document.getElementById('form-status'),send=document.getElementById('send-button'),edit=document.getElementById('edit-button');let busy=false,done=false,reviewed=null;
    const ageField=document.getElementById('age-range-field');
    function syncAudience(){const youth=controls.audience.value==='Schools & youth';ageField.hidden=!youth;controls.ageRange.disabled=!youth;controls.ageRange.required=youth;}
    controls.audience.addEventListener('change',()=>{syncAudience();showErrors({});});
    syncAudience();
    controls.date.min=localDate();
    if(form.dataset.deliveryStatus==='verified') { form.querySelector('.preview-notice')?.remove(); send.disabled=false; send.textContent='Send speaking request'; }
    let guide=null;
    const raw=()=>Object.fromEntries(FIELDS.map(k=>[k,controls[k].value]));
    const notify=(kind,message)=>{status.dataset.kind=kind;status.textContent=message;};
    function showErrors(errors) {
      for(const [key,control] of Object.entries(controls)) {const error=document.getElementById(key+'-error');control.removeAttribute('aria-invalid');if(error)error.textContent='';const base=key==='date'?'date-hint':key==='ageRange'?'ageRange-hint':'';if(base)control.setAttribute('aria-describedby',base);else control.removeAttribute('aria-describedby');}
      for(const [key,message] of Object.entries(errors)) {const control=controls[key],error=document.getElementById(key+'-error');control.setAttribute('aria-invalid','true');if(error){error.textContent=message;control.setAttribute('aria-describedby',(key==='date'?'date-hint ':key==='ageRange'?'ageRange-hint ':'')+key+'-error');}}
      const first=Object.keys(errors)[0];if(first){if(guide){guide.reveal(first);return;}const control=controls[first];if(control.hidden)control.nextElementSibling?.querySelector('button')?.focus();else control.focus();}
    }
    function editRequest(){review.hidden=true;fields.hidden=false;reviewed=null;notify('','');if(guide)guide.edit();else controls.topic.focus();}
    guide=initEventGuide(form,controls,{raw,showErrors,syncAudience,fields,review});
    document.getElementById('event-copy').addEventListener('click',async()=>{const box=document.getElementById('event-copy-text'),message=document.getElementById('event-copy-status');try{await navigator.clipboard.writeText(box.value);message.textContent='Copied. Paste these details into your email when you’re ready.';}catch{box.hidden=false;box.focus();box.select();message.textContent='Select and copy the details below, then paste them into your email.';}});
    if(form.dataset.deliveryStatus==='verified')document.querySelector('.event-email-handoff').hidden=true;
    form.addEventListener('submit',event=>{event.preventDefault();if(busy||done)return;if(guide&&!guide.canReview()){guide.advance();return;}controls.date.min=localDate();const result=validate(raw());showErrors(result.errors);if(!result.valid){notify('error','Please check the highlighted fields.');return;}reviewed=result.data;details.replaceChildren();for(const [key,label] of [['topic','Topic'],['goal','Hoped-for takeaway'],['audience','Audience'],['ageRange','Age range / grade level'],['format','Session format'],['date','Preferred date'],['venue','Venue'],['name','Your name'],['email','Reply to'],['phone','Phone'],['message','About your event']]) {if(!reviewed[key])continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=key==='date'?new Date(reviewed.date+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):reviewed[key];details.append(dt,dd);}fields.hidden=true;review.hidden=false;guide?.reviewed(reviewed);notify('','');document.getElementById('review-title').focus();});
    edit.addEventListener('click',()=>{if(!busy)editRequest();});
    send.addEventListener('click',async()=>{if(busy||done||!reviewed)return;busy=true;send.disabled=true;edit.disabled=true;send.textContent='Sending…';form.setAttribute('aria-busy','true');notify('','');const result=await sendRequest(reviewed,{verified:form.dataset.deliveryStatus==='verified'});busy=false;form.removeAttribute('aria-busy');send.disabled=false;edit.disabled=false;send.textContent='Send speaking request';if(result.kind==='invalid'){editRequest();showErrors(result.errors);notify('error','Please review the requested date and your details.');return;}notify(result.kind==='success'?'success':'error',result.message);if(result.kind==='success'){guide?.completed();done=true;review.hidden=true;form.reset();syncAudience();}status.focus();});
    document.getElementById('review-button').disabled=false;
    document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{if(busy)return;if(done){done=false;fields.hidden=false;review.hidden=true;notify('','');}else if(!review.hidden)editRequest();controls.topic.value=button.dataset.topic;if(button.dataset.audience)controls.audience.value=button.dataset.audience;syncAudience();showErrors({});guide?.fromTopic();document.getElementById('invite').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(!guide)controls.topic.focus({preventScroll:true});}));
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={TOPICS,GOALS,FORMATS,AUDIENCES,localDate,normalize,validDate,validate,payload,accepted,sendRequest};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})();
