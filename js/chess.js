// js/chess.js

const tabuleiro = document.getElementById('tabuleiro');

const pecasIniciais = [
  ['grilo', 'boneco_menor', 'grilo', 'fada_azul', 'pinocchio', 'grilo', 'boneco_menor', 'grilo'],
  ['boneco_menor', 'boneco_menor', 'boneco_menor', 'boneco_menor', 'boneco_menor', 'boneco_menor', 'boneco_menor', 'boneco_menor'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados'],
  ['gaiola_marionete', 'crianca_olhos_costurados', 'grilo', 'stromboli', 'joao_honesto', 'grilo', 'crianca_olhos_costurados', 'gaiola_marionete']
];

const tabuleiroEstado = [];
let turno = 1; // começa lado 1
let selecionado = null;

function inicializarTabuleiro() {
  tabuleiro.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    tabuleiroEstado[i] = [];
    for (let j = 0; j < 8; j++) {
      const nomePeca = pecasIniciais[i][j];
      let lado = 0;
      if (nomePeca) {
        if (i <= 1) lado = 1;
        else if (i >= 6) lado = 2;
      }
      tabuleiroEstado[i][j] = {
        nome: nomePeca || '',
        lado: lado,
        primeiroMovimento: (nomePeca && (nomePeca === 'boneco_menor' || nomePeca === 'crianca_olhos_costurados'))
      };

      // Criar a casa no DOM
      const casa = document.createElement('div');
      casa.classList.add('casa');
      casa.classList.add((i + j) % 2 === 0 ? 'clara' : 'escura');

      if (nomePeca) {
        const img = document.createElement('img');
        img.src = `imagens/${nomePeca.toLowerCase()}.png`;
        img.alt = nomePeca;
        img.style.width = '100%';
        img.style.height = '100%';
        casa.appendChild(img);
      }

      tabuleiro.appendChild(casa);
    }
  }
}

function caminhoLivre(tab, origem, destino) {
  const [lOrigem, cOrigem] = origem;
  const [lDestino, cDestino] = destino;

  const deltaLinha = lDestino - lOrigem;
  const deltaColuna = cDestino - cOrigem;

  const passos = Math.max(Math.abs(deltaLinha), Math.abs(deltaColuna));
  const passoLinha = deltaLinha === 0 ? 0 : deltaLinha / Math.abs(deltaLinha);
  const passoCol = deltaColuna === 0 ? 0 : deltaColuna / Math.abs(deltaColuna);

  for (let i = 1; i < passos; i++) {
    const linha = lOrigem + passoLinha * i;
    const col = cOrigem + passoCol * i;
    if (tab[linha][col].nome !== '') return false;
  }
  return true;
}

function validaMovimento(tab, origem, destino) {
  const [lOrigem, cOrigem] = origem;
  const [lDestino, cDestino] = destino;

  const peca = tab[lOrigem][cOrigem];
  const alvo = tab[lDestino][cDestino];

  if (peca.nome === '') return false;
  if (peca.lado === alvo.lado && alvo.lado !== 0) return false;

  const tipo = peca.nome.toLowerCase();
  const lado = peca.lado;
  const deltaLinha = lDestino - lOrigem;
  const deltaColuna = cDestino - cOrigem;
  const absLinha = Math.abs(deltaLinha);
  const absCol = Math.abs(deltaColuna);

  switch (tipo) {
    case 'pinocchio': // Rei
    case 'stromboli':
      return absLinha <= 1 && absCol <= 1 && (absLinha + absCol) > 0;

    case 'fada_azul': // Rainha
    case 'joao_honesto':
      if ((absLinha === absCol || deltaLinha === 0 || deltaColuna === 0) && (absLinha + absCol) > 0) {
        return caminhoLivre(tab, origem, destino);
      }
      return false;

    case 'lumi':
    case 'umbro':
    case 'geppetto':
    case 'gideao':
      if (absLinha === absCol && absLinha > 0) {
        return caminhoLivre(tab, origem, destino);
      }
      return false;

    case 'marionete_quebrada':
    case 'marionete_fantoche':
      return (absLinha === 2 && absCol === 1) || (absLinha === 1 && absCol === 2);

    case 'grilo':
    case 'gaiola_marionete':
      if ((deltaLinha === 0 || deltaColuna === 0) && (absLinha + absCol) > 0) {
        return caminhoLivre(tab, origem, destino);
      }
      return false;

    case 'boneco_menor':
    case 'crianca_olhos_costurados':
      const dir = lado === 1 ? 1 : -1;
      if (cDestino === cOrigem) {
        if (deltaLinha === dir && alvo.nome === '') return true;
        if (deltaLinha === 2 * dir && peca.primeiroMovimento && alvo.nome === '') {
          const casaIntermediaria = tab[lOrigem + dir][cOrigem];
          if (casaIntermediaria.nome === '') return true;
        }
      }
      if (absCol === 1 && deltaLinha === dir && alvo.nome !== '' && alvo.lado !== lado) return true;
      return false;

    default:
      return false;
  }
}

function moverPeca(tab, origem, destino) {
  const [lOrigem, cOrigem] = origem;
  const [lDestino, cDestino] = destino;

  const peca = tab[lOrigem][cOrigem];

  tab[lDestino][cDestino] = { ...peca, primeiroMovimento: false };
  tab[lOrigem][cOrigem] = { nome: '', lado: 0, primeiroMovimento: false };

  const casas = tabuleiro.children;
  const casaOrigem = casas[lOrigem * 8 + cOrigem];
  const casaDestino = casas[lDestino * 8 + cDestino];

  if (casaDestino.firstChild) {
    casaDestino.removeChild(casaDestino.firstChild);
  }

  const img = casaOrigem.firstChild;
  casaOrigem.removeChild(img);
  casaDestino.appendChild(img);
}

function getPos(casa) {
  return Array.from(tabuleiro.children).indexOf(casa);
}

tabuleiro.addEventListener('click', (e) => {
  let alvo = e.target;

  if (alvo.tagName === 'IMG') {
    if (selecionado) {
      selecionado.style.border = '';
    }
    selecionado = alvo;
    selecionado.style.border = '2px solid yellow';
  } else if (alvo.classList.contains('casa') && selecionado) {
    const casaOrigem = selecionado.parentElement;
    const posOrigem = getPos(casaOrigem);
    const posDestino = getPos(alvo);

    const origem = [Math.floor(posOrigem / 8), posOrigem % 8];
    const destino = [Math.floor(posDestino / 8), posDestino % 8];

    const peca = tabuleiroEstado[origem[0]][origem[1]];

    if (peca.lado !== turno) {
      alert("Não é o seu turno!");
      selecionado.style.border = '';
      selecionado = null;
      return;
    }

    if (validaMovimento(tabuleiroEstado, origem, destino)) {
      moverPeca(tabuleiroEstado, origem, destino);
      turno = turno === 1 ? 2 : 1;
    } else {
      alert('Movimento inválido!');
    }

    if (selecionado) {
      selecionado.style.border = '';
      selecionado = null;
    }
  }
});

inicializarTabuleiro();


