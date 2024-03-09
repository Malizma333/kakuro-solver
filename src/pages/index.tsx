import { Board } from "@/lib/board";
import BoardComponent from "./components/board";
import ToolbarComponent from "./components/toolbar";
import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const board = new Board();

export default function Home() {
  const [width, setWidth] = useState(board.width);
  const [height, setHeight] = useState(board.height);
  const [toolPage, setToolPage] = useState(0);
  const [swatch, setSwatch] = useState(0 as 0 | 1);

  const toolbarProps = {board, setWidth, setHeight, toolPage, setToolPage, swatch, setSwatch};
  const boardProps = {board, swatch};

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ToolbarComponent props={toolbarProps}></ToolbarComponent>
      <BoardComponent props={boardProps}></BoardComponent>
    </main>
  );
}
