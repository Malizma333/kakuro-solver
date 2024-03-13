const CONSTRAINTS = Object.freeze({
  MIN: 5,
  MAX: 20,
  DEF: 10
});

const CELL_TYPE = Object.freeze({
  NONE: 0,
  PUZZLE: 1,
  HINT: 2
})

export {CONSTRAINTS, CELL_TYPE}

export const Board = {
  width: CONSTRAINTS.DEF,
  height: CONSTRAINTS.DEF,
  state: Array(CONSTRAINTS.DEF).fill(null).map(
    () => Array(CONSTRAINTS.DEF).fill(null).map(
      () => {return {type: 0, displayData: [], lengthData: [-1,-1]} as BoardCellType}
    )
  )
}

export interface BoardType {
  width: number;
  height: number;
  state: BoardCellType[][];
}

export interface BoardCellType {
  type: 0 | 1 | 2;
  displayData: string[];
  lengthData: number[];
}

let GetSummation: Function;

export async function InitSummation() {
  const data = await fetch("sums.json").then(r => r.json());
  GetSummation = (size: number, sum: number) => {
    return data[sum - 3][size - 2];
  }
}

function ConstructSuperpos(boardState: BoardCellType[][]) {
  const multiStateBoard = [] as number[][][];

  for(let i = 0; i < boardState.length; i++) {
    multiStateBoard.push([] as number[][]);
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type !== CELL_TYPE.PUZZLE) {
        multiStateBoard[i].push([]);
        continue;
      }

      const superposSet = [] as number[];

      for(let hintCol = j; hintCol >= 0; hintCol--) {
        if(boardState[i][hintCol].type === CELL_TYPE.NONE) break;
        if(boardState[i][hintCol].type === CELL_TYPE.HINT) {
          superposSet.push(...GetSummation(
            boardState[i][hintCol].lengthData[0],
            parseInt(boardState[i][hintCol].displayData[0])
          ));
          break;
        }
      }

      for(let hintRow = i; hintRow >= 0; hintRow--) {
        if(boardState[hintRow][j].type === CELL_TYPE.NONE) break;
        if(boardState[hintRow][j].type === CELL_TYPE.HINT) {
          superposSet.push(...GetSummation(
            boardState[hintRow][j].lengthData[1],
            parseInt(boardState[hintRow][j].displayData[1])
          ));
          break;
        }
      }

      multiStateBoard[i].push(superposSet);
    }
  }

  return multiStateBoard;
}

export function SolveBoard(boardState: BoardCellType[][]) {
  const entropicBoard = ConstructSuperpos(boardState);

  return boardState;
}