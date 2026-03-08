(function(){
"use strict";

const DEFAULTS=Object.freeze({
lang:"en",
style:"dark",
time:"present"
});

function normalizeLang(v){
return v==="zh"?"zh":"en";
}

function normalizeStyle(v){
return v==="light"?"light":"dark";
}

function normalizeTime(v){
return typeof v==="string"&&v.trim()?v.trim():DEFAULTS.time;
}

function readRootState(){
const root=document.documentElement;
return{
lang:normalizeLang(root.getAttribute("data-gd-lang")||DEFAULTS.lang),
style:normalizeStyle(root.getAttribute("data-gd-style")||DEFAULTS.style),
time:normalizeTime(root.getAttribute("data-gd-time")||DEFAULTS.time)
};
}

function applyRootState(state){
const root=document.documentElement;
root.setAttribute("data-gd-lang",normalizeLang(state.lang));
root.setAttribute("data-gd-style",normalizeStyle(state.style));
root.setAttribute("data-gd-time",normalizeTime(state.time));
}

function emitState(state){
document.dispatchEvent(new CustomEvent("gd:state",{
detail:{
gd_lang:state.lang,
gd_style:state.style,
gd_time:state.time
}
}));
}

function writeState(next){
const current=readRootState();
const state={
lang:normalizeLang(next&&next.lang!==undefined?next.lang:current.lang),
style:normalizeStyle(next&&next.style!==undefined?next.style:current.style),
time:normalizeTime(next&&next.time!==undefined?next.time:current.time)
};

applyRootState(state);
emitState(state);
return state;
}

function setLang(lang){
return writeState({lang:lang});
}

function setStyle(style){
return writeState({style:style});
}

function setTime(time){
return writeState({time:time});
}

function bindControls(scope){
const root=scope||document;

root.querySelectorAll("[data-set-lang]").forEach(function(node){
node.addEventListener("click",function(){
setLang(node.getAttribute("data-set-lang"));
});
});

root.querySelectorAll("[data-set-style]").forEach(function(node){
node.addEventListener("click",function(){
setStyle(node.getAttribute("data-set-style"));
});
});

root.querySelectorAll("[data-set-time]").forEach(function(node){
node.addEventListener("click",function(){
setTime(node.getAttribute("data-set-time"));
});
});
}

function init(scope){
const state=readRootState();
applyRootState(state);
bindControls(scope||document);
emitState(state);
return state;
}

window.GD_INSTRUMENTS=Object.freeze({
version:"GD_INSTRUMENTS_v2",
defaults:DEFAULTS,
readState:readRootState,
writeState:writeState,
setLang:setLang,
setStyle:setStyle,
setTime:setTime,
bindControls:bindControls,
init:init
});

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",function(){
init(document);
},{once:true});
}else{
init(document);
}
})();
