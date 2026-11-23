// Configurações da forge3D - Diretrizes e Parâmetros Comerciais
window.FORGE_CONFIG = {
  nome: "forge3D",
  slogan: "Manufatura aditiva de precisão & criação sob demanda",
  whatsapp: "5562995534658", // WhatsApp oficial de checkout e atendimento
  email: "arthurfr309@gmail.com", // E-mail oficial administrativo e financeiro
  cidade: "Goiânia - GO",
  envio: "Envio expresso para todo o Brasil",

  // Cores institucionais: Preto Fosco, Cinza Titânio, Grafite e Acentos Metálicos
  identidade: {
    primaria: "Cinza com Preto",
    tema: "Stealth Titanium & Matte Black"
  },

  // Base de cálculo transparente
  precoGramaFilamento: 0.10, // R$ 0,10 por grama (base PLA padrão ~R$100/kg)
  precoHoraMaquina: 2.50,    // R$ 2,50/hora (energia + depreciação FDM de precisão)
  margem: 2.2,               // Markup sobre custos de fabricação

  // Tamanhos e predefinições de escala
  tamanhos: [
    { id: "mini",    nome: "Mini",    medida: "Até 5 cm",  exemplo: "Chaveiros, miniaturas, botões",  gramas: 12,  horas: 0.8,  fator: 0.6, img: "assets/img/chaveiro.jpg" },
    { id: "pequeno", nome: "Pequeno", medida: "5 a 10 cm", exemplo: "Suportes de mesa, vasos mini",   gramas: 45,  horas: 3.0,  fator: 1.0, img: "assets/img/vaso.jpg" },
    { id: "medio",   nome: "Médio",   medida: "10 a 18 cm",exemplo: "Fruteiras, luminárias, decorações",gramas: 130, horas: 7.5,  fator: 1.6, img: "assets/img/tigela.jpg" },
    { id: "grande",  nome: "Grande",  medida: "18 a 25 cm",exemplo: "Organizadores, vasos grandes, bustos",gramas: 340, horas: 17.0, fator: 2.8, img: "assets/img/caixa.jpg" }
  ],

  // Materiais tecnológicos (sem pintura manual nem lixamento - 100% manufatura aditiva pura)
  materiais: [
    {
      id: "pla-classico",
      nome: "PLA Clássico",
      sub: "Acabamento fosco de alta resolução",
      desc: "Ecológico, rígido e com fidelidade geométrica perfeita. Ideal para decoração e suportes.",
      adicional: 0,
      resistencia: 80,
      detalhe: 90,
      flexibilidade: 20,
      resTermica: 55,
      cores: [
        { nome: "Preto Fosco", hex: "#16161a" },
        { nome: "Cinza Titânio", hex: "#5a5e6b" },
        { nome: "Prata Grafite", hex: "#9aa0a6" },
        { nome: "Branco Puro", hex: "#f0f2f5" },
        { nome: "Laranja Cyber", hex: "#ff5e3a" }
      ]
    },
    {
      id: "pla-silk",
      nome: "PLA Silk Metálico",
      sub: "Brilho acetinado luxuoso",
      desc: "Polímero com aditivos ópticos que refletem a luz como metal polido. Visual premium imediato da impressora.",
      adicional: 6.0,
      resistencia: 78,
      detalhe: 95,
      flexibilidade: 25,
      resTermica: 55,
      cores: [
        { nome: "Prata Espelhada", hex: "#d8e2ec" },
        { nome: "Cinza Escovado", hex: "#6c727c" },
        { nome: "Ouro Champagne", hex: "#ffd23f" },
        { nome: "Bronze Dark", hex: "#8c6239" },
        { nome: "Cobre Titânio", hex: "#d97736" }
      ]
    },
    {
      id: "petg-pro",
      nome: "PETG Pro Resistente",
      sub: "Engenharia & Alta durabilidade",
      desc: "Resiste a impactos, sol, chuva e produtos químicos. Perfeito para peças mecânicas e suportes que aguentam carga.",
      adicional: 8.5,
      resistencia: 95,
      detalhe: 85,
      flexibilidade: 55,
      resTermica: 80,
      cores: [
        { nome: "Preto Industrial", hex: "#111113" },
        { nome: "Cinza Chumbo", hex: "#3e424b" },
        { nome: "Translúcido Fumê", hex: "#717985" },
        { nome: "Translúcido Cristal", hex: "#a8c0d8" }
      ]
    },
    {
      id: "resina-8k",
      nome: "Resina UV 8K",
      sub: "Microrresolução extrema",
      desc: "Camadas imperceptíveis a olho nu (0.03mm). Ideal para colecionáveis, joalheria e prototipagem médica.",
      adicional: 18.0,
      resistencia: 70,
      detalhe: 100,
      flexibilidade: 15,
      resTermica: 65,
      cores: [
        { nome: "Cinza Primer 8K", hex: "#7a8288" },
        { nome: "Preto Ônix", hex: "#1a1a1c" },
        { nome: "Branco Técnico", hex: "#eef1f5" }
      ]
    }
  ],

  // Resoluções de Camada (Qualidade da máquina)
  resolucoes: [
    { id: "draft",    nome: "0.28 mm - Rápido",   desc: "Ideal para peças robustas e protótipos", fatorTempo: 0.75, adicional: 0 },
    { id: "padrao",   nome: "0.20 mm - Padrão",   desc: "Excelente equilíbrio entre textura e velocidade", fatorTempo: 1.0, adicional: 0 },
    { id: "detalhe",  nome: "0.12 mm - Alta Definição", desc: "Linhas quase invisíveis, acabamento acetinado", fatorTempo: 1.5, adicional: 7.0 }
  ],

  // Preenchimento Interno (Infill)
  preenchimentos: [
    { id: "leve",      nome: "15% - Leve & Decorativo", fator: 0.85, desc: "Para vasos, miniaturas e objetos de estante" },
    { id: "padrao",    nome: "30% - Uso Diário",        fator: 1.0,  desc: "Excelente rigidez para organizadores e utilidades" },
    { id: "reforcado", nome: "60% - Mecânico / Carga",  fator: 1.45, desc: "Alta resistência a torque, parafusos e tração" }
  ]
};
