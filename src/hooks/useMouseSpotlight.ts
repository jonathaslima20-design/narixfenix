import { useEffect } from 'react';

export function useMouseSpotlight() {
  useEffect(() => {
    let targetX = 50;
    let targetY = 30;
    let curX = 50;
    let curY = 30;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      document.documentElement.style.setProperty('--mx', `${curX}%`);
      document.documentElement.style.setProperty('--my', `${curY}%`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
