const FORM_KEY='pandanvalley_discovery_v1';
const form=document.getElementById('discoveryForm');
const statusBox=document.getElementById('status');

function collect(){
  const fd=new FormData(form), data={};
  for(const [k,v] of fd.entries()){
    if(data[k]!==undefined){if(!Array.isArray(data[k]))data[k]=[data[k]];data[k].push(v)}
    else data[k]=v;
  }
  data._meta={title:'Pandan Valley Smart Estate Management - Pre-Quotation Requirements Discovery',preparedFor:'MCST 581 Pandan Valley Condominium',preparedBy:'Axon 1Pro Solutions',website:'axon.com.sg',email:'support@axon.com.sg',exportedAt:new Date().toISOString()};
  return data;
}
function restore(data){
  [...form.elements].forEach(el=>{
    if(!el.name)return;
    const v=data[el.name];
    if(el.type==='checkbox'){el.checked=Array.isArray(v)?v.includes(el.value):v===el.value||v==='on'}
    else if(v!==undefined&&!Array.isArray(v))el.value=v;
  });
}
function save(show=true){
  localStorage.setItem(FORM_KEY,JSON.stringify(collect()));
  if(show){statusBox.textContent='Saved in this browser at '+new Date().toLocaleTimeString();statusBox.scrollIntoView({behavior:'smooth',block:'nearest'});}
}
const old=localStorage.getItem(FORM_KEY); if(old){try{restore(JSON.parse(old));statusBox.textContent='Previously saved answers restored from this browser.'}catch(e){}}
let timer;form.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>save(false),350)});

function fileSafe(){return 'Pandan-Valley-Requirements-'+new Date().toISOString().slice(0,10)}
function download(content,type,name){const b=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

function humanText(data){
  const names={};
  [...form.elements].forEach(el=>{if(el.name&&!names[el.name]){let label=el.closest('label');names[el.name]=label?label.childNodes[0].textContent.trim():el.name}});
  const lines=[
    'PANDAN VALLEY SMART ESTATE MANAGEMENT',
    'PRE-QUOTATION REQUIREMENTS & PROCESS DISCOVERY',
    'Prepared for: MCST 581 Pandan Valley Condominium',
    'Prepared by: Axon 1Pro Solutions | axon.com.sg | support@axon.com.sg',
    '',
    'WHY A FIXED QUOTATION IS NOT YET ISSUED',
    'The requested feature list describes desired functions but not the operating process, approval rules, exception handling, user volumes, existing systems, hardware, privacy requirements or third-party integrations. These items materially affect implementation scope and cost. AI-assisted development can reduce coding time and cost, but accurate process discovery remains essential.',
    '',
    'RESPONSES'
  ];
  Object.keys(data).filter(k=>k!=='_meta').forEach(k=>{let v=data[k];if(Array.isArray(v))v=v.join(', ');if(v===undefined||v==='')v='Not provided';lines.push('');lines.push((names[k]||k)+':');lines.push(String(v));});
  return lines.join('\n');
}

document.getElementById('saveBtn').onclick=()=>save(true);
document.getElementById('jsonBtn').onclick=()=>{save(false);download(JSON.stringify(collect(),null,2),'application/json',fileSafe()+'.json')};
document.getElementById('txtBtn').onclick=()=>{save(false);download(humanText(collect()),'text/plain',fileSafe()+'.txt')};

async function logoData(){
  try{
    const img=document.getElementById('axonLogo');
    if(!img.complete)await new Promise((r,j)=>{img.onload=r;img.onerror=j});
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    return c.toDataURL('image/png');
  }catch(e){return null}
}
document.getElementById('pdfBtn').onclick=async()=>{
  save(false);
  if(!window.jspdf){alert('PDF library could not load. Please use Print > Save as PDF instead.');window.print();return;}
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:'a4'});
  const data=collect(); let y=17; const left=15,maxW=180,pageH=285;
  const addLines=(text,size=9,bold=false,space=4)=>{
    doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);
    const arr=doc.splitTextToSize(String(text||''),maxW);
    if(y+arr.length*(size*.42)+space>pageH){doc.addPage();y=17}
    doc.text(arr,left,y);y+=arr.length*(size*.42)+space;
  };
  const ld=await logoData();
  if(ld){try{doc.addImage(ld,'PNG',15,9,48,16)}catch(e){}}
  doc.setTextColor(15,109,97);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text('Pre-Quotation Requirements & Process Discovery',15,31);
  doc.setTextColor(23,34,42);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('MCST 581 - Pandan Valley Condominium',15,37);
  doc.setFontSize(8);doc.text('Axon 1Pro Solutions | axon.com.sg | support@axon.com.sg',15,42);y=50;
  doc.setFillColor(245,247,248);doc.roundedRect(15,y-4,180,30,2,2,'F');
  addLines('Why a fixed quotation is not yet issued',11,true,2);
  addLines('The requested feature list describes desired functions but does not define Pandan Valley\'s actual processes, approval rules, exception handling, user volume, existing systems, hardware, privacy requirements or integrations. These factors materially affect implementation scope and cost. AI-assisted development can reduce coding time and cost, but process discovery is still required to design an effective solution.',8,false,8);
  const labelMap={};[...form.elements].forEach(el=>{if(el.name&&!labelMap[el.name]){const l=el.closest('label');labelMap[el.name]=l?l.childNodes[0].textContent.trim():el.name}});
  for(const k of Object.keys(data).filter(k=>k!=='_meta')){
    let v=data[k];if(Array.isArray(v))v=v.join(', ');if(!v)v='Not provided';
    addLines(labelMap[k]||k,9,true,1);addLines(v,8,false,4);
  }
  if(y>250){doc.addPage();y=17}
  addLines('Next Step',11,true,2);
  addLines('Please email this PDF to support@axon.com.sg. Axon will review the responses, identify clarification points, confirm integrations and hardware, conduct a process-mapping discussion, and then prepare a scoped proposal and quotation.',8,false,3);
  doc.save(fileSafe()+'.pdf');
  statusBox.textContent='PDF report downloaded. Please email it to support@axon.com.sg.';
};
document.getElementById('emailBtn').onclick=()=>{save(false);const subject=encodeURIComponent('Pandan Valley Smart Estate - Requirements Discovery');const body=encodeURIComponent('Dear Axon,\n\nPlease find attached our completed Pandan Valley Smart Estate pre-quotation requirements discovery report.\n\nRegards');window.location.href='mailto:support@axon.com.sg?subject='+subject+'&body='+body};
document.getElementById('clearBtn').onclick=()=>{if(confirm('Clear all saved answers from this browser?')){localStorage.removeItem(FORM_KEY);form.reset();statusBox.textContent='Saved form data cleared.'}};
