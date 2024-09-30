import { useState, useCallback, useEffect } from "react";
import GameContainer from "./GameContainer";
import GameRecords, { GameRecord } from "./GameRecords";

const GAME_BOARD_SIZE_FACTOR = 0.6;

const SnakeGame = () => {
  const [gameIndex, setGameIndex] = useState(0);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    const storedRecords = localStorage.getItem("gameRecords");
    if (storedRecords) {
      setGameRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    if (gameRecords.length) {
      localStorage.setItem("gameRecords", JSON.stringify(gameRecords));
    }
  }, [gameRecords]);

  const handleGameEnded = useCallback((finalScore: number) => {
    setGameRecords((prevValues) => [
      { recordId: prevValues.length + 1, score: finalScore },
      ...prevValues,
    ]);
    setGameIndex((val) => val + 1);
  }, []);

  const width = window.innerWidth * GAME_BOARD_SIZE_FACTOR;
  const height = window.innerHeight * GAME_BOARD_SIZE_FACTOR;

  return (
    <div className="grid grid-rows-[auto,auto,minmax(0,1fr)] justify-items-center h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white p-6">Snake Game</h1>
      <GameContainer
        className="bg-gray-[#2D3748] rounded-lg border-black border-4 shadow-2xl relative"
        width={width}
        height={height}
        key={gameIndex}
        onGameEnded={handleGameEnded}
      />
      {gameRecords.length > 0 && <GameRecords gameRecords={gameRecords} />}
    </div>
  );
};

export default SnakeGame;
