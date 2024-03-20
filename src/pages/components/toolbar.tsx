import { SolveBoard } from '@/lib/solve';
import { CELL_TYPE, BOARD_CONSTRAINTS, NewBoard } from "@/lib/board";
import type { BoardType, BoardCellType, } from "@/lib/board";
import { TOOL_PAGE } from "@/lib/toolpage";

interface ToolbarProps {
  board: BoardType, setBoard: Function,
  toolPage: number, setToolPage: Function,
  swatch: 0 | 1, setSwatch: Function,
  setInvalidHints: Function
}

/** Adds hint cells to the board based on the whitespace cells */
function distributeHints(props: ToolbarProps) {
  const boardState = [...props.board.state];

  for(let i = 0; i < props.board.width; i++) {
    let lastNone = -1;
    let chain = 0;
    for(let j = 0; j < props.board.height; j++) {
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

    if(lastNone > -1) {
      boardState[i][lastNone].type = CELL_TYPE.HINT;
      boardState[i][lastNone].displayData = ['',''];
      boardState[i][lastNone].lengthData[0] = boardState[i].length-lastNone-1;
    }
  }

  for(let j = 0; j < props.board.height; j++) {
    let lastNone = -1;
    let chain = 0;
    for(let i = 0; i < props.board.width; i++) {
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
  }
  
  props.setBoard({...props.board, state: boardState})
}

/** Removes the hint cells from the board state */
function removeHints(props: ToolbarProps) {
  const boardState = [...props.board.state];

  for(let i = 0; i < props.board.width; i++) {
    for(let j = 0; j < props.board.height; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) continue
      boardState[i][j].type = CELL_TYPE.NONE;
      boardState[i][j].displayData = [];
      boardState[i][j].lengthData = [-1,-1];
    }
  }

  props.setBoard({...props.board, state: boardState})
}

/** Sets the width of the board by adding or removing the last array */
function setWidth(props: ToolbarProps, inputValue: string) {
  const newWidth = Math.min(BOARD_CONSTRAINTS.MAX, Math.max(BOARD_CONSTRAINTS.MIN, parseInt(inputValue)));
  const boardState = [...props.board.state];

  if(boardState.length < newWidth) {
    boardState.push(
      new Array(boardState[0].length).fill(null)
      .map(() => ({type: CELL_TYPE.NONE, displayData: [], lengthData: [-1,-1]}) as BoardCellType)
    );
  }

  if(boardState.length > newWidth) {
    boardState.pop();
  }
  
  props.setBoard({...props.board, state: boardState, width: newWidth});
}

/** Sets the height of the board by adding or removing the last elements of each array */
function setHeight(props: ToolbarProps, inputValue: string) {
  const newHeight = Math.min(BOARD_CONSTRAINTS.MAX, Math.max(BOARD_CONSTRAINTS.MIN, parseInt(inputValue)));
  const boardState = [...props.board.state];

  for(let i = 0; i < boardState.length; i++) {
    if(boardState[i].length < newHeight) {
      boardState[i].push({type: CELL_TYPE.NONE, displayData: [], lengthData: [-1,-1]} as BoardCellType);
    }

    if(boardState[i].length > newHeight) {
      boardState[i].pop();
    }
  }
  
  props.setBoard({...props.board, state: boardState, height: newHeight});
}

/** Triggers a board solve state after checking if the board is valid */
function triggerSolve(props: ToolbarProps) {
  const invalidHints = [] as number[];
  for(let i = 0; i < props.board.width; i++ ) {
    for(let j = 0; j < props.board.height; j++) {
      const currentCell = props.board.state[i][j];
      if(currentCell.type !== CELL_TYPE.HINT) continue;
      if(currentCell.lengthData[0] > -1 && currentCell.displayData[0] === '' ||
        currentCell.lengthData[1] > -1 && currentCell.displayData[1] === '') {
        invalidHints.push(i*props.board.height + j)
      }
    }
  }
  props.setInvalidHints(invalidHints);

  if(invalidHints.length > 0) return;

  props.setToolPage(-1);
  props.setBoard({...props.board, state: SolveBoard(props.board.state)});
}

const NavButton = (props: ToolbarProps, left: boolean) =>
<button
  className={`absolute ${left ? "left-0" : "right-0"} border rounded-lg bg-black w-10 disabled:opacity-0`}
  disabled={props.toolPage === (left ? TOOL_PAGE.SIZE : TOOL_PAGE.HINTS)}
  onClick={() => {
    if(left && props.toolPage === TOOL_PAGE.HINTS) removeHints(props);
    if(!left && props.toolPage === TOOL_PAGE.COLOR) distributeHints(props);
    props.setToolPage(props.toolPage + (left ? -1 : 1));
  }}
>
  {left ? "<" : ">"}
</button>

const SizeTools = (props: ToolbarProps) =>
<div className="flex justify-center items-center">
  <label className="mr-3 ml-6" htmlFor="width">Width</label>
  <input className="border rounded-lg bg-black w-10"
    id="width"
    type="number"
    min={BOARD_CONSTRAINTS.MIN}
    max={BOARD_CONSTRAINTS.MAX}
    placeholder={BOARD_CONSTRAINTS.DEF.toString()}
    value={props.board.width}
    onChange={(e) => setWidth(props, e.target.value)}
  />
  <label className="mr-3 ml-6" htmlFor="height">Height</label>
  <input className="border rounded-lg bg-black w-10"
    id="height"
    type="number"
    min={BOARD_CONSTRAINTS.MIN}
    max={BOARD_CONSTRAINTS.MAX}
    placeholder={BOARD_CONSTRAINTS.DEF.toString()}
    value={props.board.height}
    onChange={(e) => setHeight(props, e.target.value)}
  />
</div>

const ColorTools = (props: ToolbarProps) =>
<div className="flex justify-center items-center">
  <button className="border rounded-l-lg bg-black w-10 h-5 border-red-500 disabled:border-2 hover:enabled:border-red-700"
    disabled={props.swatch === 0}
    onClick={() => props.setSwatch(0)}
  />
  <button className="border rounded-r-lg bg-white w-10 h-5 border-red-500 disabled:border-2 hover:enabled:border-red-700"
    disabled={props.swatch === 1}
    onClick={() => props.setSwatch(1)}
  />
</div>

const HintTools = (props: ToolbarProps) =>
<div className="flex justify-center items-center">
  <button className="border rounded bg-black w-20 h-5 border-neutral-300 flex items-center justify-center"
    onClick={() => triggerSolve(props)}
  >Solve</button>
</div>

const SolvePageTools = (props: ToolbarProps) =>
<div className="flex justify-center items-center">
  <button className="border rounded bg-black w-28 h-7 border-neutral-300 flex items-center justify-center"
    onClick={() => {
      props.setToolPage(0);
      props.setBoard(NewBoard());
    }}
  >New Puzzle</button>
</div>

export const ToolbarComponent = ({props}:{props:ToolbarProps}) =>
<div className="relative w-1/2 h-14 flex justify-center items-center">
  {props.toolPage !== TOOL_PAGE.HIDDEN && NavButton(props, true)}

  {props.toolPage === TOOL_PAGE.SIZE && SizeTools(props)}
  {props.toolPage === TOOL_PAGE.COLOR && ColorTools(props)}
  {props.toolPage === TOOL_PAGE.HINTS && HintTools(props)}
  {props.toolPage === TOOL_PAGE.HIDDEN && SolvePageTools(props)}

  {props.toolPage !== TOOL_PAGE.HIDDEN && NavButton(props, false)}
</div>