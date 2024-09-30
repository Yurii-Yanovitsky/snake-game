import { useMemo } from "react";
import { SnakeEngine } from "../services/SnakeEngine";

export const CELL_SIZE_PERCENT = 5;

export const useSnakeEngine = (
  width: number,
  height: number,
  scoreIncrement = 10
) => {
  return useMemo(() => {
    const cellSize = Math.floor(
      (Math.min(width, height) * CELL_SIZE_PERCENT) / 100
    );

    return new SnakeEngine({
      scoreIncrement,
      boardConfig: {
        width: Math.floor(width / cellSize) * cellSize,
        height: Math.floor(height / cellSize) * cellSize,
        cellSize,
      },
    });
  }, [width, height, scoreIncrement]);
};
