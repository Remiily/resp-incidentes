// Q&A Menu and Anexos Menu Functionality

// Q&A Data
const qaData = [
    {
        question: "¿Por qué es crítico tener un plan de gestión de incidentes para Cumplo?",
        answer: "Cumplo maneja información financiera y personal sensible de miles de usuarios. Un incidente de seguridad puede resultar en pérdidas de 800.000 CLP por hora de indisponibilidad, multas regulatorias de la CMF, pérdida de confianza de clientes, y potencial responsabilidad legal. Además, la Ley Fintech 21.521 exige planes robustos de ciberseguridad y notificación obligatoria de incidentes."
    },
    {
        question: "¿Cómo se determina la severidad de un incidente?",
        answer: "La severidad se clasifica en 4 niveles: Severity 1 (Crítico) - Pérdida masiva de datos, interrupción total, MTTR <2h; Severity 2 (Alto) - Pérdida de datos sensibles, interrupción parcial, MTTR <4h; Severity 3 (Medio) - Acceso no autorizado a sistemas no críticos, MTTR <8h; Severity 4 (Bajo) - Eventos menores, MTTR <24h. La clasificación considera impacto operacional, financiero, reputacional y regulatorio."
    },
    {
        question: "¿Qué evidencia mínima se debe preservar en un incidente?",
        answer: "Se debe preservar: 1) Logs y registros (Cloud Logs, Firewall logs, logs de autenticación IAM, logs de aplicación, logs de BD, logs de SIEM) - últimos 90 días; 2) Metadatos (timestamps UTC, IPs origen/destino, usuarios/cuentas, hashes SHA-256, User-Agents, sesiones/tokens); 3) Capturas y estados (screenshots, configuraciones IAM antes/después, estado de permisos). Todo con cadena de custodia documentada."
    },
    {
        question: "¿Cuál es el proceso de activación del Comité de Cibercrisis?",
        answer: "El Comité se activa cuando: Severidad Crítica confirmada, impacto en múltiples sistemas críticos, exposición masiva de datos (>10,000 registros), requisito regulatorio, impacto financiero >5M CLP, o interrupción >4 horas. El proceso: 1) CISO evalúa y recomienda, 2) CEO aprueba, 3) Notificación inmediata a miembros (máx. 15 min), 4) Primera reunión dentro de 30 minutos, 5) Establecimiento de cadencia (cada 2-4 horas)."
    },
    {
        question: "¿Qué tiempos de recuperación (RTO/RPO) se establecieron?",
        answer: "RTO (Recovery Time Objective): 4 horas para servicios críticos. RPO (Recovery Point Objective): 1 hora máximo de pérdida de datos. Prioridad de restauración: 1) Sitio Pagadores, 2) APIs de transacciones, 3) Portal de clientes. Backups: Incrementales cada hora, completos diarios, almacenados en S3 con versionado y cifrado AES-256, réplica en región diferente."
    },
    {
        question: "¿Cómo se comunica un incidente a los stakeholders?",
        answer: "Interna: Actualizaciones cada 2 horas vía Email + Slack #incident-response. Externa: Clientes - Email + Portal dentro de 4h; Reguladores (CMF) - Reporte formal dentro de 24h obligatorio; Medios - Comunicado oficial con aprobación del Comité. Mensajes clave: Reconocimiento del incidente, acciones tomadas, impacto potencial, medidas preventivas, canales de soporte."
    },
    {
        question: "¿Qué es un After Action Review (AAR) y cuándo se realiza?",
        answer: "El AAR es un proceso estructurado de análisis post-incidente que se realiza 2-5 días después de la resolución, para incidentes Severity 1-2. Participan: CSIRT completo, Comité de Crisis, stakeholders relevantes, facilitador neutral. Duración: 2-4 horas. Preguntas clave: ¿Qué funcionó bien? ¿Qué no funcionó? ¿Por qué? ¿Qué mejoraríamos? Salidas: Informe de lecciones aprendidas y plan de acción con quick wins y mejoras estructurales."
    },
    {
        question: "¿Qué mejoras continuas se han identificado?",
        answer: "Quick Wins (1-2 semanas): 2FA obligatorio en cuentas privilegiadas, actualizar firmas EDR/SIEM, reforzar políticas de contraseñas, simulacros phishing mensuales. Cambios Estructurales (1-6 meses): Implementar SOAR, Red Team trimestral, Bug Bounty program, arquitectura Zero Trust, SOC 24/7, certificación ISO 27001, alineación NIST Framework."
    },
    {
        question: "¿Qué regulaciones aplican a Cumplo?",
        answer: "Ley Fintech 21.521 (2023): Requiere controles robustos de ciberseguridad, gestión de riesgos, continuidad del negocio, notificación a CMF dentro de 24h. Ley 19.628: Protección de datos personales, notificación de brechas, derechos ARCO. CMF: Supervisión, normativas de seguridad, planes de continuidad, auditorías periódicas. Estándares: ISO 27001, NIST Cybersecurity Framework, PCI DSS (si aplica)."
    },
    {
        question: "¿Cuáles son los KPIs principales del plan?",
        answer: "MTTD (Mean Time To Detect): <1 hora objetivo. MTTR (Mean Time To Respond): <30 minutos. MTTC (Mean Time To Contain): <2 horas para Severity 1. MTTR (Mean Time To Recover): <4 horas para servicios críticos. SLAs: Detección <1h, Contención crítica <2h, Notificación interna <1h, Recuperación <4h, Reporte regulador <24h."
    },
    {
        question: "¿Qué herramientas y tecnologías se utilizan?",
        answer: "Monitoreo: SIEM (Splunk/ELK), EDR (CrowdStrike/SentinelOne), Cloud Logs (AWS CloudWatch, Google Cloud Logging). Forenses: Autopsy, FTK Imager, análisis de memoria. Orquestación: SOAR para automatización. Infraestructura: AWS, Google Cloud, backups en S3 con versionado. Comunicación: Slack, Email corporativo, Portal web."
    },
    {
        question: "¿Cómo se preserva la cadena de custodia de evidencia?",
        answer: "Cada transferencia de evidencia se documenta con timestamp y responsable. Almacenamiento seguro en S3 con versionado, acceso restringido (solo CSIRT y Legal), encriptación AES-256. Retención mínima de 7 años según regulaciones financieras chilenas. Integridad verificada con hashes SHA-256 de todos los artefactos. Acceso auditado y registrado."
    },
    {
        question: "¿Qué es el modelo de severidad y cómo se aplica?",
        answer: "El modelo de severidad clasifica incidentes en 4 niveles basados en impacto y urgencia. Severity 1 (Crítico): Pérdida masiva de datos, interrupción total, requiere respuesta inmediata <2h y activación del Comité de Crisis. Severity 2 (Alto): Datos sensibles comprometidos, interrupción parcial, respuesta <4h. Severity 3 (Medio): Acceso no autorizado a sistemas no críticos, respuesta <8h. Severity 4 (Bajo): Eventos menores, seguimiento rutinario <24h. La clasificación considera impacto operacional, financiero, reputacional, regulatorio y alcance de datos."
    },
    {
        question: "¿Cuál es la diferencia entre contención inmediata y erradicación?",
        answer: "Contención inmediata son acciones rápidas para detener la propagación del incidente (revocar credenciales, bloquear IPs, aislar sistemas) - objetivo <30 minutos. Erradicación es la eliminación completa de la amenaza del entorno (eliminar cuentas maliciosas, restaurar configuraciones, eliminar backdoors) - se realiza después de la contención y preservación de evidencia. La contención protege mientras se investiga; la erradicación elimina la causa raíz."
    },
    {
        question: "¿Qué información debe incluir el reporte a la CMF?",
        answer: "El reporte a la CMF debe incluir: 1) Descripción del incidente (tipo, alcance, sistemas afectados), 2) Timeline detallado (detección, contención, resolución), 3) Datos comprometidos (tipo, volumen, sensibilidad), 4) Impacto estimado (operacional, financiero, reputacional), 5) Medidas correctivas implementadas, 6) Medidas preventivas planificadas, 7) Estado actual del incidente, 8) Contactos del equipo de respuesta. Debe enviarse dentro de 24 horas en formato según Circular CMF."
    },
    {
        question: "¿Cómo se maneja la comunicación con clientes afectados?",
        answer: "La comunicación con clientes debe ser clara, transparente y oportuna. Se envía email + notificación en portal dentro de 4 horas. El mensaje incluye: reconocimiento del incidente, descripción breve del impacto, acciones tomadas para proteger sus datos, medidas preventivas implementadas, canales de soporte disponibles, y próximos pasos. Se evita información técnica excesiva pero se mantiene transparencia. El tono es profesional, empático y proactivo."
    },
    {
        question: "¿Qué es un IoC (Indicator of Compromise) y cómo se utiliza?",
        answer: "Un IoC es evidencia de actividad maliciosa en un sistema. Incluye: IPs maliciosas, dominios sospechosos, hashes de archivos maliciosos, patrones de comportamiento anómalo, cadenas de comando sospechosas. Se utilizan para: 1) Detección temprana de amenazas similares, 2) Búsqueda de actividad relacionada en logs, 3) Mejora de reglas SIEM/EDR, 4) Compartir con la comunidad de seguridad, 5) Documentación del incidente. Los IoCs se documentan durante el triage y se utilizan para mejorar la detección futura."
    },
    {
        question: "¿Cuál es el proceso de escalamiento de un incidente?",
        answer: "El escalamiento sigue niveles: Nivel 1 (Analista de Seguridad) - Severity 3-4, resolución estándar. Nivel 2 (Líder Técnico CSIRT) - Severity 2, requiere coordinación. Nivel 3 (CISO) - Severity 1, activación de recursos adicionales. Nivel 4 (Comité de Crisis) - Severity 1 con impacto masivo, decisiones estratégicas. Nivel 5 (Expertos Externos) - Incidentes complejos que requieren especialización. El escalamiento es automático según severidad o manual si el analista identifica necesidad de recursos adicionales."
    },
    {
        question: "¿Qué es SOAR y cómo mejora la respuesta a incidentes?",
        answer: "SOAR (Security Orchestration, Automation and Response) automatiza y orquesta tareas de respuesta. Mejora: 1) Reducción de tiempo de respuesta mediante automatización, 2) Consistencia en ejecución de playbooks, 3) Integración de herramientas (SIEM, EDR, ticketing), 4) Escalamiento automático según reglas, 5) Documentación automática de acciones. Permite ejecutar playbooks complejos con un solo click, integrando múltiples sistemas y reduciendo errores humanos. Es una mejora estructural planificada para Cumplo."
    },
    {
        question: "¿Cómo se valida que un incidente está completamente resuelto?",
        answer: "La validación incluye: 1) Servicios críticos operativos y validados funcionalmente, 2) Monitoreo estable sin anomalías por mínimo 24 horas, 3) Evidencia preservada y análisis forense iniciado, 4) Comunicación con stakeholders completada, 5) Reportes regulatorios enviados, 6) AAR programado dentro de 2-5 días, 7) Plan de acción de mejoras documentado, 8) Playbooks actualizados con lecciones aprendidas, 9) No hay indicadores de actividad maliciosa residual. Solo el CISO o Líder Técnico puede cerrar oficialmente un incidente Severity 1-2."
    },
    {
        question: "¿Qué es Zero Trust y por qué es importante para Cumplo?",
        answer: "Zero Trust es un modelo de seguridad que asume que ninguna entidad (usuario, dispositivo, red) es confiable por defecto. Requiere verificación continua. Para Cumplo es importante porque: 1) Protege contra compromiso de credenciales (como en el escenario base), 2) Limita el acceso lateral una vez comprometido un sistema, 3) Requiere autenticación multifactor constante, 4) Segmenta la red y aplica principio de menor privilegio, 5) Monitorea y valida continuamente. Es una mejora estructural planificada para prevenir incidentes similares al escenario base."
    },
    {
        question: "¿Cómo se calcula el impacto financiero de un incidente?",
        answer: "El impacto financiero incluye: 1) Costos directos (800K CLP/hora de indisponibilidad × horas de downtime), 2) Costos de respuesta (horas del equipo CSIRT, expertos externos, herramientas), 3) Multas regulatorias (hasta 1.000 UTM según Ley Fintech), 4) Costos legales (demandas, asesoría), 5) Pérdida de ingresos (transacciones no procesadas), 6) Costos de recuperación (restauración, validación), 7) Costos reputacionales (pérdida de clientes, pérdida de confianza). En el escenario base, un incidente de 4 horas costaría aproximadamente 3.2M CLP solo en downtime, más costos adicionales."
    },
    {
        question: "¿Qué es un playbook y en qué se diferencia de un procedimiento?",
        answer: "Un playbook es una guía detallada paso a paso para responder a un tipo específico de incidente. Incluye: detección, confirmación, contención, erradicación, recuperación y post-incidente. Un procedimiento es más genérico y describe procesos operativos. El playbook es específico (ej: 'Playbook: Compromiso de IAM'), incluye tiempos objetivos, herramientas específicas, comandos exactos, y validaciones. Los playbooks se actualizan después de cada incidente con lecciones aprendidas. Son ejecutables y validables, no solo documentación."
    },
    {
        question: "¿Cómo se maneja la comunicación durante un incidente activo?",
        answer: "Durante un incidente activo: Interna - Actualizaciones cada 2 horas vía Email + Slack #incident-response, stand-ups cada 2-4 horas según severidad, canal dedicado para CSIRT. Externa - Clientes: Email + Portal dentro de 4h con mensaje claro; Reguladores: Reporte formal dentro de 24h; Medios: Comunicado oficial con aprobación del Comité. Reglas: No especular, solo hechos confirmados, transparencia controlada, mensajes consistentes, un solo portavoz autorizado. La comunicación es gestionada por el Gerente de Comunicaciones con aprobación del Comité de Crisis."
    },
    {
        question: "¿Qué es MTTD, MTTR, MTTC y cómo se miden?",
        answer: "MTTD (Mean Time To Detect): Tiempo promedio desde que ocurre el incidente hasta que se detecta. Objetivo <1 hora. MTTR (Mean Time To Respond): Tiempo promedio desde detección hasta primera respuesta. Objetivo <30 minutos. MTTC (Mean Time To Contain): Tiempo promedio desde detección hasta contención completa. Objetivo <2 horas para Severity 1. MTTR también puede ser Mean Time To Recover: Tiempo hasta recuperación completa. Objetivo <4 horas. Se miden desde timestamps en logs y bitácora del incidente. Son KPIs críticos para evaluar la efectividad del plan."
    },
    {
        question: "¿Cuál es el resumen ejecutivo del plan de gestión de incidentes de Cumplo?",
        answer: "Cumplo ha desarrollado un plan integral de gestión de incidentes de seguridad que protege información financiera y personal sensible. El plan incluye: estructura organizacional (CSIRT y Comité de Crisis), procesos de triage y clasificación (4 niveles de severidad), playbooks operativos detallados, evidencia mínima y cadena de custodia, comunicación estructurada con stakeholders, cumplimiento regulatorio (Ley Fintech 21.521, CMF), y mejora continua. El objetivo es minimizar impacto (800K CLP/hora de downtime), cumplir con regulaciones, y mantener la confianza de clientes."
    },
    {
        question: "¿Qué es el triage de incidentes y cuáles son sus pasos?",
        answer: "El triage es el proceso de evaluación inicial y clasificación de un incidente. Pasos: 1) Detección - alerta SIEM, reporte o monitoreo proactivo, 2) Confirmación - validar que es un incidente real (no falso positivo), 3) Clasificación - asignar severidad (S1-S4) basado en impacto operacional, financiero, reputacional y regulatorio, 4) Asignación - asignar al equipo CSIRT apropiado según severidad, 5) Contención inmediata - acciones rápidas para detener propagación. El triage debe completarse en menos de 30 minutos para incidentes críticos."
    },
    {
        question: "¿Qué evidencia mínima se debe recolectar durante el triage?",
        answer: "Durante el triage se debe preservar: Logs (Cloud Logs, Firewall, IAM, aplicación, BD, SIEM - últimos 90 días), Metadatos (timestamps UTC, IPs origen/destino, usuarios/cuentas afectadas, hashes SHA-256 de archivos, User-Agents, sesiones/tokens activos), Capturas (screenshots de alertas, configuraciones IAM antes/después, estado de permisos). Todo debe documentarse con timestamp y responsable, iniciando la cadena de custodia inmediatamente."
    },
    {
        question: "¿Cuáles son los componentes clave de un playbook operativo?",
        answer: "Un playbook operativo incluye: 1) Detección - cómo identificar el incidente (alertas, síntomas, herramientas), 2) Confirmación - pasos para validar el incidente real, 3) Clasificación - criterios de severidad, 4) Contención inmediata - acciones rápidas (<30 min) para detener propagación, 5) Eradicación - eliminación completa de la amenaza, 6) Recuperación - restauración de servicios (RTO <4h, RPO <1h), 7) Post-incidente - AAR, lecciones aprendidas, actualización del playbook. Cada paso incluye actividades específicas, herramientas, tiempos objetivos y validaciones."
    },
    {
        question: "¿Qué debe incluir un checklist operativo de contención rápida?",
        answer: "Un checklist de contención rápida debe incluir: 1) Desconectar red de sistemas comprometidos, 2) Bloquear IPs maliciosas en WAF/Firewall, 3) Suspender cuentas de usuario/servicio comprometidas, 4) Rotar credenciales de APIs y bases de datos, 5) Forzar reseteo de contraseñas de usuarios afectados, 6) Deshabilitar accesos remotos no esenciales, 7) Aislar sistemas afectados, 8) Preservar evidencia antes de cambios. Cada item debe ser verificable, con responsable asignado y tiempo objetivo (<30 minutos total)."
    },
    {
        question: "¿Qué establece la Ley Fintech 21.521 sobre gestión de incidentes?",
        answer: "La Ley Fintech 21.521 (2023) establece: 1) Controles robustos de ciberseguridad obligatorios, 2) Gestión de riesgos operacionales y de seguridad, 3) Planes de continuidad del negocio, 4) Notificación obligatoria a la CMF dentro de 24 horas desde la detección del incidente, 5) Reportes formales con descripción, alcance, impacto y medidas correctivas, 6) Supervisión y auditorías periódicas por parte de la CMF, 7) Sanciones por incumplimiento (hasta 1.000 UTM). Aplica a todas las instituciones financieras tecnológicas en Chile."
    },
    {
        question: "¿Qué marcos y estándares aplican al plan de Cumplo?",
        answer: "Los marcos aplicables son: ISO/IEC 27001:2022 (gestión de seguridad de la información), NIST Cybersecurity Framework 2.0 (identificar, proteger, detectar, responder, recuperar), PCI DSS v4.0 (si procesa pagos con tarjetas), NIST SP 800-61 (guía de manejo de incidentes), SANS Incident Response Process, OWASP Incident Response Guide. Cumplo debe alinear su plan con estos estándares para certificación ISO 27001 y cumplimiento regulatorio."
    },
    {
        question: "¿Cuál es la estructura del Comité de Cibercrisis y sus responsabilidades?",
        answer: "El Comité incluye: Líder de Crisis (CEO) - decisiones estratégicas finales, aprobación comunicaciones externas; Coordinador IR (CISO) - coordinación técnica CSIRT, reportes de estado; Comunicaciones (Gerente Marketing/RR.PP.) - gestión de mensajes internos/externos; Legal - asesoría regulatoria, reportes a autoridades; Operaciones (CTO) - recursos técnicos, coordinación equipos. Se activa en Severity 1, impacto masivo, o requisito regulatorio. Primera reunión dentro de 30 minutos, cadencia cada 2-4 horas durante incidente activo."
    },
    {
        question: "¿Cómo se documenta y reporta un incidente según las regulaciones chilenas?",
        answer: "La documentación incluye: Bitácora del incidente (timeline detallado, acciones tomadas, responsables), Evidencia preservada (logs, metadatos, capturas con cadena de custodia), Análisis de impacto (operacional, financiero, reputacional, regulatorio), Medidas correctivas implementadas, Medidas preventivas planificadas. El reporte a CMF debe enviarse dentro de 24 horas en formato según Circular CMF, incluyendo: descripción, alcance, sistemas afectados, datos comprometidos, timeline, impacto estimado, medidas y estado actual."
    },
    {
        question: "¿Qué es la cadena de custodia y por qué es crítica?",
        answer: "La cadena de custodia es la documentación de cada transferencia de evidencia desde su recolección hasta su presentación. Debe incluir: timestamp de cada transferencia, responsable de cada paso, ubicación de almacenamiento, método de preservación, verificación de integridad (hashes SHA-256). Es crítica porque: 1) Asegura admisibilidad legal de evidencia, 2) Previene manipulación o contaminación, 3) Cumple requisitos regulatorios, 4) Permite trazabilidad completa, 5) Protege en caso de litigios. La cadena debe mantenerse intacta durante mínimo 7 años según regulaciones financieras."
    },
    {
        question: "¿Cuáles son los tiempos objetivos (SLAs) del plan de Cumplo?",
        answer: "SLAs establecidos: Detección <1 hora desde ocurrencia, Primera respuesta <30 minutos desde detección, Contención crítica <2 horas para Severity 1, Notificación interna <1 hora a stakeholders clave, Notificación externa clientes <4 horas, Reporte regulador CMF <24 horas obligatorio, Recuperación servicios críticos <4 horas (RTO), Pérdida máxima de datos <1 hora (RPO), AAR programado 2-5 días después de resolución. Estos tiempos se monitorean como KPIs y se reportan trimestralmente."
    },
    {
        question: "¿Qué herramientas de monitoreo y detección se utilizan?",
        answer: "Herramientas principales: SIEM (Splunk/ELK) - correlación de eventos, detección de anomalías, análisis de logs; EDR (CrowdStrike/SentinelOne) - detección y respuesta en endpoints, análisis de comportamiento; Cloud Logs (AWS CloudWatch, Google Cloud Logging) - monitoreo de infraestructura cloud; Firewall logs - análisis de tráfico de red; IAM logs - monitoreo de accesos y cambios de permisos. Todas integradas para detección temprana y respuesta automatizada cuando sea posible."
    },
    {
        question: "¿Cómo se clasifica la severidad de un incidente?",
        answer: "La severidad se clasifica considerando: Impacto operacional (disponibilidad de servicios críticos), Impacto financiero (costos directos e indirectos, multas), Impacto reputacional (confianza de clientes, exposición mediática), Impacto regulatorio (cumplimiento normativo, sanciones), Alcance de datos (volumen y sensibilidad de datos afectados). Severity 1 (Crítico): Pérdida masiva, interrupción total, MTTR <2h. Severity 2 (Alto): Datos sensibles, interrupción parcial, MTTR <4h. Severity 3 (Medio): Acceso no autorizado no crítico, MTTR <8h. Severity 4 (Bajo): Eventos menores, MTTR <24h."
    },
    {
        question: "¿Qué es un After Action Review (AAR) y qué resultados genera?",
        answer: "El AAR es un proceso estructurado de análisis post-incidente realizado 2-5 días después de la resolución (para Severity 1-2). Participan: CSIRT completo, Comité de Crisis, stakeholders relevantes, facilitador neutral. Duración: 2-4 horas. Preguntas clave: ¿Qué funcionó bien? ¿Qué no funcionó? ¿Por qué ocurrió? ¿Qué mejoraríamos? Resultados: Informe de lecciones aprendidas, Plan de acción con quick wins (1-2 semanas) y mejoras estructurales (1-6 meses), Actualización de playbooks y procedimientos, Recomendaciones de capacitación."
    }
];

// Anexos Data
const anexosData = [
    {
        title: "Anexo A: Matriz RACI Detallada",
        content: `
            <h3>Responsabilidades por Fase del Incidente</h3>
            <p><strong>Detección:</strong> Analista de Seguridad (R), CISO (A), SIEM (C), Legal (I)</p>
            <p><strong>Contención:</strong> Ingeniero de Red (R), Líder Técnico (A), CISO (C), CEO (I)</p>
            <p><strong>Eradicación:</strong> Desarrolladores (R), Arquitecto de Seguridad (A), CISO (C), Legal (I)</p>
            <p><strong>Recuperación:</strong> Ingenieros de Operaciones (R), CTO (A), CISO (C), CEO (I)</p>
            <p><strong>Comunicación:</strong> Gerente de Comunicaciones (R), CEO (A), Legal (C), CSIRT (I)</p>
            <p><strong>Reporte Regulatorio:</strong> Legal/Compliance (R), CEO (A), CISO (C), CSIRT (I)</p>
            <p><em>R = Responsible, A = Accountable, C = Consulted, I = Informed</em></p>
        `
    },
    {
        title: "Anexo B: Plantillas de Comunicación",
        content: `
            <h3>Plantilla para Clientes</h3>
            <p><strong>Asunto:</strong> Comunicado Importante - [Tipo de Incidente]</p>
            <p>Estimado/a [Nombre],</p>
            <p>Le informamos que hemos detectado y contenido un incidente de seguridad. [Descripción breve del impacto]. Hemos tomado medidas inmediatas para proteger su información y restaurar los servicios.</p>
            <p>Si requiere asistencia, contáctenos en [canal de soporte].</p>
            <p>Atentamente,<br>Equipo de Cumplo</p>
            
            <h3>Plantilla para CMF</h3>
            <p>Formato formal según Circular CMF, incluyendo: Alcance del incidente, sistemas afectados, datos comprometidos, medidas correctivas implementadas, timeline del incidente, impacto estimado.</p>
        `
    },
    {
        title: "Anexo C: Procedimientos de Escalamiento",
        content: `
            <h3>Niveles de Escalamiento</h3>
            <p><strong>Nivel 1 - Analista de Seguridad:</strong> Incidentes Severity 3-4, resolución estándar</p>
            <p><strong>Nivel 2 - Líder Técnico CSIRT:</strong> Severity 2, requiere coordinación de recursos</p>
            <p><strong>Nivel 3 - CISO:</strong> Severity 1, activación de recursos adicionales</p>
            <p><strong>Nivel 4 - Comité de Crisis:</strong> Severity 1 con impacto masivo, decisiones estratégicas</p>
            <p><strong>Nivel 5 - Expertos Externos:</strong> Incidentes complejos que requieren especialización adicional</p>
        `
    },
    {
        title: "Anexo D: Herramientas y Contactos de Emergencia",
        content: `
            <h3>Contactos Internos</h3>
            <p><strong>CISO:</strong> [Teléfono] | [Email]</p>
            <p><strong>CTO:</strong> [Teléfono] | [Email]</p>
            <p><strong>Legal:</strong> [Teléfono] | [Email]</p>
            <p><strong>Comunicaciones:</strong> [Teléfono] | [Email]</p>
            
            <h3>Contactos Externos</h3>
            <p><strong>CMF:</strong> [Teléfono] | [Email]</p>
            <p><strong>CSIRT Nacional:</strong> [Teléfono] | [Email]</p>
            <p><strong>AWS Support:</strong> [Teléfono] | [Portal]</p>
            <p><strong>Google Cloud Support:</strong> [Teléfono] | [Portal]</p>
            <p><strong>Forenses Externos:</strong> [Empresa] | [Teléfono]</p>
        `
    },
    {
        title: "Anexo E: Glosario de Términos",
        content: `
            <h3>Términos Técnicos</h3>
            <p><strong>IAM:</strong> Identity and Access Management - Gestión de identidades y accesos</p>
            <p><strong>SIEM:</strong> Security Information and Event Management - Sistema de gestión de eventos de seguridad</p>
            <p><strong>EDR:</strong> Endpoint Detection and Response - Detección y respuesta en endpoints</p>
            <p><strong>SOAR:</strong> Security Orchestration, Automation and Response - Orquestación y automatización de seguridad</p>
            <p><strong>RTO:</strong> Recovery Time Objective - Tiempo objetivo de recuperación</p>
            <p><strong>RPO:</strong> Recovery Point Objective - Punto objetivo de recuperación</p>
            <p><strong>MTTD:</strong> Mean Time To Detect - Tiempo promedio de detección</p>
            <p><strong>MTTR:</strong> Mean Time To Respond/Recover - Tiempo promedio de respuesta/recuperación</p>
            <p><strong>MTTC:</strong> Mean Time To Contain - Tiempo promedio de contención</p>
            <p><strong>IoCs:</strong> Indicators of Compromise - Indicadores de compromiso</p>
        `
    },
    {
        title: "Anexo F: Casos de Estudio de Incidentes",
        content: `
            <h3>Ejemplo 1: Compromiso de IAM (Similar al Escenario Base)</h3>
            <p><strong>Detección:</strong> Alertas de SIEM por creación de cuentas fuera de horario</p>
            <p><strong>Contención:</strong> Revocación de credenciales en 25 minutos</p>
            <p><strong>Lecciones:</strong> Necesidad de 2FA obligatorio, mejor monitoreo de cambios IAM</p>
            
            <h3>Ejemplo 2: Ataque DDoS</h3>
            <p><strong>Detección:</strong> Degradación de servicios detectada por monitoreo</p>
            <p><strong>Contención:</strong> Activación de WAF y bloqueo de IPs en 15 minutos</p>
            <p><strong>Lecciones:</strong> Mejora en capacidad de mitigación DDoS, redundancia de servidores</p>
        `
    },
    {
        title: "Anexo G: Checklist de Validación Post-Incidente",
        content: `
            <h3>Validación de Recuperación</h3>
            <ul>
                <li>✓ Servicios críticos operativos y validados</li>
                <li>✓ Monitoreo estable sin anomalías por 24 horas</li>
                <li>✓ Evidencia preservada y análisis forense iniciado</li>
                <li>✓ Comunicación con stakeholders completada</li>
                <li>✓ Reportes regulatorios enviados</li>
                <li>✓ AAR programado dentro de 2-5 días</li>
                <li>✓ Plan de acción de mejoras documentado</li>
                <li>✓ Actualización de playbooks realizada</li>
            </ul>
        `
    },
    {
        title: "Anexo H: Referencias y Bibliografía",
        content: `
            <h3>Normativas y Estándares</h3>
            <ul>
                <li>Ley Fintech 21.521 (2023) - Chile</li>
                <li>Ley 19.628 - Protección de Datos Personales - Chile</li>
                <li>ISO/IEC 27001:2022 - Information Security Management</li>
                <li>NIST Cybersecurity Framework 2.0</li>
                <li>PCI DSS v4.0 - Payment Card Industry Data Security Standard</li>
            </ul>
            
            <h3>Guías y Mejores Prácticas</h3>
            <ul>
                <li>NIST SP 800-61 - Computer Security Incident Handling Guide</li>
                <li>SANS Incident Response Process</li>
                <li>OWASP Incident Response Guide</li>
                <li>CMF Circular sobre Ciberseguridad</li>
            </ul>
        `
    },
    {
        title: "Anexo I: Gobernanza y Roles del CSIRT",
        content: `
            <h3>Comité de Crisis</h3>
            <p><strong>Líder de Crisis (CEO/Gerente General):</strong> Decisiones estratégicas finales, aprobación de comunicaciones externas, asignación de recursos</p>
            <p><strong>Coordinador de IR (CISO/Gerente de Seguridad):</strong> Coordinación técnica del CSIRT, reportes de estado, decisiones operacionales</p>
            <p><strong>Comunicaciones (Gerente de Marketing/RR.PP.):</strong> Gestión de mensajes internos y externos, relación con medios, transparencia controlada</p>
            <p><strong>Legal (Asesor Legal Interno/Externo):</strong> Asesoría regulatoria, reportes a autoridades, gestión de responsabilidades legales</p>
            <p><strong>Operaciones (CTO/Gerente de Operaciones):</strong> Recursos técnicos, coordinación de equipos, impacto en procesos de negocio</p>
            
            <h3>Equipo CSIRT</h3>
            <p><strong>Líder Técnico:</strong> Coordinación técnica, decisiones de contención y erradicación</p>
            <p><strong>Analistas de Seguridad:</strong> Monitoreo SIEM, análisis de logs, identificación de IoCs</p>
            <p><strong>Ingenieros de Red:</strong> Contención de red, bloqueo de IPs, aislamiento de sistemas</p>
            <p><strong>Desarrolladores:</strong> Parches de seguridad, mitigación de vulnerabilidades</p>
            <p><strong>Forenses Digitales:</strong> Recolección de evidencia, análisis forense, cadena de custodia</p>
        `
    },
    {
        title: "Anexo J: Priorización y Clasificación de Incidentes",
        content: `
            <h3>Modelo de Severidad</h3>
            <p><strong>Severity 1 (Crítico):</strong> Pérdida masiva de datos, interrupción total, MTTR <2h, activación inmediata de Comité de Crisis</p>
            <p><strong>Severity 2 (Alto):</strong> Pérdida de datos sensibles, interrupción parcial, MTTR <4h, notificación a CISO</p>
            <p><strong>Severity 3 (Medio):</strong> Acceso no autorizado a sistemas no críticos, MTTR <8h, resolución estándar</p>
            <p><strong>Severity 4 (Bajo):</strong> Eventos menores, MTTR <24h, seguimiento rutinario</p>
            
            <h3>Criterios de Clasificación</h3>
            <ul>
                <li>Impacto operacional (disponibilidad de servicios)</li>
                <li>Impacto financiero (costos directos e indirectos)</li>
                <li>Impacto reputacional (confianza de clientes)</li>
                <li>Impacto regulatorio (cumplimiento normativo)</li>
                <li>Alcance de datos afectados (volumen y sensibilidad)</li>
            </ul>
        `
    },
    {
        title: "Anexo K: Comunicación y Stakeholders",
        content: `
            <h3>Canales de Comunicación Interna</h3>
            <p><strong>Email Corporativo:</strong> Actualizaciones formales cada 2 horas durante incidente activo</p>
            <p><strong>Slack #incident-response:</strong> Canal dedicado para comunicación en tiempo real</p>
            <p><strong>Reuniones:</strong> Stand-ups cada 2-4 horas según severidad</p>
            
            <h3>Comunicación Externa</h3>
            <p><strong>Clientes:</strong> Email + Portal web dentro de 4 horas, mensaje claro sobre impacto y medidas</p>
            <p><strong>Reguladores (CMF):</strong> Reporte formal dentro de 24 horas obligatorio, formato según Circular CMF</p>
            <p><strong>Medios:</strong> Comunicado oficial con aprobación del Comité de Crisis, transparencia controlada</p>
            
            <h3>Stakeholders Clave</h3>
            <ul>
                <li>Equipo Ejecutivo (CEO, CTO, CISO)</li>
                <li>Comité de Crisis</li>
                <li>CSIRT completo</li>
                <li>Departamento Legal y Compliance</li>
                <li>Comunicaciones y RR.PP.</li>
                <li>Atención al Cliente</li>
                <li>Proveedores críticos (AWS, Google Cloud)</li>
            </ul>
        `
    },
    {
        title: "Anexo L: Gestión de Crisis y Continuidad",
        content: `
            <h3>Activación del Comité de Cibercrisis</h3>
            <p><strong>Criterios de Activación:</strong></p>
            <ul>
                <li>Severidad Crítica confirmada</li>
                <li>Impacto en múltiples sistemas críticos</li>
                <li>Exposición masiva de datos (>10,000 registros)</li>
                <li>Requisito regulatorio</li>
                <li>Impacto financiero >5M CLP</li>
                <li>Interrupción >4 horas</li>
            </ul>
            
            <h3>Plan de Continuidad del Negocio (BCP)</h3>
            <p><strong>RTO (Recovery Time Objective):</strong> 4 horas para servicios críticos</p>
            <p><strong>RPO (Recovery Point Objective):</strong> 1 hora máximo de pérdida de datos</p>
            <p><strong>Prioridad de Restauración:</strong> 1) Sitio Pagadores, 2) APIs de transacciones, 3) Portal de clientes</p>
            
            <h3>Plan de Recuperación ante Desastres (DRP)</h3>
            <p><strong>Backups:</strong> Incrementales cada hora, completos diarios, almacenados en S3 con versionado y cifrado AES-256, réplica en región diferente</p>
            <p><strong>Validación:</strong> Pruebas de restauración mensuales, documentación de resultados</p>
        `
    },
    {
        title: "Anexo M: Métricas, KPIs y SLAs",
        content: `
            <h3>Métricas Clave</h3>
            <p><strong>MTTD (Mean Time To Detect):</strong> <1 hora objetivo</p>
            <p><strong>MTTR (Mean Time To Respond):</strong> <30 minutos</p>
            <p><strong>MTTC (Mean Time To Contain):</strong> <2 horas para Severity 1</p>
            <p><strong>MTTR (Mean Time To Recover):</strong> <4 horas para servicios críticos</p>
            
            <h3>SLAs Establecidos</h3>
            <ul>
                <li>Detección: <1 hora</li>
                <li>Contención crítica: <2 horas</li>
                <li>Notificación interna: <1 hora</li>
                <li>Recuperación: <4 horas</li>
                <li>Reporte regulador: <24 horas</li>
            </ul>
            
            <h3>KPIs de Efectividad</h3>
            <ul>
                <li>Tasa de detección (incidentes detectados vs totales)</li>
                <li>Efectividad de contención (incidentes contenidos exitosamente)</li>
                <li>Tiempo promedio de resolución por severidad</li>
                <li>Número de incidentes por mes/trimestre</li>
                <li>Satisfacción de stakeholders post-incidente</li>
            </ul>
        `
    },
    {
        title: "Anexo N: After Action Review (AAR)",
        content: `
            <h3>Proceso de AAR</h3>
            <p><strong>Cuándo:</strong> 2-5 días después de la resolución del incidente (Severity 1-2)</p>
            <p><strong>Participantes:</strong> CSIRT completo, Comité de Crisis, stakeholders relevantes, facilitador neutral</p>
            <p><strong>Duración:</strong> 2-4 horas</p>
            
            <h3>Preguntas Clave del AAR</h3>
            <ul>
                <li>¿Qué funcionó bien?</li>
                <li>¿Qué no funcionó?</li>
                <li>¿Por qué ocurrió el incidente?</li>
                <li>¿Qué mejoraríamos?</li>
                <li>¿Qué lecciones aprendimos?</li>
            </ul>
            
            <h3>Salidas del AAR</h3>
            <ul>
                <li>Informe de lecciones aprendidas</li>
                <li>Plan de acción con quick wins (1-2 semanas)</li>
                <li>Mejoras estructurales (1-6 meses)</li>
                <li>Actualización de playbooks y procedimientos</li>
                <li>Recomendaciones de capacitación</li>
            </ul>
        `
    },
    {
        title: "Anexo O: Mejoras Continuas y Backlog",
        content: `
            <h3>Quick Wins (1-2 semanas)</h3>
            <ul>
                <li>2FA obligatorio en cuentas privilegiadas</li>
                <li>Actualizar firmas EDR/SIEM</li>
                <li>Reforzar políticas de contraseñas</li>
                <li>Simulacros phishing mensuales</li>
                <li>Mejorar documentación de playbooks</li>
            </ul>
            
            <h3>Cambios Estructurales (1-6 meses)</h3>
            <ul>
                <li>Implementar SOAR (Security Orchestration, Automation and Response)</li>
                <li>Red Team trimestral</li>
                <li>Bug Bounty program</li>
                <li>Arquitectura Zero Trust</li>
                <li>SOC 24/7</li>
                <li>Certificación ISO 27001</li>
                <li>Alineación NIST Framework</li>
            </ul>
            
            <h3>Seguimiento</h3>
            <p><strong>Revisión Mensual:</strong> Progreso de mejoras, actualización de backlog</p>
            <p><strong>Revisión Trimestral:</strong> Evaluación de efectividad, ajuste de prioridades</p>
            <p><strong>Revisión Anual:</strong> Actualización completa del plan, validación de objetivos</p>
        `
    }
];

// ============================================
// Q&A MENU - SIMPLIFIED AND ROBUST VERSION
// ============================================

let qaContentElement = null;
let qaContentGenerated = false;

function initializeQAMenu() {
    const qaToggle = document.getElementById('qaToggle');
    const qaMenu = document.getElementById('qaMenu');
    const closeQA = document.getElementById('closeQA');
    qaContentElement = document.getElementById('qaContent');
    
    if (!qaToggle || !qaMenu || !qaContentElement) {
        console.error('Q&A menu elements not found');
        return;
    }
    
    // Toggle answer function
    function toggleAnswer(index) {
        if (!qaContentElement) {
            console.error('qaContentElement is null');
            return;
        }
        
        const item = qaContentElement.querySelector(`.qa-item[data-qa-index="${index}"]`);
        const answer = document.getElementById(`qa-answer-${index}`);
        const question = qaContentElement.querySelector(`.qa-question[data-qa-index="${index}"]`);
        const arrow = question ? question.querySelector('.qa-arrow') : null;
        
        if (!answer || !item || !question) {
            console.error('Elements not found for index:', index);
            return;
        }
        
        const isActive = item.classList.contains('active');
        console.log('Toggling answer', index, 'isActive:', isActive);
        
        // Close all items
        qaContentElement.querySelectorAll('.qa-item').forEach(i => {
            i.classList.remove('active');
        });
        qaContentElement.querySelectorAll('.qa-answer').forEach(a => {
            a.classList.remove('expanded');
        });
        qaContentElement.querySelectorAll('.qa-arrow').forEach(a => {
            a.textContent = '▼';
            a.style.transform = 'rotate(0deg)';
        });
        
        // Toggle current
        if (!isActive) {
            item.classList.add('active');
            answer.classList.add('expanded');
            console.log('Added active and expanded classes to item', index);
            if (arrow) {
                arrow.textContent = '▲';
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    // Generate content function
    function generateQAContent() {
        if (qaContentGenerated || !qaContentElement) return;
        
        qaContentElement.innerHTML = qaData.map((qa, index) => `
            <div class="qa-item" data-qa-index="${index}">
                <div class="qa-question" data-qa-index="${index}">
                    <span class="qa-number">${index + 1}</span>
                    <span class="qa-text">${qa.question}</span>
                    <span class="qa-arrow">▼</span>
                </div>
                <div class="qa-answer" id="qa-answer-${index}">
                    <p>${qa.answer}</p>
                </div>
            </div>
        `).join('');
        
        qaContentGenerated = true;
        console.log('Q&A content generated, items:', qaContentElement.querySelectorAll('.qa-item').length);
        
        // Add event listener AFTER content is generated
        // Remove any existing listener first
        const newQaContent = qaContentElement.cloneNode(true);
        qaContentElement.parentNode.replaceChild(newQaContent, qaContentElement);
        qaContentElement = newQaContent;
        
        // Add click handler to each question directly
        qaContentElement.querySelectorAll('.qa-question').forEach((question) => {
            const index = parseInt(question.getAttribute('data-qa-index'));
            question.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Question clicked:', index);
                toggleAnswer(index);
            });
            
            // Also make child elements clickable
            question.querySelectorAll('*').forEach(child => {
                child.style.pointerEvents = 'none';
            });
            question.style.cursor = 'pointer';
            question.style.pointerEvents = 'auto';
        });
        
        // Also add delegation on the container as backup
        qaContentElement.addEventListener('click', function(e) {
            const question = e.target.closest('.qa-question');
            const item = e.target.closest('.qa-item');
            
            if (question || item) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = question 
                    ? parseInt(question.getAttribute('data-qa-index'))
                    : item 
                        ? parseInt(item.getAttribute('data-qa-index'))
                        : null;
                
                if (index !== null && !isNaN(index)) {
                    console.log('Delegation handler triggered for index:', index);
                    toggleAnswer(index);
                }
            }
        });
    }
    
    // Toggle menu functions
    function openQAMenu() {
        if (!qaMenu) return;
        qaMenu.classList.add('expanded');
        if (!qaContentGenerated) {
            generateQAContent();
        }
    }
    
    function closeQAMenu() {
        if (qaMenu) {
            qaMenu.classList.remove('expanded');
        }
    }
    
    // Toggle button
    if (qaToggle) {
        qaToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (qaMenu.classList.contains('expanded')) {
                closeQAMenu();
            } else {
                openQAMenu();
            }
        });
    }
    
    // Close button
    if (closeQA) {
        closeQA.addEventListener('click', function(e) {
            e.stopPropagation();
            closeQAMenu();
        });
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (qaMenu && qaMenu.classList.contains('expanded')) {
            if (!qaMenu.contains(e.target) && e.target !== qaToggle) {
                closeQAMenu();
            }
        }
    });
}

// ============================================
// ANEXOS MENU - SIMPLIFIED AND ROBUST VERSION
// ============================================

let anexosContentElement = null;
let anexosContentGenerated = false;

function initializeAnexosMenu() {
    const anexosToggle = document.getElementById('anexosToggle');
    const anexosMenu = document.getElementById('anexosMenu');
    const closeAnexos = document.getElementById('closeAnexos');
    anexosContentElement = document.getElementById('anexosContent');
    
    if (!anexosToggle || !anexosMenu || !anexosContentElement) {
        console.error('Anexos menu elements not found');
        return;
    }
    
    // Toggle content function
    function toggleContent(index) {
        if (!anexosContentElement) {
            console.error('anexosContentElement is null');
            return;
        }
        
        const item = anexosContentElement.querySelector(`.anexo-item[data-anexo-index="${index}"]`);
        const content = document.getElementById(`anexo-content-${index}`);
        const title = anexosContentElement.querySelector(`.anexo-title[data-anexo-index="${index}"]`);
        const arrow = title ? title.querySelector('.anexo-arrow') : null;
        
        if (!content || !item || !title) {
            console.error('Elements not found for index:', index);
            return;
        }
        
        const isActive = item.classList.contains('active');
        console.log('Toggling anexo', index, 'isActive:', isActive);
        
        // Close all items
        anexosContentElement.querySelectorAll('.anexo-item').forEach(i => {
            i.classList.remove('active');
        });
        anexosContentElement.querySelectorAll('.anexo-content').forEach(c => {
            c.classList.remove('expanded');
        });
        anexosContentElement.querySelectorAll('.anexo-arrow').forEach(a => {
            a.textContent = '▼';
            a.style.transform = 'rotate(0deg)';
        });
        
        // Toggle current
        if (!isActive) {
            item.classList.add('active');
            content.classList.add('expanded');
            console.log('Added active and expanded classes to anexo item', index);
            if (arrow) {
                arrow.textContent = '▲';
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    // Generate content function
    function generateAnexosContent() {
        if (anexosContentGenerated || !anexosContentElement) return;
        
        anexosContentElement.innerHTML = anexosData.map((anexo, index) => `
            <div class="anexo-item" data-anexo-index="${index}">
                <div class="anexo-title" data-anexo-index="${index}">
                    <span class="anexo-icon">📄</span>
                    <span class="anexo-text">${anexo.title}</span>
                    <span class="anexo-arrow">▼</span>
                </div>
                <div class="anexo-content" id="anexo-content-${index}">
                    ${anexo.content}
                </div>
            </div>
        `).join('');
        
        anexosContentGenerated = true;
        console.log('Anexos content generated, items:', anexosContentElement.querySelectorAll('.anexo-item').length);
        
        // Add event listener AFTER content is generated
        // Remove any existing listener first
        const newAnexosContent = anexosContentElement.cloneNode(true);
        anexosContentElement.parentNode.replaceChild(newAnexosContent, anexosContentElement);
        anexosContentElement = newAnexosContent;
        
        // Add click handler to each title directly
        anexosContentElement.querySelectorAll('.anexo-title').forEach((title) => {
            const index = parseInt(title.getAttribute('data-anexo-index'));
            title.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Anexo title clicked:', index);
                toggleContent(index);
            });
            
            // Also make child elements clickable
            title.querySelectorAll('*').forEach(child => {
                child.style.pointerEvents = 'none';
            });
            title.style.cursor = 'pointer';
            title.style.pointerEvents = 'auto';
        });
        
        // Also add delegation on the container as backup
        anexosContentElement.addEventListener('click', function(e) {
            const title = e.target.closest('.anexo-title');
            const item = e.target.closest('.anexo-item');
            
            if (title || item) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = title 
                    ? parseInt(title.getAttribute('data-anexo-index'))
                    : item 
                        ? parseInt(item.getAttribute('data-anexo-index'))
                        : null;
                
                if (index !== null && !isNaN(index)) {
                    console.log('Delegation handler triggered for anexo index:', index);
                    toggleContent(index);
                }
            }
        });
    }
    
    // Toggle menu functions
    function openAnexosMenu() {
        if (!anexosMenu) return;
        anexosMenu.classList.add('expanded');
        if (!anexosContentGenerated) {
            generateAnexosContent();
        }
    }
    
    function closeAnexosMenu() {
        if (anexosMenu) {
            anexosMenu.classList.remove('expanded');
        }
    }
    
    // Toggle button
    if (anexosToggle) {
        anexosToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (anexosMenu.classList.contains('expanded')) {
                closeAnexosMenu();
            } else {
                openAnexosMenu();
            }
        });
    }
    
    // Close button
    if (closeAnexos) {
        closeAnexos.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAnexosMenu();
        });
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (anexosMenu && anexosMenu.classList.contains('expanded')) {
            if (!anexosMenu.contains(e.target) && e.target !== anexosToggle) {
                closeAnexosMenu();
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            initializeQAMenu();
            initializeAnexosMenu();
        }, 100);
    });
} else {
    // DOM already loaded
    setTimeout(function() {
        initializeQAMenu();
        initializeAnexosMenu();
    }, 100);
}
