const app=document.querySelector('#app');
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const apiOrigin='https://stat5101-birthday.xuqi1216.chatgpt.site';
let participant;
try {
  participant=localStorage.getItem('stat5101-fall2026-birthday-participant');
  if(!/^[a-f0-9]{64}$/.test(participant||'')){participant=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem('stat5101-fall2026-birthday-participant',participant);}
} catch {participant=undefined;}
let session='';try{session=sessionStorage.getItem('birthday-session')||'';}catch{}
let busy=false,refreshing=false,lastRound=-1,lastTotal=-1,lastMatches='',submitted=false,authEpoch=0;
// Old private links now lead to the same shared page; discard any obsolete key.
if(location.hash)history.replaceState(null,'',location.pathname);
app.innerHTML=`
  <section id="login" class="card login-card"><p class="eyebrow">STAT 5101 · Classroom activity</p><h1>The birthday experiment</h1><p>Enter the password shared by your instructor.</p><form id="login-form"><label for="class-password">Class password</label><input id="class-password" type="password" autocomplete="current-password" required maxlength="200"><button class="primary" id="login-button">Open activity</button><p id="login-message" class="message" role="alert"></p></form><p class="small">Your instructor password also opens the activity.</p></section>
  <div id="activity" hidden>
  <section class="intro-row"><div><p class="eyebrow">Lecture 5 · A live classroom experiment</p><h1>Does someone share your birthday?</h1><p class="intro">Add your month and day. Watch the class count grow and shared birthdays appear.</p></div><span class="live-badge" id="connection">Connecting…</span></section>
  <p class="offline" id="offline" role="status" hidden>Connection interrupted. Counts may be out of date. Reconnecting automatically…</p>
  <div class="activity-layout">
    <section class="card entry-card" aria-labelledby="entry-heading"><h2 id="entry-heading">Add your birthday</h2><p class="small">Taking part is voluntary. Please submit once.</p>
      <form id="birthday-form"><div class="fields"><div><label for="month">Month</label><select id="month" required disabled><option value="">Choose month</option>${months.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('')}</select></div><div><label for="day">Day</label><select id="day" required disabled><option value="">Choose day</option></select></div></div><button class="primary" id="submit" disabled>Add my birthday</button><p id="message" class="message" role="alert"></p></form>
      <div id="received" class="received" role="status" hidden><span class="check" aria-hidden="true">✓</span><h3>Your birthday is counted.</h3><p>Thank you for joining in. Keep watching as more classmates add theirs.</p></div>
      <p class="privacy">No name or birth year is collected. If two or more students share your birthday, that month and day will appear in the results. Unmatched dates stay hidden.</p>
    </section>
    <section class="results" aria-labelledby="class-heading"><div class="results-heading"><h2 id="class-heading">Our class, in real time</h2><span class="small">Updates automatically</span></div>
      <div class="stats" aria-live="polite" aria-atomic="true"><div class="stat stat-primary"><strong id="total">—</strong><span>birthdays submitted</span></div><div class="stat"><strong id="shared">—</strong><span>shared birthday dates</span></div><div class="stat"><strong id="sharing">—</strong><span>students sharing a date</span></div></div>
      <section class="card matches-panel" aria-labelledby="matches-heading"><div class="matches-header"><h3 id="matches-heading">The birthday matches</h3><span class="threshold">2+ students</span></div><div id="matches" aria-live="polite"><p class="empty">Waiting for the class count…</p></div><p class="count-note">Three people with the same birthday count as <strong>one shared date.</strong></p></section>
    </section>
  </div>
  <details class="instructor-controls"><summary>Instructor controls</summary><form id="reset-form"><h2>Reset class results</h2><p class="small">Clear all submitted birthdays and let everyone participate again.</p><label for="instructor-password">Instructor password</label><input id="instructor-password" type="password" autocomplete="off" required maxlength="200"><button id="reset-button">Reset class results</button><div id="reset-confirm" hidden><p>This will permanently clear all current submissions. Continue?</p><button id="reset-confirm-button" type="button">Yes, clear all submissions</button> <button id="reset-cancel" class="secondary" type="button">Cancel</button></div><p id="reset-message" class="message" role="status"></p></form></details>
  <p id="reset-notice" class="small" role="status"></p>
  </div>`;
const month=document.querySelector('#month'),day=document.querySelector('#day'),button=document.querySelector('#submit');
async function api(path,body){
  const r=await fetch(apiOrigin+path,{credentials:'omit',method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+session,'X-Participant':participant||'',...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  const data=await r.json();if(!r.ok){const error=new Error(data.error||'Please try again.');error.status=r.status;throw error;}return data;
}
function connection(online){document.querySelector('#offline').hidden=online;const badge=document.querySelector('#connection');const label=online?'Live · everyone sees the same results':'Reconnecting…';if(badge.textContent!==label)badge.textContent=label;}
function number(id,value){const el=document.querySelector(id);if(el.textContent!==String(value)){el.textContent=value;el.classList.remove('count-change');void el.offsetWidth;el.classList.add('count-change');}}
function render(data){
  if(data.round<lastRound||(data.round===lastRound&&data.total<lastTotal))return;
  if(data.round>lastRound){if(lastRound>=0)document.querySelector('#reset-notice').textContent='The class results were reset. You can submit your birthday again.';lastTotal=-1;lastMatches='';document.querySelector('#message').textContent='';}
  lastRound=data.round;
  lastTotal=data.total;
  number('#total',data.total);number('#shared',data.sharedDates);number('#sharing',data.studentsSharing);
  const signature=JSON.stringify(data.matches);
  if(signature!==lastMatches){
    lastMatches=signature;const target=document.querySelector('#matches');target.replaceChildren();
    if(!data.matches.length){const p=document.createElement('p');p.className='empty';p.textContent=data.total===0?'Be the first to add a birthday. The first shared date will appear here.':'No shared dates yet. Every birthday submitted so far is different.';target.append(p);}
    else for(const item of data.matches){const row=document.createElement('div');row.className='match';const date=document.createElement('span');date.className='match-date';date.textContent=`${months[item.month-1]} ${item.day}`;const count=document.createElement('strong');count.textContent=`${item.count} students`;row.append(date,count);target.append(row);}
  }else if(!data.matches.length){document.querySelector('.empty').textContent=data.total===0?'Be the first to add a birthday. The first shared date will appear here.':'No shared dates yet. Every birthday submitted so far is different.';}
  submitted=data.submitted;
  document.querySelector('#birthday-form').hidden=submitted;
  document.querySelector('#received').hidden=!submitted;
  const heading=document.querySelector('#entry-heading'),title=submitted?'You’re in the experiment':'Add your birthday';if(heading.textContent!==title)heading.textContent=title;
  month.disabled=submitted;day.disabled=submitted||!month.value;button.disabled=submitted||busy;
}
async function refresh(){if(!session)return;if(!participant){document.querySelector('#offline').hidden=false;document.querySelector('#offline').textContent='Please enable browser storage to join this activity, then reload the page.';return;}if(busy||refreshing)return;refreshing=true;const epoch=authEpoch;try{const data=await api('/api/activity');if(epoch!==authEpoch)return;render(data);connection(true);}catch(error){if(error.status===401)lockActivity(error.message);else connection(false);}finally{refreshing=false;}}
month.addEventListener('change',()=>{const max=[31,29,31,30,31,30,31,31,30,31,30,31][Number(month.value)-1]||0;const previous=day.value;day.innerHTML='<option value="">Choose day</option>'+Array.from({length:max},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');day.disabled=!max;if(previous&&Number(previous)<=max)day.value=previous;});
document.querySelector('#birthday-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy||submitted)return;busy=true;button.disabled=true;button.textContent='Adding…';document.querySelector('#message').textContent='';
  try{render(await api('/api/submit',{month:Number(month.value),day:Number(day.value),round:lastRound}));connection(true);}
  catch(error){if(error.status===401)lockActivity(error.message);document.querySelector('#message').textContent=error.status?error.message:'Could not confirm your submission. Reconnecting to check; please keep this page open.';if(!error.status)connection(false);}
  finally{busy=false;button.disabled=submitted;button.textContent='Add my birthday';await refresh();}
});
function showActivity(){document.querySelector('#login').hidden=true;document.querySelector('#activity').hidden=false;}
function lockActivity(message=''){session='';authEpoch++;try{sessionStorage.removeItem('birthday-session');}catch{}document.querySelector('#login').hidden=false;document.querySelector('#activity').hidden=true;document.querySelector('#login-message').textContent=message;}
document.querySelector('#login-form').addEventListener('submit',async event=>{
  event.preventDefault();const input=document.querySelector('#class-password'),button=document.querySelector('#login-button');button.disabled=true;document.querySelector('#login-message').textContent='';
  try{const data=await api('/api/login',{password:input.value});session=data.session;authEpoch++;try{sessionStorage.setItem('birthday-session',session);}catch{}input.value='';showActivity();await refresh();}
  catch(error){document.querySelector('#login-message').textContent=error.status?error.message:'Could not connect. Please try again.';}
  finally{button.disabled=false;}
});
document.querySelector('#reset-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#reset-confirm').hidden=false;document.querySelector('#reset-message').textContent='';});
document.querySelector('#reset-cancel').addEventListener('click',()=>{document.querySelector('#reset-confirm').hidden=true;document.querySelector('#instructor-password').value='';});
document.querySelector('#reset-confirm-button').addEventListener('click',async()=>{
  if(busy)return;busy=true;const resetButton=document.querySelector('#reset-confirm-button');resetButton.disabled=true;
  try{const data=await api('/api/reset',{password:document.querySelector('#instructor-password').value,confirm:true});render(data);connection(true);document.querySelector('#reset-message').textContent='All submissions cleared. Everyone can participate again.';document.querySelector('#instructor-password').value='';document.querySelector('#reset-confirm').hidden=true;}
  catch(error){if(error.status===401)lockActivity(error.message);document.querySelector('#reset-message').textContent=error.status?error.message:'Could not confirm the reset. Check the live count before trying again.';}
  finally{busy=false;resetButton.disabled=false;await refresh();}
});
if(session){showActivity();refresh();}let poll=setInterval(refresh,1500);
window.addEventListener('pagehide',()=>clearInterval(poll));
window.addEventListener('pageshow',event=>{if(event.persisted){refresh();poll=setInterval(refresh,1500);}});
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  Promise.resolve(document.modelContext.registerTool({name:'read_birthday_activity',title:'Read live birthday results',description:'Read the live participant count and shared birthday dates. Dates submitted by only one student are not returned.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('This tool takes an empty object.');const data=await api('/api/activity');render(data);return data;}},{signal:lifecycle.signal})).catch(()=>{});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
