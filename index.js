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

let gameType;

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function init() {
  const view = new View();

  function checkForCPUWin() {
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
      view.showWinModalXCPU(playerMarker);
      view.changeXScore(store.totalXWins);
      return true;
    } else if (oWins.length === 1) {
      view.changeBGColorO(oWins[0]);
      store.oWin();
      view.showWinModalOCPU(playerMarker);
      view.changeOScore(store.totalOWins);
      return true;
    } else if (store.gameMove.moves.length === 9) {
      store.gameTie();
      view.showTieModal();
      view.changeTieScore(store.totalTies);
      return true;
    } else {
      return false;
    }
  }

  function checkForMultiWin() {
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
  }

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
    gameType = "CPU";
    view.setGameBoardCPU(playerMarker);

    setTimeout(() => {
      if (playerMarker["P2"] === "X") {
        const randIdx = getRandomIndex(store.squareIDs.length);

        view.setPlayerMove(
          store.squareIDs[randIdx],
          store.gameMove.currentPlayer
        );
        store.playMove(store.squareIDs[randIdx]);
        view.setTurnIcon(store.gameMove.currentPlayer);
        store.deleteSquareID(store.squareIDs[randIdx]);
      }
    }, 500);
  });

  view.bindNewGameMulti(() => {
    gameType = "Multi";
    view.setGameBoardMulti(playerMarker);
  });

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
    store.deleteSquareID(event.id);

    if (gameType === "Multi") {
      checkForMultiWin();
    }

    if (gameType === "CPU") {
      // Check for winner
      if (checkForCPUWin()) {
        return;
      }
      // Logic behind CPU's decisions
      let possibleCPUWins;
      let possibleCPULose;

      // Determining possible wins and losses for the CPU
      if (playerMarker["P2"] === "X") {
        possibleCPUWins = winningPatterns.filter((pattern) => {
          return (
            pattern.filter((ele) => {
              return store.xMoves.includes(ele);
            }).length === 2
          );
        });

        possibleCPULose = winningPatterns.filter((pattern) => {
          return (
            pattern.filter((ele) => {
              return store.oMoves.includes(ele);
            }).length === 2
          );
        });
      } else {
        possibleCPUWins = winningPatterns.filter((pattern) => {
          return (
            pattern.filter((ele) => {
              return store.oMoves.includes(ele);
            }).length === 2
          );
        });

        possibleCPULose = winningPatterns.filter((pattern) => {
          return (
            pattern.filter((ele) => {
              return store.xMoves.includes(ele);
            }).length === 2
          );
        });
      }

      // Gets winning square for CPU if applicable
      let winning = [];
      possibleCPUWins.forEach((pattern) => {
        let winningSquare = pattern.filter((ele) => {
          return !store.allMoves.includes(ele);
        });

        if (store.squareIDs.includes(winningSquare[0])) {
          winning.push(winningSquare[0]);
        }
      });

      // Gets blocking square for CPU if applicable
      let blocking = [];
      possibleCPULose.forEach((pattern) => {
        let blockingSquare = pattern.filter((ele) => {
          return !store.allMoves.includes(ele);
        });

        if (store.squareIDs.includes(blockingSquare[0])) {
          blocking.push(blockingSquare[0]);
        }
      });

      // Plays the winning move

      setTimeout(() => {
        if (winning.length > 0) {
          view.setPlayerMove(winning[0], store.gameMove.currentPlayer);
          store.playMove(winning[0]);
          view.setTurnIcon(store.gameMove.currentPlayer);
          store.deleteSquareID(winning[0]);
          checkForCPUWin();
        } else if (blocking.length > 0) {
          view.setPlayerMove(blocking[0], store.gameMove.currentPlayer);
          store.playMove(blocking[0]);
          view.setTurnIcon(store.gameMove.currentPlayer);
          store.deleteSquareID(blocking[0]);
          checkForCPUWin();
        } else {
          let randNum = getRandomIndex(store.squareIDs.length);

          view.setPlayerMove(
            store.squareIDs[randNum],
            store.gameMove.currentPlayer
          );
          store.playMove(store.squareIDs[randNum]);
          view.setTurnIcon(store.gameMove.currentPlayer);
          store.deleteSquareID(store.squareIDs[randNum]);
          checkForCPUWin();
        }
      }, 500);
    }
  });

  // });

  // Basic game of TTT

  //   view.bindPlayerMove((event) => {
  //     const existingMove = store.gameMove.moves.find(
  //       (move) => move.id === event.id
  //     );

  //     if (existingMove) {
  //       return;
  //     }

  //     view.setPlayerMove(event.id, store.gameMove.currentPlayer);
  //     store.playMove(event.id);
  //     view.setTurnIcon(store.gameMove.currentPlayer);

  //     const xWins = winningPatterns.filter((pattern) => {
  //       return pattern.every((ele) => {
  //         return store.xMoves.includes(ele);
  //       });
  //     });

  //     const oWins = winningPatterns.filter((pattern) => {
  //       return pattern.every((ele) => {
  //         return store.oMoves.includes(ele);
  //       });
  //     });

  //     if (xWins.length === 1) {
  //       view.changeBGColorX(xWins[0]);
  //       store.xWin();
  //       view.showWinModalX(playerMarker);
  //       view.changeXScore(store.totalXWins);
  //     } else if (oWins.length === 1) {
  //       view.changeBGColorO(oWins[0]);
  //       store.oWin();
  //       view.showWinModalO(playerMarker);
  //       view.changeOScore(store.totalOWins);
  //     } else if (store.gameMove.moves.length === 9) {
  //       store.gameTie();
  //       view.showTieModal();
  //       view.changeTieScore(store.totalTies);
  //     }
  //   });
  // });

  view.bindGameReset(() => {
    view.setResetModal();
  });

  view.bindCancel(() => {
    view.cancelReset();
  });

  view.bindRestart(() => {
    view.restartGame();
    store.deleteMoves();
    store.resetSquareID();
    view.setTurnIcon(store.gameMove.currentPlayer);

    if (
      gameType === "CPU" &&
      store.gameMove.currentPlayer === playerMarker["P2"]
    ) {
      setTimeout(() => {
        const randIdx = getRandomIndex(store.squareIDs.length);

        view.setPlayerMove(
          store.squareIDs[randIdx],
          store.gameMove.currentPlayer
        );
        store.playMove(store.squareIDs[randIdx]);
        view.setTurnIcon(store.gameMove.currentPlayer);
        store.deleteSquareID(store.squareIDs[randIdx]);
      }, 500);
    }
  });

  view.bindNewRoundWin(() => {
    view.newGame();
    store.deleteMoves();
    view.setTurnIcon(store.gameMove.currentPlayer);
    store.resetSquareID();

    if (
      gameType === "CPU" &&
      store.gameMove.currentPlayer === playerMarker["P2"]
    ) {
      setTimeout(() => {
        const randIdx = getRandomIndex(store.squareIDs.length);

        view.setPlayerMove(
          store.squareIDs[randIdx],
          store.gameMove.currentPlayer
        );
        store.playMove(store.squareIDs[randIdx]);
        view.setTurnIcon(store.gameMove.currentPlayer);
        store.deleteSquareID(store.squareIDs[randIdx]);
      }, 500);
    }
  });

  view.bindNewRoundTie(() => {
    view.newGameTie();
    store.deleteMoves();
    view.setTurnIcon(store.gameMove.currentPlayer);
    store.resetSquareID();

    if (
      gameType === "CPU" &&
      store.gameMove.currentPlayer === playerMarker["P2"]
    ) {
      setTimeout(() => {
        const randIdx = getRandomIndex(store.squareIDs.length);

        view.setPlayerMove(
          store.squareIDs[randIdx],
          store.gameMove.currentPlayer
        );
        store.playMove(store.squareIDs[randIdx]);
        view.setTurnIcon(store.gameMove.currentPlayer);
        store.deleteSquareID(store.squareIDs[randIdx]);
      }, 500);
    }
  });

  view.bindQuitGameWin(() => {
    view.quitGameWin();
    store.deleteMoves();
    store.deleteGames();
    store.resetSquareID();
    view.changeOScore(store.totalOWins);
    view.changeXScore(store.totalXWins);
    view.changeTieScore(store.totalTies);
    view.setTurnIcon(store.gameMove.currentPlayer);
  });

  view.bindQuitGameTie(() => {
    view.quitGameTie();
    store.deleteMoves();
    store.deleteGames();
    store.resetSquareID();
    view.changeOScore(store.totalOWins);
    view.changeXScore(store.totalXWins);
    view.changeTieScore(store.totalTies);
    view.setTurnIcon(store.gameMove.currentPlayer);
  });
}

window.addEventListener("load", init);
