import {
  IPosition,
  createSnake,
  getRandomPosition,
  equalPositions,
  lerp,
} from "../utils";

const INIT_SNAKE_LENGTH_CELLS = 2;

export type MovementSpeed =
  | 0.05
  | 0.1
  | 0.15
  | 0.2
  | 0.25
  | 0.3
  | 0.35
  | 0.4
  | 0.45
  | 0.5;

type GameBoardConfig = {
  width: number;
  height: number;
  cellSize: number;
};

type Config = {
  scoreIncrement: number;
  movementSpeed: MovementSpeed;
  gameBoardConfig: GameBoardConfig;
};

export class SnakeEngine {
  public snakePosition: IPosition[] = [];

  public nextSnakePosition: IPosition[] = [];

  public loot: IPosition = { x: 0, y: 0 };

  public score: number = 0;

  public direction = { x: -1, y: 0 };

  public onSnakeCollision: (() => void) | null = null;

  public onSnakeUpdate:
    | ((snakePosition: IPosition[], loot: IPosition, score: number) => void)
    | null = null;

  public gameBoardConfig: GameBoardConfig;

  private scoreIncrement = 0;

  private movementSpeed = 0;

  private movementProgress = 0;

  constructor({ gameBoardConfig, scoreIncrement, movementSpeed }: Config) {
    this.scoreIncrement = scoreIncrement;
    this.movementSpeed = movementSpeed;
    this.gameBoardConfig = gameBoardConfig;
    const initSnake = createSnake(
      gameBoardConfig.width,
      gameBoardConfig.height,
      gameBoardConfig.cellSize,
      INIT_SNAKE_LENGTH_CELLS
    );
    this.snakePosition = [...initSnake];
    this.nextSnakePosition = [...initSnake];
    this.loot = getRandomPosition(
      gameBoardConfig.width,
      gameBoardConfig.height,
      gameBoardConfig.cellSize
    );
  }

  public move(direction: "Up" | "Down" | "Left" | "Right") {
    this.movementProgress += this.movementSpeed;

    if (this.movementProgress >= 1) {
      this.movementProgress = 0;
      this.snakePosition = this.nextSnakePosition;

      if (this.checkIsLootEaten(this.nextSnakePosition)) {
        this.grow();
        this.setNewLoot();
        this.incrementScore();
      }

      this.nextSnakePosition = this.getNextTarget(direction);

      if (this.checkIsSnakeColided(this.nextSnakePosition)) {
        this.onSnakeCollision?.();
      }
    }

    const interpolatedSnakePosition = this.getInterpolatedSnake(
      this.movementProgress
    );
    this.onSnakeUpdate?.(interpolatedSnakePosition, this.loot, this.score);
  }

  private getNextTarget(direction: "Up" | "Down" | "Left" | "Right") {
    this.setDirection(direction);
    const targetSnake = [...this.snakePosition];
    const head = targetSnake[0];

    const newHead = this.wrapPosition({
      x: head.x + this.direction.x * this.gameBoardConfig.cellSize,
      y: head.y + this.direction.y * this.gameBoardConfig.cellSize,
    });

    targetSnake.unshift(newHead);
    targetSnake.pop();

    return targetSnake;
  }

  private setNewLoot() {
    this.loot = getRandomPosition(
      this.gameBoardConfig.width,
      this.gameBoardConfig.height,
      this.gameBoardConfig.cellSize
    );
  }

  private grow() {
    const newTail = { ...this.snakePosition[this.snakePosition.length - 1] };
    this.snakePosition.push(newTail);
  }

  private incrementScore() {
    this.score += this.scoreIncrement;
  }

  private checkIsSnakeColided(snake: IPosition[]) {
    const head = snake[0];
    return snake.some(
      (coord, index) => index !== 0 && equalPositions(head, coord)
    );
  }

  private checkIsLootEaten(snake: IPosition[]) {
    return equalPositions(snake[0], this.loot);
  }

  // Check if the new direction is valid (cannot reverse direction)
  private canChangeDirection(type: "Up" | "Down" | "Left" | "Right"): boolean {
    switch (type) {
      case "Up":
        return this.direction.y === 0;
      case "Down":
        return this.direction.y === 0;
      case "Left":
        return this.direction.x === 0;
      case "Right":
        return this.direction.x === 0;
      default:
        return false;
    }
  }

  // Method to set the direction if it doesn't reverse the current direction
  private setDirection(type: "Up" | "Down" | "Left" | "Right") {
    if (this.canChangeDirection(type)) {
      switch (type) {
        case "Up":
          this.direction = { x: 0, y: -1 };
          break;
        case "Down":
          this.direction = { x: 0, y: 1 };
          break;
        case "Left":
          this.direction = { x: -1, y: 0 };
          break;
        case "Right":
          this.direction = { x: 1, y: 0 };
          break;
      }
    }
  }

  private getInterpolatedSnake = (movementProgress: number): IPosition[] => {
    let interpolatedSnake: IPosition[] = [];

    this.snakePosition.forEach((segment, index) => {
      const nextSegment = this.nextSnakePosition[index];

      const interpolatedX = this.getInterpolatedCoordinate(
        segment.x,
        nextSegment.x,
        this.gameBoardConfig.width,
        movementProgress
      );

      const interpolatedY = this.getInterpolatedCoordinate(
        segment.y,
        nextSegment.y,
        this.gameBoardConfig.height,
        movementProgress
      );

      // If the interpolation resulted in wrapping (returns array), we push both parts
      if (Array.isArray(interpolatedX)) {
        interpolatedSnake.push(
          { x: interpolatedX[0], y: segment.y },
          { x: interpolatedX[1], y: segment.y }
        );
      } else if (Array.isArray(interpolatedY)) {
        interpolatedSnake.push(
          { x: segment.x, y: interpolatedY[0] },
          { x: segment.x, y: interpolatedY[1] }
        );
      } else {
        // Otherwise, we just push the standard interpolated position
        interpolatedSnake.push({ x: interpolatedX, y: interpolatedY });
      }
    });

    return interpolatedSnake;
  };

  private getInterpolatedCoordinate(
    current: number,
    next: number,
    maxSize: number,
    progress: number
  ): number | [number, number] {
    const distance = next - current;

    // Handle wrapping if the distance is larger than half the board size
    if (Math.abs(distance) > maxSize / 2) {
      if (distance > 0) {
        const currentPosition = lerp(
          current,
          -this.gameBoardConfig.cellSize,
          progress
        );
        const wrappedPosition = lerp(maxSize, next, progress);
        return [currentPosition, wrappedPosition];
      } else {
        const currentPosition = lerp(
          -this.gameBoardConfig.cellSize,
          next,
          progress
        );
        const wrappedPosition = lerp(current, maxSize, progress);
        return [currentPosition, wrappedPosition];
      }
    }

    // Standard interpolation if no wrapping is needed
    return lerp(current, next, progress);
  }

  private wrapPosition(position: { x: number; y: number }): IPosition {
    const { width, height } = this.gameBoardConfig;
    return {
      x: (position.x + width) % width,
      y: (position.y + height) % height,
    };
  }
}
