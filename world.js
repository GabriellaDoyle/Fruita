// World data: overworld, building interiors, objects. Add a building = add one entry here.
export const T=16,VW=240,VH=160;
const o=(x,y,w,h,c,p={})=>({x:x*T,y:y*T,w:w*T,h:h*T,c,solid:1,...p});
export const BUILDINGS=[
 {id:'home',name:"Player's House",s:'HOME',x:4,y:4,w:6,h:5,c:'#b5523b'},
 {id:'starbucks',name:'Starbucks',s:'STARBUCKS',x:15,y:4,w:6,h:5,c:'#1e6b4a'},
 {id:'museum',name:'Dinosaur Journey Museum',s:'DINO JOURNEY',x:26,y:4,w:8,h:5,c:'#8a6a4a'},
 {id:'dispensary',name:'Green Leaf Dispensary',s:'GREEN LEAF',x:4,y:14,w:6,h:5,c:'#4a8a3a'},
 {id:'qdoba',name:'QDoba',s:'QDOBA',x:15,y:14,w:6,h:5,c:'#a33a3a'},
 {id:'target',name:'Target',s:'TARGET',x:26,y:14,w:8,h:5,c:'#cc2b2b'}];
export const doorTile=b=>b.x+(b.w>>1);
export const entrance=b=>({x:doorTile(b)*T+3,y:(b.y+b.h)*T+2});
const IN_SPAWN={x:6*T-5,y:7*T};
export const newState=()=>({map:'home',x:IN_SPAWN.x,y:IN_SPAWN.y,face:'down',flags:{},inv:[]});
const cactus=(x,y)=>o(x,y,1,1,'#3f7d3a',{cactus:1});
const OUT=[
 o(22,9,1,1,'#7a5230',{lines:['Welcome to Downtown Fruita.','Dinosaurs, desert, and sunsets.']}),
 o(23,14,1,1,'#3a6ea5',{npc:'HIKER',lines:['Hiker: The museum is worth a visit.'],alt:['Hiker: Watch for rattlers out there.']}),
 o(5,23,3,1,'#6a6a78',{lines:['The old swing set. It still creaks.']}),
 o(9,24,1,2,'#d04a4a',{lines:['A rusty slide. You loved this as a kid.']}),
 o(4,26,2,1,'#c9a35a',{lines:['You dig through the sand...','Something small and metal glints!'],alt:['Just sand now.'],give:{id:'keepsake',name:'Rusty Toy Car',cat:'Memories',desc:'Your first toy car. Still sandy.'}}),
 cactus(2,7),cactus(23,6),cactus(37,6),cactus(2,22),cactus(20,24),cactus(30,26),cactus(36,22)];
export const IN={
 home:{t:'255,170,80',f:'#a9825a',w:'#d9c9a8',obj:[
  o(1,1,2,2,'#4a6fa5',{lines:['Your bed. Still unmade.']}),
  o(9,1,2,1,'#7a5230',{lines:['You open the dresser drawer.','An old photograph is tucked inside.'],alt:['Just old socks in here.'],give:{id:'photo',name:'Old Photograph',cat:'Memories',desc:'You and Mom at the red rocks.'}}),
  o(6,4,1,1,'#e8a0a0',{npc:'MOM',lines:['Morning, sleepyhead!','Go see what Fruita is up to.'],alt:['Have fun out there!']})]},
 starbucks:{t:'255,190,110',f:'#8a6a4a',w:'#2f5d46',obj:[
  o(2,2,6,1,'#5a3a22',{lines:['A pastry case. Nearly sold out.']}),
  o(9,3,1,1,'#3a8a5a',{npc:'BARISTA',lines:['Welcome in! The usual?'],alt:['Enjoy your coffee!']}),
  o(8,5,2,2,'#7a5230',{lines:['Someone left a note on the table:','"Meet me at the playground."']})]},
 museum:{t:'255,200,130',f:'#b8a98a',w:'#5e4a38',obj:[
  o(3,2,5,2,'#e8e0c8',{lines:['A huge dinosaur skeleton.','Fruita is dino country!']}),
  o(9,2,2,1,'#8a9aa8',{lines:['A glass case with a fossil tooth.','The lid is loose...'],alt:['The case is empty now.'],give:{id:'fossil',name:'Fossil Tooth',cat:'Collectibles',desc:'A replica dino tooth.'}}),
  o(8,5,1,1,'#8a5ea5',{npc:'CURATOR',lines:['Welcome to Dinosaur Journey!','Please touch gently.'],alt:['Seen the fossils yet?']})]},
 dispensary:{t:'170,255,170',f:'#6a7a5a',w:'#3a5a3a',obj:[
  o(2,2,5,1,'#4a3a2a',{lines:['Glass jars with labels. Looks legal.']}),
  o(8,4,1,1,'#7aa05a',{npc:'BUDTENDER',lines:['21 and over only, friend.','You are just browsing? Cool.'],alt:['Take your time.']})]},
 qdoba:{t:'255,180,100',f:'#a8754a',w:'#8a2e2e',obj:[
  o(2,2,6,1,'#c8c8c8',{lines:['The salsa bar. Mild to scorching.']}),
  o(9,4,1,1,'#e0b040',{npc:'CASHIER',lines:['Burrito or bowl?'],alt:['Extra guac is extra.']})]},
 target:{t:'255,255,255',f:'#d8d4cc',w:'#b03030',obj:[
  o(2,2,3,1,'#c04040',{lines:['Shelves of snacks and sunscreen.']}),
  o(8,5,1,1,'#aaaaaa',{lines:['A shopping cart with one bad wheel.']}),
  o(9,3,1,1,'#d03030',{npc:'CLERK',lines:['Need help finding anything?'],alt:['Have a good one!']})]}};
export const hasMap=id=>id==='fruita'||!!IN[id];
const rc=(x,y,w,h)=>({x:x*T,y:y*T,w:w*T,h:h*T});
export function getMap(id){
  if(id==='fruita')return{id,kind:'out',name:'Fruita - Town',pw:40*T,ph:30*T,objects:OUT,
    solids:[...BUILDINGS.map(b=>rc(b.x,b.y,b.w,b.h)),...OUT.filter(x=>x.solid)],
    doors:BUILDINGS.map(b=>({r:rc(doorTile(b),b.y+b.h,1,1),to:b.id,spawn:IN_SPAWN,label:b.name}))};
  const d=IN[id],b=BUILDINGS.find(b=>b.id===id);
  return{id,kind:'in',name:b.name,pw:12*T,ph:9*T,objects:d.obj,d,
    solids:[rc(0,0,12,1),rc(0,0,1,9),rc(11,0,1,9),rc(0,8,5,1),rc(7,8,5,1),...d.obj.filter(x=>x.solid)],
    doors:[{r:rc(5,8,2,1),to:'fruita',spawn:entrance(b)}]};
}
