# Fuentes, datos respaldados y supuestos

**Autor:** Silvano Ruata Maria Belen

## Origen de los requisitos

Las siete familias funcionales, los requisitos no funcionales y la entrega provienen exclusivamente de las páginas 5 a 8 de `Guia De Trabajos Practicos (1).pdf` compartido por la cátedra. Se admiten APIs simuladas cuando no estén disponibles.

La presentación de arquitecturas aporta la organización por presentación, reglas de negocio y datos. El apunte de testing respalda el enfoque de pruebas locales, integración y UI. La elección concreta de tecnologías y la implementación son **decisiones de diseño para este TP**, no decisiones atribuidas al docente.

## Verificado fuera de la cátedra

- Sitio de contacto municipal: https://www.sanfrancisco.gov.ar/contacto (conmutador general y correo público).
- Listado telefónico: https://www.sanfrancisco.gov.ar/contenidos/telefonos-utiles-355.
- Centro de Atención Ciudadana: https://www.sanfrancisco.gov.ar/contenidos/centro-de-atencion-ciudadana-301.
- La Municipalidad informa sobre una app municipal que ya reúne servicios de reclamos, bicicletas, estacionamiento y cedulones: https://sanfrancisco.gov.ar/noticia/la-app-de-estacionamiento-medido-dejara-de-ser-exclusiva-y-migrara-a-hacia-la-app-san-francisco-6467 (24/11/2025).
- Tarifa publicada en mayo de 2026: https://www.sanfrancisco.gov.ar/noticia/actualizacion-en-la-tarifa-del-estacionamiento-medido-6921 (04/05/2026). Se reproduce **$625** únicamente como valor de ejemplo, no como garantía de vigencia actual.
- APIs de notificaciones del navegador y condiciones de HTTPS: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/push_event.

## Datos simulados

Estaciones de bicicletas, coordenadas de estaciones, cantidades, alarmas y sus ubicaciones, zonas de estacionamiento, montos tributarios, identidades de cedulones, pagos, reclamos, historiales, anuncios y activaciones son muestras ficticias. Los estados cambiantes provienen de la API Node.js local. No se ha comprobado acceso a APIs municipales abiertas para esos datos; la simulación es una decisión de implementación coherente con la consigna.

## Precauciones

Una demo nunca se debe confundir con información real sobre emergencias, impuestos o pago de estacionamiento. Cualquier despliegue público debería sustituir los mocks por APIs contractualmente autorizadas, añadir login/roles y validar consentimiento, privacidad, transacciones y seguridad de archivos.
