// Share button logic
// DEBUG: lightweight runtime checks to surface errors and ensure interactivity during local dev.
// Toggle visual debug outlines with Ctrl+Shift+D
(function _debugInit(){
  window.addEventListener('error', e => {
    console.error('Runtime error (captured):', e.message, e.filename + ':' + e.lineno);
    const dbg = document.getElementById('dev-debug-panel') || (function(){
      const p = document.createElement('div');
      p.id = 'dev-debug-panel';
      p.style.position='fixed';
      p.style.right='12px';
      p.style.top='12px';
      p.style.zIndex='9999';
      p.style.background='rgba(0,0,0,0.6)';
      p.style.color='#fff';
      p.style.padding='8px 10px';
      p.style.fontSize='12px';
      p.style.borderRadius='8px';
      p.style.fontFamily='monospace';
      document.body.appendChild(p);
      return p;
    })();
    dbg.textContent = 'JS error: ' + e.message;
  });
  window.addEventListener('DOMContentLoaded', () => {
    // add debug outlines but do NOT change pointer-events unless debug is toggled by the developer
    ['.animal-sticker', '.floating-hearts .heart', '.btn', '#main-card', '#buttons'].forEach(s => {
      document.querySelectorAll(s).forEach(el => el.classList?.add('debug-interactive-outline'));
    });
    console.log('DEBUG: checked interactive elements:', {
      shareBtn: !!document.getElementById('share-btn'),
      yesBtn: !!document.getElementById('yes-btn'),
      noBtn: !!document.getElementById('no-btn'),
      hearts: document.querySelectorAll('.floating-hearts .heart').length
    });
  });

  // When debug outlines are toggled on, also enable pointer interactions for elements that were intentionally decorative
  const _toggleDebugPointerEvents = (on) => {
    const sel = ['.animal-sticker', '.floating-hearts .heart'];
    sel.forEach(s => document.querySelectorAll(s).forEach(el => el.style.pointerEvents = on ? 'auto' : ''));
  };
  window.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() === 'd') {
      const on = document.body.classList.toggle('show-debug-outlines');
      _toggleDebugPointerEvents(on);
      console.log('DEBUG: toggled outlines');
    }
  });
  window.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() === 'd') {
      document.body.classList.toggle('show-debug-outlines');
      console.log('DEBUG: toggled outlines');
    }
  });
})();
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Cuteness Overload!', url });
            } catch {}
        } else {
            try {
                await navigator.clipboard.writeText(url);
                shareBtn.textContent = 'Link copied!';
                setTimeout(() => shareBtn.textContent = 'Share this cuteness!', 1800);
            } catch {}
        }
    });
}
// Animate pixel stickers to wave/jump
setInterval(() => {
    const bear = document.querySelector('.bear-sticker');
    const bunny = document.querySelector('.bunny-sticker');
    if (bear && Math.random() < 0.5) {
        bear.classList.add('wave');
        setTimeout(() => bear.classList.remove('wave'), 700);
    }
    if (bunny && Math.random() < 0.5) {
        bunny.classList.add('jump');
        setTimeout(() => bunny.classList.remove('jump'), 500);
    }
}, 3500);
// Retro pixel sound effects
function playPixelSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === 'coin') {
        o.type = 'square'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.12, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.18);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        o.start(); o.stop(ctx.currentTime + 0.18);
    } else if (type === 'boop') {
        o.type = 'triangle'; o.frequency.value = 440;
        g.gain.setValueAtTime(0.09, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.13);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.13);
        o.start(); o.stop(ctx.currentTime + 0.13);
    }
}
// Cute points logic
let cutePoints = 0;
function addCutePoints(n = 1) {
        playPixelSound('coin');
    cutePoints += n;
    const el = document.getElementById('cute-points');
    if (el) el.textContent = cutePoints;
}

// Make animal popups clickable for points
document.addEventListener('click', (e) => {
        if (e.target.classList.contains('heart')) {
            playPixelSound('boop');
        }
    if (e.target.classList.contains('animal-popup')) {
        addCutePoints(5);
        // Animate popup for feedback
        e.target.style.transform += ' scale(1.3)';
        setTimeout(() => e.target.remove(), 300);
    }
});
// Random animal popup logic
function popupAnimal() {
    const animals = [
        {emoji: '🧸', side: 'left'},
        {emoji: '🐰', side: 'right'}
    ];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const popup = document.createElement('div');
    popup.className = 'animal-popup';
    popup.textContent = animal.emoji;
    popup.style.position = 'fixed';
    popup.style.zIndex = 30;
    popup.style.fontSize = '54px';
    popup.style.opacity = '0';
    popup.style.transition = 'all 0.7s cubic-bezier(.22,1.5,.36,1)';
    if (animal.side === 'left') {
        popup.style.left = '0px';
        popup.style.bottom = `${Math.random() * 60 + 40}px`;
    } else {
        popup.style.right = '0px';
        popup.style.top = `${Math.random() * 60 + 40}px`;
    }
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateX(32px) scale(1.08)';
    }, 80);
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateX(0) scale(1)';
        setTimeout(() => popup.remove(), 700);
    }, 3200);
}

setInterval(() => {
    if (Math.random() < 0.22) popupAnimal();
}, 6000);
// Compliment/tip messages for inactivity
const tipMessages = [
    "You make every day brighter! ✨",
    "Your smile is pure magic!",
    "You deserve all the hugs in the world!",
    "You are loved, always.",
    "You make ordinary moments extraordinary!",
    "You’re as huggable as a teddy bear! 🧸",
    "You’re as sweet as a bunny! 🐰",
    "If cuteness were a contest, you’d win paws down!",
    "You’re a cuddle champion! 🧸🐰"
];

let tipTimeout;
function showFloatingTip() {
    // Remove any existing tip
    const oldTip = document.querySelector('.floating-tip');
    if (oldTip) oldTip.remove();
    // Create new tip
    const tip = document.createElement('div');
    tip.className = 'floating-tip';
    tip.textContent = tipMessages[Math.floor(Math.random() * tipMessages.length)];
    document.body.appendChild(tip);
    setTimeout(() => {
        tip.style.opacity = '0';
        tip.style.transform = 'translateY(40px) scale(0.95)';
        setTimeout(() => tip.remove(), 700);
    }, 4200);
}

function resetTipTimeout() {
    clearTimeout(tipTimeout);
    tipTimeout = setTimeout(showFloatingTip, 9000);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetTipTimeout);
});
resetTipTimeout();
// Cursor-following sparkle/heart trail (rAF-throttled, pauses when tab is hidden)
let _trailQueued = false;
let _lastTrail = 0;
let _lastMousePos = { x: 0, y: 0 };
function _trailRAF() {
    _trailQueued = false;
    const now = performance.now();
    if (document.hidden) return; // pause when not visible
    if (now - _lastTrail > 22) {
        createSparkle(_lastMousePos.x, _lastMousePos.y);
        _lastTrail = now;
    }
}
document.addEventListener('mousemove', (e) => {
    _lastMousePos.x = e.clientX;
    _lastMousePos.y = e.clientY;
    if (!_trailQueued) {
        _trailQueued = true;
        requestAnimationFrame(_trailRAF);
    }
});

// Keyboard activation for focusable interactive elements (hearts, stickers, popups)
document.addEventListener('keydown', (ev) => {
    const active = document.activeElement;
    if (!active) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
        if (active.classList.contains('heart') || active.classList.contains('animal-sticker') || active.classList.contains('animal-popup') || active.classList.contains('polaroid-img')) {
            ev.preventDefault();
            active.click();
        }
    }
});

// Shared, lazy AudioContext to avoid creating many contexts and to allow resume on user gesture
let _sharedAudioCtx = null;
function getAudioCtx() {
    if (!_sharedAudioCtx) {
        _sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // resume on first user gesture if suspended
        const resumeIfNeeded = () => {
            if (_sharedAudioCtx.state === 'suspended') _sharedAudioCtx.resume().catch(()=>{});
            window.removeEventListener('pointerdown', resumeIfNeeded);
            window.removeEventListener('keydown', resumeIfNeeded);
        };
        window.addEventListener('pointerdown', resumeIfNeeded, { once: true });
        window.addEventListener('keydown', resumeIfNeeded, { once: true });
    }
    return _sharedAudioCtx;
}

// Update sound functions to reuse shared audio context
function playPixelSound(type) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === 'coin') {
        o.type = 'square'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.12, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.18);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        o.start(); o.stop(ctx.currentTime + 0.18);
    } else if (type === 'boop') {
        o.type = 'triangle'; o.frequency.value = 440;
        g.gain.setValueAtTime(0.09, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.13);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.13);
        o.start(); o.stop(ctx.currentTime + 0.13);
    }
}

// reuse audio context in playSound too
function playSound(type) {
    const audioContext = getAudioCtx();
    if (!audioContext) return;
    if (type === 'click') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'celebrate') {
        // small melody
        playPixelSound('coin');
        setTimeout(() => playPixelSound('boop'), 90);
        setTimeout(() => playPixelSound('coin'), 160);
    }
}
// Confetti burst logic
const confettiColors = ['#ffe066', '#ffb3d1', '#ffafbd', '#b5ead7', '#c7ceea', '#fffbe7', '#ff4d8d'];
function burstConfettiAtElement(el, count = 18) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < count; i++) {
        createConfetti(x, y);
    }
}

function createConfetti(x, y) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.left = `${x + (Math.random() - 0.5) * 80}px`;
    confetti.style.top = `${y + (Math.random() - 0.5) * 30}px`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.width = `${8 + Math.random() * 8}px`;
    confetti.style.height = confetti.style.width;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1300);
}
// Sparkle/star/animal unicode options for cuteness
const sparkleChars = ['✨', '🌟', '💫', '⭐', '🧸', '🐰'];

// Create a sparkle at (x, y) in viewport
function createSparkle(x, y) {
    const container = document.querySelector('.floating-sparkles');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    sparkle.style.left = `${x - 10 + Math.random() * 20}px`;
    sparkle.style.top = `${y - 10 + Math.random() * 20}px`;
    sparkle.style.fontSize = `${16 + Math.random() * 16}px`;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2200);
}

// Burst sparkles at a DOM element (centered)
function burstSparklesAtElement(el, count = 7) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < count; i++) {
        createSparkle(x + Math.random() * 40 - 20, y + Math.random() * 20 - 10);
    }
}

// Personalization - CHANGE THESE!
const partnerName = "Joanna";  // Her name
const partnerNickname = "Joji";  // Her nickname
const yourName = "Mithun";  // Your name

// Personalized story lines - Customize these with your memories!
const storyLines = [
    `Hey ${partnerName}, can we talk for a second?`,
    `I was just thinking about that time we went to Cuba for an all-inclusive vacation.`,
    `Remember how we got a little too excited and almost missed our flight?`,
    `Somehow those moments turned into you being my favorite part of every single day.`,
    `You make even the most ordinary things feel extraordinary.`,
    `So I have a very important question for you...`,
    `Will you be my Valentine this year, and every year after?`
];

// Funny "No" button responses
const noMessages = [
    "Wait, that can't be right...",
    "Are you absolutely sure?",
    "Did your finger slip?",
    "Let's think about our Cuba adventure again...",
    "This button isn't working properly!",
    "Try the other button, maybe?",
    "I think you meant to click Yes 😉",
    "Our future plans would be sad!",
    "Remember how amazing that trip was?",
    "Okay, I'll ask again tomorrow!",
    "Final chance to change your mind!"
];

// Reasons why she's amazing - Customize these!
const reasons = [
    "Your smile is my favorite thing in the world",
    "You make ordinary moments feel special",
    "You believe in me even when I doubt myself",
    "Your laugh could power a small city",
    "Your commitment to our relationship inspires me every day"
];

// DOM Elements
const storyText = document.getElementById('story-text');
const cursor = document.querySelector('.cursor');
const buttons = document.getElementById('buttons');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const mainCard = document.getElementById('main-card');
const successCard = document.getElementById('success-card');
const replayBtn = document.getElementById('replay-btn');
const nicknameSpan = document.querySelector('.nickname');
const signature = document.querySelector('.signature');
const backgroundMusic = document.getElementById('background-music');

// State variables
let currentLine = 0;
let charIndex = 0;
let isTyping = true;
let noClickCount = 0;
let yesSize = 1;

// Initialize
function init() {
    nicknameSpan.textContent = partnerNickname;
    signature.textContent = yourName;
    
    // Start with gentle music (optional - user interaction required for autoplay)
    backgroundMusic.volume = 0.3;
    
    // Music toggle control (accessible)
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(()=>{});
                musicToggle.setAttribute('aria-pressed','true');
                musicToggle.setAttribute('aria-label','Pause background music');
            } else {
                backgroundMusic.pause();
                musicToggle.setAttribute('aria-pressed','false');
                musicToggle.setAttribute('aria-label','Play background music');
            }
        });
        musicToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); musicToggle.click(); }
        });
    }

    // Start the story
    setTimeout(() => {
        typeNextLine();
    }, 1000);
    
    // Add event listeners
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    replayBtn.addEventListener('click', resetExperience);
    
    // Optional: Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'y' || e.key === 'Y') handleYesClick();
        if (e.key === 'n' || e.key === 'N') handleNoClick();
    });

    // (diagnostic overlay removed in production build) - nothing to do here
}

// Typewriter effect
function typeNextLine() {
    if (currentLine >= storyLines.length) {
        showButtons();
        return;
    }

    if (charIndex < storyLines[currentLine].length) {
        storyText.textContent += storyLines[currentLine].charAt(charIndex);
        charIndex++;
        setTimeout(typeNextLine, 50 + Math.random() * 30); // Natural typing speed
    } else {
        // Line complete, bounce the cursor
        cursor.classList.add('bounce');
        setTimeout(() => {
            cursor.classList.remove('bounce');
            // Line complete, wait then move to next line
            charIndex = 0;
            currentLine++;
            if (currentLine < storyLines.length) {
                setTimeout(() => {
                    storyText.textContent = '';
                    typeNextLine();
                }, 1500);
            } else {
                setTimeout(showButtons, 1000);
            }
        }, 380);
    }
}

// Show buttons with animation
function showButtons() {
    buttons.style.display = 'flex';
    setTimeout(() => {
        buttons.style.opacity = '1';
        buttons.style.transform = 'translateY(0)';
    }, 100);
    
    // Start heartbeat animation
    cursor.style.animation = 'none';
    cursor.style.opacity = '0';
}

// Handle "No" button click
function handleNoClick() {
    // Cycle through messages
    const message = noMessages[noClickCount % noMessages.length];
    noBtn.innerHTML = `<i class="fas fa-question"></i> ${message}`;
    
    // Make "Yes" button grow and bounce
    yesSize += 0.3;
    yesBtn.style.transform = `scale(${yesSize})`;
    yesBtn.style.transition = 'transform 0.3s cubic-bezier(.4,1.4,.6,1)';
    yesBtn.classList.add('btn-bounce-quick');
    setTimeout(() => yesBtn.classList.remove('btn-bounce-quick'), 250);

    // Move "No" button randomly and wiggle
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = (Math.random() - 0.5) * 50;
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    noBtn.classList.add('btn-wiggle-quick');
    setTimeout(() => {
        noBtn.style.transform = 'translate(0, 0)';
        noBtn.classList.remove('btn-wiggle-quick');
    }, 350);
    
    // Play sound effect
    playSound('click');
    
    noClickCount++;
    
    // If they've clicked "No" many times, make Yes button really big
    if (noClickCount >= 5) {
        yesBtn.style.fontSize = `${1.2 + (noClickCount * 0.1)}rem`;
    }

    // Sparkle burst on No click
    burstSparklesAtElement(noBtn, 5);
}

// Handle "Yes" button click
function handleYesClick() {
    // Play celebration sound
    playSound('celebrate');
    
    // Start background music
    backgroundMusic.play().catch(e => {
        console.log("Autoplay prevented - user interaction needed");
    });
    
    // Animate the "Yes" button
    yesBtn.innerHTML = '<i class="fas fa-heart"></i> YAY! ❤️';
    yesBtn.style.animation = 'pulse 0.5s 3';
    
    // Confetti burst!
    burstConfettiAtElement(yesBtn, 22);

    // Hide main card and show success card
    setTimeout(() => {
        mainCard.style.opacity = '0';
        mainCard.style.transform = 'scale(0.9)';

        setTimeout(() => {
            mainCard.style.display = 'none';
            successCard.style.display = 'block';

            // Animate in the success content
            setTimeout(() => {
                successCard.style.opacity = '1';
                successCard.style.transform = 'translateY(0)';

                // Start showing reasons one by one
                animateReasons();
                // Sparkle burst on success card reveal
                burstSparklesAtElement(successCard, 10);
            }, 100);
        }, 500);
    }, 1000);
}

// Animate reasons list
function animateReasons() {
    const reasonItems = document.querySelectorAll('.reasons-list li');
    reasonItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated');
        }, index * 260);
    });
}

// Reset the experience
function resetExperience() {
    // Reset all states
    currentLine = 0;
    charIndex = 0;
    noClickCount = 0;
    yesSize = 1;
    
    // Reset elements
    storyText.textContent = '';
    yesBtn.innerHTML = '<i class="fas fa-heart"></i> Yes, absolutely!';
    yesBtn.style.transform = 'scale(1)';
    yesBtn.style.fontSize = '1.2rem';
    noBtn.innerHTML = '<i class="fas fa-question"></i> Umm, let me think...';
    noBtn.style.transform = 'translate(0, 0)';
    
    // Hide success card, show main card
    successCard.style.opacity = '0';
    successCard.style.transform = 'translateY(30px)';

    setTimeout(() => {
        successCard.style.display = 'none';
        mainCard.style.display = 'block';
        mainCard.classList.add('entrance');

        setTimeout(() => {
            mainCard.classList.remove('entrance');
            mainCard.style.opacity = '1';
            mainCard.style.transform = 'scale(1)';
            buttons.style.opacity = '0';
            buttons.style.transform = 'translateY(20px)';
            buttons.style.display = 'none';
            cursor.style.animation = 'blink 1s infinite';
            cursor.style.opacity = '1';

            // Restart the story
            setTimeout(() => {
                typeNextLine();
            }, 500);
        }, 900);
    }, 500);
}

// Sound effects
function playSound(type) {
    // Simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'click') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Add floating hearts dynamically
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const heartCount = 15;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        // Randomly use bear, bunny, or heart
        const heartEmojis = ['❤️', '🧸', '🐰'];
        heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        const size = Math.random() * 20 + 16;
        heart.style.fontSize = `${size}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.setProperty('--drift-duration', `${8 + Math.random() * 7}s`);
        heart.style.setProperty('--drift-x', `${Math.random() * 80 - 40}px`);
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.setAttribute('draggable', 'true');
        heart.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'heart');
            setTimeout(() => heart.style.opacity = '0.3', 0);
        });
        heart.addEventListener('dragend', (e) => {
            heart.style.opacity = '0.22';
        });
        container.appendChild(heart);

        // Occasionally pop a heart with sparkles
        if (Math.random() < 0.33) {
            setTimeout(() => {
                heart.style.animation = 'heart-pop 0.7s cubic-bezier(.7,1.7,.5,1) forwards';
                // Sparkle burst at heart position
                const rect = heart.getBoundingClientRect();
                createSparkle(rect.left + size/2, rect.top + size/2);
                setTimeout(() => heart.remove(), 700);
            }, 4000 + Math.random() * 4000);
        }
    }

    // Make photo frame droppable
    const photoFrame = document.querySelector('.polaroid-img');
    if (photoFrame) {
        photoFrame.addEventListener('dragover', (e) => {
            e.preventDefault();
            photoFrame.classList.add('drop-hover');
        });
        photoFrame.addEventListener('dragleave', (e) => {
            photoFrame.classList.remove('drop-hover');
        });
        photoFrame.addEventListener('drop', (e) => {
            e.preventDefault();
            photoFrame.classList.remove('drop-hover');
            addCutePoints(10);
            createSparkle(e.clientX, e.clientY);
        });
    }
}

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', () => {
    // small boot flag used by the diagnostic overlay


    // Animate main card entrance
    mainCard.classList.add('entrance');
    setTimeout(() => {
        mainCard.classList.remove('entrance');
        init();
        createFloatingHearts();
        // Occasional random sparkles for background cuteness
        setInterval(() => {
            const w = window.innerWidth, h = window.innerHeight;
            createSparkle(Math.random() * w, Math.random() * h * 0.7 + 30);
        }, 1800);

        // mark successful boot so diagnostics don't show

    }, 900);
});