import { DEBUG } from "./constants";
import { GetSumSet, CELL_TYPE } from "./board";
import type { BoardCellType } from "./board";

const BOARD_ERROR = Object.freeze({
  INVALID_SUM: 0,
  UNCOLLAPSED_CELL: 1,
  ZERO_CELL: 2,
  DUPLICATES: 3
});

const SolveState = {
  width: 0,
  height: 0,
  board: [] as number[][][],
  visit: [] as number[],
  stack: [] as string[]
};

function ConstructStates(boardState: BoardCellType[][]) {
  SolveState.width = boardState.length;
  SolveState.height = boardState[0].length;
  SolveState.board = [] as number[][][];
  SolveState.visit = [] as number[];

  for(let i = 0; i < SolveState.width; i++) {
    SolveState.board.push([] as number[][]);
    for(let j = 0; j < SolveState.height; j++) {
      if(boardState[i][j].type !== CELL_TYPE.PUZZLE) {
        SolveState.board[i].push([]);
        continue;
      }

      const hintSumColVals = [] as number[];
      const hintSumRowVals = [] as number[];

      for(let hintCol = j; hintCol >= 0; hintCol--) {
        if(boardState[i][hintCol].type === CELL_TYPE.NONE) break;
        if(boardState[i][hintCol].type === CELL_TYPE.HINT) {
          GetSumSet(
            boardState[i][hintCol].lengthData[0],
            parseInt(boardState[i][hintCol].displayData[0])
          ).forEach((item: number) => hintSumColVals.push(item))
          break;
        }
      }
      
      for(let hintRow = i; hintRow >= 0; hintRow--) {
        if(boardState[hintRow][j].type === CELL_TYPE.NONE) break;
        if(boardState[hintRow][j].type === CELL_TYPE.HINT) {
          GetSumSet(
            boardState[hintRow][j].lengthData[1],
            parseInt(boardState[hintRow][j].displayData[1])
          ).forEach((item: number) => hintSumRowVals.push(item))
          break;
        }
      }

      const possibleVals = [] as number[];

      if(hintSumRowVals.length === 0) {
        hintSumColVals.forEach((i: number) => possibleVals.push(i))
      } else if(hintSumColVals.length === 0) {
        hintSumRowVals.forEach((i: number) => possibleVals.push(i))
      } else {
        hintSumRowVals.forEach((i: number) => hintSumColVals.includes(i) && possibleVals.push(i))
      }

      SolveState.board[i].push(possibleVals);

      DEBUG && console.info(`Cell (${i},${j}): ${JSON.stringify(possibleVals)}`);
    }
  }
}

function GetLeastEntropy() {
  let minEntropy = 9;
  let pairs = [];

  for(let i = 0; i < SolveState.width; i++) {
    for(let j = 0; j < SolveState.height; j++) {
      if(SolveState.board[i][j].length === 0 || SolveState.visit.includes(SolveState.height*i+j)) continue

      if(SolveState.board[i][j].length < minEntropy) {
        minEntropy = SolveState.board[i][j].length;
        pairs.length = 0;
      }

      if(SolveState.board[i][j].length === minEntropy) {
        pairs.push([i,j]);
      }
    }
  }

  if(pairs.length === 0) minEntropy = 1;

  DEBUG && console.info(`Entropy Pairs (${minEntropy}): ${JSON.stringify(pairs)}`)

  return pairs;
}

function PropagateCollisions() {
  const removeArray = [];

  while(true) {
    for(let i = 0; i < SolveState.width; i++) {
      for(let j = 0; j < SolveState.height; j++) {
        if(SolveState.board[i][j].length !== 1 || SolveState.visit.includes(SolveState.height*i+j)) continue;
        removeArray.push([i, j, SolveState.board[i][j][0]]);
        SolveState.visit.push(SolveState.height*i+j);
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
  let invalidBoard = false;
  
  ConstructStates(boardState);

  while(true) {
    PropagateCollisions();
    const leastEntropyPairs = GetLeastEntropy();
    
    if(leastEntropyPairs.length === 0) {
      if(ValidateBoard(boardState)) {
        break;
      }

      if(SolveState.stack.length === 0) {
        invalidBoard = true;
        break;
      }

      const rewindState = JSON.parse(SolveState.stack.pop()||"[[] as number[][][], [] as number[]]"); 

      DEBUG && console.info(`Rewinding:\n${rewindState[0].map((e:number[][]) => e.map((e2) => JSON.stringify(e2)).join(' ')).join('\n')}`);

      SolveState.board = rewindState[0];
      SolveState.visit = rewindState[1];
      continue;
    }

    const choice = leastEntropyPairs[0];
    const removed = SolveState.board[choice[0]][choice[1]].splice(1);
    const temp = SolveState.board[choice[0]][choice[1]][0];

    SolveState.board[choice[0]][choice[1]] = [...removed];
    DEBUG && console.info(`Pushing:\n${SolveState.board.map((e) => e.map((e2) => JSON.stringify(e2)).join(' ')).join('\n')}`);
    SolveState.stack.push(JSON.stringify([SolveState.board, SolveState.visit]));
    SolveState.board[choice[0]][choice[1]] = [temp];
  }

  DEBUG && console.info(`Final:\n${SolveState.board.map((e) => e.map((e2) => JSON.stringify(e2)).join(' ')).join('\n')}`);

  for(let i = 0; i < SolveState.width; i++) {
    for(let j = 0; j < SolveState.height; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        boardState[i][j].displayData = [SolveState.board[i][j].join(',')];
      }
    }
  }

  DEBUG && console.info(`Success: ${!invalidBoard}`);

  return boardState;
}

export function ValidateBoard(boardState: BoardCellType[][]) {
  let total: number;
  const visited = [] as number[];

  for(let i = 0; i < SolveState.width; i++) {
    for(let j = 0; j < SolveState.height; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        if(SolveState.board[i][j].length > 1) {
          DEBUG && console.info(`Board Error: ${BOARD_ERROR.UNCOLLAPSED_CELL}`);
          return false;
        }
        if(SolveState.board[i][j].length === 0) {
          DEBUG && console.info(`Board Error: ${BOARD_ERROR.ZERO_CELL}`);
          return false;
        }
        continue;
      }

      if(boardState[i][j].type !== CELL_TYPE.HINT) continue;

      total = 0;
      visited.length = 0;

      for(let k = i+1; k <= i+boardState[i][j].lengthData[1]; k++) {
        total += SolveState.board[k][j][0];

        if(visited.includes(SolveState.board[k][j][0])) {
          DEBUG && console.info(`Board Error: ${BOARD_ERROR.DUPLICATES}`);
          return false;
        }

        visited.push(SolveState.board[k][j][0]);
      }

      if(boardState[i][j].displayData[1] !== '' && total !== parseInt(boardState[i][j].displayData[1])) {
        DEBUG && console.info(`Board Error: ${BOARD_ERROR.INVALID_SUM}`);
        return false;
      }

      total = 0;

      for(let k = j+1; k <= j+boardState[i][j].lengthData[0]; k++) {
        total += SolveState.board[i][k][0];

        if(visited.includes(SolveState.board[i][k][0])) {
          DEBUG && console.info(`Board Error: ${BOARD_ERROR.DUPLICATES}`);
          return false;
        }

        visited.push(SolveState.board[i][k][0]);
      }

      if(boardState[i][j].displayData[0] !== '' && total !== parseInt(boardState[i][j].displayData[0])) {
        DEBUG && console.info(`Board Error: ${BOARD_ERROR.INVALID_SUM}`);
        return false;
      }
    }
  }

  return true;
}