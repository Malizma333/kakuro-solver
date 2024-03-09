import type { Board } from "@/lib/board"

export default function BoardComponent({board}:{board: Board}) {
  return (
    <div className="w-full flex-1 m-5 flex justify-center items-center">
      {board.boardState.map((row,i) => 
        <div key={i}>
          {row.map((cell, j) =>
            <div key={j} className={`border w-10 h-10 background-${cell.type ? 'white':'black'}`}/>
          )}
        </div>
      )}
    </div>
  )
}