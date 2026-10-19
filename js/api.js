/* Conexión con la base de datos: estado compartido de los hexágonos, en vivo para todos los visitantes */
var db = null, sig = '';
try { if (SUPABASE_URL && window.supabase) db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { db = null; }
function cargar() {
  return db.from('hexagonos').select('numero,estado,nombre,hasta').then(function (r) {
    if (r.error || !r.data) return false;
    var now = Date.now(); st = new Array(TOTAL).fill(0); who = [];
    r.data.forEach(function (h) {
      var i = h.numero - 1;
      if (h.estado == 'tejido') st[i] = 1;
      else if (h.estado == 'apadrinado') { st[i] = 2; who[i] = h.nombre; }
      else if (h.estado == 'proceso' && new Date(h.hasta) > now) st[i] = 3;
    });
    return true;
  });
}
function sync(ok) {
  if (ok === false) return; var s = st.join('') + who.join('|'); if (s == sig) return; sig = s;
  Object.keys(sel).forEach(function (k) { if (st[k]) delete sel[k]; });
  bar(); stats(); draw(); muro();
}
function refrescar() { if (db) cargar().then(sync); }
if (db) {
  refrescar(); setInterval(refrescar, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refrescar(); });
}