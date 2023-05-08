import View from "./view.js";
import Store from "./store.js";

/**
 * Object that stores which player has which piece
 * Initialized to start with player one having X
 * - Accounts for when the player forgets to select a piece at the main menu
 */
const playerMarker = {
  P1: "X",
  P2: "O",
};

/**
 * Array of the eight different ways a player can win in Tic-Tac-Toe
 * - Values in the arrays are named after the ids of the squares on the TTT board
 */
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

/**
 * Initializing a helper variable to decipher which game mode is being played
 */
let gameType;

/**
 * A helper function to grab a random number between 0 and 8
 * - Used for the random placement of a piece for the computer
 */
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Main function that runs the entire game
 */
function init() {
  const view = new View();

  /**
   * Helper function that checks for a win, lose, or tie on the CPU game mode
   * - Runs through the winning patterns array and checks if each player has the moves to match any of the patterns
   * -- If so, then it brings up the win modal, stores the win, and updates the score
   * -- If there is a tie, meaning all 9 squares have a value and there are no matches to the winning patterns, then it brings up the tie modal, stores the tie, and updates the score
   * - Returns a boolean to ensure that after someone wins the computer doesn't try and make an extra move
   */
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

  /**
   * Helper function that checks for a win, lose, or tie on the multiplayer game mode
   * - Runs through the winning patterns array and checks if each player has the moves to match any of the patterns
   * -- If so, then it brings up the win modal, stores the win, and updates the score
   * -- If there is a tie, meaning all 9 squares have a value and there are no matches to the winning patterns, then it brings up the tie modal, stores the tie, and updates the score
   */
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

  /**
   * Sets the pieces according to whichever piece player one selects
   */
  view.bindPlayerChoiceEvent((event) => {
    if (event.target.id === "X") {
      playerMarker["P1"] = "X";
      playerMarker["P2"] = "O";
    } else {
      playerMarker["P1"] = "O";
      playerMarker["P2"] = "X";
    }
  });

  const store = new Store(playerMarker);

  /**
   * Sets game mode to CPU, sets up the CPU board with the correct score cards, and if the computer is X (X goes first always) it plays the first move
   */
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

  /**
   * Sets game mode to multiplayer and sets up the multiplayer board with the correct score cards
   */
  view.bindNewGameMulti(() => {
    gameType = "Multi";
    view.setGameBoardMulti(playerMarker);
  });

  /**
   * Event listener for the squares on the TTT board
   * - Ensures that you can't click on a square that is already occupied
   * - If the square is empty, the correct piece is placed in the square, the move is stored in memory, the turn icon is updated, and the id for the square that was just played is deleted from memory (useful for the computer's move logic)
   *
   * - If the game mode is multiplayer:
   * -- It checks for a win/tie and if there isn't one, then it waits for the next move
   *
   * - If the game mode is CPU:
   * -- It checks for a win/tie and if there isn't one, then the computer plays it's move
   */
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

      /**
       * Computer's Logic:
       * - Determines if the computer is one move away from a win by using the winning patterns array and the moves array for either X or O depending on which piece the computer is
       * - If a pattern from the winning patterns array is returned, then the winning move (meaning the final square id) is identified and the move is played resulting in a computer win
       * - If a pattern is not identified from the winning patterns array, then the computer looks at the other players moves to determine if they are one move away from a win using the same logic
       * - If the other player is one move away, then the computer identifies that move and plays it
       * -- Within each of these scenarios, if there are multiple ways the computer can win or block it just chooses the first move it identifies from the winning patterns array
       * - If the computer can neither win nor block, it plays a random move in one of the remaining squares
       */
      let possibleCPUWins;
      let possibleCPULose;

      // Determining possible wins and blocks for the CPU
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

      // Plays the winning move first (if applicable), then the blocking move (if applicable), then a random move if all else fails
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

  /**
   * Sets the reset button to the reset modal
   */
  view.bindGameReset(() => {
    view.setResetModal();
  });

  /**
   * Sets the cancel button within the reset modal to toggle off the modal and return back to the game
   */
  view.bindCancel(() => {
    view.cancelReset();
  });

  /**
   * Sets the restart game button within the reset modal
   * - Clears the board
   * - Resets the turn icon
   * - Resets the moves and square ids in memory
   * - If your playing against the CPU, the CPU started that round initially, and you reset the game, the CPU will go first again
   */
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

  /**
   * Sets the new round button on the win modal
   * - Toggles off the win modal
   * - Resets the moves and square ids in memory
   * - Resets the turn icon to the correct player
   * - If your playing against the computer and it is supposed to go first this round, then it will play its move
   */
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

  /**
   * Runs the same set up as the new round button on the win modal
   */
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

  /**
   * Sets the quit button on the win modal
   * - Toggles the win modal and the TTT board off
   * - Toggles the game menu on
   * - Resets all the memory back to the initial values
   * - Resets the scores back to zero
   * - Resets the turn icon
   */
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

  /**
   * Runs the same set up as the win modal quit button
   */
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
