# Anclajes visuales de hotspots

Todos los hotspots de navegación e interacción están definidos en:

`src/data/sceneAnchors.ts`

Cada entrada incluye:

- **element** — qué objeto de la imagen representa (puerta, cartel, laptop, etc.)
- **top / left** — centro del anclaje en % (misma transform que `SceneWorld`)
- **width / height** — área de click en % para objetos rectangulares

Al cambiar una imagen de escena, ajustar las coordenadas en `sceneAnchors.ts` y en los rastros de `sceneInvestigations.ts` para que coincidan con elementos visibles reales.

No usar indicadores flotantes: el usuario debe poder inferir dónde hacer click observando la escena.
