import React, { useEffect, useState } from 'react';
import { FloatingElement } from '../types';

const CHARS = ['❤️', '💖', '🧸', '🐰', '✨', '🌸'];

const FloatingHearts: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate initial hearts
    const initialElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      content: CHARS[Math.floor(Math.random() * CHARS.length)],
      size: Math.random() * 1.5 + 1,
      animationDuration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setElements(initialElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-float opacity-30 select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}rem`,
            animationDuration: `${el.animationDuration}s`,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.content}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
