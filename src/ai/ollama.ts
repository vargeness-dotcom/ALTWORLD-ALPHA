
const BASE='http://127.0.0.1:11434';
export async function checkOllama(){try{const r=await fetch(`${BASE}/api/tags`);return r.ok?await r.json():null}catch{return null}}
export async function askLocal(prompt:string,model='qwen3.5:4b'){
 const r=await fetch(`${BASE}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,stream:false,format:'json',messages:[{role:'system',content:'Ты — движок альтернативной исторической grand strategy ALTWORLD. Возвращай только корректный JSON. Не выдумывай идентификаторы стран. Не меняй историческую реальность задним числом. Все действия требуют времени и ресурсов. Если данных недостаточно, укажи это.'},{role:'user',content:prompt}],options:{temperature:0.35,num_ctx:8192,num_predict:1800}})});
 if(!r.ok) throw new Error(`Ollama HTTP ${r.status}`); const data=await r.json(); return data.message?.content||'{}';
}
