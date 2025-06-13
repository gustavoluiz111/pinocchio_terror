// js/chess.js

const board = document.getElementById('chessboard');

const lightColor = '#eee';
const darkColor = '#444';

const initialBoard = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖']
];

let selected = null;

function createBoard() {
  board.innerHTML = '';
  for(let row=0; row<8; row++) {
    for(let col=0; col<8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      const isLight = (row + col) % 2 === 0;
      square.style.backgroundColor = isLight ? lightColor : darkColor;
      square.dataset.row = row;
      square.dataset.col = col;
      square.textContent = initialBoard[row][col];
      square.style.fontSize = '28px';
      square.style.textAlign = 'center';
      square.style.lineHeight = '40px';
      square.style.cursor = 'pointer';

      square.addEventListener('click', () => {
        if(selected) {
          // Mover peça para a casa clicada
          movePiece(selected, square);
          selected = null;
          clearHighlights();
        } else {
          if(square.textContent && isWhitePiece(square.textContent)) {
            selected = square;
            highlightSquare(square);
          }
        }
      });

      board.appendChild(square);
    }
  }
}

function isWhitePiece(piece) {
  return '♙♖♘♗♕♔'.includes(piece);
}

function movePiece(fromSquare, toSquare) {
  toSquare.textContent = fromSquare.textContent;
  fromSquare.textContent = '';
}

function highlightSquare(square) {
  square.style.outline = '3px solid crimson';
}

function clearHighlights() {
  const squares = board.querySelectorAll('.square');
  squares.forEach(sq => sq.style.outline = '');
}

createBoard();
