import { DEBUG } from "./constants";
import { CELL_TYPE } from "./board";
import type { BoardCellType } from "./board";

// Algorithm inspired by https://marcelgarus.dev/kakuro

class Constraint {
  sum: number;
  targets: number[];

  constructor(sum: number, targets: number[]) {
    this.sum = sum;
    this.targets = targets;
  }
}

class Cell {
  value: string;
  possible: number[];

  constructor() {
    this.value = '-1';
    this.possible = [1,2,3,4,5,6,7,8,9];
  }
}

export class BoardSolver {
  boardState: BoardCellType[][];
  constraints: Constraint[];
  cells: Cell[];
  cellIndices: number[];

  constructor(boardState: BoardCellType[][]) {
    this.boardState = boardState;
    this.constraints = [];
    this.cells = [];
    this.cellIndices = [];
  }

  Initialize() {
    DEBUG && console.info("Initializing");

    for(let i = 0; i < this.boardState.length; i++) {
      for(let j = 0; j < this.boardState[0].length; j++) {
        if(this.boardState[i][j].type !== CELL_TYPE.PUZZLE) continue;
        this.cellIndices[i * this.boardState[0].length + j] = this.cells.length;
        this.cells.push(new Cell());
      }
    }

    for(let i = 0; i < this.boardState.length; i++) {
      for(let j = 0; j < this.boardState[0].length; j++) {
        if(this.boardState[i][j].type !== CELL_TYPE.HINT) continue;
        
        if(this.boardState[i][j].displayData[0] !== '') {
          const targets = [];
          for(let k = 1; k <= this.boardState[i][j].lengthData[0]; k++) {
            targets.push(this.cellIndices[i * this.boardState[0].length + k]);
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[0]), targets)
          );
        }

        if(this.boardState[i][j].displayData[1] !== '') {
          const targets = [];
          for(let k = 1; k <= this.boardState[i][j].lengthData[1]; k++) {
            targets.push(this.cellIndices[k * this.boardState[0].length + j]);
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[1]), targets)
          );
        }
      }
    }
  }

  Solve() {
    // Algo here
  }

  Finalize() {
    for(const k of Object.keys(this.cellIndices)) {
      const actualIndex = parseInt(k);
      const singleIndex = this.cellIndices[actualIndex];
      const i = Math.floor(actualIndex / this.boardState[0].length);
      const j = actualIndex % this.boardState[0].length;
      this.boardState[i][j].displayData[0] = this.cells[singleIndex].value;
    }
  }

  *FindSolution() {
    this.Initialize();
    this.Solve();
    this.Finalize();

    yield this.boardState;
  }
}