# Fundación Amarte · Proyecto San Judas

Sitio estático sin dependencias (solo Google Fonts).

```
index.html      estructura de la página
css/            tokens, base, nav, hero, about, cielo, plan, sections, footer, polish
js/data.js      CIFRAS EDITABLES (hexágonos tejidos, apadrinados, precio)
js/hexgrid.js   cielo de 880 hexágonos y ventana de apadrinar
js/plan.js      presupuesto por fases
js/effects.js   cinta, hilo de progreso, animación de tejido
js/main.js      arranque
assets/         logo
build.py        genera dist/index.html en un solo archivo
```

Para ver el sitio: abre `index.html` en el navegador. Para publicarlo: `python3 build.py` y sube `dist/index.html`.
Para actualizar el avance del Cielo Tejido, cambia `TEJIDOS` y `APADRINADOS` en `js/data.js`.
