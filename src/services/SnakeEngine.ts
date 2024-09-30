import {
  IObjectBody,
  createSnake,
  getRandomPosition,
  equalPositions,
  lerp,
} from "../utils";

const INIT_SNAKE_LENGTH_CELLS = 2;
export type BoardConfig = {
  width: number;
  height: number;
  cellSize: number;
};
type Config = {
  boardConfig: BoardConfig;
  scoreIncrement: number;
};

export class SnakeEngine {
  public currentSnake: IObjectBody[] = [];

  public targetSnake: IObjectBody[] = [];

  public loot: IObjectBody = { x: 0, y: 0 };

  public score: number = 0;

  public direction = { x: -1, y: 0 };

  public onSnakeCollided: (() => void) | null = null;

  public onUpdate:
    | ((
        newSnakePosition: IObjectBody[],
        newLoot: IObjectBody,
        newScore: number
      ) => void)
    | null = null;

  public boardConfig: BoardConfig;

  private scoreIncrement = 0;

  private tween = 0;

  constructor({ boardConfig, scoreIncrement }: Config) {
    this.scoreIncrement = scoreIncrement;
    this.boardConfig = boardConfig;
    const initSnake = createSnake(
      boardConfig.width,
      boardConfig.height,
      boardConfig.cellSize,
      INIT_SNAKE_LENGTH_CELLS
    );
    this.currentSnake = [...initSnake];
    this.targetSnake = [...initSnake];
    this.loot = getRandomPosition(
      boardConfig.width,
      boardConfig.height,
      boardConfig.cellSize
    );
  }

  public move(direction: "Up" | "Down" | "Left" | "Right") {
    this.tween += 0.1;

    if (this.tween >= 1) {
      this.tween = 0;
      this.currentSnake = this.targetSnake;

      if (this.checkIsLootEaten(this.targetSnake)) {
        this.grow();
        this.setNewLoot();
        this.incrementScore();
      }

      this.targetSnake = this.getNextTarget(direction);

      if (this.checkIsSnakeColided(this.targetSnake)) {
        this.onSnakeCollided?.();
      }
    }

    const snakePosition = this.getInterpolatedSnake(this.tween);
    this.onUpdate?.(snakePosition, this.loot, this.score);
  }

  private getNextTarget(direction: "Up" | "Down" | "Left" | "Right") {
    this.setDirection(direction);
    const targetSnake = [...this.currentSnake];
    const head = targetSnake[0];

    const newHead = this.wrapPosition({
      x: head.x + this.direction.x * this.boardConfig.cellSize,
      y: head.y + this.direction.y * this.boardConfig.cellSize,
    });

    targetSnake.unshift(newHead);
    targetSnake.pop();

    return targetSnake;
  }

  private setNewLoot() {
    this.loot = getRandomPosition(
      this.boardConfig.width,
      this.boardConfig.height,
      this.boardConfig.cellSize
    );
  }

  private grow() {
    const newTail = { ...this.currentSnake[this.currentSnake.length - 1] };
    this.currentSnake.push(newTail);
  }

  private incrementScore() {
    this.score += this.scoreIncrement;
  }

  private checkIsSnakeColided(snake: IObjectBody[]) {
    const head = snake[0];
    return snake.some(
      (coord, index) => index !== 0 && equalPositions(head, coord)
    );
  }

  private checkIsLootEaten(snake: IObjectBody[]) {
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
          this.direction = { x: 0, y: 1 };
          break;
        case "Down":
          this.direction = { x: 0, y: -1 };
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

  private getInterpolatedSnake = (tween: number) => {
    let interpolatedSnake: IObjectBody[] = [];
    this.currentSnake.forEach((segment, index) => {
      const nextSegment = {
        x: lerp(segment.x, this.targetSnake[index].x, tween),
        y: lerp(segment.y, this.targetSnake[index].y, tween),
      };

      if (
        Math.abs(this.targetSnake[index].x - segment.x) >
        this.boardConfig.width / 2
      ) {
        if (this.targetSnake[index].x - segment.x > 0) {
          const currentX = lerp(segment.x, -this.boardConfig.cellSize, tween);
          const wrappedX = lerp(
            this.boardConfig.width,
            this.targetSnake[index].x,
            tween
          );
          interpolatedSnake.push({ x: currentX, y: segment.y });
          interpolatedSnake.push({ x: wrappedX, y: segment.y });
        } else {
          const currentX = lerp(
            -this.boardConfig.cellSize,
            this.targetSnake[index].x,
            tween
          );
          const wrappedX = lerp(segment.x, this.boardConfig.width, tween);
          interpolatedSnake.push({ x: currentX, y: segment.y });
          interpolatedSnake.push({ x: wrappedX, y: segment.y });
        }
      } else if (
        Math.abs(this.targetSnake[index].y - segment.y) >
        this.boardConfig.height / 2
      ) {
        if (this.targetSnake[index].y - segment.y > 0) {
          const currentY = lerp(segment.y, -this.boardConfig.cellSize, tween);
          const wrappedY = lerp(
            this.boardConfig.height,
            this.targetSnake[index].y,
            tween
          );
          interpolatedSnake.push({ x: segment.x, y: currentY });
          interpolatedSnake.push({ x: segment.x, y: wrappedY });
        } else {
          const currentY = lerp(
            -this.boardConfig.cellSize,
            this.targetSnake[index].y,
            tween
          );
          const wrappedY = lerp(segment.y, this.boardConfig.height, tween);
          interpolatedSnake.push({ x: segment.x, y: currentY });
          interpolatedSnake.push({ x: segment.x, y: wrappedY });
        }
      } else {
        interpolatedSnake.push(nextSegment);
      }
    });

    return interpolatedSnake;
  };

  private wrapPosition(position: { x: number; y: number }): IObjectBody {
    const { width, height } = this.boardConfig;
    return {
      x: (position.x + width) % width,
      y: (position.y + height) % height,
    };
  }
}
