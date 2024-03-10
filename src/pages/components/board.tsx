import type { BoardType } from "@/lib/board"

const cellSize = 'w-12 h-12'
const halfSize = 'w-6 h-6'

function SizeBoard(board: BoardType) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) =>
        <div className={`border ${cellSize} bg-black`} key={j}/>
      )}
    </div>
  )
}

function ColorBoard(board: BoardType, setBoard: Function, swatch: 0 | 1) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) => {
        return <div
          className={`border ${cellSize} cursor-pointer bg-${
            board.state[i][j].type === 1 ? 'white' : 'black'
          }`}
          key={j}
          onClick={() => {
            const boardState = [...board.state];
            boardState[i][j].type = swatch;
            setBoard({...board, state: boardState});
          }}
        />
      }
      )}
    </div>
  )
}

function Hint(i: number, j: number, board: BoardType, setBoard: Function) {
  return <div>
    <input
      className={`${halfSize} bg-transparent text-center float-right`}
      type='number'
      min={3}
      max={45}
      value={board.state[i][j].data[0]}
      onChange={(e) => {
        const boardState = {...board.state};
        boardState[i][j].data[0] = Math.max(3, Math.min(45, parseInt(e.target.value)));
        setBoard({...board, state: boardState} as BoardType)
      }}
    />
    <input
      className={`${halfSize} bg-transparent text-center`}
      type='number'
      min={3}
      max={45}
      value={board.state[i][j].data[1]}
      onChange={(e) => {
        const boardState = {...board.state};
        boardState[i][j].data[1] = Math.max(3, Math.min(45, parseInt(e.target.value)));
        setBoard({...board, state: boardState} as BoardType)
      }}
    />
  </div>
}

function TextBoard(board: BoardType, setBoard: Function) {
  return [...Array(board.width)].map((_,i) =>
    <div key={i}>
      {[...Array(board.height)].map((_,j) => {
        switch(board.state[i][j].type) {
          case 0:
            return <div className={`border ${cellSize} bg-black`} key={j}/>
          case 1:
            return <div className={`border ${cellSize} bg-white`} key={j}/>
          case 2:
            return <div className={`border ${cellSize} bg-white bg-diagonal text-black`} key={j}>
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

export default function BoardComponent(
  {props}:{props: {
    board: BoardType, setBoard: Function,
    swatch: 0 | 1,
    toolPage: number
  }}
) {
  return (
    <div className="w-full flex-1 m-5 flex justify-center items-center">
      {props.toolPage === 0 && SizeBoard(props.board)}
      {props.toolPage === 1 && ColorBoard(props.board, props.setBoard, props.swatch)}
      {props.toolPage === 2 && TextBoard(props.board, props.setBoard)}
    </div>
  )
}