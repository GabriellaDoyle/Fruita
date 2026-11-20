// Interaction system: finds the door or object the player can use right now.
import {hit} from './collision.js';
export function nearest(b,map){
  const d=map.doors.find(d=>hit(b,d.r));if(d)return{type:'door',d};
  const r={x:b.x-5,y:b.y-5,w:b.w+10,h:b.h+10};
  const i=map.objects.findIndex(o=>o.lines&&hit(r,o));
  return i<0?null:{type:'obj',o:map.objects[i],key:map.id+':'+i};
}
