(function () {
  const cfg = window.FORGE_CONFIG;
  const produtos = window.FORGE_PRODUTOS || [];
  const ideias = window.FORGE_IDEIAS || [];
  const reais = v => "R$ " + v.toFixed(2).replace(".", ",");
  const $ = id => document.getElementById(id);

  /* ---------- Cena de scroll: a peça se separa em etapas ---------- */
  const scene = $("scene");
  const sliceWrap = $("slices");
  const steps = [
    { t: "1. Modelo digital", s: "Você envia a ideia ou escolhemos juntos no catálogo." },
    { t: "2. Fatiamento", s: "O modelo vira camadas finas, em torno de 0,2 mm cada." },
    { t: "3. Impressão", s: "Camada por camada, o filamento toma forma." },
    { t: "4. Acabamento", s: "Remoção de suportes, lixamento e pintura, se quiser." },
    { t: "5. Entrega", s: "Peça pronta, embalada e enviada para você." }
  ];
  const photo = "assets/img/vaso.jpg";
  const SLICES = 5;
  for (let i = 0; i < SLICES; i++) {
    const s = document.createElement("div");
    s.className = "slice";
    s.style.setProperty("--i", i);
    s.style.setProperty("--img", `url("${photo}")`);
    sliceWrap.appendChild(s);
  }
  const stepText = $("step-text"), dots = $("dots");
  steps.forEach(() => { const d = document.createElement("span"); dots.appendChild(d); });
  let lastStep = -1;

  function onScroll() {
    const r = scene.getBoundingClientRect();
    const total = scene.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    scene.style.setProperty("--p", p.toFixed(4));
    $("scene-bar").style.setProperty("--p", p.toFixed(4));
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (idx !== lastStep) {
      lastStep = idx;
      stepText.innerHTML = "";
      const h = document.createElement("div");
      h.className = "scene-step";
      h.textContent = steps[idx].t;
      const sm = document.createElement("small");
      sm.textContent = steps[idx].s;
      h.appendChild(sm);
      stepText.appendChild(h);
      [...dots.children].forEach((d, k) => d.classList.toggle("on", k === idx));
    }
    sliceWrap.style.setProperty("--p", p.toFixed(4));
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
  }, { passive: true });
  onScroll();

  /* ---------- Catálogo ---------- */
  const grid = $("grid");
  const chips = $("chips");
  const categorias = ["Todos", ...new Set(produtos.map(p => p.categoria))];
  let atual = "Todos";

  function msgWhats(texto) {
    return `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  function renderChips() {
    chips.innerHTML = "";
    categorias.forEach(cat => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("aria-pressed", String(cat === atual));
      b.textContent = cat;
      b.addEventListener("click", () => { atual = cat; renderChips(); renderGrid(); });
      chips.appendChild(b);
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    produtos
      .filter(p => atual === "Todos" || p.categoria === atual)
      .forEach((p, i) => {
        const art = document.createElement("article");
        art.className = "card";
        art.style.setProperty("--c", p.cor);
        art.style.animationDelay = (i * 60) + "ms";
        art.innerHTML = `
          <div class="ph"><img loading="lazy" alt=""></div>
          <div class="body">
            <div class="cat"></div>
            <h3></h3>
            <div class="price"></div>
            <a class="pedir" target="_blank" rel="noopener">Pedir orçamento</a>
          </div>`;
        const img = art.querySelector("img");
        img.src = p.img;
        img.alt = p.nome;
        art.querySelector(".cat").textContent = p.categoria;
        art.querySelector("h3").textContent = p.nome;
        art.querySelector(".price").textContent = "a partir de " + reais(p.precoBase);
        const link = art.querySelector(".pedir");
        link.href = msgWhats(`Oi! Quero orçamento de: ${p.nome} (${p.categoria}).`);
        link.addEventListener("click", () => showToast("Boa escolha! Abrindo o WhatsApp..."));
        grid.appendChild(art);
      });
  }

  /* ---------- Ideias do dia a dia ---------- */
  const ideasEl = $("ideas");
  renderIdeias();
  function renderIdeias() {
    ideasEl.innerHTML = "";
    ideias.forEach(d => {
      const el = document.createElement("article");
      el.className = "idea";
      el.style.setProperty("--c", d.cor);
      el.innerHTML = `<img loading="lazy" alt=""><div class="body"><h3></h3><p></p></div>`;
      el.querySelector("img").src = d.img;
      el.querySelector("img").alt = d.titulo;
      el.querySelector("h3").textContent = d.titulo;
      el.querySelector("p").textContent = d.texto;
      ideasEl.appendChild(el);
    });
  }

  /* ---------- Orçamento guiado ---------- */
  const state = { tamanho: cfg.tamanhos[1].id, resistencia: "padrao", acabamento: "padrao", qtd: 1 };

  function pick(list, id) { return list.find(x => x.id === id) || list[0]; }

  function renderOptions() {
    const sizeBox = $("sizes");
    sizeBox.innerHTML = "";
    cfg.tamanhos.forEach(t => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "size";
      b.setAttribute("aria-pressed", String(state.tamanho === t.id));
      b.innerHTML = `<img alt=""><span class="t"><strong></strong><small></small></span>`;
      b.querySelector("img").src = t.img;
      b.querySelector("strong").textContent = t.nome;
      b.querySelector("small").textContent = t.medida + " · " + t.exemplo;
      b.addEventListener("click", () => { state.tamanho = t.id; renderOptions(); calcular(); });
      sizeBox.appendChild(b);
    });
    renderOpt("res-row", cfg.resistencias, "resistencia", r => `<small>${r.desc}</small>`, r => "");
    renderOpt("acab-row", cfg.acabamentos, "acabamento", a => `<small>${a.desc}</small>`, a => a.valor ? "+ " + reais(a.valor) : "incluso");
  }

  function renderOpt(id, list, key, sub, price) {
    const box = $(id);
    box.innerHTML = "";
    list.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.setAttribute("aria-pressed", String(state[key] === o.id));
      b.innerHTML = `<span><strong></strong>${sub(o)}</span><em></em>`;
      b.querySelector("strong").textContent = o.nome;
      const em = b.querySelector("em");
      em.textContent = price(o);
      b.addEventListener("click", () => { state[key] = o.id; renderOptions(); calcular(); });
      box.appendChild(b);
    });
  }

  function estimar() {
    const t = pick(cfg.tamanhos, state.tamanho);
    const r = pick(cfg.resistencias, state.resistencia);
    const a = pick(cfg.acabamentos, state.acabamento);
    const gramas = t.gramas * r.fator;
    const horas = t.horas * r.fator;
    const custo = gramas * cfg.precoGramaFilamento + horas * cfg.precoHoraMaquina;
    const unit = custo * cfg.margem + a.valor;
    const unitLow = unit * 0.9, unitHigh = unit * 1.15;
    return { t, r, a, gramas, horas, unit, unitLow, unitHigh, qtd: state.qtd, total: unit * state.qtd };
  }

  function calcular() {
    const e = estimar();
    $("qty").textContent = state.qtd;
    const totalEl = $("total");
    totalEl.textContent = reais(e.total);
    totalEl.classList.remove("pop"); void totalEl.offsetWidth; totalEl.classList.add("pop");
    $("range").textContent = `Faixa estimada: ${reais(e.unitLow * e.qtd)} a ${reais(e.unitHigh * e.qtd)}`;
    $("det-tam").textContent = `${e.t.nome} (${e.t.medida})`;
    $("det-peso").textContent = `${Math.round(e.gramas)} g de filamento`;
    $("det-tempo").textContent = `${e.horas.toFixed(1).replace(".", ",")} h de impressão`;
    $("det-res").textContent = e.r.nome;
    $("det-acab").textContent = e.a.nome;
    $("det-qtd").textContent = `${e.qtd} ${e.qtd > 1 ? "peças" : "peça"}`;
    $("pedir-orc").href = msgWhats(
      `Oi! Quero orçamento: tamanho ${e.t.nome} (${e.t.medida}), resistência ${e.r.nome}, acabamento ${e.a.nome}, ${e.qtd} peça(s). Estimativa ${reais(e.total)}.`
    );
  }

  $("qty-minus").addEventListener("click", () => { state.qtd = Math.max(1, state.qtd - 1); calcular(); });
  $("qty-plus").addEventListener("click", () => { state.qtd = Math.min(99, state.qtd + 1); calcular(); });

  /* ---------- Avisos ---------- */
  const toast = $("toast");
  let toastTimer = null;
  function showToast(texto) {
    toast.textContent = texto;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  renderChips();
  renderGrid();
  renderOptions();
  calcular();
})();
