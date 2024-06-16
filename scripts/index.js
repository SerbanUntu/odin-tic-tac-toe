const board = (function () {
  const cells = Array(9).fill('');

  const getMarker = cellNumber => cells[cellNumber];

  const setMarker = (cellNumber, marker) => {
    cells[cellNumber] = marker;
    cellsDOM[cellNumber].textContent = marker;
  }

  const reset = () => {
    for(let i = 0; i < 9; i++) {
      cells[i] = '';
      cellsDOM[i].textContent = '';
    }
  }

  return { getMarker, setMarker, reset };
})();

const game = (function () {
  let currentMarker = 'X';
  let roundNumber = 1;
  let winner = null;
  let active = false;

  const playRound = (cellNumber) => {
    board.setMarker(cellNumber, currentMarker);
    const winnerMarker = checkWinnerMarker();
    if(winnerMarker !== '') {
      setWinner(winnerMarker);
      end(winner);
    } else if(roundNumber === 9) {
      end('draw');
    } else {
      roundNumber++;
      if(currentMarker === 'X')
        currentMarker = 'O';
      else
        currentMarker = 'X';
    }
  };

  const checkWinnerMarker = () => {
    let result = '';
    [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].forEach(combination => {
      switch(board.getMarker([combination[0]]) + board.getMarker([combination[1]]) + board.getMarker([combination[2]])) {
        case 'XXX':
          result = 'X';
          break;
        case 'OOO':
          result = 'O';
          break;
      }
    });
    return result;
  }

  const setWinner = (marker) => {
    if(marker === 'X') 
      winner = playerOne;
    else 
      winner = playerTwo;
  }

  const end = (result) => {
    game.active = false;
    endDialogDOM.show();
    if(result === 'draw') {
      winnerTextDOM.textContent = "It's a draw!";
    } else {
      winnerTextDOM.textContent = `${winner.name} wins!`;
    }
  }

  const reset = (keepNames) => {
    if(keepNames === true) {
      game.active = true;
    } else {
      game.active = false;
      inputPlayerOneDOM.value = '';
      inputPlayerTwoDOM.value = '';
      startDialogDOM.show();
    }
    game.currentMarker = 'X';
    roundNumber = 1;
    winner = null;
    board.reset();
  }

  return { active, playRound, reset };
})();

function createPlayer(name) {
  return { name };
}

const cellsDOM = document.querySelectorAll('.cell');

cellsDOM.forEach((cell, index) => cell.addEventListener('click', e => {
  e.preventDefault();
  if(game.active && board.getMarker(index) === '') {
    game.playRound(index);
  }
}));

const formDOM = document.querySelector('form');
const inputPlayerOneDOM = document.querySelector('.player-one');
const inputPlayerTwoDOM = document.querySelector('.player-two');
const playButtonDOM = document.querySelector('.play-button');
const startDialogDOM = document.querySelector('.start-dialog');
const endDialogDOM = document.querySelector('.end-dialog');
const winnerTextDOM = document.querySelector('.winner-text');
const keepNamesDOM = document.querySelector('.keep-names');
const newNamesDOM = document.querySelector('.new-names');

let playerOne = null;
let playerTwo = null;

formDOM.addEventListener('submit', (e) => {
  e.preventDefault();
  playerOne = createPlayer(inputPlayerOneDOM.value);
  playerTwo = createPlayer(inputPlayerTwoDOM.value);
  game.active = true;
  startDialogDOM.close();
});

keepNamesDOM.addEventListener("click", (e) => {
  e.preventDefault();
  endDialogDOM.close();
  game.reset(true);
});

newNamesDOM.addEventListener("click", (e) => {
  e.preventDefault();
  endDialogDOM.close();
  game.reset(false);
});