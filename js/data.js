// ===== CONFIGURACIÓN: lo único que debes editar =====
var WHATSAPP = '573148885007';   // WhatsApp de la fundación (57 = Colombia)
var TOTAL = 880, PRECIO = 8000;

// Los hexágonos se escriben con su número (1 a 880). Acepta números sueltos y rangos [desde, hasta].
// Ejemplo: hex: [3, 17, [20, 25]]  =  hexágonos 3, 17 y del 20 al 25.

// Hexágonos ya tejidos
var TEJIDOS = [[1, 80]];

// PAGADOS y confirmados por la fundación. Aquí aparece el nombre del padrino.
// Ejemplo: { hex: [90, 91], nombre: 'María Pérez' },
var APADRINADOS = [
];

// EN PROCESO: la persona escribió pero aún no paga. Quedan reservados hasta la fecha 'hasta'
// (año-mes-día) y después VUELVEN A QUEDAR LIBRES SOLOS, sin que tengas que hacer nada.
// Ejemplo: { hex: [100], hasta: '2026-10-25' },
var EN_PROCESO = [
];
// ======================================================

var Y = ['#d1366f', '#f0b232', '#3da697', '#4b9be8', '#876cdc', '#f0864f'];
function expand(l) { var o = []; l.forEach(function (x) { if (Array.isArray(x)) for (var n = x[0]; n <= x[1]; n++) o.push(n); else o.push(x); }); return o; }
var st = new Array(TOTAL).fill(0), who = [], col = [], now = new Date();   // st: 0 libre, 1 tejido, 2 apadrinado, 3 en proceso
expand(TEJIDOS).forEach(function (n) { if (n >= 1 && n <= TOTAL) st[n - 1] = 1; });
APADRINADOS.forEach(function (e) { expand(e.hex).forEach(function (n) { if (n < 1 || n > TOTAL) return; who[n - 1] = e.nombre; if (!st[n - 1]) st[n - 1] = 2; }); });
EN_PROCESO.forEach(function (e) { if (new Date(e.hasta + 'T23:59:59') < now) return; expand(e.hex).forEach(function (n) { if (n >= 1 && n <= TOTAL && !st[n - 1]) st[n - 1] = 3; }); });
(function () { var a = 20261019; for (var i = 0; i < TOTAL; i++) { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; col.push(Y[Math.floor(((t ^ t >>> 14) >>> 0) / 4294967296 * 6)]); } })();