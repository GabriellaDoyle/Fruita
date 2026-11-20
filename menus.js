// Menu definitions: title, pause, save/load slots, settings, instructions, inventory.
import {Save,SLOTS} from './save.js';
const nm=s=>s==='auto'?'AUTOSAVE':'SLOT '+s;
const page=(title,text)=>({title,text});
export const manualMenu=g=>({title:'INSTRUCTIONS',w:128,items:()=>[
 ['MOVEMENT',['WASD / ARROWS: walk','Walk up to doors and press E','Walk around objects']],
 ['INTERACTION',['E: talk, examine, pick up, enter','SPACE or E: advance dialogue','Inspect signs, drawers, cabinets']],
 ['INVENTORY',['I: open inventory','Memories and quest items are kept','Items stay when changing scenes']],
 ['WORLD MAP',['M: world map (coming soon)']],
 ['QUEST JOURNAL',['J: quest journal (coming soon)']],
 ['GAME MENU',['ESC: pause / go back one level','Save, load, settings','Main menu never erases saves']]
 ].map(([t,x])=>({label:t,fn:()=>g.ui.open(page(t,x))}))});
export const invPage=g=>page('INVENTORY',g.state.inv.length?g.state.inv.flatMap(i=>['* '+i.name+' ['+i.cat+']','   '+i.desc,'   Found: '+i.where]):['Nothing collected yet.']);
export const settingsMenu=g=>({title:'SETTINGS',w:140,items:()=>[
 {label:'TEXT SPEED: '+(g.settings.fast?'FAST':'NORMAL'),fn:()=>{g.settings.fast=!g.settings.fast;g.saveSettings()}},
 {label:'AUTOSAVE: '+(g.settings.auto?'ON':'OFF'),fn:()=>{g.settings.auto=!g.settings.auto;g.saveSettings()}}]});
export const slotMenu=(g,mode)=>({title:mode==='save'?'SAVE GAME':'LOAD GAME',w:150,items:()=>SLOTS.filter(s=>mode==='load'||s!=='auto').map(s=>{
  const d=Save.read(s),label=nm(s)+' '+(d?Save.stamp(d):'- EMPTY -');
  if(mode==='load')return{label,off:!d,fn:()=>g.start(d.state)};
  const go=()=>g.saveTo(s)?(g.ui.toast('GAME SAVED SUCCESSFULLY.'),g.ui.back()):g.ui.toast('SAVE FAILED');
  return{label,fn:()=>d?g.ui.confirm('Overwrite '+nm(s)+'?',go):go()}})});
export const pauseMenu=g=>({title:'PAUSED',w:128,items:()=>[
 {label:'RESUME GAME',fn:()=>g.ui.clear()},
 {label:'SAVE GAME',fn:()=>g.ui.open(slotMenu(g,'save'))},
 {label:'LOAD GAME',fn:()=>g.ui.open(slotMenu(g,'load'))},
 {label:'INVENTORY',fn:()=>g.ui.open(invPage(g))},
 {label:'QUEST JOURNAL',fn:()=>g.ui.toast('JOURNAL: COMING SOON')},
 {label:'WORLD MAP',fn:()=>g.ui.toast('MAP: COMING SOON')},
 {label:'INSTRUCTIONS',fn:()=>g.ui.open(manualMenu(g))},
 {label:'SETTINGS',fn:()=>g.ui.open(settingsMenu(g))},
 {label:'RETURN TO MAIN MENU',fn:()=>g.ui.confirm('Return to main menu? Unsaved progress is lost.',()=>g.toTitle())}]});
export const titleMenu=g=>({title:'MAIN MENU',root:1,x:124,y:56,items:()=>{const L=Save.latest();return[
 {label:'NEW GAME',fn:()=>Save.any()?g.ui.confirm('Saves found. Start a new game?',()=>g.newGame()):g.newGame()},
 {label:'CONTINUE',off:!L,fn:()=>g.start(L.d.state)},
 {label:'LOAD GAME',fn:()=>g.ui.open(slotMenu(g,'load'))},
 {label:'SETTINGS',fn:()=>g.ui.open(settingsMenu(g))},
 {label:'INSTRUCTIONS',fn:()=>g.ui.open(manualMenu(g))},
 {label:'CREDITS',fn:()=>g.ui.open(page('CREDITS',['FRUITA','A game about home, memory,','and red-rock desert light.']))}]}});
