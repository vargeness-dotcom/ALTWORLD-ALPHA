
export type Source={title:string;url:string;extract:string;provider:string};
export async function research(query:string):Promise<Source[]>{
 const q=encodeURIComponent(query);
 const r=await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=5&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`);
 if(!r.ok) throw new Error('Исторический поиск временно недоступен');
 const data=await r.json(); const pages=Object.values(data.query?.pages||{}) as any[];
 return pages.map(p=>({title:p.title,url:`https://en.wikipedia.org/?curid=${p.pageid}`,extract:String(p.extract||'').slice(0,900),provider:'Wikipedia'}));
}
