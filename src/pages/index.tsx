import { Board, InitSummation } from "@/lib/board";
import BoardComponent from "./components/board";
import ToolbarComponent from "./components/toolbar";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [board, setBoard] = useState(Board);
  const [toolPage, setToolPage] = useState(0);
  const [swatch, setSwatch] = useState(0 as 0 | 1);

  const toolbarProps = {board, setBoard, toolPage, setToolPage, swatch, setSwatch};
  const boardProps = {board, setBoard, swatch, toolPage};

  useEffect(() => {(async () => await InitSummation())()}, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ToolbarComponent props={toolbarProps}></ToolbarComponent>
      <BoardComponent props={boardProps}></BoardComponent>
    </main>
  );
}
