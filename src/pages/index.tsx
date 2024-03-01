import Board from "./components/board";
import Toolbar from "./components/toolbar";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Toolbar></Toolbar>
      <Board></Board>
    </main>
  );
}
