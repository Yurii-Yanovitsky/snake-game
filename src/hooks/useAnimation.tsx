import { useCallback, useRef } from "react";

export const useAnimation = (speed: number, onAnimate: () => void) => {
  const animationFrame = useRef<number | null>(null);
  const lastTimestamp = useRef<number>(0);

  const loopAnimation = useCallback(
    (timestamp: number) => {
      animationFrame.current = window.requestAnimationFrame(loopAnimation);

      const timeElapsed = (timestamp - lastTimestamp.current) / 1000;

      if (timeElapsed < 1 / speed) {
        return;
      }

      lastTimestamp.current = timestamp;

      onAnimate();
    },
    [speed, onAnimate]
  );

  const start = useCallback(() => {
    animationFrame.current = window.requestAnimationFrame(loopAnimation);
  }, [loopAnimation]);

  const stop = useCallback(() => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  return { start, stop };
};
