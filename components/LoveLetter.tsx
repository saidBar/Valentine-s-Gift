
import React from 'react';
import { COLORS } from '../constants';

export const LoveLetter: React.FC = () => {
  return (
    <div 
      className="max-w-md w-full p-10 rounded-lg shadow-2xl transform transition-all duration-1000 scale-110 opacity-100 animate-[fadeIn_1s_ease-out]"
      style={{ 
        backgroundColor: COLORS.BUBBLEGUM_PINK,
        color: COLORS.CRUSHED_BERRY,
        border: `4px double ${COLORS.CRUSHED_BERRY}`
      }}
    >
      <h1 className="text-5xl font-romantic text-center mb-6">My Valentine</h1>
      <div className="space-y-4 text-center text-xl italic leading-relaxed">
        <p>In every beat my heart defines,</p>
        <p>A love that's yours, a soul that shines.</p>
        <p>Like roses red and skies of blue,</p>
        <p>My world is brighter because of you.</p>
        <div className="pt-6 border-t border-red-800/20">
          <p className="font-romantic text-3xl">Forever Yours.</p>
        </div>
      </div>
    </div>
  );
};
