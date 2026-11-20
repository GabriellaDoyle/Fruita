// Save/load manager: 3 manual slots + autosave, timestamped, validated on read.
import {hasMap} from './world.js';
const K='fruita_save_';
export const SLOTS=['1','2','3','auto'];
export const Save={
  read(s){try{const d=JSON.parse(localStorage.getItem(K+s));return d&&d.v===1&&d.state&&hasMap(d.state.map)?d:null}catch{return null}},
  write(s,state){try{localStorage.setItem(K+s,JSON.stringify({v:1,time:Date.now(),state}));return true}catch{return false}},
  latest(){return SLOTS.map(s=>({s,d:this.read(s)})).filter(x=>x.d).sort((a,b)=>b.d.time-a.d.time)[0]||null},
  any(){return !!this.latest()},
  stamp(d){return new Date(d.time).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
};
