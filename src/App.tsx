import { useCallback, useState } from "react";
import GameBoard from "./components/GameBoard";

function App() {
  const [gameIndex, setGameIndex] = useState(0);

  const handleGameEnded = useCallback(() => {
    setGameIndex((val) => val + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center bg-gray-900 min-h-screen py-8">
      <h1 className="text-4xl font-bold text-white mb-6">Snake Game</h1>
      <GameBoard
        key={gameIndex}
        className="h-screen-min-3/5 bg-gray-[#2D3748] rounded-lg border-black border-4 shadow-2xl relative"
        onGameEnded={handleGameEnded}
      />
    </div>
  );
}

export default App;
