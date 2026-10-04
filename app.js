const modules=document.querySelectorAll('.module');const panels=document.querySelectorAll('.panel');modules.forEach(b=>b.onclick=()=>{modules.forEach(x=>x.classList.remove('active'));panels.forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.target).classList.add('active');window.scrollTo({top:document.querySelector('.modules').offsetTop-10,behavior:'smooth'})});
document.getElementById('checkinBtn').onclick=()=>{document.getElementById('vendorTable').insertAdjacentHTML('beforeend','<tr><td>CP-0187</td><td>'+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'</td><td>CleanPro</td><td><span class="pill good">On site</span></td></tr>');document.getElementById('vendorsOnSite').textContent='8';document.getElementById('vendorToast').textContent='Check-in completed: GPS verified, identity verified, timestamp recorded. Auto-check-out monitoring started (simulated).'};
document.getElementById('verifyPhotos').onclick=()=>{document.getElementById('photoResult').textContent='Verified: same work order, correct before/after sequence, matching location and device metadata. No duplicate image detected (demo).'};
document.getElementById('issuePass').onclick=()=>{document.getElementById('passTitle').textContent='PASS PV-CT-8842 ACTIVE';document.getElementById('passInfo').textContent='ABC Movers · Unit #12-308 · Vehicle GBD 4821 K · Valid 06 Oct 2026 · 09:00–17:00';};
document.getElementById('tapNfc').onclick=()=>{const p=document.getElementById('pendingPoint');p.classList.add('done');p.innerHTML='✓ Block 4 Carpark <small>'+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+' NFC</small>';};
let stage=0;document.getElementById('submitTicket').onclick=()=>{stage=1;document.getElementById('ticketText').textContent='Ticket created. Acknowledgement sent to resident and 8-hour SLA timer started.';document.getElementById('progressBar').style.width='25%';};
document.getElementById('advanceTicket').onclick=()=>{if(stage===0)stage=1;else if(stage<4)stage++;const widths=['25%','50%','75%','100%'];document.getElementById('progressBar').style.width=widths[stage-1];['s2','s3','s4'].forEach((id,i)=>document.getElementById(id).classList.toggle('on',stage>=i+2));const txt={1:'Reported: acknowledgement sent to resident.',2:'Assigned to estate maintenance team. SLA clock continues.',3:'Technician attending location. Resident sees live status.',4:'Resolved. Resident notified and closure confirmation requested.'};document.getElementById('ticketText').textContent=txt[stage];};
document.getElementById('recalc').onclick=()=>{document.getElementById('slaResult').textContent='Compliance score: 94% · 10 demerit points · Suggested deduction S$420 · Final approval required by authorised MA user.';};
const roleContent={
  'MA/Admin':['Operations control centre','See vendor attendance, resident issues, patrol exceptions, contractor approvals, SLA exposure and management reports in one place.'],
  'Resident':['Resident self-service view','Report an issue, register a contractor or mover, and follow service progress without repeatedly calling the management office.'],
  'Security':['Security operations view','Validate contractor passes, see authorised vehicle and unit details, complete patrol checkpoints and respond to access exceptions.'],
  'Vendor':['Vendor mobile work view','Check in, receive assigned jobs, capture before/after evidence, complete checklists and submit work for approval.'],
  'Council':['Council oversight view','See high-level compliance, SLA trends, vendor performance, unresolved risks and monthly management summaries without operational clutter.']
};
document.querySelectorAll('.rolebtn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.rolebtn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const role=btn.dataset.role;document.getElementById('activeRole').textContent=role;
  document.getElementById('roleTitle').textContent=roleContent[role][0];document.getElementById('roleText').textContent=roleContent[role][1];
}));

function addActivity(title,detail){
  const feed=document.getElementById('activityFeed');if(!feed)return;
  const row=document.createElement('div');row.className='activity-item';
  const t=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  row.innerHTML='<time>'+t+'</time><div><b>'+title+'</b><span>'+detail+'</span></div>';
  feed.prepend(row);
}
const oldCheck=document.getElementById('checkinBtn').onclick;
document.getElementById('checkinBtn').onclick=()=>{oldCheck();addActivity('Vendor worker checked in','CP-0187 · CleanPro · GPS/identity verified (demo)')};
const oldVerify=document.getElementById('verifyPhotos').onclick;
document.getElementById('verifyPhotos').onclick=()=>{oldVerify();addActivity('Work evidence verified','Block 3 L2 water seepage · before/after pair accepted')};
const oldPass=document.getElementById('issuePass').onclick;
document.getElementById('issuePass').onclick=()=>{oldPass();addActivity('Temporary contractor pass issued','ABC Movers · Unit #12-308 · GBD 4821 K')};
const oldNfc=document.getElementById('tapNfc').onclick;
document.getElementById('tapNfc').onclick=()=>{oldNfc();addActivity('Patrol checkpoint verified','Block 4 Carpark · NFC checkpoint completed')};
const oldSubmit=document.getElementById('submitTicket').onclick;
document.getElementById('submitTicket').onclick=()=>{oldSubmit();addActivity('Resident issue created','PV-2026-1042 · Block 2 Lift Lobby · SLA timer started')};

const modal=document.getElementById('alertModal');
document.getElementById('slaAlert').onclick=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')};
document.getElementById('closeAlert').onclick=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});
document.getElementById('simulateEscalation').onclick=()=>{
  document.getElementById('alertResult').textContent='Escalation simulated: Maintenance Supervisor notified and a 15-minute acknowledgement timer started.';
  addActivity('SLA escalation triggered','PV-2026-1042 · Maintenance Supervisor notified (demo)');
};

document.getElementById('generateAiSummary').onclick=()=>{
  document.getElementById('aiSummary').innerHTML='<b>AI-assisted management summary</b><p>Overall estate compliance remains strong at 94%. Vendor attendance is healthy at 96%, although three late arrivals should be reviewed with the affected contractor. Most work orders are being completed within SLA, but one resident issue is approaching its response threshold and should be escalated. Patrol compliance remains high at 97%, with two exceptions requiring supervisor review. The current rules indicate S$420 in potential SLA deductions; Axon recommends human review before any financial action.</p>';
  addActivity('AI management summary generated','October operational data converted into a council-ready narrative (demo)');
};
