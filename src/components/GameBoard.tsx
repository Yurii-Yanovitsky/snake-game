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
  onDimensions: (dimensions: BoardDimensions) => void;
}

const CELL_SIZE_PERCENT = 5;

const flipYAxis = (context: CanvasRenderingContext2D) => {
  context.transform(1, 0, 0, -1, 0, context.canvas.height);
};

const GameBoard: FC<GameBoardProps> = ({
  snake,
  loot,
  score,
  onDimensions,
}) => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSizeRef = useRef(0);

  const drawObjects = useCallback(
    (objectBody: IObjectBody[], color: string) => {
      if (context) {
        context.save();
        flipYAxis(context);
        context.beginPath();
        context.lineCap = "round";
        context.lineWidth = (cellSizeRef.current * 5) / 100;
        context.strokeStyle = "black";
        context.fillStyle = color;
        objectBody.forEach((object: IObjectBody) => {
          context?.rect(
            object.x,
            object.y,
            cellSizeRef.current,
            cellSizeRef.current
          );
        });
        context?.fill();
        context?.stroke();
        context.restore();
      }
    },
    [context]
  );

  const drawScore = useCallback(
    (score: number) => {
      if (context) {
        context.save();
        const fontSizeFactor = 0.8;
        const fontSize = fontSizeFactor * cellSizeRef.current;
        context.font = `${fontSize}px "Press Start 2P"`;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillStyle = "#FFFFFF";
        const padding = Math.floor(cellSizeRef.current / 2);
        context.fillText(
          `Score: ${String(score).padStart(4, "0")}`,
          padding,
          padding
        );
        context.restore();
      }
    },
    [context]
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
  }, [snake, loot, score, drawScore, drawObjects, clearCanvas]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();

    const cellSize = Math.floor(
      (Math.min(rect.width, rect.height) * CELL_SIZE_PERCENT) / 100
    );
    canvasRef.current.width = Math.floor(rect.width / cellSize) * cellSize;
    canvasRef.current.height = Math.floor(rect.height / cellSize) * cellSize;
    cellSizeRef.current = cellSize;

    onDimensions({
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      cellSize,
    });

    const canvasContext = canvasRef.current.getContext("2d");
    if (canvasContext) {
      setContext(canvasContext);
    }
  }, [onDimensions]);

  return <canvas className="w-full h-full" ref={canvasRef} />;
};

export default GameBoard;
