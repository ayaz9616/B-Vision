'use client';
import { useEffect, useRef } from 'react';

const NUM_BEAMS = 20;

export default function BeamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const beams = Array.from({ length: NUM_BEAMS }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      length: 120 + Math.random() * 60,
      angle: Math.random() * 2 * Math.PI,
      width: 1 + Math.random() * 1.5,
      opacity: 0.05 + Math.random() * 0.1,
      hue: Math.floor(Math.random() * 360),
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const beam of beams) {

        beam.x += beam.vx;
        beam.y += beam.vy;


        if (beam.x < 0 || beam.x > canvas.width) beam.vx *= -1;
        if (beam.y < 0 || beam.y > canvas.height) beam.vy *= -1;


        beam.angle += 0.002;


        const endX = beam.x + beam.length * Math.cos(beam.angle);
        const endY = beam.y + beam.length * Math.sin(beam.angle);


        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `hsla(${beam.hue}, 100%, 70%, ${beam.opacity})`;
        ctx.lineWidth = beam.width;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
