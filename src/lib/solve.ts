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
  options: number[];
  constraints: number[];

  constructor() {
    this.value = -1;
    this.options = [1,2,3,4,5,6,7,8,9];
    this.constraints = [-1,-1];
  }

  reset() {
    this.options = [1,2,3,4,5,6,7,8,9];
    this.value = -1;
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
            const arrayIndex = i * this.boardState[0].length + (k + j + 1);
            const singleIndex = this.cellIndices.indexOf(arrayIndex);
            targets.push(singleIndex);
            this.cells[singleIndex].constraints[0] = this.constraints.length;
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[0]), targets)
          );
        }

        if(this.boardState[i][j].displayData[1] !== '') {
          const targets = [];
          for(let k = 0; k < this.boardState[i][j].lengthData[1]; k++) {
            const arrayIndex = (k + i + 1) * this.boardState[0].length + j;
            const singleIndex = this.cellIndices.indexOf(arrayIndex);
            targets.push(singleIndex);
            this.cells[singleIndex].constraints[1] = this.constraints.length;
          }
          this.constraints.push(
            new Constraint(parseInt(this.boardState[i][j].displayData[1]), targets)
          );
        }
      }
    }
  }

  ValidateCell(cellIndex: number) {
    if(this.cells[cellIndex].value === -1) return false;

    for(const constraintIndex of this.cells[cellIndex].constraints) {
      if(constraintIndex === -1) continue;

      const targetConstraint = this.constraints[constraintIndex];
      const duplicates = Array(10).fill(false);
      let unfilled = false;
      let total = 0;

      for(const i of targetConstraint.targets) {
        if(this.cells[i].value === -1) {
          unfilled = true;
          break;
        }
        if(duplicates[this.cells[i].value]) return false;
        duplicates[this.cells[i].value] = true;
        total += this.cells[i].value;
      }
      if(unfilled) continue;
      if(total !== targetConstraint.sum) return false;
    }

    return true;
  }

  UpdateCell(singleIndex: number) {
    const actualIndex = this.cellIndices[singleIndex];
    const i = Math.floor(actualIndex / this.boardState[0].length);
    const j = actualIndex % this.boardState[0].length;
    const v = this.cells[singleIndex].value;
    this.boardState[i][j].displayData[0] = v === -1 ? '' : v.toString();
  }

  *FindSolution(instant: boolean) {
    this.Initialize();
    
    let currentTime = performance.now();
    let curIndex = 0;

    while(curIndex < this.cells.length) {
      if(!instant) {
        yield this.boardState;
      } else if(performance.now() - currentTime > 10) {
        yield this.boardState;
        currentTime = performance.now();
      }

      if(this.ValidateCell(curIndex)) {
        curIndex += 1;
      } else if(this.cells[curIndex].options.length > 0) {
        this.cells[curIndex].value = this.cells[curIndex].options.pop() || -1;
        this.UpdateCell(curIndex);
      } else {
        this.cells[curIndex].reset();
        this.UpdateCell(curIndex);
        this.cells[curIndex - 1].value = -1;
        curIndex -= 1;
      }
    }

    yield this.boardState;
  }
}