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
  let winner = null;
  let active = true;

  const playRound = (cellNumber) => {
    board.setMarker(cellNumber, currentMarker);
    const winnerMarker = checkWinnerMarker();
    if(winnerMarker !== '') {
      setWinner(winnerMarker);
      end();
    } else {
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

  const end = () => {
    reset();
  }

  const reset = () => {
    game.currentMarker = 'X';
    winner = null;
    board.reset();
  }

  return { active, playRound };
})();

function createPlayer(name) {
  return { name };
}

const playerOne = createPlayer('A');
const playerTwo = createPlayer('B');

const cellsDOM = document.querySelectorAll('.cell');

cellsDOM.forEach((cell, index) => cell.addEventListener('click', e => {
  e.preventDefault();
  if(game.active && board.getMarker(index) === '') {
    game.playRound(index);
  }
}));