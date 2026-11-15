# Guion para la demostración en clase (aprox. 7–9 minutos)

**Silvano Ruata Maria Belen — Arquitecturas Móviles — TP5**

### Apertura (1 min)

"Desarrollé una aplicación web móvil no nativa, llamada San Francisco Cerca, que agrupa siete servicios del TP5. No es una app oficial; los servicios sin APIs disponibles se resuelven mediante una API REST simulada. La arquitectura separa interfaz, lógica y datos y puede usarse desde el navegador sin instalación de una app nativa".

### Recorrido funcional (4–5 min)

1. **Inicio (20 s).** Mostrar siete accesos y adaptación a pantalla móvil.
2. **Bicicletas (40 s).** Tocar un marcador en el mapa esquemático; ver bicis/anclajes, actualización y reporte. Indicar que el tiempo real es **simulado** y que la geolocalización requiere permiso.
3. **Tributos (45 s).** Descargar PDF del cedulón, efectuar pago de prueba y descargar comprobante. Explicar que no hay movimiento bancario.
4. **Reclamos (50 s).** Crear uno con asunto/descripción y archivo de ejemplo, buscarlo y avanzar estado de demostración.
5. **Atención (25 s).** Mostrar teléfono y correo públicos y botón de compartir a WhatsApp sin atribuirle un número oficial.
6. **Alarmas (40 s).** Elegir zona Norte, activar una alarma ficticia y ver el nuevo aviso, sin interpretarlo como emergencia real.
7. **Estacionamiento (45 s).** Iniciar una sesión de prueba, mostrar cuenta regresiva, el botón de adelantar el vencimiento y extender tiempo.
8. **Avisos (30 s).** Mostrar filtros, preferencias por tipo/zona y la solicitud voluntaria de permisos de notificación local.

### Arquitectura, pruebas y límites (2 min)

"El cliente usa HTML/CSS/JavaScript y un Service Worker. El backend Node estándar expone endpoints HTTP con JSON. Los datos se guardan localmente y se pueden resetear. Ejecuté ocho pruebas automáticas de API, todas correctas. Las vistas se previsualizaron con Chromium y un stub de respuesta de API. No se probó una integración municipal real ni push remoto. Para producción faltarían autenticación, control de acceso, bases de datos, APIs oficiales, HTTPS y pruebas en dispositivos reales".

### Cierre / preguntas (1 min)

**¿Por qué no usar Android nativo?** Porque se pidió arquitectura no nativa y web móvil para múltiples dispositivos; la web reduce despliegues y facilita una demo multi-navegador.

**¿Por qué JavaScript sin un framework?** La cátedra admite herramientas del entorno web; para este prototipo pequeño se priorizó una SPA accesible y reproducible sin dependencias. Ionic sería candidato si el equipo ampliara la app y necesitara componentes y navegación más complejos.

**¿Esto funciona en tiempo real?** Los valores se actualizan en el servidor cada 25 s y el cliente consulta cada 20 s. Es tiempo real simulado, no streaming real de dispositivos.

**¿Cómo escalaría?** API con autenticación y autorización, base de datos, almacenamiento privado, proveedor de push y adaptadores a APIs municipales. Mantendría la separación entre presentación, reglas y datos.

**¿Cuál es el principal riesgo?** Confundir un servicio ficticio con uno real, especialmente en alertas y pagos. Por eso hay rótulos permanentes de simulación y los comprobantes no tienen validez.

**¿Cómo reiniciar?** `curl -X POST http://localhost:4173/api/demo/reset` y recargar la app.
