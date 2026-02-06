async function loadGauges(){
  const res = await fetch('/gauges/live.json?ts='+Date.now());
  const data = await res.json();
  const box = document.getElementById('gauges');
  box.innerHTML='';

  Object.entries(data.gauges).forEach(([key,g])=>{
    const pct = Math.max(0,Math.min(1,g.value));
    const card=document.createElement('div');
    card.className='gaugeCard';
    card.innerHTML=`
      <div class="gaugeTitle">${key.toUpperCase()}</div>
      <div class="gaugeValue">${g.value}</div>
      <div class="bar"><div class="fill" style="width:${pct*100}%"></div></div>
    `;
    card.onclick=()=>openModal(key,g.value,data.updated);
    box.appendChild(card);
  });
}

function openModal(name,value,updated){
  const m=document.getElementById('modal');
  document.getElementById('modalBody').innerHTML=`
    <h2>${name.toUpperCase()}</h2>
    <p><strong>Value:</strong> ${value}</p>
    <p><strong>Updated:</strong> ${updated}</p>
    <p>This gauge reflects observer-invariant measurement.</p>
  `;
  m.classList.add('show');
}

function closeModal(){document.getElementById('modal').classList.remove('show');}

setInterval(loadGauges,10000);
window.onload=loadGauges;
