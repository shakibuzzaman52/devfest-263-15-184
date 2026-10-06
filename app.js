function updateStatuses(){
if(!state.tender||!state.requirements.length){
generateBtn.disabled=true;
return;
}

let hasBlocking=false;
let blockingCount=0;
let okCount=0;
let optionalCount=0;

state.requirements.forEach(r=>{
const status=calculateStatus(r);
const element=document.getElementById(`status-${r.id}`);

if(!element)return;

element.textContent=statusText(status);
element.className=`status ${statusClass(status)}`;

if(
status==="missing"||
status==="expiryNeeded"||
status==="expired"
){
hasBlocking=true;
blockingCount++;
}

if(status==="ok"){
okCount++;
}

if(status==="notProvided"){
optionalCount++;
}
});

const missingCount=document.getElementById("missingCount");
const readyCount=document.getElementById("okCount");
const optionalCountElement=document.getElementById("optionalCount");

if(missingCount){
missingCount.textContent=blockingCount;
}

if(readyCount){
readyCount.textContent=okCount;
}

if(optionalCountElement){
optionalCountElement.textContent=optionalCount;
}

generateBtn.disabled=
hasBlocking||
state.files.length===0;

const message=document.getElementById("blockingMessage");

if(hasBlocking){
message.textContent=t("generationBlocked");
message.className="message-error";
}else if(state.files.length===0){
message.textContent=t("noFiles");
message.className="message-warning";
}else{
message.textContent="";
message.className="";
}
}