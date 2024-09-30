import { useMemo } from "react";
import { MovementSpeed, SnakeEngine } from "../services/SnakeEngine";

export const CELL_SIZE_PERCENT = 5;

export const useSnakeEngine = (
  width: number,
  height: number,
  scoreIncrement: number = 10,
  movementSpeed: MovementSpeed = 0.1
) => {
  return useMemo(() => {
    const cellSize = Math.floor(
      (Math.min(width, height) * CELL_SIZE_PERCENT) / 100
    );

    return new SnakeEngine({
      scoreIncrement,
      movementSpeed,
      gameBoardConfig: {
        width: Math.floor(width / cellSize) * cellSize,
        height: Math.floor(height / cellSize) * cellSize,
        cellSize,
      },
    });
  }, [width, height, scoreIncrement, movementSpeed]);
};
