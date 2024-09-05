export const PauseOverlay = () => {
  return (
    <div
      id="pauseOverlay"
      className="absolute inset-0 bg-black bg-opacity-75 from-gray-900 to-black flex items-center justify-center z-50"
    >
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
        <p className="text-xl">
          Press
          <span className="inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-2 shadow-lg">
            ␣
          </span>
          to resume
        </p>
      </div>
    </div>
  );
};
