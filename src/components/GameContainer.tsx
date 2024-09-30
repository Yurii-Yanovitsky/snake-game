import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "./GameBoard";
import PauseOverlay from "./PauseOverlay";
import InstructionsOverlay from "./InstructionsOverlay";
import { useAnimation } from "../hooks/useAnimation";
import { useSnakeEngine } from "../hooks/useSnakeEngine";

type GameStatus = "NotStarted" | "InProgress" | "Paused" | "Ended";

const GameContainer = ({
  width,
  height,
  className,
  onGameEnded,
}: {
  width: number;
  height: number;
  className: string;
  onGameEnded: (finalScore: number) => void;
}) => {
  const snakeEngine = useSnakeEngine(width, height);
  const [gameStatus, setGameStatus] = useState<GameStatus>("NotStarted");
  const [loot, setLoot] = useState(snakeEngine.loot);
  const [snake, setSnake] = useState(snakeEngine.snakePosition);
  const [score, setScore] = useState(0);
  const directionRef = useRef<"Up" | "Down" | "Left" | "Right">("Right");
  const [blinkingToggle, setBlinkingToggle] = useState(false);

  useEffect(() => {
    snakeEngine.onSnakeCollision = () => setGameStatus("Ended");
    snakeEngine.onSnakeUpdate = (snakePosition, loot, score) => {
      setSnake(snakePosition);
      setLoot(loot);
      setScore(score);
    };
  }, [snakeEngine]);

  const updateSnakePosition = useCallback(() => {
    snakeEngine.move(directionRef.current);
  }, [snakeEngine]);

  const { start, stop } = useAnimation(updateSnakePosition);

  const handleGameEndWithBlinkingEffect = useCallback(() => {
    const intervalId = window.setInterval(() => {
      setBlinkingToggle((prev) => !prev);
    }, 200);

    setTimeout(() => {
      window.clearInterval(intervalId);
      onGameEnded(snakeEngine.score);
    }, 2000);
  }, [snakeEngine, onGameEnded]);

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
        handleGameEndWithBlinkingEffect();
        break;
    }
  }, [gameStatus, start, stop, handleGameEndWithBlinkingEffect]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== "InProgress") {
        return;
      }

      switch (event.code) {
        case "KeyW":
          directionRef.current = "Up";
          break;
        case "KeyS":
          directionRef.current = "Down";
          break;
        case "KeyA":
          directionRef.current = "Left";
          break;
        case "KeyD":
          directionRef.current = "Right";
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStatus]);

  useEffect(() => {
    const handleSpacePress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        setGameStatus((prev) => {
          if (prev === "Ended") return prev;
          return prev === "InProgress" ? "Paused" : "InProgress";
        });
      }
    };

    window.addEventListener("keydown", handleSpacePress);
    return () => window.removeEventListener("keydown", handleSpacePress);
  }, []);

  const StatusOverlay = {
    NotStarted: <InstructionsOverlay />,
    Paused: <PauseOverlay />,
    InProgress: <></>,
    Ended: <></>,
  }[gameStatus];

  const { gameBoardConfig } = snakeEngine;

  return (
    <div className={className}>
      <GameBoard
        width={gameBoardConfig.width}
        height={gameBoardConfig.height}
        cellSize={gameBoardConfig.cellSize}
        snake={blinkingToggle ? [] : snake}
        loot={loot}
        score={score}
      />
      {StatusOverlay}
    </div>
  );
};

export default GameContainer;
