import { useState, useEffect } from 'react';

const useCountUp = (end, duration = 1500, shouldAnimate = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldAnimate]);

  return count;
};

export default useCountUp;
