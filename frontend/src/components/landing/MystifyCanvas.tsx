import React, { useEffect, useRef } from 'react';

interface WaveControlPoint {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  angleX: number;
  angleY: number;
  speedX: number;
  speedY: number;
  x: number;
  y: number;
}

export const MystifyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1 Single Continuous Edge-to-Edge Ribbon (Starts offscreen left, ends offscreen right)
    const p0: WaveControlPoint = {
      centerX: -80,
      centerY: height * 0.35,
      radiusX: 60,
      radiusY: height * 0.45,
      angleX: 0,
      angleY: 1.2,
      speedX: 0.003,
      speedY: 0.004,
      x: -80,
      y: height * 0.35,
    };

    const p1: WaveControlPoint = {
      centerX: width * 0.35,
      centerY: height * 0.7,
      radiusX: width * 0.22,
      radiusY: height * 0.38,
      angleX: 2.1,
      angleY: 0.5,
      speedX: 0.005,
      speedY: 0.006,
      x: width * 0.35,
      y: height * 0.7,
    };

    const p2: WaveControlPoint = {
      centerX: width * 0.65,
      centerY: height * 0.25,
      radiusX: width * 0.24,
      radiusY: height * 0.35,
      angleX: 4.3,
      angleY: 3.2,
      speedX: 0.004,
      speedY: 0.005,
      x: width * 0.65,
      y: height * 0.25,
    };

    const p3: WaveControlPoint = {
      centerX: width + 80,
      centerY: height * 0.65,
      radiusX: 60,
      radiusY: height * 0.45,
      angleX: 1.5,
      angleY: 2.8,
      speedX: 0.003,
      speedY: 0.004,
      x: width + 80,
      y: height * 0.65,
    };

    const maxHistory = 50;
    const history: {
      p0: { x: number; y: number };
      p1: { x: number; y: number };
      p2: { x: number; y: number };
      p3: { x: number; y: number };
      hue: number;
    }[] = [];

    let time = 0;

    const updatePoint = (cp: WaveControlPoint) => {
      cp.angleX += cp.speedX;
      cp.angleY += cp.speedY;

      cp.x = cp.centerX + Math.sin(cp.angleX) * cp.radiusX;
      cp.y = cp.centerY + Math.cos(cp.angleY) * cp.radiusY;
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smoothly update the 4 control points
      updatePoint(p0);
      updatePoint(p1);
      updatePoint(p2);
      updatePoint(p3);

      // Light Blue spectrum (Ice Blue 185° -> Sky Blue 200° -> Luminous Baby Blue 215°)
      const currentHue = 200 + Math.sin(time * 0.006) * 15;

      history.push({
        p0: { x: p0.x, y: p0.y },
        p1: { x: p1.x, y: p1.y },
        p2: { x: p2.x, y: p2.y },
        p3: { x: p3.x, y: p3.y },
        hue: currentHue,
      });

      if (history.length > maxHistory) {
        history.shift();
      }

      const total = history.length;

      // Draw exactly ONE single smooth continuous silk ribbon from edge to edge
      history.forEach((curve, idx) => {
        const progress = (idx + 1) / total;
        // Soft alpha gradient with luminous leading edge
        const alpha = 0.03 + Math.pow(progress, 1.6) * 0.65;

        // Strictly light blue colors: High lightness (65% to 75%), pure sky & ice blue tones
        const startColor = `hsla(${curve.hue - 12}, 95%, 68%, ${alpha})`;
        const midColor = `hsla(${curve.hue}, 92%, 70%, ${alpha})`;
        const endColor = `hsla(${curve.hue + 12}, 95%, 72%, ${alpha})`;

        const grad = ctx.createLinearGradient(
          curve.p0.x,
          curve.p0.y,
          curve.p3.x,
          curve.p3.y
        );
        grad.addColorStop(0, startColor);
        grad.addColorStop(0.5, midColor);
        grad.addColorStop(1, endColor);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = idx === total - 1 ? 2.2 : 1.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // ONLY 1 Single Continuous Edge-to-Edge Bezier Ribbon
        ctx.beginPath();
        ctx.moveTo(curve.p0.x, curve.p0.y);
        ctx.bezierCurveTo(
          curve.p1.x,
          curve.p1.y,
          curve.p2.x,
          curve.p2.y,
          curve.p3.x,
          curve.p3.y
        );
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
