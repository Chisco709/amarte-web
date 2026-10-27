/* Medición: Google Analytics 4 y Google Ads con Consent Mode, aviso de cookies y origen de la visita */
(function () {
  var base = document.currentScript ? document.currentScript.src : location.href;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); } window.gtag = gtag;
  window.track = function (n, p) { try { gtag('event', n, p || {}); } catch (e) {} };
  try {
    var q = new URLSearchParams(location.search), o = [q.get('utm_source'), q.get('utm_medium'), q.get('utm_campaign')].filter(Boolean).join('/');
    if (!o && q.get('gclid')) o = 'google/cpc'; if (!o && q.get('fbclid')) o = 'facebook';
    if (o) sessionStorage.setItem('amarte_src', o);
  } catch (e) {}
  window.fuente = function () { try { return sessionStorage.getItem('amarte_src') || (document.referrer ? new URL(document.referrer).hostname : 'directo'); } catch (e) { return 'directo'; } };
  var ids = [window.GA_ID, window.ADS_ID].filter(Boolean); if (!ids.length) return;
  function upd(v) { gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v }); }
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  var c = null; try { c = localStorage.getItem('amarte_consent'); } catch (e) {}
  if (c == 'granted') upd('granted');
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ids[0]; document.head.appendChild(s);
  gtag('js', new Date()); ids.forEach(function (id) { gtag('config', id); });
  if (c) return;
  var st = document.createElement('style');
  st.textContent = '#ck{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));max-width:460px;z-index:95;background:#0a2e0e;color:#fff;border:3px solid #fff;box-shadow:6px 6px 0 #f0b232;padding:16px 18px;font:15px/1.45 "Bricolage Grotesque",system-ui,sans-serif}#ck a{color:#fff;font-weight:800}#ck div{display:flex;gap:10px;margin-top:12px}#ck button{font:800 15px "Bricolage Grotesque",system-ui,sans-serif;padding:9px 16px;border:3px solid #fff;cursor:pointer;background:transparent;color:#fff}#ck button.y{background:#f0b232;color:#0a2e0e;border-color:#f0b232}';
  document.head.appendChild(st);
  var b = document.createElement('div'); b.id = 'ck'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
  b.innerHTML = 'Usamos cookies de medición (Google Analytics) para mejorar el sitio y medir nuestros anuncios. <a href="' + new URL('../privacidad/', base).href + '">Más información</a><div><button class="y" id="ckY">Aceptar</button><button id="ckN">Rechazar</button></div>';
  document.body.appendChild(b);
  function fin(v) { try { localStorage.setItem('amarte_consent', v); } catch (e) {} if (v == 'granted') upd('granted'); b.remove(); }
  document.getElementById('ckY').onclick = function () { fin('granted'); };
  document.getElementById('ckN').onclick = function () { fin('denied'); };
})();