import { FC, useCallback, useEffect, useRef, useState } from "react";
import { IObjectBody } from "../utils";

export interface BoardDimensions {
  width: number;
  height: number;
  cellSize: number;
}

interface GameBoardProps {
  snake: IObjectBody[];
  loot: IObjectBody;
  score: number;
  width: number;
  height: number;
  cellSize: number;
}

const flipYAxis = (context: CanvasRenderingContext2D) => {
  context.transform(1, 0, 0, -1, 0, context.canvas.height);
};

const GameBoard: FC<GameBoardProps> = ({
  snake,
  loot,
  score,
  width,
  height,
  cellSize,
}) => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawObjects = useCallback(
    (objectBody: IObjectBody[], color: string) => {
      if (context) {
        context.save();
        flipYAxis(context);
        context.beginPath();
        context.lineCap = "round";
        const lineWidthFactor = 0.1;
        context.lineWidth = cellSize * lineWidthFactor;
        context.strokeStyle = "black";
        context.fillStyle = color;
        objectBody.forEach((object: IObjectBody) => {
          context?.roundRect(
            object.x,
            object.y,
            cellSize,
            cellSize,
            Math.floor(cellSize * 0.3)
          );
        });
        context?.stroke();
        context?.fill();
        context.restore();
      }
    },
    [context, cellSize]
  );

  const drawScore = useCallback(
    (score: number) => {
      if (context) {
        context.save();
        const fontSizeFactor = 0.8;
        const fontSize = fontSizeFactor * cellSize;
        context.font = `${fontSize}px "Press Start 2P"`;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillStyle = "#FFFFFF";
        const padding = Math.floor(cellSize / 2);
        context.fillText(
          `Score: ${String(score).padStart(4, "0")}`,
          padding,
          padding
        );
        context.restore();
      }
    },
    [context, cellSize]
  );

  const clearCanvas = useCallback(() => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }, [context]);

  useEffect(() => {
    clearCanvas();
    drawObjects([loot], "#FFD700");
    drawObjects(snake, "#38A169");
    drawScore(score);
  }, [snake, loot, score, clearCanvas, drawScore, drawObjects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext("2d");

    if (canvasContext) {
      setContext(canvasContext);
    }
  }, []);

  return <canvas width={width} height={height} ref={canvasRef} />;
};

export default GameBoard;
