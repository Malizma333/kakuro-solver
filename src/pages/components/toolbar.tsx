import { Board } from "@/lib/board"

export default function ToolbarComponent({board, setWidth, setHeight}:{board: Board, setWidth: Function, setHeight: Function}) {
  return (
    <div className="rounded-lg w-full h-14 flex justify-center items-center">
      <label className="m-3" htmlFor="width">Width</label>
      <input className="border rounded-lg bg-black w-10"
        id="width"
        type="number"
        min={Board.minDimension}
        max={Board.maxDimension}
        placeholder={Board.defaultDimension.toString()}
        value={board.width}
        onChange={(e) => {
          const newWidth = Math.min(Board.maxDimension, Math.max(Board.minDimension, parseInt(e.target.value)));
          board.reset(newWidth, undefined);
          setWidth(newWidth);
        }}
      />
      <label className="m-3" htmlFor="height">Height</label>
      <input className="border rounded-lg bg-black w-10"
        id="height"
        type="number"
        min={Board.minDimension}
        max={Board.maxDimension}
        placeholder={Board.defaultDimension.toString()}
        value={board.height}
        onChange={(e) => {
          const newHeight = Math.min(Board.maxDimension, Math.max(Board.minDimension, parseInt(e.target.value)));
          board.reset(undefined, newHeight);
          setHeight(newHeight);
        }}
      />
    </div>
  )
}