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
  function boot() {
    initAgendas();
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
