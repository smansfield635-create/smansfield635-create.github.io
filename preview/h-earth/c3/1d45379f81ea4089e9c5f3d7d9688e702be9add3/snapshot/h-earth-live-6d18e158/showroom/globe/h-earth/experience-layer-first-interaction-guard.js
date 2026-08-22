const button=document.querySelector('.h-earth-experience-audio button');
if(button){
  let firstActivation=true;
  button.addEventListener('click',event=>{
    if(!firstActivation)return;
    firstActivation=false;
    event.stopImmediatePropagation();
  },true);
}
