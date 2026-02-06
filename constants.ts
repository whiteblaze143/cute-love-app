import { StoryLine, ItemType } from "./types";

export const PARTNER_NAME = "Joanna";
export const PARTNER_NICKNAME = "Joji";
export const YOUR_NAME = "Mithun";

// Game Configuration
export const TARGET_SCORE = 3; // How many of each item to collect in phase 1
export const BOSS_MAX_HP = 100;

export const ITEM_CONFIG: Record<ItemType, { emoji: string; label: string; color: string }> = {
  boba: { emoji: '🧋', label: 'Boba', color: '#e5d0b1' },
  shopping: { emoji: '🛍️', label: 'Shopping', color: '#ff99c8' },
  makeup: { emoji: '💄', label: 'Makeup', color: '#ff4d4d' },
  food: { emoji: '🍟', label: 'Snacks', color: '#ffcc00' },
  matcha: { emoji: '🍵', label: 'Matcha', color: '#b7e3cc' },
};

export const WEAPON_STATS: Record<ItemType, { speed: number; damage: number; scale: number }> = {
  matcha: { speed: 15, damage: 10, scale: 1 },
  boba: { speed: 20, damage: 8, scale: 1 },
  shopping: { speed: 6, damage: 25, scale: 1.8 }, // Slow, Big, Heavy Damage
  makeup: { speed: 28, damage: 5, scale: 0.8 },   // Fast, Small, Low Damage
  food: { speed: 12, damage: 15, scale: 1.2 }     // Balanced
};

export const STORY_LINES: StoryLine[] = [
  { text: "Professor Schulich has been handled. 💅" },
  { text: "School is officially out. The Corporate Era begins." },
  { text: "You have unlocked the 'Ultimate Boss Babe' status." },
  { text: "But there is one final offer on the table..." },
];

export const GAME_INTRO_LINES = [
  "Wait! Before we continue...",
  "To be my Valentine, you must prove you have the essentials!",
  "Collect 3 of each of your favorite things to proceed!",
];

export const BOSS_QUOTES = [
  "Is this citation correct?!",
  "Group project due tomorrow!",
  "Read the syllabus!",
  "Participation grade: 0!",
  "I'm failing everyone!",
  "Where is your thesis?!",
  "No late submissions!",
];

export const BOSS_ATTACK_QUOTES = {
  slam: ["SYLLABUS SLAM!", "READ CHAPTER 5!", "QUIET PLEASE!"],
  quiz: ["POP QUIZ!", "SURPRISE EXAM!", "PENCILS DOWN!"]
};

export const NO_MESSAGES = [
  "HR will hear about this...",
  "Think about your career!",
  "Did your finger slip?",
  "Let's circle back...",
  "This button is broken!",
  "Try the other button! 😉",
  "I think you meant Yes!",
  "Our future plans depend on this!",
  "Pretty please?",
  "Final answer?",
];

export const REASONS = [
  "You're a total boss babe (Corporate Baddie status! 💼)",
  "Your style is unmatched (Office siren vibes 👠)",
  "You work hard, but love harder",
  "You make every day feel like a winning deal",
  "You are simply the CEO of my life"
];