import type { Board } from "@/lib/board"

export default function BoardComponent(
  {props}:{props: {
    board: Board,
    swatch: 0 | 1
  }}
) {
  return (
    <div className="w-full flex-1 m-5 flex justify-center items-center">
      {props.board.boardState.map((row,i) => 
        <div key={i}>
          {row.map((cell, j) =>
            <div key={j} className={`border w-10 h-10 cursor-pointer background-${cell.type ? 'white':'black'}`}/>
          )}
        </div>
      )}
    </div>
  )
}