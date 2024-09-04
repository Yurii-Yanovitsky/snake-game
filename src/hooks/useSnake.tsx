import { useRef, useState, useEffect, useCallback } from "react";

import {
  equalPositions,
  createSnake,
  hasSnakeCollided,
  IObjectBody,
  getRandomPosition,
} from "../utils";
import { CanvasInfo } from "./useCanvasDrawing";

const INIT_SNAKE_LENGTH_CELLS = 4;

export const useSnake = ({ width, height, cellSize }: CanvasInfo) => {
  const [score, setScore] = useState(0);
  const directionRef = useRef({ x: -1, y: 0 });
  const [loot, setLoot] = useState<IObjectBody>({ x: 0, y: 0 });
  const [snake, setSnake] = useState<IObjectBody[]>([{ x: -1, y: -1 }]);
  const [hasColided, setHasColided] = useState(false);

  const spawnLoot = useCallback(() => {
    setLoot(getRandomPosition(width, height, cellSize));
  }, [width, height, cellSize]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const nextHead = {
        x: (prevSnake[0].x + directionRef.current.x * cellSize + width) % width,
        y:
          (prevSnake[0].y + directionRef.current.y * cellSize + height) %
          height,
      };
      const nextSnake = [...prevSnake];

      nextSnake.pop();

      return [nextHead, ...nextSnake];
    });
  }, [cellSize, width, height]);

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
    setSnake(createSnake(width, height, cellSize, INIT_SNAKE_LENGTH_CELLS));
    setLoot(getRandomPosition(width, height, cellSize));
  }, [width, height, cellSize]);

  useEffect(() => {
    setHasColided(hasSnakeCollided(snake));

    if (equalPositions(snake[0], loot)) {
      growSnake();
      spawnLoot();
      setScore((prevVal) => prevVal + 10);
    }
  }, [loot, snake, spawnLoot, growSnake]);

  return { score, loot, snake, hasColided, moveSnake, setDirection };
};
