// Accept different representations without interpreting arbitrary technical claims.
export function decodeEnvelope(raw,keys,headings){
 const norm=s=>s.replace(/[^a-z0-9]/gi,'').toLowerCase();
 const aliases=new Map([...keys.map(k=>[norm(k),k]),...Object.entries(headings).map(([h,k])=>[norm(h),k])]);
 function fieldsOf(value){
  if(Array.isArray(value))return value.length&&value.every(e=>e&&typeof e==='object'&&typeof e.kind==='string')?{progressEvents:JSON.stringify(value)}:null;
  if(!value||typeof value!=='object')return null;
  if(value.packet&&typeof value.packet==='object')value=value.packet;
  else if(value.fields&&typeof value.fields==='object')value=value.fields;
  const fields={};let recognized=0;
  for(const [label,v]of Object.entries(value)){
   const key=aliases.get(norm(label));if(!key)continue;recognized++;
   const text=typeof v==='string'?v:v==null?'':Array.isArray(v)&&!['requirements','progressEvents'].includes(key)&&v.every(x=>typeof x==='string')?v.join('\n'):JSON.stringify(v);
   if(Object.hasOwn(fields,key)&&fields[key]!==text)throw Error('Conflicting values for '+key+'. Original response is preserved; review which value applies.');
   fields[key]=text;
  }
  return recognized?fields:null;
 }
 const trimmed=raw.trim();try{const f=fieldsOf(JSON.parse(trimmed));if(f)return {fields:f,extra:''};}catch(e){if(e.message.startsWith('Conflicting'))throw e;}
 // If this already has packet headings, their section parser owns embedded JSON.
 if(raw.split('\n').some(line=>{const m=line.trim().replace(/^#{1,6}\s*/,'').replace(/\*\*/g,'').match(/^([A-Za-z &]+):/);return m&&Object.hasOwn(headings,m[1].toUpperCase());}))return null;
 const candidates=[];let scanned=0;
 const scanLimit=Math.max(1000,raw.length*4);
 // Balanced scanning handles a JSON packet surrounded by explanatory prose.
 for(let start=0;start<raw.length;start++){
  if(!'{['.includes(raw[start]))continue;
  let depth=0,quote=false,escape=false;
  for(let end=start;end<raw.length;end++){
   if(++scanned>scanLimit)throw Error('The response contains excessive or unclosed JSON structure. Repair its brackets or paste one complete packet; the original response is preserved.');
   const c=raw[end];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quote=false;continue;}
   if(c==='"'){quote=true;continue;}if(c==='{'||c==='[')depth++;if(c==='}'||c===']')depth--;
   if(depth===0){try{const f=fieldsOf(JSON.parse(raw.slice(start,end+1)));if(f)candidates.push({fields:f,extra:(raw.slice(0,start)+'\n'+raw.slice(end+1)).trim()});}catch(e){if(e.message.startsWith('Conflicting'))throw e;}start=end;break;}
  }
 }
 if(candidates.length>1)throw Error('This response contains multiple separate packets. Review which belongs to this checkpoint; the original is preserved.');
 return candidates[0]||null;
}
