// Edit Mode Functionality
let editMode = false;
window.editMode = false; // Expose to global scope

document.addEventListener('DOMContentLoaded', () => {
    const editToggle = document.getElementById('editModeToggle');
    
    if (editToggle) {
        // El click ahora es manejado por auth.js
        // editToggle.addEventListener('click', toggleEditMode);
    }
    
    // Initialize edit mode state
    updateEditModeUI();
});

function toggleEditMode() {
    editMode = !editMode;
    window.editMode = editMode; // Update global
    updateEditModeUI();
    
    if (editMode) {
        enableEditMode();
    } else {
        disableEditMode();
    }
}

function updateEditModeUI() {
    const editToggle = document.getElementById('editModeToggle');
    if (editToggle) {
        if (editMode) {
            editToggle.classList.add('active');
            editToggle.title = 'Desactivar modo edición';
        } else {
            editToggle.classList.remove('active');
            editToggle.title = 'Activar modo edición';
        }
    }
    
    // Update body class
    document.body.classList.toggle('edit-mode', editMode);
}

function enableEditMode() {
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        element.classList.add('editable-active');
        element.addEventListener('click', handleEditClick);
    });
}

function disableEditMode() {
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        element.classList.remove('editable-active');
        element.removeEventListener('click', handleEditClick);
        
        // Save any pending changes
        if (element.isContentEditable) {
            element.contentEditable = 'false';
            element.blur();
        }
    });
}

function handleEditClick(e) {
    if (!editMode) return;
    
    e.stopPropagation();
    const element = e.currentTarget;
    
    // Don't edit if clicking on a button or interactive element
    if (e.target.closest('button') || e.target.closest('.check-btn') || e.target.closest('.step-toggle')) {
        return;
    }
    
    const editType = element.getAttribute('data-edit') || 'text';
    
    if (editType === 'text') {
        makeEditable(element);
    }
}

function makeEditable(element) {
    // Store original content
    const originalContent = element.innerHTML;
    
    // Make content editable
    element.contentEditable = 'true';
    element.focus();
    
    // Select all text for easy replacement
    if (window.getSelection && document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // Handle save on blur or Enter
    const saveEdit = () => {
        element.contentEditable = 'false';
        element.classList.remove('editing');
        
        // Trigger chart update if needed
        if (element.closest('.chart-container-small') || element.closest('.chart-container-medium')) {
            updateCharts();
        }
    };
    
    element.addEventListener('blur', saveEdit, { once: true });
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            element.blur();
        }
        if (e.key === 'Escape') {
            element.innerHTML = originalContent;
            element.blur();
        }
    }, { once: true });
    
    element.classList.add('editing');
}

// Save content to localStorage
function saveToLocalStorage() {
    const editableElements = document.querySelectorAll('.editable');
    const content = {};
    
    editableElements.forEach((element, index) => {
        const key = element.getAttribute('data-edit-key') || `editable-${index}`;
        content[key] = element.innerHTML;
    });
    
    localStorage.setItem('presentation-content', JSON.stringify(content));
}

// Load content from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('presentation-content');
    if (!saved) return;
    
    try {
        const content = JSON.parse(saved);
        const editableElements = document.querySelectorAll('.editable');
        
        editableElements.forEach((element, index) => {
            const key = element.getAttribute('data-edit-key') || `editable-${index}`;
            if (content[key]) {
                element.innerHTML = content[key];
            }
        });
        
        // Update charts after loading
        setTimeout(updateCharts, 100);
    } catch (e) {
        console.error('Error loading saved content:', e);
    }
}

// Auto-save on changes
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('editable') && e.target.isContentEditable) {
        saveToLocalStorage();
    }
});

// Load saved content on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});

// Export function for external use
if (typeof window !== 'undefined') {
    window.toggleEditMode = toggleEditMode;
    window.saveToLocalStorage = saveToLocalStorage;
    window.loadFromLocalStorage = loadFromLocalStorage;
}
