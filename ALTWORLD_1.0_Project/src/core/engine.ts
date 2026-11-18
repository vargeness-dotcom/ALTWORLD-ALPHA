
import type {WorldState,WorldPatch,Order} from './types'; import {askLocal} from '../ai/ollama'; import {research} from '../research/history';
const safeNumber=(v:any,old:number,min=0,max=1e9)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):old;
export function applyPatch(world:WorldState,patch:WorldPatch):WorldState{
 const known=new Set(world.countries.map(c=>c.id));
 const countries=world.countries.map(c=>{const u=patch.countryUpdates?.find(x=>x.id===c.id); if(!u)return c; return {...c,
 population:safeNumber(u.population,c.population,1000),treasury:safeNumber(u.treasury,c.treasury,-1e6,1e9),gdp:safeNumber(u.gdp,c.gdp,0,1e9),
 stability:safeNumber(u.stability,c.stability,0,100),literacy:safeNumber(u.literacy,c.literacy,0,100),industry:safeNumber(u.industry,c.industry,0,100),agriculture:safeNumber(u.agriculture,c.agriculture,0,100),technology:safeNumber(u.technology,c.technology,0,100),
 government:typeof u.government==='string'?u.government:c.government,goals:Array.isArray(u.goals)?u.goals.filter(x=>typeof x==='string').slice(0,8):c.goals};});
 const events=(patch.events||[]).slice(0,20).map((e,i)=>({...e,id:`t${world.turn+1}-e${i}`})).filter(e=>typeof e.title==='string'&&typeof e.body==='string');
 const orders=world.orders.map(o=>{const r=patch.orderResults?.find(x=>x.id===o.id);return r?{...o,status:r.status,explanation:r.explanation}:o});
 return {...world,countries:known.size===countries.length?countries:world.countries,events:[...events,...world.events].slice(0,250),orders,date:patch.date||world.date,notes:[...world.notes,...(patch.notes||[])].slice(-100),turn:world.turn+1};
}
export async function processOrders(world:WorldState,orders:Order[],model:string){
 const player=world.countries.find(c=>c.id===world.playerCountryId)!;
 const researchResults=await research(`${world.date} ${player.name} history economy diplomacy`);
 const prompt=`СОСТОЯНИЕ МИРА:\n${JSON.stringify({date:world.date,turn:world.turn,player,countries:world.countries.map(c=>({id:c.id,name:c.name,population:c.population,treasury:c.treasury,gdp:c.gdp,stability:c.stability,industry:c.industry,technology:c.technology,government:c.government,relations:c.relations})),recentEvents:world.events.slice(0,12),orders:orders.map(o=>({id:o.id,text:o.text})),historicalSources:researchResults.map(s=>({title:s.title,extract:s.extract}))})}
Сделай правдоподобную оценку приказов и один временной шаг примерно на 3 месяца. ИИ является содержательным двигателем мира: предложи решения других государств, экономические и демографические изменения, дипломатические реакции и события. Не исполняй невозможное мгновенно. Не создавай новые страны. Не удаляй страны. Верни JSON формата {"date":"YYYY-MM-DD","countryUpdates":[{"id":"existing-id","treasury":number,"gdp":number,"population":number,"stability":number,"industry":number,"agriculture":number,"technology":number,"government":"...","goals":["..."]}],"events":[{"date":"...","title":"...","body":"...","category":"diplomacy|economy|society|politics|world"}],"orderResults":[{"id":"...","status":"accepted|rejected|completed","explanation":"..."}],"notes":["..."]}. Изменяй только существующие id. Значения должны быть умеренными и объяснимыми.`;
 const raw=await askLocal(prompt,model); let parsed:WorldPatch; try{parsed=JSON.parse(raw)}catch{throw new Error('Модель вернула некорректный JSON. Состояние мира не изменено.')}
 return applyPatch(world,parsed);
}
