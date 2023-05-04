import View from "./view.js";
import Store from "./store.js";

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
        store.xWin();
        view.showWinModalX(playerMarker);
        view.changeXScore(store.totalXWins);
      } else if (oWins.length === 1) {
        view.changeBGColorO(oWins[0]);
        store.oWin();
        view.showWinModalO(playerMarker);
        view.changeOScore(store.totalOWins);
      } else if (store.gameMove.moves.length === 9) {
        store.gameTie();
        view.showTieModal();
        view.changeTieScore(store.totalTies);
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

  view.bindNewRoundWin(() => {
    view.newGame();
    store.deleteMoves();
    view.setTurnIcon(store.gameMove.currentPlayer);
  });

  view.bindNewRoundTie(() => {
    view.newGameTie();
    store.deleteMoves();
    view.setTurnIcon(store.gameMove.currentPlayer);
  });

  view.bindQuitGameWin(() => {
    view.quitGameWin();
    store.deleteMoves();
    store.deleteGames();
    view.changeOScore(store.totalOWins);
    view.changeXScore(store.totalXWins);
    view.changeTieScore(store.totalTies);
    view.setTurnIcon(store.gameMove.currentPlayer);
  });

  view.bindQuitGameTie(() => {
    view.quitGameTie();
    store.deleteMoves();
    store.deleteGames();
    view.changeOScore(store.totalOWins);
    view.changeXScore(store.totalXWins);
    view.changeTieScore(store.totalTies);
    view.setTurnIcon(store.gameMove.currentPlayer);
  });
}

window.addEventListener("load", init);
