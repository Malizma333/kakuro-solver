export const CONSTRAINTS = {
  min: 5,
  max: 15,
  default: 10
};

export const Board = {
  width: CONSTRAINTS.default,
  height: CONSTRAINTS.default,
  state: Array(CONSTRAINTS.default).fill(null).map(
    () => Array(CONSTRAINTS.default).fill(null).map(
      () => {return {type:0, data:[]} as BoardCellType}
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
  data: number[];
}