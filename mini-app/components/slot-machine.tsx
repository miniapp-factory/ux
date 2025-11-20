"use client";

import { useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(generateRandomGrid());
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  function generateRandomGrid(): string[][] {
    const newGrid: string[][] = [];
    for (let col = 0; col < 3; col++) {
      const column: string[] = [];
      for (let row = 0; row < 3; row++) {
        column.push(randomFruit());
      }
      newGrid.push(column);
    }
    return newGrid;
  }

  function randomFruit(): string {
    return fruits[Math.floor(Math.random() * fruits.length)];
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => {
          const newCol = [...col];
          newCol.pop();
          newCol.unshift(randomFruit());
          return newCol;
        });
        return newGrid;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  }

  function checkWin() {
    // Check rows
    for (let row = 0; row < 3; row++) {
      const first = grid[0][row];
      if (grid[1][row] === first && grid[2][row] === first) {
        setWin(first);
        return;
      }
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      const first = grid[col][0];
      if (grid[col][1] === first && grid[col][2] === first) {
        setWin(first);
        return;
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={fruitImages[fruit]}
              alt={fruit}
              className="w-16 h-16 object-contain"
            />
          ))
        )}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="text-center">
          <p className="text-xl font-bold">You won with {win}!</p>
          <Share text={`I won with ${win}! ${url}`} />
        </div>
      )}
    </div>
  );
}
