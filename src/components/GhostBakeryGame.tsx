import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, Sparkles, Heart, Play, Flame, Download } from 'lucide-react';

interface GhostBakeryGameProps {
  onOpenCodeModal?: () => void;
}

export const GhostBakeryGame: React.FC<GhostBakeryGameProps> = ({ onOpenCodeModal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('neon_ghost_high_score') || '0', 10);
  });
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);
  const [overdriveRemaining, setOverdriveRemaining] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showOverdriveBanner, setShowOverdriveBanner] = useState<boolean>(false);

  // References for Animation Frame loop & mutable state
  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    lives: 3,
    combo: 0,
    highestCombo: 0,
    highScore: 0,
    isOverdrive: false,
    overdriveTimer: 0,
    keys: { left: false, right: false },
    lastTimestamp: 0,
    spawnTimer: 0,
    shakeDuration: 0,
    shakeIntensity: 0,
    items: [] as any[],
    particles: [] as any[],
    popups: [] as any[],
    player: {
      x: 300,
      y: 650,
      width: 76,
      speed: 520,
      wobble: 0,
      blinkTimer: 2.5,
      isBlinking: false,
    },
    bgSparks: Array.from({ length: 24 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 800,
      r: Math.random() * 2.5 + 1,
      speed: Math.random() * 25 + 10,
      opacity: Math.random() * 0.4 + 0.15,
    })),
  });

  // Keep stateRef synced with high score
  useEffect(() => {
    stateRef.current.highScore = highScore;
  }, [highScore]);

  // Web Audio Synthesizer
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSound = useCallback((type: 'catch' | 'overdrive' | 'hurt' | 'gameover') => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    if (type === 'catch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'overdrive') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    } else if (type === 'hurt') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'gameover') {
      const notes = [392, 349.23, 329.63, 261.63];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.14;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    }
  }, [soundEnabled, initAudio]);

  // Drawing routines
  const drawCupcake = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowColor = '#ff2d95';
    ctx.shadowBlur = 14;

    // Cup
    ctx.fillStyle = '#ff85b8';
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(14, 2);
    ctx.lineTo(10, 18);
    ctx.lineTo(-10, 18);
    ctx.closePath();
    ctx.fill();

    // Frosting swirl
    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.arc(-7, -2, 10, 0, Math.PI * 2);
    ctx.arc(7, -2, 10, 0, Math.PI * 2);
    ctx.arc(0, -9, 9, 0, Math.PI * 2);
    ctx.fill();

    // Cherry sparkle
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -18, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDonut = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowColor = '#ff3399';
    ctx.shadowBlur = 14;

    // Dough
    ctx.fillStyle = '#ffe0cc';
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fill();

    // Pink Icing
    ctx.fillStyle = '#ff2d95';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Hole
    ctx.fillStyle = '#14071d';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Sprinkles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -8, 4, 2);
    ctx.fillRect(5, -6, 2, 4);
    ctx.fillRect(-2, 7, 4, 2);
    ctx.fillStyle = '#ffe600';
    ctx.fillRect(4, 5, 3, 2);
  };

  const drawBubblegum = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowColor = '#ff66c4';
    ctx.shadowBlur = 14;

    const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 18);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#ff80d0');
    grad.addColorStop(1, '#ff007f');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -6);
    ctx.lineTo(-1, -6);
    ctx.moveTo(-3, -8);
    ctx.lineTo(-3, -4);
    ctx.stroke();
  };

  const drawBomb = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowColor = '#c026d3';
    ctx.shadowBlur = 16;

    // Dark body
    const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, 20);
    grad.addColorStop(0, '#4a1d63');
    grad.addColorStop(0.6, '#1e0b2b');
    grad.addColorStop(1, '#08010d');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 2, 18, 0, Math.PI * 2);
    ctx.fill();

    // Spooky Face
    ctx.fillStyle = '#ff2df5';
    ctx.beginPath();
    ctx.arc(-6, 0, 3, 0, Math.PI * 2);
    ctx.arc(6, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(5, 8);
    ctx.strokeStyle = '#ff2df5';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fuse
    ctx.fillStyle = '#888';
    ctx.fillRect(-3, -18, 6, 4);

    // Fuse Spark
    ctx.fillStyle = '#ffe600';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -22, 4 + Math.sin(Date.now() * 0.02) * 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawGhost = (ctx: CanvasRenderingContext2D, px: number, py: number, wobble: number, isBlinking: boolean, isOverdriveActive: boolean) => {
    ctx.save();

    // Overdrive aura
    if (isOverdriveActive) {
      ctx.shadowColor = '#ff2d95';
      ctx.shadowBlur = 32;
      ctx.strokeStyle = 'rgba(255, 45, 149, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py - 10, 52 + Math.sin(wobble * 3) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    const floatY = py + Math.sin(wobble) * 6;

    // Tray
    ctx.shadowColor = isOverdriveActive ? '#ff69b4' : '#ff2d95';
    ctx.shadowBlur = 16;

    const trayGrad = ctx.createLinearGradient(px - 45, floatY - 26, px + 45, floatY - 26);
    trayGrad.addColorStop(0, '#ff71b8');
    trayGrad.addColorStop(0.5, '#ffffff');
    trayGrad.addColorStop(1, '#ff2d95');

    ctx.fillStyle = trayGrad;
    ctx.beginPath();
    ctx.roundRect(px - 42, floatY - 32, 84, 12, 6);
    ctx.fill();

    // Tray rim handles
    ctx.fillStyle = '#ffb6df';
    ctx.fillRect(px - 46, floatY - 30, 4, 8);
    ctx.fillRect(px + 42, floatY - 30, 4, 8);

    // Ghost body
    ctx.shadowColor = 'rgba(255, 105, 180, 0.7)';
    ctx.shadowBlur = 18;

    const ghostGrad = ctx.createLinearGradient(px - 30, floatY - 20, px + 30, floatY + 30);
    ghostGrad.addColorStop(0, '#ffffff');
    ghostGrad.addColorStop(0.6, '#ffe6f3');
    ghostGrad.addColorStop(1, '#ff99ce');

    ctx.fillStyle = ghostGrad;
    ctx.beginPath();
    ctx.arc(px, floatY - 6, 28, Math.PI, 0, false);
    ctx.lineTo(px + 28, floatY + 24);
    ctx.quadraticCurveTo(px + 20, floatY + 32 + Math.sin(wobble * 2) * 3, px + 10, floatY + 24);
    ctx.quadraticCurveTo(px, floatY + 32 - Math.sin(wobble * 2) * 3, px - 10, floatY + 24);
    ctx.quadraticCurveTo(px - 20, floatY + 32 + Math.sin(wobble * 2) * 3, px - 28, floatY + 24);
    ctx.closePath();
    ctx.fill();

    // Cheeks
    ctx.fillStyle = 'rgba(255, 45, 149, 0.5)';
    ctx.beginPath();
    ctx.ellipse(px - 16, floatY - 3, 6, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(px + 16, floatY - 3, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (isBlinking) {
      ctx.strokeStyle = '#2b0c36';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px - 10, floatY - 8, 4, Math.PI, 0);
      ctx.arc(px + 10, floatY - 8, 4, Math.PI, 0);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#22082b';
      ctx.beginPath();
      ctx.ellipse(px - 10, floatY - 8, 4.5, 6.5, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 10, floatY - 8, 4.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sparkles in eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 11, floatY - 10, 2, 0, Math.PI * 2);
      ctx.arc(px + 9, floatY - 10, 2, 0, Math.PI * 2);
      ctx.arc(px - 9, floatY - 6, 1, 0, Math.PI * 2);
      ctx.arc(px + 11, floatY - 6, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.fillStyle = '#ff2d95';
    ctx.beginPath();
    ctx.arc(px, floatY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Chef Hat
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 14, floatY - 36, 28, 5);

    ctx.beginPath();
    ctx.arc(px - 7, floatY - 44, 9, 0, Math.PI * 2);
    ctx.arc(px + 7, floatY - 44, 9, 0, Math.PI * 2);
    ctx.arc(px, floatY - 48, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff2d95';
    ctx.fillRect(px - 12, floatY - 37, 24, 3);

    ctx.restore();
  };

  // Start / Restart Game
  const handleStartGame = () => {
    initAudio();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    stateRef.current.isPlaying = true;
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.combo = 0;
    stateRef.current.highestCombo = 0;
    stateRef.current.isOverdrive = false;
    stateRef.current.overdriveTimer = 0;
    stateRef.current.items = [];
    stateRef.current.particles = [];
    stateRef.current.popups = [];
    stateRef.current.player.x = rect.width / 2;
    stateRef.current.lastTimestamp = 0;

    setScore(0);
    setLives(3);
    setCombo(0);
    setHighestCombo(0);
    setIsOverdrive(false);
    setOverdriveRemaining(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setShowOverdriveBanner(false);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game animation loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;

      if (canvas && s.isPlaying) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          const width = rect.width;
          const height = rect.height;

          // Resize canvas buffer if needed
          if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
          }

          ctx.save();
          ctx.resetTransform?.();
          ctx.scale(dpr, dpr);

          if (!s.lastTimestamp) s.lastTimestamp = timestamp;
          const dt = Math.min((timestamp - s.lastTimestamp) / 1000, 0.1);
          s.lastTimestamp = timestamp;

          // Shake
          if (s.shakeDuration > 0) {
            s.shakeDuration -= dt;
            const ox = (Math.random() - 0.5) * s.shakeIntensity * 2;
            const oy = (Math.random() - 0.5) * s.shakeIntensity * 2;
            ctx.translate(ox, oy);
          }

          // Player movement
          s.player.wobble += dt * 5;
          s.player.blinkTimer -= dt;
          if (s.player.blinkTimer <= 0) {
            s.player.isBlinking = !s.player.isBlinking;
            s.player.blinkTimer = s.player.isBlinking ? 0.15 : Math.random() * 3 + 2;
          }

          if (s.keys.left) s.player.x -= s.player.speed * dt;
          if (s.keys.right) s.player.x += s.player.speed * dt;
          s.player.x = Math.max(45, Math.min(width - 45, s.player.x));
          s.player.y = height - 70;

          // Overdrive Timer
          if (s.isOverdrive) {
            s.overdriveTimer -= dt;
            setOverdriveRemaining(Math.max(0, s.overdriveTimer));
            if (s.overdriveTimer <= 0) {
              s.isOverdrive = false;
              setIsOverdrive(false);
            }
          }

          // Spawn items
          s.spawnTimer += dt;
          const currentSpawnInterval = Math.max(0.45, 1.0 - s.score * 0.0008);
          if (s.spawnTimer >= currentSpawnInterval) {
            s.spawnTimer = 0;
            const rand = Math.random();
            let type = 'cupcake';
            if (rand < 0.22) type = 'bomb';
            else if (rand < 0.50) type = 'cupcake';
            else if (rand < 0.78) type = 'donut';
            else type = 'bubblegum';

            const baseSpeed = 180 + Math.min(s.score * 0.4, 240);
            s.items.push({
              type,
              x: Math.random() * (width - 80) + 40,
              y: -30,
              radius: 20,
              speedY: baseSpeed + Math.random() * 60,
              rot: 0,
              rotSpeed: (Math.random() - 0.5) * 4,
            });
          }

          // Render Background
          ctx.fillStyle = '#13061d';
          ctx.fillRect(0, 0, width, height);

          // Neon Bakery Shelves
          ctx.strokeStyle = 'rgba(255, 45, 149, 0.08)';
          ctx.lineWidth = 1.5;
          for (let y = 100; y < height; y += 140) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Floating background ambient sparks
          s.bgSparks.forEach((spark) => {
            spark.y -= spark.speed * dt;
            if (spark.y < 0) spark.y = height;
            ctx.fillStyle = '#ff2d95';
            ctx.globalAlpha = spark.opacity;
            ctx.beginPath();
            ctx.arc(spark.x % width, spark.y, spark.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1.0;

          // Update & Draw Items
          const trayTop = s.player.y - 32;
          const trayBottom = s.player.y - 18;
          const trayLeft = s.player.x - 45;
          const trayRight = s.player.x + 45;

          for (let i = s.items.length - 1; i >= 0; i--) {
            const item = s.items[i];
            item.y += item.speedY * dt;
            item.rot += item.rotSpeed * dt;

            // Collision check with tray
            const isCaught =
              item.y + item.radius >= trayTop &&
              item.y - item.radius <= trayBottom &&
              item.x >= trayLeft &&
              item.x <= trayRight;

            if (isCaught) {
              if (item.type === 'bomb') {
                // Hurt
                playSound('hurt');
                s.shakeIntensity = 12;
                s.shakeDuration = 0.35;
                s.lives--;
                s.combo = 0;
                setLives(s.lives);
                setCombo(0);

                for (let k = 0; k < 26; k++) {
                  const angle = Math.random() * Math.PI * 2;
                  const spd = Math.random() * 200 + 80;
                  s.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    color: '#c026d3',
                    life: 1.0,
                    size: Math.random() * 5 + 3,
                  });
                }

                s.popups.push({
                  text: '-1 NYAWA!',
                  x: item.x,
                  y: item.y,
                  color: '#ff3366',
                  life: 1.0,
                  isBig: true,
                });

                if (s.lives <= 0) {
                  s.isPlaying = false;
                  playSound('gameover');
                  setIsPlaying(false);
                  setIsGameOver(true);

                  if (s.score > s.highScore) {
                    s.highScore = s.score;
                    setHighScore(s.score);
                    localStorage.setItem('neon_ghost_high_score', s.score.toString());
                  }
                }
              } else {
                // Sweet Treat Caught!
                playSound('catch');
                s.combo++;
                if (s.combo > s.highestCombo) {
                  s.highestCombo = s.combo;
                  setHighestCombo(s.combo);
                }

                let basePoints = 15;
                if (item.type === 'cupcake') basePoints = 20;
                if (item.type === 'donut') basePoints = 25;
                if (item.type === 'bubblegum') basePoints = 15;

                const multiplier = s.isOverdrive ? 2 : 1;
                const gain = basePoints * multiplier;
                s.score += gain;

                setScore(s.score);
                setCombo(s.combo);

                // Particles
                for (let k = 0; k < 18; k++) {
                  const angle = Math.random() * Math.PI * 2;
                  const spd = Math.random() * 160 + 60;
                  s.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    color: Math.random() > 0.4 ? '#ff2d95' : '#ffb6df',
                    life: 1.0,
                    size: Math.random() * 4 + 2,
                  });
                }

                s.popups.push({
                  text: s.isOverdrive ? `+${gain} (2X!)` : `+${gain}`,
                  x: item.x,
                  y: item.y,
                  color: s.isOverdrive ? '#ffb6df' : '#ff2d95',
                  life: 1.0,
                  isBig: s.isOverdrive,
                });

                // Overdrive Trigger: 5 combo hits activates Overdrive
                if (s.combo > 0 && s.combo % 5 === 0) {
                  s.isOverdrive = true;
                  s.overdriveTimer = 5.0;
                  setIsOverdrive(true);
                  setOverdriveRemaining(5.0);
                  playSound('overdrive');
                  setShowOverdriveBanner(true);
                  setTimeout(() => setShowOverdriveBanner(false), 2200);

                  for (let k = 0; k < 30; k++) {
                    const angle = Math.random() * Math.PI * 2;
                    const spd = Math.random() * 220 + 80;
                    s.particles.push({
                      x: s.player.x,
                      y: s.player.y,
                      vx: Math.cos(angle) * spd,
                      vy: Math.sin(angle) * spd,
                      color: '#ff2d95',
                      life: 1.2,
                      size: Math.random() * 5 + 3,
                    });
                  }
                }
              }

              s.items.splice(i, 1);
              continue;
            }

            // Missed bottom
            if (item.y > height + 40) {
              if (item.type !== 'bomb') {
                s.combo = 0;
                setCombo(0);
              }
              s.items.splice(i, 1);
              continue;
            }

            // Draw Item
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rot);
            if (item.type === 'cupcake') drawCupcake(ctx);
            else if (item.type === 'donut') drawDonut(ctx);
            else if (item.type === 'bubblegum') drawBubblegum(ctx);
            else if (item.type === 'bomb') drawBomb(ctx);
            ctx.restore();
          }

          // Update & Draw Particles
          for (let i = s.particles.length - 1; i >= 0; i--) {
            const p = s.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 60 * dt;
            p.life -= 1.4 * dt;
            if (p.life <= 0) {
              s.particles.splice(i, 1);
            } else {
              ctx.save();
              ctx.globalAlpha = Math.max(0, p.life);
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          // Draw Ghost Baker
          drawGhost(ctx, s.player.x, s.player.y, s.player.wobble, s.player.isBlinking, s.isOverdrive);

          // Update & Draw Popups
          for (let i = s.popups.length - 1; i >= 0; i--) {
            const pop = s.popups[i];
            pop.y -= 45 * dt;
            pop.life -= 1.3 * dt;
            if (pop.life <= 0) {
              s.popups.splice(i, 1);
            } else {
              ctx.save();
              ctx.globalAlpha = Math.max(0, pop.life);
              ctx.fillStyle = pop.color;
              ctx.shadowColor = pop.color;
              ctx.shadowBlur = 10;
              ctx.font = pop.isBig ? 'bold 20px "Outfit", sans-serif' : 'bold 15px "Outfit", sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(pop.text, pop.x, pop.y);
              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playSound]);

  // Touch / Pointer controls on canvas
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current.isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.player.x = Math.max(45, Math.min(rect.width - 45, x));
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    handleCanvasPointerDown(e);
  };

  return (
    <div className="relative w-full max-w-[560px] h-[780px] max-h-[92vh] bg-[#14071d] rounded-2xl border-3 border-[#ff2d95] shadow-[0_0_25px_rgba(255,45,149,0.5),inset_0_0_20px_rgba(255,45,149,0.2)] flex flex-col overflow-hidden select-none">
      {/* Overdrive Glowing Screen Border Aura */}
      <div
        id="overdrive-aura"
        className={`absolute inset-0 pointer-events-none rounded-2xl z-10 transition-opacity duration-300 ${
          isOverdrive ? 'opacity-100 animate-pulse shadow-[inset_0_0_60px_#ff2d95,inset_0_0_100px_#ff71b8]' : 'opacity-0'
        }`}
      />

      {/* Overdrive Flash Banner */}
      <div
        id="overdrive-banner-tag"
        className={`absolute top-14 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none flex items-center gap-2 px-6 py-2 rounded-full font-black text-white text-sm sm:text-base tracking-wider shadow-[0_0_30px_#ff2d95] bg-gradient-to-r from-[#e00078] via-[#ff2d95] to-[#ff71b8] ${
          showOverdriveBanner ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-4'
        }`}
      >
        <Flame className="w-5 h-5 text-yellow-300 animate-bounce" />
        <span>PINK OVERDRIVE! SKOR 2X</span>
        <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
      </div>

      {/* Header HUD */}
      <header className="px-4 py-3 bg-[#12051a]/90 border-b border-[#ff2d95]/30 flex justify-between items-center z-20 backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#ffb6df] tracking-wider uppercase">Skor</span>
          <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_#ff2d95]">{score}</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border flex items-center gap-1.5 transition-all ${
              isOverdrive
                ? 'bg-[#ff2d95] text-white border-white shadow-[0_0_15px_#ff2d95] animate-bounce'
                : 'bg-[#ff2d95]/15 text-[#ffb6df] border-[#ff2d95]/50'
            }`}
          >
            {isOverdrive ? (
              <>
                <Flame className="w-3.5 h-3.5 text-yellow-200" />
                <span>OVERDRIVE 2X ({combo})</span>
              </>
            ) : (
              <span>Combo: {combo > 1 ? `${combo}x` : `${combo}`}</span>
            )}
          </div>

          {/* Overdrive countdown mini bar */}
          {isOverdrive && (
            <div className="w-24 h-1.5 bg-[#ff2d95]/30 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-[#ff2d95] transition-all duration-100"
                style={{ width: `${(overdriveRemaining / 5.0) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold text-[#ffb6df] tracking-wider uppercase">Nyawa</span>
            <div className="flex gap-1 mt-0.5">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-5 h-5 transition-all duration-200 ${
                    heartIndex <= lives
                      ? 'text-[#ff2d95] fill-[#ff2d95] drop-shadow-[0_0_8px_#ff2d95] scale-100'
                      : 'text-zinc-600 fill-zinc-700 opacity-25 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg border border-[#ffb6df]/30 text-[#ffb6df] hover:bg-[#ff2d95]/20 hover:text-white transition"
            title={soundEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          className="w-full h-full block cursor-pointer touch-none"
        />
      </div>

      {/* Touch / Quick Movement Buttons */}
      <div className="px-4 py-2.5 bg-[#12051a]/95 border-t border-[#ff2d95]/30 flex justify-between gap-3 z-20">
        <button
          id="btn-touch-left"
          onPointerDown={(e) => {
            e.preventDefault();
            stateRef.current.keys.left = true;
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            stateRef.current.keys.left = false;
          }}
          onPointerLeave={() => (stateRef.current.keys.left = false)}
          className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-[#ff2d95]/15 text-[#ffb6df] border-2 border-[#ff2d95]/40 hover:bg-[#ff2d95]/30 active:bg-[#ff2d95] active:text-white active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>◀ KIRI</span>
          <span className="text-[10px] opacity-70 font-mono">(A)</span>
        </button>

        <button
          id="btn-touch-right"
          onPointerDown={(e) => {
            e.preventDefault();
            stateRef.current.keys.right = true;
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            stateRef.current.keys.right = false;
          }}
          onPointerLeave={() => (stateRef.current.keys.right = false)}
          className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-[#ff2d95]/15 text-[#ffb6df] border-2 border-[#ff2d95]/40 hover:bg-[#ff2d95]/30 active:bg-[#ff2d95] active:text-white active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>KANAN ▶</span>
          <span className="text-[10px] opacity-70 font-mono">(D)</span>
        </button>
      </div>

      {/* Start / Ready Overlay */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 bg-[#0e0416]/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-2 animate-bounce">👻🧁✨</div>
          <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-[0_0_20px_#ff2d95]">
            GHOST BAKERY
          </h1>
          <p className="text-sm text-[#ffb6df] mt-1 mb-6 max-w-[320px]">
            Toko kue hantu imut neon pink! Tangkap kue manis dan hindari bom berbahaya.
          </p>

          <div className="w-full max-w-[320px] bg-white/5 border border-[#ffb6df]/20 rounded-xl p-3.5 mb-6 text-left text-xs text-[#ffd6ee] space-y-1.5">
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2d95]" /> Aturan Main:
            </div>
            <p>• Gerakkan hantu dengan tombol <strong>Panah Kiri / Kanan</strong> atau <strong>A / D</strong>.</p>
            <p>• Tangkap <strong>Cupcake Pink, Donat Pink, & Permen Karet</strong> (+Skor & Partikel Cahaya).</p>
            <p>• Hindari <strong>Bom Hitam</strong> (-1 Nyawa).</p>
            <p>• <strong>Pink Overdrive:</strong> 5 Combo berturut-turut memicu Skor 2X & layar bersinar terang selama 5 detik!</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <button
              id="btn-play-game"
              onClick={handleStartGame}
              className="w-full py-3.5 px-6 rounded-full font-black text-base text-white bg-gradient-to-r from-[#ff2d95] to-[#e00078] shadow-[0_0_25px_rgba(255,45,149,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>MULAI MAIN</span>
            </button>

            <a
              href="/neon-pink-ghost-bakery.html"
              download="neon-pink-ghost-bakery.html"
              className="w-full py-2.5 px-4 rounded-full font-semibold text-xs text-white bg-[#ff2d95]/30 hover:bg-[#ff2d95]/50 border border-[#ff2d95]/60 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,45,149,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Game (.html)</span>
            </a>

            {onOpenCodeModal && (
              <button
                onClick={onOpenCodeModal}
                className="w-full py-2 px-4 rounded-full font-medium text-[11px] text-[#ffb6df] hover:text-white transition cursor-pointer"
              >
                Lihat / Salin Teks Kode
              </button>
            )}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-[#0e0416]/92 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-5xl mb-2">💀💔</div>
          <h2 className="text-3xl font-black text-[#ff529c] tracking-wider drop-shadow-[0_0_20px_#ff2d95]">
            GAME OVER
          </h2>
          <p className="text-xs sm:text-sm text-[#ffb6df] mt-1 mb-5 max-w-[280px]">
            Toko kue hantu kehabisan bahan! Hantu kecil tetap kagum dengan ketangkasanmu.
          </p>

          <div className="w-full max-w-[280px] bg-[#ff2d95]/10 border border-[#ff2d95] rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#ffb6df]">Skor Akhir:</span>
              <span className="font-black text-2xl text-[#ff2d95] drop-shadow-[0_0_8px_#ff2d95]">{score}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-[#ff2d95]/20 pt-2">
              <span className="text-[#ffb6df] flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" /> Rekor Tertinggi:
              </span>
              <span className="font-bold text-white">{highScore}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-[#ff2d95]/20 pt-2">
              <span className="text-[#ffb6df]">Combo Terbaik:</span>
              <span className="font-bold text-white">{highestCombo}x</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <button
              id="btn-restart-game"
              onClick={handleStartGame}
              className="w-full py-3.5 px-6 rounded-full font-black text-base text-white bg-gradient-to-r from-[#ff2d95] to-[#e00078] shadow-[0_0_25px_rgba(255,45,149,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>MAIN LAGI</span>
            </button>

            <a
              href="/neon-pink-ghost-bakery.html"
              download="neon-pink-ghost-bakery.html"
              className="w-full py-2.5 px-4 rounded-full font-semibold text-xs text-white bg-[#ff2d95]/30 hover:bg-[#ff2d95]/50 border border-[#ff2d95]/60 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,45,149,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Game (.html)</span>
            </a>

            {onOpenCodeModal && (
              <button
                onClick={onOpenCodeModal}
                className="w-full py-2 px-4 rounded-full font-medium text-[11px] text-[#ffb6df] hover:text-white transition cursor-pointer"
              >
                Lihat / Salin Teks Kode
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
