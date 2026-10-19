// ===== Datos editables: actualiza estas cifras a medida que avance el proyecto =====
var TOTAL=880, TEJIDOS=132, APADRINADOS=74, PRECIO=8000;
var Y=['#d1366f','#f0b232','#3da697','#4b9be8','#876cdc','#f0864f'];
var st=new Array(TOTAL).fill(0), col=[], cur=-1, filt='all';
(function(){var a=20261019;function r(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
var ix=[],i;for(i=0;i<TOTAL;i++){ix.push(i);col.push(Y[Math.floor(r()*6)])}
for(i=TOTAL-1;i>0;i--){var j=Math.floor(r()*(i+1)),x=ix[i];ix[i]=ix[j];ix[j]=x}
for(i=0;i<TEJIDOS;i++)st[ix[i]]=1;for(i=TEJIDOS;i<TEJIDOS+APADRINADOS;i++)st[ix[i]]=2})();
