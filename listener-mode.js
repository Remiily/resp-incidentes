// Modo Oyente/Observador - Vista Resumen, Modo Estudio, Descarga de Materiales

let listenerMode = {
    active: false,
    bookmarks: []
};

// Initialize Listener Mode
function initializeListenerMode() {
    createListenerPanel();
    loadBookmarks();
    
    // Keyboard shortcut: L for listener mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            toggleListenerMode();
        }
    });
}

// Create Listener Panel
function createListenerPanel() {
    const panel = document.createElement('div');
    panel.id = 'listenerPanel';
    panel.className = 'listener-panel';
    panel.innerHTML = `
        <div class="listener-header">
            <h3>Modo Oyente</h3>
            <button id="closeListener" class="close-listener">×</button>
        </div>
        <div class="listener-content">
            <div class="listener-tabs">
                <button class="tab-btn active" data-tab="summary">Resumen</button>
                <button class="tab-btn" data-tab="study">Estudio</button>
                <button class="tab-btn" data-tab="downloads">Descargas</button>
                <button class="tab-btn" data-tab="bookmarks">Marcadores</button>
            </div>
            
            <div class="tab-content active" id="tab-summary">
                <div class="summary-view" id="summaryView"></div>
            </div>
            
            <div class="tab-content" id="tab-study">
                <div class="study-mode">
                    <h4>Tarjetas de Estudio</h4>
                    <div class="study-controls">
                        <button id="shuffleCards" class="btn-study-small">🔀 Mezclar</button>
                        <button id="resetCards" class="btn-study-small">↻ Reiniciar</button>
                        <span id="cardProgress" class="card-progress">0/0</span>
                    </div>
                    <div id="studyCards" class="study-cards"></div>
                    <div class="study-actions">
                        <button id="startQuiz" class="btn-study">Iniciar Quiz</button>
                        <button id="exportCards" class="btn-study">📥 Exportar Tarjetas</button>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="tab-downloads">
                <div class="downloads-section">
                    <h4>Materiales Descargables</h4>
                    <div class="download-list">
                        <button class="download-btn" data-type="pdf">📄 Descargar Presentación (PDF)</button>
                        <button class="download-btn" data-type="checklist">✅ Checklists Operativos</button>
                        <button class="download-btn" data-type="playbooks">📋 Playbooks Imprimibles</button>
                        <button class="download-btn" data-type="summary">📝 Resumen Ejecutivo</button>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="tab-bookmarks">
                <div class="bookmarks-section">
                    <h4>Mis Marcadores</h4>
                    <div id="bookmarksList" class="bookmarks-list"></div>
                    <button id="addBookmark" class="btn-bookmark">+ Agregar Marcador</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    // Event listeners
    document.getElementById('closeListener').addEventListener('click', () => {
        toggleListenerMode();
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Downloads
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleDownload(btn.dataset.type);
        });
    });
    
    // Bookmarks
    document.getElementById('addBookmark').addEventListener('click', addBookmark);
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    
    // Study mode controls
    const shuffleBtn = document.getElementById('shuffleCards');
    const resetBtn = document.getElementById('resetCards');
    const exportBtn = document.getElementById('exportCards');
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleStudyCards);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetStudyCards);
    }
    if (exportBtn) {
        exportBtn.addEventListener('click', exportStudyCards);
    }
    
    // Generate summary on open
    generateSummary();
    generateStudyCards();
}

// Toggle Listener Mode
function toggleListenerMode() {
    listenerMode.active = !listenerMode.active;
    const panel = document.getElementById('listenerPanel');
    panel.classList.toggle('active', listenerMode.active);
    
    if (listenerMode.active) {
        generateSummary();
        updateBookmarksList();
    }
}

// Switch Tab
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
}

// Generate Summary View
function generateSummary() {
    const summaryView = document.getElementById('summaryView');
    const slides = document.querySelectorAll('.slide');
    
    const summary = Array.from(slides).map(slide => {
        const slideNum = slide.dataset.slide;
        const title = slide.querySelector('.slide-title')?.textContent || `Slide ${slideNum}`;
        const keyContent = extractKeyContent(slide);
        
        return {
            slideNum,
            title,
            keyContent
        };
    });
    
    summaryView.innerHTML = summary.map(item => `
        <div class="summary-item" data-slide="${item.slideNum}">
            <h4>Slide ${item.slideNum}: ${item.title}</h4>
            <ul>
                ${item.keyContent.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <button class="btn-goto-slide" data-slide="${item.slideNum}">Ir a esta slide</button>
        </div>
    `).join('');
    
    // Add click handlers
    summaryView.querySelectorAll('.btn-goto-slide').forEach(btn => {
        btn.addEventListener('click', () => {
            const slideNum = parseInt(btn.dataset.slide);
            if (typeof goToSlide === 'function') {
                goToSlide(slideNum);
            }
        });
    });
}

// Extract Key Content from Slide
function extractKeyContent(slide) {
    const points = [];
    const headings = slide.querySelectorAll('h3, h4');
    const listItems = slide.querySelectorAll('li');
    
    headings.forEach(heading => {
        const text = heading.textContent.trim();
        if (text && text.length < 150) {
            points.push(text);
        }
    });
    
    // Add first few list items
    listItems.forEach((item, index) => {
        if (index < 3) {
            const text = item.textContent.trim();
            if (text && text.length < 100) {
                points.push(text);
            }
        }
    });
    
    return points.slice(0, 5);
}

// Generate Study Cards
function generateStudyCards() {
    const studyCards = document.getElementById('studyCards');
    const cards = [
        {
            question: "¿Cuál es el costo por hora de indisponibilidad en Cumplo?",
            answer: "800.000 CLP por hora"
        },
        {
            question: "¿Cuánto tiempo tiene Cumplo para reportar un incidente a la CMF?",
            answer: "24 horas desde la detección"
        },
        {
            question: "¿Cuál es el RTO (Recovery Time Objective) para servicios críticos?",
            answer: "4 horas"
        },
        {
            question: "¿Cuál es el RPO (Recovery Point Objective)?",
            answer: "1 hora máximo de pérdida de datos"
        },
        {
            question: "¿Qué niveles de severidad existen?",
            answer: "4 niveles: Crítico (S1), Alto (S2), Medio (S3), Bajo (S4)"
        },
        {
            question: "¿Cuándo se activa el Comité de Crisis?",
            answer: "En incidentes Severity 1, impacto masivo, o requisito regulatorio"
        },
        {
            question: "¿Cuál es el proceso de triage de un incidente?",
            answer: "1) Detección (alerta SIEM o reporte), 2) Confirmación (validar incidente real), 3) Clasificación (severidad S1-S4), 4) Asignación (equipo CSIRT), 5) Contención inmediata."
        },
        {
            question: "¿Qué es la cadena de custodia de evidencia?",
            answer: "Documentación de cada transferencia de evidencia con timestamp y responsable. Almacenamiento seguro, acceso restringido, encriptación AES-256, retención mínima 7 años, verificación de integridad con hashes SHA-256."
        },
        {
            question: "¿Cuáles son los tipos de evidencia mínima a preservar?",
            answer: "1) Logs y registros (Cloud Logs, Firewall, IAM, aplicación, BD, SIEM - últimos 90 días), 2) Metadatos (timestamps UTC, IPs, usuarios, hashes SHA-256, User-Agents, sesiones), 3) Capturas y estados (screenshots, configuraciones IAM antes/después)."
        },
        {
            question: "¿Qué es un playbook de respuesta a incidentes?",
            answer: "Guía detallada paso a paso para responder a un tipo específico de incidente. Incluye: detección, confirmación, contención, erradicación, recuperación y post-incidente. Es ejecutable y validable, no solo documentación."
        },
        {
            question: "¿Cuál es la diferencia entre contención inmediata y erradicación?",
            answer: "Contención: acciones rápidas para detener propagación (revocar credenciales, bloquear IPs, aislar sistemas) - objetivo <30 min. Erradicación: eliminación completa de la amenaza (eliminar cuentas maliciosas, restaurar configuraciones, eliminar backdoors) - después de contención."
        },
        {
            question: "¿Qué información debe incluir el reporte a la CMF?",
            answer: "Descripción del incidente, timeline detallado, datos comprometidos (tipo, volumen, sensibilidad), impacto estimado (operacional, financiero, reputacional), medidas correctivas implementadas, medidas preventivas planificadas, estado actual, contactos del equipo. Debe enviarse dentro de 24 horas."
        },
        {
            question: "¿Cómo se maneja la comunicación con clientes afectados?",
            answer: "Email + notificación en portal dentro de 4 horas. Mensaje: reconocimiento del incidente, descripción breve del impacto, acciones tomadas, medidas preventivas, canales de soporte, próximos pasos. Tono profesional, empático y proactivo."
        },
        {
            question: "¿Qué es un IoC (Indicator of Compromise)?",
            answer: "Evidencia de actividad maliciosa: IPs maliciosas, dominios sospechosos, hashes de archivos maliciosos, patrones de comportamiento anómalo, cadenas de comando sospechosas. Se utilizan para detección temprana, búsqueda en logs, mejora de reglas SIEM/EDR."
        },
        {
            question: "¿Cuál es el proceso de escalamiento de un incidente?",
            answer: "Nivel 1 (Analista) - Severity 3-4. Nivel 2 (Líder Técnico) - Severity 2. Nivel 3 (CISO) - Severity 1. Nivel 4 (Comité de Crisis) - Severity 1 con impacto masivo. Nivel 5 (Expertos Externos) - incidentes complejos."
        },
        {
            question: "¿Qué es SOAR y cómo mejora la respuesta?",
            answer: "Security Orchestration, Automation and Response. Automatiza y orquesta tareas de respuesta. Reduce tiempo de respuesta, asegura consistencia en ejecución de playbooks, integra herramientas (SIEM, EDR, ticketing), permite escalamiento automático."
        },
        {
            question: "¿Cómo se valida que un incidente está completamente resuelto?",
            answer: "Servicios críticos operativos y validados, monitoreo estable sin anomalías por 24 horas, evidencia preservada, comunicación completada, reportes regulatorios enviados, AAR programado, plan de mejoras documentado, playbooks actualizados, no hay actividad maliciosa residual."
        },
        {
            question: "¿Qué es Zero Trust y por qué es importante?",
            answer: "Modelo de seguridad que asume que ninguna entidad es confiable por defecto. Requiere verificación continua. Protege contra compromiso de credenciales, limita acceso lateral, requiere MFA constante, segmenta la red, aplica principio de menor privilegio."
        },
        {
            question: "¿Cómo se calcula el impacto financiero de un incidente?",
            answer: "Costos directos (800K CLP/hora × horas downtime), costos de respuesta (equipo CSIRT, expertos, herramientas), multas regulatorias (hasta 1.000 UTM), costos legales, pérdida de ingresos, costos de recuperación, costos reputacionales."
        },
        {
            question: "¿Qué es un After Action Review (AAR)?",
            answer: "Proceso estructurado de análisis post-incidente realizado 2-5 días después de la resolución (Severity 1-2). Participan: CSIRT completo, Comité de Crisis, stakeholders, facilitador neutral. Duración: 2-4 horas. Preguntas: ¿Qué funcionó? ¿Qué no? ¿Por qué? ¿Qué mejorar?"
        },
        {
            question: "¿Cuáles son los quick wins identificados?",
            answer: "2FA obligatorio en cuentas privilegiadas, actualizar firmas EDR/SIEM, reforzar políticas de contraseñas, simulacros phishing mensuales, mejorar documentación de playbooks. Tiempo: 1-2 semanas."
        },
        {
            question: "¿Cuáles son los cambios estructurales planificados?",
            answer: "Implementar SOAR, Red Team trimestral, Bug Bounty program, arquitectura Zero Trust, SOC 24/7, certificación ISO 27001, alineación NIST Framework. Tiempo: 1-6 meses."
        },
        {
            question: "¿Qué es la matriz RACI?",
            answer: "Responsible (ejecuta), Accountable (responsable final), Consulted (consulta), Informed (informado). Define roles claros en cada fase: Detección, Contención, Eradicación, Recuperación, Comunicación, Reporte Regulatorio."
        },
        {
            question: "¿Cuáles son los criterios de activación del Comité de Cibercrisis?",
            answer: "Severidad Crítica confirmada, impacto en múltiples sistemas críticos, exposición masiva de datos (>10,000 registros), requisito regulatorio, impacto financiero >5M CLP, interrupción >4 horas."
        },
        {
            question: "¿Qué es el plan de continuidad del negocio (BCP)?",
            answer: "Plan para mantener operaciones durante y después de un incidente. Incluye: RTO 4 horas para servicios críticos, RPO 1 hora máximo, prioridad de restauración (Sitio Pagadores, APIs, Portal), backups incrementales cada hora, completos diarios."
        },
        {
            question: "¿Qué herramientas se utilizan para monitoreo?",
            answer: "SIEM (Splunk/ELK), EDR (CrowdStrike/SentinelOne), Cloud Logs (AWS CloudWatch, Google Cloud Logging), análisis de logs en tiempo real, detección de anomalías, correlación de eventos."
        },
        {
            question: "¿Qué es el modelo de severidad y cómo se aplica?",
            answer: "Clasifica incidentes en 4 niveles: S1 (Crítico) - pérdida masiva, interrupción total, MTTR <2h, activación inmediata Comité. S2 (Alto) - datos sensibles, interrupción parcial, MTTR <4h. S3 (Medio) - acceso no autorizado no crítico, MTTR <8h. S4 (Bajo) - eventos menores, MTTR <24h."
        },
        {
            question: "¿Cómo se preserva la integridad de la evidencia?",
            answer: "Hashes SHA-256 de todos los artefactos, almacenamiento seguro en S3 con versionado, acceso restringido (solo CSIRT y Legal), encriptación AES-256, acceso auditado y registrado, cadena de custodia documentada, retención mínima 7 años."
        },
        {
            question: "¿Qué es el plan de recuperación ante desastres (DRP)?",
            answer: "Backups incrementales cada hora, completos diarios, almacenados en S3 con versionado y cifrado AES-256, réplica en región diferente. Validación: pruebas de restauración mensuales, documentación de resultados."
        },
        {
            question: "¿Cuáles son los KPIs principales del plan?",
            answer: "MTTD <1 hora, MTTR <30 minutos, MTTC <2 horas para Severity 1, MTTR (Recovery) <4 horas. SLAs: Detección <1h, Contención crítica <2h, Notificación interna <1h, Recuperación <4h, Reporte regulador <24h."
        },
        {
            question: "¿Qué es la gobernanza del CSIRT?",
            answer: "Estructura organizacional: Comité de Crisis (CEO, CISO, Comunicaciones, Legal, Operaciones), Equipo CSIRT (Líder Técnico, Analistas, Ingenieros, Desarrolladores, Forenses). Roles definidos con matriz RACI, responsabilidades claras por fase."
        },
        {
            question: "¿Cómo se comunica durante un incidente activo?",
            answer: "Interna: Email + Slack #incident-response cada 2 horas, stand-ups cada 2-4 horas. Externa: Clientes (Email + Portal <4h), Reguladores (Reporte formal <24h), Medios (Comunicado oficial con aprobación). Reglas: No especular, solo hechos confirmados, un solo portavoz."
        },
        {
            question: "¿Qué es el backlog de mejoras continuas?",
            answer: "Quick Wins (1-2 semanas): 2FA, actualizar firmas, políticas de contraseñas, simulacros. Cambios Estructurales (1-6 meses): SOAR, Red Team, Bug Bounty, Zero Trust, SOC 24/7, ISO 27001, NIST Framework. Seguimiento: Revisión mensual, trimestral y anual."
        },
        {
            question: "¿Qué regulaciones aplican a Cumplo?",
            answer: "Ley Fintech 21.521, Ley 19.628 (Protección de Datos), normativas CMF, ISO 27001, NIST Framework, PCI DSS."
        },
        {
            question: "¿Cuál es el MTTR objetivo para incidentes Severity 1?",
            answer: "Menos de 2 horas para contención, menos de 4 horas para recuperación completa."
        },
        {
            question: "¿Qué es MTTD y cuál es el objetivo?",
            answer: "Mean Time To Detect - tiempo promedio desde que ocurre un incidente hasta que se detecta. Objetivo: menos de 1 hora."
        },
        {
            question: "¿Qué es MTTC y cuál es el objetivo?",
            answer: "Mean Time To Contain - tiempo promedio desde la detección hasta la contención. Objetivo: menos de 2 horas para Severity 1."
        },
        {
            question: "¿Cuál es el objetivo principal del resumen ejecutivo del plan?",
            answer: "Proporcionar una visión general del plan de gestión de incidentes, destacando la importancia de proteger información financiera y personal sensible, minimizar impacto (800K CLP/hora), cumplir regulaciones (Ley Fintech 21.521), y mantener confianza de clientes."
        },
        {
            question: "¿Qué información debe incluir el resumen ejecutivo?",
            answer: "Estructura organizacional (CSIRT y Comité de Crisis), procesos clave (triage, clasificación, playbooks), cumplimiento regulatorio, objetivos de tiempo (RTO, RPO, SLAs), herramientas y tecnologías, y compromiso con mejora continua."
        },
        {
            question: "¿Cuáles son los 5 pasos del proceso de triage?",
            answer: "1) Detección - alerta SIEM o reporte, 2) Confirmación - validar incidente real, 3) Clasificación - asignar severidad S1-S4, 4) Asignación - equipo CSIRT apropiado, 5) Contención inmediata - acciones rápidas para detener propagación."
        },
        {
            question: "¿En cuánto tiempo debe completarse el triage para incidentes críticos?",
            answer: "Menos de 30 minutos desde la detección inicial. Esto permite activación rápida del Comité de Crisis y contención inmediata para minimizar el impacto."
        },
        {
            question: "¿Qué logs deben preservarse como evidencia mínima?",
            answer: "Cloud Logs, Firewall logs, logs de autenticación IAM, logs de aplicación, logs de bases de datos, logs de SIEM. Todos los logs de los últimos 90 días deben estar disponibles para análisis forense."
        },
        {
            question: "¿Qué metadatos son críticos para la evidencia?",
            answer: "Timestamps UTC, IPs origen/destino, usuarios/cuentas afectadas, hashes SHA-256 de archivos, User-Agents, sesiones/tokens activos. Estos metadatos permiten reconstruir el timeline del incidente y rastrear la actividad del atacante."
        },
        {
            question: "¿Cuántos pasos tiene un playbook operativo estándar?",
            answer: "7 pasos: 1) Detección, 2) Confirmación, 3) Clasificación, 4) Contención inmediata, 5) Eradicación, 6) Recuperación, 7) Post-incidente. Cada paso incluye actividades específicas, herramientas, tiempos objetivos y validaciones."
        },
        {
            question: "¿Cuál es el tiempo objetivo para contención inmediata?",
            answer: "Menos de 30 minutos desde la confirmación del incidente. Esto incluye revocar credenciales, bloquear IPs, aislar sistemas, y deshabilitar cuentas comprometidas."
        },
        {
            question: "¿Qué diferencia hay entre contención y erradicación?",
            answer: "Contención: acciones rápidas para detener propagación (<30 min). Erradicación: eliminación completa de la amenaza del entorno (eliminar cuentas maliciosas, restaurar configuraciones, eliminar backdoors) - se realiza después de contención y preservación de evidencia."
        },
        {
            question: "¿Cuántos items debe tener un checklist de contención rápida?",
            answer: "Mínimo 6-8 items críticos: desconectar red, bloquear IPs, suspender cuentas, rotar credenciales, forzar reseteo de contraseñas, deshabilitar accesos remotos, aislar sistemas, preservar evidencia. Cada item debe ser verificable con responsable asignado."
        },
        {
            question: "¿Qué establece la Ley Fintech 21.521 sobre notificación de incidentes?",
            answer: "Notificación obligatoria a la CMF dentro de 24 horas desde la detección del incidente. El reporte debe incluir descripción, alcance, sistemas afectados, datos comprometidos, impacto estimado, medidas correctivas y estado actual."
        },
        {
            question: "¿Cuáles son las sanciones por incumplimiento de la Ley Fintech?",
            answer: "Hasta 1.000 UTM (Unidades Tributarias Mensuales) según la gravedad del incumplimiento. Además, la CMF puede ordenar medidas correctivas, auditorías especiales, y en casos graves, suspensión de operaciones."
        },
        {
            question: "¿Qué marcos internacionales aplican al plan de Cumplo?",
            answer: "ISO/IEC 27001:2022 (gestión de seguridad), NIST Cybersecurity Framework 2.0 (identificar, proteger, detectar, responder, recuperar), PCI DSS v4.0 (si procesa pagos), NIST SP 800-61 (manejo de incidentes), SANS Incident Response Process."
        },
        {
            question: "¿Cuál es la diferencia entre ISO 27001 y NIST Framework?",
            answer: "ISO 27001 es un estándar certificable de gestión de seguridad de la información con requisitos específicos. NIST Framework es una guía de mejores prácticas estructurada en 5 funciones (identificar, proteger, detectar, responder, recuperar). Cumplo debe alinear su plan con ambos para certificación y cumplimiento."
        },
        {
            question: "¿Qué es el principio de menor privilegio en seguridad?",
            answer: "Principio que establece que usuarios y sistemas deben tener solo los permisos mínimos necesarios para realizar sus funciones. Limita el impacto de un compromiso de credenciales y es parte del modelo Zero Trust que Cumplo planea implementar."
        },
        {
            question: "¿Qué es un IoC (Indicator of Compromise) y ejemplos?",
            answer: "Evidencia de actividad maliciosa. Ejemplos: IPs maliciosas conocidas, dominios sospechosos, hashes SHA-256 de archivos maliciosos, patrones de comportamiento anómalo (accesos fuera de horario, volúmenes inusuales de datos), cadenas de comando sospechosas. Se utilizan para detección temprana y búsqueda en logs."
        },
        {
            question: "¿Cómo se preserva la integridad de la evidencia digital?",
            answer: "Generando hashes SHA-256 de todos los artefactos antes y después de cada transferencia, almacenando en S3 con versionado, acceso restringido (solo CSIRT y Legal), encriptación AES-256, acceso auditado y registrado, cadena de custodia documentada, retención mínima 7 años."
        },
        {
            question: "¿Qué es el modelo Zero Trust y por qué es importante?",
            answer: "Modelo de seguridad que asume que ninguna entidad (usuario, dispositivo, red) es confiable por defecto. Requiere verificación continua. Importante porque: protege contra compromiso de credenciales, limita acceso lateral, requiere MFA constante, segmenta la red, aplica principio de menor privilegio. Es una mejora estructural planificada para Cumplo."
        },
        {
            question: "¿Cuáles son los quick wins del plan de mejoras?",
            answer: "2FA obligatorio en cuentas privilegiadas, actualizar firmas EDR/SIEM, reforzar políticas de contraseñas, simulacros phishing mensuales, mejorar documentación de playbooks. Tiempo de implementación: 1-2 semanas. Impacto inmediato en seguridad sin cambios estructurales mayores."
        },
        {
            question: "¿Cuáles son los cambios estructurales planificados?",
            answer: "Implementar SOAR (automatización), Red Team trimestral, Bug Bounty program, arquitectura Zero Trust, SOC 24/7, certificación ISO 27001, alineación NIST Framework. Tiempo de implementación: 1-6 meses. Requieren inversión significativa pero mejoran la postura de seguridad a largo plazo."
        },
        {
            question: "¿Qué es SOAR y qué beneficios aporta?",
            answer: "Security Orchestration, Automation and Response. Automatiza y orquesta tareas de respuesta a incidentes. Beneficios: reducción de tiempo de respuesta, consistencia en ejecución de playbooks, integración de herramientas (SIEM, EDR, ticketing), escalamiento automático según reglas, documentación automática de acciones."
        },
        {
            question: "¿Cuál es la estructura del equipo CSIRT?",
            answer: "Líder Técnico (coordinación técnica), Analistas de Seguridad (monitoreo SIEM, análisis de logs, IoCs), Ingenieros de Red (contención de red, bloqueo IPs), Desarrolladores (parches de seguridad, mitigación vulnerabilidades), Forenses Digitales (recolección de evidencia, análisis forense, cadena de custodia)."
        },
        {
            question: "¿Qué es la matriz RACI y cómo se aplica?",
            answer: "Responsible (ejecuta la tarea), Accountable (responsable final), Consulted (se consulta), Informed (se informa). Define roles claros en cada fase: Detección (Analista R, CISO A), Contención (Ingeniero Red R, Líder Técnico A), Eradicación (Desarrolladores R, Arquitecto Seguridad A), Recuperación (Ingenieros Operaciones R, CTO A), Comunicación (Gerente Comunicaciones R, CEO A), Reporte Regulatorio (Legal R, CEO A)."
        },
        {
            question: "¿Cuáles son los criterios de activación del Comité de Cibercrisis?",
            answer: "Severidad Crítica confirmada, impacto en múltiples sistemas críticos, exposición masiva de datos (>10,000 registros), requisito regulatorio, impacto financiero >5M CLP, interrupción >4 horas. El CISO evalúa y recomienda, CEO aprueba, notificación inmediata a miembros (máx. 15 min), primera reunión dentro de 30 minutos."
        },
        {
            question: "¿Qué es el plan de continuidad del negocio (BCP)?",
            answer: "Plan para mantener operaciones durante y después de un incidente. Incluye: RTO 4 horas para servicios críticos, RPO 1 hora máximo de pérdida de datos, prioridad de restauración (1) Sitio Pagadores, 2) APIs de transacciones, 3) Portal de clientes), backups incrementales cada hora, completos diarios, almacenados en S3 con versionado y cifrado AES-256, réplica en región diferente."
        },
        {
            question: "¿Cómo se valida que un incidente está completamente resuelto?",
            answer: "Servicios críticos operativos y validados funcionalmente, monitoreo estable sin anomalías por mínimo 24 horas, evidencia preservada y análisis forense iniciado, comunicación con stakeholders completada, reportes regulatorios enviados, AAR programado dentro de 2-5 días, plan de acción de mejoras documentado, playbooks actualizados con lecciones aprendidas, no hay indicadores de actividad maliciosa residual. Solo CISO o Líder Técnico puede cerrar oficialmente Severity 1-2."
        }
    ];
    
    studyCards.innerHTML = cards.map((card, index) => `
        <div class="study-card" data-index="${index}">
            <div class="card-front">
                <p class="card-question">${card.question}</p>
                <button class="flip-card">Ver respuesta</button>
            </div>
            <div class="card-back">
                <p class="card-answer">${card.answer}</p>
                <button class="flip-card">Ver pregunta</button>
            </div>
        </div>
    `).join('');
    
    // Add flip handlers
    studyCards.addEventListener('click', (e) => {
        if (e.target.classList.contains('flip-card')) {
            const card = e.target.closest('.study-card');
            if (card) {
                card.classList.toggle('flipped');
                updateCardProgress();
            }
        }
    });
    
    updateCardProgress();
}

// Update card progress
function updateCardProgress() {
    const progressEl = document.getElementById('cardProgress');
    if (!progressEl) return;
    
    const cards = document.querySelectorAll('.study-card');
    const flipped = document.querySelectorAll('.study-card.flipped').length;
    progressEl.textContent = `${flipped}/${cards.length}`;
}

// Shuffle study cards
function shuffleStudyCards() {
    const studyCards = document.getElementById('studyCards');
    if (!studyCards) return;
    
    const cards = Array.from(studyCards.children);
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    cards.forEach(card => studyCards.appendChild(card));
}

// Reset study cards
function resetStudyCards() {
    const cards = document.querySelectorAll('.study-card');
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
    updateCardProgress();
    generateStudyCards();
}

// Export study cards
function exportStudyCards() {
    const cards = document.querySelectorAll('.study-card');
    let content = 'TARJETAS DE ESTUDIO - PLAN IR CUMPLO\n';
    content += '=====================================\n\n';
    
    cards.forEach((card, index) => {
        const question = card.querySelector('.card-question')?.textContent || '';
        const answer = card.querySelector('.card-answer')?.textContent || '';
        content += `Tarjeta ${index + 1}:\n`;
        content += `Pregunta: ${question}\n`;
        content += `Respuesta: ${answer}\n\n`;
    });
    
    downloadText(content, 'Tarjetas_Estudio_IR_Cumplo.txt');
}

// Start Quiz
function startQuiz() {
    const cards = document.querySelectorAll('.study-card');
    let currentIndex = 0;
    let score = 0;
    
    function showQuizCard() {
        cards.forEach((card, index) => {
            card.style.display = index === currentIndex ? 'block' : 'none';
        });
    }
    
    showQuizCard();
    
    // Add quiz navigation
    const quizControls = document.createElement('div');
    quizControls.className = 'quiz-controls';
    quizControls.innerHTML = `
        <button id="quizCorrect">✓ Correcto</button>
        <button id="quizIncorrect">✗ Incorrecto</button>
        <div>Pregunta ${currentIndex + 1} de ${cards.length}</div>
    `;
    
    document.getElementById('tab-study').appendChild(quizControls);
    
    document.getElementById('quizCorrect').addEventListener('click', () => {
        score++;
        nextQuestion();
    });
    
    document.getElementById('quizIncorrect').addEventListener('click', () => {
        nextQuestion();
    });
    
    function nextQuestion() {
        currentIndex++;
        if (currentIndex >= cards.length) {
            showQuizResults(score, cards.length);
        } else {
            showQuizCard();
            quizControls.querySelector('div').textContent = `Pregunta ${currentIndex + 1} de ${cards.length}`;
        }
    }
    
    function showQuizResults(correct, total) {
        quizControls.innerHTML = `
            <h3>Quiz Completado</h3>
            <p>Puntuación: ${correct}/${total} (${Math.round(correct/total*100)}%)</p>
            <button onclick="location.reload()">Reiniciar Quiz</button>
        `;
    }
}

// Handle Downloads
function handleDownload(type) {
    switch(type) {
        case 'pdf':
            if (typeof html2pdf !== 'undefined') {
                html2pdf().from(document.body).save('Presentacion_IR_Cumplo.pdf');
            } else {
                window.print();
            }
            break;
        case 'checklist':
            downloadChecklists();
            break;
        case 'playbooks':
            downloadPlaybooks();
            break;
        case 'summary':
            downloadSummary();
            break;
    }
}

// Download Checklists
function downloadChecklists() {
    const checklists = document.querySelectorAll('.checklist-container');
    let content = '<h1>Checklists Operativos - Plan IR Cumplo</h1>\n\n';
    
    checklists.forEach((checklist, index) => {
        const items = checklist.querySelectorAll('.checklist-item');
        content += `<h2>Checklist ${index + 1}</h2>\n`;
        items.forEach((item, i) => {
            const text = item.textContent.trim();
            content += `${i + 1}. ${text}\n`;
        });
        content += '\n';
    });
    
    downloadText(content, 'Checklists_Operativos.txt');
}

// Download Playbooks
function downloadPlaybooks() {
    const playbooks = document.querySelectorAll('.playbook-steps');
    let content = '<h1>Playbooks Operativos - Plan IR Cumplo</h1>\n\n';
    
    playbooks.forEach((playbook, index) => {
        const steps = playbook.querySelectorAll('.step');
        content += `<h2>Playbook ${index + 1}</h2>\n`;
        steps.forEach((step, i) => {
            const title = step.querySelector('h4')?.textContent || '';
            const details = step.querySelector('.step-content')?.textContent || '';
            content += `\n${i + 1}. ${title}\n${details}\n`;
        });
        content += '\n';
    });
    
    downloadText(content, 'Playbooks_Operativos.txt');
}

// Download Summary
function downloadSummary() {
    const summary = generateSummaryText();
    downloadText(summary, 'Resumen_Ejecutivo.txt');
}

// Generate Summary Text
function generateSummaryText() {
    const slides = document.querySelectorAll('.slide');
    let content = 'RESUMEN EJECUTIVO - PLAN IR CUMPLO\n';
    content += '=====================================\n\n';
    
    slides.forEach(slide => {
        const slideNum = slide.dataset.slide;
        const title = slide.querySelector('.slide-title')?.textContent || '';
        content += `Slide ${slideNum}: ${title}\n`;
        content += '-'.repeat(50) + '\n';
        
        const keyPoints = extractKeyContent(slide);
        keyPoints.forEach(point => {
            content += `  • ${point}\n`;
        });
        content += '\n';
    });
    
    return content;
}

// Download Text Helper
function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Bookmarks
function loadBookmarks() {
    const saved = localStorage.getItem('listener-bookmarks');
    if (saved) {
        listenerMode.bookmarks = JSON.parse(saved);
    }
}

function saveBookmarks() {
    localStorage.setItem('listener-bookmarks', JSON.stringify(listenerMode.bookmarks));
}

function addBookmark() {
    const currentSlide = document.querySelector('.slide.active');
    if (!currentSlide) return;
    
    const slideNum = parseInt(currentSlide.dataset.slide);
    const title = currentSlide.querySelector('.slide-title')?.textContent || `Slide ${slideNum}`;
    
    listenerMode.bookmarks.push({
        slideNum,
        title,
        timestamp: new Date().toISOString()
    });
    
    saveBookmarks();
    updateBookmarksList();
    
    alert(`Marcador agregado: ${title}`);
}

function updateBookmarksList() {
    const list = document.getElementById('bookmarksList');
    if (listenerMode.bookmarks.length === 0) {
        list.innerHTML = '<p>No hay marcadores guardados</p>';
        return;
    }
    
    list.innerHTML = listenerMode.bookmarks.map((bookmark, index) => `
        <div class="bookmark-item">
            <div class="bookmark-info">
                <strong>Slide ${bookmark.slideNum}: ${bookmark.title}</strong>
                <small>${new Date(bookmark.timestamp).toLocaleString()}</small>
            </div>
            <div class="bookmark-actions">
                <button class="btn-goto" data-slide="${bookmark.slideNum}">Ir</button>
                <button class="btn-delete" data-index="${index}">Eliminar</button>
            </div>
        </div>
    `).join('');
    
    // Add handlers
    list.querySelectorAll('.btn-goto').forEach(btn => {
        btn.addEventListener('click', () => {
            const slideNum = parseInt(btn.dataset.slide);
            if (typeof goToSlide === 'function') {
                goToSlide(slideNum);
            }
        });
    });
    
    list.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            listenerMode.bookmarks.splice(index, 1);
            saveBookmarks();
            updateBookmarksList();
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeListenerMode);

// Add listener mode toggle button
document.addEventListener('DOMContentLoaded', () => {
    const controls = document.querySelector('.additional-controls');
    if (controls) {
        const listenerBtn = document.createElement('button');
        listenerBtn.id = 'listenerBtn';
        listenerBtn.className = 'control-btn';
        listenerBtn.title = 'Modo Oyente (Ctrl+L)';
        listenerBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
        `;
        listenerBtn.addEventListener('click', toggleListenerMode);
        controls.appendChild(listenerBtn);
    }
});
