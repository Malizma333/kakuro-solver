import { DEBUG } from "./constants";
import { GetSumSet, CELL_TYPE } from "./board";
import type { BoardCellType } from "./board";

const SolveState = {
  board: [] as number[][][],
  width: 0,
  height: 0,
  visited: [] as number[]
};

function ConstructStates(boardState: BoardCellType[][]) {
  SolveState.board = [] as number[][][];
  SolveState.width = boardState.length;
  SolveState.height = boardState[0].length;
  SolveState.visited = [] as number[];

  for(let i = 0; i < SolveState.width; i++) {
    SolveState.board.push([] as number[][]);
    for(let j = 0; j < SolveState.height; j++) {
      if(boardState[i][j].type !== CELL_TYPE.PUZZLE) {
        SolveState.board[i].push([]);
        continue;
      }

      const colArray = [] as number[];
      const rowArray = [] as number[];

      for(let hintCol = j; hintCol >= 0; hintCol--) {
        if(boardState[i][hintCol].type === CELL_TYPE.NONE) break;
        if(boardState[i][hintCol].type === CELL_TYPE.HINT) {
          GetSumSet(
            boardState[i][hintCol].lengthData[0],
            parseInt(boardState[i][hintCol].displayData[0])
          ).forEach((item: number) => colArray.push(item))
          break;
        }
      }
      
      for(let hintRow = i; hintRow >= 0; hintRow--) {
        if(boardState[hintRow][j].type === CELL_TYPE.NONE) break;
        if(boardState[hintRow][j].type === CELL_TYPE.HINT) {
          GetSumSet(
            boardState[hintRow][j].lengthData[1],
            parseInt(boardState[hintRow][j].displayData[1])
          ).forEach((item: number) => rowArray.push(item))
          break;
        }
      }

      const superposition = [] as number[];

      if(rowArray.length === 0) {
        colArray.forEach((i: number) => superposition.push(i))
      } else if(colArray.length === 0) {
        rowArray.forEach((i: number) => superposition.push(i))
      } else {
        rowArray.forEach((i: number) => colArray.includes(i) && superposition.push(i))
      }

      SolveState.board[i].push(superposition);

      DEBUG && console.info(`Cell ${i}, ${j}: ${JSON.stringify(superposition)}`);
    }
  }
}

function GetLeastEntropy() {
  let mEntropy = 9;
  let pairs = [];

  for(let i = 0; i < SolveState.width; i++) {
    for(let j = 0; j < SolveState.height; j++) {
      if(SolveState.board[i][j].length === 0 || SolveState.visited.includes(SolveState.height*i+j)) continue

      if(SolveState.board[i][j].length < mEntropy) {
        mEntropy = SolveState.board[i][j].length;
        pairs.length = 0;
      }

      if(SolveState.board[i][j].length === mEntropy) {
        pairs.push([i,j]);
      }
    }
  }

  if(pairs.length === 0) mEntropy = 1;

  DEBUG && console.info(`Entropy Pairs (${mEntropy}): ${JSON.stringify(pairs)}`)

  return pairs;
}

// Does not account for nearly complete sums
// Possibly need to introduce backtracking?
function PropagateSums() {
  
}

function PropagateCollisions() {
  const removeArray = [];

  while(true) {
    for(let i = 0; i < SolveState.width; i++) {
      for(let j = 0; j < SolveState.height; j++) {
        if(SolveState.board[i][j].length !== 1 || SolveState.visited.includes(SolveState.height*i+j)) continue;
        removeArray.push([i, j, SolveState.board[i][j][0]]);
        SolveState.visited.push(SolveState.height*i+j);
      }
    }

    if(removeArray.length === 0) break;

    DEBUG && console.info(`Removing ${JSON.stringify(removeArray)}`);

    for(const v of removeArray) {
      const toRem = v[2];

      for(let k = v[0] + 1; k < SolveState.width; k++) {
        if(SolveState.board[k][v[1]].length === 0) break;
        const vIndex = SolveState.board[k][v[1]].indexOf(toRem);
        if(vIndex === -1) continue;
        SolveState.board[k][v[1]].splice(vIndex, 1);
      }

      for(let k = v[0] - 1; k > 0; k--) {
        if(SolveState.board[k][v[1]].length === 0) break;
        const vIndex = SolveState.board[k][v[1]].indexOf(toRem);
        if(vIndex === -1) continue;
        SolveState.board[k][v[1]].splice(vIndex, 1);
      }

      for(let k = v[1] + 1; k < SolveState.height; k++) {
        if(SolveState.board[v[0]][k].length === 0) break;
        const vIndex = SolveState.board[v[0]][k].indexOf(toRem);
        if(vIndex === -1) continue;
        SolveState.board[v[0]][k].splice(vIndex, 1);
      }

      for(let k = v[1] - 1; k > 0; k--) {
        if(SolveState.board[v[0]][k].length === 0) break;
        const vIndex = SolveState.board[v[0]][k].indexOf(toRem);
        if(vIndex === -1) continue;
        SolveState.board[v[0]][k].splice(vIndex, 1);
      }
    }

    removeArray.length = 0;
  }
}

export function SolveBoard(boardState: BoardCellType[][]) {
  DEBUG && console.info("Initializing");
  
  ConstructStates(boardState);

  while(true) {
    PropagateCollisions();
    const leastEntropyPairs = GetLeastEntropy();
    
    if(leastEntropyPairs.length === 0) {
      break;
    }

    SolveState.board[leastEntropyPairs[0][0]][leastEntropyPairs[0][1]].splice(1);
  }

  for(let i = 0; i < SolveState.width; i++) {
    for(let j = 0; j < SolveState.height; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        boardState[i][j].displayData.push(SolveState.board[i][j].join('/'));
      }
    }
  }

  return boardState;
}