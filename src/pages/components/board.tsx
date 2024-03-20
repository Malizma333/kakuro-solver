import { CELL_TYPE, HINT_CONSTRAINTS, type BoardType } from "@/lib/board"
import { TOOL_PAGE } from "@/lib/toolpage"

interface BoardProps {
  board: BoardType, setBoard: Function,
  swatch: 0 | 1,
  toolPage: number,
  invalidHints: number[]
}

const cellD = 'w-12 h-12';
const halfCellD = 'w-6 h-6';

function setHint(props: BoardProps, i: number, j: number, k: number, inputValue: string, bounded: boolean) {
  const boardState = [...props.board.state];
  const newValue = parseInt(inputValue);

  if(inputValue === '') {
    boardState[i][j].displayData[k] = ''
  } else if(!isNaN(newValue)) {
    if(bounded) {
      boardState[i][j].displayData[k] = Math.max(
        HINT_CONSTRAINTS.MIN, Math.min(
          HINT_CONSTRAINTS.MAX, newValue
      )).toString();
    } else {
      boardState[i][j].displayData[k] = newValue.toString();
    }
  }

  props.setBoard({...props.board, state: boardState} as BoardType)
}

const SizeBoard = (props: BoardProps) =>
[...Array(props.board.height)].map((_,j) =>
  <div key={j} className="flex flex-row">
    {[...Array(props.board.width)].map((_,i) =>
      <div className={`border ${cellD} bg-black`} key={i}/>
    )}
  </div>
)

const ColorBoard = (props: BoardProps) => 
[...Array(props.board.height)].map((_,j) =>
  <div key={j} className="flex flex-row">
    {[...Array(props.board.width)].map((_,i) =>
      <div
        className={`border ${cellD} cursor-pointer bg-${
          props.board.state[i][j].type === CELL_TYPE.PUZZLE ? 'white' : 'black'
        }`}
        key={i}
        onClick={() => {
          if(i === 0 || j === 0) return;
          const boardState = [...props.board.state];
          boardState[i][j].type = props.swatch;
          props.setBoard({...props.board, state: boardState} as BoardType);
        }}
      />
    )}
  </div>
)

const HintField = (props: BoardProps, i: number, j: number, k: number) =>
<input
  className={`${halfCellD} hide-spinner bg-transparent text-center ${k === 1 ? "float-right" : ""}`}
  type='number'
  min={HINT_CONSTRAINTS.MIN}
  max={HINT_CONSTRAINTS.MAX}
  placeholder="_"
  value={props.board.state[i][j].displayData[k] || ''}
  onChange={(e) => setHint(props, i, j, k, e.target.value, false)}
  onBlur={(e) => setHint(props, i, j, k, e.target.value, true)}
/>

const HintCell = (props: BoardProps, i: number, j: number) =>
<div>
  {props.board.state[i][j].lengthData[1] > -1 ? HintField(props, i, j, 1) :
  <div className={`${halfCellD} bg-transparent text-center float-right`}/>}
  {props.board.state[i][j].lengthData[0] > -1 && HintField(props, i, j, 0)}
</div>

const TextBoard = (props: BoardProps) =>
[...Array(props.board.height)].map((_,j) =>
  <div key={j} className="flex flex-row">
    {[...Array(props.board.width)].map((_,i) => {
      switch(props.board.state[i][j].type) {
        case CELL_TYPE.NONE:
          return <div className={`border ${cellD} bg-black`} key={i}/>
        case CELL_TYPE.PUZZLE:
          return <div className={`border ${cellD} bg-white`} key={i}/>
        case CELL_TYPE.HINT:
          return <div className={`border ${cellD} bg-black bg-diagonal ${
            props.invalidHints.includes(i*props.board.height + j) && "border-red-500 border-2"
          }`} key={i}>
            {HintCell(props, i, j)}
          </div>
        default:
          return null
      }
    }
    )}
  </div>
)

const FilledBoard = (props: BoardProps) =>
[...Array(props.board.height)].map((_,j) =>
  <div key={j} className="flex flex-row">
    {[...Array(props.board.width)].map((_,i) => {
      switch(props.board.state[i][j].type) {
        case CELL_TYPE.NONE:
          return <div className={`border ${cellD} bg-black`} key={i}/>
        case CELL_TYPE.PUZZLE:
          return <div className={`${cellD} bg-white text-black flex justify-center items-center`} key={i}>
            {props.board.state[i][j].displayData[0]}
          </div>
        case CELL_TYPE.HINT:
          return <div className={`border block ${cellD} bg-black bg-diagonal`} key={i}>
            <input
              className={`${halfCellD} bg-transparent text-center float-right`}
              disabled
              value={props.board.state[i][j].displayData[1]}
            />
            <input
              className={`${halfCellD} bg-transparent text-center`}
              disabled
              value={props.board.state[i][j].displayData[0]}
            />
          </div>
        default:
          return null
      }
    }
    )}
  </div>
)
  
export const BoardComponent = ({props}:{props: BoardProps}) =>
<div className="h-full w-full flex-1 m-5 flex flex-col justify-center items-center">
  {props.toolPage === TOOL_PAGE.SIZE && SizeBoard(props)}
  {props.toolPage === TOOL_PAGE.COLOR && ColorBoard(props)}
  {props.toolPage === TOOL_PAGE.HINTS && TextBoard(props)}
  {props.toolPage === TOOL_PAGE.HIDDEN && FilledBoard(props)}
</div>