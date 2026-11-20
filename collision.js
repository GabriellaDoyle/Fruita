export const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const blocked=(box,solids)=>solids.some(s=>hit(box,s));
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
