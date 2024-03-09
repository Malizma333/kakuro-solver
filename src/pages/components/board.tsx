import type { BoardType } from "@/lib/board"

export default function BoardComponent(
  {props}:{props: {
    board: BoardType, setBoard: Function,
    swatch: 0 | 1,
    toolPage: number
  }}
) {
  return (
    <div className="w-full flex-1 m-5 flex justify-center items-center">
      {props.toolPage === 0 &&
      [...Array(props.board.width)].map((_,i) =>
        <div key={i}>
          {[...Array(props.board.height)].map((_,j) =>
            <div className="border w-10 h-10 bg-black" key={j}/>
          )}
        </div>
      )}
      {props.toolPage === 1 &&
      [...Array(props.board.width)].map((_,i) =>
        <div key={i}>
          {[...Array(props.board.height)].map((_,j) => {
            return <div
              className={`border w-10 h-10 cursor-pointer bg-${
                props.board.state[i][j].type === 0 ? 'black' : 'white'
              }`}
              key={j}
              onClick={() => {
                const boardState = [...props.board.state];
                boardState[i][j].type = props.swatch;
                props.setBoard({...props.board, state: boardState});
              }}
            />
          }
          )}
        </div>
      )}
    </div>
  )
}