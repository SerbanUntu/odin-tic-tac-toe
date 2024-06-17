const gridDOM = document.querySelector(".grid");
const formDOM = document.querySelector("form");
const keepNamesDOM = document.querySelector(".keep-names");
const newNamesDOM = document.querySelector(".new-names");
const inputPlayerOneDOM = document.querySelector(".player-one");
const inputPlayerTwoDOM = document.querySelector(".player-two");
const startDialogDOM = document.querySelector(".start-dialog");
const endDialogDOM = document.querySelector(".end-dialog");
const winnerTextDOM = document.querySelector(".winner-text");

class Board {
  static #cells = Array(9).fill('');
  static #cellsDOM = [];

  static init() {
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
        if(Game.active && this.getMarker(i) === '') {
          Game.playRound(i);
        }
      });
      this.#cellsDOM.push(newCell);
    }
  }

  static getMarker(cellNumber) {
    return this.#cells[cellNumber];
  }

  static setMarker(cellNumber, marker) {
    this.#cells[cellNumber] = marker;
    this.#cellsDOM[cellNumber].dataset.marker = marker;
  }

  static displayGrid(displayed) {
    if(!displayed) {
      gridDOM.style.display = "none";
    } else {
      gridDOM.style.display = "grid";
    }
  }

  static reset(namesKept) {
    if (namesKept === true) {
      this.displayGrid(true);
    } else {
      this.displayGrid(false);
    }
    for(let i = 0; i < 9; i++) {
      this.#cells[i] = '';
      delete this.#cellsDOM[i].dataset.marker;
    }
  }
}

class Game {
  static active = false;
  static #currentMarker = 'X';
  static #roundNumber = 1;
  static #winner = null;
  static #player = [null, null];

  static init() {
    this.#attachNamesFormEvent();
    this.#attachKeepNamesButtonEvent();
    this.#attachNewNamesButtonEvent();
    Board.init();
  }

  static #attachNamesFormEvent() {
    formDOM.addEventListener("submit", (e) => {
      e.preventDefault();
      this.setPlayer(0, inputPlayerOneDOM.value || 'X');
      this.setPlayer(1, inputPlayerTwoDOM.value || 'O');
      this.active = true;
      Board.displayGrid(true);
      startDialogDOM.close();
    });
  }

  static #attachKeepNamesButtonEvent() {
    keepNamesDOM.addEventListener("click", (e) => {
      e.preventDefault();
      endDialogDOM.close();
      this.#reset(true);
    });
  }

  static #attachNewNamesButtonEvent() {
    newNamesDOM.addEventListener("click", (e) => {
      e.preventDefault();
      endDialogDOM.close();
      this.#reset(false);
    });
  }

  static setPlayer(index, name) {
    let marker = 'X';
    if(index === 1) marker = 'O';
    this.#player[index] = { name, marker };
  }

  static playRound(cellNumber) {
    Board.setMarker(cellNumber, this.#currentMarker);
    const winnerMarker = this.#checkWinnerMarker();
    if(winnerMarker !== '') {
      this.#setWinner(winnerMarker);
      this.#end(this.#winner);
    } else if(this.#roundNumber === 9) {
      this.#end("draw");
    } else {
      this.#roundNumber++;
      if(this.#currentMarker === 'X')
        this.#currentMarker = 'O';
      else
        this.#currentMarker = 'X';
    }
  }

  static #checkWinnerMarker() {
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

  static #setWinner(marker) {
    if(marker === 'X') 
      this.#winner = this.#player[0];
    else 
      this.#winner = this.#player[1];
  }

  static #end(result) {
    this.active = false;
    if(result === "draw") {
      winnerTextDOM.innerHTML = "It's a draw!";
      winnerTextDOM.setAttribute("title", "It's a draw!");
    } else {
      winnerTextDOM.innerHTML = 
        `<span class="winner-name" style="color: var(--${this.#winner.marker === 'X' ? 'red' : 'blue'});">${this.#winner.name}</span> wins!`;
      winnerTextDOM.setAttribute("title", `${this.#winner.name} wins!`);
    }
    endDialogDOM.show();
  }

  static #reset(namesKept) {
    if(namesKept === true) {
      this.active = true;
    } else {
      this.active = false;
      formDOM.reset();
      startDialogDOM.show();
    }
    this.#currentMarker = 'X';
    this.#roundNumber = 1;
    this.#winner = null;
    Board.reset(namesKept);
  }
}

Game.init();