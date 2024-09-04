import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IObjectBody } from "../utils";

export type CanvasInfo = {
  width: number;
  height: number;
  cellSize: number;
};

const CELL_SIZE_PERCENT = 5;
const DEFAULT_CANVAS = document.createElement("canvas");

const flipYAxis = (context: CanvasRenderingContext2D) => {
  context.transform(1, 0, 0, -1, 0, context.canvas.height);
};

export const useCanvasDrawing = () => {
  const canvasRef = useRef(DEFAULT_CANVAS);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();

    const size =
      (Math.min(canvasRef.current.width, canvasRef.current.height) *
        CELL_SIZE_PERCENT) /
      100;

    canvasRef.current.width = Math.floor(rect.width / size) * size;
    canvasRef.current.height = Math.floor(rect.height / size) * size;

    setCellSize(size);

    const canvasContext = canvasRef.current.getContext("2d");
    if (canvasContext) {
      flipYAxis(canvasContext);
      setContext(canvasContext);
    }
  }, []);

  const drawObjects = useCallback(
    (objectBody: IObjectBody[], color: string) => {
      if (context) {
        context.save();
        context.beginPath();
        context.lineCap = "round";
        context.lineWidth = (cellSize * 5) / 100;
        context.strokeStyle = "black";
        context.fillStyle = color;
        objectBody.forEach((object: IObjectBody) => {
          context?.rect(object.x, object.y, cellSize, cellSize);
        });
        context?.fill();
        context?.stroke();
        context.restore();
      }
    },
    [context, cellSize]
  );

  const drawScore = useCallback(
    (score: number) => {
      if (context) {
        context.save();
        flipYAxis(context);
        context.font = '24px "Press Start 2P"';
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillStyle = "#FFFFFF";
        context.fillText(`Score: ${String(score).padStart(4, "0")}`, 15, 15);
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

  const canvasInfo: CanvasInfo = useMemo(
    () => ({
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      cellSize,
    }),
    [canvasRef, cellSize]
  );

  return {
    canvasRef,
    canvasInfo,
    drawObjects,
    drawScore,
    clearCanvas,
  };
};
