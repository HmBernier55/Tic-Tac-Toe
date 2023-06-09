// Initial values for moves, game info, and square ids
const initialValue = {
  moves: [],
  games: {
    total: 0,
    tied: 0,
    x: 0,
    o: 0,
  },
  squareIDs: [
    "block-0",
    "block-1",
    "block-2",
    "block-3",
    "block-4",
    "block-5",
    "block-6",
    "block-7",
    "block-8",
  ],
};

export default class Store {
  #state = initialValue;

  constructor(players) {
    this.players = players;
  }

  /**
   * Getter Functions
   */

  // Retrieves the current player (either X or O) and the moves array
  get gameMove() {
    const state = this.#getState();
    let currentPlayer;

    if (state.games.total % 2 === 0) {
      currentPlayer = state.moves.length % 2 === 0 ? "X" : "O";
    } else {
      currentPlayer = state.moves.length % 2 === 0 ? "O" : "X";
    }

    return {
      currentPlayer,
      moves: state.moves,
    };
  }

  // Retrieves an array of X's moves
  get xMoves() {
    const state = this.#getState();
    const movesOfX = [];

    state.moves.forEach((ele) => {
      if (ele.player === "X") {
        movesOfX.push(ele.id);
      }
    });

    return movesOfX;
  }

  // Retrieves an array of O's moves
  get oMoves() {
    const state = this.#getState();
    const movesOfO = [];

    state.moves.forEach((ele) => {
      if (ele.player === "O") {
        movesOfO.push(ele.id);
      }
    });

    return movesOfO;
  }

  // Retrieves an array of all the moves played during each game
  get allMoves() {
    const state = this.#getState();

    const moves = [];

    state.moves.forEach((ele) => {
      moves.push(ele.id);
    });

    return moves;
  }

  // Retrieves the total wins for X
  get totalXWins() {
    const state = this.#getState();

    return state.games.x;
  }

  // Retrieves the total wins for O
  get totalOWins() {
    const state = this.#getState();

    return state.games.o;
  }

  // Retrieves the total ties
  get totalTies() {
    const state = this.#getState();

    return state.games.tied;
  }

  // Retrieves the array of square ids
  get squareIDs() {
    const state = this.#getState();

    return state.squareIDs;
  }

  /**
   * Helper Functions
   */

  // Adds a move (an object consisting of the square id and who played it) to the moves array
  playMove(squareId) {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.moves.push({
      id: squareId,
      player: this.gameMove.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  // Deletes all the moves within the moves array
  deleteMoves() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.moves = [];

    this.#saveState(stateClone);
  }

  // Resets all the score variables back to zero
  deleteGames() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.games.x = 0;
    stateClone.games.tied = 0;
    stateClone.games.o = 0;
    stateClone.games.total = 0;

    this.#saveState(stateClone);
  }

  // Deletes a square id from the square id array
  deleteSquareID(squareId) {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    const idx = stateClone.squareIDs.indexOf(squareId);
    stateClone.squareIDs.splice(idx, 1);

    this.#saveState(stateClone);
  }

  // Resets the square id array
  resetSquareID() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.squareIDs = [
      "block-0",
      "block-1",
      "block-2",
      "block-3",
      "block-4",
      "block-5",
      "block-6",
      "block-7",
      "block-8",
    ];

    this.#saveState(stateClone);
  }

  // Updates total games and X wins values
  xWin() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.games.x += 1;
    stateClone.games.total += 1;

    this.#saveState(stateClone);
  }

  // Updates total games and O wins values
  oWin() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.games.o += 1;
    stateClone.games.total += 1;

    this.#saveState(stateClone);
  }

  // Updates total games and tie values
  gameTie() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.games.tied += 1;
    stateClone.games.total += 1;

    this.#saveState(stateClone);
  }

  /**
   * Private Functions
   * - Used to get the state variable and update the state variable
   */
  #getState() {
    return this.#state;
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState");
    }
    this.#state = newState;
  }
}
