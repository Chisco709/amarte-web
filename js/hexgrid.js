/* Cielo Tejido: panal de hexágonos, selección y solicitud por WhatsApp */
var C = ['f', 't', 'p'], $ = function (i) { return document.getElementById(i); }, g = $('grid'), tip = $('tip'), sel = {}, filt = 'all';
function fmt(n) { return '$' + n.toLocaleString('es-CO'); }
function picked() { return Object.keys(sel).map(Number).sort(function (a, b) { return a - b; }); }
function stats() {
  var t = 0, p = 0; st.forEach(function (v) { if (v == 1) t++; if (v == 2) p++; });
  var f = TOTAL - t - p;
  $('nT').textContent = t; $('nP').textContent = p; $('nF').textContent = f; $('nM').textContent = fmt(f * PRECIO);
  $('bP').style.width = p / TOTAL * 100 + '%'; $('bT').style.width = t / TOTAL * 100 + '%';
}
function bar() {
  var n = picked().length; $('sb').hidden = !n;
  $('sbN').textContent = n + (n == 1 ? ' hexágono' : ' hexágonos'); $('sbT').textContent = fmt(n * PRECIO);
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
    b.setAttribute('aria-label', 'Hexágono ' + (i + 1) + ': ' + ['por apadrinar', 'tejido', 'apadrinado'][v]); if (v) b.tabIndex = -1;
    fr.appendChild(b);
  });
  g.appendChild(fr); apply();
}
function apply() { g.querySelectorAll('.hx').forEach(function (b) { b.classList.toggle('dim', filt != 'all' && !b.classList.contains(filt)); }); }
g.addEventListener('click', function (e) {
  var b = e.target.closest('.hx'); if (!b) return; var i = +b.dataset.i; if (st[i]) return;
  if (sel[i]) delete sel[i]; else sel[i] = 1;
  b.classList.toggle('sel', !!sel[i]); b.setAttribute('aria-pressed', !!sel[i]); bar();
});
g.addEventListener('mouseover', function (e) {
  var b = e.target.closest('.hx'); if (!b) { tip.style.display = 'none'; return; } var i = +b.dataset.i;
  tip.textContent = '#' + (i + 1) + ' · ' + (st[i] == 0 ? (sel[i] ? 'Seleccionado' : 'Toca para apadrinar') : ['', 'Tejido', 'Apadrinado'][st[i]]);
  var r = b.getBoundingClientRect(); tip.style.display = 'block';
  tip.style.left = Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2) + 'px'; tip.style.top = (r.top - tip.offsetHeight - 10) + 'px';
});
g.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
document.querySelectorAll('.chip').forEach(function (c) { c.onclick = function () { filt = c.dataset.f; document.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x == c); }); apply(); }; });
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 4500); }
$('sbClr').onclick = function () { sel = {}; g.querySelectorAll('.hx.sel').forEach(function (b) { b.classList.remove('sel'); b.setAttribute('aria-pressed', 'false'); }); bar(); };
$('sbGo').onclick = function () {
  var p = picked(); $('dL').textContent = p.map(function (i) { return '#' + (i + 1); }).join(', '); $('dT').textContent = fmt(p.length * PRECIO); $('dlg').showModal();
};
$('no').onclick = function () { $('dlg').close(); };
$('ok').onclick = function () {
  var nm = $('nm').value.trim(), ct = $('ct').value.trim(), p = picked();
  if (!nm || !ct) { toast('Escribe tu nombre y un medio de contacto'); return; }
  if (!p.length) { $('dlg').close(); return; }
  var msg = 'Hola Fundación Amarte, quiero apadrinar el Cielo Tejido.\nHexágonos: ' + p.map(function (i) { return '#' + (i + 1); }).join(', ') +
    '\nTotal: ' + fmt(p.length * PRECIO) + '\nNombre: ' + nm + '\nContacto: ' + ct;
  var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  if (!window.open(url, '_blank', 'noopener')) location.href = url;
  $('dlg').close(); $('sbClr').onclick(); $('nm').value = $('ct').value = '';
  toast('Se abrió WhatsApp con tu solicitud. Envía el mensaje para confirmar.');
};