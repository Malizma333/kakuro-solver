import { getNewBoard, getExampleBoard } from "@/lib/board";
import BoardComponent from "./components/board";
import ToolbarComponent from "./components/toolbar";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { InitSummation } from "@/lib/solve";
import { TOOL_PAGE } from "@/lib/toolpage";

const inter = Inter({ subsets: ["latin"] });

const InfoPanel = (setInfoVis: Function, setBoard: Function, setToolPage: Function) =>
<div className="flex items-center justify-center absolute top-0 right-0 size-full bg-opacity-30 bg-black">
  <div className="relative border bg-black h-3/5 aspect-square overflow-auto text-center p-5">
    <button
      className="absolute top-0 right-0 m-5 bg-white text-black font-bold size-6 rounded-full"
      onClick={() => setInfoVis(false)}
    >
      {"X"}
    </button>
    <h1 className="font-bold mb-2">Kakuro Solver</h1>
    <p>
      This project was made to learn the basics of
      the <a className="underline" href="https://nextjs.org/" target="_blank">Next.js framework</a> and
      try out some optimization algorithms on the NP-complete problem of solving Kakuro puzzles.
    </p>
    <br/>
    <p>
      To start, generate a random puzzle to try this solver on
      at <a className="underline" href="https://www.kakuros.com/" target="_blank">this website</a>.
      Use the sizing and fill tools to define the shape of the board.
      On the next page, fill out the auto-generated hint fields to match the puzzle hints.
      Adjust the speed slider to preview the solver at various speeds, or set it to instant if
      you want the puzzle solved as fast as possible.
    </p>
    <br/>
    <p>
      You can also try out
      this <button
        className="underline"
        onClick={() => {setInfoVis(false); setBoard(getExampleBoard()); setToolPage(TOOL_PAGE.HINTS);}}
      >pre-loaded example</button>.
    </p>
    <br/>
    <p>
      The public git repository is
      available <a className="underline" href="https://github.com/Malizma333/kakuro-solver" target="_blank">here</a>.
    </p>
  </div>
</div>

export default function Home() {
  const [board, setBoard] = useState(getNewBoard());
  const [toolPage, setToolPage] = useState(0);
  const [swatch, setSwatch] = useState(0 as 0 | 1);
  const [invalidHints, setInvalidHints] = useState([] as number[]);
  const [speed, setSpeed] = useState(1);
  const [instant, setInstant] = useState(false);
  const [error, setError] = useState(false);
  const [infoVis, setInfoVis] = useState(false);

  const toolbarProps = {
    board, setBoard,
    toolPage, setToolPage,
    swatch, setSwatch,
    setInvalidHints,
    speed, setSpeed,
    instant, setInstant,
    error, setError
  };

  const boardProps = {
    board, setBoard,
    swatch, toolPage, invalidHints
  };

  useEffect(() => {(async () => await InitSummation())()}, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ToolbarComponent props={toolbarProps}></ToolbarComponent>
      <BoardComponent props={boardProps}></BoardComponent>
      <button
        className="absolute top-0 left-0 m-5 bg-white text-black font-bold size-6 rounded-full"
        onClick={() => setInfoVis(true)}
      >
        {"i"}
      </button>
      {infoVis && InfoPanel(setInfoVis, setBoard, setToolPage)}
    </main>
  );
}
