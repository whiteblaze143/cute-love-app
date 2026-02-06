import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Inventory, GameItem, ItemType, PopEffect, Boss, Projectile, BossEffect } from './types';
import { STORY_LINES, NO_MESSAGES, PARTNER_NAME, PARTNER_NICKNAME, YOUR_NAME, ITEM_CONFIG, TARGET_SCORE, BOSS_MAX_HP, BOSS_QUOTES, BOSS_ATTACK_QUOTES, WEAPON_STATS } from './constants';
import MusicToggle from './components/MusicToggle';
import Sticker from './components/Sticker';
import CuteMeter from './components/CuteMeter';
import FloatingHearts from './components/FloatingHearts';
import GameHUD from './components/GameHUD';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('intro');
  const [points, setPoints] = useState(0);
  
  // Game State
  const [inventory, setInventory] = useState<Inventory>({ boba: 0, shopping: 0, makeup: 0, food: 0 });
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [popEffects, setPopEffects] = useState<PopEffect[]>([]);
  
  // Boss State
  const [boss, setBoss] = useState<Boss>({ x: 50, y: 15, hp: BOSS_MAX_HP, maxHp: BOSS_MAX_HP, isHit: false, quote: null, attackState: 'idle' });
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [bossEffects, setBossEffects] = useState<BossEffect[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  
  // Story State
  const [storyIndex, setStoryIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  // Question State
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noClickCount, setNoClickCount] = useState(0);
  
  // Success State
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Audio Context for SFX
  const audioCtxRef = useRef<AudioContext | null>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const bossAttackTimer = useRef<number>(0);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ latencyHint: 'interactive' });
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSfx = useCallback((type: 'coin' | 'boop' | 'success' | 'pop' | 'hit' | 'throw' | 'slam' | 'alert' | 'win') => {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'coin') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(1760, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'throw') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'slam') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'boop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.1);
      osc.frequency.setValueAtTime(659, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.start(now);
      osc.stop(now + 1.0);
    }
  }, []);

  const addPoints = (amount: number = 1) => {
    setPoints(prev => prev + amount);
    playSfx('coin');
  };

  // --- Collection Game Logic (Phase 1) ---
  useEffect(() => {
    if (state === 'game') {
      const allCollected = (Object.values(inventory) as number[]).every(count => count >= TARGET_SCORE);
      if (allCollected) {
        playSfx('success');
        setGameItems([]);
        setTimeout(() => {
            setState('boss_intro'); // Transition to Boss
        }, 1000);
      }
    }
  }, [inventory, state, playSfx]);

  // --- Boss Logic (Phase 2) ---
  
  // Boss AI & Movement
  useEffect(() => {
    if (state !== 'boss_fight') return;
    
    // Boss Attack Loop
    const aiInterval = setInterval(() => {
      setBoss(prev => {
        if (prev.attackState !== 'idle' || prev.hp <= 0) return prev;

        const now = Date.now();
        // 5% chance per tick
        if (now - bossAttackTimer.current > 4000) {
            bossAttackTimer.current = now;
            const attackRoll = Math.random();
            
            // 40% chance Syllabus Slam
            if (attackRoll < 0.4) {
                playSfx('slam');
                const quote = BOSS_ATTACK_QUOTES.slam[Math.floor(Math.random() * BOSS_ATTACK_QUOTES.slam.length)];
                
                setTimeout(() => setBoss(b => ({ ...b, attackState: 'idle' })), 1500);
                return { ...prev, attackState: 'syllabus_slam', quote };
            } 
            // 60% chance Pop Quiz
            else {
                playSfx('alert');
                const quote = BOSS_ATTACK_QUOTES.quiz[Math.floor(Math.random() * BOSS_ATTACK_QUOTES.quiz.length)];
                
                let spawned = 0;
                const barrage = setInterval(() => {
                    spawned++;
                    setBossEffects(eff => [...eff, {
                        id: Date.now() + Math.random(),
                        x: 50,
                        y: 20,
                        vx: (Math.random() - 0.5) * 15,
                        vy: Math.random() * 10 + 5,
                        emoji: Math.random() > 0.5 ? 'F' : '❓',
                        rotation: Math.random() * 360
                    }]);
                    if (spawned > 10) clearInterval(barrage);
                }, 100);

                setTimeout(() => setBoss(b => ({ ...b, attackState: 'idle' })), 2000);
                return { ...prev, attackState: 'pop_quiz', quote };
            }
        }
        return prev;
      });
    }, 100);

    // Movement Loop
    const moveInterval = setInterval(() => {
      const time = Date.now() / 1000;
      setBoss(prev => ({
        ...prev,
        x: 50 + Math.sin(time) * 30 // Sway left right
      }));
    }, 16);

    return () => {
        clearInterval(aiInterval);
        clearInterval(moveInterval);
    };
  }, [state, playSfx]);

  // Boss Effects & Projectiles Loop
  useEffect(() => {
    if (state !== 'boss_fight') return;
    const interval = setInterval(() => {
      // 1. Player Projectiles hitting Boss
      setProjectiles(prev => {
        const next = [];
        for (const p of prev) {
          const dx = (boss.x * window.innerWidth / 100) - p.x;
          const dy = (boss.y * window.innerHeight / 100) - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 60) {
            playSfx('hit');
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 200);

            setBoss(b => ({
               ...b, 
               hp: Math.max(0, b.hp - p.damage),
               isHit: true,
               quote: b.attackState === 'idle' ? BOSS_QUOTES[Math.floor(Math.random() * BOSS_QUOTES.length)] : b.quote
            }));
            
            setPopEffects(eff => [...eff, { id: Date.now(), x: p.x, y: p.y, emoji: '💥', text: `-${p.damage}` }]);

            setTimeout(() => {
              setBoss(b => ({ ...b, isHit: false, quote: b.attackState === 'idle' ? null : b.quote }));
            }, 500);
          } else {
            const angle = Math.atan2(dy, dx);
            next.push({
              ...p,
              x: p.x + Math.cos(angle) * p.speed,
              y: p.y + Math.sin(angle) * p.speed
            });
          }
        }
        return next;
      });

      // 2. Boss Particles Physics (Gravity)
      setBossEffects(prev => {
        return prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5,
            rotation: p.rotation + 5
        })).filter(p => p.y < 120);
      });

    }, 16);
    return () => clearInterval(interval);
  }, [state, boss.x, boss.y, boss.attackState, playSfx]);

  // Boss Death Condition
  useEffect(() => {
    if (state === 'boss_fight' && boss.hp <= 0) {
      playSfx('win');
      setProjectiles([]);
      setBossEffects([]);
      
      const timer = setTimeout(() => {
        setGameItems([]);
        setState('question');
        setStoryIndex(0);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [boss.hp, state, playSfx]);

  // Confetti Loop
  useEffect(() => {
      if (!isConfettiActive) return;
      
      const interval = setInterval(() => {
        setPopEffects(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                x: Math.random() * 100, // %
                y: Math.random() * 100, // %
                emoji: ['🎉', '🎊', '✨', '💍', '💖'][Math.floor(Math.random() * 5)]
            }
        ]);
      }, 200);

      return () => clearInterval(interval);
  }, [isConfettiActive]);


  // --- Spawner Loop (Shared) ---
  useEffect(() => {
    if (state !== 'game' && state !== 'boss_fight') {
        setGameItems([]);
        return;
    }

    const isBoss = state === 'boss_fight';

    const spawnInterval = setInterval(() => {
      if (boss.hp <= 0 && isBoss) return;

      const cap = isBoss ? 8 : 12;
      if (gameItems.length > cap) return; 

      let randomType: ItemType;
      
      if (isBoss) {
        const types: ItemType[] = ['boba', 'shopping', 'makeup', 'food', 'matcha'];
        randomType = types[Math.floor(Math.random() * types.length)];
      } else {
        const types: ItemType[] = ['boba', 'shopping', 'makeup', 'food'];
        randomType = types[Math.floor(Math.random() * types.length)];
      }
      
      const startX = Math.random() * (window.innerWidth - 80) + 40;

      const newItem: GameItem = {
        id: Date.now() + Math.random(),
        type: randomType,
        x: startX,
        startX: startX,
        y: window.innerHeight + 100,
        speed: (isBoss ? 4 : 3) + Math.random() * 2.5,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleDistance: 30 + Math.random() * 50,
      };

      setGameItems(prev => [...prev, newItem]);
    }, isBoss ? 400 : 600);

    return () => clearInterval(spawnInterval);
  }, [state, gameItems.length, boss.hp]);

  // --- Animation Loop (Physics) ---
  const animateItems = useCallback(() => {
    if (state !== 'game' && state !== 'boss_fight') return;
    
    timeRef.current += 1;

    setGameItems(prevItems => {
        return prevItems
            .map(item => {
                const wobble = Math.sin(timeRef.current * item.wobbleSpeed) * item.wobbleDistance;
                return { 
                    ...item, 
                    y: item.y - item.speed,
                    x: item.startX + wobble
                };
            })
            .filter(item => item.y > -150); 
    });

    requestRef.current = requestAnimationFrame(animateItems);
  }, [state]);

  useEffect(() => {
    if (state === 'game' || state === 'boss_fight') {
        requestRef.current = requestAnimationFrame(animateItems);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state, animateItems]);

  const handleItemClick = (id: number, type: ItemType, x: number, y: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    if (state === 'boss_fight') {
      if (boss.hp <= 0) return;
      playSfx('throw');
      
      const weaponStats = WEAPON_STATS[type];

      setProjectiles(prev => [...prev, {
        id: Date.now(),
        x,
        y,
        targetX: boss.x,
        targetY: boss.y,
        speed: weaponStats.speed,
        emoji: ITEM_CONFIG[type].emoji,
        damage: weaponStats.damage,
        scale: weaponStats.scale
      }]);
      setPopEffects(prev => [...prev, { id: Date.now(), x, y, emoji: '💨' }]);
    } else {
      playSfx('pop');
      const popId = Date.now();
      setPopEffects(prev => [...prev, { id: popId, x, y, emoji: ITEM_CONFIG[type].emoji }]);
      setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== popId)), 800);

      setPoints(p => p + 10);
      setInventory(prev => {
          const current = prev[type as keyof Inventory];
          if (current < TARGET_SCORE) {
              return { ...prev, [type]: current + 1 };
          }
          return prev;
      });
    }

    setGameItems(prev => prev.filter(item => item.id !== id));
  };

  // --- Story Logic ---
  useEffect(() => {
    if (state !== 'question') return;
    
    if (storyIndex >= STORY_LINES.length) {
      return;
    }

    const currentLine = STORY_LINES[storyIndex].text;
    let charIdx = 0;
    setTypedText('');

    const interval = setInterval(() => {
      if (charIdx <= currentLine.length) {
        setTypedText(currentLine.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStoryIndex(prev => prev + 1);
        }, 2000); 
      }
    }, 40); 

    return () => clearInterval(interval);
  }, [storyIndex, state]);


  // --- Event Handlers ---

  const startJourney = () => {
      playSfx('coin');
      setState('tutorial');
  };

  const finishTutorial = () => {
      playSfx('coin');
      setState('game_intro');
  };

  const startGame = () => {
      playSfx('success');
      setState('game');
  };

  const startBoss = () => {
      playSfx('coin');
      setState('boss_fight');
  };

  const handleNoInteraction = () => {
    playSfx('boop');
    setNoClickCount(prev => prev + 1);
    setYesScale(prev => prev + 0.2);
    
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    setNoBtnPos({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    playSfx('win');
    addPoints(100);
    setState('success');
    setIsConfettiActive(true);
  };

  return (
    <div className={`min-h-screen bg-cute-cream font-body text-cute-maroon overflow-hidden relative selection:bg-cute-pink selection:text-white ${state === 'game' || state === 'boss_fight' ? 'cursor-crosshair' : ''} ${screenShake ? 'animate-shake-hard' : ''}`}>
      <MusicToggle />
      
      {/* Screen Damage Flash Overlay */}
      <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-100 bg-red-500 mix-blend-overlay ${screenShake ? 'opacity-30' : 'opacity-0'}`}></div>

      {/* Syllabus Slam Overlay */}
      {boss.attackState === 'syllabus_slam' && boss.hp > 0 && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center animate-shake mix-blend-multiply">
            <div className="absolute inset-0 bg-red-500 opacity-20"></div>
            <div className="text-9xl filter drop-shadow-[10px_10px_0_#000]">📖</div>
            <h1 className="absolute text-6xl md:text-8xl font-pixel text-red-600 font-bold tracking-tighter drop-shadow-white rotate-[-10deg]">
                SYLLABUS<br/>SLAM!
            </h1>
        </div>
      )}

      {/* HUD */}
      {state === 'game' ? (
          <GameHUD inventory={inventory} />
      ) : state === 'boss_fight' && boss.hp > 0 ? (
          // Boss HUD
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
             <div className="bg-cute-cream border-4 border-black p-1 relative shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="flex justify-between items-end mb-1 px-1">
                    <span className="font-pixel text-xs font-bold text-black">PROF. SCHULICH</span>
                    <span className="font-pixel text-[10px] text-black">LVL 99</span>
                </div>
                <div className="w-full h-6 bg-gray-800 p-1 border-2 border-black">
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300" 
                        style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
                    ></div>
                </div>
             </div>
          </div>
      ) : (
          <CuteMeter points={points} />
      )}
      
      <FloatingHearts />
      
      {/* UI Stickers */}
      <Sticker type="bear" position="bottom-left" onClick={() => addPoints(5)} />
      <Sticker type="bunny" position="top-right" onClick={() => addPoints(5)} />

      {/* --- GAME LAYER --- */}
      {(state === 'game' || state === 'boss_fight') && (
          <div className="fixed inset-0 z-40 overflow-hidden touch-none">
              {/* Boss Sprite */}
              {state === 'boss_fight' && (
                <div 
                  className={`absolute z-20 transition-[top,left] ease-linear ${boss.hp <= 0 ? 'duration-[3000ms] ease-in-out' : 'duration-100'}`}
                  style={{ 
                    left: `${boss.x}%`, 
                    top: `${boss.y}%`, 
                    transform: boss.hp <= 0 ? 'translate(-50%, -50%) rotate(720deg) scale(0)' : 'translate(-50%, -50%)', 
                    opacity: boss.hp <= 0 ? 0 : 1
                  }}
                >
                  <div className={`relative flex items-center justify-center ${boss.isHit ? 'animate-shake' : boss.attackState === 'pop_quiz' ? 'animate-pulse' : 'animate-float'}`}>
                      {/* Orbiting Elements */}
                      <div className="absolute w-[180px] h-[180px] md:w-[240px] md:h-[240px] animate-spin-slow opacity-90 pointer-events-none">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl filter drop-shadow-md">📄</div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-4xl filter drop-shadow-md">F</div>
                          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl filter drop-shadow-md">📉</div>
                          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-4xl filter drop-shadow-md">0%</div>
                      </div>

                      {/* Main Boss Emoji */}
                      <div 
                        className={`text-8xl md:text-[10rem] leading-none filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all duration-75 ${
                            boss.isHit ? 'invert brightness-150 scale-95' : 'grayscale-0 scale-100'
                        }`}
                      >
                        {boss.hp <= 0 ? '😵' : '👨‍🏫'}
                      </div>
                  </div>

                  {/* Boss Speech Bubble */}
                  {boss.quote && boss.hp > 0 && (
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 bg-white border-4 border-black p-4 rounded-xl whitespace-nowrap font-pixel text-xs md:text-sm animate-pop-in z-50 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                      <span className="text-red-600 font-bold text-lg mr-2">!</span>
                      {boss.quote}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-black rotate-45"></div>
                    </div>
                  )}
                </div>
              )}

              {/* Boss Defeated Overlay */}
              {state === 'boss_fight' && boss.hp <= 0 && (
                <div className="fixed inset-0 flex items-center justify-center z-50 animate-pop-in" style={{ animationDelay: '500ms' }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 rotate-3 rounded-lg border-4 border-black translate-y-2 translate-x-2"></div>
                        <div className="relative bg-white border-4 border-black p-8 rounded-lg text-center transform -rotate-3">
                            <h2 className="font-pixel text-4xl text-green-600 mb-2">PROMOTION UNLOCKED!</h2>
                            <p className="font-hand text-2xl">Professor Defeated</p>
                        </div>
                    </div>
                </div>
              )}

              {/* Items */}
              {gameItems.map(item => (
                  <button
                      key={item.id}
                      onMouseDown={(e) => handleItemClick(item.id, item.type, item.x, item.y, e)}
                      onTouchStart={(e) => {
                          const touch = e.touches[0];
                          handleItemClick(item.id, item.type, touch.clientX, touch.clientY, e);
                      }}
                      style={{ 
                          left: item.x, 
                          top: item.y,
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  >
                      {/* Invisible hitbox */}
                      <div className="w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer"></div>
                      <div className="text-6xl md:text-7xl filter drop-shadow-md transition-transform group-hover:scale-110 active:scale-95 select-none">
                          {ITEM_CONFIG[item.type].emoji}
                      </div>
                  </button>
              ))}

              {/* Projectiles */}
              {projectiles.map(p => (
                 <div key={p.id} className="absolute text-4xl" style={{ left: p.x, top: p.y, transform: `scale(${p.scale})` }}>
                    {p.emoji}
                 </div>
              ))}

              {/* Boss Effects */}
              {bossEffects.map(p => (
                 <div key={p.id} className="absolute text-5xl font-bold font-pixel text-red-600 z-50 pointer-events-none" 
                      style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `rotate(${p.rotation}deg)` }}>
                    {p.emoji}
                 </div>
              ))}

              {/* Effects */}
              {popEffects.map(effect => (
                  <div 
                    key={effect.id}
                    style={{ left: effect.x, top: effect.y }}
                    className="absolute pointer-events-none z-50 flex flex-col items-center justify-center animate-pop-in"
                  >
                      <span className="text-4xl animate-bounce">{effect.emoji}</span>
                      {effect.text && <span className="text-red-600 font-pixel font-bold drop-shadow-white">{effect.text}</span>}
                  </div>
              ))}
          </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-30 min-h-screen flex flex-col items-center justify-center p-4 pointer-events-none">
        
        {state !== 'game' && state !== 'boss_fight' && (
        <div className={`pointer-events-auto w-full max-w-2xl bg-white/90 backdrop-blur-sm border-4 border-cute-pink shadow-[8px_8px_0_0_#ffe066] p-8 md:p-12 text-center transition-all duration-700 transform ${state === 'success' ? 'scale-105 border-cute-blue shadow-[8px_8px_0_0_#b5ead7]' : ''}`}>
          
          {/* Intro */}
          {state === 'intro' && (
            <div className="animate-pop-in">
              <h1 className="font-title text-5xl text-cute-pink mb-6">Hi {PARTNER_NICKNAME} ❤️</h1>
              <p className="font-hand text-2xl mb-8">I have a very important question for you today...</p>
              <button 
                onClick={startJourney}
                className="bg-cute-pink text-white font-pixel py-4 px-8 border-b-4 border-cute-maroon active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all rounded-lg animate-pulse-fast"
              >
                Start Adventure 🚀
              </button>
            </div>
          )}

          {/* Tutorial */}
          {state === 'tutorial' && (
             <div className="animate-pop-in text-left">
                <h2 className="font-pixel text-2xl text-center text-cute-maroon mb-6">HOW TO PLAY</h2>
                
                <div className="space-y-6 mb-8">
                    {/* Step 1 */}
                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg border-2 border-dashed border-cute-blue">
                        <div className="text-4xl animate-bounce">👆</div>
                        <div>
                            <h3 className="font-bold text-cute-maroon font-pixel text-xs mb-1">COLLECT STUFF</h3>
                            <p className="text-sm text-gray-700">Tap falling items to grab them!</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg border-2 border-dashed border-red-300">
                        <div className="text-4xl animate-pulse">🍵</div>
                        <div>
                            <h3 className="font-bold text-cute-maroon font-pixel text-xs mb-1">FIGHT THE BOSS</h3>
                            <p className="text-sm text-gray-700">Tap <span className="font-bold">falling items</span> to throw them at the Prof!</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button 
                    onClick={finishTutorial}
                    className="bg-cute-pink text-white font-pixel py-3 px-8 border-b-4 border-cute-maroon active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all rounded-lg"
                    >
                    GOT IT!
                    </button>
                    <div className="mt-4">
                        <button onClick={finishTutorial} className="text-xs text-gray-400 hover:text-cute-maroon underline">Skip Tutorial</button>
                    </div>
                </div>
             </div>
          )}

          {/* Game Intro */}
          {state === 'game_intro' && (
             <div className="animate-pop-in">
                <h2 className="font-pixel text-xl text-cute-maroon mb-6 leading-relaxed">
                   LEVEL 1: THE ESSENTIALS
                </h2>
                <div className="flex justify-center gap-4 text-4xl mb-8">
                    <span>🧋</span><span>🛍️</span><span>💄</span><span>🍟</span>
                </div>
                <p className="font-body mb-8">
                    Catch 3 of each item to proceed!
                </p>
                <button 
                  onClick={startGame}
                  className="bg-cute-yellow text-cute-maroon font-pixel py-3 px-6 border-b-4 border-orange-400 active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all rounded-lg"
                >
                  Start Level 1
                </button>
             </div>
          )}

          {/* Boss Intro */}
          {state === 'boss_intro' && (
             <div className="animate-pop-in border-4 border-black bg-red-50 p-6 rounded-xl shadow-[8px_8px_0_0_#000]">
                <h2 className="font-pixel text-xl text-red-600 mb-6 leading-relaxed animate-pulse">
                   ⚠️ WARNING ⚠️
                </h2>
                <div className="text-8xl mb-6 filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]">👨‍🏫</div>
                <h3 className="font-bold text-2xl mb-4">PROF. SCHULICH BLOCKS THE WAY!</h3>
                <p className="font-body mb-8">
                    "You didn't cite your sources properly!"<br/><br/>
                    <span className="font-bold text-green-600">Throw items at him to calm him down!</span>
                </p>
                <button 
                  onClick={startBoss}
                  className="bg-red-500 text-white font-pixel py-3 px-6 border-b-4 border-black active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all rounded-lg"
                >
                  FIGHT! ⚔️
                </button>
             </div>
          )}

          {/* The Question */}
          {state === 'question' && (
            <div className="animate-pop-in">
              <h1 className="font-title text-4xl md:text-5xl text-cute-pink mb-4 drop-shadow-sm">
                 Corporate Era Unlocked! 💼
              </h1>
              
              {/* Typewriter text for proposal */}
              <div className="min-h-[100px] mb-8 flex items-center justify-center">
                 <p className="font-hand text-2xl md:text-3xl leading-relaxed text-gray-700">
                    {typedText}
                 </p>
              </div>

              {storyIndex >= STORY_LINES.length && (
                  <div className="animate-pop-in">
                      <p className="font-bold text-xl mb-8 text-cute-maroon">Will you be my Valentine?</p>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative h-32 md:h-20">
                        <button
                          onClick={handleYesClick}
                          style={{ transform: `scale(${yesScale})` }}
                          className="bg-gradient-to-r from-cute-pink to-rose-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:shadow-xl z-20 flex items-center gap-2 whitespace-nowrap"
                        >
                          <i className="fas fa-heart animate-pulse"></i> Yes, absolutely!
                        </button>
                        
                        <button
                          onMouseEnter={handleNoInteraction}
                          onClick={handleNoInteraction}
                          style={{ transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)` }}
                          className="bg-gray-200 text-gray-500 font-bold py-3 px-8 rounded-full shadow transition-all hover:bg-gray-300 z-10 whitespace-nowrap absolute md:static"
                        >
                          {NO_MESSAGES[noClickCount % NO_MESSAGES.length]}
                        </button>
                      </div>
                  </div>
              )}
            </div>
          )}

          {/* Success Content */}
          {state === 'success' && (
            <div className="space-y-6 animate-pop-in relative">
              
              {/* Merger Stamp - Animated */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 animate-pop-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                 <div className="border-[6px] md:border-8 border-red-600 p-2 md:p-4 rounded-lg rotate-[-15deg] bg-white/30 backdrop-blur-sm">
                    <span className="text-4xl md:text-7xl font-black text-red-600 tracking-widest uppercase opacity-90 mix-blend-multiply whitespace-nowrap">
                        MERGER<br/>SUCCESSFUL
                    </span>
                 </div>
              </div>

              {/* Achievement Banner */}
              <div className="relative z-10 mb-8">
                <div className="absolute inset-0 bg-yellow-300 transform rotate-2 rounded-xl border-4 border-black translate-y-2 translate-x-2"></div>
                <div className="relative bg-white border-4 border-black p-6 rounded-xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">💍</div>
                    <h2 className="font-pixel text-sm text-gray-500 mb-2 tracking-widest uppercase">New Status Acquired</h2>
                    <h1 className="font-black text-3xl md:text-5xl text-cute-maroon leading-tight mb-2">
                        CORPORATE BADDIE<br/>
                        <span className="text-cute-pink">& WIFE</span><br/>
                    </h1>
                    <div className="flex justify-center gap-4 text-3xl mt-4">
                        <span className="animate-bounce">💼</span>
                        <span className="animate-bounce delay-100">💅</span>
                        <span className="animate-bounce delay-200">💍</span>
                        <span className="animate-bounce delay-300">📈</span>
                    </div>
                </div>
              </div>

              {/* Double Gallery: ID Card + "Us at 16" Memory */}
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-6 mb-8">

                  {/* "Us at 16" Memory Polaroid - Now the main focus */}
                  <div className="relative group hover:z-20">
                       <div className="absolute -top-3 -right-3 bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded border-2 border-purple-800 transform rotate-12 z-20 shadow-sm">DAY ONES 🤞</div>
                       <div className="bg-white p-3 pb-12 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border border-gray-200 w-64 rotate-[3deg] transition-transform hover:rotate-0 duration-300 relative hover:scale-105">
                           <div className="w-full h-80 bg-gray-100 overflow-hidden border border-gray-100 relative">
                               <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
                               <img 
                                 src="./us_at_16.jpg" 
                                 alt="Us at 16" 
                                 className="w-full h-full object-cover grayscale-[0.2] contrast-110" 
                               />
                           </div>
                           <div className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl text-gray-700">
                               Us @ 16... 😂❤️
                           </div>
                           {/* Masking Tape effect */}
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/50 rotate-[-1deg] backdrop-blur-sm border-l border-r border-white/80 shadow-sm opacity-90 transform skew-x-12"></div>
                       </div>
                  </div>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="mt-8 text-gray-400 hover:text-cute-pink transition-colors text-sm underline"
              >
                Replay?
              </button>
            </div>
          )}

        </div>
        )}
      </main>
    </div>
  );
};

export default App;