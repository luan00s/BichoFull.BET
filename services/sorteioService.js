const ANIMAIS = [
  "Avestruz", "Águia",    "Burro",    "Borboleta", "Cachorro",
  "Cabra",    "Carneiro", "Camelo",   "Cobra",     "Coelho",
  "Cavalo",   "Elefante", "Galo",     "Gato",      "Jacaré",
  "Leão",     "Macaco",   "Porco",    "Pavão",     "Peru",
  "Touro",    "Tigre",    "Urso",     "Veado",     "Vaca",
];


function nomeAnimalPorGrupo(grupo) {
  return ANIMAIS[grupo - 1] || null;
}


function sortearMilhar() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

function gerarCincoPremios() {
  const premios = [];
  const usados = new Set();
  while (premios.length < 5) {
    const num = sortearMilhar();
    if (!usados.has(num)) {
      usados.add(num);
      premios.push(num);
    }
  }
  return premios;
}


function obterGrupoPorDezena(dezena) {
  const dezenaNum = Number(dezena === "00" ? 100 : dezena);
  return Math.ceil(dezenaNum / 4);
}


function calcularResultado(aposta, primeiroPremio) {
  const dezenaPrimeiro = primeiroPremio.slice(-2);
  const grupoPrimeiro  = obterGrupoPorDezena(dezenaPrimeiro);

  let resultado  = "PERDEU";
  let valorGanho = 0;

  if (aposta.tipo_aposta === "grupo") {
    if (Number(aposta.animal) === grupoPrimeiro) {
      resultado  = "GANHOU";
      valorGanho = Number(aposta.valor) * 18;
    }
  } else if (aposta.tipo_aposta === "dezena") {
    if (String(aposta.dezena) === dezenaPrimeiro) {
      resultado  = "GANHOU";
      valorGanho = Number(aposta.valor) * 60;
    }
  } else if (aposta.tipo_aposta === "milhar") {
    if (String(aposta.milhar) === primeiroPremio) {
      resultado  = "GANHOU";
      valorGanho = Number(aposta.valor) * 4000;
    }
  }

  return { resultado, valorGanho };
}

module.exports = {
  ANIMAIS,
  nomeAnimalPorGrupo,
  sortearMilhar,
  gerarCincoPremios,
  obterGrupoPorDezena,
  calcularResultado,
};
