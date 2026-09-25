import { SceneId } from '../types';

export interface SceneContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number; // in seconds
  bpm: number;
}

export function drawScene(sceneId: SceneId, sc: SceneContext) {
  switch (sceneId) {
    case 'meadow':
      drawMeadow(sc);
      break;
    case 'space':
      drawSpace(sc);
      break;
    case 'underwater':
      drawUnderwater(sc);
      break;
    case 'forest':
      drawForest(sc);
      break;
    case 'party':
      drawParty(sc);
      break;
  }
}

/**
 * 1. Prairie Ensoleillée
 */
function drawMeadow({ ctx, width, height, time }: SceneContext) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  skyGrad.addColorStop(0, '#60a5fa');
  skyGrad.addColorStop(0.5, '#93c5fd');
  skyGrad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Animated Smiling Sun
  const sunX = width * 0.85;
  const sunY = height * 0.2;
  const sunRadius = Math.min(width, height) * 0.08;

  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(time * 0.4);

  // Sun rays
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const r1 = sunRadius + 8;
    const r2 = sunRadius + 20 + Math.sin(time * 3 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
    ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
    ctx.stroke();
  }
  ctx.restore();

  // Sun body
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun face
  ctx.fillStyle = '#b45309';
  // Eyes
  ctx.beginPath();
  ctx.arc(sunX - sunRadius * 0.3, sunY - sunRadius * 0.1, sunRadius * 0.1, 0, Math.PI * 2);
  ctx.arc(sunX + sunRadius * 0.3, sunY - sunRadius * 0.1, sunRadius * 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Blushing cheeks
  ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.beginPath();
  ctx.arc(sunX - sunRadius * 0.45, sunY + sunRadius * 0.12, sunRadius * 0.15, 0, Math.PI * 2);
  ctx.arc(sunX + sunRadius * 0.45, sunY + sunRadius * 0.12, sunRadius * 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sunX, sunY + sunRadius * 0.05, sunRadius * 0.4, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Drifting Clouds
  drawCloud(ctx, ((width * 0.2 + time * 20) % (width + 200)) - 100, height * 0.18, 0.9);
  drawCloud(ctx, ((width * 0.6 + time * 14) % (width + 250)) - 120, height * 0.28, 0.7);

  // Background Hills (Layer 1 - pale green)
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.62);
  ctx.bezierCurveTo(width * 0.25, height * 0.52, width * 0.45, height * 0.68, width * 0.7, height * 0.58);
  ctx.bezierCurveTo(width * 0.85, height * 0.52, width * 0.95, height * 0.56, width, height * 0.6);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Windmill on background hill
  const millX = width * 0.22;
  const millY = height * 0.56;
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.moveTo(millX - 12, millY);
  ctx.lineTo(millX + 12, millY);
  ctx.lineTo(millX + 8, millY - 40);
  ctx.lineTo(millX - 8, millY - 40);
  ctx.closePath();
  ctx.fill();
  // Windmill roof
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.moveTo(millX - 14, millY - 40);
  ctx.lineTo(millX, millY - 56);
  ctx.lineTo(millX + 14, millY - 40);
  ctx.closePath();
  ctx.fill();
  // Windmill blades
  ctx.save();
  ctx.translate(millX, millY - 40);
  ctx.rotate(time * 1.5);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  for (let b = 0; b < 4; b++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 26);
    ctx.stroke();
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, 8, 8, 16);
  }
  ctx.restore();

  // Foreground Hills (Layer 2 - lush bright grass)
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.72);
  ctx.bezierCurveTo(width * 0.3, height * 0.65, width * 0.6, height * 0.76, width, height * 0.68);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Swaying Flowers
  const flowerCount = 9;
  for (let f = 0; f < flowerCount; f++) {
    const fx = (width / (flowerCount + 1)) * (f + 1) + Math.sin(f * 9) * 20;
    const fy = height * 0.88 + Math.sin(f * 3) * 30;
    const sway = Math.sin(time * 2.5 + f) * 6;
    drawFlower(ctx, fx, fy, sway, f % 3);
  }

  // Fluttering butterfly
  const bflyX = (width * 0.45 + Math.sin(time * 1.2) * 120 + time * 30) % width;
  const bflyY = height * 0.5 + Math.sin(time * 3) * 30;
  drawButterfly(ctx, bflyX, bflyY, time);
}

/**
 * 2. Nuit Étoilée & Sommeil
 */
function drawSpace({ ctx, width, height, time }: SceneContext) {
  // Deep cosmos gradient
  const cosmos = ctx.createLinearGradient(0, 0, 0, height);
  cosmos.addColorStop(0, '#0f172a');
  cosmos.addColorStop(0.5, '#1e1b4b');
  cosmos.addColorStop(1, '#312e81');
  ctx.fillStyle = cosmos;
  ctx.fillRect(0, 0, width, height);

  // Twinkling Stars
  for (let i = 0; i < 45; i++) {
    const sx = ((i * 137.5) % width);
    const sy = ((i * 219.3) % (height * 0.85));
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time * 2 + i * 1.7));
    const size = (i % 3 === 0 ? 3 : 2) * twinkle;

    ctx.fillStyle = i % 4 === 0 ? '#fef08a' : '#ffffff';
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // Ringed gentle planet
  const pX = width * 0.18;
  const pY = height * 0.25;
  ctx.save();
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(pX, pY, 26, 0, Math.PI * 2);
  ctx.fill();
  // Ring
  ctx.strokeStyle = '#e9d5ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(pX, pY, 44, 12, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Cute Sleepy Crescent Moon with Nightcap
  const moonX = width * 0.82;
  const moonY = height * 0.24 + Math.sin(time * 0.8) * 8;
  const moonR = Math.min(width, height) * 0.11;

  ctx.save();
  // Moon Glow
  const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 1.8);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.3)');
  glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Crescent shape
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0.2 * Math.PI, 1.8 * Math.PI, false);
  ctx.arc(moonX + moonR * 0.45, moonY, moonR * 0.85, 1.7 * Math.PI, 0.3 * Math.PI, true);
  ctx.closePath();
  ctx.fill();

  // Sleepy eye
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(moonX - moonR * 0.2, moonY, moonR * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Pink blush
  ctx.fillStyle = 'rgba(251, 113, 133, 0.5)';
  ctx.beginPath();
  ctx.arc(moonX - moonR * 0.1, moonY + moonR * 0.2, moonR * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Striped sleeping nightcap
  ctx.translate(moonX - moonR * 0.3, moonY - moonR * 0.8);
  ctx.rotate(-0.35 + Math.sin(time * 1.5) * 0.08);
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.quadraticCurveTo(0, -50, 45, -35);
  ctx.quadraticCurveTo(20, -10, 18, 0);
  ctx.closePath();
  ctx.fill();

  // Pompom
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(45, -35, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Soft purple night hills below
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.8);
  ctx.bezierCurveTo(width * 0.4, height * 0.72, width * 0.7, height * 0.85, width, height * 0.78);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
}

/**
 * 3. Monde Sous-Marin Rigolo
 */
function drawUnderwater({ ctx, width, height, time }: SceneContext) {
  // Underwater blue gradient
  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#38bdf8');
  ocean.addColorStop(0.4, '#0284c7');
  ocean.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  // Sunlight caustics
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 14;
  for (let c = 0; c < 5; c++) {
    const cx = width * 0.2 * c + Math.sin(time + c) * 30;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx + width * 0.15, height);
    ctx.stroke();
  }
  ctx.restore();

  // Floating bubbles
  for (let b = 0; b < 16; b++) {
    const bx = ((b * 93 + time * 15) % width);
    const by = height - ((b * 57 + time * 45) % (height + 50));
    const br = 4 + (b % 4) * 3;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bx + Math.sin(time * 3 + b) * 8, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Sandy bottom
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.82);
  ctx.bezierCurveTo(width * 0.3, height * 0.78, width * 0.7, height * 0.86, width, height * 0.8);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Swaying Seaweed
  const seaweedCount = 8;
  for (let s = 0; s < seaweedCount; s++) {
    const sx = (width / seaweedCount) * s + 30;
    const sy = height * 0.82;
    drawSeaweed(ctx, sx, sy, time + s, s % 2 === 0 ? '#10b981' : '#059669');
  }

  // School of friendly little fish
  for (let f = 0; f < 4; f++) {
    const fishX = ((time * 80 + f * 110) % (width + 150)) - 80;
    const fishY = height * 0.35 + Math.sin(time * 2 + f) * 20 + f * 35;
    drawFish(ctx, fishX, fishY, f % 2 === 0 ? '#f97316' : '#ec4899');
  }
}

/**
 * 4. Forêt Enchantée
 */
function drawForest({ ctx, width, height, time }: SceneContext) {
  // Forest twilight gradient
  const forest = ctx.createLinearGradient(0, 0, 0, height);
  forest.addColorStop(0, '#064e3b');
  forest.addColorStop(0.6, '#047857');
  forest.addColorStop(1, '#065f46');
  ctx.fillStyle = forest;
  ctx.fillRect(0, 0, width, height);

  // Enchanted Tree Trunks in background
  ctx.fillStyle = '#78350f';
  const trunkPositions = [0.1, 0.3, 0.7, 0.9];
  trunkPositions.forEach((pos) => {
    ctx.fillRect(width * pos - 14, height * 0.2, 28, height * 0.7);
  });

  // Tree Canopy foliage
  ctx.fillStyle = '#052e16';
  ctx.beginPath();
  ctx.arc(width * 0.1, height * 0.2, 90, 0, Math.PI * 2);
  ctx.arc(width * 0.3, height * 0.15, 110, 0, Math.PI * 2);
  ctx.arc(width * 0.7, height * 0.18, 120, 0, Math.PI * 2);
  ctx.arc(width * 0.9, height * 0.22, 95, 0, Math.PI * 2);
  ctx.fill();

  // Mossy Ground
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.78);
  ctx.bezierCurveTo(width * 0.3, height * 0.74, width * 0.6, height * 0.82, width, height * 0.76);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Whimsical Giant Mushrooms
  drawMushroom(ctx, width * 0.15, height * 0.82, 38, '#ef4444');
  drawMushroom(ctx, width * 0.22, height * 0.84, 24, '#f59e0b');
  drawMushroom(ctx, width * 0.82, height * 0.81, 42, '#ec4899');
  drawMushroom(ctx, width * 0.88, height * 0.85, 26, '#3b82f6');

  // Glowing Fireflies
  for (let fl = 0; fl < 18; fl++) {
    const flX = ((fl * 89 + Math.sin(time * 0.8 + fl) * 50) % width);
    const flY = height * 0.3 + ((fl * 63 + Math.cos(time * 0.9 + fl) * 40) % (height * 0.5));
    const flGlow = 0.4 + 0.6 * Math.abs(Math.sin(time * 3 + fl * 2));

    ctx.fillStyle = `rgba(253, 224, 71, ${flGlow})`;
    ctx.beginPath();
    ctx.arc(flX, flY, 3 + flGlow * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 5. Fête & Arc-en-Ciel
 */
function drawParty({ ctx, width, height, time }: SceneContext) {
  // Joyful pastel sky
  const partySky = ctx.createLinearGradient(0, 0, 0, height);
  partySky.addColorStop(0, '#fbcfe8');
  partySky.addColorStop(0.5, '#fed7aa');
  partySky.addColorStop(1, '#fef08a');
  ctx.fillStyle = partySky;
  ctx.fillRect(0, 0, width, height);

  // Giant Vibrant 7-color Rainbow Arch
  const rbX = width * 0.5;
  const rbY = height * 0.95;
  const baseR = Math.min(width, height) * 0.48;
  const rainbowColors = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#facc15', // Yellow
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Purple
  ];

  rainbowColors.forEach((color, idx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(rbX, rbY, baseR - idx * 10, Math.PI, 0, false);
    ctx.stroke();
  });

  // Fluffy clouds at ends of rainbow
  drawCloud(ctx, width * 0.12, height * 0.8, 1.1);
  drawCloud(ctx, width * 0.88, height * 0.8, 1.1);

  // Carnival Bunting Garland
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.12);
  ctx.quadraticCurveTo(width * 0.5, height * 0.28, width, height * 0.12);
  ctx.stroke();

  // Flags on garland
  const flagCount = 14;
  const flagColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  for (let f = 0; f < flagCount; f++) {
    const t = (f + 0.5) / flagCount;
    const fx = width * t;
    const fy = height * 0.12 + Math.sin(t * Math.PI) * (height * 0.16);

    ctx.fillStyle = flagColors[f % flagColors.length];
    ctx.beginPath();
    ctx.moveTo(fx - 10, fy);
    ctx.lineTo(fx + 10, fy);
    ctx.lineTo(fx, fy + 22 + Math.sin(time * 3 + f) * 4);
    ctx.closePath();
    ctx.fill();
  }

  // Floating party balloons
  drawBalloon(ctx, width * 0.18, height * 0.35 + Math.sin(time * 1.5) * 15, '#ef4444');
  drawBalloon(ctx, width * 0.28, height * 0.26 + Math.sin(time * 1.8 + 1) * 12, '#3b82f6');
  drawBalloon(ctx, width * 0.72, height * 0.28 + Math.sin(time * 1.6 + 2) * 14, '#10b981');
  drawBalloon(ctx, width * 0.82, height * 0.36 + Math.sin(time * 1.4 + 3) * 16, '#f59e0b');

  // Sparkles & Confetti
  for (let c = 0; c < 22; c++) {
    const cx = ((c * 67 + time * 30) % width);
    const cy = ((c * 43 + time * 60) % height);
    ctx.fillStyle = flagColors[c % flagColors.length];
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 2 + c);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  }
}

// ----------------- Helper Draw Functions -----------------

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.arc(22, -10, 30, 0, Math.PI * 2);
  ctx.arc(46, 0, 24, 0, Math.PI * 2);
  ctx.arc(22, 10, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, sway: number, variant: number) {
  ctx.save();
  ctx.translate(x, y);

  // Stem
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(sway, -20, sway * 1.5, -40);
  ctx.stroke();

  // Flower Head
  ctx.translate(sway * 1.5, -40);
  const petalColors = ['#f43f5e', '#a855f7', '#fbbf24'];
  ctx.fillStyle = petalColors[variant];

  for (let p = 0; p < 5; p++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.arc(0, -9, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flower center
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawButterfly(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);
  const wingFlap = Math.abs(Math.sin(time * 12));

  // Wings
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.ellipse(-10 * wingFlap, -6, 12 * wingFlap, 9, -0.2, 0, Math.PI * 2);
  ctx.ellipse(10 * wingFlap, -6, 12 * wingFlap, 9, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Little body
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.ellipse(0, 0, 3, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSeaweed(ctx: CanvasRenderingContext2D, x: number, y: number, time: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i <= 4; i++) {
    const segmentY = y - i * 32;
    const wave = Math.sin(time * 2 + i * 0.8) * 16;
    ctx.lineTo(x + wave, segmentY);
  }
  ctx.stroke();
  ctx.restore();
}

function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail fin
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(-28, -10);
  ctx.lineTo(-28, 10);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(8, -3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(9, -3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawMushroom(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, capColor: string) {
  ctx.save();
  ctx.translate(x, y);

  // Stem
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.roundRect(-size * 0.25, -size * 0.8, size * 0.5, size * 0.8, 6);
  ctx.fill();

  // Cap
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.arc(0, -size * 0.8, size * 0.7, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // White polka dots
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size * 0.3, -size * 1.1, size * 0.12, 0, Math.PI * 2);
  ctx.arc(0, -size * 1.3, size * 0.14, 0, Math.PI * 2);
  ctx.arc(size * 0.3, -size * 1.1, size * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBalloon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.translate(x, y);

  // String
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.quadraticCurveTo(-6, 45, 4, 70);
  ctx.stroke();

  // Balloon body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Balloon knot
  ctx.beginPath();
  ctx.moveTo(-4, 24);
  ctx.lineTo(4, 24);
  ctx.lineTo(0, 28);
  ctx.closePath();
  ctx.fill();

  // Shiny highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-6, -8, 5, 10, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
