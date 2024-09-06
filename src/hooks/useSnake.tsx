import { useRef, useState, useEffect, useCallback } from "react";

import {
  equalPositions,
  createSnake,
  hasSnakeCollided,
  IObjectBody,
  getRandomPosition,
} from "../utils";

const INIT_SNAKE_LENGTH_CELLS = 2;

interface BoardDimensions {
  width: number;
  height: number;
  cellSize: number;
}

export const useSnake = (onSnakeCollided: () => void) => {
  const [score, setScore] = useState(0);
  const directionRef = useRef({ x: -1, y: 0 });
  const [loot, setLoot] = useState<IObjectBody>({ x: 0, y: 0 });
  const [snake, setSnake] = useState<IObjectBody[]>([{ x: -1, y: -1 }]);

  const [boardDimensions, setBoardDimensions] = useState<BoardDimensions>({
    width: 0,
    height: 0,
    cellSize: 0,
  });

  const spawnLoot = useCallback(() => {
    setLoot(
      getRandomPosition(
        boardDimensions.width,
        boardDimensions.height,
        boardDimensions.cellSize
      )
    );
  }, [boardDimensions]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const nextHead = {
        x:
          (prevSnake[0].x +
            directionRef.current.x * boardDimensions.cellSize +
            boardDimensions.width) %
          boardDimensions.width,
        y:
          (prevSnake[0].y +
            directionRef.current.y * boardDimensions.cellSize +
            boardDimensions.height) %
          boardDimensions.height,
      };
      const nextSnake = [...prevSnake];

      nextSnake.pop();

      return [nextHead, ...nextSnake];
    });
  }, [boardDimensions]);

  const growSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newTail = { ...prevSnake[prevSnake.length - 1] };
      return [...prevSnake, newTail];
    });
  }, []);

  const setDirection = useCallback((type: "Up" | "Down" | "Left" | "Right") => {
    switch (type) {
      case "Up":
        if (directionRef.current.y === 0) {
          directionRef.current = { x: 0, y: 1 };
        }
        break;
      case "Down":
        if (directionRef.current.y === 0) {
          directionRef.current = { x: 0, y: -1 };
        }
        break;
      case "Left":
        if (directionRef.current.x === 0) {
          directionRef.current = { x: -1, y: 0 };
        }
        break;
      case "Right":
        if (directionRef.current.x === 0) {
          directionRef.current = { x: 1, y: 0 };
        }
        break;
      default:
    }
  }, []);

  useEffect(() => {
    if (hasSnakeCollided(snake)) {
      onSnakeCollided();
    }

    if (equalPositions(snake[0], loot)) {
      growSnake();
      spawnLoot();
      setScore((prevVal) => prevVal + 10);
    }
  }, [loot, snake, spawnLoot, growSnake, onSnakeCollided]);

  const initSnake = useCallback((boardDimensions: BoardDimensions) => {
    setBoardDimensions(boardDimensions);
    setSnake(
      createSnake(
        boardDimensions.width,
        boardDimensions.height,
        boardDimensions.cellSize,
        INIT_SNAKE_LENGTH_CELLS
      )
    );
    setLoot(
      getRandomPosition(
        boardDimensions.width,
        boardDimensions.height,
        boardDimensions.cellSize
      )
    );
  }, []);

  return {
    score,
    loot,
    snake,
    moveSnake,
    setDirection,
    initSnake,
  };
};
