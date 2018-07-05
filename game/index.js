import { Map } from "immutable";
import { winner } from '../index'
//Action Types
const MOVE = "move";
const START = "START";

//Action Creator
export const move = (turn, position) => ({
  type: MOVE,
  turn,
  position
});

//reducer
// export default function reducer(state = { turn: "X", board: Map() }, action) {
//   switch (action.type) {
//     case MOVE:
//       if (state.turn === "X") {
//         state.turn = "O";
//       } else {
//         state.turn = "X";
//       }
//       return {
//         turn: state.turn,
//         board: state.board.setIn(action.position, action.turn)
//       };
//     default:
//       return state;
//   }
// }

function turnReducer(turn = "X", action) {
  if(action.type === MOVE) {
    if (turn === "X") {
      turn = "O";
    } else {
      turn = "X";
    }
  }
  return turn;
}

function boardReducer(board = Map(), action) {
  if(action.type === MOVE) {
    return board.setIn(action.position, action.turn)
  }
  return board
}

// const initialState = { turn: "X", board: Map()}
export default function reducer(state={}, action) {
  const nextBoard = boardReducer(state.board, action);
  const winnerState = winner(nextBoard);
  return {
    board: nextBoard,
    turn: turnReducer(state.turn, action),
    winner: winnerState
  }
}
