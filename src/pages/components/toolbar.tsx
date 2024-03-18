import { SolveBoard } from '@/lib/solve';
import { CELL_TYPE, BOARD_CONSTRAINTS, NewBoard } from "@/lib/board";
import type { BoardType, BoardCellType, } from "@/lib/board";
import { TOOL_PAGE } from "@/lib/toolpage";

function distributeHints(boardState: BoardCellType[][]) {
  for(let i = 0; i < boardState.length; i++) {
    let lastNone = -1;
    let chain = 0;
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.NONE) {
        if(chain < 2) {
          lastNone = j;
          chain = 0;
          continue;
        }

        if(lastNone > -1) {
          boardState[i][lastNone].type = CELL_TYPE.HINT;
          boardState[i][lastNone].displayData = [];
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
      boardState[i][lastNone].displayData = [];
      boardState[i][lastNone].lengthData[0] = boardState[i].length-lastNone-1;
    }
  }

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
          boardState[lastNone][j].displayData = [];
          boardState[lastNone][j].lengthData[1] = i-lastNone-1;
        }

        lastNone = i;
        chain = 0;
      } else if(boardState[i][j].type === CELL_TYPE.PUZZLE) {
        chain += 1;
      }
    }
  }

  return boardState;
}

function removeHints(boardState: BoardCellType[][]) {
  for(let i = 0; i < boardState.length; i++) {
    for(let j = 0; j < boardState[i].length; j++) {
      if(boardState[i][j].type === CELL_TYPE.PUZZLE) continue
      boardState[i][j].type = CELL_TYPE.NONE;
      boardState[i][j].displayData = [];
      boardState[i][j].lengthData = [-1,-1];
    }
  }

  return boardState;
}

export default function ToolbarComponent(
  {props}:{props: {
    board: BoardType, setBoard: Function,
    toolPage: number, setToolPage: Function,
    swatch: 0 | 1, setSwatch: Function
  }}
) {
  const setWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Math.min(BOARD_CONSTRAINTS.MAX, Math.max(BOARD_CONSTRAINTS.MIN, parseInt(e.target.value)));
    const boardState = [...props.board.state];
  
    if(boardState.length < newWidth) {
      boardState.push(
        new Array(boardState[0].length).fill(null)
        .map(() => {return {type: CELL_TYPE.NONE, displayData: [], lengthData: [-1,-1]} as BoardCellType})
      );
    }
  
    if(boardState.length > newWidth) {
      boardState.pop();
    }
    
    props.setBoard({...props.board, state: boardState, width: newWidth});
  }
  
  const setHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Math.min(BOARD_CONSTRAINTS.MAX, Math.max(BOARD_CONSTRAINTS.MIN, parseInt(e.target.value)));
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

  return (
    <div className="relative w-1/2 h-14 flex justify-center items-center">
      {props.toolPage !== TOOL_PAGE.HIDDEN &&
        <button
          className="absolute left-0 border rounded-lg bg-black w-10 disabled:opacity-0"
          disabled={props.toolPage === TOOL_PAGE.SIZE}
          onClick={() => {
            if(props.toolPage === TOOL_PAGE.HINTS) {
              const boardState = removeHints([...props.board.state]);
              props.setBoard({...props.board, state: boardState});
            }
            
            props.setToolPage(props.toolPage - 1);
          }}
        >
          {"<"}
        </button>
      }

      {props.toolPage === TOOL_PAGE.SIZE &&
        <div className="flex justify-center items-center">
          <label className="mr-3 ml-6" htmlFor="width">Width</label>
          <input className="border rounded-lg bg-black w-10"
            id="width"
            type="number"
            min={BOARD_CONSTRAINTS.MIN}
            max={BOARD_CONSTRAINTS.MAX}
            placeholder={BOARD_CONSTRAINTS.DEF.toString()}
            value={props.board.width}
            onChange={setWidth}
          />
          <label className="mr-3 ml-6" htmlFor="height">Height</label>
          <input className="border rounded-lg bg-black w-10"
            id="height"
            type="number"
            min={BOARD_CONSTRAINTS.MIN}
            max={BOARD_CONSTRAINTS.MAX}
            placeholder={BOARD_CONSTRAINTS.DEF.toString()}
            value={props.board.height}
            onChange={setHeight}
          />
        </div>
      }

      {props.toolPage === TOOL_PAGE.COLOR &&
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
      }

      {props.toolPage === TOOL_PAGE.HINTS &&
        <div className="flex justify-center items-center">
          <button className="border rounded bg-black w-20 h-5 border-neutral-300 flex items-center justify-center"
            onClick={() => {
              props.setToolPage(-1);
              props.setBoard({...props.board, state: SolveBoard(props.board.state)});
            }}
          >Solve</button>
        </div>
      }

      {props.toolPage === TOOL_PAGE.HIDDEN &&
        <div className="flex justify-center items-center">
          <button className="border rounded bg-black w-28 h-7 border-neutral-300 flex items-center justify-center"
            onClick={() => {
              props.setToolPage(0);
              props.setBoard(NewBoard());
            }}
          >New Puzzle</button>
        </div>
      }

      {props.toolPage !== TOOL_PAGE.HIDDEN &&
        <button
          className="absolute right-0 border rounded-lg bg-black w-10 disabled:opacity-0"
          disabled={props.toolPage === TOOL_PAGE.HINTS}
          onClick={() => {
            if(props.toolPage === TOOL_PAGE.COLOR) {
              const boardState = distributeHints([...props.board.state]);
              props.setBoard({...props.board, state: boardState});
            }

            props.setToolPage(props.toolPage + 1);
          }}
        >
          {">"}
        </button>
      }
    </div>
  )
}