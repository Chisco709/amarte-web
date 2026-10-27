"""SEO: cambia el dominio y regenera sitemap.xml y robots.txt.
Uso:  python3 seo.py https://tudominio.com      (primera vez o si cambia el dominio)
      python3 seo.py                            (solo actualiza la fecha del sitemap antes de publicar)"""
import json,sys,datetime,pathlib
r=pathlib.Path(__file__).parent;cfg=json.loads((r/'seo.json').read_text());old=cfg['site'].rstrip('/')
new=(sys.argv[1] if len(sys.argv)>1 else old).rstrip('/')
if not new.startswith('http'): sys.exit('Escribe el dominio completo, ej: python3 seo.py https://fundacionamarte.org')
for f in ('index.html','404.html','privacidad/index.html'):
    p=r/f;t=p.read_text()
    for x in {old,'https://TU-DOMINIO.com'}: t=t.replace(x,new)
    p.write_text(t)
cfg['site']=new;(r/'seo.json').write_text(json.dumps(cfg,indent=2))
hoy=datetime.date.today().isoformat()
(r/'sitemap.xml').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>{new}/</loc>
    <lastmod>{hoy}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es-CO" href="{new}/"/>
    <image:image><image:loc>{new}/assets/og-image.png</image:loc><image:title>Cielo Tejido · Fundación Amarte</image:title></image:image>
  </url>
  <url>
    <loc>{new}/privacidad/</loc>
    <lastmod>{hoy}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
''')
(r/'robots.txt').write_text(f"User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: {new}/sitemap.xml\n")
print('Dominio:',new,'· sitemap.xml y robots.txt listos')