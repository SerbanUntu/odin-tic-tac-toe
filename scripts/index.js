const formDOM = document.querySelector("form");
const gridDOM = document.querySelector(".grid");
const inputPlayerOneDOM = document.querySelector(".player-one");
const inputPlayerTwoDOM = document.querySelector(".player-two");
const startDialogDOM = document.querySelector(".start-dialog");
const endDialogDOM = document.querySelector(".end-dialog");
const keepNamesDOM = document.querySelector(".keep-names");
const newNamesDOM = document.querySelector(".new-names");

const Board = (function () {
  const cells = Array(9).fill('');
  const cellsDOM = [];

  const build = () => {
    for(let i = 0; i < 9; i++) {
      const newCell = document.createElement('div');
      gridDOM.appendChild(newCell);
      newCell.innerHTML = `
        <div class="cell-content">
          <div class="cell-front"></div>
          <div class="cell-back"></div>
        </div>
      `;
      newCell.classList.add('cell');
      newCell.addEventListener("click", e => {
        e.preventDefault();
        if(Game.active && Board.getMarker(i) === '') {
          Game.playRound(i);
        }
      });
      cellsDOM.push(newCell);
    }
  }

  const getMarker = cellNumber => cells[cellNumber];

  const setMarker = (cellNumber, marker) => {
    cells[cellNumber] = marker;
    cellsDOM[cellNumber].dataset.marker = marker;
  }

  const reset = () => {
    for(let i = 0; i < 9; i++) {
      cells[i] = '';
      delete cellsDOM[i].dataset.marker;
    }
  }

  return { build, getMarker, setMarker, reset };
})();

const Game = (function () {
  let currentMarker = 'X';
  let roundNumber = 1;
  let winner = null;
  let active = false;
  let player = [null, null];

  const playRound = (cellNumber) => {
    Board.setMarker(cellNumber, currentMarker);
    const winnerMarker = checkWinnerMarker();
    if(winnerMarker !== '') {
      setWinner(winnerMarker);
      end(winner);
    } else if(roundNumber === 9) {
      end("draw");
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
      switch(Board.getMarker([combination[0]]) + Board.getMarker([combination[1]]) + Board.getMarker([combination[2]])) {
        case "XXX":
          result = 'X';
          break;
        case "OOO":
          result = 'O';
          break;
      }
    });
    return result;
  }

  const setPlayer = (index, name) => {
    let marker = 'X';
    if(index === 1) marker = 'O';
    player[index] = { name, marker };
  }

  const setWinner = (marker) => {
    if(marker === 'X') 
      winner = player[0];
    else 
      winner = player[1];
  }

  const end = (result) => {
    const winnerTextDOM = document.querySelector(".winner-text");

    Game.active = false;
    if(result === "draw") {
      winnerTextDOM.innerHTML = "It's a draw!";
      winnerTextDOM.setAttribute("title", "It's a draw!");
    } else {
      winnerTextDOM.innerHTML = 
        `<span class="winner-name" style="color: var(--${winner.marker === 'X' ? 'red' : 'blue'});">${winner.name}</span> wins!`;
      winnerTextDOM.setAttribute("title", `${winner.name} wins!`);
    }
    endDialogDOM.show();
  }

  const reset = (namesKept) => {
    if(namesKept === true) {
      Game.active = true;
      gridDOM.style.display = "grid";
    } else {
      Game.active = false;
      gridDOM.style.display = "none";
      formDOM.reset();
      startDialogDOM.show();
    }
    currentMarker = 'X';
    roundNumber = 1;
    winner = null;
    Board.reset();
  }

  return { active, playRound, reset, setPlayer };
})();

formDOM.addEventListener("submit", (e) => {
  e.preventDefault();
  Game.setPlayer(0, inputPlayerOneDOM.value || "One");
  Game.setPlayer(1, inputPlayerTwoDOM.value || "Two");
  Game.active = true;
  gridDOM.style.display = "grid";
  startDialogDOM.close();
});

keepNamesDOM.addEventListener("click", (e) => {
  e.preventDefault();
  endDialogDOM.close();
  Game.reset(true);
});

newNamesDOM.addEventListener("click", (e) => {
  e.preventDefault();
  endDialogDOM.close();
  Game.reset(false);
});

Board.build();