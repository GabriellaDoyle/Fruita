// Scene transition manager: fade out -> swap map -> fade in. One reusable path for every door.
import {VW,VH} from './world.js';
export class Scenes{
  constructor(g){this.g=g;this.f=0;this.d=0;this.fn=null}
  get busy(){return this.d!==0}
  go(id,spawn){
    if(this.busy)return;
    this.fn=()=>{const s=this.g.state;s.map=id;s.x=spawn.x;s.y=spawn.y;this.g.loadMap();this.g.autosave()};
    this.d=1;
  }
  fadeIn(){this.f=1;this.d=-1}
  update(dt){
    if(!this.d)return;this.f+=this.d*dt*5;
    if(this.d>0&&this.f>=1){this.f=1;this.fn();this.d=-1}
    else if(this.d<0&&this.f<=0){this.f=0;this.d=0}
  }
  draw(c){if(this.f>0){c.fillStyle=`rgba(0,0,0,${this.f})`;c.fillRect(0,0,VW,VH)}}
}
