import { MascotId } from '../types';

export interface MascotContext {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  scale: number;
  time: number;
  bpm: number;
  isSinging: boolean;
  action?: 'idle' | 'wave' | 'spin' | 'jump';
}

export function drawMascot(mascotId: MascotId, mc: MascotContext) {
  const { ctx, x, y, scale, time, bpm, action } = mc;

  ctx.save();
  ctx.translate(x, y);

  // Beat rhythm bounce
  const beatsPerSec = bpm / 60;
  const beatPhase = (time * beatsPerSec) % 1;
  const bounceY = -Math.abs(Math.sin(beatPhase * Math.PI)) * 18 * scale;
  ctx.translate(0, bounceY);

  // Dynamic Action modifiers
  let rotation = 0;
  let jumpExtra = 0;

  if (action === 'spin') {
    rotation = time * Math.PI * 4;
  } else if (action === 'jump') {
    jumpExtra = -Math.abs(Math.sin(time * 8)) * 35 * scale;
  } else {
    // Gentle sway to the beat
    rotation = Math.sin(time * beatsPerSec * Math.PI) * 0.08;
  }

  ctx.translate(0, jumpExtra);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  switch (mascotId) {
    case 'souris':
      drawSourisVerte(mc);
      break;
    case 'crocodile':
      drawCrocodile(mc);
      break;
    case 'escargot':
      drawEscargot(mc);
      break;
    case 'etoile':
      drawEtoile(mc);
      break;
    case 'ourson':
      drawOurson(mc);
      break;
    case 'caneton':
      drawCaneton(mc);
      break;
    case 'tortue':
      drawTortue(mc);
      break;
  }

  ctx.restore();
}

/**
 * 1. Souris Verte
 */
function drawSourisVerte({ ctx, isSinging, time }: MascotContext) {
  // Swaying tail
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(35, 45);
  ctx.quadraticCurveTo(70 + Math.sin(time * 5) * 15, 60, 55, 90 + Math.cos(time * 5) * 10);
  ctx.stroke();

  // Body
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.ellipse(0, 40, 48, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // White tummy patch
  ctx.fillStyle = '#bbf7d0';
  ctx.beginPath();
  ctx.ellipse(0, 44, 30, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Feet
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(-24, 90, 16, 10, -0.2, 0, Math.PI * 2);
  ctx.ellipse(24, 90, 16, 10, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(0, -15, 46, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  // Left ear
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(-42, -50, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(-42, -50, 16, 0, Math.PI * 2);
  ctx.fill();
  // Right ear
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(42, -50, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(42, -50, 16, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (blinking periodically)
  const isBlinking = Math.sin(time * 3) > 0.96;
  if (isBlinking) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-16, -20, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.arc(16, -20, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  } else {
    // White of eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-16, -22, 10, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(16, -22, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-14, -22, 5, 0, Math.PI * 2);
    ctx.arc(18, -22, 5, 0, Math.PI * 2);
    ctx.fill();

    // White shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-16, -25, 2.5, 0, Math.PI * 2);
    ctx.arc(16, -25, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pink cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
  ctx.beginPath();
  ctx.arc(-28, -6, 9, 0, Math.PI * 2);
  ctx.arc(28, -6, 9, 0, Math.PI * 2);
  ctx.fill();

  // Cute pink nose
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.ellipse(0, -9, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  // Left whiskers
  ctx.beginPath();
  ctx.moveTo(-12, -7);
  ctx.lineTo(-44, -13);
  ctx.moveTo(-12, -4);
  ctx.lineTo(-46, -1);
  ctx.stroke();
  // Right whiskers
  ctx.beginPath();
  ctx.moveTo(12, -7);
  ctx.lineTo(44, -13);
  ctx.moveTo(12, -4);
  ctx.lineTo(46, -1);
  ctx.stroke();

  // Singing Mouth / Smile
  if (isSinging) {
    const mouthOpen = 8 + Math.abs(Math.sin(time * 12)) * 10;
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.ellipse(0, 4, 12, mouthOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    // Little pink tongue
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(0, 4 + mouthOpen * 0.4, 7, 0, Math.PI);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -2, 10, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  // Little paws clapping / holding
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(-26 + Math.sin(time * 6) * 4, 32, 11, 0, Math.PI * 2);
  ctx.arc(26 - Math.sin(time * 6) * 4, 32, 11, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 2. Crocodile Rigolo
 */
function drawCrocodile({ ctx, isSinging, time }: MascotContext) {
  // Wagging tail
  ctx.fillStyle = '#0d9488';
  ctx.beginPath();
  ctx.moveTo(35, 40);
  ctx.quadraticCurveTo(80 + Math.sin(time * 6) * 15, 45, 95, 75);
  ctx.lineTo(75, 80);
  ctx.quadraticCurveTo(55, 60, 25, 65);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#14b8a6';
  ctx.beginPath();
  ctx.ellipse(0, 45, 52, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Yellow belly with lines
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(0, 50, 32, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  for (let l = 28; l <= 68; l += 12) {
    ctx.beginPath();
    ctx.moveTo(-16, l);
    ctx.lineTo(16, l);
    ctx.stroke();
  }

  // Big Snout / Head
  ctx.fillStyle = '#14b8a6';
  ctx.beginPath();
  ctx.ellipse(0, -10, 50, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye bumps
  ctx.beginPath();
  ctx.arc(-20, -38, 20, 0, Math.PI * 2);
  ctx.arc(20, -38, 20, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-20, -38, 14, 0, Math.PI * 2);
  ctx.arc(20, -38, 14, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-18, -38, 6, 0, Math.PI * 2);
  ctx.arc(22, -38, 6, 0, Math.PI * 2);
  ctx.fill();

  // Red Bow Tie
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(-18, 4);
  ctx.lineTo(-18, 20);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(18, 4);
  ctx.lineTo(18, 20);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 12, 5, 0, Math.PI * 2);
  ctx.fill();

  // Nostrils
  ctx.fillStyle = '#0f766e';
  ctx.beginPath();
  ctx.arc(-10, -8, 3.5, 0, Math.PI * 2);
  ctx.arc(10, -8, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth & Cute Teeth
  if (isSinging) {
    const mouthH = 10 + Math.abs(Math.sin(time * 10)) * 12;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, 2, 22, mouthH, 0, 0, Math.PI * 2);
    ctx.fill();
    // White teeth
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-16, 2 - mouthH * 0.7);
    ctx.lineTo(-12, 2);
    ctx.lineTo(-8, 2 - mouthH * 0.7);
    ctx.lineTo(-4, 2);
    ctx.lineTo(0, 2 - mouthH * 0.7);
    ctx.lineTo(4, 2);
    ctx.lineTo(8, 2 - mouthH * 0.7);
    ctx.lineTo(12, 2);
    ctx.lineTo(16, 2 - mouthH * 0.7);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -6, 22, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  // Little legs
  ctx.fillStyle = '#0d9488';
  ctx.beginPath();
  ctx.ellipse(-26, 92, 14, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(26, 92, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 3. Petit Escargot
 */
function drawEscargot({ ctx, isSinging, time }: MascotContext) {
  // Snail body base
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(-15, 65, 55, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail tip
  ctx.beginPath();
  ctx.moveTo(35, 65);
  ctx.quadraticCurveTo(55, 68, 65, 60);
  ctx.quadraticCurveTo(50, 72, 35, 75);
  ctx.closePath();
  ctx.fill();

  // Big Spiral Shell
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(8, 25, 48, 0, Math.PI * 2);
  ctx.fill();

  // Shell Polka Dots
  ctx.fillStyle = '#fef08a';
  const dots = [
    [-15, 10, 7],
    [10, 0, 8],
    [32, 18, 7],
    [5, 42, 8],
    [-20, 32, 6],
    [15, 24, 10],
  ];
  dots.forEach(([dx, dy, dr]) => {
    ctx.beginPath();
    ctx.arc(8 + dx, 25 + dy, dr, 0, Math.PI * 2);
    ctx.fill();
  });

  // Spiral line
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(8, 25, 30, 0, 1.6 * Math.PI);
  ctx.stroke();

  // Neck and Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(-52, 35, 20, 32, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eye Antennae (Swaying)
  const swayAnt = Math.sin(time * 4) * 6;
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-58, 12);
  ctx.quadraticCurveTo(-66 + swayAnt, -10, -72 + swayAnt, -22);
  ctx.moveTo(-46, 12);
  ctx.quadraticCurveTo(-42 - swayAnt, -10, -40 - swayAnt, -22);
  ctx.stroke();

  // Eyes on top of antennae
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-72 + swayAnt, -22, 11, 0, Math.PI * 2);
  ctx.arc(-40 - swayAnt, -22, 11, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-70 + swayAnt, -22, 5, 0, Math.PI * 2);
  ctx.arc(-42 - swayAnt, -22, 5, 0, Math.PI * 2);
  ctx.fill();

  // Blushing cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.6)';
  ctx.beginPath();
  ctx.arc(-62, 36, 7, 0, Math.PI * 2);
  ctx.fill();

  // Smile or Singing mouth
  if (isSinging) {
    const mh = 6 + Math.abs(Math.sin(time * 11)) * 8;
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(-54, 42, 7, mh, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-54, 38, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }
}

/**
 * 4. Étoile Dorée
 */
function drawEtoile({ ctx, isSinging, time }: MascotContext) {
  // Golden Star Shape
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;

  ctx.beginPath();
  const spikes = 5;
  const outerR = 65;
  const innerR = 32;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cheerful eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-16, -6, 7, 0, Math.PI * 2);
  ctx.arc(16, -6, 7, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-18, -8, 2.5, 0, Math.PI * 2);
  ctx.arc(14, -8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Rosy blush
  ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
  ctx.beginPath();
  ctx.arc(-26, 6, 8, 0, Math.PI * 2);
  ctx.arc(26, 6, 8, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  if (isSinging) {
    const sOpen = 6 + Math.abs(Math.sin(time * 12)) * 8;
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.ellipse(0, 10, 9, sOpen, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 4, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // Waving little hands with gloves
  const waveArm = Math.sin(time * 8) * 12;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  // Left hand
  ctx.beginPath();
  ctx.arc(-55, 10 + waveArm, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Right hand
  ctx.beginPath();
  ctx.arc(55, 10 - waveArm, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

/**
 * 5. Ourson Câlin
 */
function drawOurson({ ctx, isSinging, time }: MascotContext) {
  // Body
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, 42, 46, 52, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly patch
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.ellipse(0, 48, 28, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.arc(-25, 90, 16, 0, Math.PI * 2);
  ctx.arc(25, 90, 16, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(0, -18, 44, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.arc(-36, -52, 20, 0, Math.PI * 2);
  ctx.arc(36, -52, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(-36, -52, 11, 0, Math.PI * 2);
  ctx.arc(36, -52, 11, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(0, -10, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(0, -16, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-16, -24, 5.5, 0, Math.PI * 2);
  ctx.arc(16, -24, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  if (isSinging) {
    const oMouth = 6 + Math.abs(Math.sin(time * 11)) * 9;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, -4, 9, oMouth, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  // Holding Honey Jar
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-15, 30, 30, 32);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 30, 16, Math.PI, 0, false);
  ctx.fill();
  // Honey label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MIEL', 0, 48);
}

/**
 * 6. Petit Caneton
 */
function drawCaneton({ ctx, isSinging, time }: MascotContext) {
  // Baby Duck Body
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(0, 36, 44, 48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Little tail feathers
  ctx.beginPath();
  ctx.moveTo(35, 36);
  ctx.lineTo(55, 26 + Math.sin(time * 8) * 6);
  ctx.lineTo(40, 48);
  ctx.closePath();
  ctx.fill();

  // Orange webbed feet
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.ellipse(-18, 84, 15, 8, -0.2, 0, Math.PI * 2);
  ctx.ellipse(18, 84, 15, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Little wings flapping
  const wingFlap = Math.sin(time * 8) * 10;
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.ellipse(-34, 34 + wingFlap, 14, 22, 0.3, 0, Math.PI * 2);
  ctx.ellipse(34, 34 - wingFlap, 14, 22, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, -16, 40, 0, Math.PI * 2);
  ctx.fill();

  // Cheerful tuft of hair
  ctx.beginPath();
  ctx.arc(0, -56, 8, 0, Math.PI * 2);
  ctx.arc(6, -60, 6, 0, Math.PI * 2);
  ctx.fill();

  // Big cute eyes
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-16, -20, 8, 0, Math.PI * 2);
  ctx.arc(16, -20, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-18, -23, 3, 0, Math.PI * 2);
  ctx.arc(14, -23, 3, 0, Math.PI * 2);
  ctx.fill();

  // Orange Beak that opens when singing
  ctx.fillStyle = '#f97316';
  if (isSinging) {
    const beakOpen = 6 + Math.abs(Math.sin(time * 12)) * 10;
    // Upper beak
    ctx.beginPath();
    ctx.ellipse(0, -4 - beakOpen * 0.4, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Mouth cavity
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, -4, 14, beakOpen * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lower beak
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(0, -4 + beakOpen * 0.5, 17, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, -4, 20, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -4);
    ctx.lineTo(18, -4);
    ctx.stroke();
  }
}

/**
 * 7. Maman Tortue
 */
function drawTortue({ ctx, isSinging, time }: MascotContext) {
  // Patterned Green Shell
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(0, 20, 52, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // Shell rim
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.roundRect(-56, 16, 112, 16, 8);
  ctx.fill();

  // Hexagon patterns on shell
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.arc(0, -6, 16, 0, Math.PI * 2);
  ctx.arc(-26, 6, 12, 0, Math.PI * 2);
  ctx.arc(26, 6, 12, 0, Math.PI * 2);
  ctx.fill();

  // 4 cute walking legs
  ctx.fillStyle = '#22c55e';
  const legWalk = Math.sin(time * 6) * 6;
  ctx.beginPath();
  ctx.arc(-42 + legWalk, 36, 14, 0, Math.PI * 2);
  ctx.arc(-18 - legWalk, 36, 14, 0, Math.PI * 2);
  ctx.arc(18 + legWalk, 36, 14, 0, Math.PI * 2);
  ctx.arc(42 - legWalk, 36, 14, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(-48, -14, 24, 0, Math.PI * 2);
  ctx.fill();

  // Cute hat with flower
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(-48, -36, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-58, -36, 20, 4);

  // Big friendly eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-54, -18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-56, -18, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Smile or singing mouth
  if (isSinging) {
    const tmOpen = 4 + Math.abs(Math.sin(time * 10)) * 6;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(-48, -4, 7, tmOpen, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-48, -8, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }
}
