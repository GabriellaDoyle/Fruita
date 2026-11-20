// Bootstrap + game loop. Wires the modules together; all game state lives in g.state.
import {Input} from './input.js';import {UI} from './ui.js';import {Scenes} from './scenes.js';
import {Save} from './save.js';import {updatePlayer,pbox} from './player.js';import {nearest} from './interact.js';
import {VW,VH,getMap,hasMap,newState} from './world.js';import {drawWorld,drawTitle} from './render.js';
import {titleMenu,pauseMenu,manualMenu,invPage} from './menus.js';
const cv=document.getElementById('game'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
const fit=()=>{const s=Math.max(1,Math.floor(Math.min(innerWidth/VW,innerHeight/VH)));cv.style.width=VW*s+'px';cv.style.height=VH*s+'px'};
addEventListener('resize',fit);fit();
let saved={};try{saved=JSON.parse(localStorage.getItem('fruita_settings'))||{}}catch{}
const g={input:new Input(),mode:'title',state:null,map:null,t:0,walk:0,moving:false,settings:{fast:false,auto:true,...saved}};
g.ui=new UI(g);g.scenes=new Scenes(g);
g.loadMap=()=>{g.map=getMap(g.state.map)};
g.snapshot=()=>({...g.state,settings:{...g.settings}});
g.saveTo=s=>Save.write(s,g.snapshot());
g.autosave=()=>{if(g.settings.auto&&g.mode==='play')Save.write('auto',g.snapshot())};
g.saveSettings=()=>{try{localStorage.setItem('fruita_settings',JSON.stringify(g.settings))}catch{}};
g.begin=()=>{g.ui.clear();g.mode='play';g.loadMap();g.scenes.fadeIn()};
g.newGame=()=>{g.state=newState();g.begin();g.ui.say(['Another morning in Fruita.','Maybe Mom knows what is going on today.'])};
g.start=st=>{if(!hasMap(st.map))return g.ui.toast('SAVE DATA INVALID');g.state=JSON.parse(JSON.stringify(st));Object.assign(g.settings,st.settings||{});g.begin()};
g.toTitle=()=>{g.ui.clear();g.mode='title';g.ui.open(titleMenu(g))};
g.interact=()=>{
  const s=g.state,t=nearest(pbox(s),g.map);if(!t)return;
  if(t.type==='door')return g.scenes.go(t.d.to,t.d.spawn);
  const o=t.o,f=s.flags;let L=(f[t.key]&&o.alt)||o.lines;f[t.key]=1;
  const sp=o.npc?{n:o.npc,c:o.c}:null;
  if(o.give&&!s.inv.some(i=>i.id===o.give.id)){
    s.inv.push({...o.give,where:g.map.name});g.ui.toast('OBTAINED: '+o.give.name.toUpperCase());
    return g.ui.say([...L,'Obtained '+o.give.name+'!'],sp,()=>g.autosave());
  }
  g.ui.say(L,sp);
};
function update(dt){
  const i=g.input,ui=g.ui;g.scenes.update(dt);
  const modal=ui.active;   // sampled BEFORE update, so the key that closes a modal is consumed
  if(modal||ui.tt>0)ui.update(i,dt);
  if(modal||g.mode!=='play'||g.scenes.busy)return;   // modal UI has exclusive input
  if(i.hit('back'))ui.open(pauseMenu(g));
  else if(i.hit('help'))ui.open(manualMenu(g));
  else if(i.hit('inv'))ui.open(invPage(g));
  else if(i.hit('map')||i.hit('journal'))ui.toast('COMING SOON');
  else{updatePlayer(g,dt);if(i.hit('act'))g.interact()}
}
function draw(){
  c.fillStyle='#000';c.fillRect(0,0,VW,VH);
  if(g.mode==='title')drawTitle(c,g.t);else{drawWorld(c,g);if(g.ui.stack.length){c.fillStyle='rgba(0,0,0,.4)';c.fillRect(0,0,VW,VH)}}
  g.scenes.draw(c);g.ui.draw(c);
}
let last=performance.now();
(function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;g.t+=dt;update(dt);draw();g.input.endFrame();requestAnimationFrame(frame)})(last);
g.ui.open(titleMenu(g));
