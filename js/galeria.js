/* Galería: fotos subidas desde el panel (Supabase Storage) con visor ampliado */
(function () {
  if (typeof db === 'undefined' || !db) return;
  var $ = function (i) { return document.getElementById(i); }, L = [], cur = 0, bucket = db.storage.from('galeria');
  function url(p) { return bucket.getPublicUrl(p).data.publicUrl; }
  function open(i) {
    cur = (i + L.length) % L.length; var x = L[cur];
    $('lbI').src = url(x.ruta); $('lbI').alt = x.titulo || 'Fotografía de la Fundación Amarte en el barrio San Judas'; $('lbC').textContent = x.titulo || '';
    $('lb').hidden = false; $('lbX').focus(); document.body.style.overflow = 'hidden';
  }
  function close() { $('lb').hidden = true; document.body.style.overflow = ''; $('lbI').src = ''; }
  db.from('galeria').select('*').order('creado_en', { ascending: false }).limit(300).then(function (r) {
    if (r.error || !r.data || !r.data.length) return; L = r.data;
    var box = $('gal'); box.innerHTML = '';
    L.forEach(function (x, i) {
      var b = document.createElement('button'), im = document.createElement('img');
      b.className = 'gi'; b.type = 'button'; b.setAttribute('aria-label', 'Ampliar: ' + (x.titulo || 'fotografía ' + (i + 1)));
      im.src = url(x.miniatura); im.alt = x.titulo || 'Fotografía de la Fundación Amarte en el barrio San Judas'; im.loading = 'lazy'; im.decoding = 'async';
      if (x.ancho && x.alto) { im.width = x.ancho; im.height = x.alto; }
      b.appendChild(im);
      if (x.titulo) { var s = document.createElement('span'); s.textContent = x.titulo; b.appendChild(s); }
      b.onclick = function () { open(i); }; box.appendChild(b);
    });
    $('galeria').hidden = false; $('navGal').hidden = false;
  });
  $('lbX').onclick = close; $('lbP').onclick = function () { open(cur - 1); }; $('lbN').onclick = function () { open(cur + 1); };
  $('lb').addEventListener('click', function (e) { if (e.target == $('lb')) close(); });
  document.addEventListener('keydown', function (e) {
    if ($('lb').hidden) return;
    if (e.key == 'Escape') close(); else if (e.key == 'ArrowLeft') open(cur - 1); else if (e.key == 'ArrowRight') open(cur + 1);
  });
})();