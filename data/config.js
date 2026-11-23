// Configurações da forge3D. Edite aqui sem mexer no restante do site.
window.FORGE_CONFIG = {
  nome: "forge3D",
  whatsapp: "5562995534658", // formato: 55 + DDD + número, só dígitos

  // Base de custo (médias de mercado pesquisadas em nov/2026)
  precoGramaFilamento: 0.10, // R$ por grama: PLA ~R$100/kg
  precoHoraMaquina: 2.50,    // R$ por hora: energia + desgaste da impressora
  margem: 2.2,               // markup sobre o custo

  // Orçamento rápido: o cliente escolhe o tamanho e o site estima gramas e horas.
  // Valores típicos para PLA com 15–20% de preenchimento.
  tamanhos: [
    { id: "mini",    nome: "Mini",    medida: "até 5 cm",  exemplo: "chaveiro, pingente, botão",       gramas: 10,  horas: 0.75, img: "assets/img/chaveiro.jpg" },
    { id: "pequeno", nome: "Pequeno", medida: "até 10 cm", exemplo: "vaso pequeno, suporte de celular", gramas: 45,  horas: 3,    img: "assets/img/vaso.jpg" },
    { id: "medio",   nome: "Médio",   medida: "até 15 cm", exemplo: "fruteira, luminária, estatueta",   gramas: 120, horas: 7,    img: "assets/img/tigela.jpg" },
    { id: "grande",  nome: "Grande",  medida: "até 25 cm", exemplo: "organizador, vaso grande, busto",  gramas: 350, horas: 16,   img: "assets/img/caixa.jpg" }
  ],

  // Quanto a peça precisa aguentar. Multiplica gramas e horas.
  resistencias: [
    { id: "decorativa", nome: "Decorativa", desc: "Só para enfeitar",          fator: 0.8 },
    { id: "padrao",     nome: "Uso diário", desc: "Aguenta o dia a dia",       fator: 1.0 },
    { id: "reforcada",  nome: "Reforçada",  desc: "Encaixes, peso e impacto",  fator: 1.4 }
  ],

  // Acabamento manual, valor fixo por peça (R$)
  acabamentos: [
    { id: "padrao",  nome: "Direto da impressora", desc: "Linhas de camada visíveis", valor: 0 },
    { id: "lixado",  nome: "Lixado",               desc: "Toque mais liso",            valor: 8 },
    { id: "pintado", nome: "Pintado à mão",        desc: "Cores e detalhes",           valor: 25 }
  ]
};
