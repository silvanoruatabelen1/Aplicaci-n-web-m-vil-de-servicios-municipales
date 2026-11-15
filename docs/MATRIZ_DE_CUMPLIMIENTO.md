# Auditoría consigna → evidencia → ubicación

**Autor:** Silvano Ruata Maria Belen

| Requisito de la guía (págs. 5-8) | Evidencia en TP5 | Estado |
|---|---|---|
| App web móvil no nativa | `public/` SPA/PWA responsive | Implementado |
| Bicicletas: mapa, bicis y anclajes | Mapa SVG interactivo, `/api/bikes` | Simulado |
| Bicicletas: ubicación cercana | Geolocation API + Haversine, botón opcional | Implementado con puntos simulados |
| Bicicletas: reportar problema | Formulario y `/api/bikes/report` | Simulado |
| Tributos: consulta, cedulón, estado | `/api/taxes`, PDF descargable | Simulado |
| Tributos: pago seguro | Confirmación + pago ficticio, sin tarjetas | Parcial: sin pasarela real |
| Tributos: historial y vencimiento | Tabla, estado, recordatorios en bandeja | Simulado |
| Reclamos: formulario y adjuntos | `/api/claims`; hasta dos JPG/PNG/PDF | Implementado en servidor local |
| Reclamos: búsqueda y seguimiento | Filtro y avance de estado demo | Simulado |
| Atención: datos de contacto | Teléfonos y emails de fuente pública verificada | Implementado |
| Atención: llamada/correo/mensajería | `tel:`, `mailto:`, compartir a WhatsApp | Implementado; WhatsApp no es contacto municipal verificado |
| Alarmas: mapa y estados cambiantes | SVG + `/api/demo/alarm/toggle` | Simulado |
| Alarmas: alerta por proximidad/zona | Suscripción a zona y Notification API local | Parcial: por zona, sin push remoto |
| Parking: mapa, tarifa, horarios | SVG, `/api/bootstrap` | Simulado |
| Parking: pago, temporizador, extensión | `/api/parking/*`, contador, PDF | Simulado |
| Avisos: push, personalización, historial | Bandeja/filtros/permisos y SW | Parcial: solo notificación local en sesión |
| Compatibilidad móvil | CSS media queries; previsualizaciones Chromium | Parcial: faltan Safari y Firefox reales |
| Carga menor a 3 s | Arquitectura sin paquetes externos | No medido: pendiente de verificar |
| Seguridad y privacidad | Validación, CSP, sin datos reales, localhost | Adecuado para demo, no para producción |
| Usabilidad | Pantallas diferenciadas, feedback/estados, foco | Implementado; requiere evaluación con usuarios |
| Escalabilidad | Capas, API separada, posibilidad de adapters | Propuesta de arquitectura, no prueba de carga |
| Informe | `Informe_TP5.pdf` | Entregado |
| Repositorio de código | Git local + `TP5_Repositorio.bundle` y ZIP | Entregado offline; publicación remota pendiente |
| Demostración en clase | `docs/GUIA_DEMOSTRACION.md` + aplicación ejecutable | Preparada; exposición presencial pendiente |

**Criterios de evaluación:** arquitectura justificada (informe), funcionalidades cubiertas con alcance declarado (app), UI adaptable (CSS/capturas), pruebas documentadas (8 tests HTTP), agregado de valor (PWA offline shell, PDFs, filtros y geolocalización voluntaria).
