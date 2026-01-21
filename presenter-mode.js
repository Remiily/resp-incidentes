// Modo Presentador - Panel de Notas, Timer, Modo Avanzado

let presenterMode = {
    active: false,
    notes: {},
    timers: {},
    currentSlideTimer: null
};

// Initialize Presenter Mode
function initializePresenterMode() {
    createPresenterPanel();
    loadPresenterNotes();
    setupSlideTimers();
    
    // Keyboard shortcut: P for presenter mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            togglePresenterMode();
        }
    });
}

// Create Presenter Panel
function createPresenterPanel() {
    const panel = document.createElement('div');
    panel.id = 'presenterPanel';
    panel.className = 'presenter-panel';
    panel.innerHTML = `
        <div class="presenter-header">
            <h3>Modo Presentador</h3>
            <button id="closePresenter" class="close-presenter">×</button>
        </div>
        <div class="presenter-content">
            <div class="presenter-section">
                <h4>Notas de Presentación</h4>
                <textarea id="presenterNotes" class="presenter-notes" placeholder="Escribe tus notas aquí..."></textarea>
                <div class="presenter-actions">
                    <button id="saveNotes" class="btn-presenter">Guardar Notas</button>
                    <button id="exportNotes" class="btn-presenter">Exportar PDF</button>
                </div>
            </div>
            <div class="presenter-section">
                <h4>Timer de Presentación</h4>
                <div class="timer-display">
                    <div class="timer-main" id="timerMain">00:00</div>
                    <div class="timer-controls">
                        <button id="startTimer" class="btn-timer">▶ Iniciar</button>
                        <button id="pauseTimer" class="btn-timer">⏸ Pausar</button>
                        <button id="resetTimer" class="btn-timer">⏹ Reiniciar</button>
                    </div>
                    <div class="timer-slide">
                        <span>Tiempo en esta slide: <span id="slideTimer">00:00</span></span>
                    </div>
                </div>
            </div>
            <div class="presenter-section">
                <h4>Información de la Slide</h4>
                <div class="slide-info">
                    <p><strong>Slide Actual:</strong> <span id="currentSlideNum">1</span></p>
                    <p><strong>Título:</strong> <span id="currentSlideTitle">-</span></p>
                    <p><strong>Puntos Clave:</strong></p>
                    <ul id="slideKeyPoints"></ul>
                </div>
            </div>
            <div class="presenter-section">
                <h4>Próxima Slide</h4>
                <div class="next-slide-preview" id="nextSlidePreview">
                    <p>No hay siguiente slide</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    // Event listeners
    document.getElementById('closePresenter').addEventListener('click', () => {
        togglePresenterMode();
    });
    
    document.getElementById('saveNotes').addEventListener('click', savePresenterNotes);
    document.getElementById('exportNotes').addEventListener('click', exportNotesToPDF);
    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    
    // Auto-save notes
    document.getElementById('presenterNotes').addEventListener('input', debounce(savePresenterNotes, 1000));
}

// Toggle Presenter Mode
function togglePresenterMode() {
    presenterMode.active = !presenterMode.active;
    const panel = document.getElementById('presenterPanel');
    panel.classList.toggle('active', presenterMode.active);
    
    if (presenterMode.active) {
        updatePresenterInfo();
        loadNotesForCurrentSlide();
    }
}

// Load Presenter Notes from localStorage
function loadPresenterNotes() {
    const saved = localStorage.getItem('presenter-notes');
    if (saved) {
        presenterMode.notes = JSON.parse(saved);
    }
}

// Save Presenter Notes
function savePresenterNotes() {
    const currentSlide = getCurrentSlideNumber();
    const notesText = document.getElementById('presenterNotes').value;
    
    presenterMode.notes[currentSlide] = notesText;
    localStorage.setItem('presenter-notes', JSON.stringify(presenterMode.notes));
    
    // Show save confirmation
    const btn = document.getElementById('saveNotes');
    const originalText = btn.textContent;
    btn.textContent = '✓ Guardado';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Load Notes for Current Slide
function loadNotesForCurrentSlide() {
    const currentSlide = getCurrentSlideNumber();
    const notes = presenterMode.notes[currentSlide] || '';
    document.getElementById('presenterNotes').value = notes;
}

// Export Notes to PDF
function exportNotesToPDF() {
    if (typeof html2pdf === 'undefined') {
        alert('Función de exportación no disponible. Usa Ctrl+P para imprimir.');
        return;
    }
    
    const notesContent = Object.entries(presenterMode.notes)
        .map(([slide, note]) => `Slide ${slide}:\n${note}\n\n`)
        .join('');
    
    const element = document.createElement('div');
    element.innerHTML = `<h1>Notas de Presentación</h1><pre>${notesContent}</pre>`;
    
    html2pdf().from(element).save('Notas_Presentacion.pdf');
}

// Timer Functions
let timerInterval = null;
let timerStartTime = null;
let timerPausedTime = 0;
let slideStartTime = null;

function startTimer() {
    if (timerInterval) return;
    
    timerStartTime = Date.now() - timerPausedTime;
    slideStartTime = Date.now();
    
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('startTimer').disabled = true;
    document.getElementById('pauseTimer').disabled = false;
}

function pauseTimer() {
    if (!timerInterval) return;
    
    clearInterval(timerInterval);
    timerInterval = null;
    timerPausedTime = Date.now() - timerStartTime;
    
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStartTime = null;
    timerPausedTime = 0;
    slideStartTime = null;
    
    document.getElementById('timerMain').textContent = '00:00';
    document.getElementById('slideTimer').textContent = '00:00';
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
}

function updateTimer() {
    if (!timerStartTime) return;
    
    const elapsed = Date.now() - timerStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('timerMain').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (slideStartTime) {
        const slideElapsed = Date.now() - slideStartTime;
        const slideMinutes = Math.floor(slideElapsed / 60000);
        const slideSeconds = Math.floor((slideElapsed % 60000) / 1000);
        document.getElementById('slideTimer').textContent = 
            `${String(slideMinutes).padStart(2, '0')}:${String(slideSeconds).padStart(2, '0')}`;
    }
}

// Setup Slide Timers
function setupSlideTimers() {
    // Reset slide timer on slide change
    document.addEventListener('slideChanged', () => {
        slideStartTime = Date.now();
        if (presenterMode.active) {
            updatePresenterInfo();
            loadNotesForCurrentSlide();
        }
    });
}

// Update Presenter Info
function updatePresenterInfo() {
    const currentSlide = document.querySelector('.slide.active');
    if (!currentSlide) return;
    
    const slideNum = getCurrentSlideNumber();
    const slideTitle = currentSlide.querySelector('.slide-title')?.textContent || '-';
    const keyPoints = extractKeyPoints(currentSlide);
    
    document.getElementById('currentSlideNum').textContent = slideNum;
    document.getElementById('currentSlideTitle').textContent = slideTitle;
    
    const keyPointsList = document.getElementById('slideKeyPoints');
    keyPointsList.innerHTML = keyPoints.map(point => `<li>${point}</li>`).join('');
    
    // Next slide preview
    const nextSlide = getNextSlide();
    const nextPreview = document.getElementById('nextSlidePreview');
    if (nextSlide) {
        const nextTitle = nextSlide.querySelector('.slide-title')?.textContent || 'Sin título';
        nextPreview.innerHTML = `<p><strong>Slide ${parseInt(nextSlide.dataset.slide)}:</strong> ${nextTitle}</p>`;
    } else {
        nextPreview.innerHTML = '<p>No hay siguiente slide</p>';
    }
}

// Extract Key Points from Slide
function extractKeyPoints(slide) {
    const points = [];
    const headings = slide.querySelectorAll('h3, h4');
    headings.forEach(heading => {
        const text = heading.textContent.trim();
        if (text && text.length < 100) {
            points.push(text);
        }
    });
    return points.slice(0, 5); // Limit to 5 key points
}

// Get Current Slide Number
function getCurrentSlideNumber() {
    const currentSlide = document.querySelector('.slide.active');
    return currentSlide ? parseInt(currentSlide.dataset.slide) : 1;
}

// Get Next Slide
function getNextSlide() {
    const currentSlide = document.querySelector('.slide.active');
    if (!currentSlide) return null;
    
    const currentNum = parseInt(currentSlide.dataset.slide);
    return document.querySelector(`.slide[data-slide="${currentNum + 1}"]`);
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializePresenterMode);

// Add presenter mode toggle button
document.addEventListener('DOMContentLoaded', () => {
    const controls = document.querySelector('.additional-controls');
    if (controls) {
        const presenterBtn = document.createElement('button');
        presenterBtn.id = 'presenterBtn';
        presenterBtn.className = 'control-btn';
        presenterBtn.title = 'Modo Presentador (Ctrl+P)';
        presenterBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
        `;
        presenterBtn.addEventListener('click', togglePresenterMode);
        controls.appendChild(presenterBtn);
    }
});
