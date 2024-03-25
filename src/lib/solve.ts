import { DEBUG } from "./constants";
import { CELL_TYPE } from "./board";
import type { BoardCellType } from "./board";

// Algorithm inspired by https://marcelgarus.dev/kakuro

let GetSumSet: Function;

export async function InitSummation() {
  const data = await fetch("sums.json").then(r => r.json());
  GetSumSet = (size: number, sum: number) => {
    return data[sum - 3][size - 2];
  }
}

class Constraint {
  sum: number;
  targets: number[];

  constructor(sum: number, targets: number[]) {
    this.sum = sum;
    this.targets = targets;
  }
}

class Cell {
  private _value: number;
  private _options: number[];
  private _origin: number[];
  private _constraints: number[];

  constructor() {
    this._value = -1;
    this._options = [];
    this._origin = [];
    this._constraints = [-1, -1];
  }

  public get value() {
    return this._value;
  }

  public set value(newValue: number) {
    this._value = newValue;
  }

  public get constraints() {
    return this._constraints;
  }

  public get options() {
    return this._options
  }

  public setConstraint(i: number, cIndex: number) {
    this._constraints[i] = cIndex;
  }

  public setOrigin(originArray: number[]) {
    if(this._origin.length === 0) {
      this._origin = originArray;
    } else {
      this._origin = this._origin.filter(x => originArray.includes(x))
    }
    this.reset();
  }

  public nextOption() {
    return this._options.pop() || -1;
  }

  public reset() {
    this._options = [...this._origin];
    this._value = -1;
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
          const sumValue = parseInt(this.boardState[i][j].displayData[0]);
          const targets = [];
          for(let k = 0; k < this.boardState[i][j].lengthData[0]; k++) {
            const arrayIndex = i * this.boardState[0].length + (k + j + 1);
            const singleIndex = this.cellIndices.indexOf(arrayIndex);
            this.cells[singleIndex].setOrigin(GetSumSet(this.boardState[i][j].lengthData[0], sumValue));
            this.cells[singleIndex].setConstraint(0, this.constraints.length);
            targets.push(singleIndex);
          }
          this.constraints.push(
            new Constraint(sumValue, targets)
          );
        }

        if(this.boardState[i][j].displayData[1] !== '') {
          const sumValue = parseInt(this.boardState[i][j].displayData[1]);
          const targets = [];
          for(let k = 0; k < this.boardState[i][j].lengthData[1]; k++) {
            const arrayIndex = (k + i + 1) * this.boardState[0].length + j;
            const singleIndex = this.cellIndices.indexOf(arrayIndex);
            this.cells[singleIndex].setOrigin(GetSumSet(this.boardState[i][j].lengthData[1], sumValue));
            this.cells[singleIndex].setConstraint(1, this.constraints.length);
            targets.push(singleIndex);
          }
          this.constraints.push(
            new Constraint(sumValue, targets)
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
    let startTime = currentTime;
    let curIndex = 0;
    let impossible = false;

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
        this.cells[curIndex].value = this.cells[curIndex].nextOption();
        this.UpdateCell(curIndex);
      } else if(curIndex > 0) {
        this.cells[curIndex].reset();
        this.UpdateCell(curIndex);
        this.cells[curIndex - 1].value = -1;
        curIndex -= 1;
      } else {
        this.cells[0].reset();
        this.UpdateCell(0);
        impossible = true;
        break;
      }
    }

    DEBUG && console.info(`Succeeded: ${!impossible}`);
    DEBUG && console.info(`Time Taken: ${performance.now() - startTime} ms`)

    yield this.boardState;
  }
}