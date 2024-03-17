import { CELL_TYPE, HINT_CONSTRAINTS, type BoardType } from "@/lib/board"
import { TOOL_PAGE } from "@/lib/toolpage"

const cellD = 'w-12 h-12';
const halfCellD = 'w-6 h-6';

function SizeBoard(board: BoardType) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) =>
        <div className={`border ${cellD} bg-black`} key={j}/>
      )}
    </div>
  )
}

function ColorBoard(board: BoardType, setBoard: Function, swatch: 0 | 1) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) => {
        return <div
          className={`border ${cellD} cursor-pointer bg-${
            board.state[i][j].type === CELL_TYPE.PUZZLE ? 'white' : 'black'
          }`}
          key={j}
          onClick={() => {
            if(i === 0 || j === 0) return;
            const boardState = [...board.state];
            boardState[i][j].type = swatch;
            setBoard({...board, state: boardState} as BoardType);
          }}
        />
      }
      )}
    </div>
  )
}

function Hint(i: number, j: number, board: BoardType, setBoard: Function) {
  return <div>
    {board.state[i][j].lengthData[1] > -1 ? <input
      className={`${halfCellD} bg-transparent text-center float-right`}
      type='number'
      min={HINT_CONSTRAINTS.MIN}
      max={HINT_CONSTRAINTS.MAX}
      placeholder="_"
      value={board.state[i][j].displayData[1] || ''}
      onChange={(e) => {
        const boardState = [...board.state];
        const newValue = parseInt(e.target.value);
        if(e.target.value === '') {
          boardState[i][j].displayData[1] = ''
        } else if(!isNaN(newValue)) {
          boardState[i][j].displayData[1] = newValue.toString();
        }
        setBoard({...board, state: boardState} as BoardType)
      }}
      onBlur={(e) => {
        const boardState = [...board.state];
        const newValue = parseInt(e.target.value);
        if(e.target.value === '') {
          boardState[i][j].displayData[1] = ''
        } else if(!isNaN(newValue)) {
          boardState[i][j].displayData[1] = Math.max(
            HINT_CONSTRAINTS.MIN, Math.min(
              HINT_CONSTRAINTS.MAX, newValue
          )).toString();
        }
        setBoard({...board, state: boardState} as BoardType)
      }}
    /> : <div className={`${halfCellD} bg-transparent text-center float-right`}/>
    }
    {board.state[i][j].lengthData[0] > -1 && <input
      className={`${halfCellD} bg-transparent text-center`}
      type='number'
      min={HINT_CONSTRAINTS.MIN}
      max={HINT_CONSTRAINTS.MAX}
      placeholder="_"
      value={board.state[i][j].displayData[0] || ''}
      onChange={(e) => {
        const boardState = [...board.state];
        const newValue = parseInt(e.target.value);
        if(e.target.value === '') {
          boardState[i][j].displayData[0] = ''
        } else if(!isNaN(newValue)) {
          boardState[i][j].displayData[0] = newValue.toString();
        }
        setBoard({...board, state: boardState} as BoardType)
      }}
      onBlur={(e) => {
        const boardState = [...board.state];
        const newValue = parseInt(e.target.value);
        if(e.target.value === '') {
          boardState[i][j].displayData[0] = ''
        } else if(!isNaN(newValue)) {
          boardState[i][j].displayData[0] = Math.max(
            HINT_CONSTRAINTS.MIN, Math.min(
              HINT_CONSTRAINTS.MAX, newValue
          )).toString();
        }
        setBoard({...board, state: boardState} as BoardType)
      }}
    />}
  </div>
}

function TextBoard(board: BoardType, setBoard: Function) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) => {
        switch(board.state[i][j].type) {
          case CELL_TYPE.NONE:
            return <div className={`border ${cellD} bg-black`} key={j}/>
          case CELL_TYPE.PUZZLE:
            return <div className={`border ${cellD} bg-white`} key={j}/>
          case CELL_TYPE.HINT:
            return <div className={`border ${cellD} bg-black bg-diagonal`} key={j}>
              {Hint(i, j, board, setBoard)}
            </div>
          default:
            return null
        }
      }
      )}
    </div>
  )
}

function FilledBoard(board: BoardType) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) => {
        switch(board.state[i][j].type) {
          case CELL_TYPE.NONE:
            return <div className={`border ${cellD} bg-black`} key={j}/>
          case CELL_TYPE.PUZZLE:
            return <div className={`${cellD} bg-white text-black flex justify-center items-center`} key={j}>
              {board.state[i][j].displayData[0]}
            </div>
          case CELL_TYPE.HINT:
            return <div className={`border block ${cellD} bg-black bg-diagonal`} key={j}>
              <input
                className={`${halfCellD} bg-transparent text-center float-right`}
                disabled
                value={board.state[i][j].displayData[1]}
              />
              <input
                className={`${halfCellD} bg-transparent text-center`}
                disabled
                value={board.state[i][j].displayData[0]}
              />
            </div>
          default:
            return null
        }
      }
      )}
    </div>
  )
}

export default function BoardComponent(
  {props}:{props: {
    board: BoardType, setBoard: Function,
    swatch: 0 | 1,
    toolPage: number
  }}
) {
  return (
    <div className="w-full flex-1 m-5 flex justify-center items-center">
      {props.toolPage === TOOL_PAGE.SIZE && SizeBoard(props.board)}
      {props.toolPage === TOOL_PAGE.COLOR && ColorBoard(props.board, props.setBoard, props.swatch)}
      {props.toolPage === TOOL_PAGE.HINTS && TextBoard(props.board, props.setBoard)}
      {props.toolPage === TOOL_PAGE.HIDDEN && FilledBoard(props.board)}
    </div>
  )
}