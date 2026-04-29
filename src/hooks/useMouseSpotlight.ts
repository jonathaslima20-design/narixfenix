import { useEffect } from 'react';

export function useMouseSpotlight() {
  useEffect(() => {
    let targetX = 50;
    let targetY = 30;
    let curX = 50;
    let curY = 30;
    let raf = 0;
    let running = true;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      if (!running) return;
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      document.documentElement.style.setProperty('--mx', `${curX}%`);
      document.documentElement.style.setProperty('--my', `${curY}%`);
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);
}
