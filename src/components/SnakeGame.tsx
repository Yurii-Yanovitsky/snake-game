import { useState, useCallback } from "react";
import GameContainer from "./GameContainer";

const SnakeGame = () => {
  const [gameIndex, setGameIndex] = useState(0);

  const handleGameEnded = useCallback(() => {
    setGameIndex((val) => val + 1);
  }, []);

  return <GameContainer key={gameIndex} onGameEnded={handleGameEnded} />;
};

export default SnakeGame;
