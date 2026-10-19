/* Cielo Tejido: panal, selección, padrinos y solicitud por WhatsApp */
var C = ['f', 't', 'p', 'r'], LBL = ['por apadrinar', 'tejido', 'apadrinado', 'en proceso'];
var $ = function (i) { return document.getElementById(i); }, g = $('grid'), tip = $('tip'), sel = {}, filt = 'all';
function fmt(n) { return '$' + n.toLocaleString('es-CO'); }
function picked() { return Object.keys(sel).map(Number).sort(function (a, b) { return a - b; }); }
function info(i) { var v = st[i]; return '#' + (i + 1) + ' · ' + (v == 0 ? (sel[i] ? 'Seleccionado' : 'Toca para apadrinar') : (v == 2 ? 'Apadrinado' : v == 3 ? 'En proceso' : 'Tejido') + (who[i] ? ' · Padrino: ' + who[i] : '')); }
function stats() {
  var n = [0, 0, 0, 0]; st.forEach(function (v) { n[v]++; });
  $('nT').textContent = n[1]; $('nP').textContent = n[2]; $('nF').textContent = n[0]; $('nM').textContent = fmt((n[0] + n[3]) * PRECIO);
  $('bP').style.width = n[2] / TOTAL * 100 + '%'; $('bT').style.width = n[1] / TOTAL * 100 + '%';
}
function bar() { var n = picked().length; $('sb').hidden = !n; $('sbN').textContent = n + (n == 1 ? ' hexágono' : ' hexágonos'); $('sbT').textContent = fmt(n * PRECIO); }
function muro() {
  var m = {}, box = $('muro'); box.innerHTML = '';
  who.forEach(function (n, i) { if (n && st[i] == 2) (m[n] = m[n] || []).push(i + 1); });
  var names = Object.keys(m);
  if (!names.length) { var p = document.createElement('p'); p.textContent = 'Aquí aparecerán los nombres de los padrinos. Sé el primero.'; box.appendChild(p); return; }
  names.forEach(function (k) {
    var d = document.createElement('div'), b = document.createElement('b'), s = document.createElement('span');
    b.textContent = k; s.textContent = m[k].map(function (n) { return '#' + n; }).join(', '); d.className = 'pd'; d.appendChild(b); d.appendChild(s); box.appendChild(d);
  });
}
function draw() {
  var W = g.clientWidth, s = W < 600 ? 28 : 40, cols = Math.floor((W - s / 2) / s), rows = Math.ceil(TOTAL / cols), h = s * 1.1547, dy = s * .866;
  g.style.height = (rows * dy + h - dy) + 'px'; g.innerHTML = '';
  var fr = document.createDocumentFragment();
  st.forEach(function (v, i) {
    var r = Math.floor(i / cols), c = i % cols, b = document.createElement('button');
    b.className = 'hx ' + C[v] + (sel[i] ? ' sel' : ''); b.dataset.i = i;
    b.style.cssText = 'width:' + (s - 2) + 'px;height:' + (h - 2) + 'px;left:' + (c * s + (r % 2 ? s / 2 : 0) + 1) + 'px;top:' + (r * dy + 1) + 'px' + (v == 1 ? ';background:' + col[i] : '');
    if (v) b.style.setProperty('--d', (Math.random() * 1.8).toFixed(2) + 's'); else b.setAttribute('aria-pressed', !!sel[i]);
    if (who[i]) { var sp = document.createElement('span'); sp.textContent = who[i].trim().charAt(0).toUpperCase(); b.appendChild(sp); }
    b.setAttribute('aria-label', 'Hexágono ' + (i + 1) + ': ' + LBL[v] + (who[i] ? ', padrino ' + who[i] : '')); if (!v === false && !who[i]) b.tabIndex = -1;
    fr.appendChild(b);
  });
  g.appendChild(fr); apply();
}
function apply() { g.querySelectorAll('.hx').forEach(function (b) { b.classList.toggle('dim', filt != 'all' && !b.classList.contains(filt)); }); }
g.addEventListener('click', function (e) {
  var b = e.target.closest('.hx'); if (!b) return; var i = +b.dataset.i;
  if (st[i]) { toast(info(i)); return; }
  if (sel[i]) delete sel[i]; else sel[i] = 1;
  b.classList.toggle('sel', !!sel[i]); b.setAttribute('aria-pressed', !!sel[i]); bar();
});
g.addEventListener('mouseover', function (e) {
  var b = e.target.closest('.hx'); if (!b) { tip.style.display = 'none'; return; }
  tip.textContent = info(+b.dataset.i); var r = b.getBoundingClientRect(); tip.style.display = 'block';
  tip.style.left = Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px'; tip.style.top = (r.top - tip.offsetHeight - 10) + 'px';
});
g.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
document.querySelectorAll('.chip').forEach(function (c) { c.onclick = function () { filt = c.dataset.f; document.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x == c); }); apply(); }; });
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 4500); }
$('sbClr').onclick = function () { sel = {}; g.querySelectorAll('.hx.sel').forEach(function (b) { b.classList.remove('sel'); b.setAttribute('aria-pressed', 'false'); }); bar(); };
$('sbGo').onclick = function () { var p = picked(); $('dL').textContent = p.map(function (i) { return '#' + (i + 1); }).join(', '); $('dT').textContent = fmt(p.length * PRECIO); $('dlg').showModal(); };
$('no').onclick = function () { $('dlg').close(); };
$('ok').onclick = function () {
  var nm = $('nm').value.trim(), ct = $('ct').value.trim(), p = picked(), mostrar = $('mostrar').checked, btn = $('ok');
  if (!nm || !ct) { toast('Escribe tu nombre y un medio de contacto'); return; }
  if (!p.length) { $('dlg').close(); return; }
  var lista = p.map(function (i) { return '#' + (i + 1); }).join(', ');
  function abrir(id, w) {
    var m = 'Hola Fundación Amarte, quiero apadrinar el Cielo Tejido.' + (id ? '\nSolicitud #' + id : '') + '\nHexágonos: ' + lista +
      '\nTotal: ' + fmt(p.length * PRECIO) + '\nNombre: ' + nm + '\nContacto: ' + ct + '\nMostrar nombre: ' + (mostrar ? 'Sí' : 'No') +
      '\nQuedo atento a los datos de pago y enviaré el comprobante.';
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(m);
    if (w) w.location = url; else if (!window.open(url, '_blank', 'noopener')) location.href = url;
  }
  function fin() { $('dlg').close(); $('sbClr').onclick(); $('nm').value = $('ct').value = ''; }
  if (!db) { abrir(0, null); fin(); toast('Se abrió WhatsApp. Tu hexágono queda apadrinado cuando se confirme el pago.'); return; }
  var w = window.open('about:blank', '_blank'); btn.disabled = true;
  db.rpc('crear_solicitud', { p_hex: p.map(function (i) { return i + 1; }), p_nombre: nm, p_contacto: ct, p_mostrar: mostrar }).then(function (r) {
    btn.disabled = false;
    if (r.error || !r.data || !r.data.ok) {
      if (w) w.close();
      toast(r.data && r.data.ocupados ? 'Ya no están disponibles: ' + r.data.ocupados.map(function (n) { return '#' + n; }).join(', ') : 'No pudimos reservar. Intenta de nuevo.');
      refrescar(); return;
    }
    abrir(r.data.id, w); fin(); refrescar();
    toast('¡Reservado por 48 horas! Envía el mensaje de WhatsApp y paga para confirmar.');
  });
};
muro();