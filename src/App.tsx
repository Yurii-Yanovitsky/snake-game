import { useCallback, useState } from "react";

import GameContainer from "./components/GameContainer";

function App() {
  const [gameIndex, setGameIndex] = useState(0);

  const handleGameEnded = useCallback(() => {
    setGameIndex((val) => val + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center bg-gray-900 min-h-screen py-8">
      <h1 className="text-4xl font-bold text-white mb-6">Snake Game</h1>
      <GameContainer key={gameIndex} onGameEnded={handleGameEnded} />
    </div>
  );
}

export default App;
