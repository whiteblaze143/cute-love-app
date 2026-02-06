import React from 'react';
import { Inventory, ItemType } from '../types';
import { ITEM_CONFIG, TARGET_SCORE } from '../constants';

interface GameHUDProps {
  inventory: Inventory;
}

const GameHUD: React.FC<GameHUDProps> = ({ inventory }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur border-4 border-cute-maroon p-3 rounded-xl shadow-lg w-[90%] max-w-lg">
      <div className="flex justify-between items-center">
        {(Object.keys(ITEM_CONFIG) as ItemType[]).filter(type => type !== 'matcha').map((type) => {
          const config = ITEM_CONFIG[type];
          const count = inventory[type];
          const isComplete = count >= TARGET_SCORE;

          return (
            <div key={type} className="flex flex-col items-center">
              <div className={`text-2xl md:text-3xl mb-1 transition-transform ${isComplete ? 'scale-110' : ''}`}>
                {isComplete ? '✅' : config.emoji}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300 w-12 md:w-16 border border-gray-400">
                <div 
                  className="h-2.5 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min((count / TARGET_SCORE) * 100, 100)}%`,
                    backgroundColor: config.color
                  }}
                ></div>
              </div>
              <span className="text-[10px] font-pixel mt-1 text-cute-maroon">
                {count}/{TARGET_SCORE}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameHUD;