const BOARD_CONSTRAINTS = Object.freeze({ MIN: 3, MAX: 20, DEF: 10 });
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