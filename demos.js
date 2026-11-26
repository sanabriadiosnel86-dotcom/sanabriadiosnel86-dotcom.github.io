const root = document.querySelector('#demo');
const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(x=>'<th>'+x+'</th>').join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')}</tbody></table></div>`;
const section = (name,text)=>`<section class="panel"><h3>${name}</h3>${text}</section>`;
const controls = (names)=>`<div class="tabs" aria-label="Vistas">${names.map((x,i)=>`<button data-tab="${i}">${x}</button>`).join('')}</div>`;
const item = (label,i)=>`<button class="entry" data-item="${i}">${label}</button>`;
const note = (s)=>`<p class="note">${s}</p>`;
const people = [
 ['Mora','Central','Perro','asset-mora.webp','Adulta · Esterilizada','Está acostumbrada a los paseos tranquilos. Busca un hogar con tiempo para acompañar su adaptación.'],
 ['Michi','Alto Paraná','Gato','asset-michi.webp','Joven · Vacunado','Le gusta observar desde lugares altos. Se propone un hogar de interior con ventanas protegidas.'],
 ['Toto','Itapúa','Perro','asset-toto.webp','Adulto · En recuperación','Necesita seguimiento veterinario y actividad moderada durante su recuperación.']
];
const departments = 'Asunción|Alto Paraguay|Alto Paraná|Amambay|Boquerón|Caaguazú|Caazapá|Canindeyú|Central|Concepción|Cordillera|Guairá|Itapúa|Misiones|Ñeembucú|Paraguarí|Presidente Hayes|San Pedro'.split('|');
const operations = [
 [['OT-0184','PlayStation 5','Diagnóstico','Se apaga durante el juego. Próximo paso: diagnóstico térmico.','Cliente A'],['OT-0183','Notebook Lenovo','En reparación','Pendiente de cambio de conector de carga.','Cliente B'],['OT-0182','PC de escritorio','Listo para retiro','Fuente reemplazada. Prueba de encendido completa.','Cliente C']],
 [['PR-0087','Limpieza y diagnóstico','Pendiente','Concepto de catálogo: diagnóstico y mantenimiento. Total ₲ 280.000.','Cliente A'],['PR-0086','Fuente de alimentación','Aceptado','Repuesto y mano de obra. Total ₲ 390.000.','Cliente C']],
 [['GPU-027','GeForce RTX 5070 Ti','3 unidades','Gráficas. Marca MSI.','Almacén'],['SSD-014','SSD NVMe de 1 TB','1 unidad','Almacenamiento. Stock bajo.','Almacén']]
];
const signals = [
 ['Identidad del remitente','Resultado de autenticación simulado','El dominio presentado al destinatario difiere del dominio usado para enviar el mensaje. DMARC falla en esta muestra.','La discrepancia apoya una hipótesis de suplantación. El fallo por sí solo no basta para confirmar phishing.'],
 ['Destino del enlace','Cadena HTTP simulada','El enlace lleva a un dominio ajeno a la marca suplantada tras una redirección. El destino se presenta neutralizado.','Comparar el dominio final con los dominios oficiales conocidos.'],
 ['Formulario de inicio','Inspección estática simulada','La página imita un inicio de sesión y su formulario envía credenciales a un destino ajeno a la organización.','La evidencia coincide con un intento de recolección de credenciales en este caso ficticio.']
];
const checks = [
 ['HTTPS y certificado','Correcto','El certificado del ejemplo es válido para el dominio evaluado.','Mantener la renovación automática.'],
 ['Redirección a HTTPS','Correcto','La respuesta HTTP redirige al mismo dominio por HTTPS.','Conservar la redirección.'],
 ['Cookie de sesión','Revisar','En la muestra no se observa el atributo Secure en la cookie de sesión.','Revisar la configuración de la cookie y comprobar la respuesta después del cambio.'],
 ['HSTS','Revisar','En la respuesta HTTPS simulada no se observa Strict-Transport-Security.','Evaluar HSTS una vez confirmado que el sitio se sirve íntegramente por HTTPS.']
];
let state;
const demos = {
 adoptame:{name:'Adoptame.py',description:'Adopción y apoyo animal en Paraguay',render(){
  const matches=people.filter(x=>(!state.area || state.area===x[1])&&(!state.species || state.species===x[2]));
  const chooser=(id,label,values,selected)=>`<label>${label}<select id="${id}"><option value="">Todas las opciones</option>${values.map(v=>`<option${selected===v?' selected':''}>${v}</option>`).join('')}</select></label>`;
  return `<div class="ad-lead"><div><h2>Animales en adopción</h2><p>Conocé a cada animal y el hogar que necesita.</p></div><img src="asset-mora.webp" alt="Mora, perra del catálogo ficticio"></div>${controls(['Catálogo','Apoyo animal'])}`+(state.tab===1?
   `<div class="cards">${['Refugio o fundación|Alimento y hogares temporales','Clínica veterinaria|Consultas y tratamientos','Equipo de rescate|Traslados y atención de urgencia'].map(v=>{let [a,b]=v.split('|');return '<details class="panel"><summary>'+a+'</summary><p>'+b+'</p></details>'}).join('')}</div>`+note('Opciones de apoyo ilustrativas. Esta versión no recibe donaciones.'):
   `<div class="filters">${chooser('area','Departamento o capital',departments,state.area)}${chooser('species','Especie',['Perro','Gato'],state.species)}</div><p role="status">${matches.length} perfiles de ejemplo</p><div class="cards">${matches.map(p=>`<article class="pet"><img src="${p[3]}" alt="${p[0]}, animal de ejemplo"><div><h3>${p[0]}</h3><p>${p[2]} · ${p[1]}</p><p>${p[4]}</p><details><summary>Ver cuidados</summary><p>${p[5]}</p></details></div></article>`).join('')}</div>`+(matches.length?'':note('No hay perfiles de muestra para esta búsqueda.')));
 }},
 zenix:{name:'Zenix',description:'Operaciones de taller',render(){
  const rows=operations[state.tab], active=rows[state.item];
  return `<div class="work"><aside><h2>Taller</h2>${controls(['Órdenes','Presupuestos','Inventario'])}</aside><div>${table(['Registro','Equipo o servicio','Estado'],rows.map((d,i)=>[item(d[0],i),d[1],d[2]]))}</div>${section(active[0]+' · '+active[1],`<p><strong>${active[2]}</strong></p><p>${active[3]}</p><p>${active[4]}</p>`)}</div>`;
 }},
 phishguard:{name:'PhishGuard PY',description:'Mesa de análisis de correos sospechosos',render(){
  const q=signals[state.item];
  return `<div class="incident"><div><small>EXPEDIENTE PG-PY-0042</small><h2>Aviso de verificación de cuenta</h2><p>Canal: correo · Muestra sintética</p></div><strong>Dictamen: phishing en el caso simulado</strong></div><div class="evidence"><div><h3>Evidencias</h3>${signals.map((row,i)=>item(row[0],i)).join('')}</div>${section(q[0],`<small>${q[1]}</small><p>${q[2]}</p><h4>Interpretación</h4><p>${q[3]}</p>`)}${section('Fundamento del dictamen','<p>El dominio final es ajeno a la organización y el formulario envía credenciales a ese destino. Las anomalías del correo refuerzan el hallazgo.</p><h4>Respuesta sugerida</h4><p>Preservar el mensaje y avisar al equipo responsable para revisar los indicadores.</p>')}</div>`;
 }},
 saldivo:{name:'Saldivo',description:'Finanzas personales · iPhone',render(){
  const panels=[
    '<div class="balance">Saldo disponible<strong>₲ 7.362.900</strong><span>Ingresos +₲ 4.500.000 · Gastos −₲ 718.800</span></div><h3>Disponible para gastar</h3><p>₲ 5.730.200</p>',
    '<h3>Presupuestos y ahorro</h3><p>Supermercado · ₲ 487.100 de ₲ 1.500.000</p><progress value="487100" max="1500000"></progress><p>Viaje · ₲ 1.800.000 de ₲ 3.600.000</p><progress value="1800000" max="3600000"></progress>',
    '<h3>Gastos del mes</h3><div class="ring" aria-hidden="true"></div><p>Supermercado · ₲ 487.100</p><p>Restaurantes · ₲ 102.400</p><p>Transporte y otros · ₲ 129.300</p>',
    '<h3>Registro asistido</h3><p>Notificación bancaria ficticia</p><strong>Supermercado · ₲ 86.000</strong><p>Categoría sugerida: Supermercado</p><button data-record>Confirmar registro</button><p role="status">'+(state.recorded?'Movimiento registrado en esta sesión de demo.':'Pendiente de revisión')+'</p>'
  ];
  return `<div class="finance-layout"><div><h2>Noviembre de 2026</h2><p>Datos en guaraníes, con saldos y avisos simulados.</p>${controls(['Resumen','Plan','Estadísticas','Registro'])}</div><div class="iphone">${panels[state.tab]}</div></div>`;
 }},
 sello:{name:'Sello PYG',description:'Comprobantes y custodia documental',render(){
  const sections=[
   table(['Campo','Valor extraído','Estado'],[['Fecha','24/11/2026','Consistente'],['Monto','₲ 385.000','Consistente'],['Emisor','Comercio de muestra','Pendiente de confirmar']]),
   '<h3>Confirmación de autenticidad</h3><p>La coincidencia de campos no acredita el origen. La confirmación requiere una fuente autorizada del emisor.</p><strong>Pendiente · Sin verificación externa en la demo</strong>',
   '<h3>Custodia documental</h3><p>La bóveda conservaría el original por separado de la copia de revisión y registraría accesos e integridad.</p><p>La marca distingue la copia que se comparte del original archivado.</p>'
  ];
  return `<div class="documents"><div class="receipt"><small>CP-0142 · EJEMPLO</small><h2>Comprobante</h2><p>Comercio de muestra</p><p>24 de noviembre de 2026</p><strong>₲ 385.000</strong><div class="stamp">COPIA DE REVISIÓN</div></div><div>${controls(['Campos','Autenticidad','Custodia'])}${sections[state.tab]}</div></div>`;
 }},
 vigia:{name:'Vigía Web PY',description:'Revisión defensiva de configuración web',render(){
  const q=checks[state.item], indexes=checks.map((_,i)=>i).filter(i=>!state.tab||checks[i][1]==='Revisar');
  return `<div class="scan-head"><h2>comercio.example</h2><p>Alcance autorizado de ejemplo · 2 controles por revisar</p></div>${controls(['Todos los controles','Por revisar'])}<div class="scan-grid">${table(['Control','Resultado'],indexes.map(i=>[item(checks[i][0],i),checks[i][1]]))}${section(q[0],`<p>${q[2]}</p><h4>Siguiente paso</h4><p>${q[3]}</p>`)}</div>`;
 }}
};
function draw(focus=''){
 const key=state.key, demo=demos[key];
 root.className='shell '+key;
 root.innerHTML=`<header class="demo-heading"><p>Demostración interactiva · Datos de ejemplo</p><h1>${demo.name}</h1><p>${demo.description}</p></header>`+demo.render();
 document.title=demo.name+' · Diosnel Sanabria';
 for(const a of document.querySelectorAll('nav a')) a.toggleAttribute('aria-current',a.hash==='#'+key);
 root.querySelectorAll('[data-tab]').forEach(e=>e.setAttribute('aria-pressed',String(Number(e.dataset.tab)===state.tab)));
 root.querySelectorAll('[data-item]').forEach(e=>e.setAttribute('aria-pressed',String(Number(e.dataset.item)===state.item)));
 if(focus) root.querySelector(focus)?.focus({preventScroll:true});
}
function navigate(){
 const key=location.hash.slice(1);
 state={key:Object.hasOwn(demos,key)?key:'adoptame',tab:0,item:0,area:'',species:'',recorded:false};
 draw();
}
root.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-tab')){state.tab=Number(b.dataset.tab);state.item=state.key==='vigia'&&state.tab===1?2:0;draw(`[data-tab="${state.tab}"]`);}
 if(b.hasAttribute('data-item')){state.item=Number(b.dataset.item);draw(`[data-item="${state.item}"]`);}
 if(b.hasAttribute('data-record')){state.recorded=true;draw('[data-record]');}
});
root.addEventListener('change',e=>{
 if(!['area','species'].includes(e.target.id))return;
 state[e.target.id]=e.target.value;draw('#'+e.target.id);
});
window.addEventListener('hashchange',navigate);
navigate();
