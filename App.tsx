
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLORS, TARGET_COUNT, EXPLOSION_DURATION_MS } from './constants';
import { ParticleSystem } from './components/ParticleSystem';
import { LoveLetter } from './components/LoveLetter';

type Phase = 'setup' | 'explosion' | 'reveal';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<number | null>(null);

  const handleInteraction = useCallback(() => {
    if (phase !== 'setup') return;

    setCount((prev) => {
      const next = prev + 1;
      if (next >= TARGET_COUNT) {
        setPhase('explosion');
        return TARGET_COUNT;
      }
      return next;
    });

    // Trigger shake
    setIsShaking(true);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = window.setTimeout(() => setIsShaking(false), 200);
  }, [phase]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  useEffect(() => {
    if (phase === 'explosion') {
      const timer = setTimeout(() => {
        setPhase('reveal');
      }, EXPLOSION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const progress = (count / TARGET_COUNT) * 100;

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000 ${isShaking ? 'animate-shake' : ''}`}
      style={{ backgroundColor: phase === 'reveal' ? COLORS.LIGHT_CYAN : COLORS.PINK_MIST }}
    >
      {/* Setup & Explosion Phase Background Blur */}
      {phase !== 'reveal' && (
        <div className="absolute inset-0 backdrop-blur-md z-10 pointer-events-none" />
      )}

      {/* Phase 1 & 2: Interaction */}
      {phase === 'setup' && (
        <div className="z-20 flex flex-col items-center">
          <div className="text-[120px] mb-8 select-none">💐</div>
          <p 
            className="text-2xl font-bold mb-8 transition-opacity duration-300"
            style={{ color: COLORS.CRUSHED_BERRY }}
          >
            Press SPACE fast to release the love!
          </p>
          
          {/* Progress Bar Container */}
          <div 
            className="fixed bottom-12 left-1/2 -translate-x-1/2 w-4/5 max-w-lg h-6 rounded-full overflow-hidden border-2"
            style={{ borderColor: COLORS.CRUSHED_BERRY, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <div 
              className="h-full transition-all duration-150 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: COLORS.RASPBERRY
              }}
            />
          </div>
        </div>
      )}

      {/* Phase 3: Explosion */}
      {phase === 'explosion' && (
        <ParticleSystem />
      )}

      {/* Phase 4: Reveal */}
      {phase === 'reveal' && (
        <div className="z-50 animate-reveal">
          <LoveLetter />
        </div>
      )}

      {/* Decorative corners for all phases */}
      <div className="absolute top-0 left-0 p-8 text-4xl opacity-20 pointer-events-none">💖</div>
      <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 pointer-events-none">💖</div>
      <div className="absolute bottom-0 left-0 p-8 text-4xl opacity-20 pointer-events-none">💖</div>
      <div className="absolute bottom-0 right-0 p-8 text-4xl opacity-20 pointer-events-none">💖</div>
    </div>
  );
};

export default App;
