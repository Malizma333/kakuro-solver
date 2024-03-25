import { BoardSolver } from '@/lib/solve';
import { CELL_TYPE, BOARD_CONSTRAINTS } from "@/lib/board";
import { getNewBoard, removeDisplay, distributeHints, removeHints } from "@/lib/board";
import type { BoardType, BoardCellType, } from "@/lib/board";
import { TOOL_PAGE } from "@/lib/toolpage";

interface ToolbarProps {
  board: BoardType, setBoard: Function,
  toolPage: number, setToolPage: Function,
  swatch: 0 | 1, setSwatch: Function,
  setInvalidHints: Function,
  speed: number, setSpeed: Function,
  instant: boolean, setInstant: Function,
  error: boolean, setError: Function
}

const maxSpeed = 300;
let currentStepFn: any;

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

/** Validates that all board inputs are filled */
function validateBoard(props: ToolbarProps) {
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

  return invalidHints.length === 0;
}

/** Triggers a board solve state */
function triggerSolve(props: ToolbarProps) {
  if(!validateBoard(props)) return;

  props.setToolPage(TOOL_PAGE.HIDDEN);

  const boardGenerator = new BoardSolver(props.board.state).FindSolution(props.instant);

  function step() {
    const { value, done } = boardGenerator.next();

    if (!done) {
      if(!value.success) props.setError(true);
      props.setBoard({...props.board, state: value.state});
      currentStepFn = setTimeout(step, maxSpeed-props.speed);
    }
  }

  step();
}

function NavButton(props: ToolbarProps, left: boolean) {
  return <button
    className={`m-5 border rounded-lg bg-black w-10 disabled:opacity-0`}
    disabled={props.toolPage === (left ? TOOL_PAGE.SHAPE : TOOL_PAGE.HINTS)}
    onClick={() => {
      if(left && props.toolPage === TOOL_PAGE.HINTS) {
        props.setBoard({...props.board, state: removeHints(props.board.state)});
      }
      if(!left && props.toolPage === TOOL_PAGE.SHAPE) {
        props.setBoard({...props.board, state: distributeHints(props.board.state)});
      }
      props.setToolPage(props.toolPage + (left ? -1 : 1));
    }}
  >
    {left ? "<" : ">"}
  </button>
}

function ShapeTools(props: ToolbarProps) {
  return <div className="flex justify-center items-center">
    <label className="m-3" htmlFor="width">Width</label>
    <input className="border rounded-lg bg-black w-10"
      id="width"
      type="number"
      min={BOARD_CONSTRAINTS.MIN}
      max={BOARD_CONSTRAINTS.MAX}
      placeholder={BOARD_CONSTRAINTS.DEF.toString()}
      value={props.board.width}
      onChange={(e) => setWidth(props, e.target.value)}
    />
    <label className="m-3" htmlFor="height">Height</label>
    <input className="border rounded-lg bg-black w-10"
      id="height"
      type="number"
      min={BOARD_CONSTRAINTS.MIN}
      max={BOARD_CONSTRAINTS.MAX}
      placeholder={BOARD_CONSTRAINTS.DEF.toString()}
      value={props.board.height}
      onChange={(e) => setHeight(props, e.target.value)}
    />
    <span className="w-4"/>
    <button className="aspect-square rounded-full bg-black w-6 disabled:w-7 border border-white"
      disabled={props.swatch === 0}
      onClick={() => props.setSwatch(0)}
    />
    <span className="w-4"/>
    <button className="aspect-square rounded-full bg-white w-6 disabled:w-7"
      disabled={props.swatch === 1}
      onClick={() => props.setSwatch(1)}
    />
  </div>
}

function HintTools(props: ToolbarProps) {
  return <div className="flex justify-center items-center">
    <button className="border rounded bg-black w-20 h-5 border-neutral-300 flex items-center justify-center"
      onClick={() => triggerSolve(props)}
    >{"Solve"}</button>
    {TimeSlider(props)}
  </div>
}

function SolvePageTools(props: ToolbarProps) {
  return <div className="flex justify-center items-center">
    <button className="border rounded bg-black w-28 h-7 m-2 border-neutral-300 flex items-center justify-center"
      onClick={() => {
        props.setToolPage(TOOL_PAGE.SHAPE);
        props.setBoard(getNewBoard());
        clearTimeout(currentStepFn);
        props.setError(false);
      }}
    >{"New Puzzle"}</button>
    <button className="border rounded bg-black w-28 h-7 m-2 border-neutral-300 flex items-center justify-center"
      onClick={() => {
        props.setToolPage(TOOL_PAGE.HINTS);
        props.setBoard({...props.board, state: removeDisplay(props.board.state)});
        clearTimeout(currentStepFn);
        props.setError(false);
      }}
    >{"Back"}</button>
  </div>
}

function TimeSlider(props: ToolbarProps) {
  return <div className="flex items-center">
    <label htmlFor="timeSlider" className="ml-4">
      {"Speed"}
    </label>
    <input
    id="timeSlider"
    className="accent-gray-500 m-2 h-2 rounded-lg cursor-pointer"
    type="range"
    disabled={props.instant}
    min={1} max={maxSpeed} step={1}
    value={props.speed}
    onChange={(e) => props.setSpeed(e.target.value)}
    ></input>
    <label htmlFor="instantCheck" className="ml-4">
      {"Instant"}
    </label>
    <input
    id="instantCheck"
    className="accent-gray-500 m-2 h-6 w-6"
    type="checkbox"
    checked={props.instant}
    onChange={() => props.setInstant(!props.instant)}
    ></input>
  </div>
}

function ErrorMessageComponent() {
  return <div className="text-red-500 font-bold">
    {"Solution Not Found"}
  </div>
}

export default function ToolbarComponent({props}:{props:ToolbarProps}) {
  if(!props) return;

  return <div className="absolute top-0 w-full flex flex-col justify-center items-center">
    <div className="flex justify-center items-center">
      {props.toolPage !== TOOL_PAGE.HIDDEN && NavButton(props, true)}

      {props.toolPage === TOOL_PAGE.SHAPE && ShapeTools(props)}
      {props.toolPage === TOOL_PAGE.HINTS && HintTools(props)}
      {props.toolPage === TOOL_PAGE.HIDDEN && SolvePageTools(props)}

      {props.toolPage !== TOOL_PAGE.HIDDEN && NavButton(props, false)}
    </div>
    {props.toolPage === TOOL_PAGE.HIDDEN && props.error && ErrorMessageComponent()}
  </div>
}