const boardConstraints = {min: 5, max: 50, default: 10}

export class Board {
  static readonly minDimension = 5;
  static readonly maxDimension = 50;
  static readonly defaultDimension = 10;

  width: number;
  height: number;
  boardState: BoardCell[][] = [];

  constructor(width: number = Board.defaultDimension, height: number = Board.defaultDimension) {
    this.width = width;
    this.height = height;
    this.initBoard();
  }

  reset(newWidth?: number, newHeight?: number) {
    this.width = newWidth || this.width;
    this.height = newHeight || this.height;
    this.initBoard();
  }

  initBoard() {
    this.boardState = [];
    for(let i = 0; i < this.width; i++) {
      this.boardState.push([])
      for(let j = 0; j < this.height; j++) {
        this.boardState[i].push(new BoardCell(0))
      }
    }
  }

  getCell(i: number, j: number) {
    return this.boardState[i][j];
  }

  setCell(i: number, j: number, type: 0 | 1 | 2, data: number[]) {
    this.boardState[i][j].resetCell(type, data);
  }

  changeCell(i: number, j: number, data: number[]) {
    this.boardState[i][j].resetCell(undefined, data);
  }
}

class BoardCell {
  type: 0 | 1 | 2; // Fill | Input | Hint
  data: number[];

  constructor(type: 0 | 1 | 2) {
    this.type = type;
    this.data = [];
  }

  resetCell(newType?: 0 | 1 | 2, newData?: number[]) {
    this.type = newType || this.type;
    this.data = newData || [];
  }
}