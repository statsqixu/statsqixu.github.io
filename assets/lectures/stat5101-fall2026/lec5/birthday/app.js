const app=document.querySelector('#app');
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const apiOrigin='https://stat5101-birthday.xuqi1216.chatgpt.site';
let participant;
try {
  participant=localStorage.getItem('stat5101-fall2026-birthday-participant');
  if(!/^[a-f0-9]{64}$/.test(participant||'')){participant=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem('stat5101-fall2026-birthday-participant',participant);}
} catch {}
let busy=false,refreshing=false,lastTotal=-1,lastMatches='',submitted=false;
// Old private links now lead to the same shared page; discard any obsolete key.
if(location.hash)history.replaceState(null,'',location.pathname);
app.innerHTML=`
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
  </div>`;
const month=document.querySelector('#month'),day=document.querySelector('#day'),button=document.querySelector('#submit');
async function api(path,body){
  const r=await fetch(apiOrigin+path,{credentials:'omit',method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+participant,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  const data=await r.json();if(!r.ok){const error=new Error(data.error||'Please try again.');error.status=r.status;throw error;}return data;
}
function connection(online){document.querySelector('#offline').hidden=online;const badge=document.querySelector('#connection');const label=online?'Live · everyone sees the same results':'Reconnecting…';if(badge.textContent!==label)badge.textContent=label;}
function number(id,value){const el=document.querySelector(id);if(el.textContent!==String(value)){el.textContent=value;el.classList.remove('count-change');void el.offsetWidth;el.classList.add('count-change');}}
function render(data){
  if(data.total<lastTotal)return;
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
async function refresh(){if(!participant){document.querySelector('#offline').hidden=false;document.querySelector('#offline').textContent='Please enable browser storage to join this activity, then reload the page.';return;}if(busy||refreshing)return;refreshing=true;try{render(await api('/api/activity'));connection(true);}catch{connection(false);}finally{refreshing=false;}}
month.addEventListener('change',()=>{const max=[31,29,31,30,31,30,31,31,30,31,30,31][Number(month.value)-1]||0;const previous=day.value;day.innerHTML='<option value="">Choose day</option>'+Array.from({length:max},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');day.disabled=!max;if(previous&&Number(previous)<=max)day.value=previous;});
document.querySelector('#birthday-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy||submitted)return;busy=true;button.disabled=true;button.textContent='Adding…';document.querySelector('#message').textContent='';
  try{render(await api('/api/submit',{month:Number(month.value),day:Number(day.value)}));connection(true);}
  catch(error){document.querySelector('#message').textContent=error.status?error.message:'Could not confirm your submission. Reconnecting to check; please keep this page open.';if(!error.status)connection(false);}
  finally{busy=false;button.disabled=submitted;button.textContent='Add my birthday';await refresh();}
});
refresh();let poll=setInterval(refresh,1500);
window.addEventListener('pagehide',()=>clearInterval(poll));
window.addEventListener('pageshow',event=>{if(event.persisted){refresh();poll=setInterval(refresh,1500);}});
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  Promise.resolve(document.modelContext.registerTool({name:'read_birthday_activity',title:'Read live birthday results',description:'Read the live participant count and shared birthday dates. Dates submitted by only one student are not returned.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('This tool takes an empty object.');const data=await api('/api/activity');render(data);return data;}},{signal:lifecycle.signal})).catch(()=>{});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
