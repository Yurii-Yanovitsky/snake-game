import { FC, useCallback, useEffect, useState } from "react";

import { useAnimation } from "../hooks/useAnimation";
import { useCanvasDrawing } from "../hooks/useCanvasDrawing";
import { useSnake } from "../hooks/useSnake";

type GameStatus = "NotStarted" | "InProgress" | "Paused" | "Ended";

const GameBoard: FC<{
  className?: string;
  onGameEnded?: () => void;
}> = ({ className, onGameEnded }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>("NotStarted");
  const { canvasRef, canvasInfo, drawObjects, drawScore, clearCanvas } =
    useCanvasDrawing();
  const { snake, loot, hasColided, score, moveSnake, setDirection } =
    useSnake(canvasInfo);

  useEffect(() => {
    if (hasColided) {
      setGameStatus("Ended");
    }

    clearCanvas();
    drawObjects([loot], "orange");
    drawObjects(snake, "green");
    drawScore(score);
  }, [snake, loot, hasColided, score, drawScore, drawObjects, clearCanvas]);

  const updateSnakePosition = useCallback(() => {
    moveSnake();
  }, [moveSnake]);

  const { start, stop } = useAnimation(10, updateSnakePosition);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

      switch (event.code) {
        case "KeyW":
          setDirection("Up");
          break;
        case "KeyS":
          setDirection("Down");
          break;
        case "KeyA":
          setDirection("Left");
          break;
        case "KeyD":
          setDirection("Right");
          break;
      }

      if (event.code === "Space") {
        setGameStatus((prev) => {
          if (prev === "Ended") {
            return prev;
          }

          return prev === "InProgress" ? "Paused" : "InProgress";
        });
      }
    },
    [setDirection]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    switch (gameStatus) {
      case "InProgress":
        start();
        break;
      case "Paused":
        stop();
        break;
      case "Ended":
        stop();
        setTimeout(() => {
          onGameEnded?.();
        }, 2000);
        break;
    }
  }, [gameStatus, start, stop, onGameEnded]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GameBoard;
