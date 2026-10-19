"""Empaqueta el sitio en dist/index.html (un solo archivo listo para publicar).
Uso: python3 build.py"""
import re,base64,pathlib
r=pathlib.Path(__file__).parent;h=(r/'index.html').read_text()
h=re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',lambda m:'<style>'+(r/m[1]).read_text()+'</style>',h)
h=re.sub(r'<script src="(js/[^"]+)"></script>',lambda m:'<script>'+(r/m[1]).read_text()+'</script>',h)
uri='data:image/png;base64,'+base64.b64encode((r/'assets/logo.png').read_bytes()).decode()
h=h.replace('assets/logo.png',uri)
(r/'dist').mkdir(exist_ok=True);(r/'dist/index.html').write_text(h);print('dist/index.html',len(h)//1024,'KB')
