let turno = '⚫';
let modoBot = false;
const tabuleiro = document.getElementById('tabuleiro');

const mapa = [
  ['grilo', 'marionete_quebrada', 'umbro', 'fada_azul', 'pinocchio', 'lumi', 'marionete_quebrada', 'grilo'],
  ['boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto', 'boneco_sem_rosto'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados', 'crianca_olhos_costurados'],
  ['gaiola_marionete', 'fantoche', 'gideao', 'stromboli', 'joao_honesto', 'geppetto', 'fantoche', 'gaiola_marionete']
];

function gerarTabuleiro() {
  tabuleiro.innerHTML = ''; // limpa
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const casa = document.createElement('div');
      casa.classList.add('casa', (i + j) % 2 === 0 ? 'clara' : 'escura');
      casa.dataset.linha = i;
      casa.dataset.coluna = j;

      const nome = mapa[i][j];
      if (nome) {
        const img = document.createElement('img');
        img.src = `imagens/${nome}.png`;
        img.alt = nome;
        img.classList.add('peca');
        casa.appendChild(img);
      }

      casa.addEventListener('click', () => selecionarCasa(i, j));
      tabuleiro.appendChild(casa);
    }
  }
  turno = '⚫';
}

let selecionada = null;

function selecionarCasa(linha, coluna) {
  const index = linha * 8 + coluna;
  const casa = tabuleiro.children[index];
  const img = casa.querySelector('img');

  if (selecionada) {
    const origem = selecionada;
    const destino = { linha, coluna };
    moverPeca(origem, destino);
    selecionada = null;
  } else if (img) {
    selecionada = { linha, coluna };
  }
}

function moverPeca(origem, destino) {
  const iOrig = origem.linha * 8 + origem.coluna;
  const iDest = destino.linha * 8 + destino.coluna;

  const casaOrig = tabuleiro.children[iOrig];
  const casaDest = tabuleiro.children[iDest];

  const imgOrig = casaOrig.querySelector('img');
  const imgDest = casaDest.querySelector('img');

  if (!imgOrig) return;

  // Regra básica: não pode mover peça do inimigo
  if ((turno === '⚫' && origem.linha >= 6) || (turno === '⚪' && origem.linha <= 1)) return;

  if (imgDest) casaDest.removeChild(imgDest);

  casaDest.appendChild(imgOrig);
  turno = turno === '⚫' ? '⚪' : '⚫';

  if (modoBot && turno === '⚪') {
    setTimeout(fazerJogadaDoBot, 800);
  }
}

function fazerJogadaDoBot() {
  const casas = [...tabuleiro.children];
  const jogadas = [];

  casas.forEach((casa, i) => {
    const img = casa.querySelector('img');
    if (img && i >= 48) { // linha 6 ou 7
      const linha = Math.floor(i / 8);
      const coluna = i % 8;

      for (let l = 0; l < 8; l++) {
        for (let c = 0; c < 8; c++) {
          const destino = tabuleiro.children[l * 8 + c];
          if (!destino.querySelector('img')) {
            jogadas.push({ origem: { linha, coluna }, destino: { linha: l, coluna: c } });
          }
        }
      }
    }
  });

  if (jogadas.length === 0) return;
  const jogada = jogadas[Math.floor(Math.random() * jogadas.length)];
  moverPeca(jogada.origem, jogada.destino);
}

// Botões
document.getElementById('iniciarLocal').addEventListener('click', () => {
  modoBot = false;
  gerarTabuleiro();
});

document.getElementById('iniciarBot').addEventListener('click', () => {
  modoBot = true;
  gerarTabuleiro();
});



