(function(){
  "use strict";
  var KEY="dgb_owner_device_v1";
  var allowed={s26:"OWNER_S26",a9-1:"OWNER_A9_1",a9-2:"OWNER_A9_2"};
  function marker(){
    try{return localStorage.getItem(KEY)||"";}catch(e){return "";}
  }
  function set(v){
    try{localStorage.setItem(KEY,v);document.cookie="dgb_owner_device="+encodeURIComponent(v)+"; Path=/; Max-Age=31536000; SameSite=Lax";}catch(e){}
  }
  var p=new URLSearchParams(location.search), enroll=p.get("dgb_owner");
  if(enroll && allowed[enroll]){
    set(allowed[enroll]);
    history.replaceState(null,"",location.pathname+location.hash);
  }
  var id=marker();
  if(id){
    document.documentElement.dataset.dgbOwnerDevice=id;
    window.DGB_OWNER_DEVICE=id;
  }
})();
