/* Meet Sean speaking requests. No success until the provider explicitly accepts.
   Release gate: data-delivery-status="verified" only after mailbox activation and
   an end-to-end delivery test. A provider response is not proof of inbox arrival. */
(function () {
  'use strict';
  const ENDPOINT = 'https://formsubmit.co/ajax/hello@diamondgatebridge.com';
  const TOPICS = ['The Inner Underdog', 'Consider the Energy', 'Freedom and Responsibility', 'Story, Humor and Connection', 'Building with AI', 'Help me choose'];
  const FIELDS = ['topic', 'date', 'venue', 'name', 'email', 'phone', 'message', 'website'];
  const LIMITS = {venue:180,name:100,email:254,phone:40,message:2000};
  function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function normalize(raw) { return Object.fromEntries(FIELDS.map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : ''])); }
  function validDate(value) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d=new Date(value+'T12:00:00'); return !Number.isNaN(d.getTime()) && localDate(d)===value; }
  function validate(raw, today=localDate()) {
    const data=normalize(raw), errors={};
    if(!TOPICS.includes(data.topic)) errors.topic='Choose a topic, or select “Help me choose.”';
    if(!validDate(data.date)) errors.date='Choose a valid preferred date.';
    else if(data.date<today) errors.date='Choose today or a future date.';
    if(!data.venue) errors.venue='Add a venue and city, or enter “Virtual.”';
    if(!data.name) errors.name='Please add your name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email='Please enter an email address we can reply to.';
    for(const [key,max] of Object.entries(LIMITS)) if(data[key].length>max) errors[key]=`Please keep this to ${max} characters or fewer.`;
    return {data,errors,valid:Object.keys(errors).length===0 && !data.website};
  }
  function payload(data) { return {name:data.name,email:data.email,topic:data.topic,'Requested date':data.date,'Venue / city':data.venue,phone:data.phone||'Not provided',message:data.message||'Not provided',_subject:'Speaking request — '+data.topic,_template:'table',_honey:data.website}; }
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
  function boot() {
    const form=document.getElementById('speaking-form');if(!form)return;
    const controls=Object.fromEntries(FIELDS.map(k=>[k,form.elements.namedItem(k)]));
    const fields=document.getElementById('form-fields'),review=document.getElementById('request-review'),details=document.getElementById('review-details'),status=document.getElementById('form-status'),send=document.getElementById('send-button'),edit=document.getElementById('edit-button');let busy=false,done=false,reviewed=null;
    controls.date.min=localDate();
    if(form.dataset.deliveryStatus==='verified') { form.querySelector('.preview-notice')?.remove(); send.disabled=false; send.textContent='Send speaking request'; }
    const raw=()=>Object.fromEntries(FIELDS.map(k=>[k,controls[k].value]));
    const notify=(kind,message)=>{status.dataset.kind=kind;status.textContent=message;};
    function showErrors(errors) {
      for(const [key,control] of Object.entries(controls)) {const error=document.getElementById(key+'-error');control.removeAttribute('aria-invalid');if(error)error.textContent='';const base=key==='date'?'date-hint':'';if(base)control.setAttribute('aria-describedby',base);else control.removeAttribute('aria-describedby');}
      for(const [key,message] of Object.entries(errors)) {const control=controls[key],error=document.getElementById(key+'-error');control.setAttribute('aria-invalid','true');if(error){error.textContent=message;control.setAttribute('aria-describedby',(key==='date'?'date-hint ':'')+key+'-error');}}
      const first=Object.keys(errors)[0];if(first)controls[first].focus();
    }
    function editRequest(){review.hidden=true;fields.hidden=false;reviewed=null;notify('','');controls.topic.focus();}
    form.addEventListener('submit',event=>{event.preventDefault();if(busy||done)return;controls.date.min=localDate();const result=validate(raw());showErrors(result.errors);if(!result.valid){notify('error','Please check the highlighted fields.');return;}reviewed=result.data;details.replaceChildren();for(const [key,label] of [['topic','Topic'],['date','Preferred date'],['venue','Venue'],['name','Your name'],['email','Reply to'],['phone','Phone'],['message','About your event']]) {if(!reviewed[key])continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=key==='date'?new Date(reviewed.date+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):reviewed[key];details.append(dt,dd);}fields.hidden=true;review.hidden=false;notify('','');document.getElementById('review-title').focus();});
    edit.addEventListener('click',()=>{if(!busy)editRequest();});
    send.addEventListener('click',async()=>{if(busy||done||!reviewed)return;busy=true;send.disabled=true;edit.disabled=true;send.textContent='Sending…';form.setAttribute('aria-busy','true');notify('','');const result=await sendRequest(reviewed,{verified:form.dataset.deliveryStatus==='verified'});busy=false;form.removeAttribute('aria-busy');send.disabled=false;edit.disabled=false;send.textContent='Send speaking request';if(result.kind==='invalid'){editRequest();showErrors(result.errors);notify('error','Please review the requested date and your details.');return;}notify(result.kind==='success'?'success':'error',result.message);if(result.kind==='success'){done=true;review.hidden=true;form.reset();}status.focus();});
    document.getElementById('review-button').disabled=false;
    document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{if(busy)return;if(done){done=false;fields.hidden=false;review.hidden=true;notify('','');}else if(!review.hidden)editRequest();controls.topic.value=button.dataset.topic;showErrors({});document.getElementById('invite').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});controls.topic.focus({preventScroll:true});}));
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={TOPICS,localDate,normalize,validDate,validate,payload,accepted,sendRequest};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})();
