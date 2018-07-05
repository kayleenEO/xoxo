import inquirer from "inquirer";

import gameReducer, { move } from "./game";
import { createStore } from "redux";

const printBoard = () => {
  const { board } = game.getState();
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], "_"));
    }
    process.stdout.write("\n");
  }
};

const streak = (board, ...remainingCoords) => {
  let numX = 0;
  let numO = 0;
  // console.log(remainingCoords);
  remainingCoords.forEach(coordinate => {
    // console.log(coordinate, board.getIn(coordinate))
    if(board.getIn(coordinate) === 'X') {
      numX++;
    }
    else if(board.getIn(coordinate) === 'O') {
      numO++;
    }
  })

  // console.log(`numX: ${numX}, numO: ${numO}`)
  if(numX === 3) {
    return 'X'
  }
  else if(numO === 3) {
    return 'O'
  }
  else if(numO + numX === 3) {
    return 'full'
  }
  else {
    return null
  }
}

export const winner = (board)  => {
  // const { board } = game.getState();
  console.log("board", board)

  let resultArr = []

  resultArr.push(streak(board, [0, 0], [0, 1], [0 ,2])); //row 1
  resultArr.push(streak(board, [1, 0], [1, 1], [1 ,2])); //row 2
  resultArr.push(streak(board, [2, 0], [2, 1], [2 ,2])); //row 3
  resultArr.push(streak(board, [0, 0], [1, 0], [2 ,0])); //col 1
  resultArr.push(streak(board, [0, 1], [1, 1], [2 ,1])); //col 2
  resultArr.push(streak(board, [0, 2], [1, 2], [2 ,2])); //col 3
  resultArr.push(streak(board, [0, 0], [1, 1], [2 ,2])); //dia 1
  resultArr.push(streak(board, [2, 0], [1, 1], [0 ,2])); //dia 2
  // console.log('resultArr' , resultArr)

  let fullCount = 0;
  let resultString = ''
  resultArr.forEach(result => {
    // console.log('result', result)
    if(result === 'O' || result === 'X') {
      // console.log('inside our conditional')
      resultString = `${result} won the game!`
    }
    else if(result === 'full') {
      fullCount++;
    }
  })

  // console.log('fullcount', fullCount)
  // console.log('resultString', resultString)
  if(fullCount === 8) {
    console.log('draw')
    return 'draw'
  }
  else if(resultString) {
    console.log(resultString)
    return resultString
  }
  else {
    console.log('ongoing')
    return 'ongoing'
  }
}

const getInput = player => async () => {
  const { turn } = game.getState();
  if (turn !== player) return;
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "coord",
      message: `${turn}'s move (row,col):`
    }
  ]);
  const [row = 0, col = 0] = ans.coord.split(/[,\s+]/).map(x => +x);
  game.dispatch(move(turn, [row, col]));
};

// Create the store
const game = createStore(gameReducer);

// Debug: Print the state
//game.subscribe(() => console.log(game.getState()));
// const { board } = game.getState();

game.subscribe(printBoard);
game.subscribe(getInput("X"));
game.subscribe(getInput("O"));
// const {board} = game.getState()
// console.log(board)
// game.subscribe(winner(board));

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: "START" });
