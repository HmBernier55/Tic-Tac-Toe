export default class View {
  $ = {};

  /**
   * Creating variables for all the elements that I need to add functionality to within index.js
   */
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
    this.$.tie = document.querySelector(".round-tie-modal");
    this.$.winMessage = document.getElementById("round-end-message");
    this.$.winIcon = document.getElementById("win-image");
    this.$.winDesc = document.getElementById("win-desc");
    this.$.xScore = document.getElementById("x-score");
    this.$.oScore = document.getElementById("o-score");
    this.$.tieScore = document.getElementById("tie-score");
    this.$.newRoundWin = document.getElementById("win-next-round");
    this.$.newRoundTie = document.getElementById("tie-next-round");
    this.$.quitWin = document.getElementById("quit-win");
    this.$.quitTie = document.getElementById("quit-tie");
  }

  /**
   * Binding Functions
   * - Adding event listeners to all the buttons and having the functionality behind the buttons being inputted as a function from index.js
   */
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

  bindNewRoundWin(handler) {
    this.$.newRoundWin.addEventListener("click", handler);
  }

  bindNewRoundTie(handler) {
    this.$.newRoundTie.addEventListener("click", handler);
  }

  bindQuitGameWin(handler) {
    this.$.quitWin.addEventListener("click", handler);
  }

  bindQuitGameTie(handler) {
    this.$.quitTie.addEventListener("click", handler);
  }

  /**
   * Helper Functions
   * - Functions that either help out with functionality within this file or index.js
   */

  // Sets CPU game board
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

  // Sets Multiplayer game board
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

  // Displays the player move within the squares
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

  // Displays the correct turn icon
  setTurnIcon(currentPlayer) {
    if (currentPlayer === "X") {
      this.$.turn.src = "./assets/icon-x.svg";
    } else {
      this.$.turn.src = "./assets/icon-o.svg";
    }
  }

  // Toggles the reset modal on when the reset button is clicked
  setResetModal() {
    this.$.resetModal.classList.toggle("hidden");
  }

  // Toggles the reset modal off when the cancel button is clicked
  cancelReset() {
    this.$.resetModal.classList.toggle("hidden");
  }

  // Resets the board back to the beginning of the round
  resetBoard() {
    const fullSquares = document.querySelectorAll(".board-piece");
    fullSquares.forEach((ele) => {
      ele.remove();
    });
    this.$.squares.forEach((ele) => {
      ele.style.border = 0;
    });
  }

  // Toggles the reset modal off and resets the board
  restartGame() {
    this.$.resetModal.classList.toggle("hidden");
    this.resetBoard();
  }

  // Toggles the win modal on and displays the correct message for an X win on multiplayer
  showWinModalX(playerMarker) {
    this.$.win.classList.toggle("hidden");
    if (playerMarker["P1"] === "X") {
      this.$.winMessage.textContent = "Player 1 Wins!";
    } else {
      this.$.winMessage.textContent = "Player 2 wins!";
    }
    this.$.winIcon.src = "./assets/icon-x.svg";
    this.$.winDesc.style.color = "hsl(178, 60%, 48%)";
  }

  // Toggles the win modal on and displays the correct message for an X win on CPU
  showWinModalXCPU(playerMarker) {
    this.$.win.classList.toggle("hidden");
    if (playerMarker["P1"] === "X") {
      this.$.winMessage.textContent = "You won!";
    } else {
      this.$.winMessage.textContent = "Oh no, you lost..";
    }
    this.$.winIcon.src = "./assets/icon-x.svg";
    this.$.winDesc.style.color = "hsl(178, 60%, 48%)";
  }

  // Changes the color of the winning squares for X
  changeBGColorX(squares) {
    squares.forEach((ele) => {
      let tempSquare = document.getElementById(ele);
      tempSquare.style.border = "2px solid hsl(178, 60%, 48%)";
    });
  }

  // Toggles the win modal on and displays the correct message for an O win on multiplayer
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

  // Toggles the win modal on and displays the correct message for an O win on CPU
  showWinModalOCPU(playerMarker) {
    this.$.win.classList.toggle("hidden");
    if (playerMarker["P1"] === "O") {
      this.$.winMessage.textContent = "You won!";
    } else {
      this.$.winMessage.textContent = "Oh no, you lost..";
    }
    this.$.winIcon.src = "./assets/icon-o.svg";
    this.$.winDesc.style.color = "hsl(39, 100%, 69%)";
  }

  // Changes the color of the winning squares for O
  changeBGColorO(squares) {
    squares.forEach((ele) => {
      let tempSquare = document.getElementById(ele);
      tempSquare.style.border = "2px solid hsl(39, 100%, 69%)";
    });
  }

  // Changes the score for X
  changeXScore(score) {
    this.$.xScore.textContent = String(score);
  }

  // Changes the score for O
  changeOScore(score) {
    this.$.oScore.textContent = String(score);
  }

  // Toggles the win modal off and resets the board
  newGame() {
    this.$.win.classList.toggle("hidden");
    this.resetBoard();
  }

  // Toggles the tie modal on
  showTieModal() {
    this.$.tie.classList.toggle("hidden");
  }

  // Changes the score for ties
  changeTieScore(score) {
    this.$.tieScore.textContent = String(score);
  }

  // Toggles the tie modal off and resets the board
  newGameTie() {
    this.$.tie.classList.toggle("hidden");
    this.resetBoard();
  }

  // Toggles the win modal and TTT board off, toggles the game menu on, and resets the board
  quitGameWin() {
    this.$.win.classList.toggle("hidden");
    this.$.gameBoard.classList.toggle("hidden");
    this.$.gameMenu.classList.toggle("hidden");
    this.resetBoard();
  }

  // Toggles the tie modal and TTT board off, toggles the game menu on, and resets the board
  quitGameTie() {
    this.$.tie.classList.toggle("hidden");
    this.$.gameBoard.classList.toggle("hidden");
    this.$.gameMenu.classList.toggle("hidden");
    this.resetBoard();
  }
}
