// ===== CONFIGURACIÓN: lo único que debes editar =====
var WHATSAPP = '573148885007';   // WhatsApp de la fundación (57 = Colombia)
var TOTAL = 880, PRECIO = 8000;

// Números de hexágono del 1 al 880. Acepta números sueltos y rangos [desde, hasta].
// Ejemplo: [1, 2, 3, [10, 25]] = hexágonos 1, 2, 3 y del 10 al 25.
var TEJIDOS = [];       // hexágonos que ya están tejidos
var APADRINADOS = [];   // hexágonos apadrinados cuyo aporte YA confirmaste
// ======================================================

var Y = ['#d1366f', '#f0b232', '#3da697', '#4b9be8', '#876cdc', '#f0864f'];
function expand(l) { var o = []; l.forEach(function (x) { if (Array.isArray(x)) for (var n = x[0]; n <= x[1]; n++) o.push(n); else o.push(x); }); return o; }
var st = new Array(TOTAL).fill(0), col = [];
expand(TEJIDOS).forEach(function (n) { if (n >= 1 && n <= TOTAL) st[n - 1] = 1; });
expand(APADRINADOS).forEach(function (n) { if (n >= 1 && n <= TOTAL && !st[n - 1]) st[n - 1] = 2; });
(function () { var a = 20261019; for (var i = 0; i < TOTAL; i++) { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; col.push(Y[Math.floor(((t ^ t >>> 14) >>> 0) / 4294967296 * 6)]); } })();