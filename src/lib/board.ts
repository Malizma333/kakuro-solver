const BOARD_CONSTRAINTS = Object.freeze({ MIN: 5, MAX: 20, DEF: 10 });
const CELL_TYPE = Object.freeze({ NONE: 0, PUZZLE: 1, HINT: 2 });
const HINT_CONSTRAINTS = Object.freeze({ MIN: 3, MAX: 45 });
export {BOARD_CONSTRAINTS, CELL_TYPE, HINT_CONSTRAINTS};

export interface BoardType {
  width: number;
  height: number;
  state: BoardCellType[][];
};

export interface BoardCellType {
  type: 0 | 1 | 2;
  displayData: string[];
  lengthData: number[];
};

let GetSumSet: Function;

export async function InitSummation() {
  const data = await fetch("sums.json").then(r => r.json());
  GetSumSet = (size: number, sum: number) => {
    return data[sum - 3][size - 2];
  }
}

export function NewBoard() {
  return {
    width: BOARD_CONSTRAINTS.DEF,
    height: BOARD_CONSTRAINTS.DEF,
    state: Array(BOARD_CONSTRAINTS.DEF).fill(null).map(
      () => Array(BOARD_CONSTRAINTS.DEF).fill(null).map(
        () => {return {type: 0, displayData: [], lengthData: [-1,-1]} as BoardCellType}
      )
    )
  }
}

function ConstructStates(boardState: BoardCellType[][]) {
  const multiStateBoard = [] as number[][][];

  for(let i = 0; i < boardState.length; i++) {
    multiStateBoard.push([] as number[][]);
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type !== CELL_TYPE.PUZZLE) {
        multiStateBoard[i].push([]);
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

      multiStateBoard[i].push(superposition);

      console.info(`Cell ${i}, ${j}: ${JSON.stringify(superposition)}`);
    }
  }

  return multiStateBoard;
}

function GetLeastEntropy(board: number[][][], visited: number[]) {
  let mEntropy = 9;
  let pairs = [];

  for(let i = 0; i < board.length; i++) {
    for(let j = 0; j < board[i].length; j++) {
      if(board[i][j].length === 0 || visited.includes(board[i].length*i+j)) continue

      if(board[i][j].length < mEntropy) {
        mEntropy = board[i][j].length;
        pairs.length = 0;
      }

      if(board[i][j].length === mEntropy) {
        pairs.push([i,j]);
      }
    }
  }

  if(pairs.length === 0) mEntropy = 1;

  console.info(`Entropy Pairs (${mEntropy}): ${JSON.stringify(pairs)}`)

  return pairs;
}

// Does not account for nearly complete sums
// Possibly need to introduce backtracking?
function PropagateCollisions(board: number[][][], visited: number[]) {
  const removeArray = [];

  while(true) {
    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
        if(board[i][j].length !== 1 || visited.includes(board[i].length*i+j)) continue;
        removeArray.push([i, j, board[i][j][0]]);
        visited.push(board[i].length*i+j);
      }
    }

    if(removeArray.length === 0) break;

    console.info(`Removing ${JSON.stringify(removeArray)}`);

    for(const v of removeArray) {
      const toRem = v[2];

      for(let k = v[0] + 1; k < board.length; k++) {
        if(board[k][v[1]].length === 0) break;
        const vIndex = board[k][v[1]].indexOf(toRem);
        if(vIndex === -1) continue;
        board[k][v[1]].splice(vIndex, 1);
      }

      for(let k = v[0] - 1; k >= 0; k--) {
        if(board[k][v[1]].length === 0) break;
        const vIndex = board[k][v[1]].indexOf(toRem);
        if(vIndex === -1) continue;
        board[k][v[1]].splice(vIndex, 1);
      }

      for(let k = v[1] + 1; k < board.length; k++) {
        if(board[v[0]][k].length === 0) break;
        const vIndex = board[v[0]][k].indexOf(toRem);
        if(vIndex === -1) continue;
        board[v[0]][k].splice(vIndex, 1);
      }

      for(let k = v[1] - 1; k >= 0; k--) {
        if(board[v[0]][k].length === 0) break;
        const vIndex = board[v[0]][k].indexOf(toRem);
        if(vIndex === -1) continue;
        board[v[0]][k].splice(vIndex, 1);
      }
    }

    removeArray.length = 0;
  }
}

export function SolveBoard(boardState: BoardCellType[][]) {
  console.info("Initializing");
  const solutionBoard = ConstructStates(boardState);
  const visited = [] as number[];

  while(true) {
    PropagateCollisions(solutionBoard, visited);
    const leastEntropyPairs = GetLeastEntropy(solutionBoard, visited);
    if(leastEntropyPairs.length === 0) break;
    solutionBoard[leastEntropyPairs[0][0]][leastEntropyPairs[0][1]].splice(1);
  }

  for(let i = 0; i < boardState.length; i++) {
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type !== CELL_TYPE.PUZZLE) continue;
      boardState[i][j].displayData.push(solutionBoard[i][j][0].toString());
    }
  }

  return boardState;
}