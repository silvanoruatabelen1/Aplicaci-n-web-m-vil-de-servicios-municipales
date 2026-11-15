# San Francisco Cerca — TP5 Arquitecturas Móviles

**Autor:** Silvano Ruata Maria Belen  
**Materia:** Arquitecturas Móviles · UTN Facultad Regional San Francisco · 2026

> **PROTOTIPO ACADÉMICO NO OFICIAL.** Los datos de estaciones, alarmas, zonas, cedulones, montos, reclamos, avisos y transacciones son ficticios y los pagos no mueven dinero. Los teléfonos y correos públicos del módulo de atención proceden del sitio municipal indicado en `docs/FUENTES_Y_SUPUESTOS.md`. **No usar en producción, no ingresar datos personales reales.**

## Objetivo y módulos

Aplicación web móvil no nativa para explorar siete servicios: bicicletas públicas, tributos/cedulones, reclamos con adjuntos, líneas de atención, alarmas por zonas, estacionamiento medido y notificaciones al vecino. Responde a las ERS simplificadas de las páginas 5 a 8 de la Guía de Trabajos Prácticos.

## Requisitos y ejecución

- Node.js **20 o superior** (incluye las APIs `http`, `fetch`, `node:test` necesarias).
- Un navegador moderno móvil o de escritorio.
- **No hay dependencias npm externas**. No se requieren claves, cuentas, bases de datos ni `npm install`.

```bash
cd TP5_SanFrancisco_Silvano_Ruata_Maria_Belen
npm start
```

Abrir **http://localhost:4173**. La aplicación enlaza a una API de prueba que vive en el mismo servidor. Para cambiar de puerto: `PORT=5000 npm start` (Linux/macOS) o `set PORT=5000 && npm start` (Windows CMD).

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

Para reiniciar los datos demo sin borrar archivos manualmente:

```bash
curl -X POST http://localhost:4173/api/demo/reset
```

O borrar el archivo `data/demo-state.json` con el servidor detenido. Ese archivo se crea cuando se registra una operación y está excluido del repositorio.

## Arquitectura

`Navegador móvil / PWA (HTML + CSS + JavaScript) → JSON/HTTP → API Node.js local → estado JSON persistido`.

- **Presentación:** SPA ligera con rutas `#/`, sin empaquetador ni tienda de aplicaciones.
- **Lógica de negocio:** reglas simples validadas en servidor; clientes muestran estados de carga/error y acciones confirmadas.
- **Datos:** datos iniciales ficticios en `src/seed.js`, operaciones en `data/demo-state.json` (persistencia local para la demo).
- **Mapas:** mapas SVG interactivos y esquemáticos, con coordenadas ilustrativas (no planos reales); geolocalización voluntaria para calcular distancia a estaciones ficticias.
- **Notificaciones:** avisos en el panel, actualización por sondeo cada 20 s y notificaciones locales mediante la API Notification / Service Worker con permiso. **No hay push remoto VAPID ni mensajería real en segundo plano.**
- **PWA:** manifiesto y service worker para cachear el *shell* web; no se ofrecen operaciones de API offline.

No es una API municipal ni una integración con una pasarela bancaria. Las operaciones tienen identificadores `DEMO` y comprobantes PDF sin validez oficial.

## Recorrido recomendado de demostración

1. Ingresar a Inicio y explicar el rótulo de simulación.
2. Ir a Bicicletas: marcar una estación, ver bicis/anclajes; solicitar permiso de ubicación si se desea; reportar un problema ficticio.
3. En Tributos: descargar un cedulón PDF, pagar en modo demo y descargar comprobante.
4. En Reclamos: ingresar un formulario y un archivo JPG/PNG/PDF de prueba; encontrar el reclamo y avanzar su estado con el control de demo.
5. En Atención: mostrar enlaces `tel:` y `mailto:` basados en canales oficiales; el botón de WhatsApp solo comparte un mensaje, no contacta un número municipal verificado.
6. En Alarmas: elegir zonas y simular una activación; revisar el aviso nuevo.
7. En Estacionamiento: iniciar 30 minutos ficticios, probar aviso de vencimiento y extender la operación.
8. En Avisos: seleccionar tipos y zonas; solicitar permiso de notificaciones locales si se desea.

Para dejar todo limpio: `curl -X POST http://localhost:4173/api/demo/reset`, luego recargar la página.

## Seguridad y privacidad: alcance real

El servidor escucha **únicamente en `127.0.0.1`** y no implementa autenticación ni autorización por usuario. Los registros son compartidos entre navegadores que accedan al mismo proceso. Hay validaciones de entradas, límites en adjuntos (dos archivos; 1,8 MB total) y cabeceras básicas de seguridad, pero **no** se debe desplegar en Internet. Faltan login, segregación de datos, consentimiento/política, almacenamiento privado, rate-limits, CSRF adecuado y pasarela real para un sistema productivo.

No recolectar CUIT, DNI, claves bancarias, patentes reales ni fotos/documentos de vecinos para esta demo. El módulo de reclamos guarda adjuntos de prueba en un JSON local, no en almacenamiento seguro real. La geolocalización se utiliza solo en la sesión y no se persiste.

## Criterios no funcionales

- **Responsive:** estilos para móvil, tablet y escritorio; controles táctiles, etiquetas accesibles y navegación por teclado en los marcadores.
- **Compatibilidad:** se ha realizado previsualización de las vistas en un motor Chromium con datos stub; **Safari y Firefox reales siguen pendientes**.
- **Rendimiento:** objetivo de la cátedra, primer uso menor a 3 s; **no está medido ni garantizado**. Recomendada prueba Lighthouse/DevTools en dispositivo de gama media con red limitada.
- **Escalabilidad:** módulos/capas separados, contratos JSON definidos; la persistencia JSON y el sondeo periódico se sustituirían por base de datos y eventos en producción.
- **Ciclo offline:** el shell se almacena en caché, pero acciones y datos dinámicos requieren API; última copia visible con cartel de desconexión.

## Estructura

```text
public/               SPA, estilos, Web App Manifest y service worker
src/seed.js            Catálogos y estado inicial (datos de simulación)
server.js              API JSON, validación, PDF y servidor web local
tests/api.test.js      Pruebas automáticas de integración HTTP
docs/                  Arquitectura, matriz de consigna, guía de demo y fuentes
evidencias/            Previsualizaciones de UI (incluidas en el ZIP externo)
Informe_TP5.pdf       Informe de entrega (se proporciona en el ZIP externo)
```

## Repositorio Git y entrega

Esta carpeta es un proyecto autónomo listo para versionar. Para publicarlo en un repositorio GitHub de tu propiedad:

```bash
git init
git add .
git commit -m "TP5: prototipo web movil servicios municipales"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Este repositorio ya se encuentra publicado en GitHub. El ZIP con el informe PDF y las capturas se entrega por separado.

## Limitaciones y pendientes reales

- Integración con APIs municipales oficiales, pagos seguros y datos en tiempo real **reales**.
- Push remoto en segundo plano (suscripciones VAPID/proveedor HTTPS).
- Backend multiusuario autenticado y autorización de acceso a datos personales.
- Mapas cartográficos reales con puntos validados por la Municipalidad.
- Pruebas manuales y de rendimiento en Chrome, Firefox y Safari móviles; exposición presencial y publicación del repositorio remoto.

## Fuentes

- Guía oficial de TPs, páginas 5–8 (principal).
- `Unidad 1.4 1.5 - Arquitecturas Android.pdf` (capas de presentación, negocio y datos, aplicación conceptual al caso web).
- `Unidad 1.7 - Test Automatiza Integracion Continua.pdf` (tipos de pruebas y calidad).
- Municipalidad de San Francisco, [Contacto](https://www.sanfrancisco.gov.ar/contacto), [Teléfonos útiles](https://www.sanfrancisco.gov.ar/contenidos/telefonos-utiles-355), [Centro de Atención Ciudadana](https://www.sanfrancisco.gov.ar/contenidos/centro-de-atencion-ciudadana-301), [Aplicación San Francisco](https://sanfrancisco.gov.ar/noticia/la-app-de-estacionamiento-medido-dejara-de-ser-exclusiva-y-migrara-a-hacia-la-app-san-francisco-6467).