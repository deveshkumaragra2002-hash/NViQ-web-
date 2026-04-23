import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

interface RabbitPose {
  x: number;
  y: number;
  frontLead: number;
  frontTrail: number;
  rearLead: number;
  rearTrail: number;
  torsoStretch: number;
  torsoCompress: number;
  headTilt: number;
  earLead: number;
  earTrail: number;
}

@Component({
  selector: 'app-rabbit-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="fullScreen"
      class="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style="background: radial-gradient(circle at 20% 10%, #0D1627 0%, #080E19 38%, #060A12 72%, #04070D 100%)"
    >
      <div
        class="absolute top-[16%] left-[10%] w-[540px] h-[380px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.02) 45%, transparent 72%); filter: blur(100px); animation: auraPulse 3.8s ease-in-out infinite"
      ></div>
      <div
        class="absolute bottom-[18%] right-[8%] w-[500px] h-[340px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.01) 44%, transparent 75%); filter: blur(95px); animation: auraPulse 4.6s ease-in-out infinite"
      ></div>

      <div class="relative z-10 w-full flex flex-col items-center px-4">
        <div class="mb-3 flex flex-col items-center select-none">
          <span class="text-white" style="font-size:36px; font-weight:800; letter-spacing:-0.05em">
            NVi<span style="background: linear-gradient(120deg, #3B82F6, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Q</span>
          </span>
          <div class="h-[2px] mt-2 rounded-full w-14" style="background: linear-gradient(90deg, transparent, rgba(56,189,248,0.9), transparent)"></div>
        </div>

        <p class="text-[#94A3B8] mb-4" style="font-size:13px; font-weight:500; letter-spacing:0.02em">
          Initializing fleet intelligence...
        </p>

        <div class="w-full max-w-[860px] px-2 sm:px-6">
          <canvas #rabbitCanvas class="w-full h-[220px] sm:h-[250px]" style="background: transparent"></canvas>
        </div>

        <div class="w-full max-w-[430px] px-4 mt-1">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-[#64748B]" style="font-size:11px; font-weight:500">Preparing systems</span>
            <span
              style="font-size:13px; font-weight:700; background: linear-gradient(90deg, #93C5FD, #67E8F9); -webkit-background-clip:text; -webkit-text-fill-color:transparent"
            >
              {{ progressPercent }}%
            </span>
          </div>

          <div class="relative h-[5px] rounded-full overflow-hidden" style="background: rgba(148,163,184,0.16)">
            <div
              class="absolute inset-y-0 left-0 rounded-full"
              [style.width.%]="progressPercent"
              style="background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 58%, #67E8F9 100%); transition: width 0.08s linear"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!fullScreen" class="flex flex-col items-center gap-4 w-full max-w-[500px]">
      <canvas #rabbitCanvas class="w-full" [style.height.px]="height" style="background: transparent"></canvas>
      <p *ngIf="text" class="text-[#64748B] animate-pulse" style="font-size:12px; font-weight:500; letter-spacing:0.05em">{{ text }}</p>
    </div>
  `,
  styles: [`
    @keyframes auraPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.03); }
    }
  `],
})
export class RabbitLoaderComponent implements AfterViewInit, OnDestroy {
  @Input() fullScreen = false;
  @Input() duration = 3600;
  @Input() height = 120;
  @Input() text = 'Loading...';
  @ViewChild('rabbitCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  progress = 0;
  progressPercent = 0;

  private animId = 0;
  private startTime = 0;
  private lastFrame = 0;
  private renderWidth = 0;
  private renderHeight = 0;
  private rabbitHistory: Point[] = [];
  private trailParticles: TrailParticle[] = [];
  private ambientParticles: AmbientParticle[] = [];
  private particleAccumulator = 0;

  ngAfterViewInit(): void {
    this.startAnimation();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private startAnimation(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const shouldLoop = !this.fullScreen;

    const render = (now: number) => {
      if (!this.startTime) {
        this.startTime = now;
        this.lastFrame = now;
      }

      const delta = Math.min(34, now - this.lastFrame);
      this.lastFrame = now;
      const elapsed = now - this.startTime;

      const rawProgress = shouldLoop
        ? (elapsed % this.duration) / this.duration
        : Math.min(1, elapsed / this.duration);

      this.progress = rawProgress;
      this.progressPercent = Math.round(rawProgress * 100);

      const { width, height } = this.ensureCanvasSize(canvas, ctx);
      const groundY = height * (this.fullScreen ? 0.73 : 0.71);

      ctx.clearRect(0, 0, width, height);

      this.updateAmbient(delta, width, height);
      this.drawAmbient(ctx);

      const easedTravel = shouldLoop ? rawProgress : this.easeInOutSine(rawProgress);
      const rabbitX = -90 + (width + 180) * easedTravel;
      const phase = (elapsed * 0.001) * 7.1 * Math.PI * 2;
      const torsoDrive = Math.sin(phase * 2 + 0.3);
      const rabbitY = groundY - 26 + Math.sin(phase * 2) * 1.3 - Math.abs(Math.sin(phase + 0.4)) * 1.5;

      const pose: RabbitPose = {
        x: rabbitX,
        y: rabbitY,
        frontLead: Math.sin(phase),
        frontTrail: Math.sin(phase + Math.PI),
        rearLead: Math.sin(phase + Math.PI),
        rearTrail: Math.sin(phase),
        torsoStretch: 1 + torsoDrive * 0.07,
        torsoCompress: 1 - torsoDrive * 0.055,
        headTilt: Math.sin(phase + 0.8) * 0.07,
        earLead: Math.sin(phase + 0.5) * 0.16,
        earTrail: Math.sin(phase + 1.2) * 0.12,
      };

      this.rabbitHistory.push({ x: rabbitX, y: rabbitY });
      if (this.rabbitHistory.length > 36) {
        this.rabbitHistory.shift();
      }

      this.particleAccumulator += delta;
      while (this.particleAccumulator >= 26) {
        this.particleAccumulator -= 26;
        this.emitTrailParticles();
      }

      this.updateTrailParticles(delta);
      this.drawTrailParticles(ctx);

      this.drawGround(ctx, width, groundY, rabbitX, phase);
      this.drawRabbitAura(ctx, pose);
      this.drawRabbitReflection(ctx, width, height, groundY, pose);
      this.drawRabbit(ctx, pose, false);

      if (shouldLoop || rawProgress < 1) {
        this.animId = requestAnimationFrame(render);
      }
    };

    this.animId = requestAnimationFrame(render);
  }

  private ensureCanvasSize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): { width: number; height: number } {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (width !== this.renderWidth || height !== this.renderHeight) {
      this.renderWidth = width;
      this.renderHeight = height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      this.seedAmbientParticles(width, height);
      this.rabbitHistory = [];
      this.trailParticles = [];
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width, height };
  }

  private seedAmbientParticles(width: number, height: number): void {
    const count = this.fullScreen ? 34 : 18;
    this.ambientParticles = [];

    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.92),
        vx: (Math.random() - 0.5) * 0.05,
        vy: -0.015 - Math.random() * 0.06,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.09 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  private updateAmbient(delta: number, width: number, height: number): void {
    const drift = delta * 0.06;

    for (const dot of this.ambientParticles) {
      dot.x += dot.vx * drift;
      dot.y += dot.vy * drift;
      dot.phase += 0.0023 * delta;

      if (dot.y < -10) {
        dot.y = height + 6;
        dot.x = Math.random() * width;
      }

      if (dot.x < -8) {
        dot.x = width + 8;
      } else if (dot.x > width + 8) {
        dot.x = -8;
      }
    }
  }

  private drawAmbient(ctx: CanvasRenderingContext2D): void {
    for (const dot of this.ambientParticles) {
      const opacity = dot.alpha * (0.62 + Math.sin(dot.phase) * 0.38);
      ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0.02, opacity)})`;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private emitTrailParticles(): void {
    if (this.rabbitHistory.length < 10) {
      return;
    }

    const anchor = this.rabbitHistory[Math.max(0, this.rabbitHistory.length - 10)];

    for (let i = 0; i < 2; i++) {
      this.trailParticles.push({
        x: anchor.x - 18 + (Math.random() - 0.5) * 6,
        y: anchor.y - 2 + (Math.random() - 0.5) * 8,
        vx: -0.8 - Math.random() * 1.6,
        vy: (Math.random() - 0.5) * 0.8,
        size: 2.1 + Math.random() * 2.8,
        alpha: 0.26 + Math.random() * 0.3,
        decay: 0.93 + Math.random() * 0.03,
      });
    }

    if (this.trailParticles.length > 180) {
      this.trailParticles.splice(0, this.trailParticles.length - 180);
    }
  }

  private updateTrailParticles(delta: number): void {
    const step = delta * 0.06;

    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const p = this.trailParticles[i];
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.vy += 0.0045 * step;
      p.alpha *= p.decay;

      if (p.alpha < 0.02) {
        this.trailParticles.splice(i, 1);
      }
    }
  }

  private drawTrailParticles(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const p of this.trailParticles) {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.1);
      g.addColorStop(0, `rgba(186, 230, 253, ${p.alpha})`);
      g.addColorStop(0.4, `rgba(56, 189, 248, ${p.alpha * 0.85})`);
      g.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha * 0.28})`;
      ctx.lineWidth = Math.max(0.7, p.size * 0.22);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 6, p.y + 1.2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawGround(ctx: CanvasRenderingContext2D, width: number, groundY: number, rabbitX: number, phase: number): void {
    const groundLine = ctx.createLinearGradient(0, groundY, width, groundY);
    groundLine.addColorStop(0, 'rgba(30, 64, 175, 0.04)');
    groundLine.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
    groundLine.addColorStop(1, 'rgba(30, 64, 175, 0.04)');

    ctx.strokeStyle = groundLine;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    const streakStart = rabbitX - 170;
    const streakEnd = rabbitX + 42;
    const streak = ctx.createLinearGradient(streakStart, groundY + 5, streakEnd, groundY + 5);
    streak.addColorStop(0, 'rgba(56, 189, 248, 0)');
    streak.addColorStop(0.5, `rgba(56, 189, 248, ${0.28 + 0.09 * Math.sin(phase * 1.5)})`);
    streak.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = streak;
    ctx.fillRect(streakStart, groundY + 4.6, streakEnd - streakStart, 2.4);
  }

  private drawRabbitAura(ctx: CanvasRenderingContext2D, pose: RabbitPose): void {
    const aura = ctx.createRadialGradient(pose.x + 7, pose.y - 8, 0, pose.x + 7, pose.y - 8, 64);
    aura.addColorStop(0, 'rgba(186, 230, 253, 0.15)');
    aura.addColorStop(0.35, 'rgba(56, 189, 248, 0.14)');
    aura.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(pose.x + 7, pose.y - 8, 64, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawRabbitReflection(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundY: number,
    pose: RabbitPose,
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, groundY + 1, width, height - groundY);
    ctx.clip();

    ctx.translate(0, groundY * 2 + 2);
    ctx.scale(1, -1);
    ctx.globalAlpha = 0.16;
    this.drawRabbit(ctx, pose, true);
    ctx.restore();

    const fade = ctx.createLinearGradient(0, groundY + 2, 0, groundY + 56);
    fade.addColorStop(0, 'rgba(8, 10, 18, 0.08)');
    fade.addColorStop(1, 'rgba(8, 10, 18, 0.74)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, groundY + 2, width, 56);
  }

  private drawRabbit(ctx: CanvasRenderingContext2D, pose: RabbitPose, reflection: boolean): void {
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const farAlpha = reflection ? 0.27 : 0.42;
    const nearAlpha = reflection ? 0.36 : 0.95;

    this.drawLeg(ctx, -10, 4, 15, 14, 2.12 + 0.72 * pose.rearTrail, -0.84 + 0.35 * pose.rearTrail, 3.6, farAlpha);
    this.drawLeg(ctx, 12, 4, 13, 13, 1.06 - 0.58 * pose.frontTrail, 0.56 + 0.3 * pose.frontTrail, 3.3, farAlpha);

    ctx.save();
    ctx.scale(pose.torsoStretch, pose.torsoCompress);

    const torso = ctx.createLinearGradient(-30, -14, 30, 14);
    torso.addColorStop(0, reflection ? 'rgba(241,245,249,0.46)' : '#F8FAFC');
    torso.addColorStop(0.55, reflection ? 'rgba(226,232,240,0.38)' : '#E2E8F0');
    torso.addColorStop(1, reflection ? 'rgba(148,163,184,0.3)' : '#CBD5E1');

    ctx.fillStyle = torso;
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 14.5, -0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = reflection ? 'rgba(203,213,225,0.2)' : 'rgba(148,163,184,0.28)';
    ctx.beginPath();
    ctx.ellipse(-4, 4, 20, 7, -0.15, 0, Math.PI * 2);
    ctx.fill();

    if (!reflection) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.44)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 14.5, -0.06, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    this.drawLeg(ctx, -12, 6, 16, 15, 2.08 + 0.8 * pose.rearLead, -0.88 + 0.38 * pose.rearLead, 4.5, nearAlpha);
    this.drawLeg(ctx, 13, 6, 14, 13, 1.02 - 0.64 * pose.frontLead, 0.52 + 0.34 * pose.frontLead, 4.1, nearAlpha);

    ctx.save();
    ctx.translate(28, -10);
    ctx.rotate(pose.headTilt);

    const head = ctx.createLinearGradient(-8, -10, 16, 12);
    head.addColorStop(0, reflection ? 'rgba(248,250,252,0.46)' : '#F8FAFC');
    head.addColorStop(1, reflection ? 'rgba(203,213,225,0.36)' : '#DDE6F2');

    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 10, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = reflection ? 'rgba(226,232,240,0.24)' : '#E2E8F0';
    ctx.beginPath();
    ctx.ellipse(10.2, 1.5, 4.3, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!reflection) {
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(2.4, -1.8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(2.8, -2.2, 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    this.drawEar(ctx, 22, -23, -0.36 + pose.earLead, 16.5, reflection, 0.9);
    this.drawEar(ctx, 27.5, -24, -0.13 + pose.earTrail, 15.2, reflection, 0.76);

    ctx.fillStyle = reflection ? 'rgba(241,245,249,0.38)' : 'rgba(248,250,252,0.94)';
    ctx.beginPath();
    ctx.arc(-25, -3, 5.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawLeg(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    upperLen: number,
    lowerLen: number,
    upperAngle: number,
    lowerAngle: number,
    width: number,
    alpha: number,
  ): void {
    const kneeX = x + Math.cos(upperAngle) * upperLen;
    const kneeY = y + Math.sin(upperAngle) * upperLen;
    const footX = kneeX + Math.cos(upperAngle + lowerAngle) * lowerLen;
    const footY = kneeY + Math.sin(upperAngle + lowerAngle) * lowerLen;

    ctx.save();
    ctx.globalAlpha *= alpha;

    const legColor = 'rgba(226, 232, 240, 0.95)';
    ctx.strokeStyle = legColor;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(footX, footY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
    ctx.beginPath();
    ctx.arc(kneeX, kneeY, width * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(203, 213, 225, 0.88)';
    ctx.lineWidth = Math.max(1.5, width * 0.36);
    ctx.beginPath();
    ctx.moveTo(footX - 1.8, footY);
    ctx.lineTo(footX + 4.2, footY + 0.3);
    ctx.stroke();

    ctx.restore();
  }

  private drawEar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number,
    reflection: boolean,
    alpha: number,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha *= alpha;

    ctx.fillStyle = reflection ? 'rgba(226,232,240,0.4)' : '#F1F5F9';
    ctx.beginPath();
    ctx.ellipse(0, -length * 0.5, 3.5, length * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = reflection ? 'rgba(186, 230, 253, 0.2)' : 'rgba(186, 230, 253, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0.35, -length * 0.48, 1.2, length * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }
}
