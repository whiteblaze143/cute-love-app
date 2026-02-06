import React, { useState } from 'react';
import { StickerProps } from '../types';

const Sticker: React.FC<StickerProps> = ({ type, position, onClick }) => {
  const [isWaving, setIsWaving] = useState(false);

  const handleClick = () => {
    setIsWaving(true);
    onClick();
    setTimeout(() => setIsWaving(false), 700);
  };

  const posClass = position === 'top-right' ? 'top-4 right-4' : 'bottom-4 left-4';
  const emoji = type === 'bear' ? '🧸' : '🐰';

  return (
    <button
      className={`fixed ${posClass} z-40 text-6xl md:text-7xl filter drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none focus:scale-110 ${
        isWaving ? 'animate-wiggle' : 'animate-float'
      }`}
      onClick={handleClick}
      aria-label={`${type} sticker`}
    >
      {emoji}
    </button>
  );
};

export default Sticker;
