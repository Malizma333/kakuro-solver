const CONSTRAINTS = Object.freeze({
  MIN: 5,
  MAX: 15,
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

export function SolveBoard(board: BoardType) {
  return board;
}