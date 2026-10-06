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
  function initEventGuide(form,controls,{raw,showErrors,syncAudience,fields,review}){
    const root=document.getElementById('event-guide');if(!root)return null;
    const actions=document.getElementById('guide-actions');actions.hidden=false;
    const title=root.querySelector('h3'),intro=root.querySelector('.guide-intro'),ack=root.querySelector('.guide-ack'),progress=root.querySelector('.guide-progress'),next=actions.querySelector('[data-guide-next]'),back=actions.querySelector('[data-guide-back]'),skip=actions.querySelector('[data-guide-skip]'),summary=document.getElementById('event-summary'),summaryList=summary.querySelector('dl'),reviewButton=document.getElementById('review-button'),location=document.getElementById('locationMode');
    const key='dgb-speaking-draft-v1',allFields=[...fields.querySelectorAll('.field')];let current='welcome',editing=false,history=[],priorVenue='',fromCard=false,storageOK=true;
    const steps={
      welcome:{title:'Let’s shape your event.',text:'A few simple choices will help us understand your gathering. You can explore first and change any answer.',keys:[]},
      early:{title:'First, how can we reach you?',text:'Leave your name and email now, or explore the possibilities first.',keys:['name','email']},
      audience:{title:'Who will be in the room?',text:'We’ll shape the examples and participation around your audience.',keys:['audience','ageRange']},
      goal:{title:'What would you like them to leave with?',text:'Choose the closest fit. It’s fine if you’re still working that out.',keys:['goal']},
      topic:{title:'Which conversation feels right?',text:'Choose a talk, or leave it open for a personal recommendation.',keys:['topic']},
      format:{title:'How would you like the room to take part?',text:'Interactive sessions invite questions, quick votes and willing volunteers. Participation is always optional.',keys:['format']},
      date:{title:'When are you hoping to gather?',text:'This is a preferred date. Availability will be confirmed personally.',keys:['date']},
      location:{title:'Where will we meet?',text:'Choose an in-person gathering or a virtual session.',keys:['locationMode','venue']},
      notes:{title:'Anything else we should know?',text:'You might share the occasion, approximate audience size, or what would make the session meaningful. This part is optional.',keys:['message']},
      contact:{title:'Where should we follow up?',text:'Add your name and email so the team can continue the conversation.',keys:['name','email','phone']}
    };
    const sequence=['welcome','early','audience','goal','topic','format','date','location','notes','contact'];
    const recommendations={'Belonging and respect':'Rise Above Bullying','Responding with care':'Fear and Love','Confidence through setbacks':'The Inner Underdog','Communication and public speaking':'Finding Your Voice'};
    const labels={audience:'Audience',ageRange:'Age / grade',goal:'Hoped-for takeaway',topic:'Talk',format:'Experience',date:'Preferred date',venue:'Location',message:'Event notes',name:'Name',email:'Reply to',phone:'Phone'};
    const owner={audience:'audience',ageRange:'audience',goal:'goal',topic:'topic',format:'format',date:'date',venue:'location',message:'notes',name:'contact',email:'contact',phone:'contact'};
    function save(){try{sessionStorage.setItem(key,JSON.stringify({version:1,values:Object.fromEntries(Object.keys(labels).map(k=>[k,controls[k].value])),location:location.value,priorVenue,current,fromCard}));}catch{storageOK=false;}actions.querySelector('.guide-saving').textContent=storageOK?'Your progress stays in this tab until you clear it.':'Your answers stay here while this page is open.';}
    try{const draft=JSON.parse(sessionStorage.getItem(key)||'null');if(draft?.version===1){for(const [k,v]of Object.entries(draft.values||{})){if(controls[k]&&Object.hasOwn(labels,k)&&typeof v==='string')controls[k].value=v.slice(0,LIMITS[k]||2000);}if(['In person','Virtual'].includes(draft.location))location.value=draft.location;priorVenue=typeof draft.priorVenue==='string'?draft.priorVenue.slice(0,180):'';if(sequence.includes(draft.current))current=draft.current;fromCard=draft.fromCard===true;}}catch{storageOK=false;}
    function syncLocation(){if(location.value==='Virtual'){if(controls.venue.value&&controls.venue.value!=='Virtual')priorVenue=controls.venue.value;controls.venue.value='Virtual';}else if(controls.venue.value==='Virtual')controls.venue.value=priorVenue;}
    function summarize(){summaryList.replaceChildren();for(const [k,label]of Object.entries(labels)){const value=controls[k].value.trim();if(!value||(k==='ageRange'&&controls.audience.value!=='Schools & youth'))continue;const dt=document.createElement('dt'),dd=document.createElement('dd'),button=document.createElement('button');dt.textContent=label;button.type='button';button.textContent=value;button.setAttribute('aria-label',`Change ${label}: ${value}`);button.addEventListener('click',()=>{editing=true;review.hidden=true;fields.hidden=false;show(owner[k]);});dd.append(button);summaryList.append(dt,dd);}if(!summaryList.children.length){const dd=document.createElement('dd');dd.textContent='Your choices will appear here.';summaryList.append(dd);}}
    function choices(){for(const select of [controls.audience,controls.goal,controls.topic,controls.format,location]){const group=document.createElement('div');group.className='guide-choices';select.closest('.field').classList.add('guide-choice-field');group.setAttribute('role','group');group.setAttribute('aria-label',select.closest('.field').querySelector('label').textContent);for(const option of select.options){if(!option.value)continue;const button=document.createElement('button');button.type='button';button.textContent=option.textContent;button.dataset.value=option.value;button.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));});group.append(button);}select.after(group);select.hidden=true;}}
    function syncChoices(){root.parentElement.querySelectorAll('.guide-choices').forEach(group=>{const select=group.previousElementSibling;[...group.children].forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===select.value)));});}
    function show(step,focus=true){current=step;const spec=steps[step];fields.hidden=false;root.hidden=false;actions.hidden=false;title.textContent=spec.title;intro.textContent=spec.text;progress.textContent=step==='welcome'?'YOUR EVENT':'LET’S SHAPE YOUR EVENT';allFields.forEach(field=>field.hidden=!spec.keys.some(k=>field.contains(k==='locationMode'?location:controls[k])));syncAudience();document.getElementById('age-range-field').hidden=step!=='audience'||controls.audience.value!=='Schools & youth';controls.venue.closest('.field').hidden=step!=='location'||location.value==='Virtual';reviewButton.hidden=step!=='contact';next.hidden=step==='contact';next.textContent=step==='welcome'?'Let’s get started':step==='notes'&&contactValid()?'Review your event':'Continue';back.hidden=step==='welcome';skip.hidden=step!=='early';summary.hidden=step==='welcome';syncChoices();summarize();save();if(step==='audience'&&!editing&&fromCard&&controls.audience.value==='Schools & youth'){title.textContent='What age range or grade level?';controls.audience.closest('.field').hidden=true;}if(step==='topic'&&recommendations[controls.goal.value])intro.textContent=`Based on that goal, “${recommendations[controls.goal.value]}” may be a good fit. You can choose any talk.`;if(focus)title.focus({preventScroll:true});}
    function contactValid(){const errors=validate(raw()).errors;return !errors.name&&!errors.email;}
    function check(){const keys=steps[current].keys,errors=validate(raw()).errors,local=Object.fromEntries(Object.entries(errors).filter(([k])=>keys.includes(k)));showErrors(local);return !Object.keys(local).length;}
    function reviewNow(){form.requestSubmit(reviewButton);}
    function advance(){if(current!=='welcome'&&!check())return;if(editing){reviewNow();return;}const previous=current;history.push(previous);ack.textContent=current==='early'?'Thank you. Let’s talk about your gathering.':current==='audience'?(controls.audience.value==='Schools & youth'?'We’ll keep the examples appropriate for that group.':'We’ll keep your audience in mind.'):current==='goal'?'That gives us a useful direction.':current==='topic'?`We’ll carry “${controls.topic.value}” into your event summary.`:current==='format'?'We’ll shape the session around that preference.':current==='date'?'We’ve noted your preferred date; it still needs confirmation.':current==='location'?(location.value==='Virtual'?'A virtual session—got it.':'We’ve noted the venue and city.'):'Your details are ready to review.';
      if(current==='contact'||(current==='notes'&&contactValid())){reviewNow();return;}
      let i=sequence.indexOf(current)+1;if(sequence[i]==='topic'&&fromCard&&controls.topic.value)i++;show(sequence[i]);}
    next.addEventListener('click',advance);back.addEventListener('click',()=>{ack.textContent='You can change any of these details.';show(history.pop()||sequence[Math.max(0,sequence.indexOf(current)-1)]);});skip.addEventListener('click',()=>{history.push(current);ack.textContent='Of course. Let’s explore the possibilities first.';show('audience');});
    actions.querySelector('[data-guide-clear]').addEventListener('click',()=>{form.reset();editing=false;priorVenue='';fromCard=false;history=[];review.hidden=true;showErrors({});ack.textContent='A fresh start.';try{sessionStorage.removeItem(key);}catch{}show('welcome');});
    form.addEventListener('input',()=>{save();summarize();});form.addEventListener('change',event=>{if(event.target===location)syncLocation();if(event.target===controls.audience)syncAudience();show(current,false);});
    choices();syncLocation();form.classList.add('guided-event');show(current,false);
    return {advance,completed(){try{sessionStorage.removeItem(key);}catch{}},reveal(k){if(owner[k])show(owner[k],false);},reviewed(data){root.hidden=true;actions.hidden=true;summary.hidden=false;summary.open=false;summarize();const lines=Object.entries(labels).filter(([k])=>data[k]).map(([k,label])=>`${label}: ${data[k]}`);const body='Hello Sean,\n\nI would like to discuss a speaking event.\n\n'+lines.join('\n')+'\n\nI understand the date is subject to confirmation.';const link=document.getElementById('event-email-draft');link.href='mailto:hello@diamondgatebridge.com?subject='+encodeURIComponent('Speaking inquiry — '+data.topic)+'&body='+encodeURIComponent(body);document.getElementById('event-copy-text').value=body;},edit(){editing=true;show('contact');},fromTopic(){editing=false;fromCard=true;history=[];ack.textContent=`Let’s shape an event around “${controls.topic.value}”.`;show(controls.audience.value==='Help me decide'||(controls.audience.value==='Schools & youth'&&!controls.ageRange.value.trim())?'audience':'goal');},canReview(){return editing||current==='contact'||(current==='notes'&&contactValid());}};
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
      const first=Object.keys(errors)[0];if(first){guide?.reveal(first);const control=controls[first];if(control.hidden)control.nextElementSibling?.querySelector('button')?.focus();else control.focus();}
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
