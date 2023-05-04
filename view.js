export default class View {
  $ = {};

  constructor() {
    this.$.playerChoice = document.querySelectorAll(".player-button");
    this.$.newGameCPU = document.querySelector(".game-menu__new-game--cpu");
    this.$.newGameMulti = document.querySelector(".game-menu__new-game--multi");
    this.$.gameMenu = document.querySelector(".game-menu");
    this.$.gameBoard = document.querySelector(".game");
    this.$.xScoreDesc = document.getElementById("x-desc");
    this.$.oScoreDesc = document.getElementById("o-desc");
    this.$.squares = document.querySelectorAll(".game__board-piece");
    this.$.turn = document.getElementById("turn-icon");
    this.$.resetBtn = document.querySelector(".game__top--reset");
    this.$.resetModal = document.querySelector(".restart-modal");
    this.$.cancelRestart = document.getElementById("cancel-btn");
    this.$.restart = document.getElementById("restart-btn");
    this.$.win = document.querySelector(".round-end-modal");
    this.$.winMessage = document.getElementById("round-end-message");
    this.$.winIcon = document.getElementById("win-image");
    this.$.winDesc = document.getElementById("win-desc");
  }

  bindPlayerChoiceEvent(handler) {
    this.$.playerChoice.forEach((ele) => {
      ele.addEventListener("click", handler);
    });
  }

  bindNewGameCPU(handler) {
    this.$.newGameCPU.addEventListener("click", handler);
  }

  bindNewGameMulti(handler) {
    this.$.newGameMulti.addEventListener("click", handler);
  }

  bindPlayerMove(handler) {
    this.$.squares.forEach((ele) => {
      ele.addEventListener("click", () => handler(ele));
    });
  }

  bindGameReset(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }

  bindCancel(handler) {
    this.$.cancelRestart.addEventListener("click", handler);
  }

  bindRestart(handler) {
    this.$.restart.addEventListener("click", handler);
  }

  // Helper Functions
  setGameBoardCPU(playerMarker) {
    this.$.gameMenu.classList.toggle("hidden");
    this.$.gameBoard.classList.toggle("hidden");

    if (playerMarker["P1"] === "X") {
      this.$.xScoreDesc.textContent = "(you)";
      this.$.oScoreDesc.textContent = "(cpu)";
    } else {
      this.$.xScoreDesc.textContent = "(cpu)";
      this.$.oScoreDesc.textContent = "(you)";
    }
  }

  setGameBoardMulti(playerMarker) {
    this.$.gameMenu.classList.toggle("hidden");
    this.$.gameBoard.classList.toggle("hidden");

    if (playerMarker["P1"] === "X") {
      this.$.xScoreDesc.textContent = "(P1)";
      this.$.oScoreDesc.textContent = "(P2)";
    } else {
      this.$.xScoreDesc.textContent = "(P2)";
      this.$.oScoreDesc.textContent = "(P1)";
    }
  }

  setPlayerMove(squareId, currentPlayer) {
    const square = document.getElementById(squareId);
    const icon = document.createElement("img");

    if (currentPlayer === "X") {
      icon.src = "./assets/icon-x.svg";
    } else {
      icon.src = "./assets/icon-o.svg";
    }

    icon.classList.add("board-piece");
    square.appendChild(icon);
  }

  setTurnIcon(currentPlayer) {
    if (currentPlayer === "X") {
      this.$.turn.src = "./assets/icon-x.svg";
    } else {
      this.$.turn.src = "./assets/icon-o.svg";
    }
  }

  setResetModal() {
    this.$.resetModal.classList.toggle("hidden");
  }

  cancelReset() {
    this.$.resetModal.classList.toggle("hidden");
  }

  restartGame() {
    this.$.resetModal.classList.toggle("hidden");
    const fullSquares = document.querySelectorAll(".board-piece");
    fullSquares.forEach((ele) => {
      ele.remove();
    });
  }

  showWinModalX(playerMarker) {
    this.$.win.classList.toggle("hidden");
    if (playerMarker["P1"] === "X") {
      this.$.winMessage.textContent = "Player 1 wins!";
    } else {
      this.$.winMessage.textContent = "Player 2 wins!";
    }
    this.$.winIcon.src = "./assets/icon-x.svg";
    this.$.winDesc.style.color = "hsl(178, 60%, 48%)";
  }

  changeBGColorX(squares) {
    squares.forEach((ele) => {
      let tempSquare = document.getElementById(ele);
      tempSquare.style.border = "2px solid hsl(178, 60%, 48%)";
    });
  }

  showWinModalO(playerMarker) {
    this.$.win.classList.toggle("hidden");
    if (playerMarker["P1"] === "O") {
      this.$.winMessage.textContent = "Player 1 wins!";
    } else {
      this.$.winMessage.textContent = "Player 2 wins!";
    }
    this.$.winIcon.src = "./assets/icon-o.svg";
    this.$.winDesc.style.color = "hsl(39, 100%, 69%)";
  }

  changeBGColorO(squares) {
    squares.forEach((ele) => {
      let tempSquare = document.getElementById(ele);
      tempSquare.style.border = "2px solid hsl(39, 100%, 69%)";
    });
  }
}
