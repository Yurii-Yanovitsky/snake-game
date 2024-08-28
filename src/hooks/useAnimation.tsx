import { useCallback } from "react";

let animationFrame: number | null = null;
let lastTimestamp = 0;

export const useAnimation = (speed: number, onAnimate: () => void) => {
  const loopAnimation = useCallback(
    (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(loopAnimation);

      const timeElapsed = (timestamp - lastTimestamp) / 1000;

      if (timeElapsed < 1 / speed) {
        return;
      }

      lastTimestamp = timestamp;

      onAnimate();
    },
    [speed, onAnimate]
  );

  const start = useCallback(() => {
    animationFrame = window.requestAnimationFrame(loopAnimation);
  }, [loopAnimation]);

  const stop = useCallback(() => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  }, []);

  return { start, stop };
};
