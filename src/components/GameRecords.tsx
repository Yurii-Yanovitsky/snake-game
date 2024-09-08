export type GameRecord = {
  recordId: number;
  score: number;
};

const GameRecords = ({ gameRecords }: { gameRecords: GameRecord[] }) => {
  if (gameRecords.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col text-white w-1/2 py-4">
      <h2 className="text-xl font-bold mb-2">Game Records</h2>
      <div className="text-xl space-y-2 flex-1 overflow-y-auto">
        {gameRecords.map(({ score, recordId }) => (
          <div
            key={recordId}
            className="bg-gray-800 p-3 rounded-lg shadow-md flex justify-between items-center text-sm"
          >
            <span className="font-semibold">Game #{recordId}</span>
            <span className="text-yellow-400">Score: {score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameRecords;
