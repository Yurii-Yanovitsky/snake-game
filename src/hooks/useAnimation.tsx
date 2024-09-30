import { useCallback, useRef } from "react";

export const useAnimation = (onAnimate: () => void) => {
  const animationFrame = useRef<number | null>(null);

  const loopAnimation = useCallback(() => {
    animationFrame.current = window.requestAnimationFrame(loopAnimation);
    onAnimate();
  }, [onAnimate]);

  const start = useCallback(() => {
    animationFrame.current = window.requestAnimationFrame(loopAnimation);
  }, [loopAnimation]);

  const stop = useCallback(() => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  return { start, stop };
};
