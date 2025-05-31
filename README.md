# 🌌 Planetario 3D Interactivo
Un simulador inmersivo del sistema solar creado con Three.js que permite explorar los planetas de manera interactiva con efectos visuales y sonoros.

## ✨ Características Principales
## 🪐 Simulación Realista

Sistema solar completo con 6 planetas principales (Mercurio, Venus, Tierra, Marte, Júpiter, Saturno)
Sol con corona y efectos de textura procedural
Órbitas planetarias con velocidades y distancias proporcionales
Anillos de Saturno con efectos de transparencia
Campo de estrellas de fondo con 2000+ estrellas

## 🎮 Controles Interactivos

Control de velocidad de la simulación (0-5x)
Zoom dinámico (50-500 unidades)
Seguimiento de planetas con múltiples modos de vista
Vistas predefinidas: General, Interior, Exterior, Sol
Controles de cámara con mouse para navegación libre

## 👁️ Modos de Vista

Vista Orbital: Perspectiva amplia del planeta
Vista Cercana: Acercamiento medio al planeta
Vista Superficie: Perspectiva muy cercana
Vista Cinemática: Rotación automática alrededor del planeta

## 🔊 Sistema de Audio Espacial

Sonido ambiental del espacio profundo
Viento solar con efectos de proximidad
Sonidos únicos por planeta basados en frecuencias específicas
Audio espacial 3D que varía según la distancia
Control de volumen independiente

## 📱 Interfaz Moderna

Diseño glassmorphism con efectos de desenfoque
Panel de información interactivo por planeta
Controles intuitivos con gradientes y animaciones
Responsive design adaptable a diferentes pantallas

## 🚀 Instalación y Uso
Requisitos Previos

Navegador web moderno con soporte para WebGL
Conexión a internet para cargar Three.js desde CDN

Instalación

Clonar o descargar los archivos del proyecto
Estructura de archivos necesaria:

planetario-3d/
├── index.html
├── main.js
├── style.css
└── README.md
Ejecución

Abrir index.html en un navegador web moderno
Esperar la carga (aparecerá el spinner de inicialización)
¡Explorar el sistema solar!


Nota: Para el audio, es necesario interactuar con la página antes de activar los sonidos (limitación de los navegadores).

## 🎯 Cómo Usar
### Navegación Básica

Arrastra con el mouse para mover la cámara libremente
Usa el zoom para acercarte o alejarte
Haz clic en cualquier planeta para ver información detallada

### Controles Avanzados

Velocidad: Ajusta la velocidad de rotación y órbita
Seguir Planeta: Selecciona un planeta para seguirlo automáticamente
Tipo de Vista: Cambia entre diferentes perspectivas del planeta seguido
Vistas Predefinidas: Botones rápidos para posiciones específicas

### Funciones Especiales

🎯 Resetear Vista: Vuelve a la vista inicial
🔄 Mostrar Órbitas: Activa/desactiva las líneas orbitales
⭐ Estrellas: Muestra/oculta el campo de estrellas
🔊 Sonido: Activa el sistema de audio espacial

## 🛠️ Tecnologías Utilizadas
Librerías Principales

Three.js r128: Motor 3D para gráficos WebGL
Web Audio API: Sistema de audio espacial y efectos sonoros
Canvas API: Generación de texturas procedurales

Características Técnicas

WebGL: Renderizado 3D acelerado por hardware
Shaders: Efectos visuales avanzados para materiales
Ray Casting: Detección de clics en objetos 3D
Animation Loops: Sistema de animación fluida a 60 FPS

## 📊 Datos Astronómicos
Los planetas incluyen información educativa real:
PlanetaCaracterísticas Especiales☿️ MercurioTemperaturas extremas (-173°C a 427°C)♀️ VenusAtmósfera tóxica de CO2, planeta más caliente🌍 Tierra71% océanos, nuestro hogar♂️ MarteMontañas más altas del sistema solar♃ JúpiterPlaneta más grande, Gran Mancha Roja♄ SaturnoAnillos espectaculares de hielo y roca
## 🎨 Personalización
Modificar Planetas
Edita el objeto planetData en main.js:
javascriptconst planetData = {
  nombrePlaneta: {
    size: 1.0,        // Tamaño relativo
    color: 0xff0000,  // Color hexadecimal
    distance: 25,     // Distancia del sol
    speed: 2.0,       // Velocidad orbital
    info: "Información del planeta"
  }
}
Personalizar Sonidos
Modifica las frecuencias en createPlanetSound():
javascriptaudioSources.planetSounds = {
  planeta: createPlanetSound(220, "sine"), // Hz, tipo de onda
}
Estilos Visuales
Edita style.css para cambiar:

Colores del interfaz
Efectos de glassmorphism
Animaciones y transiciones

## 🌟 Características Futuras
En Desarrollo

 Lunas planetarias con órbitas propias
 Asteroides y cometas con trayectorias realistas
 Texturas planetarias de alta resolución
 Información astronómica más detallada
 Modo VR para realidad virtual

Ideas Propuestas

 Viajes espaciales entre planetas
 Escalas de tiempo variables (días, años, siglos)
 Eventos astronómicos (eclipses, conjunciones)
 Modo educativo con lecciones interactivas

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Para contribuir:

Fork el proyecto
Crea una rama para tu característica (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request

## 📋 Problemas Conocidos
### Limitaciones Actuales

Audio: Requiere interacción del usuario antes de reproducir
Rendimiento: Puede ser lento en dispositivos móviles antiguos
Compatibilidad: Requiere navegadores con soporte WebGL 2.0

### Soluciones

Usar navegadores modernos (Chrome, Firefox, Safari, Edge)
Cerrar otras pestañas para mejorar rendimiento
Desactivar audio en dispositivos con recursos limitados

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor
Creado con ❤️ para la exploración espacial y el aprendizaje interactivo.


¡Explora el cosmos desde tu navegador! 🚀🌌
