// UI manager: menu stack (ESC goes back one level), dialogue box, toast. Shared pixel frame style.
import {VW} from './world.js';
export const txt=(c,s,x,y,col='#f4ead0',al='left')=>{c.font='8px monospace';c.textAlign=al;c.fillStyle='#000';c.fillText(s,x+1,y+1);c.fillStyle=col;c.fillText(s,x,y)};
export const box=(c,x,y,w,h)=>{c.fillStyle='#1b1220';c.fillRect(x-2,y-2,w+4,h+4);c.fillStyle='#e8d9b0';c.fillRect(x-1,y-1,w+2,h+2);c.fillStyle='#2a1d3a';c.fillRect(x+1,y+1,w-2,h-2)};
const wrap=(s,n)=>{const out=[];let l='';for(const w of s.split(' ')){if((l+' '+w).trim().length>n){out.push(l);l=w}else l=(l+' '+w).trim()}out.push(l);return out};
export class UI{
  constructor(g){this.g=g;this.stack=[];this.dlg=null;this.tt=0;this.tm=''}
  get active(){return this.stack.length>0||!!this.dlg}
  open(def){this.stack.push({def,i:0})}
  back(){const t=this.stack.at(-1);if(t&&!t.def.root)this.stack.pop()}
  clear(){this.stack=[];this.dlg=null}
  say(lines,sp,done){this.dlg={lines,n:0,c:0,sp,done}}
  toast(m){this.tm=m;this.tt=2.2}
  confirm(q,yes){this.open({title:'CONFIRM',text:[q],items:()=>[{label:'YES',fn:()=>{this.back();yes()}},{label:'NO',fn:()=>this.back()}]})}
  update(inp,dt){
    if(this.tt>0)this.tt-=dt;
    const d=this.dlg;
    if(d){const L=d.lines[d.n];d.c=Math.min(L.length,d.c+dt*(this.g.settings.fast?90:35));
      if(inp.hit('act')){if(d.c<L.length)d.c=L.length;else if(++d.n>=d.lines.length){this.dlg=null;d.done&&d.done()}else d.c=0}
      return}
    const m=this.stack.at(-1);if(!m)return;
    const it=m.def.items?m.def.items():[];
    if(inp.hit('back')||(!it.length&&inp.hit('act'))){this.back();return}
    if(!it.length)return;
    if(inp.hit('up'))m.i=(m.i+it.length-1)%it.length;
    if(inp.hit('down'))m.i=(m.i+1)%it.length;
    if(inp.hit('act')&&!it[m.i].off)it[m.i].fn();
  }
  draw(c){
    const m=this.stack.at(-1);
    if(m){const d=m.def,it=d.items?d.items():[],tx=d.text||[],w=d.w||(tx.length?224:112),x=d.x??8,y=d.y??8,h=26+tx.length*10+it.length*12;
      box(c,x,y,w,h);txt(c,d.title,x+8,y+12,'#f2c14e');
      tx.forEach((t,k)=>txt(c,t,x+8,y+26+k*10));
      it.forEach((o,k)=>txt(c,(k===m.i?'> ':'  ')+o.label,x+8,y+26+tx.length*10+k*12,o.off?'#7a6f8a':k===m.i?'#f2c14e':'#f4ead0'))}
    const d=this.dlg;
    if(d){box(c,6,108,228,46);let x=14;
      if(d.sp){c.fillStyle=d.sp.c;c.fillRect(12,114,28,28);c.fillStyle='#f0c49a';c.fillRect(18,118,16,12);txt(c,d.sp.n,26,150,'#f2c14e','center');x=48}
      let rem=Math.floor(d.c);
      wrap(d.lines[d.n],d.sp?34:44).forEach((l,k)=>{txt(c,l.slice(0,Math.max(0,rem)),x,124+k*11);rem-=l.length+1});
      if(d.c>=d.lines[d.n].length&&Math.floor(this.g.t*3)%2)txt(c,'v',226,150,'#f2c14e')}
    if(this.tt>0){box(c,20,4,200,14);txt(c,this.tm,VW/2,14,'#f2c14e','center')}
  }
}
