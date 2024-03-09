import { Board } from "@/lib/board"

export default function ToolbarComponent(
  {props}:{props: {board: Board, setWidth: Function, setHeight: Function, toolPage: number, setToolPage: Function}}
) {
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
        <div>
        <label className="mr-3 ml-6" htmlFor="width">Width</label>
        <input className="border rounded-lg bg-black w-10"
          id="width"
          type="number"
          min={Board.minDimension}
          max={Board.maxDimension}
          placeholder={Board.defaultDimension.toString()}
          value={props.board.width}
          onChange={(e) => {
            const newWidth = Math.min(Board.maxDimension, Math.max(Board.minDimension, parseInt(e.target.value)));
            props.board.reset(newWidth, undefined);
            props.setWidth(newWidth);
          }}
        />
        <label className="mr-3 ml-6" htmlFor="height">Height</label>
        <input className="border rounded-lg bg-black w-10"
          id="height"
          type="number"
          min={Board.minDimension}
          max={Board.maxDimension}
          placeholder={Board.defaultDimension.toString()}
          value={props.board.height}
          onChange={(e) => {
            const newHeight = Math.min(Board.maxDimension, Math.max(Board.minDimension, parseInt(e.target.value)));
            props.board.reset(undefined, newHeight);
            props.setHeight(newHeight);
          }}
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