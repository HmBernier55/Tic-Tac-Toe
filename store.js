const initialValue = {
  moves: [],
};

export default class Store {
  #state = initialValue;

  constructor(players) {
    this.players = players;
  }

  get gameMove() {
    const state = this.#getState();

    const currentPlayer = state.moves.length % 2 === 0 ? "X" : "O";

    return {
      currentPlayer,
      moves: state.moves,
    };
  }

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

  playMove(squareId) {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.moves.push({
      id: squareId,
      player: this.gameMove.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  deleteMoves() {
    const state = this.#getState();

    const stateClone = structuredClone(state);

    stateClone.moves = [];

    this.#saveState(stateClone);
  }

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
