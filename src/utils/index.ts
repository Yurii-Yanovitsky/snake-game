export interface IPosition {
  x: number;
  y: number;
}

const generateObject = (
  length: number,
  width: number,
  xOffset = 0,
  yOffset = 0
): IPosition[] => {
  return Array.from({ length }).map((_, index) => ({
    x: xOffset + index * width,
    y: yOffset,
  }));
};

export const createSnake = (
  canvasWidth: number,
  canvasHeight: number,
  snakeWidth: number,
  snakeLength: number
) => {
  const midX = Math.floor(canvasWidth / 2 / snakeWidth) * snakeWidth;
  const midY = Math.floor(canvasHeight / 2 / snakeWidth) * snakeWidth;

  return generateObject(snakeLength, snakeWidth, midX, midY);
};

export const equalPositions = (pos1: IPosition, pos2: IPosition) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const equalPositionsFloored = (pos1: IPosition, pos2: IPosition) => {
  return (
    Math.floor(pos1.x) === Math.floor(pos2.x) &&
    Math.floor(pos1.y) === Math.floor(pos2.y)
  );
};

export const hasSnakeCollided = (snake: IPosition[]) => {
  const head = snake[0];
  return snake.some(
    (coord, index) => index !== 0 && equalPositions(head, coord)
  );
};

export const randomNumber = (range: number, step: number) => {
  return Math.floor((Math.random() * range) / step) * step;
};

export const getRandomPosition = (
  graphWidth: number,
  graphHeight: number,
  cellSize: number
) => {
  return {
    x: randomNumber(graphWidth, cellSize),
    y: randomNumber(graphHeight, cellSize),
  };
};

export const lerp = (start: number, end: number, t: number) =>
  start + t * (end - start);
