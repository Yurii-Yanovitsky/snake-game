import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard, { BoardDimensions } from "./GameBoard";
import PauseOverlay from "./PauseOverlay";
import InstructionsOverlay from "./InstructionsOverlay";
import { useSnake } from "../hooks/useSnake";
import { useAnimation } from "../hooks/useAnimation";

type GameStatus = "NotStarted" | "InProgress" | "Paused" | "Ended";

const GameContainer = ({
  className,
  onGameEnded,
}: {
  className: string;
  onGameEnded: (finalScore: number) => void;
}) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>("NotStarted");
  const [blinkingToggle, setBlinkingToggle] = useState(false);

  const handleSnakeCollided = useCallback(() => setGameStatus("Ended"), []);
  const { snake, loot, score, moveSnake, setDirection, initSnake } =
    useSnake(handleSnakeCollided);

  const updateSnakePosition = useCallback(() => moveSnake(), [moveSnake]);
  const { start, stop } = useAnimation(10, updateSnakePosition);

  const scoreRef = useRef(0);
  scoreRef.current = score;

  const endGame = useCallback(() => {
    const intervalId = window.setInterval(() => {
      setBlinkingToggle((prev) => !prev);
    }, 200);

    setTimeout(() => {
      window.clearInterval(intervalId);
      onGameEnded(scoreRef.current);
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== "InProgress") {
        return;
      }

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
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStatus, setDirection]);

  useEffect(() => {
    const handleSpacePress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setGameStatus((prev) => {
          if (prev === "Ended") return prev;
          return prev === "InProgress" ? "Paused" : "InProgress";
        });
      }
    };

    window.addEventListener("keydown", handleSpacePress);
    return () => window.removeEventListener("keydown", handleSpacePress);
  }, []);

  const handleDimensions = useCallback(
    (boardDimensions: BoardDimensions) => {
      initSnake(boardDimensions);
    },
    [initSnake]
  );

  const StatusOverlay = {
    NotStarted: <InstructionsOverlay />,
    Paused: <PauseOverlay />,
    InProgress: <></>,
    Ended: <></>,
  }[gameStatus];

  return (
    <div className={className}>
      <GameBoard
        snake={blinkingToggle ? [] : snake}
        loot={loot}
        score={score}
        onDimensions={handleDimensions}
      />
      {StatusOverlay}
    </div>
  );
};

export default GameContainer;
