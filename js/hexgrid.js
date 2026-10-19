var C=['f','t','p'],$=function(i){return document.getElementById(i)},g=$('grid'),tip=$('tip');
function fmt(n){return '$'+n.toLocaleString('es-CO')}
function stats(){var t=0,p=0;st.forEach(function(v){if(v==1)t++;if(v==2)p++});var f=TOTAL-t-p;
$('nT').textContent=t;$('nP').textContent=p;$('nF').textContent=f;$('nM').textContent=fmt(f*PRECIO);
$('bP').style.width=p/TOTAL*100+'%';$('bT').style.width=t/TOTAL*100+'%'}
function draw(){var W=g.clientWidth,s=W<600?28:40,cols=Math.floor((W-s/2)/s),rows=Math.ceil(TOTAL/cols),h=s*1.1547,dy=s*.866;
g.style.height=(rows*dy+h-dy)+'px';g.innerHTML='';var fr=document.createDocumentFragment();
st.forEach(function(v,i){var r=Math.floor(i/cols),c=i%cols,b=document.createElement('button');
b.className='hx '+C[v];b.dataset.i=i;b.style.cssText='width:'+(s-2)+'px;height:'+(h-2)+'px;left:'+(c*s+(r%2?s/2:0)+1)+'px;top:'+(r*dy+1)+'px'+(v==1?';background:'+col[i]:'');
if(v==1)b.style.setProperty('--d',(Math.random()*1.8).toFixed(2)+'s');
b.setAttribute('aria-label','Hexágono '+(i+1)+': '+['por apadrinar','tejido','apadrinado'][v]);if(v)b.tabIndex=-1;fr.appendChild(b)});
g.appendChild(fr);g.querySelectorAll('.hx.t').forEach(function(b){b.style.setProperty('clip-path','polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)')});apply()}
function apply(){g.querySelectorAll('.hx').forEach(function(b){b.classList.toggle('dim',filt!='all'&&!b.classList.contains(filt))})}
g.addEventListener('click',function(e){var b=e.target.closest('.hx');if(!b)return;var i=+b.dataset.i;if(st[i])return;cur=i;$('dN').textContent='#'+(i+1);$('qty').value=1;$('dT').textContent=fmt(PRECIO);$('dlg').showModal()});
g.addEventListener('mouseover',function(e){var b=e.target.closest('.hx');if(!b){tip.style.display='none';return}var i=+b.dataset.i;
tip.textContent='#'+(i+1)+' · '+['Apadrina este hexágono','Tejido','Apadrinado'][st[i]];var r=b.getBoundingClientRect();tip.style.display='block';
tip.style.left=Math.max(8,r.left+r.width/2-tip.offsetWidth/2)+'px';tip.style.top=(r.top-tip.offsetHeight-10)+'px'});
g.addEventListener('mouseleave',function(){tip.style.display='none'});
document.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){filt=c.dataset.f;document.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x==c)});apply()}});
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},3800)}
$('no').onclick=function(){$('dlg').close()};
function reserve(n){var got=0;for(var k=0;k<TOTAL&&got<n;k++){var j=(cur+k)%TOTAL;if(!st[j]){st[j]=2;got++;var b=g.children[j];b.className='hx p'+(filt!='all'&&filt!='p'?' dim':'');b.style.background='';b.tabIndex=-1}}return got}
$('qty').oninput=function(){$('dT').textContent=fmt(Math.max(1,+$('qty').value||1)*PRECIO)};
$('ok').onclick=function(){var n=Math.min(20,Math.max(1,parseInt($('qty').value)||1));
if(!$('nm').value.trim()||!$('ct').value.trim()){toast('Escribe tu nombre y un medio de contacto');return}
var N=cur+1,r=reserve(n);stats();$('dlg').close();
toast(r==1?'¡Gracias! Reservaste el hexágono #'+N+'. Te contactaremos para coordinar tu aporte.':'¡Gracias! Reservaste '+r+' hexágonos ('+fmt(r*PRECIO)+'). Te contactaremos para coordinar tu aporte.');$('nm').value=$('ct').value=''};
