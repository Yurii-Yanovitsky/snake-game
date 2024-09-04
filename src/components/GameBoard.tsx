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
  const [blinkingToggle, setBlinkingToggle] = useState(false);
  const { canvasRef, canvasInfo, drawObjects, drawScore, clearCanvas } =
    useCanvasDrawing();
  const { snake, loot, hasColided, score, moveSnake, setDirection } =
    useSnake(canvasInfo);

  const updateSnakePosition = useCallback(() => {
    moveSnake();
  }, [moveSnake]);

  const { start, stop } = useAnimation(10, updateSnakePosition);

  useEffect(() => {
    clearCanvas();
    drawObjects([loot], "#FFD700");
    if (!blinkingToggle) {
      drawObjects(snake, "#38A169");
    }
    drawScore(score);
  }, [snake, loot, blinkingToggle, score, drawScore, drawObjects, clearCanvas]);

  useEffect(() => {
    if (hasColided) {
      setGameStatus("Ended");
    }
  }, [hasColided]);

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

  const endGame = useCallback(() => {
    const intervalId = window.setInterval(() => {
      setBlinkingToggle((prev) => !prev);
    }, 200);

    setTimeout(() => {
      window.clearInterval(intervalId);
      onGameEnded?.();
    }, 2000);
  }, [onGameEnded]);

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
        endGame();
        break;
    }
  }, [gameStatus, start, stop, endGame]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GameBoard;
