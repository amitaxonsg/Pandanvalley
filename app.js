const modules=document.querySelectorAll('.module'),panels=document.querySelectorAll('.panel');
modules.forEach(b=>b.onclick=()=>{modules.forEach(x=>x.classList.remove('active'));panels.forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.target).classList.add('active');window.scrollTo({top:document.querySelector('.modules').offsetTop-10,behavior:'smooth'})});

const roleContent={
'MA/Admin':['Estate operations control centre','Monitor attendance, work orders, residents, contractor access, patrol exceptions, SLA exposure and management reports.'],
'Security':['Gate and checkpoint operations','Record vendor attendance, scan contractor passes at 3 gates, verify access details and complete NFC/GPS checkpoints.'],
'Vendor':['Mobile work and evidence','Check in, receive assigned work, capture before/after evidence, complete checklists and submit for MA sign-off.'],
'Resident':['Resident service portal','Use authenticated access to report issues, register contractors/movers and follow MA replies and ticket progress.'],
'Council':['Read-only oversight','Review monthly compliance, vendor performance, unresolved risks, evidence trends and management summaries without editing operations.']
};
document.querySelectorAll('.rolebtn').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.rolebtn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const r=btn.dataset.role;document.getElementById('activeRole').textContent=r;document.getElementById('roleTitle').textContent=roleContent[r][0];document.getElementById('roleText').textContent=roleContent[r][1]});

function addActivity(title,detail){const f=document.getElementById('activityFeed');const row=document.createElement('div');row.className='activity-item';row.innerHTML='<time>'+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</time><div><b>'+title+'</b><span>'+detail+'</span></div>';f.prepend(row)}

document.getElementById('checkinBtn').onclick=()=>{document.getElementById('vendorTable').insertAdjacentHTML('beforeend','<tr><td>CP-0187</td><td>'+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</td><td>CleanPro</td><td><span class="pill good">On site</span></td></tr>');document.getElementById('vendorToast').textContent='Check-in complete: location, identity and timestamp recorded. 30-minute threshold rules active (demo).';addActivity('Vendor worker checked in','CP-0187 · CleanPro · security-assisted attendance recorded')};

document.getElementById('verifyPhotos').onclick=()=>{document.getElementById('photoResult').textContent='Evidence verified (demo): correct job, sequence, location metadata and before/after pair present.';addActivity('Work evidence verified','WO-2026-451 · Pump Maintenance · ready for MA sign-off')};
document.getElementById('approveJob').onclick=()=>{document.getElementById('jobApproval').textContent='Approved by MA officer (demo). Job closed and evidence archived for 3 years.';addActivity('MA signed off work order','WO-2026-451 · Pump Maintenance · approved')};
document.getElementById('rectifyJob').onclick=()=>{document.getElementById('jobApproval').textContent='Rectification requested. Vendor notified to correct and resubmit evidence.';addActivity('Rectification requested','WO-2026-451 returned to vendor')};

document.getElementById('issuePass').onclick=()=>{document.getElementById('passTitle').textContent='PASS PV-CT-8842 ACTIVE';document.getElementById('passInfo').textContent='ABC Movers · #12-308 · GBD 4821 K · Gate 2 · Multiple entry · Deposit received';addActivity('Contractor QR pass issued','ABC Movers · Gate 2 · multiple-entry validity')};

document.getElementById('tapNfc').onclick=()=>{const p=document.getElementById('pendingPoint');p.classList.add('done');p.innerHTML='✓ Block 4 Carpark <small>'+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' NFC + GPS</small>';addActivity('NFC checkpoint verified','Block 4 Carpark · Security Night A')};
const routes={
Security:'Security: current virtual patrol is CCTV-based; proposed NFC + GPS adds physical checkpoint verification where required.',
Cleaning:'Cleaning: supervisor instructions become route/checklist tasks with block-by-block time stamps and physical checkpoint evidence.',
Landscape:'Landscape: twice-monthly float-team work can be recorded by zone with attendance, photos, route points and completion evidence.'
};
document.querySelectorAll('.routebtn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.routebtn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('routeDesc').textContent=routes[b.dataset.route]});

let stage=0;
document.getElementById('submitTicket').onclick=()=>{stage=1;document.getElementById('ticketText').textContent='Ticket created. MA owns assignment and closure. Resident can track status and MA replies.';document.getElementById('progressBar').style.width='25%';addActivity('Resident issue created','Category: '+document.getElementById('ticketCategory').value+' · Block 2 Lift Lobby')};
document.getElementById('advanceTicket').onclick=()=>{if(stage===0)stage=1;else if(stage<4)stage++;const widths=['25%','50%','75%','100%'];document.getElementById('progressBar').style.width=widths[stage-1];['s2','s3','s4'].forEach((id,i)=>document.getElementById(id).classList.toggle('on',stage>=i+2));const txt={1:'Reported: ticket acknowledged.',2:'Assigned: MA assigned responsible team/vendor.',3:'In Progress: work underway and SLA timer monitored.',4:'Resolved: MA closed case and resident sees final reply.'};document.getElementById('ticketText').textContent=txt[stage]};

document.getElementById('recalc').onclick=()=>{document.getElementById('slaResult').textContent='Demo review: 32 running points. No deduction applied because exact 40-point / 10% trigger wording still requires confirmation.'};

const modal=document.getElementById('alertModal');
document.getElementById('slaAlert').onclick=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')};
document.getElementById('closeAlert').onclick=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
modal.onclick=e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}};
document.getElementById('simulateEscalation').onclick=()=>{document.getElementById('alertResult').textContent='Escalation simulated: supervisor notified and acknowledgement timer started.';addActivity('SLA escalation triggered','PV-2026-1042 · supervisor notified')};

const aiEndpoint=(window.PV_AI_ENDPOINT||'').trim();
if(aiEndpoint){document.getElementById('aiConnection').textContent='Secure AI backend configured';document.getElementById('aiModeLabel').textContent='Live AI backend configured'}

async function callAI(task,payload){
  if(!aiEndpoint)return null;
  try{
    const r=await fetch(aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task,payload})});
    if(!r.ok)throw new Error('AI request failed');
    return await r.json();
  }catch(e){return null}
}
document.getElementById('classifyTicket').onclick=async()=>{
  const msg=document.getElementById('residentMessage').value;
  const box=document.getElementById('classificationResult');
  box.innerHTML='<b>Processing...</b><p>Checking complaint classification.</p>';
  const live=await callAI('classify_ticket',{message:msg,categories:['Cleaning','Security','Pest Control','Light','Facilities','Landscape','Dispute','Safety','Others','Compliment']});
  if(live&&live.text){box.innerHTML='<b>AI-assisted result</b><p>'+live.text+'</p>'}
  else{box.innerHTML='<b>AI simulation result</b><p><b>Category:</b> Light · <b>Priority:</b> Normal · <b>Summary:</b> Resident reports recurring flickering ceiling light near Block 2 lift since yesterday evening. <b>Suggested action:</b> Assign estate maintenance and monitor response SLA.</p>'}
};
document.getElementById('generateAiSummary').onclick=async()=>{
  const box=document.getElementById('aiSummary');
  box.innerHTML='<b>Processing...</b><p>Generating management narrative.</p>';
  const data={vendorAttendance:'96%',jobsWithEvidence:'93%',ticketsResolved:84,avgResolution:'5h 22m',checkpointCompliance:'97%',highPriority:3,evidenceRetention:'3 years'};
  const live=await callAI('management_summary',data);
  if(live&&live.text){box.innerHTML='<b>AI-assisted management summary</b><p>'+live.text+'</p>'}
  else{box.innerHTML='<b>AI simulation summary</b><p>Overall estate accountability is strong. Vendor attendance is 96%, while 93% of sampled jobs contain the required evidence. Resident service volume remains manageable with 84 tickets resolved at an average of 5 hours 22 minutes. Checkpoint compliance is 97%, although three high-priority issues require management attention. Axon recommends focusing on evidence completeness, unresolved SLA items and finalising the security demerit rule before financial automation is enabled.</p>'}
  addActivity('Management summary generated','Operational data converted into council-ready narrative (demo)');
};
document.querySelectorAll('.pwa-nav').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.pwa-nav').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.pwa-view').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.pwatarget).classList.add('active');
}));
document.querySelectorAll('[data-pwajump]').forEach(btn=>btn.addEventListener('click',()=>{
  const target=btn.dataset.pwajump;
  const nav=[...document.querySelectorAll('.pwa-nav')].find(x=>x.dataset.pwatarget===target);
  if(nav) nav.click();
}));
document.getElementById('installPwaDemo')?.addEventListener('click',()=>{
  alert('PWA demo: on supported devices the resident can install this web app from the browser menu / Add to Home Screen. Native app-store packaging can be offered separately.');
});
document.getElementById('pwaPhoto')?.addEventListener('change',e=>{
  const f=e.target.files?.[0]; document.getElementById('photoName').textContent=f?'Selected: '+f.name:'No photo selected.';
});
document.getElementById('pwaSubmitIssue')?.addEventListener('click',()=>{
  const id='PV-2026-'+Math.floor(1100+Math.random()*800);
  document.getElementById('pwaIssueResult').innerHTML='<b>'+id+' created.</b> Status: Reported. MA has been notified. Photo/evidence metadata attached (demo).';
  addActivity('Resident issue submitted',id+' · '+document.getElementById('pwaCategory').value+' · Resident PWA');
});
document.getElementById('pwaAddFollowup')?.addEventListener('click',()=>{
  document.getElementById('pwaFollowupResult').textContent='Follow-up comment and additional evidence added to PV-2026-1042 (demo). MA notified. Internal MA notes remain private.';
  addActivity('Resident follow-up added','PV-2026-1042 · comment/photo evidence added');
});
document.getElementById('pwaReopen')?.addEventListener('click',()=>{
  document.getElementById('pwaFollowupResult').textContent='Issue reopened in demo and routed back to MA review.';
  addActivity('Resident reopened issue','PV-2026-1042 returned to MA queue');
});
document.querySelectorAll('.ackNotice').forEach(btn=>btn.addEventListener('click',()=>{
  if(!btn.classList.contains('done')){
    btn.classList.add('done'); btn.textContent='Acknowledged';
    const c=document.getElementById('unreadNoticeCount'); c.textContent=String(Math.max(0,Number(c.textContent)-1));
    addActivity('Resident acknowledged notice',btn.closest('.notice-item').querySelector('b').textContent);
  }
}));
document.getElementById('noticeSearch')?.addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll('#noticeList .notice-item').forEach(n=>n.classList.toggle('pwa-note-hidden',!n.dataset.notice.toLowerCase().includes(q)));
});