
import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  friction: number;
  size: number; 
  color: string;
  emoji: string;
  rotation: number;
  rotationSpeed: number;
}

const EMOJIS = ['🌹', '❤️', '💖', '✨'];

export const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  const createParticles = (width: number, height: number) => {
    particles.current = []; 
    
    const count = 300; 
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5; 
      
      particles.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        // Varied gravity: some fall fast, some float like petals
        gravity: (Math.random() * 0.07) + 0.03, 
        // Varied friction: simulates different drag/air resistance
        friction: (Math.random() * 0.04) + 0.94, 
        size: (Math.random() * 0.8) + 0.7, 
        color: Math.random() > 0.5 ? COLORS.CRUSHED_BERRY : COLORS.RASPBERRY,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    }
  };

  const update = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    ctx.font = "30px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    particles.current.forEach((p) => {
      // Apply per-particle physics
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      
      p.x += p.vx;
      p.y += p.vy;
      
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.size, p.size); 
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    });

    requestRef.current = requestAnimationFrame(() => update(ctx, width, height));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    createParticles(canvas.width, canvas.height);
    update(ctx, canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
};
