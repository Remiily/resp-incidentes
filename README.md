# Presentación Web - Plan de Gestión de Incidentes

Presentación interactiva sobre el Plan de Gestión de Incidentes para Cumplo, desarrollada para la Universidad Adolfo Ibáñez.

## 🚀 Inicio Rápido

Abre el archivo `index.html` en tu navegador web preferido.

### Servidor Local (Recomendado)

Para una mejor experiencia, usa un servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## ⌨️ Controles

- **Flechas** ← → : Navegar entre slides
- **Home/End** : Ir al primer/último slide
- **F** : Pantalla completa
- **Doble Click** : Activar/desactivar pantalla completa
- **Touch/Swipe** : Navegación en dispositivos móviles

## 📋 Características

- ✅ 17 slides completos sobre gestión de incidentes
- ✅ Diseño responsive (desktop, tablet, móvil)
- ✅ Navegación intuitiva con teclado y touch
- ✅ Modo edición con autenticación
- ✅ Gráficos interactivos (Chart.js)
- ✅ Menú Q&A con preguntas frecuentes
- ✅ Anexos con información adicional
- ✅ Modo presentador y oyente
- ✅ Exportación a PDF
- ✅ Tema claro/oscuro

## 📁 Estructura del Proyecto

```
.
├── index.html          # Archivo principal
├── styles.css          # Estilos
├── script.js           # Navegación principal
├── charts.js           # Gráficos interactivos
├── edit-mode.js        # Modo edición
├── auth.js             # Autenticación
├── features.js         # Funciones adicionales
├── qa-anexos.js        # Menús Q&A y Anexos
├── presenter-mode.js   # Modo presentador
├── listener-mode.js    # Modo oyente
├── playbook-simulation.js # Simulación de playbooks
└── performance.js      # Optimizaciones
```

## 🎨 Personalización

### Colores

Modifica los colores en `styles.css`:

```css
:root {
    --uai-blue: #003366;
    --uai-light-blue: #0066CC;
    --uai-gold: #FFD700;
}
```

### Agregar Slides

Copia la estructura de una slide existente y actualiza el número total en `script.js`.

## 🔒 Modo Edición

El modo edición requiere autenticación. Actívalo desde el botón de edición en la interfaz.

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Navegadores móviles

## 👥 Equipo

- Eduardo Lucero
- José Antonio Montero
- Rodrigo Flores
- Gerson Cornejo

**Profesor**: Erich Oscar Zschaeck Medina

## 📄 Licencia

Proyecto académico desarrollado para la Universidad Adolfo Ibáñez.

---

*Versión 2.0 | Enero 2026*
