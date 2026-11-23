(function () {
  const cfg = window.FORGE_CONFIG;
  const produtos = window.FORGE_PRODUTOS || [];
  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const toast = document.getElementById("toast");
  const toastTimer = { id: null };

  // Filtros por categoria
  const categorias = ["Todos", ...new Set(produtos.map(p => p.categoria))];
  let atual = "Todos";

  function renderFiltros() {
    filters.innerHTML = "";
    categorias.forEach(cat => {
      const b = document.createElement("button");
      b.className = "chip" + (cat === atual ? " on" : "");
      b.textContent = cat;
      b.addEventListener("click", () => { atual = cat; renderFiltros(); renderGrid(); });
      filters.appendChild(b);
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    produtos
      .filter(p => atual === "Todos" || p.categoria === atual)
      .forEach((p, i) => {
        const card = document.createElement("article");
        card.className = "card";
        card.style.setProperty("--c", p.cor);
        card.style.animationDelay = (i * 60) + "ms";
        card.innerHTML = `
          <span class="emoji">${p.emoji}</span>
          <h3></h3>
          <div class="cat"></div>
          <div class="price"></div>
          <button type="button">Quero este!</button>`;
        card.querySelector("h3").textContent = p.nome;
        card.querySelector(".cat").textContent = p.categoria;
        card.querySelector(".price").textContent = "a partir de R$ " + p.precoBase.toFixed(2).replace(".", ",");
        card.querySelector("button").addEventListener("click", () => pedir(p));
        grid.appendChild(card);
      });
  }

  // Ao clicar, leva o pedido para o WhatsApp com a peça escolhida
  function pedir(p) {
    showToast("Boa escolha! 🔥 Abrindo o WhatsApp...");
    const msg = `Oi! Quero orçamento de: ${p.nome} (${p.categoria}).`;
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  function showToast(texto) {
    toast.textContent = texto;
    toast.classList.add("show");
    clearTimeout(toastTimer.id);
    toastTimer.id = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  // Calculadora de orçamento estimado
  const calcInputs = ["peso", "horas", "qtd"].map(id => document.getElementById(id));
  const result = document.getElementById("result");

  function calcular() {
    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const horas = parseFloat(document.getElementById("horas").value) || 0;
    const qtd = parseInt(document.getElementById("qtd").value, 10) || 1;
    const custo = peso * cfg.precoGramaFilamento + horas * cfg.precoHoraMaquina;
    const total = custo * cfg.margem * qtd;
    result.textContent = "R$ " + total.toFixed(2).replace(".", ",");
    result.classList.remove("bump");
    void result.offsetWidth; // reinicia a animação
    result.classList.add("bump");
  }
  calcInputs.forEach(el => el.addEventListener("input", calcular));

  // Botão de WhatsApp do topo e do fim da página
  document.getElementById("cta").addEventListener("click", () => {
    showToast("Vamos criar algo incrível! ✨");
  });

  renderFiltros();
  renderGrid();
  calcular();
})();
