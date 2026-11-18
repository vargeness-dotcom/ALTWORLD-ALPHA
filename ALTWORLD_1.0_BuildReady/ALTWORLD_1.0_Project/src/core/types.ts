
export type Country = {
 id:string; name:string; tag:string; color:string; capital:string;
 population:number; treasury:number; gdp:number; stability:number; literacy:number;
 industry:number; agriculture:number; technology:number; relations:Record<string,number>;
 government:string; goals:string[];
};
export type WorldEvent = {id:string; date:string; title:string; body:string; category:string; sources?:{title:string;url:string}[]};
export type Order = {id:string; text:string; status:'pending'|'accepted'|'rejected'|'completed'; explanation?:string};
export type WorldState = {scenario:string; date:string; playerCountryId:string; countries:Country[]; events:WorldEvent[]; orders:Order[]; notes:string[]; turn:number};
export type WorldPatch = {countryUpdates?:Array<Partial<Country>&{id:string}>; events?:Array<Omit<WorldEvent,'id'>>; date?:string; notes?:string[]; orderResults?:Array<{id:string;status:'accepted'|'rejected'|'completed';explanation:string}>};
