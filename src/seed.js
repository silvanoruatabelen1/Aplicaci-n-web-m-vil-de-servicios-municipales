'use strict';

// Datos ficticios destinados exclusivamente al TP5. Ninguna estación, alarma o zona
// aquí incluida debe interpretarse como un servicio municipal real.
const stations = [
  { id:'B01', name:'Punto Cívico (demo)', area:'Centro', lat:-31.4307, lon:-62.0850, capacity:16, bikes:8 },
  { id:'B02', name:'Punto Terminal (demo)', area:'Este', lat:-31.4349, lon:-62.0763, capacity:12, bikes:4 },
  { id:'B03', name:'Punto Parque (demo)', area:'Norte', lat:-31.4242, lon:-62.0897, capacity:18, bikes:12 },
  { id:'B04', name:'Punto Sur (demo)', area:'Sur', lat:-31.4400, lon:-62.0832, capacity:12, bikes:6 }
];
const alarms = [
  { id:'A01', name:'Alarma Norte (demo)', zone:'Norte', lat:-31.4255, lon:-62.0843, active:false },
  { id:'A02', name:'Alarma Centro (demo)', zone:'Centro', lat:-31.4318, lon:-62.0820, active:false },
  { id:'A03', name:'Alarma Sur (demo)', zone:'Sur', lat:-31.4394, lon:-62.0822, active:false }
];
const parkingZones = [
  { id:'Z01', name:'Zona Centro (demo)', area:'Centro', lat:-31.4323, lon:-62.0847, rate:625, schedule:'Lun-Vie 8:00-12:30 y 15:00-20:00 · Sáb 8:00-13:00' },
  { id:'Z02', name:'Zona Comercial (demo)', area:'Este', lat:-31.4340, lon:-62.0786, rate:625, schedule:'Lun-Vie 8:00-12:30 y 15:00-20:00 · Sáb 8:00-13:00' }
];
const contacts = [
  { id:'C01', name:'Conmutador municipal', subtitle:'Atención general', phone:'03564439111', phoneDisplay:'(03564) 439111', email:'prensa@sanfrancisco.gov.ar' },
  { id:'C02', name:'Atención ciudadana', subtitle:'Línea municipal', phone:'147', phoneDisplay:'147', email:'' },
  { id:'C03', name:'Reclamos', subtitle:'Línea ciudadana', phone:'103', phoneDisplay:'103', email:'' },
  { id:'C04', name:'Servicios públicos', subtitle:'Secretaría', phone:'03564439141', phoneDisplay:'(03564) 439141', email:'' },
  { id:'C05', name:'Recursos tributarios', subtitle:'Consultas de tributos', phone:'03564439111', phoneDisplay:'(03564) 439111 (internos 108 y 176)', email:'recursos@sanfrancisco.gov.ar' }
];
function seedState() {
  return {
    taxes:[
      {id:'T-2026-101', kind:'Inmueble', period:'Noviembre 2026', due:'2026-11-25', amount:9600, status:'pendiente'},
      {id:'T-2026-102', kind:'Automotor', period:'Diciembre 2026', due:'2026-12-10', amount:14800, status:'pendiente'},
      {id:'T-2026-099', kind:'Inmueble', period:'Octubre 2026', due:'2026-10-25', amount:9200, status:'pagado'}
    ],
    payments:[{id:'P-DEMO-001', taxId:'T-2026-099', amount:9200, createdAt:'2026-10-20T12:00:00.000Z', method:'simulado'}],
    claims:[{id:'R-DEMO-001', category:'Alumbrado', subject:'Luminaria para revisión (ejemplo)', description:'Caso de ejemplo precargado para la demostración.', zone:'Centro', status:'En revisión', createdAt:'2026-11-10T15:00:00.000Z', attachments:[]}],
    bikeReports:[],
    alarms:alarms.map(a=>({...a})),
    subscriptions:['Centro'],
    notices:[
      {id:'N-DEMO-001', type:'obras', title:'Obras públicas · aviso de ejemplo', body:'Información ficticia para recorrer la bandeja de avisos.', zone:'Centro', createdAt:'2026-11-14T10:00:00.000Z', url:'https://www.sanfrancisco.gov.ar/'},
      {id:'N-DEMO-002', type:'servicios', title:'Servicio de agua · aviso de ejemplo', body:'No se informa ningún corte real. Este aviso forma parte del simulador.', zone:'Sur', createdAt:'2026-11-13T11:00:00.000Z', url:'https://www.sanfrancisco.gov.ar/'}
    ],
    notificationPrefs:{types:['servicios','obras','emergencia','tributos'], zones:['Centro','Norte','Sur','Este'], frequency:'todas'},
    parking:null,
    receipts:[]
  };
}
module.exports = {stations, alarms, parkingZones, contacts, seedState};
