// Simulación Interactiva de Playbooks

let playbookState = {
    currentStep: 0,
    completedSteps: [],
    startTime: null,
    stepTimes: {}
};

function initializePlaybookSimulation() {
    const playbookSteps = document.querySelectorAll('.interactive-step');
    
    playbookSteps.forEach((step, index) => {
        const stepHeader = step.querySelector('.step-header');
        const stepContent = step.querySelector('.step-content');
        const stepToggle = step.querySelector('.step-toggle');
        
        if (!stepHeader || !stepContent) return;
        
        // Add step validation
        const stepNum = parseInt(step.dataset.step);
        step.dataset.stepIndex = index;
        
        // Add completion checkbox
        const completionCheck = document.createElement('div');
        completionCheck.className = 'step-completion';
        completionCheck.innerHTML = `
            <label class="step-checkbox-label">
                <input type="checkbox" class="step-checkbox" data-step="${stepNum}">
                <span>Paso completado</span>
            </label>
        `;
        stepContent.appendChild(completionCheck);
        
        // Add timer for step
        const stepTimer = document.createElement('div');
        stepTimer.className = 'step-timer';
        stepTimer.innerHTML = `<span class="timer-label">Tiempo:</span> <span class="timer-value" data-step="${stepNum}">00:00</span>`;
        stepHeader.appendChild(stepTimer);
        
        // Toggle step content
        if (stepToggle) {
            stepToggle.addEventListener('click', () => {
                step.classList.toggle('expanded');
                const isExpanded = step.classList.contains('expanded');
                stepToggle.textContent = isExpanded ? '▲' : '▼';
                
                if (isExpanded && !playbookState.stepTimes[stepNum]) {
                    startStepTimer(stepNum);
                }
            });
        }
        
        // Checkbox handler
        const checkbox = completionCheck.querySelector('.step-checkbox');
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
                markStepComplete(stepNum);
                stopStepTimer(stepNum);
            } else {
                markStepIncomplete(stepNum);
            }
            updatePlaybookProgress();
        });
        
        // Add "What NOT to do" section
        addWhatNotToDo(stepContent, stepNum);
    });
    
    // Add playbook controls
    addPlaybookControls();
    
    // Initialize progress
    updatePlaybookProgress();
}

function addWhatNotToDo(stepContent, stepNum) {
    const whatNotToDo = document.createElement('div');
    whatNotToDo.className = 'what-not-to-do';
    whatNotToDo.innerHTML = `
        <h5>⚠️ Qué NO hacer:</h5>
        <ul class="not-to-do-list">
            ${getWhatNotToDoContent(stepNum)}
        </ul>
    `;
    stepContent.appendChild(whatNotToDo);
}

function getWhatNotToDoContent(stepNum) {
    const notToDoMap = {
        1: '<li>No ignorar alertas sin investigar</li><li>No asumir que es un falso positivo sin validar</li>',
        2: '<li>No escalar sin confirmar el incidente</li><li>No compartir información sin autorización</li>',
        3: '<li>No desconectar sistemas sin preservar evidencia</li><li>No bloquear IPs sin documentar</li>',
        4: '<li>No eliminar evidencia durante la erradicación</li><li>No restaurar sin validar integridad</li>',
        5: '<li>No restaurar desde backups no validados</li><li>No activar servicios sin monitoreo</li>',
        6: '<li>No cerrar el incidente sin AAR</li><li>No olvidar actualizar playbooks</li>'
    };
    return notToDoMap[stepNum] || '<li>No omitir pasos del playbook</li>';
}

function addPlaybookControls() {
    const playbookContainer = document.querySelector('.playbook-container');
    if (!playbookContainer) return;
    
    const controls = document.createElement('div');
    controls.className = 'playbook-controls';
    controls.innerHTML = `
        <div class="playbook-progress-bar">
            <div class="playbook-progress-fill" id="playbookProgressFill"></div>
        </div>
        <div class="playbook-stats">
            <div class="stat-item">
                <span class="stat-label">Progreso:</span>
                <span class="stat-value" id="playbookProgress">0%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Tiempo Total:</span>
                <span class="stat-value" id="playbookTotalTime">00:00</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pasos Completados:</span>
                <span class="stat-value" id="playbookCompletedSteps">0/6</span>
            </div>
        </div>
        <div class="playbook-actions">
            <button id="resetPlaybook" class="btn-playbook">🔄 Reiniciar Simulación</button>
            <button id="validatePlaybook" class="btn-playbook">✅ Validar Completitud</button>
        </div>
    `;
    
    playbookContainer.insertBefore(controls, playbookContainer.firstChild);
    
    // Event handlers
    document.getElementById('resetPlaybook').addEventListener('click', resetPlaybook);
    document.getElementById('validatePlaybook').addEventListener('click', validatePlaybook);
}

function startStepTimer(stepNum) {
    if (!playbookState.stepTimes[stepNum]) {
        playbookState.stepTimes[stepNum] = {
            start: Date.now(),
            elapsed: 0
        };
    }
    
    const timerInterval = setInterval(() => {
        if (playbookState.stepTimes[stepNum]) {
            const elapsed = Date.now() - playbookState.stepTimes[stepNum].start;
            playbookState.stepTimes[stepNum].elapsed = elapsed;
            updateStepTimer(stepNum, elapsed);
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function stopStepTimer(stepNum) {
    if (playbookState.stepTimes[stepNum]) {
        playbookState.stepTimes[stepNum].elapsed = Date.now() - playbookState.stepTimes[stepNum].start;
    }
}

function updateStepTimer(stepNum, elapsed) {
    const timerValue = document.querySelector(`.timer-value[data-step="${stepNum}"]`);
    if (timerValue) {
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function markStepComplete(stepNum) {
    if (!playbookState.completedSteps.includes(stepNum)) {
        playbookState.completedSteps.push(stepNum);
    }
    
    const step = document.querySelector(`.interactive-step[data-step="${stepNum}"]`);
    if (step) {
        step.classList.add('completed');
    }
}

function markStepIncomplete(stepNum) {
    playbookState.completedSteps = playbookState.completedSteps.filter(s => s !== stepNum);
    
    const step = document.querySelector(`.interactive-step[data-step="${stepNum}"]`);
    if (step) {
        step.classList.remove('completed');
    }
}

function updatePlaybookProgress() {
    const totalSteps = document.querySelectorAll('.interactive-step').length;
    const completed = playbookState.completedSteps.length;
    const percentage = totalSteps > 0 ? (completed / totalSteps) * 100 : 0;
    
    // Update progress bar
    const progressFill = document.getElementById('playbookProgressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    // Update stats
    const progressValue = document.getElementById('playbookProgress');
    if (progressValue) {
        progressValue.textContent = Math.round(percentage) + '%';
    }
    
    const completedSteps = document.getElementById('playbookCompletedSteps');
    if (completedSteps) {
        completedSteps.textContent = `${completed}/${totalSteps}`;
    }
    
    // Calculate total time
    let totalTime = 0;
    Object.values(playbookState.stepTimes).forEach(time => {
        totalTime += time.elapsed || 0;
    });
    
    const totalTimeElement = document.getElementById('playbookTotalTime');
    if (totalTimeElement) {
        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);
        totalTimeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function resetPlaybook() {
    if (confirm('¿Reiniciar la simulación del playbook? Se perderá el progreso actual.')) {
        playbookState = {
            currentStep: 0,
            completedSteps: [],
            startTime: null,
            stepTimes: {}
        };
        
        // Reset checkboxes
        document.querySelectorAll('.step-checkbox').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset step classes
        document.querySelectorAll('.interactive-step').forEach(step => {
            step.classList.remove('completed');
        });
        
        // Reset timers
        document.querySelectorAll('.timer-value').forEach(timer => {
            timer.textContent = '00:00';
        });
        
        updatePlaybookProgress();
    }
}

function validatePlaybook() {
    const totalSteps = document.querySelectorAll('.interactive-step').length;
    const completed = playbookState.completedSteps.length;
    
    if (completed === totalSteps) {
        alert('✅ ¡Excelente! Todos los pasos del playbook han sido completados correctamente.');
    } else {
        const missing = totalSteps - completed;
        alert(`⚠️ Faltan ${missing} paso(s) por completar. Por favor, complete todos los pasos antes de finalizar.`);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for playbook to be loaded
    setTimeout(initializePlaybookSimulation, 500);
});
