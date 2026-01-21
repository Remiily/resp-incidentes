// Simulación Interactiva de Playbooks - Versión Mejorada
// Esta simulación permite practicar el proceso de respuesta a incidentes paso a paso

let playbookState = {
    currentStep: 0,
    completedSteps: [],
    startTime: null,
    stepTimers: {},
    isActive: false
};

// Inicializar simulación cuando la slide 4 esté visible
function initializePlaybookSimulation() {
    const slide4 = document.querySelector('.slide[data-slide="4"]');
    if (!slide4) {
        console.warn('Slide 4 no encontrada');
        return;
    }
    
    // Solo inicializar si estamos en la slide 4
    if (!slide4.classList.contains('active')) {
        return;
    }
    
    const playbookSteps = slide4.querySelectorAll('.interactive-step');
    if (playbookSteps.length === 0) {
        console.warn('No se encontraron pasos del playbook');
        return;
    }
    
    // Limpiar inicializaciones previas
    resetPlaybookState();
    
    // Configurar cada paso
    playbookSteps.forEach((step, index) => {
        setupStep(step, index + 1);
    });
    
    // Agregar controles de simulación
    addPlaybookControls(slide4);
    
    // Actualizar progreso inicial
    updatePlaybookProgress();
    
    console.log('Simulación del playbook inicializada');
}

// Configurar un paso individual
function setupStep(stepElement, stepNumber) {
    const stepHeader = stepElement.querySelector('.step-header');
    const stepContent = stepElement.querySelector('.step-content');
    const stepToggle = stepElement.querySelector('.step-toggle');
    
    if (!stepHeader || !stepContent) {
        console.warn(`Paso ${stepNumber} no tiene estructura correcta`);
        return;
    }
    
    // Limpiar contenido previo
    const existingCheckbox = stepContent.querySelector('.step-completion');
    if (existingCheckbox) {
        existingCheckbox.remove();
    }
    
    // Agregar checkbox de completado
    const completionCheck = document.createElement('div');
    completionCheck.className = 'step-completion';
    completionCheck.innerHTML = `
        <label class="step-checkbox-label">
            <input type="checkbox" class="step-checkbox" data-step="${stepNumber}">
            <span>Marcar como completado</span>
        </label>
    `;
    stepContent.appendChild(completionCheck);
    
    // Event listener para el checkbox
    const checkbox = completionCheck.querySelector('.step-checkbox');
    checkbox.addEventListener('change', (e) => {
        handleStepCompletion(stepNumber, e.target.checked);
    });
    
    // Event listener para expandir/colapsar
    if (stepToggle) {
        stepToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStep(stepElement, stepNumber);
        });
    }
    
    // Click en el header también expande/colapsa
    stepHeader.addEventListener('click', (e) => {
        if (e.target !== stepToggle && !e.target.closest('.step-toggle')) {
            toggleStep(stepElement, stepNumber);
        }
    });
    
    // Inicializar estado
    stepElement.classList.remove('expanded', 'completed');
    stepContent.style.display = 'none';
}

// Alternar expansión de un paso
function toggleStep(stepElement, stepNumber) {
    const stepContent = stepElement.querySelector('.step-content');
    const stepToggle = stepElement.querySelector('.step-toggle');
    const isExpanded = stepElement.classList.contains('expanded');
    
    if (isExpanded) {
        // Colapsar
        stepElement.classList.remove('expanded');
        stepContent.style.display = 'none';
        if (stepToggle) stepToggle.textContent = '▼';
    } else {
        // Expandir
        stepElement.classList.add('expanded');
        stepContent.style.display = 'block';
        if (stepToggle) stepToggle.textContent = '▲';
        
        // Iniciar timer si no está activo
        if (!playbookState.stepTimers[stepNumber]) {
            startStepTimer(stepNumber);
        }
    }
    
    // Optimizar scroll suave
    requestAnimationFrame(() => {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// Manejar completado de paso
function handleStepCompletion(stepNumber, isCompleted) {
    const stepElement = document.querySelector(`.interactive-step[data-step="${stepNumber}"]`);
    
    if (isCompleted) {
        if (!playbookState.completedSteps.includes(stepNumber)) {
            playbookState.completedSteps.push(stepNumber);
        }
        if (stepElement) {
            stepElement.classList.add('completed');
        }
        stopStepTimer(stepNumber);
    } else {
        playbookState.completedSteps = playbookState.completedSteps.filter(s => s !== stepNumber);
        if (stepElement) {
            stepElement.classList.remove('completed');
        }
    }
    
    updatePlaybookProgress();
}

// Iniciar timer de paso
function startStepTimer(stepNumber) {
    if (playbookState.stepTimers[stepNumber]) {
        return; // Ya está activo
    }
    
    playbookState.stepTimers[stepNumber] = {
        start: Date.now(),
        interval: null
    };
    
    const timerElement = document.querySelector(`.timer-value[data-step="${stepNumber}"]`);
    if (!timerElement) {
        // Crear elemento de timer si no existe
        const stepHeader = document.querySelector(`.interactive-step[data-step="${stepNumber}"] .step-header`);
        if (stepHeader) {
            const timerContainer = document.createElement('div');
            timerContainer.className = 'step-timer';
            timerContainer.innerHTML = `
                <span class="timer-label">Tiempo:</span>
                <span class="timer-value" data-step="${stepNumber}">00:00</span>
            `;
            stepHeader.appendChild(timerContainer);
        }
    }
    
    // Actualizar timer cada segundo
    playbookState.stepTimers[stepNumber].interval = setInterval(() => {
        updateStepTimer(stepNumber);
    }, 1000);
}

// Detener timer de paso
function stopStepTimer(stepNumber) {
    if (playbookState.stepTimers[stepNumber]) {
        if (playbookState.stepTimers[stepNumber].interval) {
            clearInterval(playbookState.stepTimers[stepNumber].interval);
        }
        // Mantener el tiempo transcurrido
        const elapsed = Date.now() - playbookState.stepTimers[stepNumber].start;
        playbookState.stepTimers[stepNumber].elapsed = elapsed;
    }
}

// Actualizar display del timer
function updateStepTimer(stepNumber) {
    const timerValue = document.querySelector(`.timer-value[data-step="${stepNumber}"]`);
    if (!timerValue) return;
    
    const timer = playbookState.stepTimers[stepNumber];
    if (!timer) return;
    
    const elapsed = timer.elapsed || (Date.now() - timer.start);
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Agregar controles de simulación
function addPlaybookControls(slideElement) {
    const playbookContainer = slideElement.querySelector('.playbook-container');
    if (!playbookContainer) return;
    
    // Remover controles existentes
    const existingControls = playbookContainer.querySelector('.playbook-controls');
    if (existingControls) {
        existingControls.remove();
    }
    
    const controls = document.createElement('div');
    controls.className = 'playbook-controls';
    controls.innerHTML = `
        <div class="playbook-instructions">
            <h4>📖 Instrucciones</h4>
            <p>Esta simulación te permite practicar el proceso de respuesta a incidentes:</p>
            <ul>
                <li><strong>Haz clic en cada paso</strong> para ver los detalles y actividades</li>
                <li><strong>Marca como completado</strong> cuando termines de revisar cada paso</li>
                <li><strong>El temporizador</strong> registra cuánto tiempo pasas en cada paso</li>
                <li><strong>Completa todos los pasos</strong> para finalizar la simulación</li>
            </ul>
        </div>
        <div class="playbook-progress-section">
            <div class="playbook-progress-bar">
                <div class="playbook-progress-fill" id="playbookProgressFill"></div>
            </div>
            <div class="playbook-stats">
                <div class="stat-item">
                    <span class="stat-label">Progreso:</span>
                    <span class="stat-value" id="playbookProgress">0%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Pasos Completados:</span>
                    <span class="stat-value" id="playbookCompletedSteps">0/6</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiempo Total:</span>
                    <span class="stat-value" id="playbookTotalTime">00:00</span>
                </div>
            </div>
        </div>
        <div class="playbook-actions">
            <button id="resetPlaybook" class="btn-playbook">🔄 Reiniciar</button>
            <button id="validatePlaybook" class="btn-playbook">✅ Validar</button>
        </div>
    `;
    
    playbookContainer.insertBefore(controls, playbookContainer.firstChild);
    
    // Event listeners
    const resetBtn = controls.querySelector('#resetPlaybook');
    const validateBtn = controls.querySelector('#validatePlaybook');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPlaybook);
    }
    
    if (validateBtn) {
        validateBtn.addEventListener('click', validatePlaybook);
    }
}

// Actualizar progreso
function updatePlaybookProgress() {
    const totalSteps = document.querySelectorAll('.interactive-step').length;
    const completed = playbookState.completedSteps.length;
    const percentage = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
    
    // Barra de progreso
    const progressFill = document.getElementById('playbookProgressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.style.transition = 'width 0.3s ease';
    }
    
    // Estadísticas
    const progressValue = document.getElementById('playbookProgress');
    if (progressValue) {
        progressValue.textContent = percentage + '%';
    }
    
    const completedSteps = document.getElementById('playbookCompletedSteps');
    if (completedSteps) {
        completedSteps.textContent = `${completed}/${totalSteps}`;
    }
    
    // Tiempo total
    let totalTime = 0;
    Object.values(playbookState.stepTimers).forEach(timer => {
        if (timer.elapsed) {
            totalTime += timer.elapsed;
        } else if (timer.start) {
            totalTime += (Date.now() - timer.start);
        }
    });
    
    const totalTimeElement = document.getElementById('playbookTotalTime');
    if (totalTimeElement) {
        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);
        totalTimeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Reiniciar simulación
function resetPlaybook() {
    if (!confirm('¿Reiniciar la simulación? Se perderá todo el progreso.')) {
        return;
    }
    
    resetPlaybookState();
    
    // Resetear checkboxes
    document.querySelectorAll('.step-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Resetear clases
    document.querySelectorAll('.interactive-step').forEach(step => {
        step.classList.remove('completed', 'expanded');
        const content = step.querySelector('.step-content');
        if (content) {
            content.style.display = 'none';
        }
        const toggle = step.querySelector('.step-toggle');
        if (toggle) {
            toggle.textContent = '▼';
        }
    });
    
    // Resetear timers
    document.querySelectorAll('.timer-value').forEach(timer => {
        timer.textContent = '00:00';
    });
    
    updatePlaybookProgress();
}

// Resetear estado
function resetPlaybookState() {
    // Limpiar todos los timers
    Object.values(playbookState.stepTimers).forEach(timer => {
        if (timer.interval) {
            clearInterval(timer.interval);
        }
    });
    
    playbookState = {
        currentStep: 0,
        completedSteps: [],
        startTime: null,
        stepTimers: {},
        isActive: false
    };
}

// Validar completitud
function validatePlaybook() {
    const totalSteps = document.querySelectorAll('.interactive-step').length;
    const completed = playbookState.completedSteps.length;
    
    if (completed === totalSteps) {
        alert('✅ ¡Excelente! Has completado todos los pasos del playbook correctamente.\n\nEsto demuestra que entiendes el proceso completo de respuesta a incidentes.');
    } else {
        const missing = totalSteps - completed;
        alert(`⚠️ Faltan ${missing} paso(s) por completar.\n\nPor favor, revisa y completa todos los pasos del playbook para finalizar la simulación.`);
    }
}

// Observar cuando la slide 4 se vuelve activa
function observeSlide4() {
    const slide4 = document.querySelector('.slide[data-slide="4"]');
    if (!slide4) {
        // Reintentar después de un delay
        setTimeout(observeSlide4, 500);
        return;
    }
    
    // Función para verificar y actualizar estado
    function checkSlideState() {
        const isActive = slide4.classList.contains('active');
        
        if (isActive && !playbookState.isActive) {
            // Slide 4 se activó
            playbookState.isActive = true;
            setTimeout(() => {
                initializePlaybookSimulation();
            }, 300);
        } else if (!isActive && playbookState.isActive) {
            // Slide 4 se desactivó
            playbookState.isActive = false;
            resetPlaybookState();
        }
    }
    
    // Usar MutationObserver para detectar cuando la slide se activa
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                checkSlideState();
            }
        });
    });
    
    observer.observe(slide4, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Verificar estado inicial
    checkSlideState();
    
    // También verificar periódicamente (por si acaso)
    setInterval(checkSlideState, 1000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    observeSlide4();
    
    // También escuchar cambios de slide desde script.js usando MutationObserver
    // El observer ya maneja esto, pero agregamos un listener adicional para cambios directos
    document.addEventListener('slideChanged', (e) => {
        const slideNumber = e.detail?.slideNumber;
        if (slideNumber === 4) {
            if (!playbookState.isActive) {
                playbookState.isActive = true;
                setTimeout(() => {
                    initializePlaybookSimulation();
                }, 300);
            }
        } else {
            if (playbookState.isActive) {
                playbookState.isActive = false;
                resetPlaybookState();
            }
        }
    });
});
