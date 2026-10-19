/* Efectos de página: cinta, hilo de progreso y animación de tejido */
$('mq').innerHTML=(function(){var s='';for(var i=0;i<10;i++)s+='Apadrina un hexágono<b>★</b>$8.000 cada uno<b>★</b>880 en el cielo<b>★</b>';return s})();
(function(){var bar=$('prog'),h=document.documentElement;
function p(){bar.style.transform='scaleX('+Math.min(1,scrollY/Math.max(1,h.scrollHeight-innerHeight))+')'}
addEventListener('scroll',p,{passive:true});p();
var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){g.classList.add('on');io.disconnect()}},{threshold:.12});io.observe(g)})();
