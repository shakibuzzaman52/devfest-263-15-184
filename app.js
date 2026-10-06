pdfjsLib.GlobalWorkerOptions.workerSrc=
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const MAX_FILES=30;
const MAX_TOTAL_SIZE=50*1024*1024;

const state={
tender:null,
requirements:[],
files:[],
language:"en"
};

const translations={
en:{
appTitle:"Tender Document Package Builder",
loadRequirements:"Load Tender Requirements",
tenderInformation:"Tender Information",
tenderId:"Tender ID:",
title:"Title:",
procuringEntity:"Procuring Entity:",
bidder:"Bidder:",
deadline:"Submission Deadline:",
requiredDocuments:"Required Documents",
order:"Order",
document:"Document",
mandatory:"Mandatory",
expiry:"Expiry",
status:"Status",
uploadFiles:"Upload PDF Files",
uploadLimit:"Maximum 30 files, 50 MB total",
fileName:"File Name",
pages:"Pages",
size:"Size",
duplicate:"Duplicate",
match:"Match",
expiryDate:"Expiry Date",
action:"Action",
generate:"Generate Package",
yes:"Yes",
no:"No",
notMatched:"Not matched",
remove:"Remove",
missing:"Missing",
expiryNeeded:"Expiry date needed",
expired:"Expired",
notProvided:"Not provided",
ok:"OK",
duplicateText:"Duplicate",
noDuplicate:"No",
requirementsLoaded:"Requirements loaded successfully.",
invalidRequirements:"Invalid requirements.json file.",
onlyPdf:"Only PDF files are allowed.",
maxFiles:"Maximum 30 PDF files are allowed.",
maxSize:"Total file size cannot exceed 50 MB.",
pdfError:"Unable to read this PDF. It may be damaged or password protected.",
filesProcessed:"File processing completed.",
fileRemoved:"File removed.",
matchError:"This match is not allowed.",
generationBlocked:"Package generation is blocked because one or more documents have blocking problems.",
generated:"Package generated successfully.",
generationError:"Failed to generate the package.",
noRequirements:"Load requirements.json first.",
noFiles:"No files uploaded.",
invalidStructure:"Invalid JSON structure.",
invalidTender:"Tender information is missing or invalid.",
invalidRequirement:"One or more requirements are invalid.",
duplicateDifferent:"Exact duplicate files cannot be matched to different documents.",
sameRequirement:"This document is already matched to another file."
},
bn:{
appTitle:"টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",
loadRequirements:"টেন্ডারের Requirements লোড করুন",
tenderInformation:"টেন্ডারের তথ্য",
tenderId:"টেন্ডার আইডি:",
title:"শিরোনাম:",
procuringEntity:"প্রকিউরিং এন্টিটি:",
bidder:"বিডার:",
deadline:"জমাদানের শেষ তারিখ:",
requiredDocuments:"প্রয়োজনীয় ডকুমেন্ট",
order:"ক্রম",
document:"ডকুমেন্ট",
mandatory:"আবশ্যিক",
expiry:"মেয়াদ",
status:"স্ট্যাটাস",
uploadFiles:"PDF ফাইল আপলোড করুন",
uploadLimit:"সর্বোচ্চ ৩০টি ফাইল, মোট ৫০ MB",
fileName:"ফাইলের নাম",
pages:"পৃষ্ঠা",
size:"সাইজ",
duplicate:"ডুপ্লিকেট",
match:"ম্যাচ",
expiryDate:"মেয়াদ শেষের তারিখ",
action:"অ্যাকশন",
generate:"প্যাকেজ তৈরি করুন",
yes:"হ্যাঁ",
no:"না",
notMatched:"ম্যাচ করা হয়নি",
remove:"মুছে ফেলুন",
missing:"অনুপস্থিত",
expiryNeeded:"মেয়াদ শেষের তারিখ প্রয়োজন",
expired:"মেয়াদ শেষ",
notProvided:"দেওয়া হয়নি",
ok:"ঠিক আছে",
duplicateText:"ডুপ্লিকেট",
noDuplicate:"না",
requirementsLoaded:"Requirements সফলভাবে লোড হয়েছে।",
invalidRequirements:"requirements.json ফাইলটি সঠিক নয়।",
onlyPdf:"শুধু PDF ফাইল গ্রহণ করা যাবে।",
maxFiles:"সর্বোচ্চ ৩০টি PDF ফাইল দেওয়া যাবে।",
maxSize:"মোট ফাইল সাইজ ৫০ MB-এর বেশি হতে পারবে না।",
pdfError:"এই PDF পড়া যাচ্ছে না। এটি নষ্ট বা password protected হতে পারে।",
filesProcessed:"ফাইল প্রসেস করা হয়েছে।",
fileRemoved:"ফাইল মুছে ফেলা হয়েছে।",
matchError:"এই ম্যাচটি করা যাবে না।",
generationBlocked:"এক বা একাধিক ডকুমেন্টে সমস্যা থাকায় প্যাকেজ তৈরি করা যাচ্ছে না।",
generated:"প্যাকেজ সফলভাবে তৈরি হয়েছে।",
generationError:"প্যাকেজ তৈরি করা যায়নি।",
noRequirements:"প্রথমে requirements.json লোড করুন।",
noFiles:"কোনো ফাইল আপলোড করা হয়নি।",
invalidStructure:"JSON structure সঠিক নয়।",
invalidTender:"Tender তথ্য সঠিক নয় বা পাওয়া যায়নি।",
invalidRequirement:"এক বা একাধিক requirement সঠিক নয়।",
duplicateDifferent:"একই content-এর duplicate file আলাদা document-এ match করা যাবে না।",
sameRequirement:"এই document ইতিমধ্যে অন্য একটি file-এর সাথে matched।"
}
};

const requirementsFile=document.getElementById("requirementsFile");
const pdfFilesInput=document.getElementById("pdfFiles");
const languageBtn=document.getElementById("languageBtn");
const generateBtn=document.getElementById("generateBtn");

requirementsFile.addEventListener("change",handleRequirementsFile);
pdfFilesInput.addEventListener("change",handlePdfFiles);
languageBtn.addEventListener("click",toggleLanguage);
generateBtn.addEventListener("click",generatePackage);

function t(key){
return translations[state.language][key]||key;
}

function toggleLanguage(){
state.language=state.language==="en"?"bn":"en";
applyLanguage();
renderTender();
renderRequirements();
renderFiles();
updateStatuses();
}

function applyLanguage(){
document.querySelectorAll("[data-i18n]").forEach(el=>{
el.textContent=t(el.dataset.i18n);
});
languageBtn.textContent=state.language==="en"?"বাংলা":"English";
}

async function handleRequirementsFile(event){
const file=event.target.files[0];
if(!file)return;

const message=document.getElementById("requirementsMessage");

try{
const data=JSON.parse(await file.text());
validateRequirements(data);

state.tender=data.tender;
state.requirements=[...data.requirements].sort((a,b)=>a.order-b.order);

state.files.forEach(f=>{
f.matchedRequirementId=null;
f.expiryDate=null;
});

renderTender();
renderRequirements();
renderFiles();
updateStatuses();

message.textContent=t("requirementsLoaded");
message.className="message-success";
}catch(error){
console.error(error);
state.tender=null;
state.requirements=[];
document.getElementById("tenderSection").hidden=true;
document.getElementById("requirementsSection").hidden=true;
message.textContent=error.messageKey?t(error.messageKey):t("invalidRequirements");
message.className="message-error";
}

event.target.value="";
}

function validateRequirements(data){
if(!data||typeof data!=="object"){
const e=new Error();
e.messageKey="invalidStructure";
throw e;
}

if(!data.tender||typeof data.tender!=="object"){
const e=new Error();
e.messageKey="invalidTender";
throw e;
}

const tenderFields=[
"tender_id",
"title",
"procuring_entity",
"bidder",
"submission_deadline"
];

for(const field of tenderFields){
if(typeof data.tender[field]!=="string"||!data.tender[field].trim()){
const e=new Error();
e.messageKey="invalidTender";
throw e;
}
}

if(!/^\d{4}-\d{2}-\d{2}$/.test(data.tender.submission_deadline)){
const e=new Error();
e.messageKey="invalidTender";
throw e;
}

if(!Array.isArray(data.requirements)){
const e=new Error();
e.messageKey="invalidStructure";
throw e;
}

const ids=new Set();

for(const r of data.requirements){
if(
!r||
typeof r.id!=="string"||
!r.id||
ids.has(r.id)||
typeof r.order!=="number"||
typeof r.title_en!=="string"||
typeof r.title_bn!=="string"||
typeof r.mandatory!=="boolean"||
typeof r.has_expiry!=="boolean"
){
const e=new Error();
e.messageKey="invalidRequirement";
throw e;
}

ids.add(r.id);
}
}

function renderTender(){
if(!state.tender)return;

document.getElementById("tenderId").textContent=state.tender.tender_id;
document.getElementById("tenderTitle").textContent=state.tender.title;
document.getElementById("procuringEntity").textContent=state.tender.procuring_entity;
document.getElementById("bidder").textContent=state.tender.bidder;
document.getElementById("deadline").textContent=state.tender.submission_deadline;
document.getElementById("tenderSection").hidden=false;
}

function renderRequirements(){
const tbody=document.getElementById("requirementsTableBody");
tbody.innerHTML="";

state.requirements.forEach(r=>{
const row=document.createElement("tr");

const order=document.createElement("td");
order.textContent=r.order;

const title=document.createElement("td");
title.textContent=getTitle(r);

const mandatory=document.createElement("td");
mandatory.textContent=r.mandatory?t("yes"):t("no");

const expiry=document.createElement("td");
expiry.textContent=r.has_expiry?t("yes"):t("no");

const status=document.createElement("td");
status.id=`status-${r.id}`;
status.className="status";

row.append(order,title,mandatory,expiry,status);
tbody.appendChild(row);
});

document.getElementById("requirementsSection").hidden=false;
}

async function handlePdfFiles(event){
const selected=Array.from(event.target.files);

if(!selected.length)return;

const message=document.getElementById("uploadMessage");

if(state.files.length+selected.length>MAX_FILES){
showUploadMessage(t("maxFiles"),"error");
event.target.value="";
return;
}

const currentSize=state.files.reduce((sum,f)=>sum+f.size,0);
const selectedSize=selected.reduce((sum,f)=>sum+f.size,0);

if(currentSize+selectedSize>MAX_TOTAL_SIZE){
showUploadMessage(t("maxSize"),"error");
event.target.value="";
return;
}

let processed=0;
let failed=0;

for(const file of selected){
const isPdf=
file.type==="application/pdf"||
file.name.toLowerCase().endsWith(".pdf");

if(!isPdf){
failed++;
showUploadMessage(`${file.name}: ${t("onlyPdf")}`,"error");
continue;
}

try{
const buffer=await file.arrayBuffer();

const hash=await calculateHash(buffer);

const pdfBuffer=buffer.slice(0);
const pdf=await pdfjsLib.getDocument({
data:pdfBuffer
}).promise;

state.files.push({
id:crypto.randomUUID(),
file,
buffer,
name:file.name,
size:file.size,
pages:pdf.numPages,
hash,
isDuplicate:false,
matchedRequirementId:null,
expiryDate:null
});

processed++;
}catch(error){
console.error(error);
failed++;
showUploadMessage(`${file.name}: ${t("pdfError")}`,"error");
}
}

updateDuplicates();
renderFiles();
updateStatuses();

if(processed>0&&failed===0){
showUploadMessage(t("filesProcessed"),"success");
}else if(processed>0){
showUploadMessage(`${processed} file(s) processed, ${failed} rejected.`,"error");
}

event.target.value="";
}

async function calculateHash(buffer){
const safeBuffer=buffer.slice(0);
const hashBuffer=await crypto.subtle.digest("SHA-256",safeBuffer);

return Array.from(new Uint8Array(hashBuffer))
.map(byte=>byte.toString(16).padStart(2,"0"))
.join("");
}

function updateDuplicates(){
const counts=new Map();

for(const file of state.files){
counts.set(file.hash,(counts.get(file.hash)||0)+1);
}

for(const file of state.files){
file.isDuplicate=counts.get(file.hash)>1;
}
}

function renderFiles(){
const tbody=document.getElementById("filesTableBody");
tbody.innerHTML="";

state.files.forEach(file=>{
const row=document.createElement("tr");

const name=document.createElement("td");
name.textContent=file.name;

const pages=document.createElement("td");
pages.textContent=file.pages;

const size=document.createElement("td");
size.textContent=formatSize(file.size);

const duplicate=document.createElement("td");
duplicate.textContent=file.isDuplicate?t("duplicateText"):t("noDuplicate");
if(file.isDuplicate)duplicate.className="duplicate-cell";

const match=document.createElement("td");
const select=document.createElement("select");

const none=document.createElement("option");
none.value="";
none.textContent=t("notMatched");
select.appendChild(none);

state.requirements.forEach(r=>{
const option=document.createElement("option");

option.value=r.id;
option.textContent=`${r.order}. ${getTitle(r)}`;

if(file.matchedRequirementId===r.id){
option.selected=true;
}

const usedByAnother=state.files.some(
other=>
other.id!==file.id&&
other.matchedRequirementId===r.id
);

if(usedByAnother){
option.disabled=true;
}

if(
file.isDuplicate&&
duplicateWouldBlock(file,r.id)
){
option.disabled=true;
}

select.appendChild(option);
});

select.addEventListener("change",()=>{
setMatch(file.id,select.value);
});

match.appendChild(select);

const expiry=document.createElement("td");
const requirement=getRequirement(file.matchedRequirementId);

if(requirement&&requirement.has_expiry){
const input=document.createElement("input");
input.type="date";
input.value=file.expiryDate||"";
input.max="";
input.addEventListener("change",()=>{
file.expiryDate=input.value||null;
updateStatuses();
});
expiry.appendChild(input);
}else{
expiry.textContent="-";
}

const action=document.createElement("td");
const remove=document.createElement("button");
remove.textContent=t("remove");
remove.addEventListener("click",()=>{
removeFile(file.id);
});

action.appendChild(remove);

row.append(
name,
pages,
size,
duplicate,
match,
expiry,
action
);

tbody.appendChild(row);
});
}

function setMatch(fileId,requirementId){
const file=state.files.find(f=>f.id===fileId);

if(!file)return;

if(!requirementId){
file.matchedRequirementId=null;
file.expiryDate=null;
renderFiles();
updateStatuses();
return;
}

if(duplicateWouldBlock(file,requirementId)){
alert(t("duplicateDifferent"));
renderFiles();
return;
}

const alreadyUsed=state.files.some(
other=>
other.id!==file.id&&
other.matchedRequirementId===requirementId
);

if(alreadyUsed){
alert(t("sameRequirement"));
renderFiles();
return;
}

file.matchedRequirementId=requirementId;

const requirement=getRequirement(requirementId);

if(!requirement.has_expiry){
file.expiryDate=null;
}

renderFiles();
updateStatuses();
}

function duplicateWouldBlock(file,requirementId){
if(!file.isDuplicate)return false;

return state.files.some(
other=>
other.id!==file.id&&
other.hash===file.hash&&
other.matchedRequirementId&&
other.matchedRequirementId!==requirementId
);
}

function getRequirement(id){
if(!id)return null;
return state.requirements.find(r=>r.id===id)||null;
}

function getTitle(requirement){
return state.language==="bn"
?requirement.title_bn
:requirement.title_en;
}

function getFileForRequirement(id){
return state.files.find(
file=>file.matchedRequirementId===id
)||null;
}

function calculateStatus(requirement){
const file=getFileForRequirement(requirement.id);

if(!file){
return requirement.mandatory
?"missing"
:"notProvided";
}

if(requirement.has_expiry&&!file.expiryDate){
return "expiryNeeded";
}

if(
requirement.has_expiry&&
file.expiryDate<
state.tender.submission_deadline
){
return "expired";
}

return "ok";
}

function updateStatuses(){
if(!state.tender||!state.requirements.length){
generateBtn.disabled=true;
return;
}

let hasBlocking=false;

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
}
});

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

function statusText(status){
return t(status);
}

function statusClass(status){
if(status==="ok")return"status-ok";
if(status==="notProvided")return"status-warning";
return"status-error";
}

function removeFile(id){
state.files=state.files.filter(file=>file.id!==id);

updateDuplicates();
renderFiles();
updateStatuses();

showUploadMessage(t("fileRemoved"),"success");
}

function formatSize(bytes){
if(bytes<1024)return`${bytes} B`;
if(bytes<1024*1024)return`${(bytes/1024).toFixed(1)} KB`;
return`${(bytes/(1024*1024)).toFixed(2)} MB`;
}

function showUploadMessage(message,type){
const element=document.getElementById("uploadMessage");
element.textContent=message;
element.className=
type==="success"
?"message-success"
:"message-error";
}

async function generatePackage(){
if(!state.tender||!state.requirements.length){
alert(t("noRequirements"));
return;
}

const statuses=state.requirements.map(calculateStatus);

const blocked=statuses.some(
status=>
status==="missing"||
status==="expiryNeeded"||
status==="expired"
);

if(blocked){
updateStatuses();
return;
}

if(!state.files.length){
updateStatuses();
return;
}

generateBtn.disabled=true;

try{
const outputPdf=await PDFLib.PDFDocument.create();

const includedRequirements=
state.requirements.filter(
r=>getFileForRequirement(r.id)
);

await createCoverPage(
outputPdf,
includedRequirements
);

for(const requirement of includedRequirements){
const file=getFileForRequirement(requirement.id);

if(!file)continue;

await appendPdf(
outputPdf,
file.buffer
);
}

await addFooters(outputPdf);

const bytes=await outputPdf.save();

const blob=new Blob(
[bytes],
{type:"application/pdf"}
);

const url=URL.createObjectURL(blob);
const anchor=document.createElement("a");

anchor.href=url;
anchor.download=
`${state.tender.tender_id}_Package.pdf`;

document.body.appendChild(anchor);
anchor.click();
anchor.remove();

setTimeout(()=>{
URL.revokeObjectURL(url);
},1000);

alert(t("generated"));
}catch(error){
console.error(error);
alert(t("generationError"));
}finally{
updateStatuses();
}
}

async function createCoverPage(pdf,includedRequirements){
const page=pdf.addPage();
const{width,height}=page.getSize();

const font=await pdf.embedFont(
PDFLib.StandardFonts.Helvetica
);

const boldFont=await pdf.embedFont(
PDFLib.StandardFonts.HelveticaBold
);

let y=height-60;

page.drawText(
"Tender Document Package",
{
x:50,
y,
size:22,
font:boldFont
}
);

y-=45;

const lines=[
`Tender ID: ${state.tender.tender_id}`,
`Tender Title: ${state.tender.title}`,
`Procuring Entity: ${state.tender.procuring_entity}`,
`Bidder: ${state.tender.bidder}`,
`Submission Deadline: ${state.tender.submission_deadline}`,
`Package Date: ${formatDate(new Date())}`
];

for(const line of lines){
page.drawText(
line,
{
x:50,
y,
size:11,
font
}
);

y-=22;
}

y-=20;

page.drawText(
"Included Documents",
{
x:50,
y,
size:14,
font:boldFont
}
);

y-=28;

includedRequirements.forEach(
(requirement,index)=>{
page.drawText(
`${index+1}. ${requirement.title_en}`,
{
x:60,
y,
size:11,
font
}
);

y-=20;
}
);
}

async function appendPdf(outputPdf,buffer){
const sourcePdf=
await PDFLib.PDFDocument.load(buffer);

const pages=
await outputPdf.copyPages(
sourcePdf,
sourcePdf.getPageIndices()
);

pages.forEach(page=>{
outputPdf.addPage(page);
});
}

async function addFooters(pdf){
const pages=pdf.getPages();
const total=pages.length;

const font=await pdf.embedFont(
PDFLib.StandardFonts.Helvetica
);

pages.forEach((page,index)=>{
const{width}=page.getSize();

const footer=
`${state.tender.tender_id} | Page ${index+1} of ${total}`;

const size=8;

const footerWidth=
font.widthOfTextAtSize(
footer,
size
);

page.drawText(
footer,
{
x:(width-footerWidth)/2,
y:12,
size,
font
}
);
});
}

function formatDate(date){
const year=date.getFullYear();
const month=String(
date.getMonth()+1
).padStart(2,"0");

const day=String(
date.getDate()
).padStart(2,"0");

return`${year}-${month}-${day}`;
}

applyLanguage();