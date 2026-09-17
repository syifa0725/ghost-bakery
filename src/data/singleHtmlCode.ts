export const SINGLE_HTML_GAME_CODE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Neon Pink Ghost Bakery - Arcade Game</title>
  <style>
    :root {
      --neon-pink: #ff2d95;
      --neon-magenta: #e00078;
      --pastel-pink: #ffb6df;
      --neon-glow: 0 0 15px rgba(255, 45, 149, 0.7), 0 0 30px rgba(224, 0, 120, 0.4);
      --bg-dark: #0f0516;
      --card-bg: rgba(28, 11, 40, 0.85);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: radial-gradient(circle at center top, #260a36 0%, #0d0314 100%);
      color: #fff;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      touch-action: none;
    }

    #game-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      height: 800px;
      max-height: 94vh;
      background: #14071d;
      border: 3px solid var(--neon-pink);
      border-radius: 20px;
      box-shadow: var(--neon-glow), inset 0 0 20px rgba(255, 45, 149, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    #overdrive-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 17px;
      box-shadow: inset 0 0 60px rgba(255, 45, 149, 0.9), inset 0 0 100px rgba(255, 105, 180, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10;
    }

    #overdrive-overlay.active {
      opacity: 1;
      animation: pulseGlow 1s infinite alternate ease-in-out;
    }

    @keyframes pulseGlow {
      0% { box-shadow: inset 0 0 40px rgba(255, 45, 149, 0.7), inset 0 0 70px rgba(255, 182, 223, 0.4); }
      100% { box-shadow: inset 0 0 80px rgba(255, 45, 149, 1), inset 0 0 130px rgba(255, 45, 149, 0.6); }
    }

    header {
      padding: 14px 20px;
      background: rgba(18, 5, 26, 0.9);
      border-bottom: 2px solid rgba(255, 45, 149, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 12;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--pastel-pink);
      font-weight: 700;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 10px var(--neon-pink);
    }

    .lives-wrapper {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }

    .heart {
      font-size: 18px;
      color: #ff2d95;
      text-shadow: 0 0 8px #ff2d95;
      transition: transform 0.2s, opacity 0.2s;
    }

    .heart.lost {
      opacity: 0.2;
      filter: grayscale(1);
    }

    #overdrive-badge {
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(255, 45, 149, 0.15);
      border: 1px solid var(--neon-pink);
      font-size: 12px;
      font-weight: 800;
      color: var(--pastel-pink);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #overdrive-badge.flashing {
      background: var(--neon-pink);
      color: #fff;
      box-shadow: 0 0 15px var(--neon-pink);
      animation: badgeBounce 0.5s infinite alternate;
    }

    @keyframes badgeBounce {
      from { transform: scale(1); }
      to { transform: scale(1.06); }
    }

    #canvas-wrapper {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    #overdrive-banner {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%) scale(0.8);
      background: linear-gradient(90deg, #e00078, #ff2d95, #ff71b8);
      color: white;
      padding: 10px 24px;
      border-radius: 30px;
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 1px;
      box-shadow: 0 0 25px #ff2d95;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 25;
      white-space: nowrap;
    }

    #overdrive-banner.show {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }

    #mobile-controls {
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      background: rgba(18, 5, 26, 0.95);
      border-top: 1px solid rgba(255, 45, 149, 0.25);
      z-index: 15;
    }

    .ctrl-btn {
      flex: 1;
      margin: 0 8px;
      padding: 14px;
      font-size: 18px;
      font-weight: 800;
      background: rgba(255, 45, 149, 0.12);
      color: var(--pastel-pink);
      border: 2px solid rgba(255, 45, 149, 0.4);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.1s;
    }

    .ctrl-btn:active {
      background: var(--neon-pink);
      color: white;
      box-shadow: 0 0 15px var(--neon-pink);
      transform: scale(0.96);
    }

    .screen-overlay {
      position: absolute;
      inset: 0;
      background: rgba(14, 4, 22, 0.88);
      backdrop-filter: blur(5px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      z-index: 30;
      transition: opacity 0.25s ease;
    }

    .screen-overlay.hidden {
      display: none;
    }

    .modal-title {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 20px var(--neon-pink);
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .modal-subtitle {
      font-size: 14px;
      color: var(--pastel-pink);
      margin-bottom: 24px;
      max-width: 320px;
      line-height: 1.5;
    }

    .score-summary {
      background: rgba(255, 45, 149, 0.1);
      border: 1px solid var(--neon-pink);
      border-radius: 16px;
      padding: 16px 28px;
      margin-bottom: 24px;
      width: 100%;
      max-width: 280px;
    }

    .score-summary-item {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 15px;
    }

    .score-summary-item span:first-child {
      color: var(--pastel-pink);
    }

    .score-summary-item span:last-child {
      font-weight: 800;
      color: #fff;
    }

    .action-btn {
      background: linear-gradient(135deg, var(--neon-pink), var(--neon-magenta));
      color: white;
      font-weight: 800;
      font-size: 16px;
      padding: 14px 36px;
      border-radius: 30px;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(255, 45, 149, 0.6);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(255, 45, 149, 0.9);
    }

    .action-btn:active {
      transform: scale(0.97);
    }

    .rules-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 182, 223, 0.2);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 20px;
      text-align: left;
      font-size: 12px;
      color: #ffd6ee;
      width: 100%;
      max-width: 320px;
      line-height: 1.6;
    }

    .rules-card ul {
      padding-left: 18px;
    }

    #sound-toggle {
      background: none;
      border: 1px solid rgba(255, 182, 223, 0.3);
      color: var(--pastel-pink);
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 11px;
      cursor: pointer;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="overdrive-overlay"></div>
    <div id="overdrive-banner">✨ PINK OVERDRIVE! 2X SKOR ✨</div>

    <header>
      <div class="stat-box">
        <span class="stat-label">Skor</span>
        <span id="ui-score" class="stat-value">0</span>
      </div>

      <div class="stat-box" style="align-items: center;">
        <div id="overdrive-badge">
          <span id="ui-combo-text">Combo: 0</span>
        </div>
        <div id="overdrive-timer-bar" style="width: 100%; height: 3px; background: rgba(255,45,149,0.3); margin-top: 4px; border-radius: 2px; overflow: hidden; display: none;">
          <div id="ui-timer-fill" style="width: 100%; height: 100%; background: #ff2d95;"></div>
        </div>
      </div>

      <div class="stat-box" style="align-items: flex-end;">
        <span class="stat-label">Nyawa</span>
        <div class="lives-wrapper" id="ui-lives">
          <span class="heart" id="heart-1">💖</span>
          <span class="heart" id="heart-2">💖</span>
          <span class="heart" id="heart-3">💖</span>
        </div>
      </div>

      <button id="sound-toggle" title="Toggle Suara">🔊 On</button>
    </header>

    <div id="canvas-wrapper">
      <canvas id="gameCanvas"></canvas>
    </div>

    <div id="mobile-controls">
      <button class="ctrl-btn" id="btn-left">◀ KIRI (A)</button>
      <button class="ctrl-btn" id="btn-right">KANAN (D) ▶</button>
    </div>

    <div id="start-screen" class="screen-overlay">
      <div style="font-size: 50px; margin-bottom: 8px;">👻🧁✨</div>
      <h1 class="modal-title">GHOST BAKERY</h1>
      <p class="modal-subtitle">Tangkap kue manis neon untuk toko kue hantu dan hindari bom hitam!</p>

      <div class="rules-card">
        <strong>Aturan Main:</strong>
        <ul>
          <li>Gunakan tombol <strong>Panah Kiri/Kanan</strong> atau <strong>A / D</strong></li>
          <li>Tangkap <strong>Cupcake Pink, Donat Pink, & Permen Karet</strong> (+Skor)</li>
          <li>Hindari <strong>Bom Hitam</strong> (-1 Nyawa)</li>
          <li><strong>Pink Overdrive:</strong> 5 Combo berturut-turut mengaktifkan Skor 2X selama 5 detik!</li>
        </ul>
      </div>

      <button class="action-btn" id="btn-start">MULAI GAME</button>
    </div>

    <div id="game-over-screen" class="screen-overlay hidden">
      <div style="font-size: 46px; margin-bottom: 6px;">💀💔</div>
      <h2 class="modal-title" style="color: #ff529c;">GAME OVER</h2>
      <p class="modal-subtitle">Toko kue kehabisan bahan! Hantu kecil tetap bangga dengan usahamu.</p>

      <div class="score-summary">
        <div class="score-summary-item">
          <span>Skor Akhir:</span>
          <span id="final-score" style="color: #ff2d95; font-size: 20px;">0</span>
        </div>
        <div class="score-summary-item">
          <span>Skor Tertinggi:</span>
          <span id="high-score">0</span>
        </div>
        <div class="score-summary-item">
          <span>Maks Combo:</span>
          <span id="max-combo">0</span>
        </div>
      </div>

      <button class="action-btn" id="btn-restart">MAIN LAGI 🔄</button>
    </div>
  </div>

  <script>
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }

      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      playCatch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }

      playOverdrive() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteStart = now + idx * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteStart);
          gain.gain.setValueAtTime(0.2, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 0.25);
        });
      }

      playHurt() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }

      playGameOver() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [392, 349.23, 329.63, 261.63];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + idx * 0.12;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.22);
        });
      }
    }

    const sound = new SoundEngine();
    const soundToggleBtn = document.getElementById('sound-toggle');
    soundToggleBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      soundToggleBtn.textContent = sound.enabled ? '🔊 On' : '🔇 Mute';
      if (sound.enabled) sound.init();
    });

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);

    let isPlaying = false;
    let score = 0;
    let lives = 3;
    let combo = 0;
    let highestCombo = 0;
    let highScore = parseInt(localStorage.getItem('neon_ghost_high_score') || '0', 10);
    let isOverdrive = false;
    let overdriveTimer = 0;
    const OVERDRIVE_DURATION = 5.0;
    let lastTime = 0;
    let spawnTimer = 0;
    let spawnInterval = 1.0;
    let shakeDuration = 0;
    let shakeIntensity = 0;

    const keys = { left: false, right: false };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const setupButton = (elem, keyName) => {
      const down = (e) => { e.preventDefault(); keys[keyName] = true; };
      const up = (e) => { e.preventDefault(); keys[keyName] = false; };
      elem.addEventListener('pointerdown', down);
      elem.addEventListener('pointerup', up);
      elem.addEventListener('pointercancel', up);
      elem.addEventListener('pointerleave', up);
    };
    setupButton(btnLeft, 'left');
    setupButton(btnRight, 'right');

    let touchDragging = false;
    canvas.addEventListener('pointerdown', (e) => {
      touchDragging = true;
      movePlayerTo(e.offsetX);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (touchDragging) movePlayerTo(e.offsetX);
    });
    canvas.addEventListener('pointerup', () => { touchDragging = false; });
    canvas.addEventListener('pointercancel', () => { touchDragging = false; });

    function movePlayerTo(targetX) {
      if (!isPlaying) return;
      player.x = Math.max(player.width / 2, Math.min(width - player.width / 2, targetX));
    }

    const player = {
      x: 300,
      y: 700,
      width: 70,
      height: 70,
      speed: 460,
      basketWidth: 80,
      basketHeight: 18,
      wobble: 0,
      blinkTimer: 0,
      isBlinking: false
    };

    let items = [];
    let particles = [];
    let popups = [];

    const ITEM_TYPES = {
      CUPCAKE: 'cupcake',
      DONUT: 'donut',
      BUBBLEGUM: 'bubblegum',
      BOMB: 'bomb'
    };

    class Item {
      constructor() {
        this.type = this.pickType();
        this.radius = 20;
        this.x = Math.random() * (width - 80) + 40;
        this.y = -30;
        const baseSpeed = 170 + Math.min(score * 0.4, 220);
        this.speedY = baseSpeed + Math.random() * 60;
        this.rot = 0;
        this.rotSpeed = (Math.random() - 0.5) * 4;
      }

      pickType() {
        const rand = Math.random();
        if (rand < 0.22) return ITEM_TYPES.BOMB;
        if (rand < 0.50) return ITEM_TYPES.CUPCAKE;
        if (rand < 0.78) return ITEM_TYPES.DONUT;
        return ITEM_TYPES.BUBBLEGUM;
      }

      update(dt) {
        this.y += this.speedY * dt;
        this.rot += this.rotSpeed * dt;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        if (this.type === ITEM_TYPES.CUPCAKE) drawCupcake(ctx);
        else if (this.type === ITEM_TYPES.DONUT) drawDonut(ctx);
        else if (this.type === ITEM_TYPES.BUBBLEGUM) drawBubblegum(ctx);
        else if (this.type === ITEM_TYPES.BOMB) drawBomb(ctx);
        ctx.restore();
      }
    }

    function drawCupcake(ctx) {
      ctx.shadowColor = '#ff2d95';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ff82b8';
      ctx.beginPath();
      ctx.moveTo(-14, 2);
      ctx.lineTo(14, 2);
      ctx.lineTo(10, 18);
      ctx.lineTo(-10, 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.arc(-7, -2, 10, 0, Math.PI * 2);
      ctx.arc(7, -2, 10, 0, Math.PI * 2);
      ctx.arc(0, -9, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -18, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawDonut(ctx) {
      ctx.shadowColor = '#ff40a7';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffd1b3';
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff2d95';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#14071d';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -8, 4, 2);
      ctx.fillRect(5, -6, 2, 4);
      ctx.fillRect(-2, 7, 4, 2);
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(4, 5, 3, 2);
    }

    function drawBubblegum(ctx) {
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
    }

    function drawBomb(ctx) {
      ctx.shadowColor = '#b300ff';
      ctx.shadowBlur = 14;
      const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, 20);
      grad.addColorStop(0, '#442255');
      grad.addColorStop(0.6, '#1a0d24');
      grad.addColorStop(1, '#08010d');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.fillStyle = '#888';
      ctx.fillRect(-3, -18, 6, 4);

      ctx.fillStyle = '#ffe600';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -22, 4 + Math.sin(Date.now() * 0.02) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    class Particle {
      constructor(x, y, color, isBurst = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        const speed = isBurst ? (Math.random() * 200 + 100) : (Math.random() * 80 + 30);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.decay = Math.random() * 1.5 + 1.2;
        this.size = Math.random() * 5 + 3;
        this.isStar = Math.random() > 0.5;
      }

      update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += 60 * dt;
        this.life -= this.decay * dt;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        if (this.isStar) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x + this.size, this.y);
          ctx.lineTo(this.x, this.y + this.size);
          ctx.lineTo(this.x - this.size, this.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class TextPopup {
      constructor(text, x, y, color, isBig = false) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = 1.0;
        this.isBig = isBig;
      }
      update(dt) {
        this.y -= 50 * dt;
        this.life -= 1.4 * dt;
      }
      draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.font = this.isBig ? 'bold 20px sans-serif' : 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    function drawPlayer(ctx) {
      const px = player.x;
      const py = player.y;
      ctx.save();

      if (isOverdrive) {
        ctx.shadowColor = '#ff2d95';
        ctx.shadowBlur = 30;
        ctx.strokeStyle = 'rgba(255, 45, 149, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, py - 10, 48 + Math.sin(player.wobble * 3) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      const floatY = py + Math.sin(player.wobble) * 6;
      ctx.shadowColor = isOverdrive ? '#ff69b4' : '#ff2d95';
      ctx.shadowBlur = 14;

      const trayGrad = ctx.createLinearGradient(px - 45, floatY - 26, px + 45, floatY - 26);
      trayGrad.addColorStop(0, '#ff71b8');
      trayGrad.addColorStop(0.5, '#ffffff');
      trayGrad.addColorStop(1, '#ff2d95');

      ctx.fillStyle = trayGrad;
      ctx.beginPath();
      ctx.roundRect(px - player.basketWidth / 2, floatY - 32, player.basketWidth, 12, 6);
      ctx.fill();

      ctx.fillStyle = '#ffb6df';
      ctx.fillRect(px - player.basketWidth / 2 - 4, floatY - 30, 4, 8);
      ctx.fillRect(px + player.basketWidth / 2, floatY - 30, 4, 8);

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
      ctx.quadraticCurveTo(px + 20, floatY + 32 + Math.sin(player.wobble * 2) * 3, px + 10, floatY + 24);
      ctx.quadraticCurveTo(px, floatY + 32 - Math.sin(player.wobble * 2) * 3, px - 10, floatY + 24);
      ctx.quadraticCurveTo(px - 20, floatY + 32 + Math.sin(player.wobble * 2) * 3, px - 28, floatY + 24);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 45, 149, 0.45)';
      ctx.beginPath();
      ctx.ellipse(px - 16, floatY - 3, 6, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 16, floatY - 3, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      if (player.isBlinking) {
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

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px - 11, floatY - 10, 2, 0, Math.PI * 2);
        ctx.arc(px + 9, floatY - 10, 2, 0, Math.PI * 2);
        ctx.arc(px - 9, floatY - 6, 1, 0, Math.PI * 2);
        ctx.arc(px + 11, floatY - 6, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ff2d95';
      ctx.beginPath();
      ctx.arc(px, floatY - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
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
    }

    function activateOverdrive() {
      isOverdrive = true;
      overdriveTimer = OVERDRIVE_DURATION;
      sound.playOverdrive();

      const overlay = document.getElementById('overdrive-overlay');
      overlay.classList.add('active');

      const banner = document.getElementById('overdrive-banner');
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 2200);

      const badge = document.getElementById('overdrive-badge');
      badge.classList.add('flashing');

      document.getElementById('overdrive-timer-bar').style.display = 'block';

      for (let i = 0; i < 35; i++) {
        particles.push(new Particle(player.x, player.y, '#ff2d95', true));
        particles.push(new Particle(player.x, player.y, '#ffb6df', true));
      }
    }

    function deactivateOverdrive() {
      isOverdrive = false;
      document.getElementById('overdrive-overlay').classList.remove('active');
      document.getElementById('overdrive-badge').classList.remove('flashing');
      document.getElementById('overdrive-timer-bar').style.display = 'none';
    }

    function triggerShake(intensity = 8, duration = 0.3) {
      shakeIntensity = intensity;
      shakeDuration = duration;
    }

    function update(dt) {
      player.wobble += dt * 5;
      player.blinkTimer -= dt;
      if (player.blinkTimer <= 0) {
        player.isBlinking = !player.isBlinking;
        player.blinkTimer = player.isBlinking ? 0.15 : (Math.random() * 3 + 2);
      }

      if (keys.left) player.x -= player.speed * dt;
      if (keys.right) player.x += player.speed * dt;
      player.x = Math.max(player.basketWidth / 2, Math.min(width - player.basketWidth / 2, player.x));
      player.y = height - 70;

      if (isOverdrive) {
        overdriveTimer -= dt;
        const progress = Math.max(0, overdriveTimer / OVERDRIVE_DURATION);
        document.getElementById('ui-timer-fill').style.width = (progress * 100) + '%';
        if (overdriveTimer <= 0) deactivateOverdrive();
      }

      if (shakeDuration > 0) shakeDuration -= dt;

      spawnTimer += dt;
      const currentSpawnRate = Math.max(0.48, spawnInterval - (score * 0.001));
      if (spawnTimer >= currentSpawnRate) {
        spawnTimer = 0;
        items.push(new Item());
      }

      const trayTop = player.y - 32;
      const trayBottom = player.y - 18;
      const trayLeft = player.x - player.basketWidth / 2 - 10;
      const trayRight = player.x + player.basketWidth / 2 + 10;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update(dt);

        const isCaught = (
          item.y + item.radius >= trayTop &&
          item.y - item.radius <= trayBottom &&
          item.x >= trayLeft &&
          item.x <= trayRight
        );

        if (isCaught) {
          handleCatch(item);
          items.splice(i, 1);
          continue;
        }

        if (item.y > height + 40) {
          if (item.type !== ITEM_TYPES.BOMB) {
            combo = 0;
            updateComboUI();
          }
          items.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(dt);
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      for (let i = popups.length - 1; i >= 0; i--) {
        popups[i].update(dt);
        if (popups[i].life <= 0) popups.splice(i, 1);
      }
    }

    function handleCatch(item) {
      if (item.type === ITEM_TYPES.BOMB) {
        sound.playHurt();
        triggerShake(12, 0.35);
        lives--;
        combo = 0;
        updateComboUI();
        updateLivesUI();

        for (let k = 0; k < 28; k++) {
          particles.push(new Particle(item.x, item.y, '#b300ff', true));
          particles.push(new Particle(item.x, item.y, '#2c0438', true));
        }

        popups.push(new TextPopup('-1 NYAWA!', item.x, item.y, '#ff4488', true));

        if (lives <= 0) gameOver();
      } else {
        sound.playCatch();
        combo++;
        if (combo > highestCombo) highestCombo = combo;

        let itemScore = 15;
        if (item.type === ITEM_TYPES.CUPCAKE) itemScore = 20;
        if (item.type === ITEM_TYPES.DONUT) itemScore = 25;
        if (item.type === ITEM_TYPES.BUBBLEGUM) itemScore = 15;

        const multiplier = isOverdrive ? 2 : 1;
        const totalGain = itemScore * multiplier;
        score += totalGain;

        for (let k = 0; k < 18; k++) {
          particles.push(new Particle(item.x, item.y, '#ff2d95'));
          particles.push(new Particle(item.x, item.y, '#ffb6df'));
          if (isOverdrive) particles.push(new Particle(item.x, item.y, '#ffffff'));
        }

        const text = isOverdrive ? '+' + totalGain + ' (2X!)' : '+' + totalGain;
        popups.push(new TextPopup(text, item.x, item.y, isOverdrive ? '#ffb6df' : '#ff2d95', isOverdrive));

        if (combo > 0 && combo % 5 === 0) {
          activateOverdrive();
        }

        updateScoreUI();
        updateComboUI();
      }
    }

    function updateScoreUI() {
      document.getElementById('ui-score').textContent = score;
    }

    function updateComboUI() {
      const badge = document.getElementById('ui-combo-text');
      if (isOverdrive) {
        badge.textContent = '⚡ OVERDRIVE 2X (' + combo + ')';
      } else {
        badge.textContent = combo > 1 ? 'Combo: ' + combo + 'x' : 'Combo: ' + combo;
      }
    }

    function updateLivesUI() {
      for (let i = 1; i <= 3; i++) {
        const heartEl = document.getElementById('heart-' + i);
        if (i <= lives) heartEl.classList.remove('lost');
        else heartEl.classList.add('lost');
      }
    }

    const bgSparks = Array.from({ length: 22 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 800,
      r: Math.random() * 2.5 + 1,
      speed: Math.random() * 20 + 10,
      opacity: Math.random() * 0.5 + 0.2
    }));

    function render() {
      ctx.save();
      if (shakeDuration > 0) {
        const ox = (Math.random() - 0.5) * shakeIntensity * 2;
        const oy = (Math.random() - 0.5) * shakeIntensity * 2;
        ctx.translate(ox, oy);
      }

      ctx.fillStyle = '#14071d';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 45, 149, 0.08)';
      ctx.lineWidth = 1.5;
      for (let y = 100; y < height; y += 140) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      bgSparks.forEach(spark => {
        spark.y -= spark.speed * 0.016;
        if (spark.y < 0) spark.y = height;
        ctx.fillStyle = '#ff2d95';
        ctx.globalAlpha = spark.opacity;
        ctx.beginPath();
        ctx.arc(spark.x % width, spark.y, spark.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      items.forEach(item => item.draw(ctx));
      particles.forEach(p => p.draw(ctx));
      drawPlayer(ctx);
      popups.forEach(pop => pop.draw(ctx));

      ctx.restore();
    }

    function gameLoop(timestamp) {
      if (!isPlaying) return;
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;
      update(dt);
      render();
      requestAnimationFrame(gameLoop);
    }

    function startGame() {
      sound.init();
      resizeCanvas();
      score = 0;
      lives = 3;
      combo = 0;
      highestCombo = 0;
      items = [];
      particles = [];
      popups = [];
      isOverdrive = false;
      overdriveTimer = 0;
      lastTime = 0;
      player.x = width / 2;

      updateScoreUI();
      updateComboUI();
      updateLivesUI();
      deactivateOverdrive();

      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('game-over-screen').classList.add('hidden');

      isPlaying = true;
      requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      isPlaying = false;
      sound.playGameOver();
      deactivateOverdrive();

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('neon_ghost_high_score', highScore.toString());
      }

      document.getElementById('final-score').textContent = score;
      document.getElementById('high-score').textContent = highScore;
      document.getElementById('max-combo').textContent = highestCombo;
      document.getElementById('game-over-screen').classList.remove('hidden');
    }

    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-restart').addEventListener('click', startGame);
    setTimeout(resizeCanvas, 50);
  </script>
</body>
</html>`;
