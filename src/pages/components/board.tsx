import type { Board } from "@/lib/board"

export default function BoardComponent({board}:{board: Board}) {
  return (
    <div className="border w-full flex-1 m-5 flex justify-center items-center">
      {board.boardState.map((row,i) => 
        <ul key={i}>
          {row.map((cell,j) =>
            <div key={j} className="border bg-white w-10 h-10"/>
          )}
        </ul>
      )}
    </div>
  )
}