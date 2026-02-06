import React from 'react';

interface CuteMeterProps {
  points: number;
}

const CuteMeter: React.FC<CuteMeterProps> = ({ points }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-cute-cream border-4 border-cute-pink px-4 py-2 shadow-[0_0_0_3px_#ffe066] font-pixel text-xs md:text-sm text-cute-maroon flex items-center gap-2">
      <span className="text-red-500 animate-pulse">❤️</span>
      <span className="font-bold">{points}</span> Cute Points
    </div>
  );
};

export default CuteMeter;
