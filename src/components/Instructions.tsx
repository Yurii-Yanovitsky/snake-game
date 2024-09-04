export const Instructions = () => {
  return (
    <div className="how-to-play text-center bg-gradient-to-b from-gray-900 to-black text-white p-6 rounded-lg w-80 shadow-lg">
      <h2 className="text-2xl mb-4 font-bold uppercase tracking-wide">
        How To Play
      </h2>
      <p className="text-base leading-relaxed">
        Use the
        <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-md transform transition-transform duration-300 hover:scale-110">
          W
        </span>
        <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-md transform transition-transform duration-300 hover:scale-110">
          A
        </span>
        <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-md transform transition-transform duration-300 hover:scale-110">
          S
        </span>
        <span className="key inline-block bg-gray-800 border border-white text-white rounded-md px-3 py-1 mx-1 shadow-md transform transition-transform duration-300 hover:scale-110">
          D
        </span>
        buttons to control the snake.
      </p>
    </div>
  );
};
