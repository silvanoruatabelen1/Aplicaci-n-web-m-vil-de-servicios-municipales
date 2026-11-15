'use strict';
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const {stations, parkingZones, contacts, seedState} = require('./src/seed');
const ROOT = path.join(__dirname, 'public');
const DB = process.env.TP5_DATA_FILE || path.join(__dirname,'data','demo-state.json');
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
const MAX_BODY = 2_700_000;
function loadState() { try { return JSON.parse(fs.readFileSync(DB,'utf8')); } catch { return seedState(); } }
function saveState(s) { fs.mkdirSync(path.dirname(DB),{recursive:true}); const tmp=DB+'.tmp'; fs.writeFileSync(tmp,JSON.stringify(s,null,2)); fs.renameSync(tmp, DB); }
let state = loadState();
const id = (prefix) => `${prefix}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
function respond(res,status,data) {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Demo-Data':'true'}); res.end(JSON.stringify(data));}
function error(res,status,message) {return respond(res,status,{error:message, demo:true});}
async function readBody(req) {let data=''; for await (const b of req) {data+=b; if(Buffer.byteLength(data)>MAX_BODY) throw Object.assign(new Error('Carga demasiado grande'),{status:413}); } try {return data? JSON.parse(data):{};} catch {throw Object.assign(new Error('JSON inválido'),{status:400});}}
function ensureString(x,min,max) {return typeof x==='string' && x.trim().length>=min && x.trim().length<=max;}
function bikeSnapshot() {const cycle=Math.floor(Date.now()/25000);return stations.map((a,i)=>{const variation=((cycle+i)%3)-1;const bikes=Math.max(0,Math.min(a.capacity,a.bikes+variation));return {...a,bikes,free:a.capacity-bikes,updatedAt:new Date().toISOString(),demo:true};});}
function overview() {return {bikeCount:stations.length,pendingTaxes:state.taxes.filter(t=>t.status==='pendiente').length,activeAlarms:state.alarms.filter(a=>a.active).length,notices:state.notices.length};}
function pdfText(lines) { // PDF mínimo de una página, sin dependencias de terceros.
  const ascii = t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7e]/g,' ').replace(/[()\\]/g,c=>'\\'+c);
  const content=['BT /F1 17 Tf 50 782 Td ('+ascii(lines[0]||'Comprobante')+') Tj','/F1 11 Tf 0 -30 Td'];
  for (let i=1;i<lines.length;i++) content.push('('+ascii(lines[i])+') Tj 0 -23 Td');
  content.push('ET');
  const stream=content.join('\n');
  const objs=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${Buffer.byteLength(stream,'latin1')} >>\nstream\n${stream}\nendstream`];
  let result='%PDF-1.4\n',offsets=[0];for(let i=0;i<objs.length;i++){offsets.push(Buffer.byteLength(result,'latin1'));result+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;}
  const xref=Buffer.byteLength(result,'latin1');result+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<offsets.length;i++)result+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  result+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(result,'latin1');
}
function sendPDF(res,lines,filename) {res.writeHead(200,{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${filename}"`,'Cache-Control':'no-store'});res.end(pdfText(lines));}
async function api(req,res,pathname) {
  const method=req.method;
  if(method==='GET' && pathname==='/api/health') return respond(res,200,{ok:true,mode:'demo',time:new Date().toISOString()});
  if(method==='GET' && pathname==='/api/bootstrap') return respond(res,200,{mode:'simulacion-academica',overview:overview(),bikes:bikeSnapshot(),taxes:state.taxes,history:state.payments,claims:state.claims.map(c=>({...c,attachments:c.attachments.map(a=>({name:a.name,type:a.type}))})),contacts,alarms:state.alarms,subscriptions:state.subscriptions,zones:parkingZones,parking:state.parking,notices:state.notices,preferences:state.notificationPrefs});
  if(method==='GET' && pathname==='/api/bikes') return respond(res,200,{items:bikeSnapshot(),demo:true});
  if(method==='GET' && pathname==='/api/notices') return respond(res,200,{items:state.notices,demo:true});
  if(method==='GET' && pathname==='/api/taxes') return respond(res,200,{items:state.taxes,history:state.payments,demo:true});
  const ced=pathname.match(/^\/api\/taxes\/(T-[\w-]+)\/cedulon\.pdf$/);
  if(method==='GET' && ced){const t=state.taxes.find(x=>x.id===ced[1]);if(!t)return error(res,404,'Cedulón inexistente');return sendPDF(res,['Cedulon municipal - DEMOSTRACION',`Identificador: ${t.id}`,`Concepto: ${t.kind}`,`Periodo: ${t.period}`,`Vencimiento: ${t.due}`,`Monto ficticio: ARS ${t.amount}`,`Estado: ${t.status}`,'NO VALIDO PARA PAGAR - PROTOTIPO ACADEMICO'],`cedulon-${t.id}.pdf`);}
  const rec=pathname.match(/^\/api\/receipts\/([\w-]+)\.pdf$/);
  if(method==='GET' && rec){const t=state.receipts.find(x=>x.id===rec[1]);if(!t)return error(res,404,'Comprobante inexistente');return sendPDF(res,['Comprobante - SIMULACION',`Operacion: ${t.id}`,`Servicio: ${t.kind}`,`Referencia: ${t.ref}`,`Importe simulado: ARS ${t.amount}`,`Fecha: ${t.date}`,'SIN VALIDEZ FISCAL NI FINANCIERA'],`comprobante-${t.id}.pdf`);}
  if(method==='POST' && pathname==='/api/taxes/pay') {
    const b=await readBody(req); const t=state.taxes.find(x=>x.id===b.taxId);if(!t)return error(res,404,'Tributo no encontrado');if(t.status==='pagado')return error(res,409,'Este cedulón ya está marcado como pagado');
    t.status='pagado';const p={id:id('P-DEMO'),taxId:t.id,amount:t.amount,createdAt:new Date().toISOString(),method:'simulado'};state.payments.unshift(p);
    const r={id:id('C'),kind:'Tributo municipal',ref:t.id,amount:t.amount,date:p.createdAt};state.receipts.unshift(r);saveState(state);return respond(res,201,{payment:p,receipt:r,simulation:true});
  }
  if(method==='POST' && pathname==='/api/claims') {
    const b=await readBody(req);
    if(!ensureString(b.subject,6,100)||!ensureString(b.description,12,600)||!['Centro','Norte','Sur','Este'].includes(b.zone)||!ensureString(b.category,3,40))return error(res,400,'Completá asunto, descripción, categoría y zona válidos');
    if(!Array.isArray(b.attachments)||b.attachments.length>2)return error(res,400,'Adjuntá como máximo 2 archivos');
    const types=['image/png','image/jpeg','application/pdf'];let total=0;
    for(const a of b.attachments){if(!ensureString(a.name,1,90)||!types.includes(a.type)||typeof a.data!=='string'||!a.data.startsWith('data:'))return error(res,400,'Archivo adjunto inválido');const match=a.data.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);if(!match||match[1]!==a.type)return error(res,400,'Archivo adjunto inválido');total+=Buffer.byteLength(match[2],'base64');}
    if(total>1_800_000)return error(res,413,'Adjuntos demasiado grandes (máximo 1,8 MB)');
    const claim={id:id('R-DEMO'),category:b.category,subject:b.subject.trim(),description:b.description.trim(),zone:b.zone,status:'Recibido',createdAt:new Date().toISOString(),attachments:b.attachments.map(a=>({name:a.name.replace(/[<>]/g,''),type:a.type,data:a.data}))};state.claims.unshift(claim);saveState(state);return respond(res,201,{item:{...claim,attachments:claim.attachments.map(a=>({name:a.name,type:a.type}))},simulation:true});
  }
  const attach=pathname.match(/^\/api\/claims\/([\w-]+)\/attachments\/(\d+)$/);
  if(method==='GET' && attach){const c=state.claims.find(x=>x.id===attach[1]);const a=c?.attachments[Number(attach[2])];if(!a)return error(res,404,'Adjunto no encontrado');const binary=Buffer.from(a.data.split(',')[1],'base64');res.writeHead(200,{'Content-Type':a.type,'Content-Disposition':'attachment; filename="adjunto"','X-Content-Type-Options':'nosniff'});return res.end(binary);}
  if(method==='POST' && pathname==='/api/bikes/report'){const b=await readBody(req);if(!stations.some(s=>s.id===b.stationId)||!ensureString(b.description,8,300))return error(res,400,'Seleccioná una estación y describí el problema');const item={id:id('BR'),stationId:b.stationId,description:b.description.trim(),createdAt:new Date().toISOString()};state.bikeReports.unshift(item);saveState(state);return respond(res,201,{item,simulation:true});}
  if(method==='POST' && pathname==='/api/subscriptions'){const b=await readBody(req);if(!Array.isArray(b.zones)||b.zones.some(z=>!['Centro','Norte','Sur','Este'].includes(z)))return error(res,400,'Zonas inválidas');state.subscriptions=[...new Set(b.zones)];saveState(state);return respond(res,200,{zones:state.subscriptions});}
  if(method==='POST' && pathname==='/api/notifications/preferences'){const b=await readBody(req);const types=['servicios','obras','emergencia','tributos'];if(!Array.isArray(b.types)||b.types.some(x=>!types.includes(x))||!Array.isArray(b.zones)||b.zones.some(x=>!['Centro','Norte','Sur','Este'].includes(x))||!['todas','importantes'].includes(b.frequency))return error(res,400,'Preferencias inválidas');state.notificationPrefs={types:[...new Set(b.types)],zones:[...new Set(b.zones)],frequency:b.frequency};saveState(state);return respond(res,200,{preferences:state.notificationPrefs});}
  if(method==='POST' && pathname==='/api/parking/start'){const b=await readBody(req);if(state.parking && new Date(state.parking.expiresAt)>new Date())return error(res,409,'Ya hay un estacionamiento activo');if(!parkingZones.some(z=>z.id===b.zoneId)||!['30','60','120'].includes(String(b.minutes))||!ensureString(b.plate,5,9)||!/^[A-Za-z0-9 -]+$/.test(b.plate))return error(res,400,'Datos de estacionamiento inválidos');const z=parkingZones.find(z=>z.id===b.zoneId);const mins=Number(b.minutes),now=Date.now();const p={id:id('E-DEMO'),zoneId:z.id,plate:b.plate.trim().toUpperCase(),startedAt:new Date(now).toISOString(),expiresAt:new Date(now+mins*60000).toISOString(),paidMinutes:mins,amount:Math.round(z.rate*mins/60)};state.parking=p;const r={id:id('C'),kind:'Estacionamiento',ref:p.id,amount:p.amount,date:p.startedAt};state.receipts.unshift(r);saveState(state);return respond(res,201,{parking:p,receipt:r,simulation:true});}
  if(method==='POST' && pathname==='/api/parking/extend'){if(!state.parking)return error(res,404,'No hay sesión de estacionamiento');const b=await readBody(req);if(!['30','60'].includes(String(b.minutes)))return error(res,400,'Duración inválida');const mins=Number(b.minutes),z=parkingZones.find(z=>z.id===state.parking.zoneId);const base=Math.max(Date.now(),new Date(state.parking.expiresAt).getTime());state.parking.expiresAt=new Date(base+mins*60000).toISOString();state.parking.paidMinutes+=mins;const amount=Math.round(z.rate*mins/60);state.parking.amount+=amount;const r={id:id('C'),kind:'Extensión de estacionamiento',ref:state.parking.id,amount,date:new Date().toISOString()};state.receipts.unshift(r);saveState(state);return respond(res,200,{parking:state.parking,receipt:r,simulation:true});}
  if(method==='POST' && pathname==='/api/demo/parking/expire-soon'){if(!state.parking)return error(res,404,'No hay estacionamiento de prueba activo');state.parking.expiresAt=new Date(Date.now()+4*60000).toISOString();saveState(state);return respond(res,200,{parking:state.parking});}
  if(method==='POST' && pathname==='/api/demo/alarm/toggle'){const b=await readBody(req);const a=state.alarms.find(x=>x.id===b.id);if(!a)return error(res,404,'Alarma no encontrada');a.active=!a.active;if(a.active){state.notices.unshift({id:id('N-DEMO'),type:'emergencia',title:`Alerta de simulación · ${a.zone}`,body:`Activación ficticia de ${a.name}. No corresponde a ninguna emergencia real.`,zone:a.zone,createdAt:new Date().toISOString(),url:'https://www.sanfrancisco.gov.ar/'});}saveState(state);return respond(res,200,{alarm:a,notices:state.notices,subscribed:state.subscriptions.includes(a.zone)});}
  if(method==='POST' && pathname==='/api/demo/claim/advance'){const b=await readBody(req),c=state.claims.find(x=>x.id===b.id);if(!c)return error(res,404,'Reclamo no encontrado');const stages=['Recibido','En revisión','En curso','Resuelto'];const index=stages.indexOf(c.status);c.status=stages[Math.min(stages.length-1,index+1)];saveState(state);return respond(res,200,{item:c});}
  if(method==='POST' && pathname==='/api/demo/reset'){state=seedState();saveState(state);return respond(res,200,{reset:true});}
  return error(res,404,'Ruta de API no encontrada');
}
async function requestHandler(req,res){
  const u=new URL(req.url,'http://localhost');let pathname;
  try {pathname=decodeURIComponent(u.pathname);}catch {return error(res,400,'Ruta mal formada');}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  try{
    if(pathname.startsWith('/api/'))return await api(req,res,pathname);
    if(!['GET','HEAD'].includes(req.method))return error(res,405,'Método no permitido');
    const p=pathname==='/'?'index.html':pathname.slice(1);const full=path.resolve(ROOT,p);
    if(!full.startsWith(ROOT+path.sep)||p.split('/').some(s=>s.startsWith('.')))return error(res,403,'Recurso no permitido');
    let stats;try{stats=fs.statSync(full);}catch{return error(res,404,'Recurso no encontrado');}
    if(!stats.isFile())return error(res,404,'Recurso no encontrado');
    res.writeHead(200,{'Content-Type':MIME[path.extname(full)]||'application/octet-stream','Cache-Control':p==='sw.js'?'no-cache':'public, max-age=120'});
    if(req.method==='HEAD')return res.end();fs.createReadStream(full).pipe(res);
  }catch(e){ if(!res.headersSent)error(res,e.status||500,e.status?e.message:'Error interno'); }
}
function createServer(){return http.createServer(requestHandler);}
if(require.main===module){const port=Number(process.env.PORT)||4173;createServer().listen(port,'127.0.0.1',()=>console.log(`San Francisco Cerca · DEMO en http://localhost:${port}`));}
module.exports={createServer};
