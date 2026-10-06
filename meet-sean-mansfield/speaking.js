/* Meet Sean speaking requests. No success until the provider explicitly accepts.
   Release gate: data-delivery-status="verified" only after mailbox activation and
   an end-to-end delivery test. A provider response is not proof of inbox arrival. */
(function () {
  'use strict';
  const ENDPOINT = 'https://formsubmit.co/ajax/hello@diamondgatebridge.com';
  const TOPICS = ['Rise Above Bullying', 'Fear and Love', 'The Inner Underdog', 'Finding Your Voice', 'Help me choose'];
  const FORMATS = ['Interactive session', 'Traditional talk', 'Help me decide'];
  const AUDIENCES = ['Professional & adult', 'Schools & youth', 'Help me decide'];
  const FIELDS = ['topic', 'audience', 'ageRange', 'format', 'date', 'venue', 'name', 'email', 'phone', 'message', 'website'];
  const LIMITS = {ageRange:120,venue:180,name:100,email:254,phone:40,message:2000};
  function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function normalize(raw) { const data=Object.fromEntries(FIELDS.map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : (['format','audience'].includes(key) ? 'Help me decide' : '')])); if(data.audience!=='Schools & youth')data.ageRange=''; return data; }
  function validDate(value) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d=new Date(value+'T12:00:00'); return !Number.isNaN(d.getTime()) && localDate(d)===value; }
  function validate(raw, today=localDate()) {
    const data=normalize(raw), errors={};
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
  function payload(data) { return {name:data.name,email:data.email,topic:data.topic,Audience:data.audience,'Age range / grade level':data.ageRange||'Not applicable','Session format':data.format,'Requested date':data.date,'Venue / city':data.venue,phone:data.phone||'Not provided',message:data.message||'Not provided',_subject:'Speaking request — '+data.topic,_template:'table',_honey:data.website}; }
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
    dialog.addEventListener('click',event=>{if(event.target.closest('[data-topic]')){dialog.close();finishClose();requestAnimationFrame(()=>document.getElementById('topic').focus({preventScroll:true}));}},true);
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
    const raw=()=>Object.fromEntries(FIELDS.map(k=>[k,controls[k].value]));
    const notify=(kind,message)=>{status.dataset.kind=kind;status.textContent=message;};
    function showErrors(errors) {
      for(const [key,control] of Object.entries(controls)) {const error=document.getElementById(key+'-error');control.removeAttribute('aria-invalid');if(error)error.textContent='';const base=key==='date'?'date-hint':key==='ageRange'?'ageRange-hint':'';if(base)control.setAttribute('aria-describedby',base);else control.removeAttribute('aria-describedby');}
      for(const [key,message] of Object.entries(errors)) {const control=controls[key],error=document.getElementById(key+'-error');control.setAttribute('aria-invalid','true');if(error){error.textContent=message;control.setAttribute('aria-describedby',(key==='date'?'date-hint ':key==='ageRange'?'ageRange-hint ':'')+key+'-error');}}
      const first=Object.keys(errors)[0];if(first)controls[first].focus();
    }
    function editRequest(){review.hidden=true;fields.hidden=false;reviewed=null;notify('','');controls.topic.focus();}
    form.addEventListener('submit',event=>{event.preventDefault();if(busy||done)return;controls.date.min=localDate();const result=validate(raw());showErrors(result.errors);if(!result.valid){notify('error','Please check the highlighted fields.');return;}reviewed=result.data;details.replaceChildren();for(const [key,label] of [['topic','Topic'],['audience','Audience'],['ageRange','Age range / grade level'],['format','Session format'],['date','Preferred date'],['venue','Venue'],['name','Your name'],['email','Reply to'],['phone','Phone'],['message','About your event']]) {if(!reviewed[key])continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=key==='date'?new Date(reviewed.date+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):reviewed[key];details.append(dt,dd);}fields.hidden=true;review.hidden=false;notify('','');document.getElementById('review-title').focus();});
    edit.addEventListener('click',()=>{if(!busy)editRequest();});
    send.addEventListener('click',async()=>{if(busy||done||!reviewed)return;busy=true;send.disabled=true;edit.disabled=true;send.textContent='Sending…';form.setAttribute('aria-busy','true');notify('','');const result=await sendRequest(reviewed,{verified:form.dataset.deliveryStatus==='verified'});busy=false;form.removeAttribute('aria-busy');send.disabled=false;edit.disabled=false;send.textContent='Send speaking request';if(result.kind==='invalid'){editRequest();showErrors(result.errors);notify('error','Please review the requested date and your details.');return;}notify(result.kind==='success'?'success':'error',result.message);if(result.kind==='success'){done=true;review.hidden=true;form.reset();syncAudience();}status.focus();});
    document.getElementById('review-button').disabled=false;
    document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{if(busy)return;if(done){done=false;fields.hidden=false;review.hidden=true;notify('','');}else if(!review.hidden)editRequest();controls.topic.value=button.dataset.topic;if(button.dataset.audience)controls.audience.value=button.dataset.audience;syncAudience();showErrors({});document.getElementById('invite').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});controls.topic.focus({preventScroll:true});}));
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={TOPICS,FORMATS,AUDIENCES,localDate,normalize,validDate,validate,payload,accepted,sendRequest};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})();
