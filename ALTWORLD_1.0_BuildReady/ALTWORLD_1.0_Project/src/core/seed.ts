
import type {WorldState} from './types';
export const scenarios = [
 {id:'1836',label:'1836 — век империй',date:'1836-01-01',description:'Мир на пороге индустриального ускорения.'},
 {id:'1900',label:'1900 — индустриальная эпоха',date:'1900-01-01',description:'Империи, промышленность и глобальная конкуренция.'},
 {id:'1914',label:'1914 — канун Великой войны',date:'1914-01-01',description:'Европейская система союзов находится под напряжением.'},
 {id:'1936',label:'1936 — мир между войнами',date:'1936-01-01',description:'Политическая нестабильность и ускоренная модернизация.'},
 {id:'1953',label:'1953 — холодная война',date:'1953-01-01',description:'Послевоенное устройство мира.'},
 {id:'1991',label:'1991 — новый мировой порядок',date:'1991-01-01',description:'Распад старых блоков и формирование новой системы.'}
];
const makeCountry=(id:string,name:string,tag:string,color:string,capital:string,population:number,treasury:number,gdp:number,government:string)=>({id,name,tag,color,capital,population,treasury,gdp,stability:65,literacy:55,industry:40,agriculture:50,technology:35,relations:{},government,goals:['Сохранить устойчивость','Развивать экономику']});
export function createWorld(scenario='1836',player='rus'):WorldState{
 const s=scenarios.find(x=>x.id===scenario)||scenarios[0];
 const countries=[
 makeCountry('rus','Российская империя','RUS','#6686a6','Санкт-Петербург',60,120,90,'Абсолютная монархия'),
 makeCountry('gbr','Британская империя','GBR','#b56e6e','Лондон',26,180,150,'Конституционная монархия'),
 makeCountry('fra','Франция','FRA','#718bb9','Париж',34,100,105,'Монархия'),
 makeCountry('pru','Пруссия','PRU','#8a8f9c','Берлин',14,65,55,'Монархия'),
 makeCountry('usa','США','USA','#719a83','Вашингтон',17,80,70,'Федеративная республика'),
 makeCountry('chn','Цинский Китай','QNG','#b89c5d','Пекин',400,110,130,'Империя'),
 makeCountry('ottoman','Османская империя','OTT','#9b8067','Константинополь',25,55,45,'Империя'),
 makeCountry('jpn','Япония','JPN','#b77e83','Эдо',30,35,30,'Сёгунат')
 ];
 return {scenario:s.id,date:s.date,playerCountryId:player,countries,events:[{id:'opening',date:s.date,title:'Начало новой эпохи',body:s.description,category:'world'}],orders:[],notes:[],turn:0};
}
