export const Instructions = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center z-50">
      <div className="how-to-play text-center text-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-3xl font-bold mb-4">How To Play</h2>
        <p className="text-xl leading-loose">
          Use the
          <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-lg">
            W
          </span>
          <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-lg">
            A
          </span>
          <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-lg">
            S
          </span>
          <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-lg">
            D
          </span>
          buttons to control the snake.
        </p>
        <p className="text-xl mt-4">
          Press
          <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-2 shadow-lg">
            ␣
          </span>
          to start
        </p>
      </div>
    </div>
  );
};
