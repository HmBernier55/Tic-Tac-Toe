import View from "./view.js";
import Store from "./store.js";
// const playerButton = document.querySelectorAll(".player-button");

// Object that keeps track of who is what symbol
// const playerMarker = {
//   P1: "X",
//   P2: "O",
// };

// Checks for a click on either the X or O symbol
// playerButton.forEach((ele, index) => {
//   ele.addEventListener("click", () => {
//     if (index === 0) {
//       playerMarker["P1"] = "X";
//       playerMarker["P2"] = "O";
//       console.log(playerMarker);
//     } else {
//       playerMarker["P1"] = "O";
//       playerMarker["P2"] = "X";
//       console.log(playerMarker);
//     }
//   });
// });

// Starts the game vs the CPU
// function newGameCPU() {
//   const gameMenu = document.querySelector(".game-menu");
//   const gameBoard = document.querySelector(".game");
//   const xDesc = document.getElementById("x-desc");
//   const oDesc = document.getElementById("o-desc");

//   gameMenu.style.display = "none";
//   gameBoard.style.display = "flex";

//   if (playerMarker["P1"] === "X") {
//     xDesc.textContent = "(you)";
//     oDesc.textContent = "(cpu)";
//   } else {
//     xDesc.textContent = "(cpu)";
//     oDesc.textContent = "(you)";
//   }
// }

// Starts the game vs another player
// function newGameMulti() {
//   const gameMenu = document.querySelector(".game-menu");
//   const gameBoard = document.querySelector(".game");
//   const xDesc = document.getElementById("x-desc");
//   const oDesc = document.getElementById("o-desc");

//   gameMenu.style.display = "none";
//   gameBoard.style.display = "flex";

//   if (playerMarker["P1"] === "X") {
//     xDesc.textContent = "(P1)";
//     oDesc.textContent = "(P2)";
//   } else {
//     xDesc.textContent = "(P2)";
//     oDesc.textContent = "(P1)";
//   }
// }

const playerMarker = {
  P1: "X",
  P2: "O",
};

const winningPatterns = [
  ["block-0", "block-1", "block-2"],
  ["block-3", "block-4", "block-5"],
  ["block-6", "block-7", "block-8"],
  ["block-0", "block-3", "block-6"],
  ["block-1", "block-4", "block-7"],
  ["block-2", "block-5", "block-8"],
  ["block-0", "block-4", "block-8"],
  ["block-2", "block-4", "block-6"],
];

function init() {
  const view = new View();

  view.bindPlayerChoiceEvent((event) => {
    if (event.target.id === "X") {
      playerMarker["P1"] = "X";
      playerMarker["P2"] = "O";
      console.log(playerMarker);
    } else {
      playerMarker["P1"] = "O";
      playerMarker["P2"] = "X";
      console.log(playerMarker);
    }
  });

  const store = new Store(playerMarker);

  // TODO: Needs to play versus the computer
  view.bindNewGameCPU(() => {
    view.setGameBoardCPU(playerMarker);
    view.bindPlayerMove((event) => {
      const existingMove = store.gameMove.moves.find(
        (move) => move.id === event.id
      );

      if (existingMove) {
        return;
      }

      view.setPlayerMove(event.id, store.gameMove.currentPlayer);
      store.playMove(event.id);
      view.setTurnIcon(store.gameMove.currentPlayer);
    });
  });

  // Basic game of TTT
  view.bindNewGameMulti(() => {
    view.setGameBoardMulti(playerMarker);
    view.bindPlayerMove((event) => {
      const existingMove = store.gameMove.moves.find(
        (move) => move.id === event.id
      );

      if (existingMove) {
        return;
      }

      view.setPlayerMove(event.id, store.gameMove.currentPlayer);
      store.playMove(event.id);
      view.setTurnIcon(store.gameMove.currentPlayer);

      const xWins = winningPatterns.filter((pattern) => {
        return pattern.every((ele) => {
          return store.xMoves.includes(ele);
        });
      });

      const oWins = winningPatterns.filter((pattern) => {
        return pattern.every((ele) => {
          return store.oMoves.includes(ele);
        });
      });

      if (xWins.length === 1) {
        view.changeBGColorX(xWins[0]);
        view.showWinModalX(playerMarker);
      }

      if (oWins.length === 1) {
        view.changeBGColorO(oWins[0]);
        view.showWinModalO(playerMarker);
      }
    });
  });

  view.bindGameReset(() => {
    view.setResetModal();
  });

  view.bindCancel(() => {
    view.cancelReset();
  });

  view.bindRestart(() => {
    view.restartGame();
    store.deleteMoves();
    view.setTurnIcon(store.gameMove.currentPlayer);
  });
}

window.addEventListener("load", init);
