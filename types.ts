export type AppState = 'intro' | 'tutorial' | 'game_intro' | 'game' | 'boss_intro' | 'boss_fight' | 'question' | 'success';

export interface StickerProps {
  type: 'bear' | 'bunny';
  position: 'top-right' | 'bottom-left';
  onClick: () => void;
}

export interface FloatingElement {
  id: number;
  x: number;
  y: number;
  content: string;
  size: number;
  animationDuration: number;
  delay: number;
}

export interface StoryLine {
  text: string;
  delay?: number;
}

export type ItemType = 'boba' | 'shopping' | 'makeup' | 'food' | 'matcha';

export interface GameItem {
  id: number;
  type: ItemType;
  x: number;
  startX: number; // For sine wave calculation
  y: number;
  speed: number;
  wobbleSpeed: number; // How fast it sways
  wobbleDistance: number; // How wide it sways
}

export interface Inventory {
  boba: number;
  shopping: number;
  makeup: number;
  food: number;
}

export interface PopEffect {
  id: number;
  x: number;
  y: number;
  emoji: string;
  text?: string;
}

export type BossAttackType = 'idle' | 'syllabus_slam' | 'pop_quiz';

export interface Boss {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  isHit: boolean;
  quote: string | null;
  attackState: BossAttackType;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  emoji: string;
  damage: number;
  scale: number;
}

export interface BossEffect {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  rotation: number;
}