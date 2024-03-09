import { CONSTRAINTS as Constraints } from "@/lib/board";
import type { BoardType, BoardCellType } from "@/lib/board";

export default function ToolbarComponent(
  {props}:{props: {
    board: BoardType, setBoard: Function,
    toolPage: number, setToolPage: Function,
    swatch: 0 | 1, setSwatch: Function
  }}
) {
  const setWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Math.min(Constraints.max, Math.max(Constraints.min, parseInt(e.target.value)));
    console.log(props.board.state);
    const boardState = [...props.board.state];

    if(boardState.length < newWidth) {
      boardState.push(
        new Array(boardState[0].length).fill(null)
        .map(() => {return {type:0, data:[]} as BoardCellType})
      );
    }

    if(boardState.length > newWidth) {
      boardState.pop();
    }
    
    props.setBoard({...props.board, state: boardState, width: newWidth});
  }

  const setHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Math.min(Constraints.max, Math.max(Constraints.min, parseInt(e.target.value)));
    console.log(props.board.state);
    const boardState = [...props.board.state];

    for(let i = 0; i < boardState.length; i++) {
      if(boardState[i].length < newHeight) {
        boardState[i].push({type:0, data:[]} as BoardCellType);
      }
  
      if(boardState[i].length > newHeight) {
        boardState[i].pop();
      }
    }
    
    props.setBoard({...props.board, state: boardState, height: newHeight});
  }

  return (
    <div className="relative w-1/2 h-14 flex justify-center items-center">
      <button
        className="absolute left-0 border rounded-lg bg-black w-10 disabled:opacity-0"
        disabled={props.toolPage === 0}
        onClick={() => props.setToolPage(props.toolPage - 1)}
      >
        {"<"}
      </button>

      {props.toolPage === 0 &&
        <div className="flex justify-center items-center">
          <label className="mr-3 ml-6" htmlFor="width">Width</label>
          <input className="border rounded-lg bg-black w-10"
            id="width"
            type="number"
            min={Constraints.min}
            max={Constraints.max}
            placeholder={Constraints.default.toString()}
            value={props.board.width}
            onChange={setWidth}
          />
          <label className="mr-3 ml-6" htmlFor="height">Height</label>
          <input className="border rounded-lg bg-black w-10"
            id="height"
            type="number"
            min={Constraints.min}
            max={Constraints.max}
            placeholder={Constraints.default.toString()}
            value={props.board.height}
            onChange={setHeight}
          />
        </div>
      }

      {props.toolPage === 1 &&
        <div className="flex justify-center items-center">
          <button className="border rounded-l-lg bg-black w-10 h-5 border-neutral-300 disabled:border-2"
            disabled={props.swatch === 0}
            onClick={() => props.setSwatch(0)}
          />
          <button className="border rounded-r-lg bg-white w-10 h-5 border-neutral-300 disabled:border-2"
            disabled={props.swatch === 1}
            onClick={() => props.setSwatch(1)}
          />
        </div>
      }

      <button
        className="absolute right-0 border rounded-lg bg-black w-10 disabled:opacity-0"
        disabled={props.toolPage === 2}
        onClick={() => props.setToolPage(props.toolPage + 1)}
      >
        {">"}
      </button>
    </div>
  )
}