const seedPlayers = [
  {id:1,name:"SVC1717",platform:"PS5",position:"SF",mode:"Rec",overall:99,mic:"yes",style:"Two-way scorer",online:true},
  {id:2,name:"DabCoach",platform:"PS5",position:"PG",mode:"5s",overall:96,mic:"yes",style:"Pass-first floor general",online:true},
  {id:3,name:"QuanShoots",platform:"PS5",position:"SG",mode:"Rec",overall:97,mic:"yes",style:"Catch-and-shoot",online:true},
  {id:4,name:"BallOut",platform:"PS5",position:"C",mode:"3s",overall:95,mic:"no",style:"Inside-out big",online:false},
  {id:5,name:"GreenMagic",platform:"Xbox",position:"PF",mode:"2s",overall:94,mic:"yes",style:"Stretch defender",online:true},
  {id:6,name:"PappaDot",platform:"PS5",position:"C",mode:"Pro-Am",overall:98,mic:"yes",style:"Rim protector",online:false}
];
const seedVault = [
  {id:101,name:"Two-Way 3-Level Threat",height:"6'8",position:"SF",overall:99,three:90,dunk:93,pass:82,approved:true,owner:"SVC1717"},
  {id:102,name:"Inside-Out Board Hunter",height:"7'0",position:"C",overall:99,three:90,dunk:89,pass:82,approved:true,owner:"SVC1717"},
  {id:103,name:"Versatile Lockdown Creator",height:"6'9",position:"PF",overall:99,three:87,dunk:90,pass:84,approved:true,owner:"SVC1717"},
  {id:104,name:"Legend Guard",height:"6'5",position:"SG",overall:99,three:99,dunk:99,pass:82,approved:true,owner:"SVC1717"}
];
const seedCommunity = [
  {id:201,name:"2-Way Shot Creator",height:"6'6",position:"SG",overall:92,three:89,dunk:93,pass:78,approved:true,owner:"MikeBuckets",likes:34},
  {id:202,name:"Paint Beast Stretch",height:"7'1",position:"C",overall:90,three:85,dunk:90,pass:75,approved:false,owner:"Chucky",likes:12},
  {id:203,name:"Point Forward Lock",height:"6'8",position:"SF",overall:94,three:87,dunk:89,pass:89,approved:true,owner:"Diff",likes:28}
];
const seedChallenges = [
  {id:301,from:"SVC Squad",to:"Ball Out Crew",mode:"5v5 Rec",date:"Friday 9:00 PM",status:"Awaiting response"},
  {id:302,from:"Green Magic",to:"SVC Squad",mode:"3v3",date:"Saturday 8:30 PM",status:"Accepted"},
  {id:303,from:"TTTv Crew",to:"Pappa Dot",mode:"Pro-Am",date:"Sunday 7:00 PM",status:"Open"}
];

const load = (key, seed) => JSON.parse(localStorage.getItem(key) || JSON.stringify(seed));
let players = load("jk_players", seedPlayers);
let vault = load("jk_vault", seedVault);
let community = load("jk_community", seedCommunity);
let challenges = load("jk_challenges", seedChallenges);
let adminOn = false;

const saveAll=()=>{localStorage.setItem("jk_players",JSON.stringify(players));localStorage.setItem("jk_vault",JSON.stringify(vault));localStorage.setItem("jk_community",JSON.stringify(community));localStorage.setItem("jk_challenges",JSON.stringify(challenges));};

const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
function go(page){
  qsa(".page").forEach(p=>p.classList.toggle("active",p.id===page));
  qsa(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  qs("#sidebar").classList.remove("open"); window.scrollTo(0,0);
}
qsa("[data-page]").forEach(b=>b.onclick=()=>go(b.dataset.page));
qsa("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
qs("#menuBtn").onclick=()=>qs("#sidebar").classList.toggle("open");

function playerCard(p){
 return `<article class="player-card">
   <div class="card-top"><div class="avatar-sm">${p.position}</div><span class="status">${p.online?"● Online":"Offline"}</span></div>
   <h3>${p.name}</h3><p>${p.platform} • ${p.overall} OVR</p>
   <div class="card-tags"><span class="tag">${p.position}</span><span class="tag">${p.mode}</span><span class="tag">${p.mic==="yes"?"Mic":"No mic"}</span></div>
   <small>${p.style}</small>
   <div class="card-actions"><button onclick="viewPlayer(${p.id})">Profile</button><button class="accent" onclick="invitePlayer('${p.name}')">Invite</button></div>
 </article>`;
}
function buildCard(b, communityMode=false){
 return `<article class="build-card">
   <div class="build-cover">${b.height} ${b.position}</div>
   <div class="build-body"><h3>${b.name}</h3><div class="build-meta">${b.owner} • ${b.overall} OVR</div>
   ${b.approved?'<span class="approved-badge">★ JACKIE’S APPROVED</span>':'<span class="tag">PENDING REVIEW</span>'}
   <div class="card-tags"><span class="tag">3PT ${b.three}</span><span class="tag">DUNK ${b.dunk}</span><span class="tag">PASS ${b.pass}</span></div>
   <div class="card-actions"><button onclick="viewBuild(${b.id},${communityMode})">View Build</button>${communityMode?`<button class="accent" onclick="likeBuild(${b.id})">♥ ${b.likes||0}</button>`:""}</div></div>
 </article>`;
}
function challengeCard(c){
 return `<article class="challenge-card"><div class="challenge-status">${c.status}</div><h3>${c.from}</h3><div class="versus">VS</div><h3>${c.to}</h3><div class="card-tags"><span class="tag">${c.mode}</span><span class="tag">${c.date}</span></div><div class="card-actions"><button onclick="challengeAction(${c.id},'Accepted')">Accept</button><button onclick="challengeAction(${c.id},'Declined')">Decline</button></div></article>`;
}
function render(){
 qs("#homePlayers").innerHTML=players.filter(p=>p.online).slice(0,3).map(playerCard).join("");
 qs("#playerCount").textContent=players.length; qs("#buildCount").textContent=vault.length+community.length; qs("#challengeCount").textContent=challenges.length;
 renderPlayers(); qs("#vaultGrid").innerHTML=vault.map(b=>buildCard(b,false)).join(""); renderCommunity();
 qs("#challengeGrid").innerHTML=challenges.map(challengeCard).join(""); renderStats(); renderAdmin();
}
function renderPlayers(){
 let mode=qs("#modeFilter").value, pos=qs("#positionFilter").value, mic=qs("#micFilter").value;
 let arr=players.filter(p=>(mode==="all"||p.mode===mode)&&(pos==="all"||p.position===pos)&&(mic==="all"||p.mic===mic));
 qs("#playerGrid").innerHTML=arr.map(playerCard).join("")||"<p>No players match those filters.</p>";
}
function renderCommunity(){
 let pos=qs("#buildPositionFilter").value, status=qs("#approvedFilter").value;
 let arr=community.filter(b=>(pos==="all"||b.position===pos)&&(status==="all"||(status==="approved"&&b.approved)||(status==="pending"&&!b.approved)));
 qs("#communityGrid").innerHTML=arr.map(b=>buildCard(b,true)).join("")||"<p>No builds match those filters.</p>";
}
function renderStats(){
 const stats=[["Win %","68.4%"],["3PT %","54.7%"],["Games","1,284"],["NY Rank","668"]];
 qs("#statCards").innerHTML=stats.map(s=>`<div class="stat-card"><strong>${s[1]}</strong><span>${s[0]}</span></div>`).join("");
 qs("#statsTable").innerHTML=`<table><thead><tr><th>Build</th><th>Games</th><th>Win %</th><th>3PT %</th></tr></thead><tbody>
 ${vault.map((b,i)=>`<tr><td>${b.name}</td><td>${[214,188,156,91][i]||74}</td><td>${[71,69,67,73][i]||65}%</td><td>${[58,53,51,61][i]||50}%</td></tr>`).join("")}</tbody></table>`;
}
function renderAdmin(){
 qs("#pendingBuilds").innerHTML=community.filter(b=>!b.approved).map(b=>`<div class="admin-item"><span>${b.name}<small> — ${b.owner}</small></span><button class="approve" onclick="approveBuild(${b.id})">Approve</button></div>`).join("")||"<p>No pending builds.</p>";
 qs("#memberList").innerHTML=players.map(p=>`<div class="admin-item"><span>${p.name}<small> — ${p.platform}</small></span><button class="remove" onclick="removePlayer(${p.id})">Remove</button></div>`).join("");
}
["modeFilter","positionFilter","micFilter"].forEach(id=>qs("#"+id).onchange=renderPlayers);
["buildPositionFilter","approvedFilter"].forEach(id=>qs("#"+id).onchange=renderCommunity);

function openModal(html){qs("#modalContent").innerHTML=html;qs("#modal").classList.remove("hidden");}
qs("#closeModal").onclick=()=>qs("#modal").classList.add("hidden");
qs("#modal").onclick=e=>{if(e.target.id==="modal")qs("#modal").classList.add("hidden")};

window.viewPlayer=id=>{const p=players.find(x=>x.id===id);openModal(`<h2>${p.name}</h2><p>${p.platform} • ${p.position} • ${p.overall} OVR</p><div class="card-tags"><span class="tag">${p.mode}</span><span class="tag">${p.style}</span><span class="tag">${p.mic==="yes"?"Uses mic":"No mic"}</span></div><button class="primary-btn" onclick="invitePlayer('${p.name}')">Send Squad Invite</button>`)}
window.invitePlayer=name=>openModal(`<h2>Invite sent</h2><p>Your squad invite was sent to <strong>${name}</strong>.</p>`);
window.viewBuild=(id,isCommunity)=>{const arr=isCommunity?community:vault,b=arr.find(x=>x.id===id);openModal(`<h2>${b.name}</h2><p>${b.height} ${b.position} • ${b.overall} OVR • by ${b.owner}</p><div class="stats-strip"><div><strong>${b.three}</strong><span>3PT</span></div><div><strong>${b.dunk}</strong><span>Dunk</span></div><div><strong>${b.pass}</strong><span>Pass</span></div><div><strong>${b.approved?"YES":"PENDING"}</strong><span>Approved</span></div></div><p><strong>Strengths:</strong> Versatility, shooting, transition finishing and strong team fit.</p><p><strong>What Jackie would change:</strong> Review cap breakers after testing in Rec.</p>`)}
window.likeBuild=id=>{let b=community.find(x=>x.id===id);b.likes=(b.likes||0)+1;saveAll();renderCommunity()}
window.challengeAction=(id,status)=>{let c=challenges.find(x=>x.id===id);c.status=status;saveAll();render();}

function formWrap(title, fields, submitText, onsubmit){
 openModal(`<h2>${title}</h2><form id="dynamicForm" class="form-grid">${fields}<button class="primary-btn full" type="submit">${submitText}</button></form>`);
 qs("#dynamicForm").onsubmit=e=>{e.preventDefault();onsubmit(new FormData(e.target));qs("#modal").classList.add("hidden");saveAll();render();};
}
qs("#addPlayerBtn").onclick=()=>formWrap("Post Looking for Squad",`
 <input name="name" placeholder="Gamertag" required><select name="platform"><option>PS5</option><option>Xbox</option><option>PC</option></select>
 <select name="position"><option>PG</option><option>SG</option><option>SF</option><option>PF</option><option>C</option></select>
 <select name="mode"><option>Rec</option><option>2s</option><option>3s</option><option>5s</option><option>Pro-Am</option></select>
 <input name="overall" type="number" min="60" max="99" placeholder="Overall" required><select name="mic"><option value="yes">Mic</option><option value="no">No mic</option></select>
 <input class="full" name="style" placeholder="Playstyle" required>`,"Post",fd=>players.unshift({id:Date.now(),name:fd.get("name"),platform:fd.get("platform"),position:fd.get("position"),mode:fd.get("mode"),overall:+fd.get("overall"),mic:fd.get("mic"),style:fd.get("style"),online:true}));

function buildForm(title, target){
 formWrap(title,`<input name="name" placeholder="Build name" required><input name="height" placeholder="Height, e.g. 6'8" required>
 <select name="position"><option>PG</option><option>SG</option><option>SF</option><option>PF</option><option>C</option></select>
 <input name="overall" type="number" min="60" max="99" placeholder="Overall" required><input name="three" type="number" placeholder="3PT" required>
 <input name="dunk" type="number" placeholder="Driving dunk" required><input name="pass" type="number" placeholder="Pass accuracy" required>
 <input class="full" name="owner" placeholder="Owner / Gamertag" value="${target==="vault"?"SVC1717":""}" required>`,
 "Save Build",fd=>{const obj={id:Date.now(),name:fd.get("name"),height:fd.get("height"),position:fd.get("position"),overall:+fd.get("overall"),three:+fd.get("three"),dunk:+fd.get("dunk"),pass:+fd.get("pass"),owner:fd.get("owner"),approved:target==="vault",likes:0};(target==="vault"?vault:community).unshift(obj)});
}
qs("#addBuildBtn").onclick=()=>buildForm("Add to My Build Vault","vault");
qs("#submitCommunityBtn").onclick=()=>buildForm("Submit Community Build","community");
qs("#newChallengeBtn").onclick=()=>formWrap("Create Squad Challenge",`<input name="from" placeholder="Your squad" required><input name="to" placeholder="Squad challenged" required><select name="mode"><option>5v5 Rec</option><option>3v3</option><option>2v2</option><option>Pro-Am</option></select><input name="date" placeholder="Date and time" required>`,"Create Challenge",fd=>challenges.unshift({id:Date.now(),from:fd.get("from"),to:fd.get("to"),mode:fd.get("mode"),date:fd.get("date"),status:"Awaiting response"}));

qs("#adminToggle").onclick=()=>{adminOn=!adminOn;qs("#adminToggle").textContent=`Demo Admin: ${adminOn?"ON":"OFF"}`;qs("#adminLocked").classList.toggle("hidden",adminOn);qs("#adminPanel").classList.toggle("hidden",!adminOn)};
window.approveBuild=id=>{community.find(x=>x.id===id).approved=true;saveAll();render()};
window.removePlayer=id=>{players=players.filter(x=>x.id!==id);saveAll();render()};
qs("#postAnnouncement").onclick=()=>{const t=qs("#announcementText").value.trim();qs("#announcementResult").innerHTML=t?`<p class="status">Announcement posted: ${t}</p>`:"<p>Please write an announcement.</p>";qs("#announcementText").value=""};
qs("#globalSearch").oninput=e=>{const q=e.target.value.toLowerCase().trim();if(!q)return;const p=players.find(x=>JSON.stringify(x).toLowerCase().includes(q));const b=[...vault,...community].find(x=>JSON.stringify(x).toLowerCase().includes(q));if(p){go("squad");qs("#playerGrid").innerHTML=playerCard(p)}else if(b){go(community.includes(b)?"community":"builds");(community.includes(b)?qs("#communityGrid"):qs("#vaultGrid")).innerHTML=buildCard(b,community.includes(b))}};
qs("#openProfileBtn").onclick=()=>go("stats");
render();
