import { useCallback, FC, PropsWithChildren, useState } from "react";

import GameBoard from "./components/GameBoard";

const Heading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h2 className="flex flex-row flex-nowrap items-center my-8">
      <span
        className="flex-grow block border-t border-black"
        aria-hidden="true"
        role="presentation"
      ></span>
      <span className="flex-none block mx-4 px-4 py-2.5 text-xs leading-none font-medium uppercase bg-black text-white">
        {children}
      </span>
      <span
        className="flex-grow block border-t border-black"
        aria-hidden="true"
        role="presentation"
      ></span>
    </h2>
  );
};

const Instructions = () => {
  return (
    <>
      <Heading>Instructions</Heading>
      {/* <h2 className="text-center">Press "SPACE" to Start</h2> */}
    </>
  );
};

function App() {
  const [gameIndex, setGameIndex] = useState(0);

  const handleGameEnded = useCallback(() => {
    setGameIndex((val) => val + 1);
  }, []);

  return (
    <div className="flex flex-col h-screen-min">
      <Heading>Snake Game</Heading>
      <div className="flex-1 flex flex-row justify-center">
        <Heading>How to Play</Heading>
        <GameBoard
          key={gameIndex}
          className="h-screen-min-3/4 flex-shrink-0 bg-slate-400 rounded border-black border-2"
          onGameEnded={handleGameEnded}
        />
        <Heading>Score: 100</Heading>
      </div>
      <Instructions />
    </div>
  );
}

export default App;
