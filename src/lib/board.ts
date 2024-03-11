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

export function SolveBoard(boardState: BoardCellType[][]) {
  for(let i = 0; i < boardState.length; i++) {
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        boardState[i][j].displayData = ['1'];
      }
    }
  }
  return boardState;
}