// Sistema de Autenticación Segura para Modo Edición
// Usa hash SHA-256 para almacenar contraseña de forma segura

class SecureAuth {
    constructor() {
        this.isAuthenticated = false;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.sessionTimer = null;
        this.maxAttempts = 5;
        this.attempts = 0;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutos de bloqueo
        this.lockoutUntil = null;
        
        // Hash SHA-256 de la contraseña se genera al inicializar
        this.passwordHash = null;
        this.initializeAuth();
    }
    
    async initializeAuth() {
        // Generar hash de contraseña: "Cracker"
        const defaultPassword = "Cracker";
        this.passwordHash = await this.hashPassword(defaultPassword);
        
        // Verificar si hay sesión activa
        this.checkSession();
        
        // Crear modal de autenticación
        this.createAuthModal();
    }
    
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    async verifyPassword(password) {
        const hash = await this.hashPassword(password);
        return hash === this.passwordHash;
    }
    
    checkSession() {
        const sessionData = sessionStorage.getItem('edit-session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = Date.now();
                
                if (now < session.expires) {
                    this.isAuthenticated = true;
                    this.startSessionTimer();
                    return true;
                } else {
                    sessionStorage.removeItem('edit-session');
                }
            } catch (e) {
                sessionStorage.removeItem('edit-session');
            }
        }
        return false;
    }
    
    createSession() {
        const expires = Date.now() + this.sessionTimeout;
        const session = {
            authenticated: true,
            expires: expires,
            timestamp: Date.now()
        };
        sessionStorage.setItem('edit-session', JSON.stringify(session));
        this.isAuthenticated = true;
        this.startSessionTimer();
    }
    
    startSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        
        this.sessionTimer = setTimeout(() => {
            this.logout();
            alert('Sesión expirada por seguridad. Por favor, autentíquese nuevamente.');
        }, this.sessionTimeout);
    }
    
    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('edit-session');
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.hideAuthModal();
        if (window.toggleEditMode && window.editMode) {
            window.toggleEditMode(); // Desactivar modo edición si está activo
        }
    }
    
    createAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>🔒 Autenticación Requerida</h2>
                    <p>Ingrese la contraseña para activar el modo de edición</p>
                </div>
                <form id="authForm" class="auth-form">
                    <div class="auth-input-group">
                        <label for="authPassword">Contraseña:</label>
                        <input type="password" id="authPassword" class="auth-input" 
                               placeholder="Ingrese la contraseña" autocomplete="off" required>
                        <button type="button" id="togglePassword" class="toggle-password" title="Mostrar/Ocultar">
                            👁️
                        </button>
                    </div>
                    <div id="authError" class="auth-error"></div>
                    <div id="authAttempts" class="auth-attempts"></div>
                    <div class="auth-actions">
                        <button type="submit" id="authSubmit" class="auth-btn">Autenticar</button>
                        <button type="button" id="authCancel" class="auth-btn auth-btn-cancel">Cancelar</button>
                    </div>
                </form>
                <div class="auth-footer">
                    <small>Máximo 5 intentos. Bloqueo de 15 minutos después de intentos fallidos.</small>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        document.getElementById('authCancel').addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.hideAuthModal();
            }
        });
        
        // Prevenir cierre accidental
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // No cerrar al hacer click fuera
            }
        });
    }
    
    async handleAuth() {
        const passwordInput = document.getElementById('authPassword');
        const errorDiv = document.getElementById('authError');
        const attemptsDiv = document.getElementById('authAttempts');
        const submitBtn = document.getElementById('authSubmit');
        
        // Verificar bloqueo
        if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
            const remaining = Math.ceil((this.lockoutUntil - Date.now()) / 1000 / 60);
            errorDiv.textContent = `Cuenta bloqueada. Intente nuevamente en ${remaining} minutos.`;
            errorDiv.style.display = 'block';
            return;
        }
        
        // Resetear bloqueo si ya pasó
        if (this.lockoutUntil && Date.now() >= this.lockoutUntil) {
            this.lockoutUntil = null;
            this.attempts = 0;
        }
        
        const password = passwordInput.value;
        
        if (!password) {
            errorDiv.textContent = 'Por favor, ingrese una contraseña.';
            errorDiv.style.display = 'block';
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';
        
        // Simular delay de seguridad (prevenir timing attacks)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const isValid = await this.verifyPassword(password);
        
        if (isValid) {
            // Autenticación exitosa
            this.attempts = 0;
            this.lockoutUntil = null;
            this.createSession();
            this.hideAuthModal();
            passwordInput.value = '';
            errorDiv.style.display = 'none';
            attemptsDiv.style.display = 'none';
            
            // Activar modo edición
            if (window.toggleEditMode && !window.editMode) {
                window.toggleEditMode();
            }
        } else {
            // Autenticación fallida
            this.attempts++;
            const remaining = this.maxAttempts - this.attempts;
            
            if (remaining > 0) {
                errorDiv.textContent = `Contraseña incorrecta. ${remaining} intento(s) restante(s).`;
                errorDiv.style.display = 'block';
                attemptsDiv.textContent = `Intentos: ${this.attempts}/${this.maxAttempts}`;
                attemptsDiv.style.display = 'block';
            } else {
                // Bloquear cuenta
                this.lockoutUntil = Date.now() + this.lockoutTime;
                errorDiv.textContent = 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.';
                errorDiv.style.display = 'block';
                attemptsDiv.style.display = 'none';
            }
            
            passwordInput.value = '';
            passwordInput.focus();
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Autenticar';
    }
    
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('authPassword');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    }
    
    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('authPassword').focus();
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('authPassword').value = '';
            document.getElementById('authError').style.display = 'none';
            document.getElementById('authAttempts').style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    requireAuth(callback) {
        if (this.isAuthenticated) {
            callback();
        } else {
            this.showAuthModal();
        }
    }
}

// Inicializar autenticación
const secureAuth = new SecureAuth();

// Interceptar toggle de modo edición
document.addEventListener('DOMContentLoaded', () => {
    const originalToggle = window.toggleEditMode;
    
    if (originalToggle) {
        window.toggleEditMode = function() {
            if (!window.editMode) {
                // Intentar activar modo edición - requiere autenticación
                secureAuth.requireAuth(() => {
                    originalToggle();
                });
            } else {
                // Desactivar modo edición - no requiere autenticación
                originalToggle();
            }
        };
    }
    
    // También interceptar click directo en el botón
    const editToggle = document.getElementById('editModeToggle');
    if (editToggle) {
        editToggle.addEventListener('click', (e) => {
            if (!window.editMode) {
                e.preventDefault();
                secureAuth.requireAuth(() => {
                    if (originalToggle) {
                        originalToggle();
                    }
                });
            }
        });
    }
});

// Exportar para uso externo
if (typeof window !== 'undefined') {
    window.secureAuth = secureAuth;
}
