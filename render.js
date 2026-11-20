// Rendering: overworld, interiors, sprites, warm lighting, title screen.
import {T,VW,VH,BUILDINGS,doorTile} from './world.js';
import {pbox} from './player.js';
import {nearest} from './interact.js';
import {clamp} from './collision.js';
import {box,txt} from './ui.js';
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
function hero(c,x,y,face,w){
  const s=w&&(Math.floor(w*8)&1)?1:0;
  R(c,'#2c3550',x+4,y+11,3,5-s);R(c,'#2c3550',x+9,y+11,3,4+s);
  R(c,'#d24a3a',x+3,y+6,10,6);R(c,'#f0c49a',x+4,y,8,7);R(c,'#5a3a22',x+4,y,8,face==='up'?6:3);
  if(face==='down'){R(c,'#222',x+6,y+4,1,1);R(c,'#222',x+9,y+4,1,1)}
  else if(face!=='up')R(c,'#222',x+(face==='left'?5:10),y+4,1,1);
}
function building(c,b){
  const x=b.x*T,y=b.y*T,w=b.w*T,h=b.h*T;
  R(c,b.c,x,y,w,h);R(c,'rgba(0,0,0,.35)',x,y,w,14);R(c,'rgba(255,255,255,.25)',x,y,w,2);
  for(const wx of [x+8,x+w-20])R(c,'#f4e3a0',wx,y+h-30,12,10);
  R(c,'#3a2418',doorTile(b)*T,y+h-T,T,T);R(c,'#e0b040',doorTile(b)*T+11,y+h-8,2,2);
  txt(c,b.s,x+w/2,y+11,'#fff','center');
}
function obj(c,o){
  if(o.cactus){R(c,o.c,o.x+6,o.y+2,4,14);R(c,o.c,o.x+2,o.y+6,4,3);R(c,o.c,o.x+10,o.y+4,4,3);return}
  R(c,'rgba(0,0,0,.4)',o.x,o.y,o.w,o.h);R(c,o.c,o.x+1,o.y+1,o.w-2,o.h-3);
  if(o.npc){R(c,'#f0c49a',o.x+4,o.y-4,8,7);R(c,'#4a3020',o.x+4,o.y-4,8,3)}
}
function outdoors(c,m){
  for(let ty=0;ty<30;ty++)for(let tx=0;tx<40;tx++){const h=(tx*7+ty*13+tx*ty)%5;R(c,h<1?'#cf9a5e':h<4?'#d8a66a':'#dcae72',tx*T,ty*T,T,T)}
  R(c,'#c9623f',0,0,640,40);
  for(let tx=0;tx<40;tx++){const h=12+((tx*5)%4)*8;R(c,'#a8452f',tx*T,40-h,T,h)}
  R(c,'#bdb0a0',0,9*T,640,T);R(c,'#bdb0a0',0,13*T,640,T);R(c,'#585260',0,10*T,640,3*T);
  for(let tx=0;tx<40;tx+=2)R(c,'#e8d070',tx*T+2,11*T+7,12,2);
  R(c,'#b08a54',3*T-2,22*T-2,10*T+4,7*T+4);R(c,'#e6cf9c',3*T,22*T,10*T,7*T);
  BUILDINGS.forEach(b=>building(c,b));
  txt(c,'PLAYGROUND',8*T,22*T-5,'#fff','center');
}
function indoors(c,m){
  const d=m.d;R(c,d.f,0,0,m.pw,m.ph);
  for(let i=0;i<12;i++)for(let j=1;j<9;j++)if((i+j)&1)R(c,'rgba(0,0,0,.05)',i*T,j*T,T,T);
  R(c,d.w,0,0,m.pw,T+6);R(c,'rgba(0,0,0,.3)',0,T+6,m.pw,2);R(c,d.w,0,0,T,m.ph);R(c,d.w,11*T,0,T,m.ph);
  R(c,d.w,0,8*T,5*T,T);R(c,d.w,7*T,8*T,5*T,T);R(c,'#6b3b2a',5*T,8*T+8,2*T,8);
}
export function drawWorld(c,g){
  const m=g.map,s=g.state,b=pbox(s);
  const cx=Math.round(m.pw<=VW?(m.pw-VW)/2:clamp(s.x+5-VW/2,0,m.pw-VW)),cy=Math.round(m.ph<=VH?(m.ph-VH)/2:clamp(s.y+4-VH/2,0,m.ph-VH));
  c.save();c.translate(-cx,-cy);
  m.kind==='out'?outdoors(c,m):indoors(c,m);
  [...m.objects.map(o=>({y:o.y+o.h,f:()=>obj(c,o)})),{y:s.y+8,f:()=>hero(c,s.x-3,s.y-8,s.face,g.moving?g.walk:0)}].sort((a,b)=>a.y-b.y).forEach(e=>e.f());
  if(!g.ui.active&&!g.scenes.busy&&nearest(b,m)){box(c,s.x-1,s.y-26,12,11);txt(c,'E',s.x+5,s.y-17,'#f2c14e','center')}
  c.restore();
  const t=m.kind==='in'?m.d.t:'255,150,60';R(c,`rgba(${t},.10)`,0,0,VW,VH);
  const v=c.createRadialGradient(VW/2,VH/2,60,VW/2,VH/2,150);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,5,0,.45)');c.fillStyle=v;c.fillRect(0,0,VW,VH);
}
export function drawTitle(c,t){
  const g=c.createLinearGradient(0,0,0,VH);g.addColorStop(0,'#f2a65a');g.addColorStop(1,'#f6d28b');c.fillStyle=g;c.fillRect(0,0,VW,VH);
  for(let x=0;x<VW;x+=12){const h=30+((x*7)%5)*10;R(c,'#a8452f',x,110-h,12,h);R(c,'#8f3b2b',x,110-h/2,12,h/2)}
  R(c,'#d8a66a',0,110,VW,50);R(c,'#cf9a5e',0,128,VW,32);
  hero(c,30,Math.round(100+Math.sin(t*2)),'down',t);
  c.font='bold 26px monospace';c.textAlign='left';c.fillStyle='#3a1a10';c.fillText('FRUITA',12,34);c.fillStyle='#fff';c.fillText('FRUITA',10,32);
  txt(c,'COLORADO',12,46,'#3a1a10');
}
