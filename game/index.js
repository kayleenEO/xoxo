import { Map } from "immutable";

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
export default function reducer(state = { turn: "X", board: Map() }, action) {
  switch (action.type) {
    case MOVE:
      if (state.turn === "X") {
        state.turn = "O";
      } else {
        state.turn = "X";
      }
      return {
        turn: state.turn,
        board: state.board.setIn(action.position, action.turn)
      };
    default:
      return state;
  }
}
