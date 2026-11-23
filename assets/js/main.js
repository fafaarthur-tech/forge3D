/**
 * forge3D — Core Cinematic & Interactive Engine (Apple / Nike Tier)
 * Three.js Procedural 3D • GSAP ScrollTrigger • Lenis • Dynamic E-Commerce
 */

(function () {
  "use strict";

  // Global references
  const cfg = window.FORGE_CONFIG || {};
  const produtos = window.FORGE_PRODUTOS || [];
  const ideias = window.FORGE_IDEIAS || [];

  // Helper utilities
  const reais = (val) => "R$ " + (Number(val) || 0).toFixed(2).replace(".", ",");
  const $ = (id) => document.getElementById(id);
  const qAll = (sel) => Array.from(document.querySelectorAll(sel));

  /* ==========================================================================
     1. Toast Notification System
     ========================================================================== */
  const toastContainer = $("toast-container");
  function showToast(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-item";
    const iconSvg = type === "success"
      ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("removing");
      setTimeout(() => toast.remove(), 320);
    }, 2800);
  }

  /* ==========================================================================
     2. Lenis Smooth Scroll & Smart Navbar
     ========================================================================== */
  let lenisInstance = null;
  if (typeof Lenis !== "undefined") {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== "undefined") {
      lenisInstance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Scroll Progress Line & Smart Navbar
  const progressBar = $("scroll-progress");
  const navbar = $("navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && maxScroll > 0) {
      const pct = (scrollY / maxScroll) * 100;
      progressBar.style.width = pct + "%";
    }

    if (navbar) {
      if (scrollY > 120 && scrollY > lastScrollY) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
    }
    lastScrollY = scrollY;
  }, { passive: true });

  /* ==========================================================================
     3. Custom Magnetic Cursor (Desktop only)
     ========================================================================== */
  const cursorDot = $("cursor-dot");
  const cursorRing = $("cursor-ring");

  if (cursorDot && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = "a, button, input, select, .product-card, .material-pill, .color-swatch, .segment-btn";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  /* ==========================================================================
     4. Scene 1: Procedural 3D Printer in Three.js (ScrollTrigger 360 & Print)
     ========================================================================== */
  const printerCanvas = $("printer-canvas");
  if (printerCanvas && typeof THREE !== "undefined") {
    init3DPrinterScene();
  }

  function init3DPrinterScene() {
    const width = printerCanvas.clientWidth || window.innerWidth;
    const height = printerCanvas.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06040a, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas: printerCanvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting (Apple Product Studio Rig)
    const ambientLight = new THREE.AmbientLight(0x2a1d4a, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimCyan = new THREE.PointLight(0x00f0ff, 3.5, 20);
    rimCyan.position.set(-8, 6, -4);
    scene.add(rimCyan);

    const rimOrange = new THREE.PointLight(0xff5e3a, 3.0, 20);
    rimOrange.position.set(8, -2, -5);
    scene.add(rimOrange);

    // Chamber LED light
    const chamberLight = new THREE.PointLight(0xffffff, 1.8, 8);
    chamberLight.position.set(0, 4.2, 0);
    scene.add(chamberLight);

    // Printer Group
    const printerGroup = new THREE.Group();
    scene.add(printerGroup);

    // Materials
    const metalBlack = new THREE.MeshStandardMaterial({
      color: 0x141419,
      roughness: 0.35,
      metalness: 0.85
    });
    const aluminumSilver = new THREE.MeshStandardMaterial({
      color: 0xd0d5dd,
      roughness: 0.25,
      metalness: 0.95
    });
    const brassNozzle = new THREE.MeshStandardMaterial({
      color: 0xffb834,
      roughness: 0.2,
      metalness: 0.9
    });
    const peiBedMat = new THREE.MeshStandardMaterial({
      color: 0x1a1824,
      roughness: 0.6,
      metalness: 0.2
    });
    const glowFilament = new THREE.MeshBasicMaterial({
      color: 0xff5e3a
    });
    const neonCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    // 1. Base Cabinet
    const baseGeo = new THREE.BoxGeometry(6.4, 0.9, 6.4);
    const baseMesh = new THREE.Mesh(baseGeo, metalBlack);
    baseMesh.position.y = -0.45;
    printerGroup.add(baseMesh);

    // Screen / Interface on Base
    const screenGeo = new THREE.BoxGeometry(1.6, 1.0, 0.08);
    const screenMesh = new THREE.Mesh(screenGeo, neonCyanMat);
    screenMesh.position.set(1.8, 0.2, 3.25);
    screenMesh.rotation.x = -0.35;
    printerGroup.add(screenMesh);

    // 2. Pillars (4 vertical aluminum extrusions)
    const pillarGeo = new THREE.BoxGeometry(0.35, 6.2, 0.35);
    const pillarCoords = [
      [-2.8, 2.65, -2.8],
      [ 2.8, 2.65, -2.8],
      [-2.8, 2.65,  2.8],
      [ 2.8, 2.65,  2.8]
    ];
    pillarCoords.forEach(pos => {
      const p = new THREE.Mesh(pillarGeo, metalBlack);
      p.position.set(...pos);
      printerGroup.add(p);
    });

    // Top Beam Frame
    const topBeamXGeo = new THREE.BoxGeometry(6.0, 0.35, 0.35);
    const topBeamZGeo = new THREE.BoxGeometry(0.35, 0.35, 6.0);
    const topBeamF = new THREE.Mesh(topBeamXGeo, metalBlack);
    topBeamF.position.set(0, 5.6, 2.8);
    const topBeamB = new THREE.Mesh(topBeamXGeo, metalBlack);
    topBeamB.position.set(0, 5.6, -2.8);
    const topBeamL = new THREE.Mesh(topBeamZGeo, metalBlack);
    topBeamL.position.set(-2.8, 5.6, 0);
    const topBeamR = new THREE.Mesh(topBeamZGeo, metalBlack);
    topBeamR.position.set(2.8, 5.6, 0);
    printerGroup.add(topBeamF, topBeamB, topBeamL, topBeamR);

    // 3. Dual Z-Axis Rods (Stainless steel leadscrews)
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.8, 16);
    const rodLeft = new THREE.Mesh(rodGeo, aluminumSilver);
    rodLeft.position.set(-2.8, 2.8, 0);
    const rodRight = new THREE.Mesh(rodGeo, aluminumSilver);
    rodRight.position.set(2.8, 2.8, 0);
    printerGroup.add(rodLeft, rodRight);

    // 4. Heated Bed
    const bedGroup = new THREE.Group();
    const bedPlate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 4.8), peiBedMat);
    bedGroup.add(bedPlate);
    bedGroup.position.set(0, 1.1, 0);
    printerGroup.add(bedGroup);

    // 5. X/Y Gantry Beam
    const gantryGroup = new THREE.Group();
    const xRail = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 0.25), aluminumSilver);
    gantryGroup.add(xRail);

    // 6. Extruder Toolhead (Print Head)
    const toolhead = new THREE.Group();
    const headBlock = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), metalBlack);
    const nozzleTip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 16), brassNozzle);
    nozzleTip.position.y = -0.52;
    nozzleTip.rotation.x = Math.PI;

    // Glowing Nozzle Hotend Point
    const hotendGlow = new THREE.PointLight(0xff5e3a, 2.5, 1.2);
    hotendGlow.position.y = -0.6;
    toolhead.add(headBlock, nozzleTip, hotendGlow);

    gantryGroup.add(toolhead);
    gantryGroup.position.set(0, 3.8, 0);
    printerGroup.add(gantryGroup);

    // 7. Filament Spool on top
    const spoolGroup = new THREE.Group();
    const spoolRimGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.06, 24);
    const spoolCoreGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 24);
    const spoolRim1 = new THREE.Mesh(spoolRimGeo, metalBlack);
    spoolRim1.position.z = -0.35;
    const spoolRim2 = new THREE.Mesh(spoolRimGeo, metalBlack);
    spoolRim2.position.z = 0.35;
    const spoolCoil = new THREE.Mesh(spoolCoreGeo, glowFilament);
    spoolRim1.rotation.x = Math.PI / 2;
    spoolRim2.rotation.x = Math.PI / 2;
    spoolCoil.rotation.x = Math.PI / 2;
    spoolGroup.add(spoolRim1, spoolRim2, spoolCoil);
    spoolGroup.position.set(-1.8, 6.7, -1.8);
    printerGroup.add(spoolGroup);

    // 8. The Printed Object on Bed (Spiral vase that grows)
    const printedObjectGroup = new THREE.Group();
    bedGroup.add(printedObjectGroup);

    const layerCount = 42;
    const layers = [];
    const vaseMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.25,
      metalness: 0.3,
      emissive: 0x003344
    });

    for (let l = 0; l < layerCount; l++) {
      const t = l / layerCount;
      const radius = 0.5 + Math.sin(t * Math.PI * 3) * 0.35;
      const ringGeo = new THREE.TorusGeometry(radius, 0.045, 8, 28);
      const ringMesh = new THREE.Mesh(ringGeo, vaseMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = l * 0.055;
      ringMesh.visible = false;
      printedObjectGroup.add(ringMesh);
      layers.push(ringMesh);
    }

    // Centering & Positioning
    printerGroup.position.y = -0.8;

    // Window Resize Handler
    function onResize() {
      const w = printerCanvas.clientWidth || window.innerWidth;
      const h = printerCanvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // Render Loop
    let clock = new THREE.Clock();
    let scrollProgress = 0;

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Subtle ambient hover
      if (scrollProgress < 0.15) {
        printerGroup.position.y = -0.8 + Math.sin(time * 1.5) * 0.06;
      }

      // Nozzle active glow pulse
      hotendGlow.intensity = 2.0 + Math.sin(time * 12) * 0.6;

      renderer.render(scene, camera);
    }
    animate();

    // Setup GSAP ScrollTrigger Sequence
    const stepsData = [
      {
        num: "ETAPA 01 / 07",
        title: "Modelagem Tridimensional & CAD",
        desc: "Seu conceito digital é convertido em malha geométrica com tolerâncias milimétricas.",
        chip: "SISTEMA PRONTO"
      },
      {
        num: "ETAPA 02 / 07",
        title: "Fatiamento Digital (0.16mm)",
        desc: "O software de ponta divide a peça em centenas de camadas horizontais precisas.",
        chip: "TRAJETÓRIAS G-CODE"
      },
      {
        num: "ETAPA 03 / 07",
        title: "Aquecimento & Extrusão a 215°C",
        desc: "Bico de latão usinado derrete o polímero termoplástico sob controle térmico ativo.",
        chip: "NOZZLE: 215°C"
      },
      {
        num: "ETAPA 04 / 07",
        title: "Deposição em Camadas Micrométricas",
        desc: "Fusão molecular camada por camada sobre a mesa magnética texturizada em PEI.",
        chip: "VELOCIDADE: 250 mm/s"
      },
      {
        num: "ETAPA 05 / 07",
        title: "Resfriamento Rápido dos Filamentos",
        desc: "Ventoinhas de alto fluxo solidificam as pontes e detalhes finos sem distorção.",
        chip: "COOLING FAN: 100%"
      },
      {
        num: "ETAPA 06 / 07",
        title: "Remoção de Suportes de Contato",
        desc: "Estruturas provisórias destacam-se perfeitamente com padrão geométrico pré-calibrado.",
        chip: "ACABAMENTO MECÂNICO"
      },
      {
        num: "ETAPA 07 / 07",
        title: "Peça Final Concluída & Inspecionada",
        desc: "Rigoroso controle dimensional. Peça limpa, resistente e pronta para entrega.",
        chip: "CONTROLE DE QUALIDADE 100%"
      }
    ];

    const hudStageCard = $("hud-stage-card");
    const hudStepCount = $("hud-step-count");
    const hudStepTitle = $("hud-step-title");
    const hudStepDesc = $("hud-step-desc");
    const hudTelemetryChip = $("hud-telemetry-chip");
    const timelineDots = qAll(".hud-timeline-dot");

    let currentStepIdx = -1;
    function updateHUD(idx) {
      if (idx === currentStepIdx || !stepsData[idx]) return;
      currentStepIdx = idx;
      const data = stepsData[idx];

      if (hudStepCount) hudStepCount.textContent = data.num;
      if (hudStepTitle) hudStepTitle.textContent = data.title;
      if (hudStepDesc) hudStepDesc.textContent = data.desc;
      if (hudTelemetryChip) hudTelemetryChip.textContent = data.chip;

      timelineDots.forEach((dot, i) => {
        dot.classList.toggle("active", i <= idx);
      });
    }

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: ".scroll-showcase",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgress = self.progress;

          // Phase 1 (0 to 0.35): 360-degree orbit
          if (scrollProgress <= 0.35) {
            const p = scrollProgress / 0.35;
            printerGroup.rotation.y = p * Math.PI * 2;
            camera.position.set(0, 3.8, 12);
            gantryGroup.position.y = 3.8;
            toolhead.position.set(0, 0, 0);
          }
          // Phase 2 (0.35 to 0.60): Camera plunges into build plate
          else if (scrollProgress <= 0.60) {
            const p = (scrollProgress - 0.35) / 0.25;
            printerGroup.rotation.y = Math.PI * 2 + p * 0.4;
            camera.position.set(
              THREE.MathUtils.lerp(0, 1.8, p),
              THREE.MathUtils.lerp(3.8, 2.2, p),
              THREE.MathUtils.lerp(12, 6.0, p)
            );
            camera.lookAt(0, 1.6, 0);
          }
          // Phase 3 (0.60 to 1.0): Live print toolpaths & layer deposition
          else {
            const p = (scrollProgress - 0.60) / 0.40;
            camera.position.set(1.8, 2.0, 5.4);
            camera.lookAt(0, 1.8, 0);

            // Move toolhead in toolpath
            const angle = p * Math.PI * 18;
            const r = 0.6 + Math.sin(p * 8) * 0.2;
            toolhead.position.x = Math.cos(angle) * r;
            toolhead.position.z = Math.sin(angle) * r;
            gantryGroup.position.y = 1.2 + p * 2.3;

            // Grow printed layers
            const activeLayers = Math.floor(p * layerCount);
            layers.forEach((mesh, idx) => {
              mesh.visible = idx <= activeLayers;
            });
          }

          // Sync HUD
          const stepIdx = Math.min(stepsData.length - 1, Math.floor(scrollProgress * stepsData.length));
          updateHUD(stepIdx);
        }
      });
    }

    updateHUD(0);
  }

  /* ==========================================================================
     5. Scene 2: Interactive 3D Product Configurator (Three.js)
     ========================================================================== */
  const configCanvas = $("configurator-canvas");
  let updateConfigShader = null;
  let triggerPrintSimulation = null;

  if (configCanvas && typeof THREE !== "undefined") {
    initConfiguratorScene();
  }

  function initConfiguratorScene() {
    const width = configCanvas.clientWidth || 400;
    const height = configCanvas.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 5.0);

    const renderer = new THREE.WebGLRenderer({
      canvas: configCanvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(4, 8, 5);
    scene.add(dir);
    const rim = new THREE.PointLight(0x00f0ff, 2.8, 10);
    rim.position.set(-4, 3, -3);
    scene.add(rim);

    // Customizable 3D Geometry (Geometric Parametric Vase)
    const geom = new THREE.CylinderGeometry(0.8, 1.1, 2.4, 32, 24);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      const twist = y * 1.5;
      const flute = 1.0 + Math.sin((angle + twist) * 6) * 0.18;
      pos.setX(i, pos.getX(i) * flute);
      pos.setZ(i, pos.getZ(i) * flute);
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x00e0a4,
      metalness: 0.1,
      roughness: 0.35,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = -0.1;
    scene.add(mesh);

    // Ambient Floor Grid Ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.68, 48),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.35;
    scene.add(ring);

    // Free Drag to Rotate (Mouse / Touch)
    let isDragging = false;
    let prevX = 0;
    let autoRotate = true;

    configCanvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      autoRotate = false;
      prevX = e.clientX;
    });
    window.addEventListener("pointerup", () => { isDragging = false; });
    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      mesh.rotation.y += deltaX * 0.015;
      prevX = e.clientX;
    });

    function onConfigResize() {
      const w = configCanvas.clientWidth;
      const h = configCanvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onConfigResize);

    let isSimulating = false;
    let simProgress = 1.0;

    function renderConfig() {
      requestAnimationFrame(renderConfig);
      if (autoRotate && !isDragging) {
        mesh.rotation.y += 0.008;
      }
      if (isSimulating) {
        simProgress += 0.02;
        mesh.scale.y = Math.min(1.0, simProgress);
        if (simProgress >= 1.0) {
          isSimulating = false;
        }
      }
      renderer.render(scene, camera);
    }
    renderConfig();

    // Exported controller functions
    updateConfigShader = function (hexColor, materialId) {
      mat.color.set(hexColor);
      if (materialId === "pla-silk") {
        mat.metalness = 0.7;
        mat.roughness = 0.18;
        mat.clearcoat = 0.8;
      } else if (materialId === "petg-pro") {
        mat.metalness = 0.15;
        mat.roughness = 0.45;
        mat.clearcoat = 0.3;
      } else if (materialId === "resina-8k") {
        mat.metalness = 0.05;
        mat.roughness = 0.08;
        mat.clearcoat = 1.0;
      } else {
        // PLA clássico
        mat.metalness = 0.05;
        mat.roughness = 0.55;
        mat.clearcoat = 0.1;
      }
    };

    triggerPrintSimulation = function () {
      mesh.scale.y = 0.01;
      simProgress = 0.01;
      isSimulating = true;
      showToast("Simulando deposição de camadas a 250 mm/s ⚡");
    };
  }

  /* ==========================================================================
     6. Configurator UI, Instant Quote & Benchmark Comparator
     ========================================================================== */
  const configState = {
    material: cfg.materiais ? cfg.materiais[0] : null,
    cor: cfg.materiais && cfg.materiais[0].cores ? cfg.materiais[0].cores[0] : { nome: "Verde Menta", hex: "#00e0a4" },
    tamanho: cfg.tamanhos ? cfg.tamanhos[1] : null,
    resolucao: cfg.resolucoes ? cfg.resolucoes[1] : null,
    infill: cfg.preenchimentos ? cfg.preenchimentos[1] : null
  };

  const materialBox = $("material-selector-grid");
  const colorBox = $("color-swatch-row");
  const sizeBox = $("size-selector-row");
  const detailBox = $("detail-selector-row");
  const quotePriceEl = $("quote-price-display");
  const quoteWeightEl = $("quote-calc-weight");
  const quoteTimeEl = $("quote-calc-time");
  const quoteLayerEl = $("quote-calc-layer");

  function renderMaterialPills() {
    if (!materialBox || !cfg.materiais) return;
    materialBox.innerHTML = "";
    cfg.materiais.forEach((mat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "material-pill" + (configState.material.id === mat.id ? " active" : "");
      btn.innerHTML = `<strong>${mat.nome}</strong><small>${mat.sub}</small>`;
      btn.addEventListener("click", () => {
        configState.material = mat;
        if (mat.cores && mat.cores.length > 0) {
          configState.cor = mat.cores[0];
        }
        renderMaterialPills();
        renderColorSwatches();
        recalcQuote();
        updateBenchmarkMatrix();
      });
      materialBox.appendChild(btn);
    });
  }

  function renderColorSwatches() {
    if (!colorBox || !configState.material.cores) return;
    colorBox.innerHTML = "";
    configState.material.cores.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "color-swatch" + (configState.cor.hex === c.hex ? " active" : "");
      b.style.backgroundColor = c.hex;
      b.title = c.nome;
      b.setAttribute("data-tooltip", c.nome);
      b.addEventListener("click", () => {
        configState.cor = c;
        renderColorSwatches();
        recalcQuote();
      });
      colorBox.appendChild(b);
    });
  }

  function renderSizeSegments() {
    if (!sizeBox || !cfg.tamanhos) return;
    sizeBox.innerHTML = "";
    cfg.tamanhos.forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "segment-btn" + (configState.tamanho.id === t.id ? " active" : "");
      btn.innerHTML = `${t.nome}<br><small style="opacity:0.75;font-weight:400">${t.medida}</small>`;
      btn.addEventListener("click", () => {
        configState.tamanho = t;
        renderSizeSegments();
        recalcQuote();
      });
      sizeBox.appendChild(btn);
    });
  }

  function renderDetailSegments() {
    if (!detailBox || !cfg.resolucoes) return;
    detailBox.innerHTML = "";
    cfg.resolucoes.forEach((res) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "segment-btn" + (configState.resolucao.id === res.id ? " active" : "");
      btn.innerHTML = `${res.nome.split(" - ")[0]}<br><small style="opacity:0.75;font-weight:400">${res.nome.split(" - ")[1] || ""}</small>`;
      btn.addEventListener("click", () => {
        configState.resolucao = res;
        renderDetailSegments();
        recalcQuote();
      });
      detailBox.appendChild(btn);
    });
  }

  let prevPrice = 0;
  function recalcQuote() {
    const t = configState.tamanho;
    const m = configState.material;
    const res = configState.resolucao;
    const inf = configState.infill;

    const gramas = t.gramas * inf.fator;
    const horas = t.horas * inf.fator * res.fatorTempo;

    const custo = (gramas * cfg.precoGramaFilamento) + (horas * cfg.precoHoraMaquina);
    const finalPrice = (custo * cfg.margem) + m.adicional + res.adicional;

    // Rolling counter animation
    if (quotePriceEl && typeof gsap !== "undefined") {
      const counterObj = { val: prevPrice };
      gsap.to(counterObj, {
        val: finalPrice,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          quotePriceEl.textContent = reais(counterObj.val);
        }
      });
      prevPrice = finalPrice;
    } else if (quotePriceEl) {
      quotePriceEl.textContent = reais(finalPrice);
    }

    if (quoteWeightEl) quoteWeightEl.textContent = Math.round(gramas) + "g";
    if (quoteTimeEl) quoteTimeEl.textContent = horas.toFixed(1).replace(".", ",") + "h";
    if (quoteLayerEl) quoteLayerEl.textContent = res.nome.split(" - ")[0];

    // Update 3D canvas shader
    if (updateConfigShader) {
      updateConfigShader(configState.cor.hex, configState.material.id);
    }
  }

  function updateBenchmarkMatrix() {
    const mat = configState.material;
    const barRes = $("bench-bar-resistencia");
    const barDet = $("bench-bar-detalhe");
    const barFlex = $("bench-bar-flex");
    const barTemp = $("bench-bar-temp");

    if (barRes) barRes.style.width = mat.resistencia + "%";
    if (barDet) barDet.style.width = mat.detalhe + "%";
    if (barFlex) barFlex.style.width = mat.flexibilidade + "%";
    if (barTemp) barTemp.style.width = mat.resTermica + "%";

    const lblRes = $("bench-val-resistencia");
    const lblDet = $("bench-val-detalhe");
    const lblFlex = $("bench-val-flex");
    const lblTemp = $("bench-val-temp");

    if (lblRes) lblRes.textContent = mat.resistencia + "%";
    if (lblDet) lblDet.textContent = mat.detalhe + "%";
    if (lblFlex) lblFlex.textContent = mat.flexibilidade + "%";
    if (lblTemp) lblTemp.textContent = mat.resTermica + "°C";
  }

  // Simulation button
  const simPrintBtn = $("btn-sim-print");
  if (simPrintBtn) {
    simPrintBtn.addEventListener("click", () => {
      if (triggerPrintSimulation) triggerPrintSimulation();
    });
  }

  // Add Custom Piece to Bag
  const btnAddCustom = $("btn-add-custom-bag");
  if (btnAddCustom) {
    btnAddCustom.addEventListener("click", () => {
      const t = configState.tamanho;
      const m = configState.material;
      const c = configState.cor;
      const res = configState.resolucao;
      const inf = configState.infill;

      const gramas = t.gramas * inf.fator;
      const horas = t.horas * inf.fator * res.fatorTempo;
      const custo = (gramas * cfg.precoGramaFilamento) + (horas * cfg.precoHoraMaquina);
      const price = (custo * cfg.margem) + m.adicional + res.adicional;

      addToCart({
        id: "custom-" + Date.now(),
        nome: "Peça Personalizada forge3D",
        categoria: "Configurador 3D",
        preco: price,
        img: t.img,
        detalhes: `${t.nome} (${t.medida}) • ${m.nome} [${c.nome}] • ${res.nome.split(" - ")[0]}`
      });

      showToast("Peça personalizada adicionada à sacola! 🔥");
      openCartDrawer();
    });
  }

  renderMaterialPills();
  renderColorSwatches();
  renderSizeSegments();
  renderDetailSegments();
  recalcQuote();
  updateBenchmarkMatrix();

  /* ==========================================================================
     7. Nike-Style Product Catalog Grid & Quick View
     ========================================================================== */
  const catalogGrid = $("product-grid");
  const catalogFilters = $("catalog-filters");
  let activeCategory = "Todos";

  const allCategories = ["Todos", ...new Set(produtos.map(p => p.categoria))];

  function renderCatalogFilters() {
    if (!catalogFilters) return;
    catalogFilters.innerHTML = "";
    allCategories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-chip" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderCatalogFilters();
        renderProductGrid();
      });
      catalogFilters.appendChild(btn);
    });
  }

  function renderProductGrid() {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = "";

    const filtered = produtos.filter(p => activeCategory === "Todos" || p.categoria === activeCategory);

    filtered.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-media-box">
          <span class="product-badge">${p.badge || "PRODUTO"}</span>
          <img class="product-img" src="${p.img}" alt="${p.nome}" loading="lazy">
          <button class="quick-view-btn" type="button" title="Espiar detalhes" data-tooltip="Visualização rápida">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <div class="product-info-box">
          <span class="product-cat">${p.categoria}</span>
          <h3 class="product-title">${p.nome}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-bottom-row">
            <div class="product-price">
              <small>A partir de</small>
              ${reais(p.precoBase)}
            </div>
            <button class="btn-add-bag" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Adicionar
            </button>
          </div>
        </div>
      `;

      // Quick View Click
      card.querySelector(".quick-view-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openQuickViewModal(p);
      });

      // Add to bag
      card.querySelector(".btn-add-bag").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart({
          id: p.id,
          nome: p.nome,
          categoria: p.categoria,
          preco: p.precoBase,
          img: p.img,
          detalhes: `Material: ${p.materialRecomendado}`
        });
        showToast(`${p.nome} adicionado à sacola! ✨`);
        openCartDrawer();
      });

      catalogGrid.appendChild(card);
    });
  }

  renderCatalogFilters();
  renderProductGrid();

  /* ==========================================================================
     8. Lifestyle / Ideas Carousel
     ========================================================================== */
  const ideasCarousel = $("ideas-carousel");
  if (ideasCarousel) {
    ideasCarousel.innerHTML = "";
    ideias.forEach((item) => {
      const card = document.createElement("article");
      card.className = "idea-card";
      card.innerHTML = `
        <div class="idea-img-box">
          <img src="${item.img}" alt="${item.titulo}" loading="lazy">
        </div>
        <div class="idea-body">
          <span class="idea-tag">${item.tag || "APLICAÇÃO"}</span>
          <h3 class="idea-title">${item.titulo}</h3>
          <p class="idea-text">${item.texto}</p>
        </div>
      `;
      ideasCarousel.appendChild(card);
    });
  }

  /* ==========================================================================
     9. Shopping Cart Drawer & State Management (Nike Style)
     ========================================================================== */
  let cartItems = [];
  try {
    const saved = localStorage.getItem("forge3d_cart");
    if (saved) cartItems = JSON.parse(saved);
  } catch (err) {
    cartItems = [];
  }

  const cartBackdrop = $("cart-backdrop");
  const cartDrawer = $("cart-drawer");
  const cartTrigger = $("cart-trigger");
  const cartCloseBtn = $("cart-drawer-close");
  const cartBadge = $("cart-badge");
  const cartItemsBody = $("cart-items-body");
  const cartSubtotalEl = $("cart-subtotal");
  const btnCheckoutWhats = $("btn-checkout-whats");

  function saveCart() {
    try {
      localStorage.setItem("forge3d_cart", JSON.stringify(cartItems));
    } catch (e) {}
    updateCartUI();
  }

  function addToCart(item) {
    const existing = cartItems.find(i => i.id === item.id && i.detalhes === item.detalhes);
    if (existing) {
      existing.qtd += 1;
    } else {
      cartItems.push({ ...item, qtd: 1 });
    }
    saveCart();
    animateCartBadge();
  }

  function animateCartBadge() {
    if (!cartBadge) return;
    cartBadge.classList.add("bump");
    setTimeout(() => cartBadge.classList.remove("bump"), 450);
  }

  function updateCartUI() {
    const totalCount = cartItems.reduce((acc, cur) => acc + cur.qtd, 0);
    const subtotal = cartItems.reduce((acc, cur) => acc + (cur.preco * cur.qtd), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.toggle("has-items", totalCount > 0);
    }

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = reais(subtotal);
    }

    if (!cartItemsBody) return;

    if (cartItems.length === 0) {
      cartItemsBody.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <p>Sua sacola está vazia.</p>
          <small>Escolha uma peça do catálogo ou crie a sua no configurador 3D.</small>
        </div>
      `;
      if (btnCheckoutWhats) {
        btnCheckoutWhats.style.pointerEvents = "none";
        btnCheckoutWhats.style.opacity = "0.5";
      }
      return;
    }

    if (btnCheckoutWhats) {
      btnCheckoutWhats.style.pointerEvents = "auto";
      btnCheckoutWhats.style.opacity = "1";
    }

    cartItemsBody.innerHTML = "";
    cartItems.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <img class="cart-item-thumb" src="${item.img}" alt="${item.nome}">
        <div class="cart-item-meta">
          <h4>${item.nome}</h4>
          <div class="cart-item-variant">${item.detalhes || ""}</div>
          <div class="cart-item-price">${reais(item.preco * item.qtd)}</div>
          <div class="cart-item-stepper">
            <button type="button" class="btn-step-minus" aria-label="Diminuir">−</button>
            <span>${item.qtd}</span>
            <button type="button" class="btn-step-plus" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" title="Remover item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      `;

      row.querySelector(".btn-step-minus").addEventListener("click", () => {
        if (item.qtd > 1) {
          item.qtd -= 1;
        } else {
          cartItems.splice(index, 1);
        }
        saveCart();
      });

      row.querySelector(".btn-step-plus").addEventListener("click", () => {
        item.qtd += 1;
        saveCart();
      });

      row.querySelector(".cart-item-remove").addEventListener("click", () => {
        cartItems.splice(index, 1);
        saveCart();
        showToast("Item removido da sacola.");
      });

      cartItemsBody.appendChild(row);
    });

    // Update WhatsApp link message
    if (btnCheckoutWhats) {
      let msg = `*NOVO PEDIDO - FORGE 3D*\n`;
      msg += `---------------------------------\n`;
      cartItems.forEach((it) => {
        msg += `• *${it.qtd}x* ${it.nome}\n  _${it.detalhes}_\n  Valor: ${reais(it.preco * it.qtd)}\n\n`;
      });
      msg += `---------------------------------\n`;
      msg += `*SUBTOTAL ESTIMADO:* ${reais(subtotal)}\n`;
      msg += `Local de entrega: A combinar (Goiânia / Envio Brasil)\n\n`;
      msg += `Gostaria de confirmar os detalhes de pagamento e envio!`;

      btnCheckoutWhats.href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`;
    }
  }

  function openCartDrawer() {
    if (cartBackdrop) cartBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCartDrawer() {
    if (cartBackdrop) cartBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (cartTrigger) cartTrigger.addEventListener("click", openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", (e) => {
      if (e.target === cartBackdrop) closeCartDrawer();
    });
  }

  updateCartUI();

  /* ==========================================================================
     10. Modal System (Quick View & Custom STL)
     ========================================================================== */
  const quickModal = $("modal-quick-view");
  const quickClose = $("modal-quick-close");
  const quickImg = $("modal-quick-img");
  const quickTitle = $("modal-quick-title");
  const quickCat = $("modal-quick-cat");
  const quickDesc = $("modal-quick-desc");
  const quickPrice = $("modal-quick-price");
  const quickTime = $("modal-quick-time");
  const quickMat = $("modal-quick-mat");
  const quickAddBtn = $("modal-quick-add-btn");

  let activeModalProduct = null;

  function openQuickViewModal(product) {
    activeModalProduct = product;
    if (!quickModal) return;

    if (quickImg) quickImg.src = product.img;
    if (quickTitle) quickTitle.textContent = product.nome;
    if (quickCat) quickCat.textContent = product.categoria;
    if (quickDesc) quickDesc.textContent = product.desc;
    if (quickPrice) quickPrice.textContent = reais(product.precoBase);
    if (quickTime) quickTime.textContent = product.tempoEstimado || "3h";
    if (quickMat) quickMat.textContent = product.materialRecomendado || "PLA";

    quickModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeQuickViewModal() {
    if (quickModal) quickModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (quickClose) quickClose.addEventListener("click", closeQuickViewModal);
  if (quickModal) {
    quickModal.addEventListener("click", (e) => {
      if (e.target === quickModal) closeQuickViewModal();
    });
  }

  if (quickAddBtn) {
    quickAddBtn.addEventListener("click", () => {
      if (!activeModalProduct) return;
      addToCart({
        id: activeModalProduct.id,
        nome: activeModalProduct.nome,
        categoria: activeModalProduct.categoria,
        preco: activeModalProduct.precoBase,
        img: activeModalProduct.img,
        detalhes: `Material: ${activeModalProduct.materialRecomendado}`
      });
      closeQuickViewModal();
      showToast(`${activeModalProduct.nome} adicionado!`);
      openCartDrawer();
    });
  }

  // Escape key closes modals & cart
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartDrawer();
      closeQuickViewModal();
      closeLegalModal();
      closeAdminModal();
    }
  });

  /* ==========================================================================
     11. Legal (CDC) & Admin Modals Handlers
     ========================================================================== */
  const modalLegal = $("modal-legal");
  const btnOpenLegal = $("btn-open-legal");
  const btnCloseLegal = $("modal-legal-close");

  function openLegalModal() {
    if (modalLegal) {
      modalLegal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function closeLegalModal() {
    if (modalLegal) {
      modalLegal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
  if (btnOpenLegal) btnOpenLegal.addEventListener("click", openLegalModal);
  if (btnCloseLegal) btnCloseLegal.addEventListener("click", closeLegalModal);
  if (modalLegal) {
    modalLegal.addEventListener("click", (e) => {
      if (e.target === modalLegal) closeLegalModal();
    });
  }

  const modalAdmin = $("modal-admin");
  const btnOpenAdmin = $("btn-open-admin");
  const btnCloseAdmin = $("modal-admin-close");

  function openAdminModal() {
    if (modalAdmin) {
      modalAdmin.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function closeAdminModal() {
    if (modalAdmin) {
      modalAdmin.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
  if (btnOpenAdmin) btnOpenAdmin.addEventListener("click", openAdminModal);
  if (btnCloseAdmin) btnCloseAdmin.addEventListener("click", closeAdminModal);
  if (modalAdmin) {
    modalAdmin.addEventListener("click", (e) => {
      if (e.target === modalAdmin) closeAdminModal();
    });
  }

})();
