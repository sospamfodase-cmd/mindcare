export const DAILY_INSIGHTS = [
  "Sua saúde mental é uma prioridade. Sua felicidade é essencial. Sua existência é necessária.",
  "Autocuidado não é egoísmo, é preservação. Tire um tempo para você hoje.",
  "Você não precisa carregar o mundo inteiro nos ombros. Está tudo bem descansar.",
  "Pequenos progressos ainda são progressos. Celebre cada passo da sua jornada.",
  "Sua jornada é única. Não compare o seu capítulo um com o capítulo vinte de outra pessoa.",
  "Acalme sua mente. Respire fundo. Este momento vai passar.",
  "Você é muito mais do que seus pensamentos ansiosos. Você é força e resiliência.",
  "Trate-se com a mesma gentileza que você trata as pessoas que ama.",
  "Sentir-se sobrecarregado não significa que você está falhando. Significa que você é humano.",
  "Dizer 'não' quando você precisa de descanso é um ato de coragem e amor próprio.",
  "Sua saúde mental vale mais do que qualquer produtividade ou expectativa alheia.",
  "Permita-se sentir. Todas as suas emoções são válidas e trazem mensagens importantes.",
  "O equilíbrio não é algo que você encontra, é algo que você cria dia após dia.",
  "Cultive pensamentos que te façam florescer, não aqueles que te limitam.",
  "A cura não é linear. Haverá dias difíceis, e está tudo bem recomeçar amanhã.",
  "Mantenha o foco no presente. O hoje é o único lugar onde você pode agir.",
  "Sua mente merece paz. Proteja sua energia de tudo que a drena.",
  "Você é digno de amor e respeito, especialmente de si mesmo.",
  "O autoconhecimento é a chave para a liberdade emocional. Continue explorando.",
  "Não tenha medo de pedir ajuda. Fortes são aqueles que reconhecem seus limites.",
  "A paciência com o seu próprio processo é a forma mais pura de autocuidado.",
  "Lembre-se de tudo o que você já superou. Você é muito mais forte do que imagina.",
  "Sua sensibilidade é uma força, não uma fraqueza. Sinta com profundidade.",
  "Crie espaços de silêncio no seu dia para ouvir o que seu coração precisa dizer.",
  "A gratidão transforma o que temos em suficiente e traz paz ao espírito.",
  "Você não é o seu diagnóstico. Você é uma pessoa plena com potencial infinito.",
  "Mude o foco do que falta para o que você já conquistou. Valorize sua trajetória.",
  "A vida acontece nos intervalos. Aprecie os pequenos momentos de tranquilidade.",
  "Sua voz importa. Expresse suas necessidades com clareza e acolhimento.",
  "Hoje é um novo dia para praticar a autocompaixão. Comece agora."
];

export const getRandomInsight = () => {
  // Use the day of the month to pick an insight, or random if preferred
  // Using day of the month ensures it stays the same for the whole day
  const dayOfMonth = new Date().getDate();
  const index = (dayOfMonth - 1) % DAILY_INSIGHTS.length;
  return DAILY_INSIGHTS[index];
};
