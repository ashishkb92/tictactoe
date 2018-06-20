class State {
  constructor(reducer, initialState) {
    this.state = initialState;
    this.observers = [];
    this.reducer = reducer;
  }
  dispatch(action) {
    const prevState = { ...this.state };
    const newState = this.reducer(this.state, action);
    this.state = newState;
    this.notify(prevState, newState);
  }
  notify(prevState, newState) {
    this.observers.forEach(observer => observer.update(prevState, newState));
  }
  connect(observer) {
    this.observers.push(observer);
  }
}

function reducer(state, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'FILL_SQUARE':
      newState.squares[
        action.lastSquareFilled
      ] = state.activePlayer().character;
      newState.lastSquareFilled = action.lastSquareFilled;
      return newState;

    case 'TOGGLE_PLAYER':
      newState.player1.toggleActive();
      newState.player2.toggleActive();
      return newState;

    case 'CHECK_WINNER':
      newState.winner = checkWinner(newState);
      return newState;

    default:
      return state;
  }
}

function checkWinner(state) {
  const playerToCheck = state.idlePlayer();
  var winCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  var winner = null;
  winCombination.forEach(winArray => {
    const [a, b, c] = winArray;
    if (
      state.squares[a] === playerToCheck.character &&
      state.squares[b] === playerToCheck.character &&
      state.squares[c] === playerToCheck.character
    ) {
      winner = playerToCheck;
    }
  });
  return winner;
}

class Player {
  constructor(character, isActive) {
    this.character = character;
    this.isActive = isActive;
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
}

const initialState = {
  player1: new Player('X', true),
  player2: new Player('O', false),
  squares: Array(9).fill(null),
  winner: null,
  lastSquareFilled: null,
  activePlayer: function() {
    return this.player1.isActive ? this.player1 : this.player2;
  },
  idlePlayer: function() {
    return this.player1.isActive ? this.player2 : this.player1;
  },
};

const store = new State(reducer, initialState);

class ChangeCurrentPlayer {
  constructor() {
    this.el = document.getElementById('current');
  }
  initial(state) {
    this.el.innerText = `Current player is ${state.activePlayer().character}`;
  }
  update(prevstate, state) {
    if (state.winner) {
      this.el.innerHTML = `Winner is ${state.winner.character}`;
    } else {
      this.el.innerText = `Current player is ${state.activePlayer().character}`;
    }
  }
}

const currentPlayerView = new ChangeCurrentPlayer();
currentPlayerView.initial(store.state);
store.connect(currentPlayerView);

class ChangeSquare {
  update(prevState, state) {
    const { player1, player2, lastSquareFilled, squares } = state;
    document.getElementById(
      `${lastSquareFilled}`,
    ).innerText = state.idlePlayer().character;
  }
}
const squareView = new ChangeSquare();
store.connect(squareView);

document.getElementById('board').addEventListener('click', function(event) {
  store.dispatch({
    type: 'FILL_SQUARE',
    lastSquareFilled: event.target.id,
  });
  store.dispatch({
    type: 'TOGGLE_PLAYER',
  });
  store.dispatch({
    type: 'CHECK_WINNER',
  });
  event.target.disabled = true;
});
