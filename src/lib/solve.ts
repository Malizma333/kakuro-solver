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
  value: number;
  possible: number[];

  constructor() {
    this.value = -1;
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
        this.cellIndices.push(i * this.boardState[0].length + j);
        this.cells.push(new Cell());
      }
    }

    for(let i = 0; i < this.boardState.length; i++) {
      for(let j = 0; j < this.boardState[0].length; j++) {
        if(this.boardState[i][j].type !== CELL_TYPE.HINT) continue;
        
        if(this.boardState[i][j].displayData[0] !== '') {
          const targets = [];
          for(let k = 0; k < this.boardState[i][j].lengthData[0]; k++) {
            targets.push(this.cellIndices.indexOf(i * this.boardState[0].length + (k + j + 1)));
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[0]), targets)
          );
        }

        if(this.boardState[i][j].displayData[1] !== '') {
          const targets = [];
          for(let k = 0; k < this.boardState[i][j].lengthData[1]; k++) {
            targets.push(this.cellIndices.indexOf((k + i + 1) * this.boardState[0].length + j));
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[1]), targets)
          );
        }
      }
    }
  }

  ValidateConstraint(constraintIndex: number) {
    const targetConstraint = this.constraints[constraintIndex];
    const duplicates = Array(10).fill(false);
    let total = 0;
    for(const i of targetConstraint.targets) {
      if(duplicates[this.cells[i].value]) return false;
      duplicates[this.cells[i].value] = true;
      total += this.cells[i].value;
    }
    return total === targetConstraint.sum;
  }

  ValidateBoard() {
    for(let i = 0; i < this.constraints.length; i++) {
      if(!this.ValidateConstraint(i)) {
        return false;
      }
    }

    return true;
  }

  UpdateCell(singleIndex: number) {
    const actualIndex = this.cellIndices[singleIndex];
    const i = Math.floor(actualIndex / this.boardState[0].length);
    const j = actualIndex % this.boardState[0].length;
    this.boardState[i][j].displayData[0] = this.cells[singleIndex].value.toString();
  }

  *FindSolution(instant: boolean) {
    let currentTime = performance.now();
    
    this.Initialize();

    for(let i = 0; i < this.cells.length; i++) {
      this.cells[i].value = 1
      this.UpdateCell(i);
    }

    while(!this.ValidateBoard()) {
      let impossible = true;

      if(!instant) {
        yield this.boardState;
      } else if(performance.now() - currentTime > 10) {
        yield this.boardState;
        currentTime = performance.now();
      }

      this.cells[0].value += 1;

      for(let i = 0; i < this.cells.length; i++) {
        if(this.cells[i].value !== 10) {
          this.UpdateCell(i);
          impossible = false;
          break;
        }

        this.cells[i].value = 1;
        if(i + 1 < this.cells.length) {
          this.cells[i+1].value = this.cells[i+1].value + 1;
        }
        this.UpdateCell(i);
      }

      if(impossible) break;
    }

    yield this.boardState;
  }
}