// Player controller. State lives in g.state (x,y = top-left of the 10x8 feet hitbox).
import {blocked,clamp} from './collision.js';
export const pbox=s=>({x:s.x,y:s.y,w:10,h:8});
const SPEED=64;
export function updatePlayer(g,dt){
  const s=g.state,i=g.input,m=g.map;
  let dx=(i.held('right')?1:0)-(i.held('left')?1:0),dy=(i.held('down')?1:0)-(i.held('up')?1:0);
  g.moving=!!(dx||dy);if(!g.moving)return;
  if(dx&&dy){dx*=.7071;dy*=.7071}
  s.face=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  const b=pbox(s),sp=SPEED*dt;
  b.x=clamp(b.x+dx*sp,0,m.pw-b.w);if(blocked(b,m.solids))b.x=s.x;
  b.y=clamp(b.y+dy*sp,0,m.ph-b.h);if(blocked(b,m.solids))b.y=s.y;
  s.x=b.x;s.y=b.y;g.walk+=dt;
}
