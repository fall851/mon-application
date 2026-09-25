import { AspectRatio, LyricLine, LyricThemeId, StudioConfig } from '../types';
import { drawMascot } from './mascots';
import { drawScene } from './scenes';

export interface RenderState {
  canvas: HTMLCanvasElement;
  config: StudioConfig;
  lyrics: LyricLine[];
  currentTime: number;
  mascotAction?: 'idle' | 'wave' | 'spin' | 'jump';
}

export function getResolutionForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case '16:9':
      return { width: 1280, height: 720 };
    case '9:16':
      return { width: 720, height: 1280 };
    case '1:1':
      return { width: 800, height: 800 };
  }
}

export function renderStageFrame({ canvas, config, lyrics, currentTime, mascotAction }: RenderState) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;

  // 1. Draw Background Scene
  drawScene(config.scene, {
    ctx,
    width,
    height,
    time: currentTime,
    bpm: config.bpm,
  });

  // 2. Determine if lyrics are currently active
  const activeLine = lyrics.find((l) => currentTime >= l.startTime - 0.2 && currentTime <= l.endTime + 0.3);
  const isSinging = !!activeLine && activeLine.words.some((w) => currentTime >= w.startTime && currentTime <= w.endTime);

  // 3. Draw Mascot
  const mascotCanvasX = width * config.mascotX;
  const mascotCanvasY = height * config.mascotY;

  drawMascot(config.mascot, {
    ctx,
    x: mascotCanvasX,
    y: mascotCanvasY,
    scale: config.mascotScale * (width < 800 ? 0.85 : 1.0),
    time: currentTime,
    bpm: config.bpm,
    isSinging,
    action: mascotAction,
  });

  // 4. Draw Floating Musical Notes
  if (config.particlesEnabled) {
    drawMusicalParticles(ctx, width, height, currentTime);
  }

  // 5. Draw Header / Dedication Banner
  if (config.showDedication && (config.title || config.dedication)) {
    drawDedicationBanner(ctx, width, height, config.title, config.dedication);
  }

  // 6. Draw Karaoke Lyrics with Bouncing Star
  drawKaraoke(ctx, width, height, lyrics, currentTime, config.showBouncingBall, config.lyricTheme);
}

/**
 * Draw top banner with song title and custom dedication
 */
function drawDedicationBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  dedication: string
) {
  ctx.save();
  const bannerY = height * 0.05;
  const bannerH = 48;
  const bannerW = Math.min(width * 0.85, 680);
  const bannerX = (width - bannerW) / 2;

  // Frosted Glass pill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 24);
  ctx.fill();
  ctx.stroke();

  // Text content
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Fredoka", sans-serif';

  const fullText = dedication ? `🎵 ${title}  ·  🎈 ${dedication}` : `🎵 ${title}`;
  ctx.fillText(fullText, width / 2, bannerY + bannerH / 2);

  ctx.restore();
}

/**
 * Draw Floating Musical Notes
 */
function drawMusicalParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const notes = ['♪', '♫', '♬', '♩', '✨'];
  const count = 12;

  ctx.save();
  ctx.font = 'bold 24px sans-serif';

  for (let i = 0; i < count; i++) {
    const x = ((i * 123 + time * 35) % width);
    const y = height * 0.85 - ((i * 71 + time * 55) % (height * 0.7));
    const alpha = Math.sin((y / height) * Math.PI) * 0.75;
    const noteChar = notes[i % notes.length];

    ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0, alpha)})`;
    ctx.fillText(noteChar, x, y);
  }

  ctx.restore();
}

/**
 * Draw Karaoke Subtitles & Bouncing Star
 */
function drawKaraoke(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lyrics: LyricLine[],
  currentTime: number,
  showBouncingBall: boolean,
  theme: LyricThemeId
) {
  // Find currently active line
  let activeIndex = lyrics.findIndex(
    (l) => currentTime >= l.startTime - 0.25 && currentTime <= l.endTime + 0.5
  );

  // If between lines, find upcoming line
  if (activeIndex === -1) {
    activeIndex = lyrics.findIndex((l) => currentTime < l.startTime);
  }

  if (activeIndex === -1) return;

  const currentLine = lyrics[activeIndex];
  const nextLine = lyrics[activeIndex + 1];

  const karaokeAreaY = height * 0.82;

  ctx.save();

  // Background karaoke shadow ribbon for 100% legibility
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  const ribbonH = nextLine ? 110 : 70;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, karaokeAreaY - 40, width * 0.9, ribbonH, 20);
  ctx.fill();

  // Font setup
  const fontSize = Math.min(width * 0.046, 38);
  ctx.font = `700 ${fontSize}px "Fredoka", "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Measure and render active line
  const words = currentLine.words;
  const totalLineText = words.map((w) => w.word).join(' ');
  const totalWidth = ctx.measureText(totalLineText).width;
  let cursorX = (width - totalWidth) / 2;

  let bouncingBallPos: { x: number; y: number } | null = null;

  // Render each word
  for (const w of words) {
    const wordWidth = ctx.measureText(w.word + ' ').width;

    const isCurrent = currentTime >= w.startTime && currentTime <= w.endTime;
    const isPast = currentTime > w.endTime;

    // Calculate Bouncing Ball / Star position
    if (showBouncingBall) {
      if (isCurrent) {
        const progress = Math.max(0, Math.min(1, (currentTime - w.startTime) / (w.endTime - w.startTime)));
        const parabola = -Math.sin(progress * Math.PI) * 36;
        bouncingBallPos = {
          x: cursorX + wordWidth * progress,
          y: karaokeAreaY - 32 + parabola,
        };
      }
    }

    // Word Colors
    const { fill, stroke, glow } = getThemeColors(theme, isCurrent, isPast);

    ctx.save();
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke;
    ctx.strokeText(w.word, cursorX, karaokeAreaY);

    if (glow && isCurrent) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16;
    }

    ctx.fillStyle = fill;
    ctx.fillText(w.word, cursorX, karaokeAreaY);
    ctx.restore();

    cursorX += wordWidth;
  }

  // Render Preview Next Line (smaller, gentle opacity)
  if (nextLine) {
    const previewFontSize = fontSize * 0.65;
    ctx.font = `600 ${previewFontSize}px "Fredoka", "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeText(nextLine.text, width / 2, karaokeAreaY + 42);
    ctx.fillText(nextLine.text, width / 2, karaokeAreaY + 42);
  }

  // Draw Bouncing Golden Star
  if (showBouncingBall && bouncingBallPos) {
    drawBouncingStar(ctx, bouncingBallPos.x, bouncingBallPos.y, currentTime);
  }

  ctx.restore();
}

/**
 * Draw Bouncing Star
 */
function drawBouncingStar(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 3);

  // Star glow
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 18;

  // Star shape
  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  const spikes = 5;
  const outerR = 16;
  const innerR = 8;
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

  ctx.restore();
}

function getThemeColors(theme: LyricThemeId, isCurrent: boolean, isPast: boolean) {
  if (theme === 'rainbow') {
    if (isCurrent) {
      return { fill: '#fde047', stroke: '#991b1b', glow: '#fbbf24' };
    }
    if (isPast) {
      return { fill: '#fed7aa', stroke: '#1e293b', glow: undefined };
    }
    return { fill: '#ffffff', stroke: '#0f172a', glow: undefined };
  }

  if (theme === 'gold') {
    if (isCurrent) {
      return { fill: '#fef08a', stroke: '#713f12', glow: '#eab308' };
    }
    if (isPast) {
      return { fill: '#fef9c3', stroke: '#1e293b', glow: undefined };
    }
    return { fill: '#ffffff', stroke: '#0f172a', glow: undefined };
  }

  if (theme === 'ocean') {
    if (isCurrent) {
      return { fill: '#38bdf8', stroke: '#082f49', glow: '#0284c7' };
    }
    if (isPast) {
      return { fill: '#bae6fd', stroke: '#0c4a6e', glow: undefined };
    }
    return { fill: '#ffffff', stroke: '#0f172a', glow: undefined };
  }

  if (theme === 'candy') {
    if (isCurrent) {
      return { fill: '#f472b6', stroke: '#831843', glow: '#ec4899' };
    }
    if (isPast) {
      return { fill: '#fbcfe8', stroke: '#1e293b', glow: undefined };
    }
    return { fill: '#ffffff', stroke: '#0f172a', glow: undefined };
  }

  // Neon
  if (isCurrent) {
    return { fill: '#4ade80', stroke: '#052e16', glow: '#22c55e' };
  }
  if (isPast) {
    return { fill: '#bbf7d0', stroke: '#0f172a', glow: undefined };
  }
  return { fill: '#ffffff', stroke: '#0f172a', glow: undefined };
}
