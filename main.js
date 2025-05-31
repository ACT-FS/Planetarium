// Variables globales
let scene, camera, renderer, controls;
let sun,
  planets = {},
  orbits = [],
  stars;
let animationSpeed = 1;
let showOrbits = true;
let showStars = true;
let followTarget = null;
let viewType = "orbit";
let isAnimatingCamera = false;
let audioContext,
  masterGain,
  audioEnabled = false;
let audioSources = {};

// Configuraciones de vista por planeta
const viewConfigs = {
  orbit: { distance: 15, height: 8, angle: 0.3 },
  close: { distance: 8, height: 3, angle: 0.1 },
  surface: { distance: 3, height: 1, angle: 0 },
  cinematic: { distance: 20, height: 15, angle: 0.5 },
};

// Datos de los planetas
const planetData = {
  mercury: {
    size: 0.8,
    color: 0x8c7853,
    distance: 15,
    speed: 4.7,
    info: "Mercurio es el planeta más cercano al Sol. Temperaturas extremas de -173°C a 427°C.",
  },
  venus: {
    size: 1.2,
    color: 0xffc649,
    distance: 20,
    speed: 3.5,
    info: "Venus es el planeta más caliente del sistema solar con una atmósfera tóxica de CO2.",
  },
  earth: {
    size: 1.3,
    color: 0x6b93d6,
    distance: 25,
    speed: 3.0,
    info: "La Tierra, nuestro hogar. 71% de su superficie está cubierta por océanos.",
  },
  mars: {
    size: 1.0,
    color: 0xcd5c5c,
    distance: 30,
    speed: 2.4,
    info: "Marte, el planeta rojo. Tiene las montañas más altas y cañones más profundos del sistema solar.",
  },
  jupiter: {
    size: 3.5,
    color: 0xd8ca9d,
    distance: 45,
    speed: 1.3,
    info: "Júpiter es el planeta más grande. Su Gran Mancha Roja es una tormenta gigante.",
  },
  saturn: {
    size: 3.0,
    color: 0xfad5a5,
    distance: 60,
    speed: 0.9,
    info: "Saturno es famoso por sus espectaculares anillos hechos de hielo y roca.",
  },
};

// Inicialización
function init() {
  // Crear escena
  scene = new THREE.Scene();

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 50, 200);

  // Configurar renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.getElementById("container").appendChild(renderer.domElement);

  // Inicializar audio
  initializeAudio();

  // Crear campo de estrellas
  createStarField();

  // Crear sol
  createSun();

  // Crear planetas
  createPlanets();

  // Crear órbitas
  createOrbits();

  // Configurar controles
  setupControls();

  // Configurar eventos
  setupEvents();

  // Ocultar loading
  document.getElementById("loading").style.display = "none";

  // Iniciar animación
  animate();
}

function createStarField() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 2000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000;
    positions[i + 1] = (Math.random() - 0.5) * 2000;
    positions[i + 2] = (Math.random() - 0.5) * 2000;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.8,
  });

  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function createSun() {
  const sunGeometry = new THREE.SphereGeometry(5, 64, 64);

  // Crear textura procedural para el sol
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Gradiente base del sol
  const gradient = ctx.createRadialGradient(256, 128, 0, 256, 128, 256);
  gradient.addColorStop(0, "#ffff99");
  gradient.addColorStop(0.3, "#ffcc00");
  gradient.addColorStop(0.6, "#ff9900");
  gradient.addColorStop(1, "#ff6600");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);

  // Añadir manchas solares y texturas
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const size = Math.random() * 20 + 5;
    const opacity = Math.random() * 0.3 + 0.1;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#cc4400";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  const sunTexture = new THREE.CanvasTexture(canvas);

  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    transparent: true,
    opacity: 0.95,
  });

  sun = new THREE.Mesh(sunGeometry, sunMaterial);

  // Añadir corona solar
  const coronaGeometry = new THREE.SphereGeometry(6.5, 32, 32);
  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });

  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sun.add(corona);

  scene.add(sun);

  // Añadir luz del sol
  const sunLight = new THREE.PointLight(0xffffff, 2, 500);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
}

function createPlanets() {
  Object.entries(planetData).forEach(([name, data]) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: data.color });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.userData = { name, ...data };

    // Añadir anillos a Saturno
    if (name === "saturn") {
      const ringGeometry = new THREE.RingGeometry(
        data.size + 1,
        data.size + 3,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      planet.add(rings);
    }

    scene.add(planet);
    planets[name] = planet;
  });
}

function createOrbits() {
  Object.entries(planetData).forEach(([name, data]) => {
    const orbitGeometry = new THREE.RingGeometry(
      data.distance - 0.1,
      data.distance + 0.1,
      64
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });

    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    orbits.push(orbit);
  });
}

function setupControls() {
  // Control de velocidad
  document.getElementById("speed").addEventListener("input", (e) => {
    animationSpeed = parseFloat(e.target.value);
  });

  // Control de zoom
  document.getElementById("zoom").addEventListener("input", (e) => {
    const distance = parseInt(e.target.value);
    if (!followTarget) {
      camera.position.setLength(distance);
    }
  });

  // Control de seguimiento
  document.getElementById("follow").addEventListener("change", (e) => {
    followTarget = e.target.value ? planets[e.target.value] : null;
    if (followTarget) {
      animateToTarget();
    }
  });

  // Control de tipo de vista
  document.getElementById("viewType").addEventListener("change", (e) => {
    viewType = e.target.value;
    if (followTarget) {
      animateToTarget();
    }
  });

  // Control de volumen
  document.getElementById("volume").addEventListener("input", (e) => {
    if (masterGain) {
      masterGain.gain.value = parseFloat(e.target.value);
    }
  });
}

function setupEvents() {
  // Redimensionar ventana
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Click en planetas
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(planets));

    if (intersects.length > 0) {
      const planet = intersects[0].object;
      showPlanetInfo(planet.userData);
    }
  });

  // Controles de cámara con mouse
  let mouseDown = false;
  let mouseX = 0,
    mouseY = 0;

  renderer.domElement.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  renderer.domElement.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  renderer.domElement.addEventListener("mousemove", (e) => {
    if (!mouseDown || followTarget) return;

    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;

    camera.position.x += deltaX * 0.5;
    camera.position.y -= deltaY * 0.5;
    camera.lookAt(0, 0, 0);

    mouseX = e.clientX;
    mouseY = e.clientY;
  });
}

function showPlanetInfo(planetInfo) {
  const panel = document.getElementById("info-panel");
  const name = document.getElementById("planet-name");
  const details = document.getElementById("planet-details");

  name.textContent =
    planetInfo.name.charAt(0).toUpperCase() + planetInfo.name.slice(1);
  details.innerHTML = `
                <div class="planet-info">
                    <strong>Información:</strong><br>
                    ${planetInfo.info}
                </div>
                <div class="planet-info">
                    <strong>Distancia del Sol:</strong> ${planetInfo.distance} AU<br>
                    <strong>Tamaño relativo:</strong> ${planetInfo.size}x<br>
                    <strong>Velocidad orbital:</strong> ${planetInfo.speed}x
                </div>
            `;

  panel.style.display = "block";

  setTimeout(() => {
    panel.style.display = "none";
  }, 5000);
}

function resetView() {
  followTarget = null;
  document.getElementById("follow").value = "";
  animateCameraTo(new THREE.Vector3(0, 50, 200), new THREE.Vector3(0, 0, 0));
}

function animateCameraTo(targetPosition, lookAtPosition, duration = 2000) {
  if (isAnimatingCamera) return;

  isAnimatingCamera = true;
  const startPosition = camera.position.clone();
  const startTime = Date.now();

  function updateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Usar easing suave
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
    camera.lookAt(lookAtPosition);

    if (progress < 1) {
      requestAnimationFrame(updateCamera);
    } else {
      isAnimatingCamera = false;
    }
  }

  updateCamera();
}

function animateToTarget() {
  if (!followTarget) return;

  const config = viewConfigs[viewType];
  const planetPos = followTarget.position.clone();
  const planetSize = followTarget.userData.size;

  let targetPos, lookAt;

  switch (viewType) {
    case "orbit":
      targetPos = planetPos
        .clone()
        .add(
          new THREE.Vector3(
            config.distance + planetSize * 2,
            config.height + planetSize,
            config.distance + planetSize * 2
          )
        );
      lookAt = planetPos;
      break;

    case "close":
      targetPos = planetPos
        .clone()
        .add(
          new THREE.Vector3(
            config.distance + planetSize,
            config.height,
            config.distance + planetSize
          )
        );
      lookAt = planetPos;
      break;

    case "surface":
      targetPos = planetPos
        .clone()
        .add(new THREE.Vector3(planetSize + 1, 0.5, planetSize + 1));
      lookAt = planetPos;
      break;

    case "cinematic":
      const angle = Date.now() * 0.001;
      targetPos = planetPos
        .clone()
        .add(
          new THREE.Vector3(
            Math.cos(angle) * (config.distance + planetSize * 3),
            config.height + planetSize * 2,
            Math.sin(angle) * (config.distance + planetSize * 3)
          )
        );
      lookAt = planetPos;
      break;
  }

  animateCameraTo(targetPos, lookAt);
}

// Sistema de Audio Estelar
function initializeAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.3;
  } catch (e) {
    console.log("Audio no soportado");
  }
}

function createAmbientSound() {
  if (!audioContext) return null;

  // Crear ruido espacial de fondo
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const data = buffer.getChannelData(0);

  // Generar ruido rosa filtrado para sonido espacial
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.1;
  }

  // Aplicar filtro paso bajo para suavizar
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 200;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = audioContext.createGain();
  gain.gain.value = 0.05;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  return { source, gain };
}

function createPlanetSound(frequency, type = "sine") {
  if (!audioContext) return null;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  filter.type = "lowpass";
  filter.frequency.value = frequency * 2;

  gain.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  oscillator.start();

  return { oscillator, gain, filter };
}

function createSolarWindSound() {
  if (!audioContext) return null;

  // Sonido del viento solar usando múltiples osciladores
  const oscillators = [];
  const mainGain = audioContext.createGain();
  mainGain.gain.value = 0.02;
  mainGain.connect(masterGain);

  for (let i = 0; i < 3; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.value = 60 + i * 20;

    filter.type = "highpass";
    filter.frequency.value = 100;

    gain.gain.value = 0.3;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(mainGain);

    osc.start();
    oscillators.push({ osc, gain, filter });
  }

  return { oscillators, mainGain };
}

function toggleAudio() {
  if (!audioContext) {
    alert("Audio no soportado en este navegador");
    return;
  }

  const btn = document.getElementById("audioBtn");

  if (!audioEnabled) {
    // Activar audio
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Crear sonidos
    audioSources.ambient = createAmbientSound();
    audioSources.solarWind = createSolarWindSound();

    // Sonidos específicos para planetas
    audioSources.planetSounds = {
      mercury: createPlanetSound(220, "sine"),
      venus: createPlanetSound(174, "triangle"),
      earth: createPlanetSound(136, "sine"),
      mars: createPlanetSound(144, "sawtooth"),
      jupiter: createPlanetSound(183, "sine"),
      saturn: createPlanetSound(147, "triangle"),
    };

    // Iniciar sonidos de fondo
    if (audioSources.ambient) {
      audioSources.ambient.source.start();
    }

    audioEnabled = true;
    btn.textContent = "🔇 Silencio";
    btn.style.background = "linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%)";
  } else {
    // Desactivar audio
    if (audioSources.ambient) {
      audioSources.ambient.source.stop();
    }

    Object.values(audioSources.planetSounds || {}).forEach((sound) => {
      if (sound && sound.oscillator) {
        sound.oscillator.stop();
      }
    });

    if (audioSources.solarWind) {
      audioSources.solarWind.oscillators.forEach((osc) => {
        osc.osc.stop();
      });
    }

    audioEnabled = false;
    btn.textContent = "🔊 Sonido";
    btn.style.background = "linear-gradient(45deg, #667eea 0%, #764ba2 100%)";
  }
}

function setPresetView(preset) {
  followTarget = null;
  document.getElementById("follow").value = "";

  let targetPos, lookAt;

  switch (preset) {
    case "overview":
      targetPos = new THREE.Vector3(0, 80, 150);
      lookAt = new THREE.Vector3(0, 0, 0);
      break;

    case "inner":
      targetPos = new THREE.Vector3(40, 20, 40);
      lookAt = new THREE.Vector3(0, 0, 0);
      break;

    case "outer":
      targetPos = new THREE.Vector3(-80, 30, 80);
      lookAt = new THREE.Vector3(0, 0, 0);
      break;

    case "sun":
      targetPos = new THREE.Vector3(15, 5, 15);
      lookAt = new THREE.Vector3(0, 0, 0);
      break;
  }

  animateCameraTo(targetPos, lookAt);
}

function toggleOrbits() {
  showOrbits = !showOrbits;
  orbits.forEach((orbit) => {
    orbit.visible = showOrbits;
  });
}

function toggleStars() {
  showStars = !showStars;
  stars.visible = showStars;
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001 * animationSpeed;

  // Rotar el sol
  sun.rotation.y += 0.01 * animationSpeed;

  // Animar planetas
  Object.entries(planets).forEach(([name, planet]) => {
    const data = planetData[name];
    const angle = time * data.speed * 0.1;

    planet.position.x = Math.cos(angle) * data.distance;
    planet.position.z = Math.sin(angle) * data.distance;
    planet.rotation.y += 0.02 * animationSpeed;

    // Modular sonidos planetarios según proximidad
    if (
      audioEnabled &&
      audioSources.planetSounds &&
      audioSources.planetSounds[name]
    ) {
      const distance = camera.position.distanceTo(planet.position);
      const maxDistance = 100;
      const volume = Math.max(0, 1 - distance / maxDistance) * 0.1;

      if (audioSources.planetSounds[name].gain) {
        audioSources.planetSounds[name].gain.gain.setValueAtTime(
          volume,
          audioContext.currentTime
        );
      }
    }
  });

  // Modular viento solar según proximidad al sol
  if (audioEnabled && audioSources.solarWind) {
    const distanceToSun = camera.position.length();
    const solarWindVolume = Math.max(0, 1 - distanceToSun / 200) * 0.05;
    audioSources.solarWind.mainGain.gain.setValueAtTime(
      solarWindVolume,
      audioContext.currentTime
    );
  }

  // Seguir planeta seleccionado
  if (followTarget && !isAnimatingCamera) {
    const config = viewConfigs[viewType];
    const planetPos = followTarget.position.clone();
    const planetSize = followTarget.userData.size;

    let targetPos,
      lookAt = planetPos;

    switch (viewType) {
      case "orbit":
        targetPos = planetPos
          .clone()
          .add(
            new THREE.Vector3(
              config.distance + planetSize * 2,
              config.height + planetSize,
              config.distance + planetSize * 2
            )
          );
        break;

      case "close":
        targetPos = planetPos
          .clone()
          .add(
            new THREE.Vector3(
              config.distance + planetSize,
              config.height,
              config.distance + planetSize
            )
          );
        break;

      case "surface":
        targetPos = planetPos
          .clone()
          .add(new THREE.Vector3(planetSize + 1, 0.5, planetSize + 1));
        break;

      case "cinematic":
        const cinematicAngle = time * 0.5;
        targetPos = planetPos
          .clone()
          .add(
            new THREE.Vector3(
              Math.cos(cinematicAngle) * (config.distance + planetSize * 3),
              config.height + planetSize * 2,
              Math.sin(cinematicAngle) * (config.distance + planetSize * 3)
            )
          );
        break;
    }

    // Suavizar movimiento de cámara
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(lookAt);
  }

  // Rotar estrellas lentamente
  if (stars) {
    stars.rotation.y += 0.0005 * animationSpeed;
  }

  renderer.render(scene, camera);
}

// Inicializar cuando se cargue la página
window.addEventListener("load", init);
