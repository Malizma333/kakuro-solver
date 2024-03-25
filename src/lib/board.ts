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

/** Creates demo board for the info page */
export function getExampleBoard() {
  return {
    width: 8,
    height: 9,
    state: [
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["", "18"], lengthData: [-1, 4] },
        { type: 2, displayData: ["", "11"], lengthData: [-1, 2] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
      ],
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["16", "16"], lengthData: [2, 2] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["", "9"], lengthData: [-1, 2] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
      ],
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["20", ""], lengthData: [4, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["", "16"], lengthData: [-1, 2] },
        { type: 2, displayData: ["", "9"], lengthData: [-1, 2] },
      ],
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["", "17"], lengthData: [-1, 2] },
        { type: 2, displayData: ["9", "13"], lengthData: [2, 2] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["21", "16"], lengthData: [3, 4] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
      ],
      [
        { type: 2, displayData: ["17", ""], lengthData: [2, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["11", "12"], lengthData: [2, 2] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["10", "12"], lengthData: [2, 2] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
      ],
      [
        { type: 2, displayData: ["22", ""], lengthData: [3, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 2, displayData: ["8", "13"], lengthData: [2, 2] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
      ],
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["14", ""], lengthData: [4, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: ["5"], lengthData: [-1, -1] },
        { type: 1, displayData: ["6"], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
      ],
      [
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 2, displayData: ["14", ""], lengthData: [2, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 1, displayData: [""], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
        { type: 0, displayData: [], lengthData: [-1, -1] },
      ],
    ],
  };
}

/** Initializes a new board object */
export function getNewBoard() {
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

/** Removes all display values from puzzle cells */
export function removeDisplay(boardState: BoardCellType[][]) {
  for(let i = 0; i < boardState.length; i++ ) {
    for(let j = 0; j < boardState[0].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        boardState[i][j].displayData[0] = '';
      }
    }
  }
  
  return boardState;
}

/** Adds hint cells to the board based on the whitespace cells */
export function distributeHints(boardState: BoardCellType[][]) {

  // Rows
  for(let i = 0; i < boardState.length; i++) {
    let lastNone = -1;
    let chain = 0;
    for(let j = 0; j < boardState[0].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.NONE) {
        if(chain < 2) {
          lastNone = j;
          chain = 0;
          continue;
        }

        if(lastNone > -1) {
          boardState[i][lastNone].type = CELL_TYPE.HINT;
          boardState[i][lastNone].displayData = ['',''];
          boardState[i][lastNone].lengthData[0] = j-lastNone-1;
        }

        lastNone = j;
        chain = 0;
      } else if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        chain += 1;
      }
    }

    if(chain < 2) {
      continue;
    }

    // End of row
    if(lastNone > -1) {
      boardState[i][lastNone].type = CELL_TYPE.HINT;
      boardState[i][lastNone].displayData = ['',''];
      boardState[i][lastNone].lengthData[0] = boardState[i].length-lastNone-1;
    }
  }

  // Columns
  for(let j = 0; j < boardState[0].length; j++) {
    let lastNone = -1;
    let chain = 0;
    for(let i = 0; i < boardState.length; i++) {
      if(boardState[i][j].type === CELL_TYPE.NONE || boardState[i][j].type === CELL_TYPE.HINT) {
        if(chain < 2) {
          lastNone = i;
          chain = 0;
          continue;
        }

        if(lastNone > -1) {
          boardState[lastNone][j].type = CELL_TYPE.HINT;
          boardState[lastNone][j].displayData = ['',''];
          boardState[lastNone][j].lengthData[1] = i-lastNone-1;
        }

        lastNone = i;
        chain = 0;
      } else if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        chain += 1;
      }
    }

    if(chain < 2) {
      continue;
    }

    // End of column
    if(lastNone > -1) {
      boardState[lastNone][j].type = CELL_TYPE.HINT;
      boardState[lastNone][j].displayData = ['',''];
      boardState[lastNone][j].lengthData[1] = boardState.length-lastNone-1;
    }
  }

  return boardState;
}

/** Removes the hint cells from the board state */
export function removeHints(boardState: BoardCellType[][]) {
  for(let i = 0; i < boardState.length; i++) {
    for(let j = 0; j < boardState[0].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) continue
      boardState[i][j].type = CELL_TYPE.NONE;
      boardState[i][j].displayData = [];
      boardState[i][j].lengthData = [-1,-1];
    }
  }

  return boardState;
}