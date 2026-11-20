// Input manager: maps keys to actions. held() = down now, hit() = pressed this frame.
const MAP={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right',e:'act',' ':'act',i:'inv',m:'map',j:'journal',escape:'back','?':'help'};
const norm=e=>MAP[e.key.toLowerCase()];
export class Input{
  constructor(){this.down=new Set();this.pressed=new Set();
    addEventListener('keydown',e=>{const k=norm(e);if(!k)return;e.preventDefault();if(!this.down.has(k))this.pressed.add(k);this.down.add(k)});
    addEventListener('keyup',e=>{const k=norm(e);if(k)this.down.delete(k)});
    addEventListener('blur',()=>this.down.clear());}
  held(a){return this.down.has(a)}
  hit(a){return this.pressed.has(a)}
  endFrame(){this.pressed.clear()}
}
