export interface IObjectBody {
  x: number;
  y: number;
}

const generateObject = (
  length: number,
  width: number,
  xOffset = 0,
  yOffset = 0
): IObjectBody[] => {
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

export const equalPositions = (pos1: IObjectBody, pos2: IObjectBody) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const hasSnakeCollided = (snake: IObjectBody[]) => {
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
