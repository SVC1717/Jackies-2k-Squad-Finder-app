const KEY='svc1717_picture_builds_v3';
const seededBuilds=[
 {id:'jackie-real-01',name:'Jackie Build 01 • OVR 99',images:{attributes:['assets/builds/real/build-01.jpeg']}},
 {id:'jackie-real-02',name:'Jackie Build 02 • OVR 97',images:{attributes:['assets/builds/real/build-02.jpeg']}},
 {id:'jackie-real-03',name:'Jackie Build 03 • OVR 99',images:{attributes:['assets/builds/real/build-03.jpeg']}},
 {id:'jackie-real-04',name:'Jackie Build 04 • OVR 99',images:{attributes:['assets/builds/real/build-04.jpeg']}},
 {id:'jackie-real-05',name:'Jackie Build 05',images:{attributes:['assets/builds/real/build-05.jpeg']}},
 {id:'jackie-real-06',name:"6'7 Small Forward • OVR 99",images:{attributes:['assets/builds/real/build-06.jpeg']}},
 {id:'jackie-real-07',name:'Jackie Build 07 • OVR 97',images:{attributes:['assets/builds/real/build-07.jpeg']}},
 {id:'jackie-real-08',name:"6'8 SG • Gun & Give Ball Snatcher",images:{attributes:['assets/builds/real/build-08.png']}},
 {id:'jackie-real-09',name:'Jackie Build 09 • OVR 99',images:{attributes:['assets/builds/real/build-09.jpeg']}},
 {id:'jackie-real-10',name:'Jackie Build 10 • OVR 97',images:{attributes:['assets/builds/real/build-10.jpeg']}},
 {id:'jackie-real-11',name:'Jackie Build 11 • OVR 97',images:{attributes:['assets/builds/real/build-11.jpeg']}},
 {id:'jackie-real-12',name:'Jackie Build 12 • OVR 99',images:{attributes:['assets/builds/real/build-12.jpeg']}}
];
let builds=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(seededBuilds));
const removedRawIds=new Set(['jackie-74-post','jackie-69-center','jackie-67-sf','jackie-svc-99-a','jackie-svc-99-b','jackie-svc-99-c']);
if(localStorage.getItem('svc1717_raw_cleanup')!=='done'){builds=builds.filter(b=>!removedRawIds.has(b.id));localStorage.setItem(KEY,JSON.stringify(builds));localStorage.setItem('svc1717_raw_cleanup','done')}
let pending={overview:[],attributes:[],badges:[],animations:[],jumpshot:[],recstats:[]};
let challenges=JSON.parse(localStorage.getItem('svc1717_challenges_v1')||'[]');
let games=JSON.parse(localStorage.getItem('svc1717_games_v1')||'[]');
const categories=[
 ['overview','BUILD OVERVIEW'],['attributes','ATTRIBUTES'],['badges','BADGES / BADGE DNA'],
 ['animations','ANIMATIONS'],['jumpshot','JUMP SHOT'],['recstats','REC STATS']
];
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function save(){
 try{localStorage.setItem(KEY,JSON.stringify(builds));render();}
 catch(e){alert('These pictures are too large for this browser. Try fewer pictures or smaller screenshots.');}
}
function showPage(name){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 $(name+'Page').classList.add('active');
 document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page===name));
 $('title').textContent=document.querySelector('.nav[data-page="'+name+'"]').textContent.trim();
}
function allImages(b){return categories.flatMap(([key])=>(b.images&&b.images[key])||[])}
function coverImage(b){return allImages(b)[0]||''}
const n=v=>Number(v)||0;
function gameStats(list){const g=list.length,w=list.filter(x=>x.result==='W').length;const sum=k=>list.reduce((a,x)=>a+n(x[k]),0),fgm=sum('fgMade'),fga=sum('fgAttempted'),tm=sum('threeMade'),ta=sum('threeAttempted');return{g,w,l:g-w,win:g?(w/g*100).toFixed(1):'0.0',ppg:g?(sum('points')/g).toFixed(1):'0.0',rpg:g?(sum('rebounds')/g).toFixed(1):'0.0',apg:g?(sum('assists')/g).toFixed(1):'0.0',spg:g?(sum('steals')/g).toFixed(1):'0.0',bpg:g?(sum('blocks')/g).toFixed(1):'0.0',fg:fga?(fgm/fga*100).toFixed(1):'0.0',three:ta?(tm/ta*100).toFixed(1):'0.0'}}
function statTiles(s){return `<div><span>GAMES</span><strong>${s.g}</strong></div><div><span>RECORD</span><strong>${s.w}-${s.l}</strong></div><div><span>WIN %</span><strong>${s.win}%</strong></div><div><span>PPG</span><strong>${s.ppg}</strong></div><div><span>RPG</span><strong>${s.rpg}</strong></div><div><span>APG</span><strong>${s.apg}</strong></div><div><span>SPG</span><strong>${s.spg}</strong></div><div><span>BPG</span><strong>${s.bpg}</strong></div><div><span>FG%</span><strong>${s.fg}%</strong></div><div><span>3PT%</span><strong>${s.three}%</strong></div>`}
function card(b){
 const cover=coverImage(b),count=allImages(b).length;
 return `<article class="card picture-card">
 ${cover?`<img src="${cover}" alt="${esc(b.name)} screenshot">`:`<div class="img-placeholder">ADD BUILD PICTURES</div>`}
 <div class="card-body"><div class="small">FULL BINDER PAGE</div><h4>${esc(b.name)}</h4>
 <div class="photo-count">📸 ${count} picture${count===1?'':'s'} saved</div>
 <div class="section-chips">${categories.filter(([k])=>b.images?.[k]?.length).map(([,l])=>`<span>${l}</span>`).join('')}</div>
 <div class="card-actions"><button onclick="viewBuild('${b.id}')">VIEW FULL BUILD</button><button onclick="editBuild('${b.id}')">ADD PICTURES</button><button onclick="deleteBuild('${b.id}')">DELETE</button></div>
 </div></article>`;
}
function libraryCard(b,key,label){
 const imgs=b.images?.[key]||[]; if(!imgs.length)return '';
 return `<article class="library-card"><h4>${esc(b.name)}</h4><div class="library-images">${imgs.map((src,i)=>`<img src="${src}" alt="${esc(label)} ${i+1}">`).join('')}</div><button onclick="viewBuild('${b.id}')">OPEN FULL BUILD</button></article>`
}
function render(){
 $('buildGrid').innerHTML=builds.length?builds.map(card).join(''):'<div class="empty-vault"><b>NO BUILDS YET</b><p>Tap + Add Build and upload your screenshots.</p></div>';
 $('recentBuilds').innerHTML=builds.length?builds.slice(0,3).map(card).join(''):'<div class="empty-vault">Upload your first build pictures.</div>';
 $('buildCount').textContent=builds.length;
 const total=gameStats(games);$('avg3pt').textContent=total.three+'%'; $('totalWins').textContent=total.w; $('totalLosses').textContent=total.l;
 $('jumpShotGrid').innerHTML=builds.map(b=>libraryCard(b,'jumpshot','Jump shot')).join('')||'<div class="empty-vault">Jump shot screenshots will appear here automatically.</div>';
 $('animationGrid').innerHTML=builds.map(b=>libraryCard(b,'animations','Animation')).join('')||'<div class="empty-vault">Animation screenshots will appear here automatically.</div>';
 $('challengeGrid').innerHTML=challenges.length?challenges.map(c=>`<article class="challenge-card"><div class="challenge-vs">VS</div><div><div class="small">${esc(c.mode||'SQUAD MATCHUP')}</div><h4>${esc(c.squad)}</h4><p>${esc(c.contact||'Contact not added')}${c.date?' • '+new Date(c.date).toLocaleString():''}</p>${c.notes?`<p>${esc(c.notes)}</p>`:''}</div><span class="challenge-status">${esc(c.status)}</span><div class="challenge-buttons"><button onclick="setChallenge('${c.id}','APPROVED')">✓ Approve</button><button onclick="deleteChallenge('${c.id}')">Delete</button></div></article>`).join(''):'<div class="empty-vault"><b>NO CHALLENGES YET</b><p>Add a squad matchup request here.</p></div>';
 $('overallGameStats').innerHTML=statTiles(total);
 $('buildStatsGrid').innerHTML=builds.length?builds.map(b=>{const list=games.filter(g=>g.buildId===b.id),s=gameStats(list);return `<article class="build-stat-card"><div class="build-stat-head"><div><div class="small">BUILD STATS</div><h4>${esc(b.name)}</h4></div><button onclick="openGameFor('${b.id}')">+ LOG GAME</button></div><div class="game-stat-tiles">${statTiles(s)}</div><div class="game-history">${list.slice(0,8).map(g=>`<div><b class="${g.result==='W'?'game-win':'game-loss'}">${g.result}</b><span>${new Date(g.date+'T12:00:00').toLocaleDateString()}</span><strong>${g.points} PTS · ${g.rebounds} REB · ${g.assists} AST</strong><button onclick="deleteGame('${g.id}')">×</button></div>`).join('')||'<p>No games logged for this build yet.</p>'}</div></article>`}).join(''):'<div class="empty-vault">Add a build before logging games.</div>';
}
function resetForm(){
 $('buildForm').reset(); $('buildId').value=''; $('dialogTitle').textContent='Upload Build Pictures';
 pending={overview:[],attributes:[],badges:[],animations:[],jumpshot:[],recstats:[]}; updateSummary();
}
function updateSummary(){
 const total=Object.values(pending).reduce((n,a)=>n+a.length,0);
 $('uploadSummary').innerHTML=total?`<strong>${total} picture${total===1?'':'s'} ready</strong> — ${categories.filter(([k])=>pending[k].length).map(([k,l])=>`${l}: ${pending[k].length}`).join(' • ')}`:'No pictures selected yet.';
}
function autoClean(file){
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{
  const scan=document.createElement('canvas'),sw=Math.min(360,img.width),sh=Math.round(img.height*(sw/img.width));scan.width=sw;scan.height=sh;const sx=scan.getContext('2d',{willReadFrequently:true});sx.drawImage(img,0,0,sw,sh);const data=sx.getImageData(0,0,sw,sh).data;
  const row=[],col=[];for(let y=0;y<sh;y++){let score=0;for(let x=0;x<sw;x+=3){const i=(y*sw+x)*4,r=data[i],g=data[i+1],b=data[i+2];score+=(Math.max(r,g,b)-Math.min(r,g,b))*.6+(r+g+b)/18}row[y]=score/(sw/3)}for(let x=0;x<sw;x++){let score=0;for(let y=0;y<sh;y+=3){const i=(y*sw+x)*4,r=data[i],g=data[i+1],b=data[i+2];score+=(Math.max(r,g,b)-Math.min(r,g,b))*.6+(r+g+b)/18}col[x]=score/(sh/3)}
  const bounds=(scores,center)=>{const max=Math.max(...scores),cut=Math.max(8,max*.22);let a=center,b=center;while(a>1&&scores[a]>cut)a--;while(b<scores.length-2&&scores[b]>cut)b++;return[a,b]};let [top,bottom]=bounds(row,Math.floor(sh*.42)),[left,right]=bounds(col,Math.floor(sw*.5));
  if((right-left)<sw*.48){left=Math.round(sw*.04);right=Math.round(sw*.96)}if((bottom-top)<sh*.42){top=Math.round(sh*.04);bottom=Math.round(sh*.82)}left=Math.max(0,left-4);right=Math.min(sw,right+4);top=Math.max(0,top-4);bottom=Math.min(sh,bottom+4);
  const scaleX=img.width/sw,scaleY=img.height/sh,cx=left*scaleX,cy=top*scaleY,cw=(right-left)*scaleX,ch=(bottom-top)*scaleY,max=1600,outScale=Math.min(1,max/Math.max(cw,ch)),c=document.createElement('canvas');c.width=Math.round(cw*outScale);c.height=Math.round(ch*outScale);const ctx=c.getContext('2d');ctx.filter='brightness(1.06) contrast(1.14) saturate(1.12)';ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,cx,cy,cw,ch,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.84));
 };img.src=reader.result};reader.readAsDataURL(file)});
}
async function collectFiles(key,files){
 const btn=$('saveBuildBtn');btn.disabled=true;btn.textContent='PREPARING PICTURES…';
 for(const file of files) pending[key].push(await autoClean(file));
 btn.disabled=false;btn.textContent='CREATE BUILD PAGE';updateSummary();
}
categories.forEach(([key])=>$(key+'Input').addEventListener('change',e=>collectFiles(key,[...e.target.files])));
function openAdd(){resetForm();$('buildDialog').showModal()}
window.editBuild=id=>{
 const b=builds.find(x=>x.id===id);if(!b)return;resetForm();$('dialogTitle').textContent='Add More Build Pictures';$('name').value=b.name;$('notes').value=b.notes||'';$('buildId').value=b.id;
 pending=Object.fromEntries(categories.map(([k])=>[k,[...(b.images?.[k]||[])]]));updateSummary();$('buildDialog').showModal();
};
window.deleteBuild=id=>{const b=builds.find(x=>x.id===id);if(b&&confirm('Delete '+b.name+' and all of its pictures?')){builds=builds.filter(x=>x.id!==id);save()}};
window.viewBuild=id=>{
 const b=builds.find(x=>x.id===id);if(!b)return;
 const sections=categories.map(([k,label])=>{const pics=b.images?.[k]||[];return `<section class="binder-photo-section"><div class="photo-section-title"><span>2K</span><h4>${label}</h4></div>${pics.length?`<div class="full-build-images">${pics.map((src,i)=>`<img src="${src}" alt="${esc(label)} screenshot ${i+1}">`).join('')}</div>`:`<div class="binder-empty">No ${label.toLowerCase()} screenshot added yet.</div>`}</section>`}).join('');
 const s=gameStats(games.filter(g=>g.buildId===b.id));
 $('detail').innerHTML=`<div class="modal-head binder-head"><div><div class="small">MY BUILD BINDER</div><h3>${esc(b.name)}</h3><p>${allImages(b).length} screenshots</p></div><button class="close" onclick="$('detailDialog').close()">✕</button></div><section class="binder-game-stats"><h4>GAME STATS</h4><div class="game-stat-tiles">${statTiles(s)}</div><button onclick="$('detailDialog').close();openGameFor('${b.id}')">+ LOG THIS GAME</button></section>${sections}${b.notes?`<section class="binder-notes"><h4>MY NOTES</h4><p>${esc(b.notes)}</p></section>`:''}<div class="detail-actions"><button onclick="$('detailDialog').close();editBuild('${b.id}')">+ ADD MORE PICTURES</button></div>`;
 $('detailDialog').showModal();
};
$('buildForm').addEventListener('submit',e=>{e.preventDefault();const id=$('buildId').value||crypto.randomUUID();const b={id,name:$('name').value.trim(),notes:$('notes').value.trim(),images:pending,updated:new Date().toISOString()};const i=builds.findIndex(x=>x.id===id);if(i>=0)builds[i]=b;else builds.unshift(b);save();$('buildDialog').close();showPage('builds')});
$('enterBtn').onclick=()=>{$('cover').classList.add('hidden');$('app').classList.remove('hidden')};
$('quickAdd').onclick=openAdd;$('heroAdd').onclick=openAdd;$('addBuild').onclick=openAdd;
$('closeBtn').onclick=()=>$('buildDialog').close();$('cancelBtn').onclick=()=>$('buildDialog').close();
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showPage(b.dataset.page));render();
function openChallenge(){$('challengeForm').reset();$('challengeDialog').showModal()}
$('addChallenge').onclick=openChallenge;$('closeChallenge').onclick=()=>$('challengeDialog').close();$('cancelChallenge').onclick=()=>$('challengeDialog').close();
$('challengeForm').addEventListener('submit',e=>{e.preventDefault();challenges.unshift({id:crypto.randomUUID(),squad:$('squadName').value.trim(),contact:$('challengeContact').value.trim(),mode:$('challengeMode').value.trim(),date:$('challengeDate').value,notes:$('challengeNotes').value.trim(),status:'PENDING'});localStorage.setItem('svc1717_challenges_v1',JSON.stringify(challenges));$('challengeDialog').close();render();showPage('challenges')});
window.setChallenge=(id,status)=>{challenges=challenges.map(c=>c.id===id?{...c,status}:c);localStorage.setItem('svc1717_challenges_v1',JSON.stringify(challenges));render()};
window.deleteChallenge=id=>{if(confirm('Delete this challenge?')){challenges=challenges.filter(c=>c.id!==id);localStorage.setItem('svc1717_challenges_v1',JSON.stringify(challenges));render()}};
function openGameFor(buildId=''){if(!builds.length){alert('Add a build first.');return}$('gameForm').reset();$('gameBuild').innerHTML=builds.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('');if(buildId)$('gameBuild').value=buildId;$('gameDate').value=new Date().toISOString().slice(0,10);$('gameDialog').showModal()}
$('logGame').onclick=()=>openGameFor();$('closeGame').onclick=()=>$('gameDialog').close();$('cancelGame').onclick=()=>$('gameDialog').close();window.openGameFor=openGameFor;
$('gameForm').addEventListener('submit',e=>{e.preventDefault();games.unshift({id:crypto.randomUUID(),buildId:$('gameBuild').value,result:$('gameResult').value,date:$('gameDate').value,points:$('gamePoints').value,rebounds:$('gameRebounds').value,assists:$('gameAssists').value,steals:$('gameSteals').value,blocks:$('gameBlocks').value,fgMade:$('gameFgMade').value,fgAttempted:$('gameFgAttempted').value,threeMade:$('gameThreeMade').value,threeAttempted:$('gameThreeAttempted').value,notes:$('gameNotes').value.trim()});localStorage.setItem('svc1717_games_v1',JSON.stringify(games));$('gameDialog').close();render();showPage('stats')});
window.deleteGame=id=>{if(confirm('Delete this game entry?')){games=games.filter(g=>g.id!==id);localStorage.setItem('svc1717_games_v1',JSON.stringify(games));render()}};
