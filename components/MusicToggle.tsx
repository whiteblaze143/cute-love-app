import React, { useState, useRef, useEffect } from 'react';

const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Lazy init audio
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-love-of-my-life-1031.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("User interaction required", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className={`fixed top-4 left-4 z-50 w-12 h-12 rounded-lg border-2 border-cute-yellow flex items-center justify-center transition-all shadow-md ${
        isPlaying ? 'bg-cute-pink text-white border-cute-pink' : 'bg-cute-cream text-cute-maroon'
      }`}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      title="Toggle Background Music"
    >
      {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-music"></i>}
    </button>
  );
};

export default MusicToggle;
