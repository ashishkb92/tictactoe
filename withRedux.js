const createStore = (reducer, initialState) => {
  let store = {};
  let state = initialState;
  let listeners = [];
  store.getState = () => state;
  store.subscribe = (cb) => listeners.push(cb);
  store.dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((cb) => cb());
  };
  return store;
};

const actionCreators = {
  fillSquare(id) {
    return {
      type: 'FILL_SQUARE',
      payload: { id }
    };
  }
};

class Player {
  constructor(name, character) {
    this.name = name;
    this.character = character;
  }
}

const squares = Array(9).fill(null);
const player1 = new Player('Ashish Kumar', 'x');
const player2 = new Player('Kiran Priyadarshini', 'o');
const activePlayer = player1;
const winner = null;

const initialState = {
  squares,
  player1,
  player2,
  activePlayer,
  winner
};

function reducer(state, action) {
  const { type, payload } = action;
  const newState = { ...state };
  switch (type) {
    case 'FILL_SQUARE':
      newState.squares[payload.id] = newState.activePlayer.character;
      newState.winner = checkWinner(newState);
      newState.activePlayer =
        newState.activePlayer.name === newState.player1.name ? newState.player2 : newState.player1;
      return newState;
    default:
      return newState;
  }
}

const store = createStore(reducer, initialState);

const element = document.querySelector('.box');
element.addEventListener('click', function(e) {
  const state = store.getState();
  console.log(state);
  if (state.winner) return;
  if (state.squares[e.target.id.split('-')[1]]) return;
  store.dispatch(actionCreators.fillSquare(e.target.id.split('-')[1]));
});

store.subscribe(() => {
  const state = store.getState();
  state.squares.forEach((char, index) => {
    if (char) document.querySelector(`#id-${index}`).innerHTML = char;
  });
  if (state.winner)
    document.querySelector('.winner_text').innerHTML = `${state.winner.name} wins :)`;
});

function checkWinner(state) {
  const { activePlayer, squares } = state;
  const winningCombinationArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const winningCombination of winningCombinationArray) {
    if (
      squares[winningCombination[0]] === activePlayer.character &&
      squares[winningCombination[1]] === activePlayer.character &&
      squares[winningCombination[2]] === activePlayer.character
    )
      return activePlayer;
  }
  return null;
}
