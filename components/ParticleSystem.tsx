import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants'; // Assuming you have this

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number; // We will use this for scale now
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
    // 1. FIX: Clear existing particles so we don't get duplicates in React Strict Mode
    particles.current = []; 
    
    const count = 300; // You can lower this to 150 if it's still slow on mobile
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Increased speed slightly for a more dramatic "pop"
      const speed = Math.random() * 12 + 6; 
      
      particles.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        // We will use 1 as base scale, so size becomes a multiplier (e.g., 0.8 to 1.5)
        size: (Math.random() * 0.8) + 0.8, 
        color: Math.random() > 0.5 ? COLORS.CRUSHED_BERRY : COLORS.RASPBERRY,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
  };

  const update = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // 2. OPTIMIZATION: Set the font ONCE per frame, not 300 times.
    // We use a large base size (30px) and scale it down/up later.
    ctx.font = "30px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    particles.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // Slightly heavier gravity for better feel
      p.vx *= 0.98; // Slightly more friction
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      // 3. OPTIMIZATION: Use scale instead of changing font string
      ctx.scale(p.size, p.size); 
      
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    });

    requestRef.current = requestAnimationFrame(() => update(ctx, width, height));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true }); // optimize for transparency
    if (!ctx) return;

    const handleResize = () => {
      // Handle high-DPI displays (Retina screens) for sharpness, 
      // but if performance is key, standard 1x is faster.
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